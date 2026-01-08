---
alwaysApply: false
globs: apps/mp-c/**,apps/mp-b/**
---
# 项目概览

本项目主要服务宠物主，包括上门洗护、上门喂猫、遛狗等服务。

## UI 样式风格
- **主色调**：活力橙 (#ff7a00)，传达温暖、活泼、亲和的品牌形象。
- **设计语言**：
  - **圆润亲和**：卡片和按钮使用较大的圆角（如 `rounded-lg`），避免尖锐的直角。
  - **简洁现代**：大量使用留白（Whitespace），清晰的信息层级，避免视觉杂乱。
  - **层次分明**：使用浅灰色背景（如 `#f7f8fa`）衬托白色卡片内容。
- **色彩规范**：
  - Primary: `#ff7a00` (通过 `text-primary`, `bg-primary` 使用)
  - Text: 主要文字 `#333`，次要文字 `#666`，辅助文字 `#999`。
  - Background: 页面背景 `#f7f8fa`，内容背景 `#ffffff`。

## 核心配置文件
- [package.json](mdc:package.json) - 项目依赖和脚本配置
- [vite.config.ts](mdc:vite.config.ts) - Vite 构建配置
- [pages.config.ts](mdc:pages.config.ts) - 页面路由配置
- [manifest.config.ts](mdc:manifest.config.ts) - 应用清单配置
- [uno.config.ts](mdc:uno.config.ts) - UnoCSS 配置

## 主要目录结构
- `src/pages/` - 页面文件
- `src/components/` - 组件文件
- `src/layouts/` - 布局文件
- `src/api/` - API 接口
- `src/http/` - HTTP 请求封装
- `src/store/` - 状态管理
- `src/tabbar/` - 底部导航栏
- `src/App.ku.vue` - 全局根组件（类似 App.vue 里面的 template作用）

## Vue 组件规范
- 使用 Composition API 和 `<script setup>` 语法
- 组件文件使用 PascalCase 命名
- 页面文件放在 `src/pages/` 目录下
- 全局组件文件放在 `src/components/` 目录下
- 局部组件文件放在页面的 `/components/` 目录下

## TypeScript 规范
- 严格使用 TypeScript，避免使用 `any` 类型
- 为 API 响应数据定义接口类型
- 使用 `interface` 定义对象类型，`type` 定义联合类型
- 导入类型时使用 `import type` 语法

## 状态管理
- 使用 Pinia 进行状态管理
- Store 文件放在 `src/store/` 目录下
- 使用 `defineStore` 定义 store
- 支持持久化存储

## UnoCSS 原子化 CSS
- **核心配置**：配置在 [uno.config.ts](mdc:uno.config.ts)，集成了 `preset-uni`。
- **主题色使用**：
  - 使用 `text-primary`, `bg-primary`, `border-primary` 等工具类，它们会自动映射到 `--wot-color-theme` (#ff7a00)。
- **常用工具类推荐**：
  - 布局：`flex`, `grid`, `justify-between`, `items-center`
  - 间距：`m-4`, `p-4`, `gap-2` (基于 rpx 转换)
  - 文本：`text-sm`, `text-gray-500`, `font-bold`
  - 交互：`active:opacity-80` (点击反馈)
- 优先使用原子化类名，减少自定义 CSS

## Vue SFC 组件规范
- `<script setup lang="ts">` 标签必须是第一个子元素
- `<template>` 标签必须是第二个子元素
- `<style scoped>` 标签必须是最后一个子元素（因为推荐使用原子化类名，所以很可能没有）

## 页面开发
- 页面文件放在 [src/pages/]目录下
- 使用约定式路由，文件名即路由路径
- 页面配置在宏 `definePage` 中配置标题等内容，会自动生成到 `pages.json` 中
- 为了方便之后重构和分包，需要在 [src/router/pages.ts] 中定义页面路径

## 组件开发
- **首选组件库**：**Wot Design Uni** (wot-ui)。项目已配置相关 CSS 变量，优先使用其提供的组件以保持风格一致。
- 全局组件文件放在 `src/components/` 目录下
- 局部组件文件放在页面的 `/components/` 目录下
- 使用 uni-app 内置组件和第三方组件库
- 支持 wot-ui\uview-pro\uv-ui\sard-ui\uview-plus 等多种第三方组件库 和 z-paging 组件
- 自定义组件遵循 uni-app 组件规范

## 平台适配
- 禁止使用条件编译
- 使用 uni.xxx API 替代原生 API

## 生命周期
- 使用 uni-app 页面生命周期
- onLoad、onShow、onReady、onHide、onUnload
- 组件生命周期遵循 Vue3 规范
- 注意页面栈和导航管理