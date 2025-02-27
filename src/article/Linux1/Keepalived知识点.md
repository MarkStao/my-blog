---
title: Keepalived知识点
category:
  - Linux
tags:
  - Keepalived
---

Keepalived 是 Linux 系统中实现高可用性(HA)和负载均衡的一款常用工具，主要应用于防止服务单点故障（SPOF），尤其常见于配合 NGINX、Haproxy 等负载均衡器的高可用部署。

<!-- more -->

## 目录

1. [Keepalived 简介](#1-keepalived-简介)
2. [Keepalived 安装与配置](#2-keepalived-安装与配置)
3. [Keepalived 核心概念](#3-keepalived-核心概念)
4. [Keepalived 配置文件详解](#4-keepalived-配置文件详解)
5. [Keepalived 工作机制与原理](#5-keepalived-工作机制与原理)
6. [Keepalived 常见使用场景](#6-keepalived-常见使用场景)
7. [Keepalived 高级配置与功能](#7-keepalived-高级配置与功能)
8. [Keepalived 性能调优](#8-keepalived-性能调优)
9. [Keepalived 常见问题与排查](#9-keepalived-常见问题与排查)
10. [总结](#10-总结)

---

## 1. Keepalived 简介

### 什么是 Keepalived？

**Keepalived** 是一种高可用性解决方案，本质是通过 VRRP（Virtual Router Redundancy Protocol，虚拟路由冗余协议）实现的，主要功能有：
- **高可用性 (HA)**：
  自动故障切换，保障服务的连续性。
- **虚拟 IP (VIP)**：
  提供主备服务间 VIP 的无缝漂移。
- **健康检查**：
  定期检测后端节点的运行状态，配合负载均衡方案工作。

---

## 2. Keepalived 安装与配置

### 安装 Keepalived

#### 2.1 使用包管理工具安装

1. **Ubuntu/Debian**：
   ```bash
   sudo apt update
   sudo apt install keepalived -y
   ```

2. **CentOS/RHEL**：
   ```bash
   sudo yum install keepalived -y
   ```

3. **验证安装**：
   确认安装版本：
   ```bash
   keepalived -v
   ```

#### 2.2 从源码安装（可用于自定义配置）

1. 下载源码：
   ```bash
   wget https://www.keepalived.org/software/keepalived-2.2.7.tar.gz
   tar -xvzf keepalived-2.2.7.tar.gz
   cd keepalived-2.2.7
   ```

2. 编译与安装：
   ```bash
   ./configure
   make && sudo make install
   ```

---

### 基本操作

| 操作                     | 命令                                      |
|--------------------------|-------------------------------------------|
| 启动 Keepalived           | `sudo systemctl start keepalived`         |
| 停止 Keepalived           | `sudo systemctl stop keepalived`          |
| 重启 Keepalived           | `sudo systemctl restart keepalived`       |
| 查看运行状态              | `sudo systemctl status keepalived`        |

---

## 3. Keepalived 核心概念

### 核心功能

1. **VRRP（虚拟路由冗余协议）**：
   实现主备模式下的 IP 漂移，有效解决服务单点故障问题。

2. **Health Check（健康检查）**：
   定期检测后端服务健康状态，发现故障时触发主备切换。

3. **负载均衡（非主要功能）**：
   可配置 IPVS（IP Virtual Server）实现简单的负载均衡功能。

### 关键角色

| 角色           | 描述                                                                 |
|----------------|----------------------------------------------------------------------|
| **Master**     | 高可用服务中的主节点，负载虚拟 IP (VIP)，服务请求由此节点处理。          |
| **Backup**     | 备份节点，当主节点故障时 übernehmen 虚拟 IP。                           |
| **VIP**        | Virtual IP Address，为客户端提供的统一高可用访问地址。                 |

---

## 4. Keepalived 配置文件详解

**配置文件位置**：
默认路径 `/etc/keepalived/keepalived.conf`

---

### 核心配置结构

```conf
! Configuration File for keepalived

global_defs {
    router_id LVS_DEMO        # 唯一标识符，用于区分集群
}

vrrp_instance VI_1 {
    state MASTER              # 节点角色，MASTER 或 BACKUP
    interface eth0            # 绑定的网络接口
    virtual_router_id 51      # VRRP 实例 ID，主备必须一致
    priority 100              # 节点优先级 (MASTER 优先级 > BACKUP)
    advert_int 1              # VRRP 心跳间隔秒数
    authentication {
        auth_type PASS        # 验证类型 (PASS 或 AH)
        auth_pass 123456      # 验证密码
    }
    virtual_ipaddress {
        192.168.1.100        # 配置的 VIP
    }
}
```

---

## 5. Keepalived 工作机制与原理

### 5.1 虚拟路由冗余协议 (VRRP)

1. **Master 节点**：
   - 持有 VIP 并响应 ARP 请求。
   - 通过心跳广播优先级给 Backup 节点。

2. **Backup 节点**：
   - 收到 Heartbeat 后进入备份模式。
   - 如果未收到 Master 的广播，则自动提升为 Master，并接管 VIP。

---

### 5.2 Heartbeat 心跳机制

- 主节点通过 VRRP 广播广告包。
- 如果备节点未检测到广播，则触发选举。
- 选举规则：
  - 优先级最高的节点接管 VIP。
  - 优先级相同时，选择 IP 最大的节点。

---

## 6. Keepalived 常见使用场景

### 6.1 NGINX/Haproxy 高可用

**目标**：实现 NGINX 或 Haproxy 负载均衡服务的高可用性。

配置文件示例：
```conf
vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 100
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass 123456
    }
    virtual_ipaddress {
        192.168.1.100
    }
}

# 检测 NGINX 服务是否正常
track_script {
    chk_nginx
}

# 定义 NGINX 健康检查脚本
vrrp_script chk_nginx {
    script "/usr/bin/pgrep nginx"
    interval 2
}
```

---

### 6.2 MySQL 高可用

**目标**：通过 Keepalived 监控 MySQL 主节点状态，并切换 Backup 节点以保持服务可用。

---

## 7. Keepalived 高级配置与功能

### 7.1 Track Script（脚本跟踪）

Keepalived 可结合脚本来检测服务的健康状态。例如：
```conf
vrrp_script chk_service {
    script "/path/to/health-check.sh"
    interval 2
}
```

---

### 7.2 权重调节

动态调整备节点权重，提高灵活性：
```conf
vrrp_script chk_load {
    script "/path/to/check_load.sh"
    interval 2
    weight -10
}
```

---

## 8. Keepalived 性能调优

1. **减少广播周期**：
   将 `advert_int` 从默认值调低：
   ```conf
   advert_int 1  # 设置为1秒
   ```

2. **绑定网卡接口**：
   指定实际通信的网卡：
   ```conf
   interface eth0
   ```

3. **优化脚本检查**：
   减少脚本运行频率，降低 CPU 开销。

---

## 9. Keepalived 常见问题与排查

### 问题一：VIP 未漂移

**原因**：可能是网卡未接管 ARP 广播。

**解决**：
编辑 `/etc/sysctl.conf`，启用 IP 转发：
```bash
net.ipv4.ip_forward = 1
```
并应用：
```bash
sudo sysctl -p
```

---

### 问题二：备节点优先级不生效

**解决**：确保 `priority` 配置合理，主备间有明显差异。

---

## 10. 总结

Keepalived 是一种轻量级且高效的高可用解决方案。它以 VRRP 协议为核心，通过健康检查和主备切换，提供了稳定的高可用架构支持。结合 NGINX、Haproxy 和 MySQL 等工具，能够有效避免系统的单点故障问题。