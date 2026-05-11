---
name: liyan-typing-studio
description: 溧妍的打字练习室 — 法院书记员听写模拟训练平台。Express + Vanilla JS SPA，集成 Web Speech API TTS、实时打字测评、考试模式、打卡系统、宠物互动。
---

# 溧妍的打字练习室 (LiYan's Typing Studio)

法院书记员听写模拟训练 Web 应用。语音合成朗读法律材料 → 用户实时听打输入 → 逐字比对测评 → 成绩反馈 + 打卡激励。

## 技术栈

| 层 | 技术 |
|----|------|
| 后端 | Node.js + Express 4.x |
| 前端 | Vanilla JS ES6+ (SPA), Tailwind CSS (CDN) |
| 语音 | Web Speech API (SpeechSynthesis) |
| 存储 | JSON 文件 (`data/` 目录) |
| 认证 | Token-based (crypto.randomBytes) |

## 项目结构

```
liyan-typing-studio/
├── server.js              # Express 服务端（API + 静态文件）
├── package.json           # 依赖：express
├── public/
│   └── index.html         # 完整 SPA 前端（登录/首页/材料/练习四视图）
├── data/                  # JSON 持久化存储（自动创建）
│   ├── materials.json     # 练习材料
│   ├── history.json       # 练习记录（含考试模式标记）
│   ├── daily.json         # 每日进度 { "YYYY-MM-DD": chars }
│   ├── streak.json        # 连续打卡 { count, lastDate }
│   ├── achievements.json  # 已解锁成就
│   └── settings.json      # 用户设置（语速、每日目标等）
└── SKILL.md               # 本文件
```

## 启动方式

```bash
npm install
npm start
# → http://localhost:3000
```

默认账号：`ly` / `123123`

## 后端 API

所有 `/api/*` 路由（除 `/api/login`）需要 `Authorization: Bearer <token>` 头。

| 方法 | 路由 | 说明 |
|------|------|------|
| POST | `/api/login` | 登录，返回 token |
| POST | `/api/logout` | 登出，销毁 token |
| GET | `/api/auth/check` | 验证 token 有效 |
| GET/POST | `/api/materials` | 材料列表 / 新建 |
| PUT/DELETE | `/api/materials/:id` | 更新 / 删除材料 |
| GET/POST | `/api/history` | 练习历史（mode: practice|exam） |
| GET | `/api/stats` | 打卡天数、今日进度、成就 |
| GET/PUT | `/api/settings` | 用户设置 |
| GET | `/api/calendar?year=&month=` | 月度打卡日历 |

## 前端架构

单文件 SPA，四视图切换（`navTo(view)`）：

| 视图 | 路由 | 功能 |
|------|------|------|
| `#welcome` | 首页 | 打卡日历、进度条、目标设置、统计、成就、电子宠物、最近练习 |
| `#materials` | 材料 | 材料列表 + 编辑器 + 自动生成法院材料 |
| `#practice` | 练习 | TTS 听打、练习/考试双模式、实时测评 |

### 核心状态

```js
app = {
  // 练习状态
  isPlaying, isPracticing, correctChars, incorrectChars,
  // 考试模式
  practiceMode: 'practice'|'exam',
  examTimeLimit, examTargetChars, examTimeRemaining, examSubmitted,
  // 数据
  materials[], activeMaterial, settings, stats, token,
  // 语音
  speechChunks[], speechChunkIndex,
}
```

### 关键交互

- **练习模式**：正计时，WPM 实时计算，逐字比对（正确灰/错误红）
- **考试模式**：倒计时，时间到自动交卷，剩余≤3分钟闪烁警告
- **电子宠物**：`updatePet(stats)` 根据练习数据变换 5 种状态（兴奋/开心/努力/坚持/失落）
- **自动生成材料**：60+ 句法院实务语句随机组合，支持 50-20000 字，长文本自动插入章节标题

## 代码约定

- **无框架依赖**：前端纯 Vanilla JS，不引入 React/Vue
- **Tailwind CDN**：通过 `<script>` 标签加载，不在本地构建
- **存储模式**：`readJSON(filename)` / `writeJSON(filename, data)` 封装于 server.js
- **认证模式**：Token 存于 `sessionStorage`，401 响应自动弹回登录页
- **HTML 转义**：`esc(s)` 方法使用 DOM 文本节点防 XSS
- **CSS 变量**：薰衣草淡紫主题色定义在 `:root` 中
