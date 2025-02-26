---
title: Redisson
category:
  - Java
tag:
  - SpringCloudAlibaba
---

在 Spring Cloud 微服务架构中，分布式锁、分布式缓存以及其他一致性管理是常见的需求。**Redisson** 是 Redis 的一款开源客户端，它基于 Redis 提供了丰富的分布式工具支持，如分布式锁、分布式集合、分布式信号量等。

通过集成 Redisson，我们可以高效地解决分布式系统中常见的问题，例如并发抢占资源、确保数据一致性和任务调度限制等。


## 目录

1. [Redisson 简介](#1-redisson-简介)
2. [适用场景](#2-适用场景)
3. [开发准备](#3-开发准备)
4. [项目架构与依赖](#4-项目架构与依赖)
5. [常见场景及实现](#5-常见场景及实现)
    - **5.1 分布式锁**
    - **5.2 分布式限流**
    - **5.3 缓存数据一致性**
    - **5.4 分布式延迟任务**
6. [测试实例](#6-测试实例)
7. [扩展与优化](#7-扩展与优化)
8. [总结](#8-总结)

---

## 1. Redisson 简介

**Redisson** 是基于 Redis 的 Java 分布式框架，为我们提供了分布式环境中的一些高级工具，具有以下特点：
1. 基于 Redis，支持所有 Redis 集群模式（单节点、主从、哨兵、集群模式等）。
2. 提供分布式锁、分布式集合、分布式缓存等高级 API。
3. 简单易集成，完全兼容 Spring 环境。

Redisson 的特点适合在分布式环境中解决高并发、数据一致性和任务调度场景。

---

## 2. 适用场景

以下是 Redisson 在分布式系统中的常见适用场景：
1. **分布式锁**：有效解决高并发环境下的资源抢占问题。
2. **分布式缓存**：通过 Redis 管理多节点之间的数据一致性。
3. **分布式限流**：对接口访问进行限制，保护系统资源。
4. **延迟队列**：用于任务的定时调度，例如订单超时自动取消。
5. **分布式集合**：支持分布式 Map、Set、List 等集合操作。

---

## 3. 开发准备

在开发过程中需要准备以下内容：
1. 安装 **Redis**：
   - 使用 Docker 启动 Redis：
     ```bash
     docker run -d --name redis -p 6379:6379 redis
     ```
2. 配置好 Spring Cloud Alibaba 基础项目。

---

## 4. 项目架构与依赖

### 4.1 添加依赖

在 `pom.xml` 中引入 Redisson 的依赖：

```xml
<dependencies>
    <!-- Spring Boot Starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <!-- Redisson Starter -->
    <dependency>
        <groupId>org.redisson</groupId>
        <artifactId>redisson-spring-boot-starter</artifactId>
        <version>3.18.0</version>
    </dependency>

    <!-- Spring Web Starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

---

### 4.2 配置 Redis 和 Redisson

在 `application.yml` 中配置 Redis 和 Redisson：

```yaml
spring:
  redis:
    host: localhost
    port: 6379
    password: ""
    timeout: 10000

redisson:
  address: redis://localhost:6379 # Redis 连接地址
  password: ""                    # 密码(可选)
```

创建 `RedissonConfig` 配置类，用于自定义 Redisson 客户端：

```java
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RedissonConfig {

    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.useSingleServer().setAddress("redis://localhost:6379");
        return Redisson.create(config);
    }
}
```

---

## 5. 常见场景及实现

### 5.1 分布式锁

分布式锁在高并发场景下可保证资源只被一个实例占用，在 Redisson 中通过 `RLock` 实现。

#### 示例：库存扣减接口

```java
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class InventoryService {

    @Autowired
    private RedissonClient redissonClient;

    // 扣减库存
    public void deductStock(String productId) {
        RLock lock = redissonClient.getLock("lock:product:" + productId);
        boolean isLocked = false;

        try {
            // 尝试加锁，有效期 10 秒
            isLocked = lock.tryLock(5, 10, TimeUnit.SECONDS);

            if (isLocked) {
                // 执行扣库存操作
                System.out.println("扣减库存成功！商品ID：" + productId);
                Thread.sleep(2000); // 模拟业务处理
            } else {
                System.out.println("未获取到锁，稍后重试");
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (isLocked) {
                lock.unlock();
            }
        }
    }
}
```

---

### 5.2 分布式限流

分布式限流可以对接口访问频率进行限制，保护系统免受高并发冲击。

#### 示例：限制用户下单频率

```java
import org.redisson.api.RRateLimiter;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class OrderService {

    @Autowired
    private RedissonClient redissonClient;

    private RRateLimiter rateLimiter;

    @PostConstruct
    public void init() {
        rateLimiter = redissonClient.getRateLimiter("order:rate-limiter");
        // 设置速率：每秒最多处理 2 个请求
        rateLimiter.trySetRate(RRateLimiter.RateType.OVERALL, 2, 1, TimeUnit.SECONDS);
    }

    public String placeOrder(String userId) {
        if (rateLimiter.tryAcquire()) {
            // 允许下单
            System.out.println("订单创建成功，用户ID：" + userId);
            return "订单创建成功！";
        } else {
            // 限流重试提示
            System.out.println("下单过于频繁，请稍后再试。用户ID：" + userId);
            return "已限流，请稍后再试！";
        }
    }
}
```

---

### 5.3 缓存数据一致性

使用 Redisson 的分布式缓存获取数据，同时用锁机制更新缓存。

#### 示例：缓存读取与更新

```java
import org.redisson.api.RMapCache;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class CacheService {

    @Autowired
    private RedissonClient redissonClient;

    private RMapCache<String, String> cache;

    @PostConstruct
    public void init() {
        cache = redissonClient.getMapCache("product:cache");
    }

    public String getProduct(String productId) {
        return cache.get(productId);
    }

    public void updateProduct(String productId, String productDetails) {
        cache.put(productId, productDetails, 10, TimeUnit.MINUTES);
    }
}
```

---

### 5.4 分布式延迟任务

Redisson 的 `RDelayedQueue` 支持延迟任务的调度，适用于订单超时自动取消等场景。

#### 示例：订单超时取消

```java
import org.redisson.api.RDelayedQueue;
import org.redisson.api.RQueue;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class DelayedTaskService {

    @Autowired
    private RedissonClient redissonClient;

    private RDelayedQueue<String> delayedQueue;

    @PostConstruct
    public void init() {
        RQueue<String> queue = redissonClient.getQueue("order:timeout:queue");
        delayedQueue = redissonClient.getDelayedQueue(queue);
    }

    // 添加延迟任务
    public void addOrderToTimeoutQueue(String orderId) {
        delayedQueue.offer(orderId, 30, TimeUnit.SECONDS); // 延迟 30 秒
        System.out.println("订单已加入延迟队列：" + orderId);
    }
}
```

---

## 6. 测试实例

1. **模拟高并发抢锁**：
   - 创建模拟用户抢购库存的接口，验证分布式锁是否正常生效。
2. **限流测试**：
   - 模拟一个用户在短时间内频繁下单，查看限流机制效果。
3. **延迟任务测试**：
   - 模拟订单创建后，延迟 30 秒取消订单操作。

---

## 7. 扩展与优化

1. **Redis 集群支持**：
   - 配置 Redisson 支持 Redis 哨兵模式、集群模式，提高系统的可用性。
2. **结合 Spring Boot 缓存注解**：
   - 将 Redisson 分布式缓存与 Spring Cache 结合，简化代码。
3. **动态锁粒度**：
   - 根据业务场景动态设置锁粒度，例如根据商品 ID 或区域使用不同锁。
4. **监控和告警**：
   - 对 Redis 可用性进行监控，确保分布式锁等功能正常运行。

---

## 8. 总结

通过 Spring Cloud Alibaba 集成 Redisson，我们能够轻松实现分布式锁、分布式限流、缓存一致性和延迟任务等功能，从而解决分布式系统中的复杂问题。Redisson 的简洁 API 和功能丰富的分布式工具，使得这些场景的实现变得更加优雅高效。

> **小贴士**：在配置 Redisson 时，请根据业务场景选择合适的 Redis 部署模式，确保高可用性和性能。
