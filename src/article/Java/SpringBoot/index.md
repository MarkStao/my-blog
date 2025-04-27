---
title: SpringBoot知识点
category:
  - Java
---

Spring Boot 基于 Spring 开发，Spirng Boot 本身并不提供 Spring 框架的核⼼特性以及扩展功能，只是⽤于快速、敏捷地开发新⼀代基于 Spring 框架的应⽤程序。它并不是⽤来替代 Spring 的解决⽅案，⽽是和 Spring 框架紧密结合⽤于提升 Spring 开发者体验的⼯具。
<!-- more -->

## Spring Boot
Spring Boot 基于 Spring 开发，Spirng Boot 本身并不提供 Spring 框架的核⼼特性以及扩展功能，只是⽤于快速、敏捷地开发新⼀代基于 Spring 框架的应⽤程序。它并不是⽤来替代 Spring 的解决⽅案，⽽是和 Spring 框架紧密结合⽤于提升 Spring 开发者体验的⼯具。

### 核心功能

- 可独立运行的Spring项目：Spring Boot可以以jar包的形式独立运行。
- 内嵌的Servlet容器：Spring Boot可以选择内嵌Tomcat、Jetty或者Undertow，无须以war包形式部署项目。
- 简化的Maven配置：Spring提供推荐的基础 POM 文件来简化Maven 配置。
- 自动配置Spring：Spring Boot会根据项目依赖来自动配置Spring 框架，极大地减少项目要使用的配置。
- 提供生产就绪型功能：提供可以直接在生产环境中使用的功能，如性能指标、应用信息和应用健康检查。
- 无代码生成和xml配置：Spring Boot不生成代码。完全不需要任何xml配置即可实现Spring的所有配置。

### 核心特性

- 自动配置：Spring Boot会根据项目依赖来自动配置Spring 框架，极大地减少项目要使用的配置。
- 起步依赖：Spring Boot提供了一组依赖，通过这些依赖，开发者可以快速创建Spring Boot应用。
- 嵌入式容器：Spring Boot可以以jar包的形式独立运行，无需以war包形式部署项目。

### 启动流程

![SpringBoot启动流程.png](./SpringBoot启动流程.png)

### 微服务中实现session共享

1. 基于Token的无状态：使用JWT等Token机制，将会话存储在客户端token中。服务端无需存储session，通过签名验证token有效性；
2. 集中式存储：将会话数据存储在Redis等分布式缓存中，服务节点通过共享Session id访问中央存储；
3. 会话复制：通过组播等方式在集群节点间同步session变化。

### 在Spring Boot启动时执行特定代码

- 实现CommandLineRunner接口；
- 实现ApplicationRunner接口；
- 使用@PostConstruct注解；
- 监听ApplicationReadyEvent事件；

### Spring Boot的启动依赖

起步依赖是Spring Boot提供的一种特殊依赖描述符，它通过聚合相关技术的依赖来简化配置。主要体现在：
- 依赖管理简化：自动解决版本兼容问题；
- 开箱即用：提供合理的默认配置，开发者只需关注业务逻辑；
- 模块化设计：按功能划分的依赖包使项目结构更清晰；

### Spring Boot如何知道要创建哪个Bean

- 组件扫描：通过@ComponentScan注解及其派生注解标记的所有类；
- 自动配置：@EnableAutoConfiguration会加载jar包中的所有自动配置类；
- 条件化创建：自动配置类中的@Bean方法；
- 配置属性绑定：通过@ConfigurationProperties将yml中的配置绑定到Bean属性上；

### Spring Boot的配置文件分类

- 命令行参数：通过--key=value的形式设置，优先级最高；
- Java系统属性：System.getProperties()；
- 操作系统环境变量；
- 配置文件

### Spring Boot支持嵌入的Web容器

- Tomcat：默认，性能稳定，适用大多数的应用场景；
- Jetty：快速启动和地内存占用；
- Undertow：需要Web Socket支持时，性能最高；

### Spring Boot处理跨域

- 全局配置：通过WebMvcConfigurer接口实现
- 局部配置：使用@CrossOrigin注解
- 过滤器方式：通过自定义CorsFilter