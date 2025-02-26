---
title: JWT
category:
  - Java
tag:
  - SpringCloudAlibaba
---


在微服务架构中，用户认证和授权是保证系统安全的关键环节。**JWT** (JSON Web Token) 是一种流行的无状态认证机制，常用于用户登录态管理。然而，JWT 自生成后不可被修改，如何实现其有效期动态刷新是一大挑战。

通过集成 **Redis**，我们可以在分布式系统中高效地管理 JWT 的存储和黑名单机制，从而实现更安全、灵活的认证体系。

<!-- more -->

## 目录

1. [JWT 和 Redis 简介](#1-jwt-和-redis-简介)
2. [适用场景](#2-适用场景)
3. [开发准备](#3-开发准备)
4. [项目架构](#4-项目架构)
5. [技术实现](#5-技术实现)
    - **5.1 JWT 的生成与验证**
    - **5.2 Redis 的应用：存储和黑名单**
    - **5.3 用户登录与登出流程**
6. [测试 JWT 认证](#6-测试-jwt-认证)
7. [扩展与优化](#7-扩展与优化)
8. [总结](#8-总结)

---

## 1. JWT 和 Redis 简介

### 1.1 什么是 JWT？

JWT 是一种无状态的令牌认证机制，由以下三部分组成：
1. **Header** (头部)：包含令牌类型和签名算法。
2. **Payload** (载荷)：存储用户信息和自定义数据。
3. **Signature** (签名)：对头部和载荷签名以确保数据完整性。

JWT 的典型格式为：`Header.Payload.Signature`

### 1.2 为什么使用 Redis？

由于 JWT 是无状态的，服务端默认无法使其失效。结合 Redis，可以在以下方面增强 JWT 安全性：
1. **存储 JWT 黑名单**：支持服务端即时注销令牌。
2. **刷新有效期**：记录活跃用户的最新令牌有效期。
3. **分布式支持**：多节点之间共享认证状态。

---

## 2. 适用场景

1. **单点登录系统**：
   - 客户端登录后获取 JWT，用于后续服务调用认证。
2. **分布式微服务认证**：
   - 多个服务共享 Redis 中保存的授权和用户状态。
3. **动态注销**：
   - 实现某些特殊场景下即时令牌失效（例如管理员强制下线）。

---

## 3. 开发准备

在开发前需要准备以下环境：
1. **JDK 8+**。
2. **Spring Boot** 和 **Spring Cloud Alibaba** 微服务框架。
3. **Redis 服务**：
   - 使用 Docker 启动 Redis：
     ```bash
     docker run -d --name redis -p 6379:6379 redis
     ```

---

## 4. 项目架构

本项目由以下组件组成：

```
[客户端] <-- JWT --> [微服务] <-- Redis --> [Redis 数据库]
```

1. **客户端**：
   - 提交登录请求并获取 JWT 令牌。
   - 每次调用微服务时携带 Token。
2. **微服务**：
   - 校验 JWT 有效性。
   - 通过 Redis 存储和验证令牌状态。
3. **Redis**：
   - 存储有效 JWT（Key：用户ID，Value：JWT）。
   - 存储 JWT 黑名单或过期标记。

---

## 5. 技术实现

### 5.1 JWT 的生成与验证

#### 5.1.1 添加依赖

在 `pom.xml` 中添加以下依赖：

```xml
<dependencies>
    <!-- Spring Boot Starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Spring Boot Starter Redis -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>

    <!-- JSON Web Token (JWT) -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
        <version>0.9.1</version>
    </dependency>
</dependencies>
```

---

#### 5.1.2 JWT 工具类

实现 JWT 的生成和校验：

```java
import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "your_secret_key"; // 秘钥
    private static final long EXPIRATION_TIME = 60 * 60 * 1000; // 1小时

    // 生成 JWT
    public String generateToken(String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // 校验 JWT
    public Claims validateToken(String token) throws JwtException {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}
```

---

### 5.2 Redis 的应用：存储和黑名单

#### 5.2.1 配置 Redis

在 `application.yml` 中配置 Redis：

```yaml
spring:
  redis:
    host: localhost
    port: 6379
```

---

#### 5.2.2 实现 Redis 操作工具类

用于存储和校验 JWT 的状态。

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class RedisUtil {

    @Autowired
    private StringRedisTemplate redisTemplate;

    // 将 token 存入 Redis
    public void storeToken(String userId, String token, long duration) {
        redisTemplate.opsForValue().set("TOKEN:" + userId, token, duration, TimeUnit.MILLISECONDS);
    }

    // 从 Redis 中获取 token
    public String getToken(String userId) {
        return redisTemplate.opsForValue().get("TOKEN:" + userId);
    }

    // 标记为黑名单
    public void addToBlacklist(String token) {
        redisTemplate.opsForValue().set("BLACKLIST:" + token, "true", 1, TimeUnit.DAYS);
    }

    // 检查是否在黑名单
    public boolean isBlacklisted(String token) {
        return redisTemplate.hasKey("BLACKLIST:" + token);
    }
}
```

---

### 5.3 用户登录与登出流程

#### 5.3.1 登录接口

用户登录时，生成 JWT 并存储至 Redis：

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RedisUtil redisUtil;

    // 登录接口
    @PostMapping("/login")
    public String login(@RequestParam String userId) {
        String token = jwtUtil.generateToken(userId);
        redisUtil.storeToken(userId, token, 60 * 60 * 1000); // 存储到 Redis，1 小时有效期
        return token;
    }

    // 校验接口
    @GetMapping("/validate")
    public String validateToken(@RequestHeader("Authorization") String token) {
        if (redisUtil.isBlacklisted(token)) {
            return "Token is invalid (blacklisted)";
        }
        try {
            jwtUtil.validateToken(token);
            return "Token is valid";
        } catch (Exception e) {
            return "Token is invalid or expired";
        }
    }
}
```

#### 5.3.2 登出接口

用户登出时，将 JWT 加入 Redis 黑名单。

```java
@PostMapping("/logout")
public String logout(@RequestHeader("Authorization") String token) {
    redisUtil.addToBlacklist(token);
    return "Logged out successfully";
}
```

---

## 6. 测试 JWT 认证

### 6.1 流程测试

1. **登录**：
   - 调用 `/auth/login`，获取 JWT 令牌。
2. **认证**：
   - 调用 `/auth/validate`，携带 Token 验证其有效性。
3. **登出**：
   - 调用 `/auth/logout`，使 Token 失效。
4. **验证失效**：
   - 再次调用 `/auth/validate`，应提示 Token 已失效。

### 6.2 黑名单验证

确保将 Token 加入黑名单后，无法再通过认证。

---

## 7. 扩展与优化

1. **刷新机制**：
   - 增加 Refresh Token 实现令牌刷新，防止长期有效 Token 被滥用。
2. **分布式认证缓存**：
   - 使用 Redis 集群提高分布式系统的可靠性和性能。
3. **权限管理**：
   - 在 JWT 中包含角色和权限信息，结合微服务网关 (Spring Cloud Gateway) 实现路径级别的权限校验。
4. **异步清理**：
   - 设置黑名单的过期时间，避免冗余存储。

---

## 8. 总结

通过集成 Redis 和 JWT，我们实现了微服务架构下的一套完整的分布式认证解决方案。这种结合不仅提高了系统认证的效率和安全性，还为动态令牌管理提供了更多的可能性。
