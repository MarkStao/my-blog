---
title: Kubernetes知识点
category:
  - Linux
tag:
  - Kubernetes
---

Kubernetes（简称 K8s）是一个开源的分布式容器编排系统，用于自动化应用程序的部署、扩展和管理。它是云原生开发的重要基础，现已成为容器生态系统的标准。

本文全面梳理了 Kubernetes 的核心知识点、重要概念和典型用法，适合学习或随用随查。

<!-- more -->

## 目录

1. [Kubernetes 基础](#1-kubernetes-基础)
2. [Kubernetes 核心组件](#2-kubernetes-核心组件)
3. [Kubernetes 核心概念](#3-kubernetes-核心概念)
4. [Kubernetes 安装](#4-kubernetes-安装)
5. [Kubernetes 集群操作](#5-kubernetes-集群操作)
6. [资源管理](#6-资源管理)
7. [配置与存储](#7-配置与存储)
8. [服务与负载均衡](#8-服务与负载均衡)
9. [应用部署与扩展](#9-应用部署与扩展)
10. [监控与日志](#10-监控与日志)
11. [Kubernetes 高级特性](#11-kubernetes-高级特性)
12. [总结](#12-总结)

---

## 1. Kubernetes 基础

### Kubernetes 是什么？

Kubernetes 是一个用于管理容器化应用的开源平台，核心功能包括：
- 自动化应用部署和管理。
- 动态扩展和高可用性。
- 服务发现与负载均衡。
- 自愈功能（自动恢复失败容器）。

---

## 2. Kubernetes 核心组件

Kubernetes 的架构包括以下核心组件：

### 2.1 Master 节点（控制平面）

| 组件             | 描述                                                   |
|------------------|--------------------------------------------------------|
| `kube-apiserver` | 集群的入口，处理所有 REST API 请求。                     |
| `etcd`           | 集群的分布式键值存储，用于存储所有集群数据。             |
| `kube-scheduler` | 负责将 Pod 分派到适当的工作节点。                        |
| `kube-controller-manager` | 管理集群状态（如节点、Pod、副本等）。            |

### 2.2 Node 节点（工作节点）

| 组件             | 描述                                                   |
|------------------|--------------------------------------------------------|
| `kubelet`        | 运行在每个节点上，负责管理 Pod 的生命周期。              |
| `kube-proxy`     | 维护网络规则，处理服务负载均衡。                         |
| 容器运行时        | 通常是 Docker 或 Containerd，负责启动和运行容器。         |

---

## 3. Kubernetes 核心概念

| 概念              | 描述                                                                 |
|-------------------|----------------------------------------------------------------------|
| **Pod**           | 最小的部署单元，一个或多个容器的抽象，具有共享网络和存储。             |
| **Service**       | 提供 Pod 的统一访问接口，支持负载均衡。                               |
| **Deployment**    | 管理 Pod 的声明式定义，用于实现无缝更新和扩展。                        |
| **Namespace**     | 集群内的逻辑隔离单元，支持多租户。                                    |
| **ConfigMap**     | 用于存储配置信息（非敏感数据）。                                       |
| **Secret**        | 用于存储敏感数据（如密码、证书等）。                                   |
| **Volume**        | 提供数据存储功能（支持持久化卷）。                                     |

---

## 4. Kubernetes 安装

### 安装工具

1. **Minikube**：
   - 适合本地开发和测试。
   - 安装 Minikube：
     ```bash
     curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
     sudo install minikube-linux-amd64 /usr/local/bin/minikube
     minikube start
     ```

2. **kubeadm**：
   - 适合生产环境，快速搭建多节点集群。
   - 初始化集群：
     ```bash
     kubeadm init --pod-network-cidr=192.168.0.0/16
     ```

3. **Kubernetes 云服务**：
   - 使用 Kubernetes 提供商的云服务，如 AKS（Azure）、EKS（AWS）和 GKE（Google）。

---

## 5. Kubernetes 集群操作

### 基本操作

| 操作                                 | 命令                                                        |
|--------------------------------------|-------------------------------------------------------------|
| 检查节点状态                         | `kubectl get nodes`                                         |
| 检查 Pod 状态                        | `kubectl get pods`                                          |
| 检查服务状态                         | `kubectl get services`                                      |
| 查看运行日志                         | `kubectl logs <pod-name>`                                   |
| 查看事件日志                         | `kubectl describe <resource> <name>`                        |
| 删除资源                             | `kubectl delete <resource> <name>`                          |

---

## 6. 资源管理

### Pod

**创建一个 Pod**（`pod.yaml`）：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: nginx-container
      image: nginx:latest
      ports:
        - containerPort: 80
```

应用资源：

```bash
kubectl apply -f pod.yaml
```

---

## 7. 配置与存储

### ConfigMap

**示例**（`configmap.yaml`）：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config
data:
  app.property: "value"
```

挂载到 Pod：

```yaml
env:
  - name: APP_PROPERTY
    valueFrom:
      configMapKeyRef:
        name: my-config
        key: app.property
```

---

### Volume 持久化存储

使用 `PersistentVolume` 和 `PersistentVolumeClaim`：

**PersistentVolume 配置**：

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: my-pv
spec:
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /mnt/data
```

---

## 8. 服务与负载均衡

### Service 类型

| 类型              | 描述                                                   |
|-------------------|--------------------------------------------------------|
| `ClusterIP`       | 集群内访问的默认服务类型。                               |
| `NodePort`        | 在每个节点打开特定端口以供访问。                         |
| `LoadBalancer`    | 使用云提供商的负载均衡器公开服务。                        |

**Service 配置示例**：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
      nodePort: 30001
```

---

## 9. 应用部署与扩展

### Deployment

**创建 Deployment**（`deployment.yaml`）：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
```

扩展副本数：

```bash
kubectl scale deployment my-deployment --replicas=5
```

---

## 10. 监控与日志

### 查看日志

查看 Pod 日志：

```bash
kubectl logs <pod-name>
```

### 集群监控工具

1. **Prometheus + Grafana**：用于监控指标。
2. **ELK 堆栈**：用于日志聚合。
3. **Kubernetes Dashboard**：提供 Web UI 集群管理界面。

---

## 11. Kubernetes 高级特性

### 自愈能力

Kubernetes 会自动重启崩溃的容器或重新调度被驱逐的 Pod。

### 水平弹性扩展 (HPA)

**应用自动扩展**：

```bash
kubectl autoscale deployment my-deployment --min=1 --max=10 --cpu-percent=80
```

### 网络策略

定义网络访问控制：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-http
spec:
  podSelector:
    matchLabels:
      app: my-app
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 80
```

---

## 12. 总结

Kubernetes 提供了强大的容器编排功能，它不仅可以简化容器化应用的部署、扩展和维护，还为实现云原生应用奠定了基础。通过本文，你可以快速了解 Kubernetes 的核心知识点和操作。如果要深入学习，建议参考 [Kubernetes 官方文档](https://kubernetes.io/)。
