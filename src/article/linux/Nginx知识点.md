---
title: Nginx知识点
category:
  - Linux
tag:
  - Nginx
---

NGINX 是一个高性能的 HTTP 和反向代理服务器，支持高并发、负载均衡等功能，被广泛用于网站流量分发和高可用集群部署，也是现代 Web 开发和运维的核心组件之一。

**本文梳理了 NGINX 从基础到高级的全面知识，旨在帮助读者快速入门及掌握核心技能。**

<!-- more -->

## 目录

1. [NGINX 简介](#1-nginx-简介)
2. [NGINX 安装与启动](#2-nginx-安装与启动)
3. [核心配置与结构](#3-核心配置与结构)
4. [NGINX 基本命令](#4-nginx-基本命令)
5. [NGINX 的常见场景与配置](#5-nginx-的常见场景与配置)
6. [模块与高级功能](#6-模块与高级功能)
7. [性能优化技巧](#7-性能优化技巧)
8. [NGINX 常见问题与排查](#8-nginx-常见问题与排查)
9. [总结](#9-总结)

---

## 1. NGINX 简介

### 什么是 NGINX？

NGINX 是一个高性能、高稳定性和高灵活性的 Web 服务器及反向代理服务器，支持以下主要功能：
- **静态内容服务**：高效处理 HTML、CSS、JS、图片等静态资源。
- **反向代理**：代理客户端请求到后端服务器。
- **负载均衡**：多种策略分发请求到多个服务器（如轮询、IP 哈希等）。
- **HTTP 缓存**：提高资源访问速度并减轻后端压力。
- **HTTPS 支持**：通过证书加密提供安全的网站访问。
- **流量控制**：支持速率限制、带宽控制。

---

## 2. NGINX 安装与启动

### 安装 NGINX

#### 2.1 使用包管理工具安装
1. **Ubuntu/Debian**：
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **CentOS/RHEL**：
   ```bash
   sudo yum install epel-release
   sudo yum install nginx
   ```

#### 2.2 从源码安装（可自定义模块）
1. 下载 NGINX 源代码：
   ```bash
   wget http://nginx.org/download/nginx-1.24.0.tar.gz
   tar -xvzf nginx-1.24.0.tar.gz
   cd nginx-1.24.0
   ```

2. 配置并编译安装：
   ```bash
   ./configure
   make
   sudo make install
   ```

---

### 启动与停止服务

| 操作              | 命令                                    |
|-------------------|-----------------------------------------|
| 启动 NGINX        | `sudo systemctl start nginx`            |
| 停止 NGINX        | `sudo systemctl stop nginx`             |
| 重启 NGINX        | `sudo systemctl restart nginx`          |
| 检查运行状态       | `sudo systemctl status nginx`           |

---

## 3. 核心配置与结构

### NGINX 配置文件路径

常见默认路径：
- 主配置文件：`/etc/nginx/nginx.conf`
- 站点配置文件：`/etc/nginx/sites-available/` 和 `/etc/nginx/sites-enabled/`
- 可执行程序：`/usr/sbin/nginx`

---

### 配置文件结构

NGINX 使用模块化配置结构，主要分为以下几个部分：

| 配置块       | 描述                                                                 |
|-------------|----------------------------------------------------------------------|
| `events`    | 设置工作线程和连接数等核心服务控制。                                     |
| `http`      | HTTP 服务配置，包括网站监听、代理、缓存配置等。                           |
| `server`    | 定义一个虚拟主机配置，包括域名、监听端口等设置。                          |
| `location`  | 指定请求路径的匹配规则及要执行的处理逻辑。                                 |

**配置文件示例**：
```nginx
user www-data;
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    server {
        listen 80;
        server_name example.com;
        location / {
            root /var/www/html;
            index index.html;
        }
    }
}
```

---

## 4. NGINX 基本命令

| 命令                                | 描述                                        |
|------------------------------------|-------------------------------------------|
| `nginx -v`                         | 查看 NGINX 版本                             |
| `nginx -t`                         | 检查配置语法是否正确                         |
| `nginx -s reload`                  | 热加载配置文件                              |
| `nginx -s stop`                    | 停止 NGINX                                  |

---

## 5. NGINX 的常见场景与配置

### 5.1 静态文件服务

**目标**：将 `/var/www/html` 目录下的内容作为静态文件服务。

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        root /var/www/html;
        index index.html index.htm;
    }
}
```

---

### 5.2 HTTP 转发与反向代理

**目标**：将客户端请求代理到后端的 Java 应用服务器。

```nginx
server {
    listen 80;
    server_name app.example.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

### 5.3 负载均衡

**目标**：实现多个后端服务器的负载均衡。

```nginx
http {
    upstream myapp {
        server backend1.example.com;
        server backend2.example.com;
    }

    server {
        listen 80;
        server_name myapp.example.com;

        location / {
            proxy_pass http://myapp;
        }
    }
}
```

策略示例：
- 轮询（默认）：按请求顺序分配。
- 权重：`server backend1.example.com weight=2;`
- IP 哈希：`ip_hash;`

---

### 5.4 HTTPS 配置

**目标**：启用 HTTPS 访问（假设已获取证书）。

```nginx
server {
    listen 443 ssl;

    ssl_certificate /etc/nginx/ssl/example.crt;
    ssl_certificate_key /etc/nginx/ssl/example.key;

    location / {
        root /var/www/html;
        index index.html;
    }
}
```

---

## 6. 模块与高级功能

### 常用模块列表

| 模块                       | 功能                                   |
|---------------------------|--------------------------------------|
| `http_ssl_module`         | 支持 HTTPS                           |
| `http_gzip_module`        | 启用 Gzip 压缩以减少响应大小          |
| `stream`                  | 支持 TCP/UDP 流量代理                |
| `http_cache`              | 实现缓存功能                         |
| `http_stub_status_module` | 提供 NGINX 状态监控接口              |

---

### 日志设置

| 配置项           | 描述                                       |
|------------------|--------------------------------------------|
| `access_log`     | 记录所有访问请求。                        |
| `error_log`      | 记录错误信息（日志级别可调）。              |

示例：
```nginx
error_log /var/log/nginx/error.log warn;
access_log /var/log/nginx/access.log;
```

---

## 7. 性能优化技巧

1. **调优 Worker 进程和连接数**：
   ```nginx
   worker_processes auto;
   events {
       worker_connections 1024;
   }
   ```

2. **启用 Gzip 压缩**：
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

3. **缓存静态内容**：
   ```nginx
   location ~* \.(jpg|jpeg|png|css|js|ico)$ {
       expires 7d;
       access_log off;
   }
   ```

4. **限制请求速率**：
   ```nginx
   limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;
   server {
       location / {
           limit_req zone=one;
       }
   }
   ```

---

## 8. NGINX 常见问题与排查

### 问题一：服务启动失败

**检查配置语法**：
```bash
nginx -t
```

**查看错误日志**：
```bash
cat /var/log/nginx/error.log
```

---

### 问题二：高并发流量引发 504 Gateway Timeout

**解决**：
- 增大后端服务器的 `keepalive`：
  ```nginx
  upstream backend {
      server backend.example.com;
      keepalive 32;
  }
  ```

- 调整超时时间：
  ```nginx
  proxy_connect_timeout 60s;
  proxy_read_timeout 60s;
  proxy_send_timeout 60s;
  ```

---

## 9. 总结

本文详细介绍了 NGINX 的基本概念、安装、配置和性能调优技巧。结合实际项目需求，可以轻松实现静态资源服务、反向代理、负载均衡等功能，并通过高级模块进一步加强其性能与功能扩展。更多细节可参考 [NGINX 官方文档](https://nginx.org/)。
