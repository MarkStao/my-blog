---
title: Nacos
category:
  - Java
tag:
  - SpringCloudAlibaba
---

Nacos 是阿里巴巴推出的一款用于服务发现、配置管理和服务治理的开源平台。在微服务架构中，Nacos 是 Spring Cloud Alibaba 的核心组件之一，致力于帮助开发者高效地实现动态配置和服务发现。

本文将介绍如何通过 Spring Cloud Alibaba 集成 Nacos，完成服务注册、发现和配置管理的实现。
<!-- more -->

## 目录

1. [什么是 Nacos](#1-什么是-nacos)
2. [环境准备](#2-环境准备)
3. [服务注册与发现](#3-服务注册与发现)
4. [配置中心](#4-配置中心)
5. [动态刷新配置](#5-动态刷新配置)
6. [总结](#6-总结)

---

## 1. 什么是 Nacos

### 核心功能

Nacos 提供以下核心功能：

- **服务注册与发现**：支持基于 HTTP 和 DNS 的服务发现，轻松实现负载均衡与故障转移。
- **动态配置管理**：集中管理微服务配置，并支持配置的实时更新。
- **服务元数据和可视化**：通过 Web 控制台，方便地管理和监控服务。
- **支持多种服务治理模式**：如动态路由、限流降级等。

---

## 2. 环境准备

在开始之前，请确保以下环境已经准备好：

- **JDK 1.8+**
- **Spring Boot 应用**
- 下载并启动 **Nacos Server**。

### 2.1 下载与启动 Nacos

1. 前往 [Nacos Github](https://github.com/alibaba/nacos/releases) 下载最新版本的 Nacos Server。
2. 解压后，在 `bin` 目录使用以下命令启动 Nacos Server：
   - **单机模式**：
     ```bash
     startup.cmd -m standalone  # Windows
     startup.sh -m standalone   # Linux/macOS
     ```
3. 启动后，访问控制台：[http://localhost:8848](http://localhost:8848)。

> 默认账号和密码为：`nacos` / `nacos`。

---

## 3. 服务注册与发现

Nacos 提供了完整的服务注册和发现功能。接下来，我们通过 Spring Cloud Alibaba 演示如何实现 **服务自动注册** 和 **发现其他服务**。

### 3.1 添加依赖

在 Spring Boot 项目的 `pom.xml` 中添加依赖：

```xml
<dependencies>
    <!-- Spring Cloud Alibaba Nacos Discovery 依赖 -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        <version>2021.1</version> <!-- 请根据实际情况填写版本 -->
    </dependency>
</dependencies>
```

### 3.2 配置 `application.yml`

配置 Nacos 服务注册信息和服务名称：

```yaml
server:
  port: 8080

spring:
  application:
    name: demo-nacos-service # 当前服务名称
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 # Nacos 服务地址
```

### 3.3 启用服务注册与发现

在应用主类上添加 `@EnableDiscoveryClient` 注解，启用服务发现的能力：

```java
package com.example.nacosdemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class NacosDiscoveryApplication {
    public static void main(String[] args) {
        SpringApplication.run(NacosDiscoveryApplication.class, args);
    }
}
```

### 3.4 服务调用

通过 RestTemplate 或 Feign 进行服务间调用：

#### RestTemplate 调用服务

定义 RestTemplate，并启用负载均衡：

```java
@Configuration
public class RestTemplateConfig {

    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

在 Controller 中使用服务名调用其他服务：

```java
@RestController
@RequestMapping("/service")
public class TestController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/call")
    public String callOtherService() {
        // 调用其他服务，通过服务名即可
        String result = restTemplate.getForObject("http://another-service/hello", String.class);
        return "Response from another service: " + result;
    }
}
```

---

## 4. 配置中心

### 4.1 添加依赖

在项目中添加 **Nacos Config** 依赖：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    <version>2021.1</version>
</dependency>
```

### 4.2 配置 Nacos 数据源

在 `application.yml` 中，添加以下配置：

```yaml
spring:
  application:
    name: demo-nacos-config  # 服务名称，也用作配置文件的Data ID
  cloud:
    nacos:
      config:
        server-addr: localhost:8848 # Nacos 服务地址
```

### 4.3 在 Nacos 控制台中新增配置

1. 登录 Nacos 控制台：[http://localhost:8848](http://localhost:8848)。
2. 进入 **配置管理 -> 配置列表**，点击 **新增配置**。
3. 填写以下内容：
   - **Data ID**：`${spring.application.name}.yaml` （例：`demo-nacos-config.yaml`）
   - **Group**：默认 `DEFAULT_GROUP`
   - **配置格式**：`YAML`
   - **内容**：
     ```yaml
     app:
       message: Hello, Nacos Config!
     ```
4. 点击发布。

### 4.4 动态获取配置

通过 `@Value` 注解读取配置：

```java
@RestController
@RequestMapping("/config")
public class ConfigController {

    @Value("${app.message}")
    private String message;

    @GetMapping("/message")
    public String getMessage() {
        return "Nacos Config Message: " + message;
    }
}
```

访问 `/config/message` 接口，返回配置中心的值。

---

## 5. 动态刷新配置

要实现配置的动态刷新，需要启用 **Spring Cloud 的配置刷新机制**。

### 5.1 启用 RefreshScope

在主类或者需要动态刷新的 Bean 中，添加 `@RefreshScope`：

```java
@RestController
@RequestMapping("/config")
@RefreshScope
public class ConfigController {

    @Value("${app.message}")
    private String message;

    @GetMapping("/message")
    public String getMessage() {
        return "Nacos Config Message: " + message;
    }
}
```

### 5.2 手动刷新触发

1. 修改 Nacos 配置项内容并发布。
2. 调用 `/actuator/refresh` 接口触发动态刷新：
   - 首先确保开启 Actuator：
     ```yaml
     management:
       endpoints:
         web:
           exposure:
             include: "*"
     ```
   - 使用工具（如 Postman）发起 POST 请求：
     ```
     POST http://localhost:8080/actuator/refresh
     ```
3. 刷新完成后，再次调用 `/config/message` 查看更新后的值。

---

## 6. 总结

通过以上步骤，我们使用 **Spring Cloud Alibaba** 成功集成了 **Nacos**，实现了以下功能：

1. **服务注册和发现**：通过 Nacos 自动注册服务，并通过服务名进行访问。
2. **配置中心**：使用 Nacos 配置管理实现集中化管理，支持多环境。
3. **动态刷新配置**：实现实时更新配置，避免服务重启参与新版配置的生效。

通过 Nacos 的集成，可以显著提高微服务架构的开发效率和维护成本，成为现代微服务体系的重要基础设施工具。
