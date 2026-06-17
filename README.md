# CampusBiz AI - 校园周边商家 AI 运营助手

CampusBiz AI 是一个面向校园周边小微商家的轻量级 AI 运营 Demo。它模拟了一个简单的 AI 工作台：商家输入门店类型、活动内容、目标客群和发布平台后，系统生成可直接参考的活动文案、短视频脚本和顾客回复话术。

项目重点不是做一个完整后台系统，而是验证一个具体问题：校园周边商家是否需要低成本、低门槛的内容运营辅助工具。

## 在线体验

- Demo 地址：https://zheng1yu1.github.io/campusbiz-ai-assistant/
- 产品方案页：https://zheng1yu1.github.io/campusbiz-ai-assistant/product-plan.html

## 项目背景

校园周边的奶茶店、饭店、理发店、打印店等小店，经常需要做新品、套餐、限时优惠和节日活动。很多门店没有专职运营，老板或店员通常靠朋友圈、小红书、微信群和点评平台做宣传。

这类场景里，真正耗时间的不是发布动作本身，而是把零散活动信息整理成自然、清楚、适合平台的表达。CampusBiz AI 试图用一个很小的 AI 产品原型，验证这个需求是否值得继续做下去。

## 核心功能

- 输入门店类型、门店名称、目标客群、活动内容和输出风格。
- 生成小红书标题、发布文案、短视频脚本、顾客回复话术和执行建议。
- 支持一键填入示例，方便快速查看产品效果。
- 支持复制生成内容，模拟真实运营使用流程。
- 提供独立产品方案页，便于查看 MVP 验证思路。

## 技术栈

- HTML
- CSS
- 原生 JavaScript

项目不依赖框架、不需要构建工具，也不需要安装 Node.js。

## 页面说明

- `index.html`：产品 Demo 主页面，包含首页定位、输入工作台和 AI 输出结果。
- `product-plan.html`：产品验证方案页，控制为适合 A4 打印的一页内容。
- `styles.css`：主页面样式和响应式布局。
- `script.js`：表单交互、模拟 AI 输出、复制功能。
- `README.md`：项目介绍和运行说明。

## 本地运行

直接双击 `index.html` 即可打开 Demo 页面。

也可以双击 `product-plan.html` 查看产品方案页。整个项目都是静态文件，放在浏览器里即可运行。

## GitHub Pages 部署方式

1. 将项目上传到 GitHub 仓库：
   `https://github.com/zheng1yu1/campusbiz-ai-assistant`
2. 进入仓库 `Settings`。
3. 打开 `Pages`。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。
6. 保存后等待 GitHub Pages 自动生成访问地址。

部署完成后，访问：

- `https://zheng1yu1.github.io/campusbiz-ai-assistant/`
- `https://zheng1yu1.github.io/campusbiz-ai-assistant/product-plan.html`

## 项目结构

```text
campusbiz-ai-assistant/
├── index.html
├── product-plan.html
├── styles.css
├── script.js
└── README.md
```

## MVP 边界

当前版本只做前端静态 Demo，不接入真实大模型 API，不包含登录、数据库、后台管理和真实商家数据存储。

生成内容由前端规则模拟，用于展示产品流程和验证使用场景。后续如果继续推进，可以再接入真实模型、商家账号体系和内容历史记录。

## 后续规划

- 接入真实 AI 模型，根据门店信息生成更稳定的内容。
- 增加不同门店类型的 Prompt 模板。
- 支持活动历史记录和常用回复库。
- 增加多平台内容改写，例如小红书、朋友圈、抖音、点评平台。
- 做一次真实商家试用，记录复制率、复用率和付费意愿。
