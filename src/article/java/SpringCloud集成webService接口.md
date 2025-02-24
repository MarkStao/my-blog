---
title: SpringCloud集成webService接口
date: 2023-12-21
category:
  - Java
---
SpringCloud集成webService接口
<!-- more -->

pom导入cxf

```java
<dependency>
    <groupId>org.apache.cxf</groupId>
    <artifactId>cxf-spring-boot-starter-jaxws</artifactId>
    <version>3.2.4</version>
</dependency>
```



1.新建webservice类

```java
@WebService(name = "LeakageService", // 暴露服务名称
        targetNamespace = "http://webService.webchat.huaxin.com"// 命名空间,一般是接口的包名倒序
)
public interface LeakageService {
    String doSave(String id,String receiveCode);
}
```

2.新建webservice业务代码实现

```java
@WebService(
        targetNamespace = "http://webService.webchat.huaxin.com", //wsdl命名空间
        serviceName = "LeakageService",                 //portType名称 客户端生成代码时 为接口名称
        endpointInterface = "com.huaxin.webchat.webService.LeakageService")//指定发布
public class LeakageServiceImpl implements LeakageService {
 public String doSave(String id, String receiveCode)
 {
   ....//具体业务代码 省略
 }
}
```

3.新建CxfConfig

```java
package com.huaxin.webchat.webService.webServiceConfig;


import com.huaxin.webchat.webService.LeakageService;
import com.huaxin.webchat.webService.impl.LeakageServiceImpl;
import org.apache.cxf.Bus;
import org.apache.cxf.bus.spring.SpringBus;

import org.apache.cxf.jaxws.EndpointImpl;
import org.apache.cxf.transport.servlet.CXFServlet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.xml.ws.Endpoint;

@Configuration
public class CxfConfig {

    @Bean
    public ServletRegistrationBean dispatcherServlet() {
        return new ServletRegistrationBean(new CXFServlet(), "/services/*");
    }

    @Bean(name = Bus.DEFAULT_BUS_ID)
    public SpringBus springBus() {
        return new SpringBus();
    }

    @Bean
    public LeakageService leakageService() {
        return new LeakageServiceImpl();
    }

    @Bean
    public Endpoint endpoint() {
        EndpointImpl endpoint = new EndpointImpl(springBus(), leakageService());
        endpoint.publish("/LeakageService");
        return endpoint;

    }
}
```

启动项目，访问 http://localhost:8089/services/LeakageService?wsdl 返回信息如下
根据postman得到结果，webservice OK
但是会出现如下问题， 访问其他controller接口时，会出现无法访问情况:
  造成无法访问的原因是因为 spingboot默认注册的是dispatcherServlet,当手动配置 ServletRegistrationBean后springboot不会再去注册默认的dispatcherServlet.
  个人理解：发布 webservice的时候，默认配置***Application 启动类的ServletRegistrationBean 。boot就不注册默认的dispatcher。这里我们需要去重新配置一个dispatcherServlet 在启动类中，让webservice去调用

```java
@Bean
public ServletRegistrationBean restServlet() {
    //注解扫描上下文
    AnnotationConfigWebApplicationContext applicationContext = new AnnotationConfigWebApplicationContext();
    //项目包名
    applicationContext.scan("com.**.webService");//webservice接口包
    DispatcherServlet rest_dispatcherServlet = new DispatcherServlet(applicationContext);
    ServletRegistrationBean registrationBean = new ServletRegistrationBean(rest_dispatcherServlet);
    registrationBean.setLoadOnStartup(1);
    registrationBean.addUrlMappings("/*");
    return registrationBean;
}
```
**备注：本文为转载文章，转载链接为https://blog.csdn.net/wangrongfei136/article/details/110877781?spm=1001.2014.3001.5506**