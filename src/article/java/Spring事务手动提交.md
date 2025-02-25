---
title: Spring事务手动提交
date: 2023-12-21
category:
  - Java
---
  在使用spring+hibernate时，通常情况下直接在ServiceImpl层或Controller层加@Transactional注解就行，但因更新数据量过大，内存溢出，需分量提交，比如每插入100000条进行提交一次，但注解无法满足应用场景，所以只能采用手动提交形式。
<!-- more -->

# 应用场景
  在使用spring+hibernate时，通常情况下直接在ServiceImpl层或Controller层加@Transactional注解就行，但因更新数据量过大，内存溢出，需分量提交，比如每插入100000条进行提交一次，但注解无法满足应用场景，所以只能采用手动提交形式。

# 解决方案
1. 通过自动注解获取TransactionTemplate对象。
```
@Autowired
private TransactionTemplate  txTemplate;
```
2. 在sql语句执行之前开启事务。
```
DefaultTransactionDefinition transDefinition = new DefaultTransactionDefinition ();
TransactionStatus transStatus = txTemplate.getTransactionManager().getTransaction(transDefinition );
```
3. 最后，在执行sql语句之后，进行事务提交
```
txTemplate.getTransactionManager().commit(transStatus);
```
**备注：以上所有类采用org.springframework.transaction的jar包，加上述代码不能加@Transactional注解，否则优先@Transactional注解的事务**
