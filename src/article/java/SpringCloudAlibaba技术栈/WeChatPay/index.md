---
title: 微信支付
category:
  - Java
tag:
  - SpringCloudAlibaba
---


微信支付（WeChat Pay）是一个广泛使用的支付平台，为个人、企业、微服务架构提供快速、便捷、安全的支付解决方案。通过 Spring Cloud Alibaba 集成微信支付，可以快速实现商户收款、用户支付、订单管理等功能，并支持多种支付场景，如扫码支付、小程序支付、网页支付、APP 支付等。

本文将介绍如何在 Spring Cloud Alibaba 项目中集成微信支付，并实现基础的支付接口开发。

<!-- more -->

## 目录

1. [微信支付简介](#1-微信支付简介)
2. [开发准备](#2-开发准备)
3. [微信支付基础流程](#3-微信支付基础流程)
4. [项目架构与依赖](#4-项目架构与依赖)
    - **4.1 添加依赖**
    - **4.2 配置微信支付信息**
5. [核心功能实现](#5-核心功能实现)
    - **5.1 统一下单接口**
    - **5.2 支付回调通知**
6. [测试微信支付功能](#6-测试微信支付功能)
7. [优化与扩展](#7-优化与扩展)
8. [总结](#8-总结)

---

## 1. 微信支付简介

### 核心功能
微信支付提供了以下主要功能：
- **支付功能**：支持扫码支付、JSAPI 支付、小程序支付、App 支付等多终端支付模式。
- **订单管理**：查询订单、关闭订单、退款管理。
- **安全保障**：包含签名验证、证书校验，保障支付安全。
- **回调机制**：支付状态回调通知支持异步和同步协议。

### 使用场景
- 电商平台消费下单与支付。
- 服务型平台的会员订阅或打赏功能。
- 小程序、H5 页面以及 App 在线支付解决方案。

---

## 2. 开发准备

在开始开发前，需要准备以下内容：

### 2.1 微信支付商户平台
1. **注册微信商户号**：
   - 登录 [微信支付商户平台](https://pay.weixin.qq.com/)。
   - 获取商户号（`mch_id`）和 API 密钥（`API Key`）。
2. **设置 API V3 密钥**：
   - 登录商户平台，生成并记录 API V3 密钥。
3. **下载平台证书**：
   - 获取微信支付的 API 平台证书（如 `apiclient_cert.pem` 和 `apiclient_key.pem`）。

### 2.2 微信支付开发文档
官方文档：
- [微信支付 API 文档](https://pay.weixin.qq.com/wiki/doc/apiv3/welcome.html)

---

## 3. 微信支付基础流程

微信支付的核心流程如下：
1. 客户端请求支付。
2. 服务端按照微信支付接口要求生成预订单（调用 **统一下单接口**）。
3. 微信支付返回预订单信息（如支付 URL、支付参数等）。
4. 客户端通过返回的支付参数调起支付。
5. 支付完成后，微信服务器通过回调接口通知支付结果。
6. 服务端接收支付回调通知，并更新订单支付状态。

---

## 4. 项目架构与依赖

### 4.1 添加依赖

首先，在 `pom.xml` 中添加项目所需依赖：

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- 微信支付 SDK -->
    <dependency>
        <groupId>com.github.binarywang</groupId>
        <artifactId>weixin-java-pay</artifactId>
        <version>4.5.6</version>
    </dependency>

    <!-- JSON 处理 -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>
</dependencies>
```

---

### 4.2 配置微信支付信息

在 `application.yml` 中配置微信支付的参数：

```yaml
wechat:
  pay:
    mch-id: "your_mch_id"            # 商户号
    app-id: "your_app_id"            # 公众账号ID或小程序ID
    mch-key: "your_api_key"          # API密钥
    notify-url: "https://yourdomain.com/pay/notify" # 异步回调通知地址
    cert-path: "/path/to/apiclient_cert.p12"       # 微信支付证书路径（可选）
```

---

## 5. 核心功能实现

### 5.1 统一下单接口

统一下单接口用于生成预订单，以下是实现代码：

```java
import com.github.binarywang.wxpay.config.WxPayConfig;
import com.github.binarywang.wxpay.service.WxPayService;
import com.github.binarywang.wxpay.service.impl.WxPayServiceImpl;
import com.github.binarywang.wxpay.bean.order.WxPayUnifiedOrderRequest;
import com.github.binarywang.wxpay.bean.order.WxPayUnifiedOrderResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WeChatPayService {

    private final WxPayService wxPayService;

    @Autowired
    public WeChatPayService() {
        WxPayConfig payConfig = new WxPayConfig();
        payConfig.setAppId("your_app_id");
        payConfig.setMchId("your_mch_id");
        payConfig.setMchKey("your_api_key");
        payConfig.setNotifyUrl("https://yourdomain.com/pay/notify");
        // 配置证书(可选)
        payConfig.setKeyPath("/path/to/apiclient_cert.p12");

        wxPayService = new WxPayServiceImpl();
        wxPayService.setConfig(payConfig);
    }

    /**
     * 统一下单接口
     */
    public WxPayUnifiedOrderResult createUnifiedOrder(String orderId, String description, int totalFee, String ipAddress) throws Exception {
        WxPayUnifiedOrderRequest request = new WxPayUnifiedOrderRequest();
        request.setOutTradeNo(orderId);          // 商户订单号
        request.setBody(description);           // 商品描述
        request.setTotalFee(totalFee);          // 总金额（单位：分）
        request.setSpbillCreateIp(ipAddress);   // 用户终端IP
        request.setTradeType("NATIVE");         // 支付类型：NATIVE（扫码支付）

        return wxPayService.createOrder(request);
    }
}
```

### 5.2 支付回调通知

在微信支付完成后，微信服务器会发送支付结果通知。以下是实现支付回调的代码：

```java
import com.github.binarywang.wxpay.bean.notify.WxPayOrderNotifyResult;
import com.github.binarywang.wxpay.exception.WxPayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WeChatPayController {

    @Autowired
    private WeChatPayService weChatPayService;

    /**
     * 微信支付回调通知
     */
    @PostMapping("/pay/notify")
    public String handleWeChatPayNotify(@RequestBody String xmlData) {
        try {
            WxPayOrderNotifyResult notifyResult = weChatPayService.getWxPayService().parseOrderNotifyResult(xmlData);

            // 处理通知结果（如更新订单支付状态）
            System.out.println("支付成功，订单号：" + notifyResult.getOutTradeNo());
            return "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
        } catch (WxPayException e) {
            e.printStackTrace();
            return "<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[FAIL]]></return_msg></xml>";
        }
    }
}
```

---

## 6. 测试微信支付功能

1. 启动项目，确保服务可用。
2. 调用统一下单接口：
   ```
   POST http://localhost:8080/pay/unifiedOrder
   Body:
   {
     "orderId": "123456",
     "description": "Test Order",
     "totalFee": 100,
     "ipAddress": "127.0.0.1"
   }
   ```
   返回结果将包含 `code_url`，用于扫码支付。

3. 支付后，微信会发送支付结果通知到回调接口 `/pay/notify`。

---

## 7. 优化与扩展

1. **支持退款功能**：
   - 微信支付 SDK 支持退款接口，可以调用 `WxPayService.refund` 方法实现。
2. **处理支付异常**：
   - 添加签名校验及异常处理机制，提升安全性。
3. **支持多支付环境**：
   - 配置多环境参数（测试和生产），实现灵活切换。
4. **扩展其他支付类型**：
   - 支持微信小程序支付、APP 支付、H5 支付等。

---

## 8. 总结

通过 Spring Cloud Alibaba 和微信支付 SDK 的集成，实现了基础的微信支付功能，包括统一下单、支付回调等。微信支付作为一种高效、安全的支付解决方案，极大丰富了微服务架构的支付场景支持。

未来可以继续拓展其他支付方式（如支付宝、银联支付）及更复杂的支付业务逻辑，提升系统的支付能力。
