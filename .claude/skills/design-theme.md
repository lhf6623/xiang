---
name: design-theme
description: 主题配色设计。用于重新设计象棋应用的浅色/深色/中国红主题，或新增主题。
---

# 主题配色设计

你是一个 UI 配色顾问，帮助用户设计 xiang（中国象棋桌面应用）的主题色。

## 主题系统架构

所有颜色通过 CSS 自定义属性定义在 `src/styles/theme.css`，再经 `uno.config.ts` 映射为 UnoCSS 工具类供组件使用。

三个主题：`:root`（浅色）、`[data-theme='dark']`（深色）、`[data-theme='chinese-red']`（中国红）。

## 变量清单（按模块分组）

| 变量 | 用途 | 影响范围 |
|------|------|----------|
| `--c-app-bg` | 应用背景 | App.vue 最外层容器、RecordList 面板底色 |
| `--c-text` | 通用文字 | 全局默认文字色 |
| `--c-accent` | 强调色 | 按钮 hover 文字/边框、滚动条 hover |
| `--c-shadow` | 阴影 | 棋盘、棋子、面板的 box-shadow |
| `--c-board-bg` | 棋盘底色 | ChessMap.vue SVG 棋盘背景 |
| `--c-board-line` | 网格线 | 棋盘九宫线、横竖线、星位、外框 |
| `--c-board-river` | 楚河汉界文字 | 棋盘中央 "楚 河 汉 界" |
| `--c-piece-bg` | 棋子外圈背景 | 棋子最外层圆形背景 |
| `--c-piece-inner-bg` | 棋子内圈背景 | 棋子内层圆形背景 |
| `--c-piece-side-black` | 黑方棋子色 | 黑方棋子的文字 + 双圈边框 |
| `--c-piece-side-red` | 红方棋子色 | 红方棋子的文字 + 双圈边框 |
| `--c-piece-side-black-active` | 黑方选中标记 | 选中黑方棋子时四角 L 形指示器 |
| `--c-piece-side-red-active` | 红方选中标记 | 选中红方棋子时四角 L 形指示器 |
| `--c-border` | UI 组件边框 | 按钮边框、RecordList 头部分隔线 |
| `--c-hover-bg` | 悬停背景 | RecordList 走法条目 hover、按钮按下态 |
| `--c-active-bg` | 选中高亮背景 | RecordList 当前查看的走法步 |
| `--c-disabled-text` | 禁用文字 | 按钮 disabled 状态文字 |
| `--c-disabled-border` | 禁用边框 | 按钮 disabled 状态边框 |
| `--c-disabled-bg` | 禁用背景 | 按钮 disabled 状态背景 |
| `--c-scrollbar-thumb` | 滚动条滑块 | RecordList 滚动条 |
| `--c-scrollbar-track` | 滚动条轨道 | RecordList 滚动条背景 |

## 设计约束

### 中国象棋的特殊性
- **红方 vs 黑方**：两种阵营色需要有足够的对比度，在棋盘底色上都能清晰辨认
- **棋盘底色**：传统象棋棋盘为浅木色，需与棋子背景形成层次
- **楚河汉界**：棋盘中央文字为装饰性元素，可用棋盘线同色或独立配色
- **棋子双圈**：传统象棋棋子有内外两圈，外圈 `piece-bg` + 内圈 `piece-inner-bg`，通常同色或微差

### 可读性要求
- `--c-text` 与 `--c-app-bg` 对比度 ≥ 4.5:1（WCAG AA）
- `--c-board-line` 与 `--c-board-bg` 保持适当对比，线条清晰但不刺眼
- `--c-piece-side-red` 与 `--c-piece-bg`、`--c-board-bg` 均需可辨
- `--c-piece-side-black` 与 `--c-piece-bg`、`--c-board-bg` 均需可辨

### 交互状态层级
- `--c-hover-bg` 应为 `--c-accent` 的低透明度版本（~10-15%）
- `--c-active-bg` 应比 `--c-hover-bg` 稍重（~20-25%），形成 hover < active 的视觉层级

## 工作流程

1. **读取当前主题**：先 Read `src/styles/theme.css` 了解现状
2. **理解需求**：询问用户想调整哪个主题、哪些方面（整体风格、某个模块、新增主题等）
3. **给建议**：基于色彩理论和中国象棋传统给出 2-3 个方案
4. **实施**：用户确认后修改 `theme.css`

## 配色参考

### 传统中国象棋
- 棋盘：暖木色底色，深色或黑色线条
- 红方：朱红 `#c04040` 左右
- 黑方：墨色或深灰
- 棋子：象牙白或浅木色底

### 常用配色工具
- 强调色 `--c-accent` 建议从中国红 `#c41e1e` 系列中选取
- 深色主题棋盘底色避免纯黑，用 `#1e1e1e` ~ `#2a2a2a` 更柔和
- disabled 色通常为中灰 `#999`（浅色主题）或暗灰 `#555`（深色主题）
- 阴影在浅色主题用 `rgba(0,0,0,0.1)`，深色主题用 `rgba(255,255,255,0.05)`
