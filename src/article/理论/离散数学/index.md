---
title: 离散数学
category:
  - 理论
---

离散数学是研究离散量的结构及其相互关系的数学学科，广泛应用于计算机科学、密码学、人工智能等领域。本文档系统整理了离散数学中的核心公式与定理，涵盖集合论、逻辑、图论、组合数学等关键模块，旨在为学习者提供高效的参考工具。

<!-- more -->

[公式](公式.md)
[笔记](笔记.md)
[考点总结](考点总结.md)

# 目录

1. [集合论基础](#集合论基础)
2. [命题逻辑与谓词逻辑](#命题逻辑与谓词逻辑)
3. [图论基本公式](#图论基本公式)
4. [组合数学公式](#组合数学公式)
5. [数论基础公式](#数论基础公式)
6. [代数结构公式](#代数结构公式)

# 正文

## 1. 集合论基础

### 1.1 集合运算公式

- **并集**：$A \cup B = \{x \mid x \in A \lor x \in B\}$
- **交集**：$A \cap B = \{x \mid x \in A \land x \in B\}$
- **补集**：$\overline{A} = \{x \mid x \notin A\}$
- **差集**：$A - B = \{x \mid x \in A \land x \notin B\}$
- **对称差**：$A \oplus B = (A - B) \cup (B - A)$

### 1.2 集合运算律

- **交换律**：$A \cup B = B \cup A$，$A \cap B = B \cap A$
- **结合律**：$(A \cup B) \cup C = A \cup (B \cup C)$，$(A \cap B) \cap C = A \cap (B \cap C)$
- **分配律**：$A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$，$A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$
- **德摩根定律**：$\overline{A \cup B} = \overline{A} \cap \overline{B}$，$\overline{A \cap B} = \overline{A} \cup \overline{B}$

## 2. 命题逻辑与谓词逻辑

### 2.1 命题逻辑公式

- **蕴含式**：$p \rightarrow q \equiv \neg p \lor q$
- **等价式**：$p \leftrightarrow q \equiv (p \rightarrow q) \land (q \rightarrow p)$
- **逆否命题**：$p \rightarrow q \equiv \neg q \rightarrow \neg p$
- **常用逻辑等价式**：
  - 双重否定律：$\neg \neg p \equiv p$
  - 幂等律：$p \lor p \equiv p$，$p \land p \equiv p$
  - 吸收律：$p \lor (p \land q) \equiv p$，$p \land (p \lor q) \equiv p$

### 2.2 谓词逻辑公式

- **全称量词**：$\forall x P(x)$ 表示“所有x满足P(x)”
- **存在量词**：$\exists x P(x)$ 表示“存在x满足P(x)”
- **量词否定**：$\neg \forall x P(x) \equiv \exists x \neg P(x)$，$\neg \exists x P(x) \equiv \forall x \neg P(x)$

## 3. 图论基本公式

### 3.1 图的基本性质

- **顶点度数**：$\sum_{v \in V} \deg(v) = 2|E|$（握手定理）
- **完全图边数**：$K_n$ 的边数为 $\frac{n(n-1)}{2}$
- **二分图判定**：图G是二分图当且仅当G中不含奇数长度的环

### 3.2 特殊图公式

- **欧拉公式**：连通平面图满足 $v - e + f = 2$（v为顶点数，e为边数，f为面数）
- **树的性质**：n个顶点的树有 $n-1$ 条边，且任意两点间有唯一路径

## 4. 组合数学公式

### 4.1 排列组合

- **排列数**：$P(n, k) = \frac{n!}{(n-k)!}$
- **组合数**：$C(n, k) = \binom{n}{k} = \frac{n!}{k!(n-k)!}$
- **二项式定理**：$(a + b)^n = \sum_{k=0}^n \binom{n}{k} a^{n-k} b^k$

### 4.2 容斥原理

- **两集合**：$|A \cup B| = |A| + |B| - |A \cap B|$
- **三集合**：$|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|$

## 5. 数论基础公式

### 5.1 模运算

- **加法**：$(a + b) \mod m = [(a \mod m) + (b \mod m)] \mod m$
- **乘法**：$(a \times b) \mod m = [(a \mod m) \times (b \mod m)] \mod m$
- **逆元**：若 $a$ 与 $m$ 互质，则存在 $x$ 使得 $a x \equiv 1 \mod m$

### 5.2 欧拉定理

- 若 $a$ 与 $m$ 互质，则 $a^{\phi(m)} \equiv 1 \mod m$，其中 $\phi(m)$ 是欧拉函数

## 6. 代数结构公式

### 6.1 群论

- **群公理**：封闭性、结合律、单位元、逆元
- **阿贝尔群**：满足交换律的群

### 6.2 环与域

- **环**：加法交换群 + 乘法结合律 + 分配律
- **域**：交换环且非零元素构成乘法群

# 结论

离散数学的公式体系是计算机科学与工程的重要理论基石。本文档通过结构化整理，系统呈现了集合论、逻辑、图论等核心模块的关键公式。学习者可结合具体问题灵活运用这些公式，深入理解离散结构的本质及其在算法设计、密码学等领域的应用。