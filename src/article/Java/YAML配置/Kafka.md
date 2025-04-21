---
title: Kafka YAML配置
category:
  - Java
tag:
  - YAML
---

Spring中Kafka的YAML配置

<!-- more -->

```yaml
spring:
  kafka:
    # Kafka 服务器地址
    bootstrap-servers: localhost:9092
    template:
      # 默认主题名称
      default-topic: test-topic
    # 生产者配置
    producer:
      # 消息的键的序列化器
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      # 消息的值的序列化器
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
      # 生产者重试次数
      retries: 3
      # 批量发送消息的大小
      batch-size: 16384
      # 生产者内存缓冲区大小
      buffer-memory: 33554432
      # acks 配置，all 表示所有副本都确认才认为消息发送成功
      acks: all
    # 消费者配置
    consumer:
      # 消费者组 ID
      group-id: my-group
      # 消息的键的反序列化器
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      # 消息的值的反序列化器
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      # 自动提交偏移量
      enable-auto-commit: true
      # 自动提交偏移量的时间间隔
      auto-commit-interval: 1000
      # 偏移量重置策略 earliest：从最早的数据开始消费；latest：从最新的数据开始消费；none：如果该消费者组没有消费过，则抛出异常；
      auto-offset-reset: earliest
    # 监听器配置
    listener:
      # 监听器的类型，BATCH 表示批量处理消息
      type: batch
      # 批量处理消息的最大数量
      batch-listener:
        max-records: 100
      # 消费者工厂配置
      concurrency: 3
      # 监听器的 Ack 模式：
      # RECORD：每处理完一条消息就会立即提交该消息的偏移量；
      # BATCH：消费者在处理完一个批次的消息后，会提交该批次消息的偏移量；
      # TIME：消费者会按照固定的时间间隔来提交偏移量；
      # COUNT：当消费者处理的消息数量达到指定的阈值时，就会提交偏移量；
      # MANUAL：需要开发者手动调用Acknowledgment.acknowledge()方法来提交偏移量；
      # MANUAL_IMMEDIATE：需要手动调用Acknowledgment.acknowledge()方法来提交偏移量，立即提交到Kafka；
      ack-mode: MANUAL_IMMEDIATE
    # 管理员配置（用于创建主题等操作）
    admin:
      # 自动创建主题
      auto-create-topics: true
```