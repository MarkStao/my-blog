---
title: Gateway
category:
  - Java
tag:
  - SpringCloudAlibaba
---

Spring Cloud Gateway 是基于 Spring WebFlux 构建的一款高效、功能强大的 API 网关，提供路由转发、请求处理、请求过滤、安全认证等功能，广泛应用于微服务架构中。Spring Cloud Alibaba 为 Gateway 提供了对 Nacos 的深度集成，使得网关可以轻松实现动态路由、服务发现等功能。

本文将介绍如何基于 **Spring Cloud Alibaba** 集成 Gateway，实现在微服务架构中的动态路由与服务网关功能。

<!-- more -->

## 目录

1. [Spring Cloud Gateway 简介](#1-spring-cloud-gateway-简介)
2. [环境准备](#2-环境准备)
3. [项目依赖与配置](#3-项目依赖与配置)
4. [动态路由与服务发现](#4-动态路由与服务发现)
5. [Gateway 过滤器实现](#5-gateway-过滤器实现)
6. [总结](#6-总结)

---

## 1. Spring Cloud Gateway 简介

Spring Cloud Gateway 是 Netflix Zuul 的继任者，它专注于提供轻量级、高性能的网关解决方案，优势包括：

- **基于 WebFlux 架构**：支持异步非阻塞的请求处理。
- **服务路由与分发**：支持路由到静态 URL 或通过服务注册中心动态路由服务。
- **丰富的过滤器支持**：提供全局/局部过滤能力，满足请求校验、数据转换、安全认证等应用场景。
- **动态路由更新支持**：配合 Nacos / Apollo 等配置中心，轻松实现动态配置能力。

---

## 2. 环境准备

在开始之前，请确保以下环境已经准备好：

- **JDK 1.8+**
- **Nacos Server**：用于动态路由配置与服务注册发现。
- **Spring Boot 2.6+**：开发基础项目。
- **Maven 编译环境**。

### 启动 Nacos Server

1. 下载 [Nacos Server](https://github.com/alibaba/nacos/releases)。
2. 启动 Nacos 单机模式：
   ```bash
   startup.cmd -m standalone  # Windows
   ./startup.sh -m standalone # Linux/macOS
   ```
3. 默认访问地址：[http://localhost:8848](http://localhost:8848)。

---

## 3. 项目依赖与配置

### 3.1 添加依赖

在 `pom.xml` 文件中添加以下依赖：

```xml
<dependencies>
    <!-- Spring Cloud Gateway -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    <!-- Spring Cloud Alibaba Nacos Discovery -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
</dependencies>
```

### 3.2 配置 Gateway 服务

在 `application.yml` 中配置基本信息：

```yaml
server:
  port: 9000 # Gateway 运行端口

spring:
  application:
    name: gateway-service # 服务名称
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 # Nacos 服务的地址
    gateway:
      discovery:
        locator:
          enabled: true # 开启基于服务发现的动态路由
      routes:
        - id: example-route # 自定义路由配置
          uri: http://httpbin.org:80
          predicates:
            - Path=/get
          filters:
            - AddRequestHeader=Hello,World
```

以上配置完成后：

- Gateway 将会自动注册到 Nacos。
- 启用了基于 Nacos 的动态路由，允许通过服务发现动态更新路由。

---

## 4. 动态路由与服务发现

### 4.1 配置动态路由数据源

通过 Nacos，可动态维护路由配置，从而实现网关规则的实时更新。

1. **新增 Nacos 配置：**
   登录 Nacos 控制台，创建一个路由配置数据：
   - 配置 ID：`gateway-route-config.json`
   - 配置内容（JSON 格式，例如动态路由规则）：
     ```json
     [
       {
         "id": "service-route",
         "uri": "lb://demo-service",   // 指定目标微服务
         "predicates": [               // 路由条件
           {
             "name": "Path",
             "args": {
               "pattern": "/service/**"  // 匹配路径
             }
           }
         ],
         "filters": [                  // 过滤规则
           {
             "name": "StripPrefix",
             "args": {
               "_genkey_0": "1"         // 去掉前缀 /service
             }
           }
         ]
       }
     ]
     ```

2. **修改 `application.yml` 指定动态路由数据源：**
   ```yaml
   spring:
     cloud:
       gateway:
         nacos:
           config:
             data-id: gateway-route-config.json
             group: DEFAULT_GROUP
   ```

3. 启用 DynamicRouteService，将配置加载到网关中运行。

此时，**Nacos 控制台更新路由配置后无需重启网关服务**，路由规则会实时生效。

---

### 4.2 基于服务发现的路由

在某些场景下，我们无需手动配置路由规则，仅需通过服务名实现动态路由：

1. 通过以下配置启用动态路由发现：
   ```yaml
   spring:
     cloud:
       gateway:
         discovery:
           locator:
             enabled: true  # 启用服务发现
             lower-case-service-id: true # 将服务名统一为小写
   ```

2. 服务间请求示例：
   假设微服务 `demo-service` 中提供了一个 `/hello` 的接口，则通过以下 URL 可以直接访问：
   ```
   http://localhost:9000/demo-service/hello
   ```

   Gateway 会根据服务名转发请求到注册中心找到的服务实例。

---

## 5. Gateway 过滤器实现

Spring Cloud Gateway 提供了丰富的 **过滤器** 用于实现业务逻辑和请求处理，分为全局过滤器和局部过滤器。

### 5.1 局部过滤器

局部过滤器作用于指定路由规则。例如，添加自定义请求头：

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: custom-filter-route
          uri: lb://demo-service
          predicates:
            - Path=/custom/**     # 匹配路由
          filters:
            - AddRequestParameter=myParam,myValue # 添加请求参数
```

最终请求时，Gateway 会自动在 URL 后追加 `?myParam=myValue`。

---

### 5.2 全局过滤器（GlobalFilter）

全局过滤器作用于所有路由，可实现统一的请求拦截和处理。

示例：定义一个日志记录过滤器：

```java
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
@Order(0) // 定义过滤器的优先级
public class LoggingFilter implements GlobalFilter {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        System.out.println("Global Filter - Request Path: " + exchange.getRequest().getPath());
        return chain.filter(exchange); // 放行请求
    }
}
```

注册后，每次请求都会打印出当前的访问路径。

---

## 6. 总结

通过 Spring Cloud Alibaba 集成 Spring Cloud Gateway，可以轻松构建一个高效网关系统，并提供以下能力：

1. **动态路由**：配合 Nacos 动态维护和更新路由规则。
2. **服务发现**：直接基于服务名实现自动路由，无需手动修改。
3. **请求过滤**：支持全局或局部过滤器，实现请求拦截、修改、日志记录等功能。

Spring Cloud Gateway 是现代微服务架构下不可或缺的核心组件，通过灵活的扩展能力和丰富的配置选项，可以为你的微服务系统提供更高的可用性和可维护性。
