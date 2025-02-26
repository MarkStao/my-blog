---
title: Elasticsearch知识点
category:
  - Linux
tags:
  - Elasticsearch
---

**Elasticsearch** 是一个分布式、开源的搜索引擎，基于 RESTful API 提供全文检索和数据分析功能。它是由 Apache Lucene 构建的，但其易用性和强大的分布式能力让它成为搜索和日志分析领域的首选解决方案。

<!-- more -->

## 目录

1. [Elasticsearch 简介](#1-elasticsearch-简介)
2. [核心架构与概念](#2-核心架构与概念)
3. [安装与配置](#3-安装与配置)
4. [基础操作](#4-基础操作)
5. [高级功能](#5-高级功能)
6. [常见使用场景](#6-常见使用场景)
7. [Elasticsearch 调优](#7-elasticsearch-调优)
8. [常见问题](#8-常见问题)
9. [总结](#9-总结)

---

## 1. Elasticsearch 简介

### 什么是 Elasticsearch？

Elasticsearch 是一个分布式、高可用的全文检索引擎，主要特点包括：
- **实时搜索**：支持近乎实时的数据写入和搜索。
- **支持大规模数据**：分布式架构，轻松扩展。
- **多功能性**：提供全文搜索、结构化搜索、数据聚合分析等。

---

### Elasticsearch 的核心特点

1. **高可用和分布式**：
   - 自动分片和复制，支持数据容灾与负载均衡。
   - 水平扩展能力强，可轻松扩展至数百个节点。
2. **基于 Lucene**：
   - 达到企业级搜索的精准度和性能。
3. **RESTful API**：
   - 通过简单的 HTTP 方法（GET、POST 等）与应用交互。
4. **多租户支持**：
   - 在一个实例中可运行多个独立的索引。
5. **与 Elastic Stack 兼容**：
   - 与 Kibana、Beats、Logstash 共建日志与监控解决方案。

---

## 2. 核心架构与概念

在理解并使用 Elasticsearch 之前，以下核心概念是必须掌握的：

---

### 核心组件

| 组件          | 描述                                                                 |
|---------------|----------------------------------------------------------------------|
| **Cluster**   | Elasticsearch 集群的逻辑分组，包含多个节点。                                 |
| **Node**      | 集群的单个实例，负责处理索引与数据存储任务。                              |
| **Shard**     | 索引的分片（原始分片），是存储和搜索的基本单位。                               |
| **Replica**   | 副本分片，用于容灾和分布式查询，加快搜索性能。                                 |
| **Index**     | 存储逻辑分组，一个索引由多个分片组成，对应关系型数据库的"表"。                      |
| **Document**  | Elasticsearch 的最小存储单位，对象的 JSON 文档。                                |
| **Mapping**   | 定义索引字段的结构与数据类型，相当于关系数据库中的 "Schema"。                  |

---

### 数据组织层次

1. **Cluster (集群)**
2. **Index (索引)**
3. **Shard (分片)**：
   - Primary Shard（主分片）
   - Replica Shard （副本分片）
4. **Document (文档)**

---

## 3. 安装与配置

Elasticsearch 的运行依赖于 **Java 运行时 (JVM)**，需提前安装 Java 环境（推荐 JDK 11 或更高版本）。

### 3.1 安装步骤

#### 方法 1：Docker 安装（推荐）

1. 下载 Elasticsearch 官方 Docker 镜像。
   ```bash
   docker pull elasticsearch:8.10.0
   ```

2. 启动容器：
   ```bash
   docker run --name es-node -d -p 9200:9200 -e "discovery.type=single-node" elasticsearch:8.10.0
   ```

#### 方法 2：包管理工具安装
1. **CentOS/RHEL**：
   ```bash
   sudo rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch
   sudo yum install elasticsearch
   ```

2. **Ubuntu/Debian**：
   ```bash
   wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
   sudo apt update
   sudo apt install elasticsearch
   ```

---

### 3.2 服务管理

| 操作                  | 命令                                      |
|-----------------------|-------------------------------------------|
| 启动 Elasticsearch    | `sudo systemctl start elasticsearch`      |
| 停止服务              | `sudo systemctl stop elasticsearch`       |
| 检查服务状态          | `sudo systemctl status elasticsearch`     |

---

### 3.3 配置文件详解

主要配置文件位于 `/etc/elasticsearch/elasticsearch.yml`：
```yaml
# 集群配置
cluster.name: my-cluster
node.name: node-1

# 网络绑定地址
network.host: 0.0.0.0
http.port: 9200

# 数据目录路径
path.data: /var/lib/elasticsearch
path.logs: /var/log/elasticsearch

# 分片与副本数
index.number_of_shards: 3
index.number_of_replicas: 1
```

---

## 4. 基础操作

### 4.1 基础查询

1. 验证节点运行状态：
   ```bash
   curl -X GET "localhost:9200/"
   ```

2. 查看所有索引：
   ```bash
   curl -X GET "localhost:9200/_cat/indices?v"
   ```

---

### 4.2 索引操作

1. **创建索引**：
   ```bash
   curl -X PUT "localhost:9200/my-index"
   ```

2. **删除索引**：
   ```bash
   curl -X DELETE "localhost:9200/my-index"
   ```

3. **查看索引健康状态**：
   ```bash
   curl -X GET "localhost:9200/_cat/health?v"
   ```

---

### 4.3 文档操作

1. **插入文档**：
   ```bash
   curl -X POST "localhost:9200/my-index/_doc/1" -H 'Content-Type: application/json' -d'
   {
       "title": "Learn Elasticsearch",
       "content": "Full-text search tool"
   }'
   ```

2. **查询文档**：
   ```bash
   curl -X GET "localhost:9200/my-index/_doc/1"
   ```

3. **更新文档**：
   ```bash
   curl -X POST "localhost:9200/my-index/_update/1" -H 'Content-Type: application/json' -d'
   {
       "doc": {
           "content": "Updated content"
       }
   }'
   ```

4. **删除文档**：
   ```bash
   curl -X DELETE "localhost:9200/my-index/_doc/1"
   ```

---

## 5. 高级功能

### 5.1 聚合查询

Elasticsearch 支持强大的数据聚合，例如统计、分组等。
```bash
curl -X POST "localhost:9200/my-index/_search" -H 'Content-Type: application/json' -d'
{
  "aggs": {
    "average_score": {
      "avg": {
        "field": "score"
      }
    }
  }
}'
```

---

### 5.2 分词器与分析器

1. 查看系统内置分词器：
   ```bash
   curl -X GET "localhost:9200/_analyze" -H 'Content-Type: application/json' -d'
   {
       "analyzer": "standard",
       "text": "Elasticsearch is powerful and flexible"
   }'
   ```

2. 自定义分词器：
   在创建索引时配置：
   ```bash
   curl -X PUT "localhost:9200/my-index" -H 'Content-Type: application/json' -d'
   {
       "settings": {
           "analysis": {
               "analyzer": {
                   "custom_analyzer": {
                       "tokenizer": "standard",
                       "filter": ["lowercase"]
                   }
               }
           }
       }
   }'
   ```

---

## 6. 常见使用场景

1. **日志收集与分析**：
   - Elasticsearch 配合 Filebeat 和 Logstash 构建日志监控系统。
2. **全文检索**：
   - 应用于新闻、电子商务网站搜索引擎。
3. **时间序列分析**：
   - 分析实时指标，如服务器性能监控数据。
4. **数据聚合**：
   - 用于数据统计与报表生成。

---

## 7. Elasticsearch 调优

### 7.1 性能优化

1. **分片配置优化**：
   - 根据集群规模调整 `index.number_of_shards`。
2. **数据压缩**：
   ```yaml
   index.codec: best_compression
   ```

3. **内存分配**：
   增加 JVM 堆大小：
   ```bash
   -Xms4g
   -Xmx4g
   ```

---

### 7.2 搜索优化

- 使用分页查询 (`from`/`size`)：
   ```bash
   curl -X GET "localhost:9200/my-index/_search?from=0&size=10"
   ```

---

## 8. 常见问题

1. **索引超时**：
   调整写入线程池大小：
   ```yaml
   thread_pool.write.queue_size: 200
   ```

2. **节点崩溃**：
   提高系统文件描述符：
   ```bash
   ulimit -n 65535
   ```

3. **数据分片丢失**：
   触发分片重新分配：
   ```bash
   curl -X POST "localhost:9200/_cluster/reroute"
   ```

---

## 9. 总结

Elasticsearch 是目前最流行的分布式搜索和分析引擎之一，它的扩展性与强大功能使其在日志管理系统、搜索引擎开发、数据分析等领域广泛应用。通过熟悉其核心概念与操作，可有效提高数据检索效率，并实现复杂的实时分析功能。

**推荐资料：**
- [Elasticsearch 官方文档](https://www.elastic.co/guide/en/elasticsearch/reference)
- [Elastic Stack](https://www.elastic.co/elastic-stack/)
