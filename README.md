# 🐾 Pet Service Platform Monorepo

本项目是一个基于 Monorepo 架构的宠物服务平台项目，包含 C 端小程序和 Mock 服务/产品原型。项目使用 [Bun](https://bun.com) 进行包管理和脚本运行。

## 📂 项目结构

| 目录 | 说明 | 技术栈 |
|------|------|--------|
| **apps/mp-c** | C 端小程序代码 | Uni-app, Vue 3, Vite, unibest |
| **apps/mock-server** | Mock 接口服务 & 产品原型 | Next.js, Elysia |

## 🚀 快速开始

### 前置要求
- [Bun](https://bun.com) (推荐 v1.2.19+)
- 微信开发者工具 (用于运行小程序)

### 安装依赖

在项目根目录下运行：

```bash
bun install
```

### 设置环境变量

在 `apps/mp-c/env` 目录下，你需要创建一个 `.env` 文件，用于配置小程序的环境变量。

阅读开发文档获取环境变量配置：[开发文档](https://tcnnm4edffdd.feishu.cn/wiki/Lr86wQ5MMiPSqQkI9P1cofaCnoe)

### 💻 本地开发

#### 🚀 一键启动（推荐）

在根目录下，你可以使用以下命令同时启动所有项目（Mock Server 和 小程序）：

```bash
bun run dev
```

该命令会并行执行所有子项目的 `dev` 脚本。

#### 🛠 分项目启动

如果你只想运行特定的项目，也可以进入对应目录单独启动。

##### 1. 启动 Mock Server & 产品原型

Mock Server 负责提供 API 接口模拟以及产品原型展示。

```bash
cd apps/mock-server
bun run dev
```
服务默认运行在 `http://localhost:3000`。

##### 2. 启动 C 端小程序 (mp-c)

编译并以开发模式运行微信小程序：

```bash
cd apps/mp-c
bun run dev:mp-weixin
```

**运行步骤：**
1. 执行上述命令。
2. 打开微信开发者工具。
3. 导入目录：`apps/mp-c/dist/dev/mp-weixin`。

## 🔄 CI/CD 流水线

本项目配置了自动化部署流程，当代码 **push 到 `main` 分支** 时会自动触发：

### 1. 微信小程序部署 (GitHub Actions)
- **触发条件**: Push into `main`
- **执行动作**: 自动打包构建 `apps/mp-c` 并上传至微信公众平台（体验版/开发版）。

### 2. Mock Server 部署 (Vercel)
- **触发条件**: Push into `main`
- **执行动作**: 自动构建 `apps/mock-server` 并发布上线。
- **线上地址**: [https://pet.koiism.cn](https://pet.koiism.cn)

## 📚 API 文档与 Mock

Mock Server 项目不仅用于提供接口数据，还承担了 API 文档的功能。

### 查看 API 文档
你可以通过以下 URL 格式访问特定 API 组的文档：

```
https://pet.koiism.cn/api/mock/{apiGroupName}/openai
```

请将 `{apiGroupName}` 替换为具体的业务组名称（例如 `user`, `order` 等，具体见代码定义）。

## 🛠️ 前端接口开发指南 (mp-c)

小程序端 (mp-c) 使用 [alova](https://alova.js.org/) 作为请求库，并内置了灵活的 Mock 调试机制。

### 1. 核心文件说明

| 文件路径 | 说明 |
|----------|------|
| `apps/mp-c/src/http/alova.ts` | **请求实例配置**：包含拦截器、Token 注入、错误处理及动态域名切换逻辑。 |
| `apps/mp-c/src/http/constant.ts` | **Mock 白名单**：定义哪些接口需要走 Mock 通道。 |
| `apps/mp-c/env/.env` | **环境变量**：定义 `VITE_SERVER_BASEURL` (默认地址) 和 `VITE_SERVER_BASEURL__DEV` (Mock/开发地址)。 |

### 2. 开启接口 Mock

在开发过程中，如果你希望某个特定接口走 Mock 数据（通常指向 `VITE_SERVER_BASEURL__DEV`），请按以下步骤操作：

1. 打开 `apps/mp-c/src/http/constant.ts`。
2. 将接口路径添加到 `mockList` 数组中。

```typescript
// apps/mp-c/src/http/constant.ts
export const mockList = [
  '/mp/login', // 该接口在开发环境下将自动切换至 Mock 域名
  '/mp/user/profile',
]
```

**生效条件**：
- 仅在微信开发者工具环境 (`envVersion === 'develop'`) 下生效。
- 接口路径必须精确匹配 `mockList` 中的定义。

### 3. 环境变量配置

在 `apps/mp-c/env/.env` 中配置接口的基础地址：

```properties
# 默认后台请求地址
VITE_SERVER_BASEURL = 'https://pet.koiism.cn/api/mock'

# 本地开发/Mock 环境地址 (用于 mockList 中的接口)
VITE_SERVER_BASEURL__DEV = 'http://localhost:3000/api/mock'
```

> 💡 **提示**：目前默认和开发地址均指向 Mock Server，实际项目中可将 `VITE_SERVER_BASEURL` 修改为真实后端地址，实现 Mock 与真实接口的灵活混用。
