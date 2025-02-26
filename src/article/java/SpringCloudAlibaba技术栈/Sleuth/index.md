---
title: Sleuth
category:
  - Java
tag:
  - SpringCloudAlibaba
---

在分布式系统中，微服务之间的调用链路可能非常复杂。为了更好地监控和追踪请求链路，Spring Cloud 提供了分布式 tracing（分布式链路追踪）组件 Sleuth。它主要用于生成唯一的追踪 ID，记录服务间调用关系，为性能监控和问题排查提供强有力的支持。

Spring Cloud Alibaba 通过与 Spring Cloud Sleuth 的整合，可以方便地实现服务链路追踪，并与 Zipkin 或 SkyWalking 等工具配合使用，轻松实现跨服务的链路跟踪。

<!-- more -->

## 目录

1. [什么是 Spring Cloud Sleuth](#1-什么是-spring-cloud-sleuth)
2. [环境准备](#2-环境准备)
3. [项目依赖与配置](#3-项目依赖与配置)
4. [链路追踪实现](#4-链路追踪实现)
5. [与 Zipkin 集成](#5-与-zipkin-集成)
6. [总结](#6-总结)

---

## 1. 什么是 Spring Cloud Sleuth

Spring Cloud Sleuth 是 Spring Cloud 的分布式跟踪解决方案，它会在微服务调用的每个请求中添加唯一的 **Trace ID** 和 **Span ID**：

- **Trace ID**：贯穿整个分布式请求链路的唯一标识，用于标识一条完整的链路。
- **Span ID**：表示链路中每个微服务之间的一个调用单元，用于标识链路中的每一段通信。

通过 Sleuth，能够方便地追踪一条请求经过的服务路径、调用耗时，直观找到性能瓶颈或错误节点。

---

## 2. 环境准备

在开始之前，请确保以下环境和工具已安装：

- **JDK 1.8+**
- **Spring Boot 2.6+**（环境支持 Spring Cloud）。
- （可选）**Zipkin Server** 或 **SkyWalking** 系统，用于保存和检索链路数据。

---

## 3. 项目依赖与配置

### 3.1 添加必要的依赖

在微服务项目的 `pom.xml` 文件中添加如下依赖：

```xml
<dependencies>
    <!-- Spring Cloud Sleuth -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-sleuth</artifactId>
    </dependency>
    <!-- Spring Cloud Alibaba Nacos Discovery -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
    <!-- Optional: Spring Cloud Sleuth Zipkin 集成 -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-sleuth-zipkin</artifactId>
    </dependency>
</dependencies>
```

### 3.2 配置 Nacos 服务发现

在 `application.yml` 文件中，配置 Nacos 服务注册和发现功能：

```yaml
spring:
  application:
    name: sleuth-test-service # 当前微服务名称
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 # Nacos 服务地址
  sleuth:
    sampler:
      probability: 1.0 # 设置 Sleuth 采样概率，1.0 表示全部采样
```

这里设置 **Sampler 的采样率为 100%**，以便每个请求都生成追踪数据。

---

## 4. 链路追踪实现

### 4.1 使用 RestTemplate 进行服务调用链路追踪

定义一个 `RestTemplate`，并通过 `@LoadBalanced` 支持负载均衡：

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

在接口 Controller 中调用下游微服务：

```java
@RestController
@RequestMapping("/api")
public class ApiController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/call-other")
    public String callOtherService() {
        // 使用服务名调用下游服务，自动携带 TraceID 和 SpanID
        return restTemplate.getForObject("http://other-service/api/response", String.class);
    }
}
```

### 4.2 自动携带链路信息

在两台微服务之间的调用过程中，Sleuth 会自动携带 **Trace ID** 和 **Span ID**。比如，当 `sleuth-test-service` 调用 `other-service` 时，日志中会自动输出类似以下内容：

- **sleuth-test-service（上游服务）**：
  ```
  [TRACE_ID:1234567890ABCDEF, SPAN_ID:789ABC] ---> 调用服务：http://other-service/api/response
  ```

- **other-service（下游服务）**：
  ```
  [TRACE_ID:1234567890ABCDEF, SPAN_ID:456DEF] ---> 接收来自 sleuth-test-service 的请求
  ```

通过 Trace 和 Span ID，可以轻松定位请求在多个服务中的耗时分布。

---

## 5. 与 Zipkin 集成

### 5.1 什么是 Zipkin

[Zipkin](https://zipkin.io/) 是一款强大的分布式追踪工具，可以存储和展示链路追踪数据，分析服务调用链路，定位性能瓶颈。Sleuth 可以将生成的追踪数据发送到 Zipkin Server 进行存储和展示。

### 5.2 启动 Zipkin Server

1. 下载并运行 Zipkin Server：
   ```bash
   curl -sSL https://zipkin.io/quickstart.sh | bash -s
   java -jar zipkin.jar
   ```

2. 默认访问地址：[http://localhost:9411](http://localhost:9411)

### 5.3 配置 Sleuth 集成 Zipkin

修改项目中的 `application.yml` 文件，添加 Zipkin 配置：

```yaml
spring:
  sleuth:
    sampler:
      probability: 1.0 # 采样率设为100%，便于调试
    zipkin:
      base-url: http://localhost:9411 # Zipkin Server 地址
  zipkin:
    sender:
      type: web
```

此时，Sleuth 会将链路信息发送到 Zipkin Server，可以通过 Zipkin 的 UI 界面浏览具体的链路信息。

---

## 6. 总结

通过 Spring Cloud Sleuth 和 Spring Cloud Alibaba 的结合，我们实现了分布式链路追踪的以下能力：

- **自动分配 Trace ID 和 Span ID**：在微服务调用中携带唯一标识，精确定位请求链路。
- **可视化分析**：结合 Zipkin，可以清晰地展示请求流、服务调用链路和耗时信息。
- **调用链路无侵入性**：无需手动添加链路上下文，Sleuth 自动生成并传递链路信息。

在现代微服务架构中，链路追踪对于定位性能瓶颈和故障排查非常重要，Sleuth 提供了开箱即用的解决方案，结合 Zipkin 等工具可进一步增强可观测性。
