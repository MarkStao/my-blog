---
title: Nacos
category:
  - Java
tag:
  - SpringCloudAlibaba
---

在当前互联网应用中，短信服务（SMS）作为一种快捷的通知和身份验证手段，被广泛应用于各种业务场景中，如用户验证、订单通知、告警提醒等。通过 Spring Cloud Alibaba，可以轻松集成并实现与 SMS 平台的对接，支持多种短信网关，如阿里云、腾讯云、华为云、以及第三方短信服务商。

<!-- more -->

## 目录

1. [SMS 服务简介](#1-sms服务简介)
2. [常见短信平台对比](#2-常见短信平台对比)
3. [环境准备](#3-环境准备)
4. [SMS 集成流程](#4-sms-集成流程)
    - **4.1 添加依赖**
    - **4.2 配置短信服务**
    - **4.3 编写发送短信服务**
5. [代码实现](#5-代码实现)
6. [测试短信服务](#6-测试短信服务)
7. [总结](#7-总结)

---

## 1. SMS 服务简介

SMS（Short Message Service，短消息服务）是通过移动网络将文字信息发送到接收设备（如手机）的服务。常见的 SMS 应用场景包括：

1. **验证码服务**：用户注册、登录双因素验证、找回密码。
2. **系统通知**：订单状态更新、支付成功通知。
3. **营销推广**：针对用户发送精准的促销或品牌信息。

### 短信平台功能
大部分短信平台提供以下功能：
- 支持单条或批量发送短信。
- 模板化短信（如验证码短信）。
- 支持国内国际短信。
- 短信状态回调。

---

## 2. 常见短信平台对比

| 平台       | 功能特点                          | 费用                                   |
|------------|----------------------------------|---------------------------------------|
| 阿里云短信 | 丰富的模板短信、验证码接口        | 按发送条数计费，国内短信较经济         |
| 腾讯云 SMS | 国内与国际短信支持好，发送稳定    | 按地域收费，支持大批量短信发送         |
| 华为云短信 | 支持语音短信，国内短信较经济      | 配置稍显复杂                           |
| 网易云信   | 提供 IM 和短信整合服务            | 价格略高，但支持即时通信                |

---

## 3. 环境准备

在集成 SMS 前，请确认以下环境已经配置好：

1. **JDK 1.8+**
2. **Spring Boot 2.6+**（带 Spring Cloud 的支持）。
3. **短信平台账号**：
   - 注册阿里云或其他短信平台账号，获取 Access Key 和 Secret。

---

## 4. SMS 集成流程

### 4.1 添加依赖

通过 Maven 添加短信服务所需的基础依赖。以下是以阿里云短信服务为例的依赖：

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- 阿里云短信 SDK -->
    <dependency>
        <groupId>com.aliyun</groupId>
        <artifactId>aliyun-java-sdk-core</artifactId>
        <version>4.6.0</version>
    </dependency>

    <!-- 阿里云短信服务接口 -->
    <dependency>
        <groupId>com.aliyun</groupId>
        <artifactId>aliyun-java-sdk-dysmsapi</artifactId>
        <version>2.0.0</version>
    </dependency>
</dependencies>
```

### 4.2 配置短信服务

在 `application.yml` 中配置短信服务信息，包括 Access Key、Secret 和短信模板：

```yaml
sms:
  aliyun:
    access-key-id: your-access-key-id       # 替换为你的阿里云 AccessKeyId
    access-key-secret: your-access-key-secret # 替换为你的阿里云 AccessKeySecret
    sign-name: "YourSignName"                # 替换为你的短信签名
    template-code: "YourTemplateCode"        # 替换为短信模板 code
```

### 4.3 编写短信发送服务

短信发送服务需要处理以下功能：
- 初始化短信服务客户端。
- 调用短信发送 API 并处理返回值。
- 处理异常，如签名错误、余额不足等。

---

## 5. 代码实现

### 5.1 创建短信发送服务类

以下是基于阿里云短信服务的简单实现：

```java
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsRequest;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${sms.aliyun.access-key-id}")
    private String accessKeyId;

    @Value("${sms.aliyun.access-key-secret}")
    private String accessKeySecret;

    @Value("${sms.aliyun.sign-name}")
    private String signName;

    @Value("${sms.aliyun.template-code}")
    private String templateCode;

    public boolean sendSms(String phoneNumber, String code) {
        try {
            // 配置短信客户端
            DefaultProfile profile = DefaultProfile.getProfile("cn-hangzhou", accessKeyId, accessKeySecret);
            IAcsClient client = new DefaultAcsClient(profile);

            // 构建短信发送请求
            SendSmsRequest request = new SendSmsRequest();
            request.setPhoneNumbers(phoneNumber);        // 设置目标手机号
            request.setSignName(signName);              // 短信签名
            request.setTemplateCode(templateCode);      // 短信模板
            request.setTemplateParam("{\"code\":\"" + code + "\"}"); // 模板参数（如验证码）

            // 发送短信并返回结果
            SendSmsResponse response = client.getAcsResponse(request);

            return "OK".equals(response.getCode());     // 判断发送结果是否成功
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
```

### 5.2 创建 Controller

Controller 用于接收前端请求并触发短信发送功能：

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SmsController {

    @Autowired
    private SmsService smsService;

    @GetMapping("/sendSms")
    public String sendSms(@RequestParam String phoneNumber, @RequestParam String code) {
        boolean success = smsService.sendSms(phoneNumber, code);
        return success ? "SMS sent successfully!" : "Failed to send SMS.";
    }
}
```

---

## 6. 测试短信服务

1. 启动 Spring Boot 应用。
2. 通过 HTTP 请求测试接口：
   ```
   GET http://localhost:8080/sendSms?phoneNumber=13800138000&code=123456
   ```
3. 查看日志输出或短信接收状态。

---

## 7. 总结

通过 Spring Cloud Alibaba 集成短信服务，可以轻松实现对短信网关的调用。本文基于阿里云短信服务实现了：
- 发送模板短信。
- 使用短信验证码的简单场景。

### 扩展阅读
1. 对接更多短信平台（腾讯云、华为云等）。
2. 支持短信状态回调接口，用于处理短信状态报告。
3. 集成短信服务与业务场景，如用户注册、订单通知等。

无论是用作身份验证，还是通知服务，短信仍然是微服务体系中的一个重要组成部分。通过本文的示例，可以快速实现短信发送服务，提高系统运营效率和用户体验。
