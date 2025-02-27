---
title: Activiti
category:
  - Java
tag:
  - SpringCloudAlibaba
---

业务流程管理（BPM, Business Process Management）在复杂业务场景中能够显著提升流程的自动化和可管理性。Activiti 是一个轻量级的工作流引擎，可以与 Spring Cloud Alibaba 微服务体系深度集成，用于构建灵活的业务流程管理系统。

通过本文，您将学会在 Spring Cloud Alibaba 微服务架构中集成 Activiti，并实现基本的流程开发和操作。
<!-- more -->

## 目录

1. [Activiti 简介](#1-activiti-简介)
2. [使用场景](#2-使用场景)
3. [开发准备](#3-开发准备)
4. [项目架构与依赖](#4-项目架构与依赖)
    - **4.1 添加依赖**
    - **4.2 配置数据库**
5. [核心功能实现](#5-核心功能实现)
    - **5.1 流程文件定义**
    - **5.2 部署流程**
    - **5.3 启动流程实例**
    - **5.4 查询任务**
    - **5.5 完成任务**
6. [测试流程功能](#6-测试流程功能)
7. [优化与扩展](#7-优化与扩展)
8. [总结](#8-总结)

---

## 1. Activiti 简介

Activiti 是一个开源的、分布式的工作流引擎，能够帮助开发者定义、执行和管理业务流程。它基于 BPMN 2.0（业务流程模型与标注）标准，实现了对流程的全面管理，包括：
- 流程定义和部署。
- 流程实例的启动和中断。
- 任务分配、任务查询和任务完成。
- 数据持久化和状态查询。

### 核心组件
- **流程定义（Process Definition）**：使用 BPMN 2.0 描述流程。
- **流程实例（Process Instance）**：流程定义的运行时表现。
- **任务（Task）**：流程中需要完成的工作单元。
- **用户与组（User and Group）**：任务由特定的用户或用户组负责处理。

---

## 2. 使用场景

以下是 Activiti 适用的典型业务场景：
1. **审批系统**：
   - 比如请假审批、合同审批、费用报销审批等。
2. **订单流程**：
   - 多步订单处理（下单、支付、分发、发货、确认收货）。
3. **任务调度**：
   - 自动化流水线的任务管理与调度。
4. **事件驱动系统**：
   - 对触发的业务事件制定处理流程。

---

## 3. 开发准备

在开始之前，确保已完成以下准备工作：
1. **JDK 1.8+**
2. **MySQL 数据库**：
   - Activiti 需要持久化流程运行状态，建议使用 MySQL 作为数据库。
3. **Spring Boot/Spring Cloud 项目基础搭建**：
   - 集成 Spring Cloud Alibaba，确保微服务环境可运行。

---

## 4. 项目架构与依赖

### 4.1 添加依赖

在项目的 `pom.xml` 中添加 Activiti 和其他必要依赖：

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Boot Starter Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- MySQL Driver -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>

    <!-- Activiti Core -->
    <dependency>
        <groupId>org.activiti</groupId>
        <artifactId>activiti-engine</artifactId>
        <version>7.1.0.M6</version>
    </dependency>

    <!-- Activiti Spring Boot Starter -->
    <dependency>
        <groupId>org.activiti</groupId>
        <artifactId>activiti-spring-boot-starter</artifactId>
        <version>7.1.0.M6</version>
    </dependency>
</dependencies>
```

---

### 4.2 配置数据库

为 Activiti 配置数据源，确保流程信息能够持久化。以下是 `application.yml` 的示例配置：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/activiti_db?useUnicode=true&characterEncoding=utf-8&serverTimezone=UTC
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

# Activiti 配置
activiti:
  database-schema-update: true # 自动更新数据库结构
```

初始化时，Activiti 会自动生成所需的数据库表。

---

## 5. 核心功能实现

### 5.1 流程文件定义

使用 BPMN 2.0 格式定义一个简单的审批流程。保存为 `leave-application.bpmn20.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <process id="leaveProcess" name="Leave Application Process" isExecutable="true">
    <startEvent id="startEvent" name="Start"></startEvent>
    <userTask id="approveTask" name="Approve Leave" />
    <endEvent id="endEvent" name="End"></endEvent>

    <sequenceFlow id="flow1" sourceRef="startEvent" targetRef="approveTask" />
    <sequenceFlow id="flow2" sourceRef="approveTask" targetRef="endEvent" />
  </process>
</definitions>
```

---

### 5.2 部署流程

编写流程部署代码，将 BPMN 文件部署至 Activiti 中：

```java
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProcessDeploymentService {

    @Autowired
    private RepositoryService repositoryService;

    public void deployProcess() {
        Deployment deployment = repositoryService.createDeployment()
                .addClasspathResource("leave-application.bpmn20.xml")
                .name("Leave Application Deployment")
                .deploy();
        System.out.println("Process deployed: " + deployment.getId());
    }
}
```

---

### 5.3 启动流程实例

启动一个流程实例：

```java
import org.activiti.engine.RuntimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProcessInstanceService {

    @Autowired
    private RuntimeService runtimeService;

    public void startProcessInstance(String processKey) {
        runtimeService.startProcessInstanceByKey(processKey);
        System.out.println("Process instance started for key: " + processKey);
    }
}
```

---

### 5.4 查询任务

获取当前待处理的用户任务：

```java
import org.activiti.engine.TaskService;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskQueryService {

    @Autowired
    private TaskService taskService;

    public List<Task> getTasks(String processKey) {
        return taskService.createTaskQuery().processDefinitionKey(processKey).list();
    }
}
```

---

### 5.5 完成任务

完成指定任务：

```java
import org.activiti.engine.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TaskCompletionService {

    @Autowired
    private TaskService taskService;

    public void completeTask(String taskId) {
        taskService.complete(taskId);
        System.out.println("Task completed: " + taskId);
    }
}
```

---

## 6. 测试流程功能

1. **部署流程文件**：
   调用 `ProcessDeploymentService.deployProcess()` 部署流程。

2. **启动流程实例**：
   调用 `ProcessInstanceService.startProcessInstance("leaveProcess")` 启动流程实例。

3. **查询任务**：
   调用 `TaskQueryService.getTasks("leaveProcess")` 查询当前任务。

4. **完成任务**：
   调用 `TaskCompletionService.completeTask(taskId)` 完成指定任务。

---

## 7. 优化与扩展

1. **动态流程设计**：
   - 使用 Flowable 或前端流程设计器，动态创建和管理 BPMN 模型。
2. **微服务分离**：
   - 将任务分配给不同的 Spring Cloud 服务。
3. **多租户支持**：
   - 引入多租户机制支持不同用户组的流程隔离。
4. **任务分配规则**：
   - 动态分配任务到用户组或指定用户。

---

## 8. 总结

将 Activiti 集成进 Spring Cloud Alibaba 微服务体系中，为复杂的业务流程提供了极大的灵活性和高效性管理能力。通过部署、启动和管理流程实例，快速实现了业务流自动化。

未来可以通过扩展支持更加复杂的流程场景，如多分支审批、条件网关等，进一步强化系统的业务能力。
