# 🏠 溧妍的打字练习室 (LiYan's Typing Studio)

> 法院书记员听写模拟训练平台 — 语音朗读 · 实时测评 · 打卡激励

![Tech](https://img.shields.io/badge/Node.js-Express-green) ![Frontend](https://img.shields.io/badge/Frontend-Vanilla%20JS%20SPA-blue) ![TTS](https://img.shields.io/badge/TTS-Web%20Speech%20API-purple)

## ✨ 功能

- 🎙️ **语音听打** — Web Speech API 朗读法律材料，0.5x-2.0x 调速
- 📊 **实时测评** — WPM / 正确率逐字比对，正确灰/错误红
- ⏱️ **考试模式** — 倒计时限时考试，时间到自动交卷，独立考试记录
- 🤖 **智能生成** — 60+ 句法院实务语句随机组合，支持 20000 字长材料
- 📅 **打卡日历** — 月视图打卡，连续天数追踪
- 🏅 **成就勋章** — 初试锋芒 / 快如闪电 / 持之以恒 等 5 种勋章
- 🎯 **每日目标** — 自由设定字数目标，进度条实时反馈
- 🐾 **电子宠物** — 根据练习状态变换表情和鼓励语
- 🔐 **登录认证** — Token 鉴权，sessionStorage 持久化

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动服务
npm start
```

浏览器打开 `http://localhost:3000`

**默认账号**：`ly` / `123123`

## 📁 项目结构

```
liyan-typing-studio/
├── server.js              # Express 服务端
├── package.json
├── public/
│   └── index.html         # SPA 前端（登录 / 首页 / 材料 / 练习）
├── data/                  # JSON 持久化存储
├── SKILL.md               # Claude Code 技能文档
└── README.md
```

## 🛠 技术栈

| 层 | 技术 |
|----|------|
| 后端 | Node.js + Express 4.x |
| 前端 | Vanilla JS ES6+, Tailwind CSS (CDN) |
| 语音 | Web Speech API (SpeechSynthesis) |
| 存储 | JSON 文件 |
| 认证 | Token (crypto.randomBytes) |

## 🎨 设计风格

薰衣草淡紫 (Lavender) 极简风格，营造沉静专注的练习氛围。

## 📝 License

MIT
