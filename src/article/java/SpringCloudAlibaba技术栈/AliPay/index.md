---
title: 支付宝支付
category:
  - Java
tag:
  - SpringCloudAlibaba
---


支付宝（Alipay）是一种用户量广泛、安全、快捷的在线支付工具。通过集成支付宝支付，您可以为电商平台、订阅服务或其他在线业务提供可靠的支付解决方案。支付宝支付支持多种支付场景，如扫码支付、手机网页支付、App 支付等。

本文将介绍如何通过 Spring Cloud Alibaba 集成支付宝支付，并实现核心的支付功能开发。
<!-- more -->

## 目录

1. [支付宝支付简介](#1-支付宝支付简介)
2. [开发准备](#2-开发准备)
3. [支付宝支付基本流程](#3-支付宝支付基本流程)
4. [项目架构与依赖](#4-项目架构与依赖)
    - **4.1 添加依赖**
    - **4.2 配置支付宝支付参数**
5. [核心功能实现](#5-核心功能实现)
    - **5.1 统一收单接口（二维码支付示例）**
    - **5.2 支付结果回调通知**
6. [测试支付宝支付功能](#6-测试支付宝支付功能)
7. [优化与扩展](#7-优化与扩展)
8. [总结](#8-总结)

---

## 1. 支付宝支付简介

支付宝支付提供了以下主要功能：
- 支持 **扫码支付**、**PC 网页支付**、**WAP 手机网页支付** 和 **APP 支付**。
- 提供 **异步回调通知机制**，商户可实时接收支付状态更新。
- 提供 **退款功能**，方便处理售后需求。

### 应用场景
1. 电商平台消费支付。
2. 服务订阅类业务收费。
3. 线上虚拟商品结算。

---

## 2. 开发准备

在开发前，请完成以下准备工作：

### 2.1 支付宝开发平台配置
1. 登录 [支付宝开放平台](https://open.alipay.com/)。
2. 创建一个应用获取以下信息：
   - 商户 AppId。
   - 应用私钥与支付宝公钥。
   - 开启支付服务。
3. 配置异步通知地址（`notify_url`，支付宝用于支付完成后的回调）。

---

## 3. 支付宝支付基本流程

支付宝支付的核心流程如下：
1. 客户端发起支付请求。
2. 服务端调用支付宝 **统一收单交易接口 (alipay.trade.precreate)**，生成支付链接/二维码。
3. 用户完成支付后，支付宝系统通过回调接口通知商户支付结果。
4. 商户服务根据回调结果更新订单支付状态。

---

## 4. 项目架构与依赖

### 4.1 添加依赖

在 `pom.xml` 文件中添加支付宝支付 SDK 相关依赖：

```xml
<dependencies>
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- 支付宝支付 SDK -->
    <dependency>
        <groupId>com.alipay.sdk</groupId>
        <artifactId>alipay-sdk-java</artifactId>
        <version>4.34.0.ALL</version>
    </dependency>

    <!-- JSON 处理 -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>
</dependencies>
```

---

### 4.2 配置支付宝支付参数

在 `application.yml` 文件中添加支付宝支付的配置：

```yaml
alipay:
  app-id: "your_app_id"                     # 支付宝开放平台应用ID
  private-key: "your_alipay_app_private_key" # 应用私钥
  public-key: "your_alipay_public_key"      # 支付宝公钥
  notify-url: "https://yourdomain.com/alipay/notify" # 异步通知地址
  gateway-url: "https://openapi.alipay.com/gateway.do" # 支付宝网关
```

---

## 5. 核心功能实现

### 5.1 统一收单接口（扫码支付示例）

在支付宝支付中，统一收单接口 `alipay.trade.precreate` 用于生成支付订单对应的二维码。

#### 实现支付宝支付服务

```java
import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.request.AlipayTradePrecreateRequest;
import com.alipay.api.response.AlipayTradePrecreateResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AlipayService {

    @Value("${alipay.app-id}")
    private String appId;

    @Value("${alipay.private-key}")
    private String privateKey;

    @Value("${alipay.public-key}")
    private String publicKey;

    @Value("${alipay.gateway-url}")
    private String gatewayUrl;

    @Value("${alipay.notify-url}")
    private String notifyUrl;

    public String createOrder(String orderId, String description, double totalAmount) throws AlipayApiException {
        // 初始化支付宝客户端
        AlipayClient alipayClient = new DefaultAlipayClient(
                gatewayUrl,
                appId,
                privateKey,
                "json",  // 数据格式
                "utf-8", // 编码
                publicKey,
                "RSA2"   // 加密方式
        );

        // 构建请求
        AlipayTradePrecreateRequest request = new AlipayTradePrecreateRequest();
        request.setNotifyUrl(notifyUrl); // 设置异步通知地址
        request.setBizContent("{" +
                "\"out_trade_no\":\"" + orderId + "\"," +
                "\"total_amount\":\"" + totalAmount + "\"," +
                "\"subject\":\"" + description + "\"," +
                "\"store_id\":\"store_001\"," +
                "\"timeout_express\":\"90m\"" +
                "}");

        // 执行请求
        AlipayTradePrecreateResponse response = alipayClient.execute(request);

        if (response.isSuccess()) {
            System.out.println("预创建订单成功，返回二维码链接：" + response.getQrCode());
            return response.getQrCode();
        } else {
            System.out.println("预创建订单失败：" + response.getSubMsg());
            throw new RuntimeException("创建支付宝订单失败：" + response.getSubMsg());
        }
    }
}
```

#### 创建支付接口

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AlipayController {

    @Autowired
    private AlipayService alipayService;

    @GetMapping("/alipay/pay")
    public String pay(@RequestParam String orderId, @RequestParam String description, @RequestParam double amount) {
        try {
            // 调用创建订单服务
            String qrCodeUrl = alipayService.createOrder(orderId, description, amount);
            return "请使用支付宝扫码支付，二维码链接：" + qrCodeUrl;
        } catch (Exception e) {
            e.printStackTrace();
            return "支付接口调用失败：" + e.getMessage();
        }
    }
}
```

---

### 5.2 支付结果回调通知

支付宝支付完成后，系统会向配置的 `notify_url` 地址发送支付结果的异步通知。以下是支付回调接口的实现：

```java
import com.alipay.api.internal.util.AlipaySignature;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class AlipayNotifyController {

    @PostMapping("/alipay/notify")
    public String handleNotify(@RequestParam Map<String, String> params) {
        try {
            // 验签
            boolean signVerified = AlipaySignature.rsaCheckV1(
                    params,
                    "your_alipay_public_key", // 支付宝公钥
                    "utf-8",
                    "RSA2"
            );

            if (signVerified) {
                String tradeStatus = params.get("trade_status");

                if ("TRADE_SUCCESS".equals(tradeStatus)) {
                    // 处理业务逻辑（如更新订单状态等）
                    System.out.println("支付成功，订单号：" + params.get("out_trade_no"));
                }

                return "success";
            } else {
                return "failure";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "failure";
        }
    }
}
```

---

## 6. 测试支付宝支付功能

1. 启动项目服务并确保接口 `/alipay/pay` 可访问。
2. 创建支付订单：
   ```
   GET http://localhost:8080/alipay/pay?orderId=123456&description=TestOrder&amount=10
   ```
   返回的二维码链接可以直接生成二维码进行支付测试。
3. 支付完成后，支付宝会调用 `/alipay/notify` 回调接口。

---

## 7. 优化与扩展

1. **支持退款功能：** 支持 `alipay.trade.refund` 接口用于订单退款。
2. **日志审计：** 记录支付请求与回调日志，便于追溯。
3. **支付类型扩展：** 添加 WAP、PC 等其他支付方式。
4. **支付状态轮询：** 用于避免因回调失败导致状态不一致的问题。

---

## 8. 总结

通过本文介绍的 Spring Cloud Alibaba 集成支付宝支付方式，我们实现了扫码支付功能和支付回调通知。支付宝开放平台提供了强大灵活的功能，可以结合自身业务场景进行拓展和优化。

支付宝支付是构建电商、订阅服务的重要工具。通过它，我们能够改善用户支付体验，并提升业务收入。
