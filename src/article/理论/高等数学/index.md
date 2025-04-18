---
title: 高等数学
category:
  - 数学
tag:
  - 微积分
  - 工科数学
---

高等数学是工科专业的核心数学基础课程，涵盖极限、微积分、微分方程、级数等重要内容。本文系统整理工科高数所有知识点，通过定义解析、公式推导、典型例题和应用场景四维解读，助您快速掌握核心知识体系。

<!-- more -->

[公式](公式.md)
[笔记](笔记.md)
[考点总结](考点总结.md)



## 目录

1. [函数与极限](#1-函数与极限)
2. [导数与微分](#2-导数与微分)
3. [积分学](#3-积分学)
4. [微分方程](#4-微分方程)
5. [空间解析几何](#5-空间解析几何)
6. [多元微积分](#6-多元微积分)
7. [无穷级数](#7-无穷级数)
8. [附录](#8-附录)

---

## 1. 函数与极限

### 1.1 函数特性
- **有界性**：$\exists M>0, |f(x)| \leq M$
- **奇偶性**：
  - 奇函数：$f(-x) = -f(x)$（图像关于原点对称）
  - 偶函数：$f(-x) = f(x)$（图像关于y轴对称）

### 1.2 极限计算
- **重要极限**：
  $$\lim_{x \to 0} \frac{\sin x}{x} = 1$$
  $$\lim_{x \to \infty} \left(1+\frac{1}{x}\right)^x = e$$

- **洛必达法则**：当$\frac{0}{0}$或$\frac{\infty}{\infty}$时：
  $$\lim \frac{f(x)}{g(x)} = \lim \frac{f'(x)}{g'(x)}$$

### 1.3 连续与间断
- **连续条件**：$\lim_{x \to x_0} f(x) = f(x_0)$
- **间断点类型**：
  ```mermaid
  graph LR
    间断点-->可去间断点
    间断点-->跳跃间断点
    间断点-->无穷间断点
    间断点-->震荡间断点
  ```

---

## 2. 导数与微分

### 2.1 求导法则
| 类型         | 公式                          |
|--------------|------------------------------|
| 四则运算      | $(u \pm v)' = u' \pm v'$     |
| 乘积法则      | $(uv)' = u'v + uv'$          |
| 商法则        | $(\frac{u}{v})' = \frac{u'v - uv'}{v^2}$ |
| 链式法则      | $\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}$ |

### 2.2 微分应用
- **曲率公式**：
  $$K = \frac{|y''|}{(1+y'^2)^{3/2}}$$
- **泰勒展开**：
  $$f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(x_0)}{n!}(x-x_0)^n$$

---

## 3. 积分学

### 3.1 积分方法
1. **分部积分法**：
   $$\int u dv = uv - \int v du$$
2. **换元积分**：
   - 三角代换：
     ```mermaid
     flowchart LR
       sqrt(a^2-x^2) --> x=asinθ
       sqrt(x^2+a^2) --> x=atanθ
     ```
3. **瑕积分判别**：
   - 比较审敛法：若$|f(x)| \leq \frac{M}{x^p}$且$p>1$，则收敛

### 3.2 定积分应用
- 旋转体体积（绕x轴）：
  $$V = \pi \int_a^b [f(x)]^2 dx$$

---

## 4. 微分方程

### 4.1 一阶方程解法
| 类型          | 解法                     |
|---------------|--------------------------|
| 可分离变量     | $\int \frac{dy}{g(y)} = \int f(x)dx$ |
| 齐次方程       | 令$u = \frac{y}{x}$    |
| 一阶线性       | 积分因子法：$y = e^{-\int P dx} \left( \int Q e^{\int P dx} dx + C \right)$ |

### 4.2 二阶常系数方程
**特征方程法**：
方程$y'' + py' + qy = 0$，特征根：
- 两实根$r_1 \neq r_2$：$y = C_1 e^{r_1 x} + C_2 e^{r_2 x}$
- 重根$r$：$y = (C_1 + C_2 x)e^{rx}$
- 虚根$\alpha \pm \beta i$：$y = e^{\alpha x}(C_1 \cos \beta x + C_2 \sin \beta x)$

---

## 5. 空间解析几何

### 5.1 空间平面与直线
- **平面方程**：
  $$Ax + By + Cz + D = 0$$
  （法向量$\vec{n} = (A, B, C)$）

- **直线对称式**：
  $$\frac{x-x_0}{l} = \frac{y-y_0}{m} = \frac{z-z_0}{n}$$

### 5.2 曲面积分
**高斯公式**：
$$\oiint_{\Sigma} \vec{F} \cdot d\vec{S} = \iiint_{\Omega} \nabla \cdot \vec{F} dV$$

---

## 6. 多元微积分

### 6.1 偏导数与方向导数
- **全微分公式**：
  $$dz = \frac{\partial z}{\partial x}dx + \frac{\partial z}{\partial y}dy$$

- **梯度方向**：
  $$\nabla f = \left( \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}, \frac{\partial f}{\partial z} \right)$$

### 6.2 二重积分计算
- **极坐标变换**：
  $$\iint_D f(x,y) dxdy = \int_{\theta_1}^{\theta_2} \int_{r_1(\theta)}^{r_2(\theta)} f(r\cos\theta, r\sin\theta) r dr d\theta$$

---

## 7. 无穷级数

### 7.1 级数审敛法
| 方法           | 条件                          |
|----------------|------------------------------|
| 比较审敛法      | $u_n \leq v_n$且$\sum v_n$收敛 |
| 比值审敛法      | $\lim \left| \frac{u_{n+1}}{u_n} \right| = \rho$，$\rho <1$收敛 |
| 根值审敛法      | $\lim \sqrt[n]{|u_n|} = \rho$，$\rho <1$收敛 |

### 7.2 傅里叶级数
周期为$2\pi$的函数展开：
$$f(x) = \frac{a_0}{2} + \sum_{n=1}^{\infty} (a_n \cos nx + b_n \sin nx)$$
其中：
$$a_n = \frac{1}{\pi} \int_{-\pi}^{\pi} f(x)\cos nx dx$$
$$b_n = \frac{1}{\pi} \int_{-\pi}^{\pi} f(x)\sin nx dx$$

---

## 8. 附录

### 常见公式速查表
- **三角函数导数**：
  $(\tan x)' = \sec^2 x$, $(\arcsin x)' = \frac{1}{\sqrt{1-x^2}}$

- **积分公式**：
  $\int \sec x dx = \ln | \sec x + \tan x | + C$

### 希腊字母对照表
| 大写 | 小写 | 读音       |
|------|------|------------|
| Α    | α    | alpha      |
| Β    | β    | beta       |
| Γ    | γ    | gamma      |

---

> 📌 **学习建议**：
> 1. 结合图形理解空间解析几何
> 2. 通过物理应用题掌握微积分应用
> 3. 制作公式卡片强化记忆高频考点