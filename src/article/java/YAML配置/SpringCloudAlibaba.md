---
title: Spring Cloud Alibaba YAML配置
category:
  - Java
tag:
  - YAML
---


Spring Cloud Alibaba 是一套基于 Spring Boot 及 Spring Cloud 的微服务框架，提供了阿里巴巴生态集成的工具与组件，例如 Nacos、Sentinel、RocketMQ、Dubbo 等。本文详细介绍 Spring Cloud Alibaba 的常用 YAML 配置及其说明，帮助开发者快速掌握开发技巧。

<!-- more -->

## 目录

1. [Spring Cloud Alibaba 基础配置](#1-spring-cloud-alibaba-基础配置)
2. [Nacos 配置](#2-nacos-配置)
3. [Sentinel 配置](#3-sentinel-配置)
4. [Seata 配置](#4-seata-配置)
5. [RocketMQ 配置](#5-rocketmq-配置)
6. [Dubbo 配置](#6-dubbo-配置)
7. [Alibaba Cloud OSS 配置](#7-alibaba-cloud-oss-配置)
8. [完整配置示例](#8-完整配置示例)
9. [总结](#9-总结)

---

## 1. Spring Cloud Alibaba 基础配置

Spring Cloud Alibaba 的所有模块基于 Spring Boot 和 Spring Cloud，可以按照以下常用结构定义基本配置。

```yaml
spring:
  application:
    name: alibaba-service               # 微服务名称
  main:
    allow-bean-definition-overriding: true
  profiles:
    active: dev                         # 环境切换
```

---

## 2. Nacos 配置

Nacos 是一个服务发现、注册及配置管理的开源工具。

### Nacos 服务注册与发现配置
```yaml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848    # Nacos 服务地址
        namespace: public              # 配置命名空间，默认是 public
        metadata:
          version: v1.0                # 可以添加端点元数据
    loadbalancer:
      enabled: true                    # 开启负载均衡
```

### Nacos 配置管理
```yaml
spring:
  cloud:
    nacos:
      config:
        server-addr: localhost:8848    # Nacos 配置中心地址
        namespace: public              # 配置命名空间
        file-extension: yaml           # 配置文件的格式（properties 或 yaml）
        group: DEFAULT_GROUP           # 配置组名
        shared-configs:
          - data-id: application-shared.yml  # 公共配置
            refresh: true                   # 是否允许动态刷新
        extension-configs:
          - data-id: service-config.yaml
            refresh: true
```

**关键参数说明**：
- `server-addr`: Nacos 服务地址，格式为 `ip:port`。
- `namespace`: 用于分隔不同环境或项目的配置。
- `file-extension`: 支持多种文件格式，如 `yaml`、`properties`。
- `shared-configs`: 定义共享配置，可被多个服务使用。

---

## 3. Sentinel 配置

Sentinel 是阿里巴巴提供的高可用防护组件，支持流量控制、熔断降级等功能。

### Sentinel 基础配置
```yaml
spring:
  cloud:
    sentinel:
      transport:
        dashboard: localhost:8080      # 指定 Sentinel Dashboard 地址
        port: 8719                     # 客户端通信端口
      enabled: true                    # 是否启用 Sentinel
      eager: true                      # 提前加载 Sentinel 配置
```

### Sentinel Dashboard 配置规则
通过 Nacos 或文件来管理规则：
```yaml
spring.cloud.sentinel.datasource:
  flow-rule:
    nacos:
      server-addr: localhost:8848
      data-id: sentinel-flow-rules   # 流控规则
      group-id: DEFAULT_GROUP        # Nacos Group
      rule-type: flow                # 流控类型
  degrade-rule:
    file:
      file: sentinel-degrade.json   # 降级规则
      rule-type: degrade            # 降级类型
```

---

## 4. Seata 配置

Seata 是一款分布式事务中间件，解决跨服务事务一致性问题。

### Seata 配置中心和事务管理
```yaml
seata:
  enabled: true                       # 是否启用 Seata
  application-id: seata-service       # Seata 应用 ID，需与服务名匹配
  tx-service-group: my_tx_group       # 分布式事务组名称

spring:
  cloud:
    alibaba:
      seata:
        tx-service-group: my_tx_group # 分布式事务组名称
```

### Seata 存储模式配置
使用 Nacos 作为存储方案：
```yaml
seata:
  config:
    type: nacos
    nacos:
      server-addr: localhost:8848     # Nacos 地址
      group: SEATA_GROUP
      namespace: public
```

---

## 5. RocketMQ 配置

RocketMQ 是阿里巴巴开源的分布式消息中间件。

### RocketMQ 基础配置
```yaml
spring:
  rocketmq:
    name-server: localhost:9876      # RocketMQ NameServer 地址
    producer:
      group: producer-group          # 生产者组
    consumer:
      group: consumer-group          # 消费者组
      topic: test-topic              # 要订阅的主题
```

### 使用消息过滤
```yaml
spring:
  rocketmq:
    consumer:
      tags: "tag1 || tag2"           # 消费带有特定标签的消息
```

---

## 6. Dubbo 配置

Dubbo 是一个开源的高性能服务框架，专注于 RPC（远程服务调用）。

### Dubbo 服务提供者配置
```yaml
dubbo:
  application:
    name: dubbo-provider
  registry:
    address: nacos://localhost:8848  # 使用 Nacos 注册中心
  protocol:
    name: dubbo                      # 使用 Dubbo 协议
    port: 20880                      # Dubbo 协议服务端口号
  provider:
    timeout: 3000                    # 服务超时时间
```

### Dubbo 服务消费者配置
```yaml
dubbo:
  application:
    name: dubbo-consumer
  registry:
    address: nacos://localhost:8848
  consumer:
    check: false                     # 消费者启动时不检查服务提供者
    timeout: 5000                    # 消费者调用超时时间
```

---

## 7. Alibaba Cloud OSS 配置

OSS（Object Storage Service）是阿里云提供的对象存储服务。

```yaml
spring:
  cloud:
    alibaba:
      oss:
        endpoint: oss-cn-shanghai.aliyuncs.com    # OSS 服务端点
        access-key: your-access-key              # 阿里云 AccessKey ID
        secret-key: your-secret-key              # 阿里云 AccessKey Secret
        bucket-name: example-bucket              # OSS 存储桶名称
```

---

## 8. 完整配置示例

结合上述配置，以下是一个典型的 `application.yml` 示例：
```yaml
spring:
  application:
    name: alibaba-demo
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
      config:
        server-addr: localhost:8848
        namespace: public
        file-extension: yaml

    sentinel:
      transport:
        dashboard: localhost:8080
      eager: true

    alibaba:
      seata:
        tx-service-group: demo_tx_group

  rocketmq:
    name-server: localhost:9876
    producer:
      group: producer-group

dubbo:
  application:
    name: dubbo-service
  registry:
    address: nacos://localhost:8848
  protocol:
    name: dubbo
    port: 20880

seata:
  enabled: true
  application-id: demo-service
  tx-service-group: demo_tx_group
  config:
    type: nacos
    nacos:
      server-addr: localhost:8848
      namespace: public
      group: SEATA_GROUP
```

---

## 9. 总结

Spring Cloud Alibaba 提供了完整的分布式操作支持，用户可以通过简单的配置来实现服务的注册与发现、分布式配置、流量控制、分布式事务、消息中间件等功能。在微服务架构中，灵活组合这些配置项，可以快速构建企业级解决方案。

通过本文介绍的全量配置，开发者可以快速掌握 Spring Cloud Alibaba 各组件的核心功能，为后续的高效开发和运维奠定基础。
