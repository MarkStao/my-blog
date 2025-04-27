---
title: Sentinel
category:
  - Java
tag:
  - SpringCloudAlibaba
---

在微服务架构中，实现分布式流量控制、熔断降级和保护系统稳定性是非常重要的。Sentinel 是阿里巴巴开源的一款流量控制和服务保护工具，Spring Cloud Alibaba 项目支持快速集成 Sentinel，使开发者能够更加便捷地进行资源保护。

本文将介绍如何使用 **Spring Cloud Alibaba** 集成和使用 Sentinel。
<!-- more -->

## 目录

1. [Sentinel 特性概览](#1-sentinel-特性概览)
2. [环境准备](#2-环境准备)
3. [集成步骤](#3-集成步骤)
    1. 引入依赖
    2. 配置 Sentinel 控制台
    3. Sentinel 注解限流与熔断
    4. 基于 Dashboard 的实时规则设置
4. [核心功能实现](#4-核心功能实现)
    1. 资源限流
    2. 服务熔断
    3. 系统保护
    4. 动态规则配置
5. [总结](#5-总结)

---

## 1. Sentinel 特性概览

**Sentinel** 提供以下核心功能：

- **流量控制**：基于 QPS（每秒并发量）、并发线程数、调用关系等维度限制流量。
- **熔断降级**：在服务出现高延迟、异常比例或下游不可用时启用快速失败机制。
- **系统保护**：根据系统整体资源情况（如 CPU 使用率、内存等）进行保护。
- **动态规则推送**：实时更新规则，配合 Dashboard 管理规则配置。

---

## 2. 环境准备

在开始前，请确保以下环境条件已经准备好：

- **JDK 1.8+**
- **Maven 或 Gradle**
- 一个基于 Spring Boot 的服务项目
- **Sentinel Dashboard**

### 下载与运行 Sentinel Dashboard

1. 前往 [Sentinel Releases](https://github.com/alibaba/Sentinel/releases) 下载最新的 `sentinel-dashboard-x.x.x.jar`。
2. 启动 Dashboard：
   ```bash
   java -Dserver.port=8858 -Dcsp.sentinel.dashboard.server=localhost:8858 \
   -Dproject.name=sentinel-dashboard -jar sentinel-dashboard-x.x.x.jar
   ```
3. 打开浏览器访问 Dashboard：[http://localhost:8858](http://localhost:8858)。
   - 默认账号和密码均为：`sentinel`。

---

## 3. 集成步骤

### 3.1 添加 Maven 依赖

在项目的 `pom.xml` 文件中添加以下依赖：

```xml
<dependencies>
    <!-- Spring Cloud Alibaba Sentinel Starter -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
        <version>2021.1</version>
    </dependency>
</dependencies>
```

### 3.2 配置 Sentinel 控制台

在 `application.properties` 或 `application.yml` 文件中，添加以下配置：

```properties
# Sentinel 控制台地址（Dashboard 地址）
spring.cloud.sentinel.transport.dashboard=localhost:8858

# 当前服务名称
spring.application.name=alibaba-sentinel-demo

# 是否启用 Sentinel 的过滤器
spring.cloud.sentinel.filter.enable=true
```

配置完成后，启动服务后可以在 Sentinel 控制台中查看到该服务是否注册。

---

### 3.3 注解方式实现限流与熔断

Spring Cloud Alibaba 支持通过 `@SentinelResource` 注解保护业务逻辑。

以下是一个接口限流的示例：

```java
package com.example.sentinel;

import com.alibaba.csp.sentinel.annotation.SentinelResource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    @SentinelResource(
        value = "helloResource",  // 资源名
        blockHandler = "handleBlock",  // 限流阻断时的处理方法
        fallback = "handleFallback"  // 熔断降级后的兜底方法
    )
    public String hello() {
        return "Hello, Sentinel!";
    }

    // 限流阻断的处理方法
    public String handleBlock() {
        return "Request has been blocked!";
    }

    // 熔断降级时的兜底方法
    public String handleFallback() {
        return "Service is temporarily unavailable, please try again later.";
    }
}
```

在该示例中：
- 当资源达到限流规则时，将调用 `handleBlock` 方法。
- 如果发生熔断降级，将返回 `handleFallback` 方法的响应。

---

### 3.4 配置限流规则（通过 Sentinel Dashboard）

通过 Sentinel 控制台，可动态配置资源限流规则和熔断规则。

1. 打开 Sentinel Dashboard，选择目标服务。
2. 进入 **流控规则** 页面，点击 **新增规则**。
3. 设置规则：
   - **资源名**：对应代码中的 `@SentinelResource` 的 `value`。
   - **限制类型**：QPS（每秒请求数）或者线程数。
   - **流控效果**：匀速排队、直接拒绝等。

配置完成后，该规则会立即生效。

---

## 4. 核心功能实现

### 4.1 资源限流

资源限流是 Sentinel 最基础的功能。可以基于以下维度进行限流：

- **QPS**：每秒请求超过阈值时触发限流。
- **线程数**：并发线程数超过阈值时触发限流。

动态设置限流规则：

```java
import com.alibaba.csp.sentinel.slots.block.flow.FlowRule;
import com.alibaba.csp.sentinel.slots.block.flow.FlowRuleManager;
import java.util.Collections;

public class SentinelInit {

    public void initFlowRules() {
        FlowRule rule = new FlowRule();
        rule.setResource("helloResource"); // 资源名
        rule.setGrade(1);                 // 限流类型：QPS
        rule.setCount(2);                 // 阈值：每秒 2 个请求

        FlowRuleManager.loadRules(Collections.singletonList(rule));
    }
}
```

规则一旦加载，即刻生效。

---

### 4.2 熔断降级

熔断降级适用于系统响应时间过长、异常比例过高等场景。

动态设置熔断规则：

```java
import com.alibaba.csp.sentinel.slots.block.degrade.DegradeRule;
import com.alibaba.csp.sentinel.slots.block.degrade.DegradeRuleManager;
import java.util.Collections;

public class SentinelDegrade {

    public void initDegradeRules() {
        DegradeRule rule = new DegradeRule();
        rule.setResource("helloResource");
        rule.setGrade(1);                 // 降级类型：RT（响应时间）
        rule.setCount(100);               // RT 单位（ms）
        rule.setTimeWindow(10);           // 降级时间 10 秒

        DegradeRuleManager.loadRules(Collections.singletonList(rule));
    }
}
```

---

### 4.3 系统保护

系统保护规则基于以下指标保护服务：

- **CPU 使用率**
- **入口 QPS**
- **线程数**

动态配置系统保护规则：

```java
import com.alibaba.csp.sentinel.slots.system.SystemRule;
import com.alibaba.csp.sentinel.slots.system.SystemRuleManager;
import java.util.Collections;

public class SentinelSystemRules {

    public void initSystemRules() {
        SystemRule rule = new SystemRule();
        rule.setQps(50); // 系统入口 QPS 不超过 50

        SystemRuleManager.loadRules(Collections.singletonList(rule));
    }
}
```

---

### 4.4 动态规则配置

Spring Cloud Alibaba 支持通过 Nacos 配置中心动态管理 Sentinel 规则。实现流程：

1. 在 `Sentinel Dashboard` 的 **规则管理->推送规则** 配置规则存储到 Nacos。
2. 配置 `application.properties` 指定 Nacos 连接：

```properties
spring.cloud.nacos.config.server-addr=localhost:8848
spring.cloud.sentinel.datasource.ds-type=nacos
spring.cloud.sentinel.datasource.ds-group=DEFAULT_GROUP
```

3. 在 Nacos 添加规则文件即可动态更新规则。

---

## 5. 总结

通过本文，我们使用 Spring Cloud Alibaba 集成了 Sentinel，并实现了资源的 **限流**、**熔断降级** 和 **系统保护**。利用 Sentinel Dashboard，可动态配置和监控微服务资源，进一步提升系统的稳定性。

Sentinel 是阿里巴巴为微服务架构提供的强大工具，希望通过本文的介绍，您能够快速集成和掌握 Sentinel，并在实际项目中提升服务的高可用性！
