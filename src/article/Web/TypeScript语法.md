---
title: TypeScript语法
category:
  - 前端
tag:
  - TypeScript
---

TypeScript 是 JavaScript 的超集，主要增加了静态类型检查和现代特性，使得开发更高效、更健壮。它兼容所有 JavaScript 代码，最终被编译为纯 JavaScript。

本文系统总结了 TypeScript 的所有核心知识点，便于查阅和学习。

<!-- more -->
---

## 目录

1. [TypeScript 基础](#1-typescript-基础)
2. [基本类型](#2-基本类型)
3. [接口](#3-接口)
4. [类](#4-类)
5. [泛型](#5-泛型)
6. [类型系统](#6-类型系统)
   - [联合类型和交叉类型](#联合类型和交叉类型)
   - [类型断言](#类型断言)
   - [类型别名和字面量类型](#类型别名和字面量类型)
7. [模块化](#7-模块化)
8. [装饰器](#8-装饰器)
9. [实用工具类型](#9-实用工具类型)
10. [配置与工具](#10-配置与工具)
11. [总结](#11-总结)

---

## 1. TypeScript 基础

### 什么是 TypeScript？

TypeScript 是一种强类型的编程语言，在 JavaScript 的基础上增加了以下能力：
- 类型系统（Type System）
- 接口（Interface）与泛型（Generic）
- 更好的开发体验（如自动补全、类型检查等）
- ES6/ES7 的新语法支持

### TypeScript 项目初始化

安装 TypeScript 工具：

```bash
npm install -g typescript
```

初始化项目并生成配置文件 `tsconfig.json`：

```bash
npx tsc --init
```

运行 TypeScript 文件：

```bash
tsc file.ts  # 编译为 JavaScript
node file.js # 运行编译结果
```

---

## 2. 基本类型

TypeScript 提供了一套静态类型系统，可以为变量和函数指定类型。

### 常见的基本类型

| 类型       | 描述                                | 示例                        |
|------------|-------------------------------------|-----------------------------|
| `boolean`  | 布尔值类型                          | `let isDone: boolean = true;`|
| `number`   | 数值，包括整数和浮点数              | `let age: number = 25;`     |
| `string`   | 字符串类型                          | `let name: string = 'Tom';`|
| `array`    | 数组类型，可以定义元素类型          | `let arr: number[] = [1, 2, 3];` |
| `tuple`    | 定义特定顺序的数组                  | `let tuple: [string, number] = ['age', 30];`|
| `any`      | 任意类型，可绕过类型检查            | `let random: any = 'hello';`|
| `unknown`  | 未知类型（更安全的 `any`）          | `let input: unknown;`       |
| `void`     | 无返回值的函数                      | `function log(): void {}`   |
| `null` & `undefined` | 空值、未定义的值           | `let x: null = null;`       |
| `never`    | 不会有返回值的类型（如错误抛出）    | `function error(): never { throw new Error(); }` |

### 类型注释与自动推断

```ts
// 显式类型声明
let count: number = 10;

// 类型推断
let inferredCount = 10; // 自动推断为 number
```

---

## 3. 接口

接口用于定义对象的结构和行为。

### 定义接口

```ts
interface Person {
  name: string;
  age: number;
}

const person: Person = {
  name: 'John',
  age: 30,
};
```

### 可选属性与只读属性

```ts
interface Car {
  brand: string;
  color?: string; // 可选属性
  readonly wheels: number; // 只读属性
}

const myCar: Car = { brand: 'Toyota', wheels: 4 };
// myCar.wheels = 5; // 错误，wheels 是只读属性
```

### 接口继承

接口可以继承其他接口。

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const myDog: Dog = {
  name: 'Bobby',
  breed: 'Golden Retriever',
};
```

---

## 4. 类

TypeScript 提供了对 ES6 类的完整支持，并扩展了类型声明、访问修饰符等特性。

### 定义类与构造函数

```ts
class User {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

const john = new User('John', 25);
john.greet(); // 输出：Hello, my name is John
```

### 访问修饰符

| 修饰符          | 描述                            |
|-----------------|---------------------------------|
| `public`        | 公共属性，默认修饰符            |
| `private`       | 私有属性，外部不可访问           |
| `protected`     | 受保护属性，允许子类访问         |

```ts
class Person {
  private age: number;
  constructor(age: number) {
    this.age = age;
  }
  getAge() {
    return this.age;
  }
}
const p = new Person(30);
// console.log(p.age); // 错误
console.log(p.getAge()); // 正确
```

---

## 5. 泛型

泛型提供了强大的类型复用能力。

### 定义泛型函数

```ts
function identity<T>(value: T): T {
  return value;
}

console.log(identity<number>(42)); // 泛型指定为 number
console.log(identity<string>('Hello')); // 泛型指定为 string
```

### 泛型接口

```ts
interface Box<T> {
  content: T;
}

const stringBox: Box<string> = { content: 'Hello' };
const numberBox: Box<number> = { content: 123 };
```

---

## 6. 类型系统

### 联合类型和交叉类型

- **联合类型**：值可为多个类型之一。
- **交叉类型**：组合多个类型属性。

```ts
type ID = string | number; // 联合类型
type User = { name: string } & { age: number }; // 交叉类型

const user: User = { name: 'Alice', age: 30 };
```

### 类型断言

通过 `as` 或 `<>` 明确告诉编译器变量的实际类型。

```ts
let someValue: unknown = 'This is a string';
let strLength: number = (someValue as string).length;
```

### 类型别名和字面量类型

```ts
type Color = 'red' | 'blue' | 'green'; // 字面量类型
type Point = { x: number; y: number }; // 类型别名

const point: Point = { x: 10, y: 20 };
```

---

## 7. 模块化

### 导入和导出

```ts
// utils.ts
export function add(a: number, b: number): number {
  return a + b;
}

// main.ts
import { add } from './utils';
console.log(add(2, 3));
```

---

## 8. 装饰器

装饰器是一种对类、方法或属性进行注释和改造的语法。

```ts
function Log(target: any, propertyName: string) {
  console.log(`${propertyName} 被访问`);
}

class Example {
  @Log
  greet() {
    console.log('Hello');
  }
}
```

---

## 9. 实用工具类型

TypeScript 提供了一些内置的工具类型，用于操作类型。

| 工具类型      | 描述                                   |
|---------------|----------------------------------------|
| `Partial<T>`  | 将类型 `T` 中的所有属性变为可选         |
| `Required<T>` | 将类型 `T` 中的所有属性变为必填         |
| `Readonly<T>` | 将类型 `T` 的所有属性变为只读           |
| `Pick<T, K>`  | 从类型 `T` 中选取特定属性组成新类型     |
| `Omit<T, K>`  | 从类型 `T` 中移除特定属性组成新类型     |

示例：

```ts
interface User {
  name: string;
  age: number;
}

type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;
```

---

## 10. 配置与工具

### `tsconfig.json`

常见配置项：

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

### 常用工具

- **`ts-node`**：执行 TypeScript 文件。
- **`eslint`**：静态类型分析。
- **`webpack`/`vite`**：打包器，支持 TypeScript。
- **`jest`**：单元测试工具。

---

## 11. 总结

TypeScript 结合类型系统和现代语法特性，有效提升了开发效率和代码质量。通过掌握本文内容，你可以从基础能力扩展到高级类型系统应用，并结合 `TypeScript` 开发现代化的应用项目。