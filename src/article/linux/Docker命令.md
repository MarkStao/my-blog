---
title: Docker知识点
category:
  - Linux
tag:
  - Docker
---

Docker 是一种开源的容器化平台，可帮助开发者轻松创建、部署和运行容器化的应用程序。本文全面整理了 Docker 的概念、核心命令、高级功能及实用场景。

<!-- more -->
---

## 目录

1. [Docker 基础](#1-docker-基础)
2. [安装 Docker](#2-安装-docker)
3. [Docker 核心概念](#3-docker-核心概念)
4. [Docker 常用命令](#4-docker-常用命令)
5. [Docker 镜像](#5-docker-镜像)
6. [Docker 容器](#6-docker-容器)
7. [Docker Compose](#7-docker-compose)
8. [Docker 网络](#8-docker-网络)
9. [Docker 数据卷](#9-docker-数据卷)
10. [Dockerfile 编写](#10-dockerfile-编写)
11. [Docker 常见问题与优化](#11-docker-常见问题与优化)
12. [总结](#12-总结)

---

## 1. Docker 基础

### 什么是 Docker？

Docker 是一个轻量级的开源容器化平台，通过操作系统级虚拟化，在同一个操作系统实例上运行多个隔离的容器，从而提供以下特性：
- **隔离**：不同的容器互不干扰。
- **轻量**：相比虚拟机，容器启动迅速，资源占用更少。
- **可移植性**：支持“构建一次，运行多处”的应用理念。

### Docker 的核心组件

- **镜像（Image）**：只读模板，用于创建容器。
- **容器（Container）**：通过镜像运行的应用实例。
- **仓库（Registry）**：存储和分发镜像。
- **Docker Engine**：运行 Docker 容器的引擎。

---

## 2. 安装 Docker

### 安装步骤

1. **Linux（以 Ubuntu 为例）**：

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
```

2. **Windows 和 macOS**：
   - 下载 Docker Desktop：[Docker 官网下载](https://www.docker.com/products/docker-desktop)

3. **验证安装**：

```bash
docker --version
docker run hello-world
```

---

## 3. Docker 核心概念

| 概念                | 描述                                                                 |
|---------------------|----------------------------------------------------------------------|
| **镜像（Image）**   | 创建容器的只读模板，包含应用程序及其运行环境。                          |
| **容器（Container）**| 镜像的运行实例，类似轻量级沙箱，每个容器相互隔离。                     |
| **Dockerfile**      | 定义镜像构建的步骤。                                                  |
| **仓库（Registry）** | 存储镜像的仓库。例如：Docker Hub（公共仓库）、Harbor（私有仓库）。       |

---

## 4. Docker 常用命令

以下是一些常用的 Docker 命令。

### 基本操作

| 命令                         | 描述                              |
|------------------------------|-----------------------------------|
| `docker --version`           | 显示 Docker 当前版本              |
| `docker ps`                  | 列出当前运行的容器                |
| `docker ps -a`               | 列出所有容器（包括停止的）         |
| `docker images`              | 列出本地的 Docker 镜像            |
| `docker start <容器ID>`       | 启动一个已停止的容器               |
| `docker stop <容器ID>`        | 停止运行的容器                    |
| `docker rm <容器ID>`          | 删除一个容器                     |
| `docker rmi <镜像ID>`         | 删除一个镜像                     |

### 运行容器

| 命令                                              | 描述                                   |
|---------------------------------------------------|----------------------------------------|
| `docker run <镜像>`                                | 创建并运行一个容器                     |
| `docker run -d <镜像>`                             | 后台运行容器                           |
| `docker run -p 8080:80 <镜像>`                    | 端口映射                               |
| `docker run -v /host/path:/container/path <镜像>` | 挂载数据卷                             |

---

## 5. Docker 镜像

### 查看镜像

```bash
docker images
```

### 从仓库拉取镜像

```bash
docker pull <镜像名>:<标签>
```

示例：

```bash
docker pull nginx:latest
```

### 创建镜像

使用 Dockerfile 构建镜像：

```bash
docker build -t <镜像名>:<标签> .
```

---

## 6. Docker 容器

### 启动容器

```bash
docker run --name <容器名> -d <镜像名>
```

示例：

```bash
docker run --name my-nginx -d -p 8080:80 nginx
```

### 停止容器

```bash
docker stop <容器ID或容器名>
```

### 删除容器

```bash
docker rm <容器ID或容器名>
```

---

## 7. Docker Compose

Docker Compose 用于定义和运行多容器应用。

### 安装

```bash
sudo apt install docker-compose
```

### 示例配置文件 `docker-compose.yml`

```yaml
version: '3.8'
services:
  web:
    image: nginx
    ports:
      - "8080:80"
  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: password
```

启动服务：

```bash
docker-compose up -d
```

停止服务：

```bash
docker-compose down
```

---

## 8. Docker 网络

Docker 提供三种默认网络模式：

| 模式            | 描述                                |
|-----------------|-------------------------------------|
| `bridge`        | 默认模式，容器间通过桥接互联         |
| `host`          | 容器与宿主机共享网络                |
| `none`          | 容器完全隔离，不配置网络            |

创建自定义网络：

```bash
docker network create my-network
```

运行容器并加入网络：

```bash
docker run --net my-network <镜像>
```

---

## 9. Docker 数据卷

数据卷用于持久化数据。

### 创建数据卷

```bash
docker volume create my-data
```

### 挂载数据卷

```bash
docker run -v my-data:/data <镜像>
```

挂载本地目录：

```bash
docker run -v /path/on/host:/data <镜像>
```

---

## 10. Dockerfile 编写

`Dockerfile` 是用于构建镜像的脚本文件。

### 示例：创建 Node.js 应用镜像

**Dockerfile**：

```dockerfile
# 基础镜像
FROM node:16

# 设置工作目录
WORKDIR /app

# 复制文件
COPY package.json ./

# 安装依赖
RUN npm install

# 复制代码
COPY . ./

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

构建镜像：

```bash
docker build -t my-node-app .
```

运行容器：

```bash
docker run -p 3000:3000 my-node-app
```

---

## 11. Docker 常见问题与优化

### 清理无用资源

清除未使用的容器、镜像和网络：

```bash
docker system prune
```

### 提高构建速度

1. 使用分层缓存，避免重复执行 `RUN` 命令。
2. 合理调整 `COPY` 的顺序，把更改频繁的文件放到后面。

---

## 12. 总结

Docker 是现代开发中不可缺少的工具，它简化了应用程序的开发、测试和部署流程。从初学到进阶，通过本文你应掌握 Docker 的基本知识与高级用法。实践是最好的学习方式，动手去构建你的第一个 Docker 应用吧！