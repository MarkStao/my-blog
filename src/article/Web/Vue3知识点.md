---
title: Vue3知识点
category:
  - 前端开发
tag:
  - Vue3
---

Vue.js 是一个轻量、渐进式的 JavaScript 框架，常用于构建用户界面和单页应用（SPA）。Vue 3 引入了新的特性，如组合式 API（Composition API）、单文件组件（SFC）增强等。

本文整理了 Vue 3 的全量信息，包括其核心概念、语法、API 及代码示例，以备查阅和学习。

<!-- more -->
---

## 目录

1. [Vue 3 基础](#1-vue-3-基础)
2. [创建和挂载 Vue 应用](#2-创建和挂载-vue-应用)
3. [模板语法](#3-模板语法)
4. [计算属性与侦听器](#4-计算属性与侦听器)
5. [指令](#5-指令)
6. [组件](#6-组件)
7. [组合式 API](#7-组合式-api)
8. [Vue Router 路由](#8-vue-router-路由)
9. [Pinia 状态管理](#9-pinia-状态管理)
10. [生命周期钩子](#10-生命周期钩子)
11. [内置 API 工具](#11-内置-api-工具)
12. [总结](#12-总结)

---

## 1. Vue 3 基础

Vue 是一个声明式框架，其核心思想是：**数据驱动视图**。开发者只需关注数据结构，Vue 会自动将数据与 DOM 绑定。

### 基本文件结构

```bash
src/
├── App.vue        # 根组件
├── main.js        # 入口文件
├── components/    # 子组件目录
└── assets/        # 静态资源
```

### 安装

- 使用 `Vue CLI` 创建项目：

```bash
npm install -g @vue/cli
vue create my-vue-app
cd my-vue-app
npm run serve
```

- 使用 `vite` 创建项目：

```bash
npm init vite@latest my-vue-app --template vue
cd my-vue-app
npm install
npm run dev
```

---

## 2. 创建和挂载 Vue 应用

在 Vue 3 中，创建和挂载应用采用全新的 `createApp` 方法。

```js
// main.js
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.mount('#app');
```

---

## 3. 模板语法

Vue 模板使用 **模板语法** 来声明数据绑定和逻辑。

### 数据绑定

```vue
<template>
  <h1>{{ message }}</h1>
  <input v-bind:placeholder="placeholderText" />
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello, Vue 3!',
      placeholderText: 'Type something...',
    };
  },
};
</script>
```

### 指令

常见指令用法：

| 指令                | 用途                  | 示例                                      |
|---------------------|-----------------------|-------------------------------------------|
| `v-bind`            | 属性绑定             | `<img v-bind:src="imageSrc" />`           |
| `v-model`           | 双向数据绑定         | `<input v-model="formData" />`            |
| `v-if / v-else-if / v-else` | 条件渲染 | `<div v-if="isShown">内容</div>`         |
| `v-for`             | 列表渲染             | `<li v-for="item in list" :key="item.id">{{ item.text }}</li>` |

---

## 4. 计算属性与侦听器

### 计算属性

计算属性是基于依赖缓存的属性：

```vue
<template>
  <h1>{{ fullName }}</h1>
</template>

<script>
export default {
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe',
    };
  },
  computed: {
    fullName() {
      return `${this.firstName} ${this.lastName}`;
    },
  },
};
</script>
```

### 侦听器 (Watch)

侦听器用于监控数据变化并处理逻辑：

```vue
<script>
export default {
  data() {
    return {
      age: 25,
    };
  },
  watch: {
    age(newAge, oldAge) {
      console.log(`年龄从 ${oldAge} 变为 ${newAge}`);
    },
  },
};
</script>
```

---

## 5. 指令

Vue 提供了丰富的内置指令，用于简化开发：

| 指令          | 描述                             | 示例                                  |
|---------------|----------------------------------|---------------------------------------|
| `v-show`      | 条件显示（通过 `display` 控制）  | `<div v-show="isVisible"></div>`      |
| `v-on`        | 事件绑定                        | `<button v-on:click="handleClick">Click Me</button>` |
| `v-html`      | 输出 HTML                       | `<div v-html="htmlContent"></div>`    |

---

## 6. 组件

### 定义组件

```vue
<template>
  <h1>{{ title }}</h1>
</template>

<script>
export default {
  name: 'MyComponent',
  props: {
    title: String,
  },
};
</script>
```

### 父子组件通信

父组件通过 `props` 向子组件传递数据：

```vue
<!-- Parent.vue -->
<template>
  <ChildComponent title="Hello from Parent" />
</template>
```

子组件通过 `emit` 向父组件发送事件：

```vue
<template>
  <button @click="$emit('customEvent')">Click Me</button>
</template>
```

---

## 7. 组合式 API

Vue 3 提供了新的组合式 API，以提升组件逻辑复用性。

### `setup` 函数

组合式 API 的入口是 `setup`：

```vue
<template>
  <h1>{{ count }}</h1>
  <button @click="increment">Increment</button>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const increment = () => {
      count.value++;
    };
    return { count, increment };
  },
};
</script>
```

---

## 8. Vue Router 路由

### 路由配置

```js
// router.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import AboutPage from './pages/AboutPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

挂载路由：

```js
// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');
```

---

## 9. Pinia 状态管理

Pinia 是 Vue 推荐的状态管理库，代替 Vuex。

### 安装 Pinia

```bash
npm install pinia
```

### 使用 Pinia

```js
// store.js
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++;
    },
  },
});
```

在组件中使用：

```vue
<template>
  <button @click="increment">Count is {{ count }}</button>
</template>

<script>
import { useCounterStore } from '../store';

export default {
  setup() {
    const store = useCounterStore();
    return { count: store.count, increment: store.increment };
  },
};
</script>
```

---

## 10. 生命周期钩子

Vue 3 提供以下生命周期钩子：

| 钩子名              | 描述                      |
|---------------------|---------------------------|
| `onMounted`         | 组件挂载完成时触发        |
| `onUnmounted`       | 组件销毁时触发            |
| `onUpdated`         | DOM 更新后触发            |

---

## 11. 内置 API 工具

| 工具             | 描述                            |
|------------------|---------------------------------|
| `ref`            | 定义响应式数据                  |
| `reactive`       | 创建响应式对象                  |
| `watch`          | 监听数据变化                   |
| `computed`       | 创建计算属性                   |

---

## 12. 总结

Vue 3 不仅提供了现代化的组合式 API，还优化了性能、提升了扩展性，成为构建 SPA 的强大框架。查阅文档和持续实战是掌握 Vue 3 的最佳途径。