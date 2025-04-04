---
title: Markdown数学符号
category:
  - Markdown
  - 数学公式
  - LaTeX
---

Markdown 是一种轻量级的标记语言，广泛用于编写技术文档和学术文章。其内置的数学公式功能通过 LaTeX 语法支持复杂的方程式编写，为用户高效呈现科学内容。本指南将全面讲解所有 Markdown 数学语法规则、符号及高级用法，适用于在 GitHub、Obsidian、Typora 等平台精准渲染数学公式。

<!-- more -->

## 目录

1. [数学公式基本语法](#1-数学公式基本语法)
2. [公式类型](#2-公式类型)
3. [常用数学符号](#3-常用数学符号)
   - [希腊字母](#希腊字母)
   - [数学运算符](#数学运算符)
   - [集合符号](#集合符号)
4. [数学结构表达式](#4-数学结构表达式)
   - [矩阵与行列式](#矩阵与行列式)
   - [分段函数与方程联立](#分段函数与方程联立)
5. [高级排版技巧](#5-高级排版技巧)
6. [跨平台兼容性参考](#6-跨平台兼容性参考)
7. [实战编写示例](#7-实战编写示例)

---

## 1. 数学公式基本语法

### 行内公式
- **语法**: 用单个美元符号包裹公式 `$...$`
- **示例**:
  `物体的能量公式为$E=mc^2$`
  **效果**:
  物体的能量公式为$E=mc^2$

### 块级公式
- **语法**: 用双美元符号包裹公式 `$$...$$`
- **示例**:
  $$
  \int_{-\infty}^{+\infty} e^{-x^2} dx = \sqrt{\pi}
  $$
  **效果**:
  $$
  \int_{-\infty}^{+\infty} e^{-x^2} dx = \sqrt{\pi}
  $$

---

## 2. 公式类型

| 类型          | 语法示例                       | 效果                          |
|---------------|---------------------------------|-------------------------------|
| 分式          | `$\frac{a}{b}$`                | $\frac{a}{b}$                |
| 根号          | `$\sqrt{x} \quad \sqrt[3]{x}$` | $\sqrt{x} \quad \sqrt[3]{x}$ |
| 上下标        | `$x^2 \quad x_1$`              | $x^2 \quad x_1$              |
| 累加          | `$\sum_{i=1}^n a_i$`           | $\sum_{i=1}^n a_i$           |
| 累乘          | `$\prod_{k=1}^{K} p_k$`        | $\prod_{k=1}^{K} p_k$        |
| 积分          | `$\int_{a}^{b} f(x) dx$`       | $\int_{a}^{b} f(x) dx$       |

---

## 3. 常用数学符号

### 希腊字母
| 符号         | 语法          | 符号        | 语法          |
|-------------|---------------|-------------|---------------|
| α alpha      | `\alpha`      | β beta      | `\beta`       |
| γ gamma      | `\gamma`      | θ theta     | `\theta`      |
| Δ Delta      | `\Delta`      | Σ Sigma     | `\Sigma`      |

### 数学运算符
| 符号          | 语法              | 符号        | 语法         |
|---------------|-------------------|-------------|--------------|
| ±             | `\pm`            | ∓           | `\mp`        |
| ×             | `\times`         | ÷           | `\div`       |
| ≈             | `\approx`        | ≡           | `\equiv`     |

### 集合符号
| 符号          | 语法             | 说明                   |
|---------------|------------------|------------------------|
| ∈            | `\in`            | 元素属于               |
| ∪            | `\cup`           | 并集                   |
| ∩            | `\cap`           | 交集                   |
| ∅            | `\emptyset`      | 空集                   |

---

## 4. 数学结构表达式

### 矩阵与行列式
- **矩阵**: 使用 `\begin{matrix}...\end{matrix}` 环境
  **示例**:
  ```markdown
  $$
  \begin{matrix}
  1 & 2 \\
  3 & 4 \\
  \end{matrix}
  $$
  ```
  **效果**:
  $$
  \begin{matrix}
  1 & 2 \\
  3 & 4 \\
  \end{matrix}
  $$

- **行列式** (使用不同括号):
  ```markdown
  $$
  \begin{vmatrix}
  a & b \\
  c & d
  \end{vmatrix}
  $$
  ```
  **效果**:
  $$
  \begin{vmatrix}
  a & b \\
  c & d
  \end{vmatrix}
  $$

### 分段函数与方程联立
- **分段函数**: 使用 `\begin{cases}` 环境
  **示例**:
  ```markdown
  $$
  f(x) = \begin{cases}
  0 & \text{if } x < 0 \\
  1 & \text{otherwise}
  \end{cases}
  $$
  ```
  **效果**:
  $$
  f(x) = \begin{cases}
  0 & \text{if } x < 0 \\
  1 & \text{otherwise}
  \end{cases}
  $$

- **联立方程组**: 使用 `\begin{aligned}` 与 `&` 对齐
  **示例**:
  ```markdown
  $$
  \begin{aligned}
  x + y &= 5 \\
  2x - y &= 1 \\
  \end{aligned}
  $$
  ```
  **效果**:
  $$
  \begin{aligned}
  x + y &= 5 \\
  2x - y &= 1 \\
  \end{aligned}
  $$

---

## 5. 高级排版技巧

- **数学字体控制**：
  - 粗体: `$\mathbf{A}$` → $\mathbf{A}$
  - 空心字体: `$\mathbb{R}$` → $\mathbb{R}$ (实数集)
  - 手写体: `$\mathcal{L}$` → $\mathcal{L}$

- **多行公式对齐**：
  ```markdown
  $$
  \begin{align}
  (a + b)^2 &= a^2 + 2ab + b^2 \\
            &= a^2 + b^2 + 2ab
  \end{align}
  $$
  ```
  **效果**:
  $$
  \begin{align}
  (a + b)^2 &= a^2 + 2ab + b^2 \\
            &= a^2 + b^2 + 2ab
  \end{align}
  $$

---

## 6. 跨平台兼容性参考

| 工具/平台      | 支持程度                                                                 |
|----------------|--------------------------------------------------------------------------|
| **GitHub**     | 支持 `$$...$$` 块级公式，但需开启 MathJax 渲染                          |
| **Obsidian**   | 需安装插件 "Advanced Math"，支持行内与块级公式                          |
| **Typora**     | 默认支持 KaTeX 渲染，实时预览                                           |
| **Jupyter**    | 完美支持 LaTeX 公式，在 Markdown 单元格中直接使用                       |
| **VS Code**    | 需安装插件（如 "Markdown+Math"），支持实时预览                           |

---

## 7. 实战编写示例

### 完整的方程式示例
```markdown
$$
\iiint_V \nabla \cdot \mathbf{F} \, \mathrm{d}V = \oiint_S \mathbf{F} \cdot \hat{n} \, \mathrm{d}S
$$

这表示**高斯定理**的数学描述。
```

**渲染效果**：
$$
\iiint_V \nabla \cdot \mathbf{F} \, \mathrm{d}V = \oiint_S \mathbf{F} \cdot \hat{n} \, \mathrm{d}S
$$
这表示**高斯定理**的数学描述。
