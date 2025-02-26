---
title: JavaScript语法
category:
  - 前端
tag:
  - JavaScript
---

JavaScript（简称 JS）是最广泛使用的编程语言之一，主要用于网页交互开发。它是一种轻量级、解释型语言，支持多种编程范式，如函数式、面向对象、事件驱动等。

本文总结了 JavaScript 的全量核心语法，并为每类内容提供对应的示例，帮助开发者快速掌握和查阅。

<!-- more -->

---

## 目录

1. [JavaScript 基础](#1-javascript-基础)
2. [变量与常量](#2-变量与常量)
3. [数据类型和运算符](#3-数据类型和运算符)
   - [数据类型](#数据类型)
   - [运算符](#运算符)
4. [条件判断和循环](#4-条件判断和循环)
5. [函数](#5-函数)
6. [对象](#6-对象)
7. [数组](#7-数组)
8. [ES6+ 特性](#8-es6-特性)
   - [解构赋值](#解构赋值)
   - [箭头函数](#箭头函数)
   - [模块化导入和导出](#模块化导入和导出)
9. [异步编程](#9-异步编程)
10. [错误处理](#10-错误处理)
11. [总结](#11-总结)

---

## 1. JavaScript 基础

### JavaScript 的作用

- **增强用户交互**：动态页面更新、按钮事件等。
- **操作 DOM**：增删改查 HTML 元素。
- **网络请求**：与服务器通信，如 AJAX 和 Fetch。
- **数据处理**：通过逻辑和算法处理数据。

### 语法基础

- JavaScript 是区分大小写的。
- 语句以分号结尾（可选，但推荐加分号）。
- 注释有两种：单行注释和多行注释。

```js
// 单行注释
/*
   多行注释
*/
console.log("欢迎学习 JavaScript!");
```

---

## 2. 变量与常量

JavaScript 提供了 `var`、`let` 和 `const` 来声明变量。

| 关键字    | 描述                                       |
|-----------|--------------------------------------------|
| `var`     | 全局或函数作用域，较老式，不推荐使用。      |
| `let`     | 块作用域，能够重新赋值，安全实用。          |
| `const`   | 块作用域，只读，定义后不可重新赋值。        |

### 示例

```js
let name = "Alice";
const age = 30;
var country = "USA";

name = "Bob"; // 使用 let 声明的变量可以改变值
// age = 31; // 错误！使用 const 声明的变量无法重新赋值
```

---

## 3. 数据类型和运算符

### 数据类型

JavaScript 拥有 8 种基本数据类型：

| 类型              | 描述                                  | 示例             |
|-------------------|---------------------------------------|------------------|
| `Number`          | 数字，包括整数和浮点数                | `42`, `3.14`     |
| `String`          | 字符串，用引号包裹                   | `"hello"`, `'hi'`|
| `Boolean`         | 布尔值，真或假                       | `true`, `false`  |
| `null`            | 空值，表示"无"                       | `null`           |
| `undefined`       | 未定义                               | `undefined`      |
| `Symbol`          | 唯一的标识符                        | `Symbol('id')`   |
| `BigInt`          | 超大数字                             | `12345678901234567890n` |
| `Object`          | 对象（引用类型）                     | `{name: 'Alice'}`|

### 示例

```js
let num = 42; // Number
let str = "Hello, JavaScript!"; // String
let isLearning = true; // Boolean
let notAssigned; // undefined
let emptyValue = null; // null
let uniqueId = Symbol('id'); // Symbol
let bigIntValue = 9007199254740991n; // BigInt
let person = { name: "Alice", age: 25 }; // Object
```

### 运算符

JavaScript 运算符包括算术运算符、赋值运算符、比较运算符和逻辑运算符。

#### 算术运算符

| 运算符    | 描述         | 示例          |
|-----------|--------------|---------------|
| `+`       | 加法         | `1 + 1`       |
| `-`       | 减法         | `5 - 2`       |
| `*`       | 乘法         | `3 * 4`       |
| `/`       | 除法         | `10 / 2`      |
| `%`       | 取余         | `10 % 3`      |

#### 比较运算符

| 运算符    | 描述                     | 示例         |
|-----------|--------------------------|--------------|
| `==`      | 等于（值相等）           | `5 == '5'`   |
| `===`     | 全等于（值和类型都相等） | `5 === 5`    |
| `!=`      | 不等于                   | `5 != '6'`   |
| `!==`     | 全不等                   | `5 !== '5'`  |

---

## 4. 条件判断和循环

### 条件判断

`if`, `else if`, `else` 用于控制程序执行逻辑：

```js
let score = 85;
if (score >= 90) {
  console.log("优秀");
} else if (score >= 60) {
  console.log("及格");
} else {
  console.log("不及格");
}
```

三元运算符精简条件：

```js
let isAdult = age >= 18 ? "是成年人" : "是未成年人";
console.log(isAdult);
```

### 循环

`for`, `while` 和 `do...while` 用于执行循环：

```js
// 使用 for 循环
for (let i = 0; i < 5; i++) {
  console.log(i); // 输出 0 到 4
}

// 使用 while 循环
let count = 0;
while (count < 5) {
  console.log(count);
  count++;
}
```

---

## 5. 函数

### 定义函数

JavaScript 提供多种方式定义函数：

```js
function add(a, b) {
  return a + b;
}

const subtract = function (a, b) {
  return a - b;
};

const multiply = (a, b) => a * b; // ES6 箭头函数
```

### 默认参数

函数参数可以设定默认值：

```js
function greet(name = "匿名") {
  console.log(`Hello, ${name}!`);
}
greet(); // 输出 "Hello, 匿名!"
greet("Alice"); // 输出 "Hello, Alice!"
```

---

## 6. 对象

对象是键值对的集合。

### 示例

```js
const person = {
  name: "Alice",
  age: 25,
  greet: function () {
    console.log(`Hi, I am ${this.name}`);
  }
};

console.log(person.name); // 访问属性
person.greet(); // 调用方法
```

---

## 7. 数组

数组是有序的元素集合，可存储任意类型的数据。

### 示例

```js
let colors = ["red", "green", "blue"];
console.log(colors[0]); // 访问第一个元素
colors.push("yellow"); // 添加元素
console.log(colors.length); // 获取数组长度
```

---

## 8. ES6+ 特性

### 解构赋值

从数组或对象中提取数据：

```js
const [x, y] = [1, 2];
const { name, age } = { name: "Alice", age: 25 };
```

### 箭头函数

简洁的函数语法，保留 `this` 上下文：

```js
let square = x => x * x;
```

### 模块化导入和导出

```js
// 导出
export const greet = () => console.log("Hello");
export default greet;

// 导入
import greet from "./module.js";
import { greet as namedGreet } from "./module.js";
```

---

## 9. 异步编程

JavaScript 常见异步编程工具包括 `Promise`、`async/await` 和回调。

```js
async function fetchData() {
  const response = await fetch("https://api.example.com/data");
  const data = await response.json();
  console.log(data);
}
fetchData();
```

---

## 10. 错误处理

使用 `try...catch` 捕获并处理错误：

```js
try {
  throw new Error("Something went wrong!");
} catch (error) {
  console.error(error.message);
}
```

---

## 11. 总结

本文全面概述了 JavaScript 的基础语法和核心操作，包括变量、函数、对象、数组、条件判断、循环等。通过循序渐进的学习，掌握这些语法后可以应对大部分开发需求，并继续深入学习高级特性，如 `DOM 操作`、`事件处理` 和 `框架使用`。
