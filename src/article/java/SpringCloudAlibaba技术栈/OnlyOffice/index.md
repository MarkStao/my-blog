---
title: OnlyOffice
category:
  - Java
tag:
  - SpringCloudAlibaba
---

OnlyOffice 是一个强大的开源在线文档管理与协作工具，提供了文档、表格、演示文稿等的在线编辑功能，与 Microsoft Office 格式高度兼容。通过集成 OnlyOffice，开发者可以轻松为自己的应用添加在线文档协作功能，并支持多人实时编辑。

本文将介绍如何通过 Spring Cloud Alibaba 微服务架构集成 OnlyOffice，并实现文档在线编辑功能。

<!-- more -->

## 目录

1. [OnlyOffice 简介](#1-onlyoffice-简介)
2. [使用场景](#2-使用场景)
3. [开发准备](#3-开发准备)
4. [项目架构与依赖](#4-项目架构与依赖)
    - **4.1 服务架构**
    - **4.2 添加依赖**
    - **4.3 配置 OnlyOffice 服务**
5. [核心功能实现](#5-核心功能实现)
    - **5.1 配置 OnlyOffice 文档服务器**
    - **5.2 生成文档编辑链接**
    - **5.3 集成 OnlyOffice 前端组件**
6. [测试 OnlyOffice 功能](#6-测试-onlyoffice-功能)
7. [优化与扩展](#7-优化与扩展)
8. [总结](#8-总结)

---

## 1. OnlyOffice 简介

OnlyOffice 是一套完整的文档协作解决方案，具备以下特点：
1. 支持文档（Word）、表格（Excel）、演示文稿（PPT）编辑。
2. 兼容 Microsoft Office 文档格式（`.docx`, `.xlsx`, `.pptx` 等）。
3. 支持多人同时编辑和协作。
4. 提供丰富的 RESTful API 支持文档编辑与管理。

---

## 2. 使用场景

1. **在线文档协作**：
   - 提供在线文档编辑和共享功能。
2. **企业文档管理**：
   - 集成在企业内部应用或门户中，为员工提供高效的协作工具。
3. **教育场景**：
   - 学术论文、教学计划、学生作业的在线提交和编辑。

---

## 3. 开发准备

在开始之前，需要完成以下准备工作：
1. **Docker 环境**：
   - 用于部署 OnlyOffice 文档服务器。
2. **Spring Cloud Alibaba 微服务**：
   - 集成 OnlyOffice API 接口。
3. **前端运行环境**：
   - 使用 HTML 和 JavaScript 渲染 OnlyOffice 文档编辑器。

---

## 4. 项目架构与依赖

### 4.1 服务架构

1. **OnlyOffice 文档服务器**：
   - 提供文档存储与编辑功能。
   - 接收请求并提供文档编辑页面。
2. **Spring Cloud Alibaba 微服务**：
   - 负责生成文档编辑配置。
3. **前端**：
   - 嵌入文档编辑的 iframe，显示 OnlyOffice 编辑页面。

服务架构示意图如下：

```
[客户端] <--HTML/JS--> [Spring 服务] <--REST API--> [OnlyOffice 文档服务器]
```

---

### 4.2 添加依赖

在 `pom.xml` 中添加必要的依赖项：

```xml
<dependencies>
    <!-- Spring Boot Starter Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- JSON Web Token (JWT) Support -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
        <version>0.9.1</version>
    </dependency>

    <!-- Spring Boot Starter Data JPA (可选，用于持久化文档信息) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- MySQL Driver (可选) -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
    </dependency>
</dependencies>
```

---

### 4.3 配置 OnlyOffice 服务

在 `application.yml` 中配置 OnlyOffice 文档服务器地址：

```yaml
onlyoffice:
  document-server-url: "http://localhost:8082" # OnlyOffice 文档服务器地址
  secret: "your_secret_here"                  # 用于 JWT 传输验证
```

---

## 5. 核心功能实现

### 5.1 配置 OnlyOffice 文档服务器

通过 Docker 部署 OnlyOffice 文档服务器：

```bash
docker run -i -t -d --name onlyoffice-document-server \
  -p 8082:80 \
  onlyoffice/documentserver
```

默认文档服务器在 `http://localhost:8082` 可用。

---

### 5.2 生成文档编辑链接

在 Spring 服务中实现文档编辑链接生成逻辑：

```java
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class OnlyOfficeService {

    @Value("${onlyoffice.document-server-url}")
    private String documentServerUrl;

    @Value("${onlyoffice.secret}")
    private String secret;

    /**
     * 生成文档编辑链接
     */
    public Map<String, Object> generateEditorConfig(String fileId, String fileName, String userId, String userName, boolean isEditable) {
        // 创建编辑器配置
        Map<String, Object> editorConfig = new HashMap<>();
        editorConfig.put("fileType", getFileExtension(fileName)); // 文件类型 (docx, xlsx, pptx)
        editorConfig.put("title", fileName); // 文档标题
        editorConfig.put("url", getFileDownloadUrl(fileId)); // 文件下载地址（在你的服务中实现文件存储）
        editorConfig.put("callbackUrl", getCallbackUrl(fileId)); // 文档回调地址（保存通知）

        // 用户信息
        Map<String, Object> userConfig = new HashMap<>();
        userConfig.put("id", userId);
        userConfig.put("name", userName);
        editorConfig.put("user", userConfig);

        editorConfig.put("permissions", Map.of("edit", isEditable)); // 设置是否可编辑

        // 转换为 JWT
        String token = createJwtToken(editorConfig);

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("editorUrl", documentServerUrl + "/apps/documenteditor/" + "?jwt=" + token);
        return result;
    }

    /**
     * 获取文件扩展名
     */
    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }

    /**
     * 获取文件下载地址
     */
    private String getFileDownloadUrl(String fileId) {
        return "http://your-download-url/api/files/" + fileId;
    }

    /**
     * 获取回调地址
     */
    private String getCallbackUrl(String fileId) {
        return "http://your-callback-url/api/files/" + fileId + "/callback";
    }

    /**
     * 生成 JWT Token
     */
    private String createJwtToken(Map<String, Object> editorConfig) {
        return Jwts.builder()
                .setClaims(editorConfig)
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }
}
```

---

### 5.3 集成 OnlyOffice 前端组件

在前端通过 iframe 嵌入 OnlyOffice 文档编辑器：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>OnlyOffice Document Editor</title>
    <script src="https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js"></script>
</head>
<body>
    <iframe id="docEditor" width="100%" height="800"></iframe>
    <script>
        // 替换为从后端获取的配置
        const editorUrl = "http://localhost:8082/apps/documenteditor/?jwt=your_jwt_token";

        // 设置 iframe 的嵌入地址
        $("#docEditor").attr("src", editorUrl);
    </script>
</body>
</html>
```

---

## 6. 测试 OnlyOffice 功能

1. **启动 OnlyOffice 文档服务器**：
   - 使用 Docker 启动文档服务器。
2. **启动后端服务**：
   - 通过 Spring Boot 启动微服务。
3. **调用接口获取编辑链接**：
   - 请求 `OnlyOfficeService.generateEditorConfig()` 方法的结果，并将 `editorUrl` 带到前端。
4. **访问页面**：
   - 打开 HTML 页面，通过 iframe 查看文档编辑器。

---

## 7. 优化与扩展

1. **文档存储支持**：
   - 集成存储服务，如 OSS 或本地文件系统，持久化文档数据。
2. **支持更多权限设置**：
   - 配置阅读权限、评论权限等，自定义用户操作能力。
3. **集成用户身份验证**：
   - 使用 OAuth 或 JWT 验证用户身份，确保访问安全。
4. **支持 WebSocket 通知**：
   - 实时同步编辑者动态，优化多人协作体验。

---

## 8. 总结

通过集成 OnlyOffice，我们为微服务应用构建了一个强大的在线文档查看与编辑功能，它支持多人协作及多格式兼容。后续可以根据业务需求扩展更多高级功能，如文档版本管理、评论功能等。
