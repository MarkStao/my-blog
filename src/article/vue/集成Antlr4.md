---
# 这是文章的标题
title: 集成Antlr4
# 设置作者
author: stao
# 设置写作时间
date: 2024-08-10
# 一个页面可以有多个分类
category:
  - Vue
---

ANTLR4 是 “ANother Tool for Language Recognition” 的缩写，是一个开源的语法分析器生成器。可用于构建各种编译器、解释器、翻译器、静态代码分析器和自然语言处理器等。
<!-- more -->

## 1.下载.g4文件

下载地址：[https://download.csdn.net/download/qq_42454367/90396095](https://download.csdn.net/download/qq_42454367/90396095)

## 2.安装Antlr

（1）使用以下命令安装依赖

```bash
pnpm install antlr4ng
pnpm install --save-dev antlr4ng-cli
```

（2）在package.json文件中配置

```typescript
"scripts": {
        ...
                "antlr4ng": "antlr4ng -Dlanguage=TypeScript -o src/assets/antlr/ -visitor -listener -Xexact-output-dir src/assets/antlr/Java.g4"
    },
```

其中，**-Dlanguage**为要生成的文件类型 ，**-o src/assets/antlr\/**为生成的目录，**src/assets/antlr/Java.g4**为.g4文件的地址。
3）点击调试，选择antlr4ng运行。
![在这里插入图片描](https://i-blog.csdnimg.cn/direct/47cb27a6631f498aad4974caedd63545.png)

运行结束，将在目录生成对应文件。
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/0fff408d1b51474a85c740725097a8c4.png)
（4）再在对应页面将其引入调用即可

```typescript
import { CharStream, CommonTokenStream } from "antlr4ng";
import { JavaLexer } from "@/assets/antlr/JavaLexer";
import { JavaParser } from "@/assets/antlr/JavaParser";
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/819acf5fcaa446aa985876261052858a.png)

## 3.出现的问题

（1）The requested module '/node_modules/.vite/deps/antlr4ng.js?v=aaef2d65' does not provide an export named
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/e322cbd9b3714e318b2ab09a11d91c17.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c84eaf4889dc421e8a118b93807054da.png)
解决方法：在对应位置加上type即可
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/fb4284d3ae7040fe866a292b1208ac8b.png)

## 4.示例代码

```typescript
import * as antlr4ng from 'antlr4ng'
import { JavaLexer } from '@/assets/antlr/JavaLexer'
import {
  CompilationUnitContext,
  ImportDeclarationContext,
  JavaParser,
  PackageDeclarationContext,
  TypeDeclarationContext,
} from '@/assets/antlr/JavaParser'
import { JavaListener } from '@/assets/antlr/JavaListener'
import { JavaVisitor } from '@/assets/antlr/JavaVisitor'

/**
 * 加载解析器
 *
 * 该函数使用ANTLR解析器对Java代码进行解析它首先将代码字符串转换为字符流，
 * 然后通过JavaLexer生成词法分析结果，最后使用JavaParser生成语法树
 *
 * @param code 待解析的Java代码字符串
 * @returns 返回解析生成的语法树
 */
export const loadParser = (code: string) => {
  let charStream = antlr4ng.CharStream.fromString(code)
  let lexer = new JavaLexer(charStream)
  return new JavaParser(new antlr4ng.CommonTokenStream(lexer)).compilationUnit()
}

/**
 * 获取包名
 *
 * 此函数使用解析器构建代码的抽象语法树，然后遍历该树以找到并提取包声明
 * 如果找到包声明，它会进一步解析以构造完整的包名字符串
 *
 * @param code 包含Java代码的字符串
 * @returns 提取到的包名字符串，如果没有找到包声明，则返回空字符串
 */
export const getPackageName = (code: string) => {
  let packageName = ''
  // 获取包名的限定名称节点
  let qualifiedName = loadParser(code).packageDeclaration()?.qualifiedName()
  if (qualifiedName != null) {
    // 遍历限定名称中的标识符
    for (let i = 0; i < qualifiedName?.Identifier().length; i++) {
      if (i > 0) {
        packageName += '.'
      }
      packageName += qualifiedName.Identifier()[i]?.getText() || ''
    }
  }
  return packageName
}

/**
 * 获取依赖信息
 *
 * 该函数通过解析给定的代码字符串，提取出其中的依赖项
 * 主要用于代码分析，了解一个代码片段依赖于哪些外部模块或组件
 *
 * @param code 需要解析的代码字符串
 * @returns 返回提取出的依赖项数组
 */
export const getDependency = (code: string) => {
  return extractImports(loadParser(code), [])
}

/**
 * 递归解析语法树
 */
let extractImports = (tree: any, val: string[]) => {
  if (tree instanceof ImportDeclarationContext) {
    // 提取import语句
    val.push(tree.getText().replace(/^\s*import\s*/, ''))
  }
  // 递归遍历子节点
  for (let i = 0; i < tree.getChildCount(); i++) {
    extractImports(tree.getChild(i), val)
  }
  return val
}

```
