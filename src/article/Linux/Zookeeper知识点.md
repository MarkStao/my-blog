---
title: ZooKeeper知识点
category:
  - Linux
tag:
  - Zookeeper
---

ZooKeeper 是一个分布式协调服务，主要用于保证分布式系统中关键功能的一致性，如分布式锁、服务注册与发现等。它由 Apache 基金会维护，经常被用作分布式系统的基础组件。

本文系统整理了 Zookeeper 的核心概念、命令操作及常见应用场景，帮助你从零开始理解和使用 ZooKeeper。

<!-- more -->

## 目录

1. [ZooKeeper 简介](#1-zookeeper-简介)
2. [ZooKeeper 安装与配置](#2-zookeeper-安装与配置)
3. [ZooKeeper 的核心概念](#3-zookeeper-的核心概念)
4. [ZooKeeper 的运作机制](#4-zookeeper-的运作机制)
5. [ZooKeeper 的常用命令](#5-zookeeper-的常用命令)
6. [Java 中的 ZooKeeper 客户端](#6-java-中的-zookeeper-客户端)
7. [ZooKeeper 的典型应用场景](#7-zookeeper-的典型应用场景)
8. [ZooKeeper 集群管理](#8-zookeeper-集群管理)
9. [ZooKeeper 的高级功能](#9-zookeeper-的高级功能)
10. [ZooKeeper 常见问题与优化](#10-zookeeper-常见问题与优化)
11. [总结](#11-总结)

---

## 1. ZooKeeper 简介

### 什么是 ZooKeeper？

ZooKeeper 是一个分布式开源协调服务，主要解决分布式系统中的数据一致性问题。它提供了分布式数据存储与管理的功能，适用于需要高性能、高可用的一致性服务。

核心特性：
- **分布式配置管理**：存储和更新配置信息。
- **分布式锁**：可实现分布式环境下的锁机制。
- **节点可用性检测**：监控分布式系统的节点状态。
- **高一致性**：ZooKeeper 的 Paxos-like 协议保证了数据一致性。

---

## 2. ZooKeeper 安装与配置

### 环境准备

1. 下载 ZooKeeper：
   - 前往 Apache 官方下载：[ZooKeeper 下载地址](https://zookeeper.apache.org/releases.html)
   - 选择稳定版本并解压。

2. 环境依赖：
   - Java 环境（JDK 1.8 或更高版本）。
   - 集群部署需要多台服务器。

### 配置单机模式

1. 修改配置文件 `conf/zoo.cfg`：
   ```properties
   # ZooKeeper 基本配置
   tickTime=2000
   dataDir=/tmp/zookeeper
   clientPort=2181
   ```

2. 启动 ZooKeeper：
   ```bash
   bin/zkServer.sh start
   ```

3. 验证启动：
   ```bash
   bin/zkCli.sh -server 127.0.0.1:2181
   ```

---

## 3. ZooKeeper 的核心概念

| 核心概念         | 描述                                                                 |
|------------------|----------------------------------------------------------------------|
| **节点 (ZNode)** | ZooKeeper 中的数据结构，类似文件系统的树形结构，可以存储数据或子节点。|
| **会话 (Session)** | 客户端与 ZooKeeper 服务端之间的连接生命周期。                        |
| **事务 ID (ZXID)** | 每个更新都分配一个唯一的 ZXID，确保更新的顺序性。                    |
| **Watch**        | 一种触发机制，当指定节点发生变化时通知客户端。                        |

### ZNode 类型

1. **永久节点 (Persistent)**：
   - 节点创建后，即使客户端断开连接或退出，节点仍然存在。

2. **临时节点 (Ephemeral)**：
   - 客户端断开连接后，节点会自动删除。

3. **顺序节点 (Sequential)**：
   - 在创建节点名后自动追加唯一编号，常用于唯一性标识。

---

## 4. ZooKeeper 的运作机制

### 分布式一致性协议

ZooKeeper 基于 **ZAB 协议** (ZooKeeper Atomic Broadcast) 实现分布式一致性。

- **领导者 (Leader)**：
  处理所有写操作。
- **追随者 (Follower)**：
  处理读请求，参与领导者选举。
- **观察者 (Observer)**：
  不参与投票，但同步数据，提升读性能。

### 数据模型

ZooKeeper 使用树形结构存储数据，类似文件系统：
```
/
├── app1
│   ├── config
│   └── workers
├── app2
    └── task-queue
```

---

## 5. ZooKeeper 的常用命令

连接到 ZooKeeper：
```bash
bin/zkCli.sh -server 127.0.0.1:2181
```

### 基本操作

| 命令                          | 描述                                   |
|-------------------------------|----------------------------------------|
| `create /path data`           | 创建节点并写入数据                    |
| `get /path`                   | 获取节点数据                          |
| `set /path data`              | 更新节点数据                          |
| `delete /path`                | 删除节点                              |
| `ls /path`                    | 列出子节点                            |
| `stat /path`                  | 查看节点状态信息                      |

示例：
```bash
# 创建节点
create /example "hello"
# 获取节点数据
get /example
# 更新节点数据
set /example "world"
```

---

## 6. Java 中的 ZooKeeper 客户端

### Maven 依赖

```xml
<dependency>
    <groupId>org.apache.zookeeper</groupId>
    <artifactId>zookeeper</artifactId>
    <version>3.8.0</version>
</dependency>
```

### Java 示例代码

```java
import org.apache.zookeeper.*;

public class ZookeeperExample {
    public static void main(String[] args) throws Exception {
        ZooKeeper zk = new ZooKeeper("127.0.0.1:2181", 3000, null);

        // 创建节点
        zk.create("/example", "hello".getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);

        // 获取数据
        byte[] data = zk.getData("/example", false, null);
        System.out.println(new String(data));

        zk.close();
    }
}
```

---

## 7. ZooKeeper 的典型应用场景

### 7.1 分布式锁

使用临时顺序节点实现分布式锁，确保只有一个客户端持有锁。

### 7.2 服务注册与发现

服务实例向 ZooKeeper 注册节点，客户端通过监听节点变化动态发现服务。

### 7.3 分布式配置管理

使用 ZNode 存储配置信息，所有应用实时同步读取和监控配置。

### 7.4 分布式队列

利用顺序节点实现分布式任务队列，保证消息的顺序与消费。

---

## 8. ZooKeeper 集群管理

### 集群配置

`zoo.cfg` 示例：
```properties
tickTime=2000
initLimit=5
syncLimit=2
dataDir=/var/lib/zookeeper
clientPort=2181
server.1=192.168.1.1:2888:3888
server.2=192.168.1.2:2888:3888
server.3=192.168.1.3:2888:3888
```

### 集群节点角色

| 节点角色         | 描述                                    |
|------------------|-----------------------------------------|
| Leader           | 负责处理写操作，分发更新到 Follower。   |
| Follower         | 服务于读请求，与 Leader 同步数据。       |
| Observer         | 不参与选举，提升读性能。                |

---

## 9. ZooKeeper 的高级功能

### Watch 机制

通过 `Watcher` 注册监听器，当节点发生数据变化时触发通知。

Java 示例：
```java
zk.exists("/example", event -> {
    System.out.println("Event triggered: " + event.getType());
});
```

### ACL 权限控制

ZooKeeper 支持访问控制列表（ACL），定义节点的访问权限。

权限类型：
- **CREATE**：创建子节点。
- **READ**：读取节点数据。
- **WRITE**：更新节点数据。

---

## 10. ZooKeeper 常见问题与优化

### 常见问题

1. **脑裂问题**：
   - 原因：集群分区后各分支认为自己是 Leader。
   - 解决：设置奇数节点数，避免长时间分区。

2. **性能问题**：
   - 定期清理事务日志和快照数据。
   - 增加 Observer 节点提升读请求性能。

### 优化建议

- **合理配置集群节点数**：
  - 通常为 3 或 5 个节点。
- **数据存储优化**：
  - 使用快速磁盘存储 `dataDir` 数据。
- **网络延迟监控**：
  - 集群节点间网络延迟不宜过高。

---

## 11. 总结

ZooKeeper 是分布式系统中的关键协调工具，它通过强一致性协议和高可靠性支持了分布式应用的高效运作。掌握 ZooKeeper 的核心功能和操作手册，将有助于在分布式开发中构建健壮的系统。如果想深入学习，请参考 [ZooKeeper 官方文档](https://zookeeper.apache.org/)。实践出真知，开始搭建属于你的 ZooKeeper 集群吧！