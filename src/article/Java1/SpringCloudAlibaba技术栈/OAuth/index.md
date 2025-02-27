---
title: OAuth 2.0
category:
  - Java
tag:
  - SpringCloudAlibaba
  - 微服务安全
---

在微服务架构中，保障服务间的安全通信是核心需求。本文将详细讲解如何通过 **Spring Cloud Alibaba** 集成 **OAuth 2.0**，实现统一认证授权、保护微服务接口，并结合Nacos、Gateway等组件构建安全链路。

<!-- more -->

---

## 目录

1. [核心概念](#1-核心概念)
2. [环境准备](#2-环境准备)
3. [搭建认证服务器](#3-搭建认证服务器)
4. [资源服务器配置](#4-资源服务器配置)
5. [网关统一鉴权](#5-网关统一鉴权)
6. [服务间安全通信](#6-服务间安全通信)
7. [测试与验证](#7-测试与验证)
8. [常见问题与优化](#8-常见问题与优化)
9. [总结](#9-总结)

---

## 1. 核心概念

### 1.1 OAuth 2.0 角色

| 角色                | 说明                                                                 |
|---------------------|----------------------------------------------------------------------|
| **授权服务器**       | 负责发放访问令牌（如 `/oauth/token`），通常单独部署                   |
| **资源服务器**       | 存储用户资源，验证令牌后允许访问（如用户订单服务）                     |
| **客户端应用**       | 请求资源的第三方应用（Web/移动端）                                     |
| **资源拥有者**       | 用户本人，授权客户端访问其资源                                        |

### 1.2 授权模式选择

| 模式           | 适用场景                           |
|----------------|----------------------------------|
| **授权码模式**  | Web服务端应用（最安全）             |
| **密码模式**    | 受信任的客户端（内部系统，已弃用）   |
| **客户端模式**  | 服务端与服务端通信（无用户参与）     |

---

## 2. 环境准备

### 2.1 依赖项（`pom.xml`）

确保 Spring Boot、Spring Cloud Alibaba 与 OAuth2 版本兼容：

```xml
<!-- Spring Cloud Alibaba 基础依赖 -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    <version>2021.1</version>
</dependency>

<!-- OAuth2 支持（使用Spring Authorization Server替代旧版） -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-authorization-server</artifactId>
    <version>0.4.2</version> <!-- 实际版本需与Spring Boot对齐 -->
</dependency>

<!-- JWT令牌支持 -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-jose</artifactId>
</dependency>
```

---

## 3. 搭建认证服务器

### 3.1 认证服务配置类

```java
@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtAccessTokenConverter jwtAccessTokenConverter;

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory()
            .withClient("web-client")
            .secret("{noop}web-secret") // "{noop}"表示明文密码
            .authorizedGrantTypes("authorization_code", "refresh_token")
            .scopes("all")
            .redirectUris("http://localhost:8080/login/oauth2/code/");
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) {
        endpoints
            .authenticationManager(authenticationManager)
            .accessTokenConverter(jwtAccessTokenConverter);
    }

    @Bean
    public JwtAccessTokenConverter jwtAccessTokenConverter() {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setSigningKey("my-secret-key-123"); // JWT签名密钥
        return converter;
    }
}
```

---

## 4. 资源服务器配置

保护微服务API，验证Token有效性：

```java
@Configuration
@EnableResourceServer
public class ResourceServerConfig extends ResourceServerConfigurerAdapter {

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            .antMatchers("/api/public/**").permitAll()
            .antMatchers("/api/private/**").authenticated();
    }

    @Bean
    public JwtAccessTokenConverter accessTokenConverter() {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setSigningKey("my-secret-key-123");
        return converter;
    }
}
```

---

## 5. 网关统一鉴权

通过 **Spring Cloud Gateway** 网关拦截请求，验证Token并转发至下游服务。

### 5.1 网关过滤器配置

```java
@Configuration
public class GatewaySecurityConfig {

    @Bean
    public GlobalFilter customFilter() {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String token = request.getHeaders().getFirst("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                return unauthorized(exchange, "Missing Token");
            }
            // 调用认证服务验证Token有效性（可结合Nacos服务发现）
            return chain.filter(exchange);
        };
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().writeWith(Mono.just(
            exchange.getResponse().bufferFactory().wrap(message.getBytes())
        ));
    }
}
```

---

## 6. 服务间安全通信

使用 **Feign Client** 传递Token至下游服务：

### 6.1 Feign拦截器设置Token

```java
@Bean
public RequestInterceptor oauth2FeignInterceptor() {
    return requestTemplate -> {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication instanceof OAuth2Authentication) {
            OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) authentication.getDetails();
            requestTemplate.header("Authorization", "Bearer " + details.getTokenValue());
        }
    };
}
```

---

## 7. 测试与验证

### 7.1 获取令牌（密码模式）

```bash
curl -X POST \
  http://auth-service/oauth/token \
  -H 'Authorization: Basic d2ViLWNsaWVudDp3ZWItc2VjcmV0' \ # client:secret的Base64
  -d 'grant_type=password&username=admin&password=123456&scope=all'
```

响应示例：

```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
    "token_type": "bearer",
    "expires_in": 3600,
    "scope": "all"
}
```

### 7.2 访问受保护接口

```bash
curl -X GET http://api-service/api/private/user \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn...'
```

---

## 8. 常见问题与优化

### 8.1 Token存储优化

- **推荐方案**：使用Redis集中存储令牌，支持集群环境。

```yaml
spring:
  redis:
    host: localhost
    port: 6379
```

配置TokenStore：

```java
@Bean
public TokenStore tokenStore(RedisConnectionFactory connectionFactory) {
    return new RedisTokenStore(connectionFactory);
}
```

### 8.2 JWT密钥管理

- **生产建议**：采用非对称加密（RSA），密钥由Nacos配置中心动态下发。

---

## 9. 总结

集成方案关键点：

1. **职责分离**：认证服务器与资源服务器独立部署，便于扩展。
2. **安全加固**：网关统一鉴权，避免安全漏洞分散。
3. **服务治理**：结合Nacos实现服务发现，动态调整安全策略。

通过本指南，可实现基于Spring Cloud Alibaba的OAuth2完整安全体系，适用于企业级微服务架构。