---
title: Spring Boot YAML配置
category:
  - Java
tag:
  - YAML
---


Spring Boot 提供了强大的配置机制，允许开发者通过 `application.yml` 文件对应用程序的行为进行全面的控制和调整。本文将对 Spring Boot 的常用 YAML 配置项进行全面讲解，帮助开发者构建更加灵活且易于维护的配置文件。

<!-- more -->

## 目录

1. [Spring Boot 配置文件基础](#1-spring-boot-配置文件基础)
2. [核心配置](#2-核心配置)
3. [日志配置](#3-日志配置)
4. [Web 服务器配置](#4-web-服务器配置)
5. [数据源配置](#5-数据源配置)
6. [JPA 配置](#6-jpa-配置)
7. [缓存配置](#7-缓存配置)
8. [国际化配置](#8-国际化配置)
9. [邮件服务配置](#9-邮件服务配置)
10. [自定义配置](#10-自定义配置)
11. [使用示例](#11-使用示例)
12. [总结](#12-总结)

---

## 1. Spring Boot 配置文件基础

Spring Boot 的配置文件可以使用以下文件格式：
- **application.properties**
- **application.yml**

Spring Boot 默认加载路径：
1. `src/main/resources/config/`
2. `src/main/resources/`

### YAML 格式的结构

YAML 使用缩进的形式来表示层级关系，例如：
```yaml
server:
  port: 8080
  servlet:
    context-path: /app
```

---

## 2. 核心配置

Spring Boot 核心配置主要包括应用名称、运行环境和启动优先级等。

```yaml
spring:
  application:
    name: my-application      # 应用名称
  profiles:
    active: prod              # 当前激活的配置文件
  main:
    allow-bean-definition-overriding: false  # 是否允许覆盖 Bean 定义
    banner-mode: "console"    # 启动时 Banner 显示方式 [console, log, off]
```

**说明**：
- `spring.profiles.active` 中的值可以指定不同环境（如开发环境 dev、生产环境 prod 等）。
- `spring.main.banner-mode` 控制启动时是否显示 Banner。

---

## 3. 日志配置

Spring Boot 默认集成了 SLF4J 和 Logback，支持多种日志配置。

```yaml
logging:
  level:
    root: info                # 全局日志级别
    com.example: debug        # 指定包的日志级别
  file:
    name: ./logs/app.log      # 日志文件路径
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} %-5level [%t] %logger{36} - %msg%n" # 控制台日志格式
    file: "%d{yyyy-MM-dd HH:mm:ss} %-5level [%thread] %logger - %msg%n"   # 文件日志格式
```

**说明**：
- `logging.level` 设置日志输出级别：`trace`、`debug`、`info`、`warn`、`error`。
- `logging.file.name` 定义日志文件的存储路径。
- `logging.pattern` 定义日志打印的格式。

---

## 4. Web 服务器配置

Spring Boot 默认嵌入了 Tomcat 作为 Web 服务器，可以通过以下配置调整其行为。

```yaml
server:
  port: 8080                       # 启动端口号
  servlet:
    context-path: /app             # 设置上下文路径
  compression:
    enabled: true                  # 启用 GZIP 压缩
    min-response-size: 1024        # 最小压缩响应大小
    mime-types: text/html,text/xml # 需要压缩的 Mime 类型
  error:
    whitelabel:
      enabled: true                # 是否启用默认错误页面
```

**说明**：
- `server.port` 定义应用程序的运行端口。
- `server.servlet.context-path` 设置 Web 应用的上下文路径，例如 `/api/v1`。
- `server.compression` 可优化性能，通过 GZIP 压缩响应数据。

---

## 5. 数据源配置

Spring Boot 提供内置的数据源支持，支持 MySQL、PostgreSQL 等数据库。

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=UTC
    username: root                     # 数据库用户名
    password: password                 # 数据库密码
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 10            # 数据库连接池最大连接数
      minimum-idle: 5                  # 最小空闲连接数
      idle-timeout: 30000              # 空闲连接超时时间
      connection-timeout: 20000        # 连接超时时间（毫秒）
```

**说明**：
- `spring.datasource` 用于配置数据库连接信息。
- `hikari` 是 Spring Boot 默认的连接池，可配置连接数、超时等。

---

## 6. JPA 配置

Spring Boot 支持 JPA（Java Persistence API），适合于 ORM（对象关系映射）开发。

```yaml
spring:
  jpa:
    database: mysql                      # 指定数据库类型
    show-sql: true                       # 是否打印 SQL 语句
    hibernate:
      ddl-auto: update                   # 自动更新表结构
    properties:
      hibernate:
        format_sql: true                 # 格式化 SQL 输出
```

**说明**：
- `spring.jpa.hibernate.ddl-auto` 控制表结构的自动更新行为，可选值有：`none`、`update`、`create`、`create-drop`。

---

## 7. 缓存配置

Spring Boot 提供多种缓存支持（如 EhCache、Caffeine）。

```yaml
spring:
  cache:
    type: caffeine                      # 缓存类型
    caffeine:
      spec: maximumSize=500,expireAfterAccess=600s
```

**说明**：
- `spring.cache.type` 配置缓存实现类型，如 `caffeine`, `ehcache`, `redis`。
- 可通过 `spec` 自定义缓存的大小和过期时间。

---

## 8. 国际化配置

Spring Boot 提供国际化（i18n）支持，用于为系统提供多语言功能。

```yaml
spring:
  messages:
    basename: messages                  # 指定消息文件的基础名称（`messages.properties` 文件）
    encoding: UTF-8                     # 指定编码方式
    cache-duration: 3600                # 缓存持续时间（秒）
```

**说明**：
- 消息文件通过 `basename` 配置，例如 `messages_en.properties` 为英文版本。

---

## 9. 邮件服务配置

Spring Boot 提供 Email 支持，使用 SMTP 服务发送邮件。

```yaml
spring:
  mail:
    host: smtp.example.com                # 邮件服务器地址
    port: 587                             # 邮件服务器端口
    username: user@example.com            # 邮件服务器用户名
    password: password                    # 邮件服务器密码
    properties:
      mail:
        smtp:
          auth: true                      # 启用 SMTP 身份验证
          starttls.enable: true           # 启用 TLS 安全连接
```

**说明**：
- 配置完成后可通过 JavaMail API 发送邮件。

---

## 10. 自定义配置

开发者可以在 `application.yml` 中定义自定义配置，并在代码中读取。

```yaml
custom:
  app:
    name: MyCustomApp
    version: 1.0.0
```

**代码读取示例**：
```java
@Component
@ConfigurationProperties(prefix = "custom.app")
public class CustomProperties {
    private String name;
    private String version;

    // Getters & Setters
}
```

---

## 11. 使用示例

### Application YAML 示例

```yaml
spring:
  application:
    name: demo-application
  profiles:
    active: dev

server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/testdb
    username: root
    password: rootpassword
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: update

logging:
  level:
    root: info
    com.example: debug
  file:
    name: ./logs/demo-app.log
```

---

## 12. 总结

Spring Boot 的 `application.yml` 文件通过层级结构提供了强大、灵活的配置能力。本文涵盖了 Spring Boot 全量 YAML 配置相关的核心内容，帮助开发者快速入门和掌握。

在实际应用中，根据项目需求合理调整配置项是关键，同时，通过 `spring.profiles.active` 实现不同环境的配置隔离也是推荐的最佳实践。
