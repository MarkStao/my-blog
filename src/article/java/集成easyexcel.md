---
# 这是文章的标题
title: 集成easyexcel
# 设置作者
author: 宋涛
# 设置写作时间
date: 2024-03-01
# 一个页面可以有多个分类
category:
  - Java
---

集成spring-data-jpa和easyexcel进行数据导入导出操作
<!-- more -->

以下代码集成spring-data-jpa进行数据库操作，只需关注easyexcel部分即可。

## 1.引入依赖

```java
<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
			<version>3.2.5</version>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
			<version>3.2.5</version>
		</dependency>

		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
			<version>8.0.33</version>
		</dependency>

		<!--引入easyexcel依赖包-->
		<dependency>
			<groupId>com.alibaba</groupId>
			<artifactId>easyexcel</artifactId>
			<version>3.1.1</version>
		</dependency>
	</dependencies>
```

## 2.application.yml

```java
server:
  port: 18072

spring:
  application:
    name: easy-poi
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://127.0.0.1:3306/java_study?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8&usessL=true
    username: root
    password: root
  jpa:
    database: MYSQL
    hibernate:
      ddl-auto: update
    show-sql: false
    open-in-view: true
    properties:
      hibernate:
        format_sql: true
```

## 3.创建类型转换类

用于空值转整型，文本转整型等类型异常问题

### BigDecimal类型转换

```java
package org.office.easypoi.converter;

import cn.hutool.core.util.StrUtil;
import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.metadata.GlobalConfiguration;
import com.alibaba.excel.metadata.data.ReadCellData;
import com.alibaba.excel.metadata.data.WriteCellData;
import com.alibaba.excel.metadata.property.ExcelContentProperty;

import java.math.BigDecimal;

public class BigDecimalConverter implements Converter<BigDecimal> {

    @Override
    public Class supportJavaTypeKey() {
        return BigDecimal.class;
    }

	// 读入文件数据转为Java实体类
    @Override
    public BigDecimal convertToJavaData(ReadCellData<?> cellData, ExcelContentProperty contentProperty,
                                        GlobalConfiguration globalConfiguration) {
        // 如果excel中的数据是字符串，则转换为BigDecimal
        if (cellData.getType() == CellDataTypeEnum.STRING) {
            if (StrUtil.isBlank(cellData.getStringValue())) {
                return null;
            }
            return new BigDecimal(cellData.getStringValue());
        }
        return cellData.getNumberValue();
    }

	// 读取数据转为Excel
    @Override
    public WriteCellData<?> convertToExcelData(BigDecimal value, ExcelContentProperty contentProperty,
                                               GlobalConfiguration globalConfiguration) {
        return new WriteCellData<>(String.valueOf(value));
    }
}

```

### Integer类型转换

```java
package org.office.easypoi.converter;

import cn.hutool.core.util.StrUtil;
import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.metadata.GlobalConfiguration;
import com.alibaba.excel.metadata.data.ReadCellData;
import com.alibaba.excel.metadata.data.WriteCellData;
import com.alibaba.excel.metadata.property.ExcelContentProperty;

public class IntergerConverter implements Converter<Integer> {

    @Override
    public Class supportJavaTypeKey() {
        return Integer.class;
    }

    @Override
    public Integer convertToJavaData(ReadCellData<?> cellData, ExcelContentProperty contentProperty,
                                     GlobalConfiguration globalConfiguration) {
        // 如果excel中的数据是字符串，则转换为Integer
        if (cellData.getType() == CellDataTypeEnum.STRING) {
            if (StrUtil.isBlank(cellData.getStringValue())) {
                return null;
            }
            return Integer.parseInt(cellData.getStringValue());
        }
        return cellData.getNumberValue().intValue();
    }

    @Override
    public WriteCellData<?> convertToExcelData(Integer value, ExcelContentProperty contentProperty,
                                               GlobalConfiguration globalConfiguration) {
        return new WriteCellData<>(String.valueOf(value));
    }
}

```

### LocalDateTime类型转换


```java
package org.office.easypoi.converter;

import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.util.StrUtil;
import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.metadata.GlobalConfiguration;
import com.alibaba.excel.metadata.data.ReadCellData;
import com.alibaba.excel.metadata.data.WriteCellData;
import com.alibaba.excel.metadata.property.ExcelContentProperty;

import java.time.LocalDateTime;

public class LocalDateTimeConverter implements Converter<LocalDateTime> {

    @Override
    public Class<?> supportJavaTypeKey() {
        return LocalDateTime.class;
    }

    @Override
    public LocalDateTime convertToJavaData(ReadCellData<?> cellData, ExcelContentProperty contentProperty,
                                           GlobalConfiguration globalConfiguration) {
        // 如果excel中的数据格式为yyyy-MM-dd，则转换为LocalDateTime
        return LocalDateTimeUtil.parse(cellData.getStringValue(), DatePattern.NORM_DATE_PATTERN);
    }

    @Override
    public WriteCellData<?> convertToExcelData(LocalDateTime value, ExcelContentProperty contentProperty,
                                               GlobalConfiguration globalConfiguration) {
        return new WriteCellData<>(String.valueOf(value));
    }
}

```

## 4.实体类

```java
package org.office.easypoi.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.experimental.Accessors;
import org.office.easypoi.converter.BigDecimalConverter;
import org.office.easypoi.converter.IntergerConverter;
import org.office.easypoi.converter.LocalDateTimeConverter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 测试数据类
 */
@Data
@Entity
// 需配置，否则Listener读取不到数据
@Accessors(chain = false)
@Table(name = "office_test_data")
// 需实现序列化
public class TestData implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

	// value与导入文件的表头一致，converter配置转换类
    @ExcelProperty(value = "编号", converter = IntergerConverter.class)
    private Integer number;

    @ExcelProperty(value = "名称")
    private String name;

    @ExcelProperty(value = "价格", converter = BigDecimalConverter.class)
    private BigDecimal price;

    @ExcelProperty(value = "创建日期", converter = LocalDateTimeConverter.class)
    private LocalDateTime createTime;
}
```

## 5.映射类

```java
package org.office.easypoi.mapper;

import org.office.easypoi.entity.TestData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestDataRepository extends JpaRepository<TestData, String> {
}

```
## 6.Service

```java
package org.office.easypoi.service;

import org.office.easypoi.entity.TestData;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TestDataService {

    /**
     * 导入
     */
    String importExcel(MultipartFile file);

    /**
     * 导出
     */
    void exportExcel();
}

```

## 7.Service实现

```java
package org.office.easypoi.service.impl;

import com.alibaba.excel.EasyExcel;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.office.easypoi.entity.TestData;
import org.office.easypoi.listener.TestDataListener;
import org.office.easypoi.mapper.TestDataRepository;
import org.office.easypoi.service.TestDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;

@Service
public class TestDataServiceImpl implements TestDataService {

    @Autowired
    private TestDataRepository repository;

    @Override
    @Transactional
    public String importExcel(MultipartFile file) {
        TestDataListener listener = new TestDataListener(repository);
        try {
            EasyExcel.read(file.getInputStream(), TestData.class, listener).sheet().doRead();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        System.out.println(repository.saveAllAndFlush(listener.getList()));
        return "成功处理" + listener.getCount() + "条数据";
    }

    @Override
    public void exportExcel() {
        // 获取数据
        List<TestData> all = repository.findAll();
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        HttpServletResponse response = attributes.getResponse();
        Objects.requireNonNull(response).setContentType("application/vnd.mx-excel;charset=utf-8");
        response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode("测试数据.xlsx", StandardCharsets.UTF_8));
        try {
            EasyExcel.write(response.getOutputStream(), TestData.class).sheet().doWrite(all);
        } catch (IOException e) {
            throw new RuntimeException("excel处理错误: "+e.getMessage());
        }
    }
}

```

## 8.Controller

```java
package org.office.easypoi.controller;

import org.office.easypoi.service.TestDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/test")
public class TestDataController {

    @Autowired
    private TestDataService service;

    /**
     * 导入
     */
    @PostMapping("import")
    public String importExcel(@RequestParam("file") MultipartFile file) {
        try {
            return service.importExcel(file);
        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

    /**
     * 导出
     */
    @GetMapping("export")
    public void exportExcel() {
        service.exportExcel();
    }
}

```
