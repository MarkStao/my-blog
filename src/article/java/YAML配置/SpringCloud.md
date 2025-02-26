---
title: Spring Cloud YAML配置
category:
  - Java
tag:
  - YAML
---


Spring Cloud 是基于 Spring Boot 的微服务开发框架，提供了服务注册与发现、配置中心、负载均衡、断路器、API 网关、分布式消息等功能。本文将详细介绍 Spring Cloud 全量 YAML 配置，以及其常用的组件和说明。

<!-- more -->

## 目录

1. [Spring Cloud 配置基础](#1-spring-cloud-配置基础)
2. [Eureka 配置](#2-eureka-配置)
3. [Config Server 配置](#3-config-server-配置)
4. [Ribbon 配置](#4-ribbon-配置)
5. [Feign 配置](#5-feign-配置)
6. [Hystrix 配置](#6-hystrix-配置)
7. [Zuul (Spring Cloud Gateway) 配置](#7-zuul-spring-cloud-gateway-配置)
8. [Sleuth 配置](#8-sleuth-配置)
9. [Bus 配置](#9-bus-配置)
10. [Consul 配置](#10-consul-配置)
11. [Security 与 OAuth2 配置](#11-security-与-oauth2-配置)
12. [完整示例](#12-完整示例)
13. [总结](#13-总结)

---

## 1. Spring Cloud 配置基础

Spring Cloud 通常会基于 Spring Boot 的 `application.yml` 配置文件，并使用 `spring.profiles.active` 控制不同的环境配置。微服务的核心组件如服务注册中心、配置中心、断路器等，都通过 `application.yml` 进行配置。

### 基本结构
```yaml
spring:
  application:
    name: service-name          # 微服务的名称，用于注册到注册中心
  cloud:
    discovery:
      enabled: true             # 开启服务发现功能
  profiles:
    active: dev                 # 激活的配置环境
```
---

## 2. Eureka 配置

Eureka 是 Spring Cloud 的服务注册与发现组件，包括 Eureka Server 和 Eureka Client。

### 服务端配置（Eureka Server）
```yaml
spring:
  application:
    name: eureka-server
server:
  port: 8761
eureka:
  instance:
    hostname: localhost                  # 当前 Eureka Server 主机名
  client:
    register-with-eureka: false          # 表示自己不注册到 Eureka
    fetch-registry: false                # 禁止注册表同步
  server:
    wait-time-in-ms-when-sync-empty: 0   # Eureka 启动时的同步等待时间
```

### 客户端配置（Eureka Client）
```yaml
spring:
  application:
    name: service-name
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/  # 注册中心地址
    fetch-registry: true                          # 是否从 Eureka 拉取注册信息
    register-with-eureka: true                   # 是否将服务注册到 Eureka
```

---

## 3. Config Server 配置

Config Server 是 Spring Cloud 的配置中心，支持从 Git、SVN、文件系统中读取配置。

### Config Server (服务端) 配置
```yaml
spring:
  application:
    name: config-server
  cloud:
    config:
      server:
        git:
          uri: https://github.com/example/config-repo # Git 仓库地址
          search-paths:
            - microservices                          # 指定配置文件路径
server:
  port: 8888
```

### Config Client (客户端) 配置
```yaml
spring:
  application:
    name: config-client
  cloud:
    config:
      uri: http://localhost:8888                     # 指定 Config Server 地址
```

---

## 4. Ribbon 配置

Ribbon 是 Spring Cloud 的客户端负载均衡工具。

```yaml
spring:
  application:
    name: client-service
  cloud:
    loadbalancer:
      retry:
        enabled: true                                # 开启客户端负载均衡的重试功能
```

自定义 Ribbon 配置：
```yaml
client-service:
  ribbon:
    NFLoadBalancerRuleClassName:         # 自定义负载均衡规则
      com.netflix.loadbalancer.RandomRule
    ConnectTimeout: 2000                 # 连接超时时间
    ReadTimeout: 5000                    # 响应超时时间
```

---

## 5. Feign 配置

Feign 是基于 Ribbon 和 Hystrix 的声明式服务调用工具。

```yaml
feign:
  client:
    config:
      default:
        connectTimeout: 5000             # 全局连接超时
        readTimeout: 5000                # 全局响应超时
```

常用配置：
- 配置超时时间
- 开启日志：
```yaml
logging:
  level:
    feign: debug
```

---

## 6. Hystrix 配置

Hystrix 是断路器组件，保护微服务在高并发场景下的稳定性。

```yaml
hystrix:
  command:
    default:
      execution:
        isolation:
          strategy: THREAD               # 隔离模式，可选 THREAD/SEMAPHORE
          thread:
            timeoutInMilliseconds: 5000  # 线程隔离的超时时间
```

常用配置：
- `hystrix.command.default.execution.isolation.thread.timeoutInMilliseconds`: 线程超时时间。
- `hystrix.command.default.circuitBreaker.enabled`: 开启断路器。

---

## 7. Zuul (Spring Cloud Gateway) 配置

### Zuul 配置
Zuul 是 Spring Cloud 的 API 网关工具。
```yaml
zuul:
  routes:
    service-a:
      path: /service-a/**
      url: http://localhost:8081        # 将请求转发到指定微服务
```

### Spring Cloud Gateway 配置
建议使用剪接的 `spring-cloud-gateway` 替代 Zuul。
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: service-route
          uri: http://localhost:8081    # 服务 URI
          predicates:
            - Path=/service-a/**        # 路由匹配规则
```

---

## 8. Sleuth 配置

Sleuth 是 Spring Cloud 的分布式链路追踪工具，默认整合 Zipkin。

```yaml
spring:
  sleuth:
    sampler:
      probability: 1.0                  # 追踪采样率，1.0 表示 100% 记录
    web:
      enabled: true                     # 支持 Web
```

---

## 9. Bus 配置

Bus 是用于分布式消息传递的工具，常用于同步配置。

```yaml
spring:
  cloud:
    bus:
      enabled: true                      # 开启消息总线
    stream:
      kafka:
        binder:
          brokers: localhost:9092        # Kafka 地址
```

---

## 10. Consul 配置

Spring Cloud 支持使用 Consul 作为服务的注册与发现组件。

```yaml
spring:
  cloud:
    consul:
      host: localhost
      port: 8500
      discovery:
        health-check-interval: 10s       # 健康检查间隔
```

---

## 11. Security 与 OAuth2 配置

Spring Cloud 提供了对 Security 和 OAuth2 的支持。

```yaml
spring:
  security:
    oauth2:
      client:
        provider:
          demo-provider:
            authorization-uri: https://auth-server.com/oauth/authorize
            token-uri: https://auth-server.com/oauth/token
        registration:
          demo-client:
            client-id: demo-client-id
            client-secret: demo-secret
```

---

## 12. 完整示例

以下为一个综合的 `application.yml` 示例，结合 Eureka、Config、Ribbon 等组件：

```yaml
spring:
  application:
    name: microservice
  profiles:
    active: dev
  cloud:
    config:
      uri: http://localhost:8888
    discovery:
      enabled: true

eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
  instance:
    prefer-ip-address: true             # 注册到 Eureka 时使用 IP

logging:
  level:
    root: info
    com.example: debug

server:
  port: 8080

feign:
  client:
    config:
      default:
        connectTimeout: 5000
        readTimeout: 5000

hystrix:
  command:
    default:
      execution:
        isolation:
          thread:
            timeoutInMilliseconds: 5000
```

---

## 13. 总结

本文详细介绍了 Spring Cloud 中各组件的 YAML 配置，包括服务注册、负载均衡、断路器、配置中心、网关、分布式链路追踪等。实际开发中，可以根据业务需求，灵活组合配置项以实现完整的微服务架构。

通过对组件的深入理解和配置，可以更高效地开发、部署和管理微服务应用。
