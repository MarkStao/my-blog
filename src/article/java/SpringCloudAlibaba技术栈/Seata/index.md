---
title: Seata
category:
  - Java
tag:
  - SpringCloudAlibaba
---

Seata 是阿里巴巴开源的一款分布式事务解决方案，支持高性能和高可用的分布式事务。它让开发者能够以非侵入的方式解决分布式事务问题，包括本地事务和分布式事务的一致性问题。

通过 Spring Cloud Alibaba 集成 Seata，微服务之间的事务协调变得简单，将业务一致性问题透明化解决，从而极大降低复杂的分布式事务的开发和运维成本。

<!-- more -->

## 目录

1. [Seata 简介](#1-seata-简介)
2. [环境准备](#2-环境准备)
3. [Seata 模块简介](#3-seata-模块简介)
4. [项目依赖](#4-项目依赖)
5. [Seata Server 设置](#5-seata-server-设置)
6. [核心功能实现](#6-核心功能实现)
    - **基于 AT 模式**
7. [总结](#7-总结)

---

## 1. Seata 简介

### 核心特性

Seata 提供了一种高效、可靠的分布式事务解决技术，支持以下功能：
- **分布式事务一致性**：保证系统中多个服务之间的事务一致性。
- **支持多种事务模式**：
    - AT 模式：基于自动补偿设计的模式。
    - TCC 模式：手动编程实现补偿逻辑。
- **事务解耦**：利用分布式事务协调器透明解决分布式事务问题。
- **事务隔离性**：通过冻结表或连接恢复机制，减少事务执行时干扰。

### 应用场景

- 跨多个微服务的事务一致性处理。
- 确保事务最终一致性，如库存扣减、订单支付、账户变化等。

---

## 2. 环境准备

1. 安装 **Seata Server**：
   - 下载 Seata：[Releases 页面](https://github.com/seata/seata/releases)
   - 运行 Seata Server。

2. 确保以下工具环境正确安装：
   - **JDK 1.8+**
   - **Spring Boot 2.6+**
   - **MySQL 5.7+（或其他支持的数据库）**

3. 配置 **Nacos**（用于注册中心）：
   - Nacos Server：[Nacos 官方文档](https://nacos.io/zh-cn/docs/quick-start.html)
   - 确保微服务之间已通过 Nacos 实现服务发现。

---

## 3. Seata 模块简介

Seata 主要包含以下组件：

1. **TM（事务管理器）**：
    - 负责开启事务和发起全局回滚/提交。
2. **RM（资源管理器）**：
    - 管控分布式资源，例如数据库资源，负责分支事务提交与回滚。
3. **TC（事务协调器）**：
    - 全局事务控制中心，记录全局事务的状态，并协调分支事务执行的提交与回滚。

---

## 4. 项目依赖

在微服务的 `pom.xml` 文件中添加以下必要依赖：

```xml
<dependencies>
    <!-- Spring Cloud Alibaba Seata -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-seata</artifactId>
    </dependency>

    <!-- 数据库驱动 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- 日志工具 -->
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
    </dependency>
</dependencies>
```

更新项目依赖并确认已引入 Seata 整合支持。

---

## 5. Seata Server 设置

### 5.1 修改 Seata Server 配置文件

找到 `seata/conf` 文件夹，进行如下配置：

1. 修改 `registry.conf`：
   ```properties
   registry {
       type = "nacos"
       nacos {
           serverAddr = "localhost:8848" # Nacos 地址
           namespace = ""
           cluster = "default"
       }
   }

   config {
       type = "nacos"
       nacos {
           serverAddr = "localhost:8848"
           namespace = ""
           group = "SEATA_GROUP"
           dataId = "seataServer.properties"
       }
   }
   ```

2. 修改事务日志的数据库信息：
   在 `file.conf` 文件中设置：
   ```properties
   store {
       mode = "db"
       db {
           datasource = "druid"
           dbType = "mysql"
           driverClassName = "com.mysql.cj.jdbc.Driver"
           url = "jdbc:mysql://localhost:3306/seata"
           user = "root"
           password = "root"
       }
   }
   ```

---

## 6. 核心功能实现

本示例基于 **Account（账户服务）**、**Order（订单服务）** 和 **Inventory（库存服务）** 设计分布式事务，演示如何通过 Seata 保证多服务事务一致性。

### 6.1 全局事务管理器

在微服务的入口服务中（如 `OrderService`），通过 `@GlobalTransactional` 开启全局事务。

```java
import io.seata.spring.annotation.GlobalTransactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private InventoryClient inventoryClient;

    @Autowired
    private AccountClient accountClient;

    @GlobalTransactional(name = "order_create_tx", rollbackFor = Exception.class)
    public void createOrder(String userId, String productId, int count) {
        // 扣减库存
        inventoryClient.deduct(productId, count);

        // 扣减账户余额
        accountClient.decreaseBalance(userId, count * 100);

        // 模拟异常
        if (count > 5) {
            throw new RuntimeException("异常模拟：交易数量过大，回滚事务");
        }
    }
}
```

通过 `@GlobalTransactional`，分布式事务整合周期会自动协调。

---

### 6.2 分支服务：Inventory 服务

库存服务用于扣减产品库存。

#### 1. 修改数据库实现库存冻结
创建数据库 `inventory` 表，用于扣减库存：
```sql
CREATE TABLE inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(64),
    total_count INT DEFAULT 0,
    frozen_count INT DEFAULT 0
);
```

#### 2. 实现 Inventory 服务接口
```java
import io.seata.spring.annotation.GlobalLock;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping("/deduct")
    @GlobalLock
    public String deduct(@RequestParam String productId, @RequestParam int count) {
        inventoryService.deductProduct(productId, count);
        return "success";
    }
}
```

#### 3. 编写 Inventory 业务逻辑
```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    public void deductProduct(String productId, int count) {
        // 扣减库存逻辑
        inventoryRepository.deduct(productId, count);
    }
}
```

---

### 6.3 分支服务：Account 服务

同样步骤为账户服务实现余额扣减逻辑，与 Inventory 类似。

---

## 总结

通过集成 **Seata**，可以轻松实现以下功能：

1. **分布式事务管理**：通过 `@GlobalTransactional` 和 Seata 的事务协调功能，在多微服务中共享同一事务状态。
2. **自动回滚与提交**：通过 TC 的协调，针对事务错误实现自动补偿。
3. **高效性与可扩展性**：Seata 能处理复杂事务场景，适用于大规模微服务架构体系。

Seata 是现代分布式事务不可或缺的一部分，结合 Spring Cloud Alibaba 提供了简单、可靠的事务解决能力。
