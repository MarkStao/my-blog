---
title: Kafka集成
category:
  - Java
tag:
  - SpringBoot
  - Kafka
---

Apache Kafka 是一个分布式流处理平台，主要用于构建实时数据管道和流式应用程序。作为一个高性能、分布式的消息队列系统，Kafka 是微服务架构中常用的基础组件之一。

本文将介绍如何通过 Spring Boot 集成 Kafka，包括生产者、消费者、主题管理、消息序列化以及高级功能等完整内容。
<!-- more -->

## 目录

1. [什么是 Kafka](#1-什么是-kafka)
2. [环境准备](#2-环境准备)
3. [Kafka 集成 Spring Boot](#3-kafka-集成-spring-boot)
4. [生产者开发](#4-生产者开发)
5. [消费者开发](#5-消费者开发)
6. [Kafka 高级功能](#6-kafka-高级功能)
7. [总结](#7-总结)

---

## 1. 什么是 Kafka

Apache Kafka 是一个分布式事件流平台，具备以下核心功能：

- **消息队列**：实现发布与订阅模式，支持消息存储和持久化。
- **实时处理**：处理流式数据并进行实时分析。
- **高吞吐和扩展性**：支持大规模数据和水平扩展。
- **可靠性**：数据持久化存储，并支持分区副本确保数据安全。

在微服务架构中，Kafka 通常用作事件总线、中间件或数据传输管道，适用于以下场景：

- 日志收集与分析
- 流数据处理
- 数据同步与集成
- 微服务间异步通信

---

## 2. 环境准备

在开始之前，请确保以下环境已经准备好：

1. **Kafka 环境**
   - 成功安装 Kafka 服务器。可以在 [Kafka 官方下载页面](https://kafka.apache.org/downloads) 获取正确版本。
   - 启动 Kafka 和 Zookeeper 服务：

     ```bash
     # 启动 Zookeeper
     bin/zookeeper-server-start.sh config/zookeeper.properties

     # 启动 Kafka 服务
     bin/kafka-server-start.sh config/server.properties
     ```

2. **Spring Boot 项目**
   - 确保已安装 Maven 或 Gradle，并新建一个 Spring Boot 项目。

---

## 3. Kafka 集成 Spring Boot

### 3.1 添加依赖

在项目的 `pom.xml` 中添加以下依赖：

```xml
<dependencies>
    <!-- Kafka 依赖 -->
    <dependency>
        <groupId>org.springframework.kafka</groupId>
        <artifactId>spring-kafka</artifactId>
    </dependency>
</dependencies>
```

### 3.2 配置 Kafka 连接

在 `application.yml` 中配置 Kafka 的基本连接信息：

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092 # Kafka 服务器地址
    consumer:
      group-id: test-group # 消费者组 ID
      auto-offset-reset: earliest # 加载偏移策略（从最早开始消费）
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
      properties:
        linger.ms: 1 # 消息延时发送时间
    template:
      default-topic: test-topic # 默认主题名称
```

---

## 4. 生产者开发

通过 Spring Kafka，你可以使用 KafkaTemplate 来发送消息。

### 4.1 定义生产者服务

创建生产者服务类，用于向 Kafka 主题发送消息：

```java
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(String topic, String message) {
        kafkaTemplate.send(topic, message);
        System.out.println("Message sent to topic: " + topic + " - " + message);
    }
}
```

### 4.2 编写 API 接口

创建一个简单的 REST API 来发送消息：

```java
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/kafka")
public class KafkaProducerController {

    private final KafkaProducerService kafkaProducerService;

    public KafkaProducerController(KafkaProducerService kafkaProducerService) {
        this.kafkaProducerService = kafkaProducerService;
    }

    @PostMapping("/send")
    public String sendMessage(@RequestParam String topic, @RequestParam String message) {
        kafkaProducerService.sendMessage(topic, message);
        return "Message sent: " + message;
    }
}
```

使用 Postman 或 curl 测试发送消息：

```bash
curl -X POST "http://localhost:8080/kafka/send?topic=test-topic&message=HelloKafka"
```

---

## 5. 消费者开发

### 5.1 定义消费者逻辑

创建 Kafka 消费者服务类，通过 `@KafkaListener` 注解监听主题消息：

```java
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @KafkaListener(topics = "test-topic", groupId = "test-group")
    public void listen(String message) {
        System.out.println("Message received: " + message);
    }
}
```

### 5.2 测试消费者

向主题 **test-topic** 发送消息：

```bash
curl -X POST "http://localhost:8080/kafka/send?topic=test-topic&message=HelloKafkaConsumer"
```

观察消费者控制台，应该打印出接收到的消息：

```
Message received: HelloKafkaConsumer
```

---

## 6. Kafka 高级功能

### 6.1 自定义消息对象的序列化

Kafka 消息默认是基于字符串的，但我们可以发送和接收序列化的 Java 对象。

#### 添加依赖

引入 Jackson 依赖以支持 JSON 序列化：

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

#### 定义消息模型

```java
public class User {
    private String name;
    private int age;

    // Getters and Setters
}
```

#### 配置序列化器

在 `application.yml` 中配置 JSON 序列化器：
```yaml
spring:
  kafka:
    producer:
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "*"
```

#### 发送 JSON 消息

```java
public void sendUserMessage(String topic, User user) {
    kafkaTemplate.send(topic, user);
}
```

#### 接收 JSON 消息

```java
@KafkaListener(topics = "user-topic", groupId = "test-group")
public void listenUser(User user) {
    System.out.println("User received: " + user);
}
```

### 6.2 Kafka 事务支持

配置 Kafka 事务：

```yaml
spring:
  kafka:
    producer:
      transaction-id-prefix: trans- # 配置事务前缀
```

在生产者中启用事务：

```java
kafkaTemplate.executeInTransaction(operations -> {
    operations.send("test-topic", "Transactional Message");
    return true;
});
```

---

## 7. 总结

通过本篇文档，我们学习了 Spring Boot 集成 Kafka 的核心功能，包括：

1. **生产者开发**：如何使用 KafkaTemplate 发送消息。
2. **消费者开发**：如何使用 `@KafkaListener` 接收主题消息。
3. **高级功能**：实现消息的对象序列化和事务支持。

Spring Kafka 极大地简化了与 Kafka 的集成，提升了 Kafka 的开发效率。在实际项目中，可根据需求进一步优化性能和增强功能。
