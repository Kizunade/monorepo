# 🎨 宠物上门服务平台 - UI 设计规范 (Design System)

本规范基于 `apps/mp-c/src/pages/me/me.vue` 现有风格进行**精致化重构**。旨在解决“元素过大、视觉粗糙”的问题，建立一套**细腻、现代、高亲和力**的视觉语言。

---

## 1. 核心设计理念 (Core Philosophy)

*   **Refined Vitality (精致活力)**: 保持品牌橙色的温暖与活力，但通过克制的留白和细腻的排版，提升整体的专业感与品质感。
*   **Modern Clean (现代简洁)**: 摒弃过度的装饰，利用微阴影 (Soft Shadows) 和 模糊背景 (Blur) 营造层次感。
*   **Functional Density (功能密度)**: 适当缩小字号与间距，提高屏幕信息利用率，避免“由于元素过大导致的低幼感”。

---

## 2. 字体排版 (Typography)

采用系统默认无衬线字体 (San Francisco / PingFang SC)。强调**字重**而非**字号**来区分层级。

### 2.1 字号层级 (Scale)
| 用途 | UnoCSS Class | 数值 (px) | 字重 (Weight) | 颜色 (Color) |
| :--- | :--- | :--- | :--- | :--- |
| **页面大标题** | `text-2xl` | 24px | `font-bold` (700) | Main Text |
| **模块标题** | `text-lg` | 18px | `font-bold` (700) | Main Text |
| **卡片/列表标题** | `text-base` | 16px | `font-semibold` (600) | Main Text |
| **正文/按钮文字** | `text-sm` | 14px | `font-medium` (500) | Secondary Text |
| **辅助说明/标签** | `text-xs` | 12px | `font-normal` (400) | Tertiary Text |
| **极小标签** | `text-[10px]` | 10px | `font-medium` (500) | Tertiary Text |

### 2.2 行高 (Line Height)
*   **标题**: `leading-tight` (1.25)
*   **正文**: `leading-normal` (1.5) - 增加阅读舒适度。

---

## 3. 色彩系统 (Color System)

### 3.1 品牌色 (Brand Colors)
*   **Primary (活力橙)**: `#FF7A00`
    *   *Usage*: 主按钮、重要图标、高亮状态。
*   **Primary Light (浅橙背景)**: `#FFF0E5` (替代之前的纯透明或深色背景)
    *   *Usage*: 标签背景、次级按钮背景。

### 3.2 中性色 (Neutrals)
*   **Main Text (主要文字)**: `#1F2937` (Gray-800) - 比纯黑更柔和。
*   **Secondary Text (次要文字)**: `#6B7280` (Gray-500) - 用于描述信息。
*   **Tertiary Text (辅助文字)**: `#9CA3AF` (Gray-400) - 用于占位符、失效状态。
*   **Border (边框)**: `#E5E7EB` (Gray-200) - 极细微的分割线。

### 3.3 背景色 (Backgrounds)
*   **Page Background**: `#F8F9FC` (冷灰白) - 比之前的 `#FFF8F5` 更现代、清爽，避免发黄的感觉。
*   **Surface (卡片背景)**: `#FFFFFF`

---

## 4. 布局与间距 (Layout & Spacing)

### 4.1 容器间距 (Padding)
*   **页面水平边距**: `px-4` (32rpx) - 标准移动端边距。
*   **卡片内边距**: `p-4` (32rpx) 或 `p-3` (24rpx) - 更加紧凑。

### 4.2 元素间距 (Gap)
*   **模块间距**: `mt-4` (32rpx)
*   **列表项间距**: `gap-3` (24rpx)
*   **内容紧凑间距**: `gap-2` (16rpx)

### 4.3 圆角 (Radius)
修正之前过大的圆角，使其看起来更干练。
*   **Card (卡片)**: `rounded-2xl` (24rpx/32rpx) - 推荐标准。
*   **Button (按钮)**: `rounded-full` (999px)
*   **Small Tag (小标签)**: `rounded-lg` (12rpx)

---

## 5. 组件样式规范 (Component Specs)

### 5.1 卡片 (Cards)
*   **风格**: 白色背景 + 微阴影。
*   **Shadow**: `shadow-sm` 或自定义 `shadow-[0_4px_16px_rgba(0,0,0,0.04)]`。
*   **Border**: 可选 `border border-gray-100` 增加精致感。

### 5.2 按钮 (Buttons)
*   **Primary Button**:
    *   Bg: `#FF7A00`
    *   Text: `#FFFFFF`
    *   Height: `h-10` (80rpx) 或 `h-11` (88rpx)
    *   Shadow: `shadow-orange-500/20 shadow-lg`
*   **Secondary/Ghost Button**:
    *   Bg: `transparent`
    *   Border: `border border-gray-200`
    *   Text: `#666`

### 5.3 图标 (Icons)
*   **Size**:
    *   Large (功能入口): `text-2xl` (24px)
    *   Medium (列表图标): `text-xl` (20px)
    *   Small (辅助图标): `text-base` (16px)
*   **Style**: 统一使用 `i-carbon-*` 图标集，保持线条风格一致。

---

## 6. 动效 (Animation)

保持“轻快”的动效风格。
*   **Hover/Active**: `active:scale-95` (轻微缩放)。
*   **Enter**: `animate-fade-in-up` (淡入上浮)。
*   **Transition**: `transition-all duration-300`。

---

## 7. 示例代码对比 (Refactor Example)

**Before (原版 - 稍显臃肿)**:
```html
<view class="rounded-[40rpx] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
  <view class="text-3xl font-black">标题</view>
</view>
```

**After (新版 - 精致)**:
```html
<view class="rounded-2xl p-4 shadow-sm border border-gray-50 bg-white">
  <view class="text-lg font-bold text-gray-800">标题</view>
</view>
```
