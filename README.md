# CampusBiz AI - 校园周边商家 AI 运营助手

## 项目简介

CampusBiz AI 是一个面向校园周边小微商家的静态 AI 产品 MVP。它用 HTML、CSS 和原生 JavaScript 模拟一个 AI 运营工作台，帮助奶茶店、饭店、理发店、打印店、健身房、水果店等商家完成商家画像、活动策划、内容生成、平台分发建议、顾客评论回复和轻量复盘。

产品闭环是：商家画像 → 活动目标 → AI 生成运营内容包 → 一周发布计划 → 顾客评论回复 → 效果复盘建议 → 下一轮活动优化。

## 在线体验

- Demo：https://zheng1yu1.github.io/campusbiz-ai-assistant/
- GitHub：https://github.com/zheng1yu1/campusbiz-ai-assistant

## 产品定位

CampusBiz AI 关注的是校园周边小店的日常运营问题：活动信息零散、文案临时写、平台风格不统一、重复咨询多。当前版本不追求完整商业系统，而是用可运行的静态原型验证工作流是否成立。

## 功能模块

- 首页 AI 工作台：生成活动主题、朋友圈文案、小红书标题、短视频脚本、顾客回复和复盘建议。
- 运营仪表盘：使用模拟数据展示本周运营台效果。
- 一周运营日历：根据主推产品生成周一到周日计划。
- 评论回复助手：生成好评、差评、活动咨询、价格咨询等回复建议。
- 案例库：展示 6 个行业示例数据。
- 用户验证：整理假设、实验路径、访谈问题和关键指标。
- AI 工作流：展示 Prompt 编排思路和未来真实系统架构。
- 定价方案：展示 19/49/99 元三档商业验证思路。

## 页面说明

- `index.html`：产品官网与 AI 工作台 Demo。
- `dashboard.html`：运营仪表盘。
- `calendar.html`：一周运营日历。
- `reply.html`：评论回复助手。
- `cases.html`：行业案例库。
- `research.html`：用户验证页面。
- `workflow.html`：AI 工作流页面。
- `pricing.html`：定价方案页面。
- `faq.html`：常见问题。
- `privacy.html`：隐私说明。
- `404.html`：GitHub Pages 404 页面。
- `product-plan.html`：一页 A4 产品验证方案。

## 技术栈

- HTML
- CSS
- 原生 JavaScript
- localStorage（仅用于浏览器本地历史记录）

项目不依赖 React、Vue、Node.js、后端、数据库或真实大模型 API。

## 项目结构

```text
campusbiz-ai-assistant/
├── index.html
├── dashboard.html
├── calendar.html
├── reply.html
├── cases.html
├── research.html
├── workflow.html
├── pricing.html
├── faq.html
├── privacy.html
├── 404.html
├── product-plan.html
├── styles.css
├── script.js
└── README.md
```

## 本地运行

直接双击 `index.html` 即可打开首页。也可以直接打开任意 HTML 页面。

如果希望用本地静态服务预览，可以在项目目录运行任意静态服务器，但这不是必需步骤。

## GitHub Pages 部署

1. 将项目文件上传到仓库 `zheng1yu1/campusbiz-ai-assistant`。
2. 进入仓库 `Settings` → `Pages`。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `main`，目录选择 `/root`。
5. 保存后等待 GitHub Pages 生成访问地址。

## MVP 边界

当前版本是静态 MVP。所有生成内容由前端规则模拟，不代表真实大模型效果；页面中的案例、仪表盘和调研记录均为示例数据或模拟数据。当前版本不接入真实 API、不自动发布到第三方平台、不做真实效果归因。

## 隐私说明

当前版本不会上传用户输入到服务器。首页历史记录仅保存在浏览器 localStorage 中，用户可以随时清空。建议不要输入真实敏感经营数据。

## 后续规划

- 接入真实大模型 API。
- 增加用户账号和店铺画像数据库。
- 增加 RAG 场景模板库。
- 增加内容效果反馈和复盘记录。
- 增加多商家管理和第三方平台发布能力。

## 版本说明

v1.0：静态 AI 产品 MVP，覆盖内容生成、运营日历、评论回复、案例库、用户验证、AI 工作流、定价方案和产品方案页。
