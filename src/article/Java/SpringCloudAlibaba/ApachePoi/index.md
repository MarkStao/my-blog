---
title: Apache POI
category:
  - Java
tag:
  - SpringCloudAlibaba
---


在现代的企业信息化场景中，经常需要处理办公文档，如 **Excel 表格、Word 文档、PDF 文件和 PPT 演示文稿**。Apache POI 是一个功能强大的开源库，能够对这些文档进行读写、编辑操作，非常适合与微服务框架（如 Spring Cloud Alibaba）集成。

通过本指南，你将学会如何在 Spring Cloud Alibaba 项目中使用 Apache POI 处理常见的办公文档场景，包括批量生成文件、从文件中提取数据、以及对文档进行样式和内容编辑。
<!-- more -->

## 目录

1. [Apache POI 简介](#1-apache-poi-简介)
2. [使用场景](#2-使用场景)
3. [开发准备](#3-开发准备)
4. [项目架构与依赖](#4-项目架构与依赖)
    - **4.1 添加依赖**
    - **4.2 数据源配置（可选）**
5. [核心功能实现](#5-核心功能实现)
    - **5.1 Excel 操作**
    - **5.2 Word 操作**
    - **5.3 PDF 文件生成（集成 iText）**
    - **5.4 PPT 操作**
6. [测试办公文档处理功能](#6-测试办公文档处理功能)
7. [优化与扩展](#7-优化与扩展)
8. [总结](#8-总结)

---

## 1. Apache POI 简介

Apache POI 是由 Apache Software Foundation 提供的开源 Java 库，支持操作 Microsoft Office 文档。它主要包括：
- **HSSF/SSF**：处理 `.xls` 和 `.xlsx` Excel 文档。
- **HWPF/XWPF**：处理 `.doc` 和 `.docx` Word 文档。
- **HSLF/XSLF**：处理 `.ppt` 和 `.pptx` PPT 文档。

此外，PDF 是一种常见的固定布局格式，Apache POI 不直接支持 PDF 文件，这里推荐借助 **iText** 或 **PDFBox** 等库进行操作。

---

## 2. 使用场景

以下是 Apache POI 常见的使用场景：
1. **Excel 数据导入与导出**：
   - 导出报表、处理大批量表格数据。
2. **Word 模板生成**：
   - 动态生成合同、协议等文档。
3. **PDF 文件生成**：
   - 生成固定格式的文件，如发票、凭证。
4. **PPT 操作**：
   - 在企业汇报或教育领域，生成 PPT 演示文档。

---

## 3. 开发准备

在开始之前，需要以下环境与工具：
1. JDK 8+
2. Spring Cloud Alibaba 微服务项目基础环境。
3. MySQL（可选，用于存储生成后的文档信息）。

---

## 4. 项目架构与依赖

### 4.1 添加依赖

在 `pom.xml` 中添加 Apache POI、iText 和其他必要依赖：

```xml
<dependencies>
    <!-- Apache POI (Excel, Word, PPT 操作) -->
    <dependency>
        <groupId>org.apache.poi</groupId>
        <artifactId>poi</artifactId>
        <version>5.2.3</version>
    </dependency>
    <dependency>
        <groupId>org.apache.poi</groupId>
        <artifactId>poi-ooxml</artifactId>
        <version>5.2.3</version>
    </dependency>

    <!-- iText (用于 PDF 操作) -->
    <dependency>
        <groupId>com.itextpdf</groupId>
        <artifactId>itext7-core</artifactId>
        <version>7.2.5</version>
    </dependency>
</dependencies>
```

---

### 4.2 数据源配置（可选）

如果需要存储生成的文档信息，将 MySQL 数据库集成进来：

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/office_demo?useSSL=false&characterEncoding=utf8
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

---

## 5. 核心功能实现

### 5.1 Excel 操作

#### 5.1.1 导出 Excel 报表

以下示例展示了如何生成一个简单的 Excel 文件并写入表格数据：

```java
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.FileOutputStream;

public class ExcelExportService {

    public void exportExcel(String filePath) throws Exception {
        // 创建工作簿
        Workbook workbook = new XSSFWorkbook();
        // 创建工作表
        Sheet sheet = workbook.createSheet("Report");

        // 创建表头
        Row headerRow = sheet.createRow(0);
        String[] headers = {"ID", "Name", "Age"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
        }

        // 填充数据
        for (int i = 1; i <= 10; i++) {
            Row row = sheet.createRow(i);
            row.createCell(0).setCellValue(i);
            row.createCell(1).setCellValue("Name " + i);
            row.createCell(2).setCellValue(20 + i);
        }

        // 将文件写入指定位置
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            workbook.write(fos);
        }
        workbook.close();
    }
}
```

#### 5.1.2 导入 Excel 数据

从 Excel 文件中读取数据：

```java
import org.apache.poi.ss.usermodel.*;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

public class ExcelImportService {

    public List<String[]> importExcel(String filePath) throws Exception {
        List<String[]> data = new ArrayList<>();

        try (FileInputStream fis = new FileInputStream(filePath);
             Workbook workbook = new XSSFWorkbook(fis)) {

            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                String[] rowData = new String[row.getLastCellNum()];
                for (Cell cell : row) {
                    rowData[cell.getColumnIndex()] = cell.toString();
                }
                data.add(rowData);
            }
        }

        return data;
    }
}
```

---

### 5.2 Word 操作

#### 5.2.1 动态生成 Word 文档

使用 Apache POI 动态生成 Word 文档：

```java
import org.apache.poi.xwpf.usermodel.*;
import java.io.FileOutputStream;

public class WordExportService {

    public void generateWord(String filePath) throws Exception {
        XWPFDocument document = new XWPFDocument();

        // 添加标题
        XWPFParagraph title = document.createParagraph();
        title.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun titleRun = title.createRun();
        titleRun.setText("Dynamic Word Document");
        titleRun.setBold(true);
        titleRun.setFontSize(20);

        // 添加正文
        XWPFParagraph content = document.createParagraph();
        XWPFRun contentRun = content.createRun();
        contentRun.setText("This is an example of dynamically generated Word document using Apache POI.");
        contentRun.setFontSize(12);

        // 写入文件
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            document.write(fos);
        }
        document.close();
    }
}
```

---

### 5.3 PDF 文件生成（集成 iText）

以下示例展示了如何使用 iText 生成 PDF 发票：

```java
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.*;
import com.itextpdf.layout.element.*;

public class PdfExportService {

    public void generatePdf(String filePath) throws Exception {
        PdfWriter writer = new PdfWriter(filePath);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("Invoice")
                .setFontSize(18)
                .setBold()
                .setTextAlignment(com.itextpdf.layout.property.TextAlignment.CENTER));

        document.add(new Paragraph("Customer: John Doe\nDate: 2023-10-01")
                .setFontSize(12));

        document.add(new Paragraph("Thank you for your purchase!")
                .setFontSize(10)
                .setItalic());

        document.close();
    }
}
```

---

### 5.4 PPT 操作

创建一个包含多个页的 PPT：

```java
import org.apache.poi.xslf.usermodel.*;
import java.io.FileOutputStream;

public class PptExportService {

    public void generatePpt(String filePath) throws Exception {
        XMLSlideShow ppt = new XMLSlideShow();

        // 创建第一页幻灯片
        XSLFSlide slide1 = ppt.createSlide();
        XSLFTextShape title = slide1.createTextBox();
        title.setText("Slide Title");
        title.setAnchor(new java.awt.Rectangle(100, 100, 400, 50));

        // 创建第二页幻灯片
        XSLFSlide slide2 = ppt.createSlide();
        XSLFTextShape content = slide2.createTextBox();
        content.setText("This is a dynamically generated slide.");
        content.setAnchor(new java.awt.Rectangle(100, 100, 400, 50));

        // 保存文件
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            ppt.write(fos);
        }
        ppt.close();
    }
}
```

---

## 6. 测试办公文档处理功能

1. **创建测试接口**：
   - 在 Controller 中调用上述服务实现。
2. **运行服务**：
   - 运行 Spring Boot 微服务，调用接口生成文件。
3. **验证生成结果**：
   - 检查生成的 Excel、Word、PDF 或 PPT 文件是否符合预期。

---

## 7. 优化与扩展

1. **异步任务处理**：
   - 对于大文件生成，使用线程池或消息队列提高生成效率。
2. **云存储集成**：
   - 将生成的文件上传至 OSS、AWS S3 等云存储服务。
3. **模板化系统**：
   - 使用模板 (如 FreeMarker) 动态填充内容。
4. **多格式导出**：
   - 支持从业务数据生成多种格式文件。

---

## 8. 总结

通过 Apache POI 和 iText，我们可以处理常见的办公文档并支持动态生成。通过结合 Spring Cloud Alibaba 微服务架构，可以使这些功能在分布式应用中灵活应用。

Apache POI 提供了高效率的操作能力，而集成 iText 等工具，也为完整办公文档功能提供了更大的便利。
