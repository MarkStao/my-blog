---
title: ServiceComb常见配置项
date: 2023-12-21
category:
  - Java
---

ServiceComb常见配置项
<!-- more -->

```java
APPLICATION_ID: blog
service_description:
  name: comment-service
  version: 2.0.11
  properties:
    allowCrossApp: false
  environment: production  #production, development，在开发的时候配置成开发模式，修改契约可以不变更版本
servicecomb:
  service:
    registry:
      address: http://10.21.208.113:30100
      instance:
        healthCheck:
          interval: 30          # 健康检查间隔时间，默认30秒，可选
          times: 3              # 健康检查检测次数，默认3次，可选
        watch: true             # watch机制可以快速感知实例变化
        preferIpAddress: false #是否选用ip地址作为实例名称，true表示使用ip，否则使用hostname
        diagnose:
          interval: 12
  config:
    client:
      serverUri: http://10.21.208.113:30103  #如果没有配置，则表示不连接配置中心
      refreshMode: 1       #配置刷新方式，0表示服务端push监听的机制，1表示客户端主动pull，通过LB（例如逻辑多租）只能配置成1
      refresh_interval: 5000    #刷新间隔时间
      first_refresh_interval: 5000   #首次刷新延迟时间
  monitor:
    client:
      enabled: true       # 是否开启，如果不需要对接，请设置成false
  rest:
    address: 0.0.0.0:18082?sslEnabled=false&protocol=http2  #sslEnabled表示是否开启tls，protocol表示支持协议，默认为http
    client:
      thread-count: 8
      connection:
        maxPoolSize: 10
        idleTimeoutInSeconds: 30   #单位秒
        keepAlive: true            #是否为长连接
    server:
      thread-count: 8
      compression: false          #支持服务端压缩
      maxHeaderSize: 8192         #单位byte
      timeout: 3000               #单位毫秒,使用rest over servlet方式时生效
      connection:
        idleTimeoutInSeconds: 60  # 服务端连接超时时间，一个连接在指定时间内没有接收到请求
  uploads:
    directory: /home/upload  # 文件上传
    maxSize: 1024            #上传文件body大小，也可以作为传输数据的大小限制
    maxFileSize: 3           #文件个数限制
    fileSizeThreshold: 0     #磁盘大小阈值
  request:
    timeout: 1000            #请求超时时间，支持全局、微服务、契约、方法四个级别
  accesslog:
    enabled: true
    pattern: "%h %{dd/MMM/yyyy:HH:mm:ss.SSSZ|GMT+0008|en_US}t %r %s %B %D"
  metrics:
    enabled: true
    window_time: 600000
    publisher:
      defaultLog:
        enabled: true
  handler:
    chain:
      Provider:
        default: qps-flowcontrol-provider,bizkeeper-provider
      Consumer:
        default: qps-flowcontrol-consumer,loadbalance,bizkeeper-consumer
  # 数据中心，用于服务做亲缘性选择，优先调用本az服务
  datacenter:
    name: myDC               #数据中心名称，
    region: my-Region        #数据中心区域，比如华南soutchchina、华北northchina
    availableZone: my-Zone   #数据中心可用取sz
  isolation:
    Consumer:
      maxConcurrentRequests: 20
  #限流相关配置
  flowcontrol:
    Provider:   #服务端限流
      qps:
        global:
          limit: 1000  #全局限流，默认是最大值
        limit:
          service1: 500 #对单个consuer服务进行限流，默认无，如果有要求需要添加
    Consumer:
      qps:
        limit:
          serivce2:   #对服务级别限流500
            schema1:  #对服务的schema级别进行限流500
              operation1: 100  #对服务的schema的操作级别进行限流
  #服务容错
  fallback: #容错策略支持全局、微服务和方法级别
    Consumer:
      springmvc:
        codeFirst:
          fallbackForce:
            enabled: true  #是否开启容错机制，默认为false
            force: true   #是否强制开启容错机器
            maxConcurrentRequests: 10  #隔离时最大的并发数，默认为10,客户端调用时

  fallbackpolicy:  #容错策略，默认提供returnNull throwException fromCache三种策略，用户可以自己实现org.apache.servicecomb.bizkeeper.FallbackPolicy接口， policy支持全局、微服务和方法级别
    Consumer:
      springmvc:
        codeFirst:
          fallbackFromCache:
            policy: fromCache  # 从缓存中获取上一次成功的数据，
          fallbackReturnNull:
            policy: returnNull    #服务降级返回null，用户需要对该值进行处理，不能抛出空指针异常
          fallbackThrowException:
            policy: throwException  #服务降级抛出的异常为org.apache.servicecomb.core.exception.CseException，降级时，用户需要捕获该异常做自己的逻辑
          fallbackForce:
            policy: mycustom
  #熔断策略支持全局、微服务和方法级别
  circuitBreaker:
    Consumer:
      springmvc:
        codeFirst:
          fallbackFromCache:
            enabled: true    #是否开启熔断
            forceOpen: true  #强制开启熔断
            forceClosed: false  #强制关闭熔断，和forceOpen互斥
            sleepWindowInMilliseconds: 15000  #熔断时间，默认15000毫秒
            requestVolumeThreshold: 20        #统计时间窗内最少请求次数，如果没有达到该请求次数不会进行熔断，即使失败率达到熔断要求
            errorThresholdPercentage: 50      #失败率，统计时间窗内请求错误率，达到该限制后会进行熔断，默认50%
  #负载均衡、路由策略，重试机制支持全局和微服务两个级别
  loadbalance:
    bservice:
      retryEnabled: true  #是否开启重试机制
      retryOnSame: 1      #在同一个机器上重试次数，默认为0，重试需要保证可重入性、幂等性
      retryOnNext: 2      #在另外实例上重试次数，默认为0，如果是无状态的请求，建议选择在下一个节点上行进行重试
      retryHandler: default  #重试handler，默认为default，对应com.netflix.client.DefaultLoadBalancerRetryHandler，也可以实现自己的重试机制。可选
      transactionControl:
        options:
          tag0: value0  #过滤器的属性，到时候只选择实例也有同样的属性的实例
        policy: org.apache.servicecomb.loadbalance.filter.SimpleTransactionControlFilter  #分流策略，默认使用简单的分流策略，选择properties包含filter的所有options的所有实例，即filter的options为所选实例的properties的一个子集
      isolation:    # 支持服务级别和全局
        enabled: true                 #开启隔离机制
        errorThresholdPercentage: 20  #隔离错误率
        enableRequestThreshold: 20    #隔离门槛
        singleTestTime: 10000         #隔离后有机会重试的时间
      strategy:
        name: RoundRobin #现在支持RoundRobin轮询 Random随机 WeightedResponse返回值权重 SessionStickiness会话粘滞，默认为RoundRobin
      SessionStickinessRule: #当会话粘滞策略开启后生效
        sessionTimeoutInSeconds: 30    #会话粘滞的时间，默认30s，可选
        successiveFailedTimes: 5       #会话 粘滞最大错误数，默认5次，可选
  references:
    version-rule: 0+  #对所有服务的版本依赖范围
    abcservice:
      version-rule: 1.0.1+ #对特定的服务版本依赖范围
      transport: rest      #当服务端开启多种协议是，显示指定传输协议，默认为空，可设置为“”、rest、highway
  executor:
    default:
      thread-per-group: 200   # 同步开发模式下面的默认工作线程数
ssl:
  engine: openssl
  protocols: TLSv1.2
  authPeer: false
  checkCN.host: false
  trustStore: trust.jks
  trustStoreType: JKS
  trustStoreValue: ********
  keyStore: server.p12
  keyStoreType: PKCS12
  keyStoreValue: ********
  crl: revoke.crl
  sslCustomClass: com.service.comment.DemoSSLCustom
```

## 华为云架构配置项

```java
spring:
  application:
    # 微服务名称
    name: basic-provider
  cloud:
    servicecomb:
      # 微服务的基本信息
      service:
        # 微服务名称，和spring.application.name保持一致。
        name: ${spring.application.name}
        # 微服务版本号，本示例使用ServiceStage环境变量。建议保留这种配置方式，
        # 部署的时候，不用手工修改版本号，防止契约注册失败。
        version: ${CAS_INSTANCE_VERSION:0.0.1}
        # 应用名称。默认情况下只有应用名称相同的微服务之间才可以相互发现。
        application: basic-application
        # 环境名称。只有环境名称相同的微服务之间才可以相互发现。
        environment:
        description: example service definition
        properties:
          x-example-1: example-1
          x-example-2: example-2
      # 微服务实例的基本信息
      instance:
        # 微服务注册的时候的初始状态
        initialStatus: UP
        properties:
          x-example-1: example-1
          x-example-2: example-2
      # 注册发现相关配置
      discovery:
        # 是否启用注册发现
        enabled: true
        # 是否启用实例更新消息推送
        watch: false
        # 注册中心地址，本示例使用ServiceStage环境变量。建议保留这种配置方式，
        # 部署的时候，不用手工修改地址。
        address: ${PAAS_CSE_SC_ENDPOINT:http://127.0.0.1:30100}
        # 微服务向CSE发送心跳间隔时间，单位秒
        healthCheckInterval: 30
        # 发送心跳的连接超时时间
        healthCheckRequestTimeout: 5000
        # 拉取实例的轮询时间，单位毫秒
        pollInterval: 15000
        # 优雅停机设置。优雅停机后，先从注册中心注销自己。这个时间表示注销自己后等待的时间，这个时间后才退出。
        waitTimeForShutDownInMillis: 15000
        # 配置该服务是否允许被跨应用调用
        allowCrossApp: false
        # 注册中心的发布地址。默认可以不配置，自动从可用IP中取一个。
        publishAddress:
        # 主要用于网关，并且spring.cloud.gateway.discovery.locator.enabled=true的场景
        # 开启后定期查询微服务列表
        enableServicePolling: false
        # 是否根据数据中心信息进行路由，优先转发到接近的数据中心。需要每个实例配置数据中心信息。
        enabledZoneAware: false
        #  数据中心信息
        datacenter:
          name: x
          region: y
          availableZone: z
      config:
        # 是否启用动态配置
        enabled: true
        # 启动的时候，如果无法拉取配置，是否启动失败
        firstPullRequired: true
        # 配置中心地址，本示例使用ServiceStage环境变量。建议保留这种配置方式，
        # 部署的时候，不用手工修改地址。
        serverAddr: ${PAAS_CSE_CC_ENDPOINT:http://127.0.0.1:30110}
        # 配置中心类型，支持 kie 和 config-center
        serverType: kie
        kie:
          # 是否开启长轮询
          enableLongPolling: true
          # 长轮询的等待时间，这个参数会传递给配置中心，如果没有配置变化，配置中心会等待这个时间才返回。
          pollingWaitTimeInSeconds: 10
          # 非长轮询情况下，配置刷新周期，单位毫秒.
          refreshIntervalInMillis: 15000
          customLabel: public # 默认值是public
          customLabelValue: default # 默认值是空字符串
        configCenter:
          # 配置刷新周期，单位毫秒
          refreshInterval: 15000
        # 在配置中心为config-center时，不支持yaml格式。可以将一些配置项的值作为yaml格式的文本，并将
        # 文本内容解析为yaml，通过这种方式间接的实现支持yaml格式配置。
        fileSource: x.yaml,y.yaml
```
