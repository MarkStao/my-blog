---
title: CSS样式
category:
  - 前端
tag:
  - CSS
---

CSS（Cascading Style Sheets，层叠样式表）用于定义和控制页面样式。CSS3 是 CSS 的扩展版本，加入了丰富的新特性，如动画、响应式设计、渐变等。

本文全面整理 CSS 和 CSS3 样式，包括选择器、盒模型、布局、文本样式以及 CSS3 新增功能，帮助开发者快速查阅和掌握。

<!-- more -->
---

## 目录

1. [CSS 基础语法](#1-css-基础语法)
2. [选择器大全](#2-选择器大全)
3. [单位与颜色](#3-单位与颜色)
4. [盒模型](#4-盒模型)
5. [文本与字体样式](#5-文本与字体样式)
6. [背景与边框样式](#6-背景与边框样式)
7. [CSS 布局](#7-css-布局)
   - [Flexbox](#flexbox)
   - [Grid](#grid)
8. [CSS3 新特性](#8-css3-新特性)
   - [动画与过渡](#动画与过渡)
   - [渐变与阴影](#渐变与阴影)
   - [媒体查询](#媒体查询)
9. [总结](#9-总结)

---

## 1. CSS 基础语法

CSS 的基本语法如下：

```css
selector {
  property: value;
}
```

- **Selector**：选择器，指定样式作用的目标元素。
- **Property**：样式属性。
- **Value**：属性值。

示例：

```css
p {
  color: blue;
  font-size: 16px;
}
```

---

## 2. 选择器大全

CSS 提供了多种选择器，常用选择器如下：

| 选择器类型          | 类型示例       | 描述                                      |
|---------------------|---------------|-------------------------------------------|
| 通用选择器         | `*`           | 选择所有元素                              |
| 标签选择器         | `p`           | 选择所有 `<p>` 元素                       |
| 类选择器           | `.class`      | 选择指定类的所有元素                      |
| ID 选择器          | `#id`         | 选择具有指定 ID 的元素                    |
| 属性选择器         | `[type="text"]`| 选择符合属性条件的元素                    |
| 后代选择器         | `div p`       | 选择 `div` 内部的所有 `p` 元素            |
| 伪类选择器         | `a:hover`     | 选择鼠标悬浮的链接                        |
| 伪元素选择器       | `p::before`   | 在元素内容前插入内容                      |
| 子代选择器         | `div > p`     | 选择 `div` 的直接子元素 `p`               |

---

## 3. 单位与颜色

### 常用单位

| 单位类型 | 描述                     | 示例           |
|----------|--------------------------|----------------|
| `px`     | 像素（绝对单位）         | `margin: 10px;`|
| `%`      | 百分比（相对单位）       | `width: 50%;`  |
| `em`     | 相对于父元素字体大小的单位| `font-size: 1.5em;`|
| `rem`    | 相对于根元素字体大小的单位| `margin: 2rem;`|
| `vw`     | 相对于视口宽度的百分比   | `width: 50vw;` |
| `vh`     | 相对于视口高度的百分比   | `height: 50vh;`|

### 颜色表示

| 表示方式 | 示例          | 描述                           |
|----------|---------------|---------------------------------|
| 十六进制 | `#ff0000`     | 红色                           |
| RGB      | `rgb(255, 0, 0)`| 红色                         |
| RGBA     | `rgba(255, 0, 0, 0.5)` | 半透明红色                  |
| HSL      | `hsl(0, 100%, 50%)` | 红色                       |

---

## 4. 盒模型

CSS 盒模型决定了元素的大小和显示方式：

| 属性           | 描述                            |
|----------------|---------------------------------|
| `width`        | 内容宽度                        |
| `height`       | 内容高度                        |
| `padding`      | 内边距                          |
| `border`       | 边框                            |
| `margin`       | 外边距                          |
| `box-sizing`   | 确定盒模型计算方式              |

### 示例

```css
div {
  width: 300px;
  padding: 20px;
  border: 5px solid black;
  margin: 10px;
  box-sizing: border-box; /* 包括边框与内边距 */
}
```

---

## 5. 文本与字体样式

| 属性              | 描述                                  | 示例                       |
|-------------------|---------------------------------------|----------------------------|
| `color`           | 设置文本颜色                          | `color: #333;`             |
| `font-size`       | 设置文本大小                          | `font-size: 16px;`         |
| `font-family`     | 设置字体族                            | `font-family: Arial;`      |
| `font-weight`     | 设置字体粗细                          | `font-weight: bold;`       |
| `text-align`      | 设置文字水平对齐                      | `text-align: center;`      |
| `line-height`     | 设置行高                              | `line-height: 1.8;`        |
| `letter-spacing`  | 设置字间距                            | `letter-spacing: 2px;`     |
| `text-decoration` | 设置下划线、删除线等                  | `text-decoration: underline;` |

---

## 6. 背景与边框样式

### 背景

| 属性                 | 描述                                    | 示例                                 |
|----------------------|-----------------------------------------|--------------------------------------|
| `background-color`   | 设置背景颜色                           | `background-color: #eee;`           |
| `background-image`   | 设置背景图片                           | `background-image: url('bg.jpg');`  |
| `background-position`| 设置背景图位置                         | `background-position: center;`      |
| `background-repeat`  | 设置背景图片是否重复                   | `background-repeat: no-repeat;`     |
| `background-size`    | 设置背景图片比例                       | `background-size: cover;`           |

### 边框

| 属性          | 描述                                    | 示例                                    |
|---------------|-----------------------------------------|-----------------------------------------|
| `border`      | 设置边框                                | `border: 2px solid #333;`              |
| `border-radius` | 设置圆角半径                          | `border-radius: 10px;`                 |

---

## 7. CSS 布局

### Flexbox

Flexbox 定义弹性布局：

| 属性                 | 描述                                  |
|----------------------|---------------------------------------|
| `display: flex;`     | 设置为弹性容器                       |
| `justify-content`    | 主轴对齐方式                         |
| `align-items`        | 交叉轴对齐方式                       |

**示例**：

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### Grid

Grid 布局提供了基于网格的二维布局方式：

| 属性                   | 描述                                  |
|------------------------|---------------------------------------|
| `display: grid;`       | 设置为网格容器                       |
| `grid-template-rows`   | 定义行模板                           |
| `grid-template-columns`| 定义列模板                           |

**示例**：

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-gap: 10px;
}
```

---

## 8. CSS3 新特性

### 动画与过渡

| 属性                | 描述                                   | 示例                        |
|---------------------|----------------------------------------|-----------------------------|
| `transition`        | 设置过渡效果                          | `transition: all 0.3s ease;`|
| `animation`         | 定义动画                              | `animation: fadeIn 2s;`     |

**示例**：

```css
div {
  transition: transform 0.5s ease;
}
div:hover {
  transform: scale(1.2);
}
```

### 渐变与阴影

| 属性                | 描述                                   | 示例                               |
|---------------------|----------------------------------------|------------------------------------|
| `box-shadow`        | 设置元素阴影                          | `box-shadow: 2px 2px 5px gray;`    |
| `linear-gradient`   | 渐变背景                              | `background: linear-gradient(to right, red, blue);` |

**示例**：

```css
div {
  background: linear-gradient(to right, #ff0000, #0000ff);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5);
}
```

### 媒体查询

实现响应式设计：

**示例**：

```css
@media (max-width: 600px) {
  body {
    font-size: 14px;
  }
}
```

---

## 9. 总结

本文涵盖了 CSS 与 CSS3 的全面知识点，包括从基础语法到高级特性的新功能。掌握本文内容，可以满足绝大部分的 CSS 开发需求，并为构建现代化网页提供坚实的技术基础。
