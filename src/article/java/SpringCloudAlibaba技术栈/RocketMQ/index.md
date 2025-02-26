---
title: RocketMQ
category:
  - Java
tag:
  - SpringCloudAlibaba
---


RocketMQ 是阿里巴巴开源的一款高性能、高吞吐量的分布式消息队列，支持事务消息、顺序消息、延迟消息等复杂场景，广泛应用于分布式系统中。Spring Cloud Alibaba 提供了与 RocketMQ 的无缝集成，通过简单配置和注解即可实现生产者和消费者功能，使消息通信变得高效且易于维护。

本文将详细介绍如何通过 Spring Cloud Alibaba 集成 RocketMQ，以实现消息的发送和接收功能。
<!-- more -->

## 目录

1. [RocketMQ 简介](#1-rocketmq-简介)
2. [环境准备](#2-环境准备)
3. [添加依赖](#3-添加依赖)
4. [配置 RocketMQ](#4-配置-rocketmq)
5. [生产者实现](#5-生产者实现)
6. [消费者实现](#6-消费者实现)
7. [事务消息](#7-事务消息)
8. [总结](#8-总结)

---

## 1. RocketMQ 简介

### 核心特性

RocketMQ 提供了丰富的消息队列功能，包括：

- **高性能**：支持百万级消息的高吞吐量。
- **可靠性**：支持严格的消息投递保证（At Most Once、At Least Once、Exactly Once）。
- **可扩展性**：通过 Broker 集群扩展消息处理能力。
- **丰富的消息模式**：支持点对点（P2P）、发布/订阅（Pub/Sub）、延迟消息、事务消息等。

### 使用场景

RocketMQ 常被用于以下场景：

1. 异步解耦：实现系统间的松耦合。
2. 消息驱动架构：通过消息触发服务行为。
3. 大数据日志处理：海量数据的实时/离线处理。
4. 事务一致性：业务事务与消息发送的最终一致性。

---

## 2. 环境准备

在开始之前，请确保以下环境已安装：

- **JDK 1.8+**
- **Spring Boot 2.6+**
- **RocketMQ 服务端**（4.8.0+）

### 启动 RocketMQ 服务

1. 下载 RocketMQ（[下载地址](https://rocketmq.apache.org/)）。
2. 启动 NameServer：
   ```bash
   nohup sh bin/mqnamesrv &
   ```
3. 启动 Broker：
   ```bash
   nohup sh bin/mqbroker -n localhost:9876 --enable-proxy &
   ```
   默认的 NameServer 地址为 `localhost:9876`。

4. 检查 RocketMQ 是否启动成功：
   - 默认控制台地址：[http://localhost:8080](http://localhost:8080)

---

## 3. 添加依赖

在项目的 `pom.xml` 文件中添加 **Spring Cloud Alibaba RocketMQ** 的依赖：

```xml
<dependencies>
    <!-- Spring Cloud Alibaba RocketMQ -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-stream-rocketmq</artifactId>
    </dependency>
</dependencies>
```

---

## 4. 配置 RocketMQ

在 `application.yml` 文件中配置 RocketMQ 的基本连接信息：

```yaml
spring:
  application:
    name: rocketmq-demo # 应用名称
  cloud:
    rocketmq:
      name-server: localhost:9876 # RocketMQ NameServer 地址
      producer:
        group: demo-producer-group # 消息生产者的分组
      consumer:
        group: demo-consumer-group # 消息消费者的分组
```

- **name-server**：NameServer 地址，负责管理 RocketMQ Broker。
- **producer.group**：消息生产者组名。
- **consumer.group**：消息消费者组名。

---

## 5. 生产者实现

在 Spring Cloud Alibaba 中，消息生产者通过 `RocketMQTemplate` 快速实现消息发送。

### 5.1 编写生产者代码

创建 `MessageProducer` 类，使用 `RocketMQTemplate` 发送消息：

```java
import org.apache.rocketmq.spring.core.RocketMQTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessageProducer {

    @Autowired
    private RocketMQTemplate rocketMQTemplate;

    /**
     * 发送普通文本消息
     */
    public void sendSimpleMessage(String topic, String message) {
        rocketMQTemplate.convertAndSend(topic, message);
        System.out.println("Message sent: " + message);
    }

    /**
     * 发送对象消息
     */
    public void sendObjectMessage(String topic, CustomMessage customMessage) {
        rocketMQTemplate.convertAndSend(topic, customMessage);
        System.out.println("Message sent: " + customMessage);
    }
}
```

### 5.2 测试发送消息

在 Controller 中调用生产者发送消息：

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

    @Autowired
    private MessageProducer messageProducer;

    @GetMapping("/send")
    public String sendMessage(@RequestParam String message) {
        messageProducer.sendSimpleMessage("demo-topic", message);
        return "Message sent: " + message;
    }
}
```

访问以下地址测试消息发送：
```
http://localhost:8080/send?message=HelloRocketMQ
```

---

## 6. 消费者实现

消费者通过注解 `@RocketMQMessageListener` 来订阅消息。

### 6.1 编写消费者代码

创建 `MessageConsumer` 类，使用 `@RocketMQMessageListener` 注解指定监听的 `topic` 和 `consumerGroup`：

```java
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.stereotype.Component;

@Component
@RocketMQMessageListener(topic = "demo-topic", consumerGroup = "demo-consumer-group")
public class MessageConsumer implements RocketMQListener<String> {

    @Override
    public void onMessage(String message) {
        System.out.println("Received message: " + message);
    }
}
```

### 6.2 测试消息接收

当生产者发送消息到 `demo-topic` 时，消费者会输出以下日志：
```
Received message: HelloRocketMQ
```

---

## 7. 事务消息

RocketMQ 支持事务消息，用于保证业务操作与消息投递的一致性。

### 7.1 编写事务生产者

使用 `RocketMQTemplate` 的事务发送方法 `sendMessageInTransaction`：

```java
import org.apache.rocketmq.client.producer.SendResult;
import org.apache.rocketmq.spring.core.RocketMQTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TransactionProducer {

    @Autowired
    private RocketMQTemplate rocketMQTemplate;

    public void sendTransactionalMessage(String topic, String message) {
        SendResult sendResult = rocketMQTemplate.sendMessageInTransaction(topic, message, null);
        System.out.println("Transaction message sent: " + sendResult.getMsgId());
    }
}
```

### 7.2 处理事务消息的回查逻辑

实现 `RocketMQLocalTransactionListener` 接口处理本地事务逻辑和消息回查：

```java
import org.apache.rocketmq.client.producer.LocalTransactionState;
import org.apache.rocketmq.spring.annotation.RocketMQTransactionListener;

@RocketMQTransactionListener
public class TransactionListener implements RocketMQLocalTransactionListener {

    @Override
    public LocalTransactionState executeLocalTransaction(org.apache.rocketmq.common.message.Message message, Object arg) {
        // 执行本地事务逻辑
        System.out.println("Executing local transaction...");
        return LocalTransactionState.COMMIT_MESSAGE; // 提交事务
    }

    @Override
    public LocalTransactionState checkLocalTransaction(org.apache.rocketmq.common.message.Message message) {
        // RocketMQ 事务回查逻辑
        System.out.println("Checking local transaction...");
        return LocalTransactionState.COMMIT_MESSAGE; // 提交事务
    }
}
```

---

## 8. 总结

通过 Spring Cloud Alibaba 集成 RocketMQ，可以轻松实现以下功能：

1. **消息生产与消费**：基于 `RocketMQTemplate` 和 `@RocketMQMessageListener` 实现高效的消息生产和消费。
2. **事务消息**：保证业务操作与消息发送的一致性。
3. **分布式系统解耦**：支持服务间异步通信、限流削峰和日志处理。

RocketMQ 可以作为微服务的通信骨架，显著提升系统的可扩展性和异步处理能力。
