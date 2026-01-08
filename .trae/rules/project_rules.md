---
alwaysApply: true
---
# 🐾 宠物上门服务平台 - 项目核心规范

## 1. 项目愿景与业务背景
本项目是一个 **C2C/B2C 宠物上门服务平台**，旨在连接宠物主与专业的宠托师/洗护师。
- **核心业务**：上门洗护、上门喂猫、遛狗服务。
- **主要流程**：用户（C端）通过小程序 -> 按时间/位置搜索服务人员 -> 查看详情 -> 下单预约 -> 服务履约。
- **当前目标**：构建高质量、用户体验流畅的小程序，并建立稳健的前后端交互标准。

## 2. Monorepo 架构上下文
当前 Monorepo 包含以下核心应用：
1.  **`apps/mp-c`**: C 端用户小程序 (UniApp + Vue3 + TS)。具体规范请参考：[mp_rules.md](mdc:.trae/rules/mp_rules.md)
2.  **`apps/mp-b`**: B 端服务人员小程序 (UniApp + Vue3 + TS)。具体规范请参考：[mp_rules.md](mdc:.trae/rules/mp_rules.md)
3.  **`apps/mock-server`**: Mock API 服务端 (Elysia + Node)。具体规范请参考：[mock_rules.md](mdc:.trae/rules/mock_rules.md)

## 3. 标准开发流程 (Standard Operating Procedure)

当接收到一个**功能性需求**时，AI 助手应主动将任务拆解为以下 4 个阶段，并按顺序执行。**不要试图一次性完成所有步骤**，应分阶段交付并寻求确认。

### Phase 1: 接口定义与 Mock 数据 (API First)
**目标**：确定数据结构，解除前端对后端的依赖。
- **动作**：
    1.  分析需求，定义 Zod Schema (入参 `Params` 和出参 `Response`)。
    2.  在 `apps/mock-server/src/app/api/mock/` 下创建对应模块。
    3.  编写 `model.ts`, `service.ts`, `route.ts`。
    4.  确保生成的 Mock 接口符合 OpenAPI 标准，并能正常返回数据。
- **产出物**：Mock 接口 URL、TypeScript 类型定义。

### Phase 2: 页面与组件 UI 实现 (UI Implementation)
**目标**：完成静态页面开发，确保视觉还原度。
- **动作**：
    1.  根据 `apps/mp-c` 规范，在 `src/pages/` 或 `src/components/` 创建文件。
    2.  使用 `Vue3 setup` 语法和 `UnoCSS` 原子化类名编写布局。
    3.  **注意**：暂时不编写复杂的业务逻辑，专注于 UI 结构、样式适配和组件拆分。
- **产出物**：可预览的静态页面/组件。

### Phase 3: 逻辑对接与交互实现 (Logic & Integration)
**目标**：让页面“动”起来，完成真实的数据流转。
- **动作**：
    1.  在前端定义 API 请求函数（引用 Phase 1 定义的类型）。
    2.  使用 `Pinia` 管理全局状态（如需）。
    3.  实现页面交互逻辑（点击、跳转、表单验证）。
    4.  联调 Mock 接口，替换静态数据。
- **产出物**：功能完整的业务模块。

### Phase 4: 代码审查与重构 (Review & Refactor)
**目标**：确保代码质量、可维护性和性能。
- **动作**：
    1.  **代码复用**：提取重复逻辑到 Hooks (`composables`) 或通用组件。
    2.  **样式优化**：检查 UnoCSS 用法是否简洁，是否可以直接使用 Preset。
    3.  **可扩展性**：思考如果增加新业务类型（如“上门医疗”），当前结构是否需要调整。
- **产出物**：优化后的最终代码。

## 4. AI 行为准则
- **主动拆解**：遇到模糊需求，先按上述流程拆解 Plan，征求用户同意后再执行。
- **类型安全**：始终坚持 TypeScript 严格模式，前后端数据结构必须对齐。
- **原子化优先**：编写 CSS 时，优先思考“是否有对应的 UnoCSS 类名”，避免手写 raw CSS。
