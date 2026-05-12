# 温暖学习风 UI 全面翻新 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将「溧妍的打字练习室」前端从薰衣草淡紫风格全面翻新为温暖学习风，重构 CSS 变量系统和组件样式

**Architecture:** 单文件 SPA（`public/index.html`），通过替换 `<style>` 块中的 CSS 变量、增强全局样式、将内联 style 抽离为 CSS class 来完成。不修改 JS 业务逻辑，只动 HTML 样式和 class。

**Tech Stack:** Vanilla JS, Tailwind CSS CDN, CSS Custom Properties

---

### Task 1: CSS 变量系统 & 全局样式替换

**Files:**
- Modify: `public/index.html:8-283`（`<style>` 块全部替换）

- [ ] **Step 1: 替换 CSS 变量和全局样式**

将 `<style>` 标签内容（第 8-283 行）整体替换为以下新样式：

```css
:root {
  --bg-page: #fef7f2;
  --bg-card: #ffffff;
  --accent: #f9726e;
  --accent-dark: #e8635f;
  --amber: #f59e0b;
  --soft-bg: #fef0ee;
  --soft-bg2: #fff8f5;
  --text: #3d2d2a;
  --text-secondary: #8b7d79;
  --border: #e8ddd8;
  --gradient-cta: linear-gradient(135deg, #f9726e, #fb923c);
  --gradient-amber: linear-gradient(135deg, #fef3c7, #fde68a);
  --gradient-pink: linear-gradient(135deg, #f9a8d4, #f472b6);
  --gradient-gold: linear-gradient(135deg, #fbbf24, #f59e0b);
  --success: #22c55e;
  --error: #ef4444;
  --shadow-sm: 0 1px 2px rgba(61,45,42,0.06), 0 2px 8px rgba(61,45,42,0.04);
  --shadow-md: 0 2px 8px rgba(61,45,42,0.08), 0 8px 24px rgba(61,45,42,0.06);
  --shadow-lg: 0 4px 16px rgba(61,45,42,0.10), 0 16px 40px rgba(61,45,42,0.08);
  --radius-sm: 8px;
  --radius: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;
}
* { box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Microsoft YaHei", "PingFang SC", sans-serif;
  background: var(--bg-page);
  color: var(--text);
  min-height: 100vh;
  margin: 0;
}
.card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.3s;
}
.card:hover { box-shadow: var(--shadow-md); }
.btn-primary {
  background: var(--gradient-cta);
  color: #fff; border: none; padding: 10px 24px; border-radius: var(--radius);
  cursor: pointer; font-size: 15px; font-weight: 600; transition: all 0.2s;
  display: inline-flex; align-items: center; gap: 6px;
  box-shadow: 0 2px 8px rgba(249,114,110,0.25);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(249,114,110,0.35); }
.btn-primary:active { transform: translateY(0); }
.btn-secondary {
  background: var(--soft-bg); color: var(--accent);
  border: none; padding: 8px 18px; border-radius: var(--radius-sm);
  cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s;
}
.btn-secondary:hover { background: #fde4e0; transform: translateY(-1px); }
.btn-secondary:active { transform: translateY(0); }
.btn-ghost {
  background: transparent; color: var(--text-secondary);
  border: 1.5px solid var(--border); padding: 8px 18px; border-radius: var(--radius-sm);
  cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s;
}
.btn-ghost:hover { border-color: var(--accent); color: var(--accent); background: var(--soft-bg); }
.btn-ghost-danger { color: var(--error); border-color: #fecaca; }
.btn-ghost-danger:hover { background: #fef2f2; border-color: var(--error); }
.btn-cta {
  background: var(--gradient-cta);
  color: #fff; border: none; padding: 16px 40px; border-radius: var(--radius-lg);
  cursor: pointer; font-size: 20px; font-weight: 700; transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(249,114,110,0.35); width: 100%;
}
.btn-cta:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(249,114,110,0.45); }
.btn-cta:active { transform: translateY(0); }
.btn-icon {
  background: transparent; border: 2px solid var(--border); color: var(--accent);
  width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 18px;
  display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s;
}
.btn-icon:hover { background: var(--soft-bg); border-color: var(--accent); transform: scale(1.05); }
.btn-icon-sm {
  width: 30px; height: 30px; font-size: 13px; border-width: 1.5px;
}
input[type="range"] {
  -webkit-appearance: none; appearance: none; width: 100%; height: 6px;
  background: linear-gradient(to right, var(--accent), var(--accent)) no-repeat;
  background-size: var(--range-fill, 50%) 100%;
  background-color: #e8ddd8; border-radius: 3px; outline: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--accent); cursor: pointer;
  box-shadow: 0 2px 6px rgba(249,114,110,0.3); transition: transform 0.15s;
}
input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.15); }
input[type="range"]::-moz-range-thumb {
  width: 22px; height: 22px; border-radius: 50%; border: none;
  background: var(--accent); cursor: pointer;
}
.input-field {
  width: 100%; padding: 12px 16px; border: 2px solid var(--border);
  border-radius: var(--radius); font-size: 15px; outline: none; box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s; background: #fff;
}
.input-field:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(249,114,110,0.10);
}
.input-sm {
  padding: 8px 12px; border: 1.5px solid var(--border); border-radius: var(--radius-sm);
  font-size: 13px; outline: none; background: #fff; transition: border-color 0.3s;
}
.input-sm:focus { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(249,114,110,0.08); }
#typingInput {
  font-size: 18px; line-height: 2; letter-spacing: 0.05em;
  border: 2px solid var(--border); border-radius: var(--radius);
  padding: 20px; width: 100%; min-height: 220px; resize: vertical;
  outline: none; transition: border-color 0.3s; font-family: inherit; background: #fffefd;
}
#typingInput:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(249,114,110,0.10);
}
#referenceDisplay {
  font-size: 18px; line-height: 2; letter-spacing: 0.05em;
  padding: 20px; border-radius: var(--radius); background: #fffefd;
  border: 1px solid var(--border); min-height: 60px; word-break: break-all;
}
.char-correct { color: #9ca3af; }
.char-error { color: var(--error); text-decoration: underline; text-underline-offset: 4px; }
.char-pending { color: #cbb9b5; }
.char-cursor { border-left: 2px solid var(--accent); animation: blink 1s step-end infinite; }
@keyframes blink { 50% { border-color: transparent; } }
.stat-value { font-size: 28px; font-weight: 700; color: var(--text); }
.stat-label { font-size: 12px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.08em; }
.progress-bar {
  height: 12px; border-radius: 6px; background: var(--soft-bg); overflow: hidden;
}
.progress-fill {
  height: 100%; border-radius: 6px;
  background: linear-gradient(90deg, var(--accent), #fb923c);
  transition: width 0.5s ease;
}
.modal-overlay {
  position: fixed; inset: 0; background: rgba(61,45,42,0.40);
  display: flex; align-items: center; justify-content: center; z-index: 100;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.modal {
  background: #fff; border-radius: var(--radius-xl); padding: 32px; max-width: 480px; width: 90%;
  box-shadow: var(--shadow-lg); animation: slideUp 0.3s ease;
}
@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.achievement-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600;
  background: var(--gradient-amber); color: #92400e;
}
.achievement-badge.locked {
  background: #f0edeb; color: #b8aaa4; filter: grayscale(0.5);
}
.streak-badge {
  display: inline-flex; align-items: center; gap: 4px;
  background: var(--gradient-amber); color: #92400e;
  padding: 6px 14px; border-radius: var(--radius-full); font-weight: 700; font-size: 14px;
}
.toast {
  position: fixed; top: 24px; right: 24px; z-index: 200;
  background: #fff; border-radius: var(--radius); padding: 16px 24px;
  box-shadow: var(--shadow-lg);
  display: flex; align-items: center; gap: 12px;
  animation: slideIn 0.3s ease; font-weight: 600;
}
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.08); }
  70% { transform: scale(0.95); }
  100% { transform: scale(1); opacity: 1; }
}
.bounce-in { animation: bounceIn 0.5s ease; }

/* Calendar */
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; }
.calendar-day {
  aspect-ratio: 1; border-radius: var(--radius); display: flex; flex-direction: column;
  align-items: center; justify-content: center; font-size: 14px; font-weight: 500;
  cursor: default; position: relative; transition: all 0.2s;
}
.calendar-day.practiced {
  background: #fef0ee; color: var(--accent); font-weight: 700;
}
.calendar-day.practiced::after {
  content: ''; position: absolute; bottom: 4px; width: 6px; height: 6px;
  border-radius: 50%; background: var(--accent);
}
.calendar-day.today {
  background: var(--accent); color: #fff; font-weight: 700;
  box-shadow: 0 2px 8px rgba(249,114,110,0.4);
}
.calendar-day.today::after { background: #fff; }
.calendar-day.other-month { color: #d5ceca; }
.calendar-header { color: var(--text-secondary); font-size: 12px; font-weight: 600; padding: 8px 0; }

/* Nav */
.nav-link {
  padding: 8px 20px; border-radius: var(--radius-full); font-weight: 600; font-size: 14px;
  cursor: pointer; transition: all 0.2s; color: var(--text-secondary);
  border: 2px solid transparent; background: transparent;
}
.nav-link:hover { background: var(--soft-bg); color: var(--accent); }
.nav-link.active { background: var(--accent); color: #fff; border-color: var(--accent); }
.nav-link.cta-link { background: var(--gradient-amber); color: #92400e; border-color: transparent; }
.nav-link.cta-link:hover { background: linear-gradient(135deg, #fde68a, #fcd34d); transform: translateY(-1px); }

/* View transitions */
.view { display: none; }
.view.active { display: block; animation: fadeIn 0.25s ease; }

/* Pet */
.pet-container {
  position: relative; display: flex; flex-direction: column; align-items: center;
  user-select: none; cursor: pointer;
}
.pet-body {
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--gradient-cta);
  box-shadow: 0 4px 16px rgba(249,114,110,0.25), inset 0 -4px 12px rgba(0,0,0,0.08), inset 0 4px 8px rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 36px; transition: transform 0.3s;
  animation: petFloat 3s ease-in-out infinite;
  position: relative;
}
.pet-body::before { content:''; position:absolute; top:12px; left:16px; width:14px; height:10px;
  background:rgba(255,255,255,0.3); border-radius:50%; }
.pet-body:hover { transform: scale(1.1); }
.pet-body:active { transform: scale(0.95); }
.pet-body.happy { background: linear-gradient(135deg, #fde68a, #fbbf24); animation: petBounce 0.6s ease-in-out infinite; }
.pet-body.sad { background: linear-gradient(135deg, #d1d5db, #9ca3af); animation: petFloat 4s ease-in-out infinite; }
.pet-body.motivated { background: var(--gradient-pink); animation: petBounce 0.8s ease-in-out infinite; }
.pet-body.sleepy { background: linear-gradient(135deg, #e8ddd8, #d5ceca); animation: petFloat 5s ease-in-out infinite; }
.pet-body.excited { background: var(--gradient-gold); animation: petBounce 0.4s ease-in-out infinite; }
.pet-speech {
  background: #fff; border-radius: 14px; padding: 8px 14px; font-size: 12px;
  box-shadow: 0 2px 8px rgba(61,45,42,0.08); max-width: 200px; text-align: center;
  margin-bottom: 6px; position: relative; color: var(--text);
  animation: speechPop 0.3s ease; display: none;
}
.pet-speech::after {
  content:''; position:absolute; bottom:-6px; left:50%; transform:translateX(-50%);
  width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent;
  border-top:6px solid #fff;
}
.pet-speech.show { display: block; }
@keyframes petFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes petBounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-12px) scale(1.05); }
}
@keyframes speechPop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.pet-sparkle {
  position: absolute; font-size: 14px; pointer-events: none;
  animation: sparkleUp 0.8s ease-out forwards;
}
@keyframes sparkleUp {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-40px) scale(0); opacity: 0; }
}

/* Material list */
.mat-list-item {
  padding: 12px 16px; border-radius: var(--radius); cursor: pointer; transition: all 0.2s;
  border: 2px solid transparent; display: flex; justify-content: space-between; align-items: center;
  gap: 8px;
}
.mat-list-item:hover { background: var(--soft-bg2); }
.mat-list-item.selected { background: var(--soft-bg); border-color: var(--accent); }
.mat-list-item .mat-title { font-weight: 600; font-size: 14px; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mat-list-item .mat-count { font-size: 12px; color: var(--text-secondary); white-space: nowrap; }

/* Recent records */
.record-row {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  padding: 10px 14px; border-radius: var(--radius); transition: background 0.2s;
}
.record-row:hover { background: var(--soft-bg2); }

/* Stats grid cell */
.stat-cell {
  text-align: center; padding: 12px 8px; border-radius: var(--radius);
  background: var(--soft-bg2); transition: transform 0.2s;
}
.stat-cell:hover { transform: translateY(-2px); }
.stat-cell .stat-num { font-size: 24px; font-weight: 700; color: var(--text); }
.stat-cell .stat-lbl { font-size: 12px; color: var(--text-secondary); margin-top: 2px; }

/* Exam timer */
.timer-warning { color: var(--amber) !important; animation: pulse 1s ease-in-out infinite; }
.timer-danger { color: var(--error) !important; animation: pulse 0.5s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
.timer-card-warn { background: #fffbf0 !important; }
.timer-card-danger { background: #fef2f2 !important; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #d5ceca; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #b8aaa4; }

/* Section title */
.section-title { font-size: 16px; font-weight: 700; color: var(--text); }
.section-title-sm { font-size: 14px; font-weight: 600; color: var(--text); }

.sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0; }

@media (max-width: 768px) {
  .calendar-day { font-size: 12px; }
  .btn-cta { padding: 14px 28px; font-size: 17px; }
  .pet-body { width: 64px; height: 64px; font-size: 28px; }
  .nav-link { padding: 6px 12px; font-size: 12px; }
  header.card { padding: 10px 12px; }
  header.card .text-xl { font-size: 16px; }
}
```

- [ ] **Step 2: 验证样式生效**

启动服务器并检查浏览器控制台是否有 CSS 报错：

```bash
cd /c/Users/HUAWEI/liyan-typing-studio && node server.js &
```

打开 `http://localhost:3000`，确认页面背景已变为 `#fef7f2` 暖奶油色，按钮变为珊瑚渐变。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "style: replace CSS variables and global styles with warm learning theme"
```

---

### Task 2: 登录页重设计

**Files:**
- Modify: `public/index.html:288-308`（登录页 HTML）

- [ ] **Step 1: 替换登录页 HTML 结构**

将第 288-308 行登录页替换为：

```html
<div id="loginOverlay" style="display:flex; position:fixed; inset:0; z-index:500;
  background: linear-gradient(160deg, #fef7f2 0%, #fef0ee 40%, #fff8f5 100%);
  align-items:center; justify-content:center;">
  <div style="background:var(--bg-card); border-radius:var(--radius-xl); padding:48px 40px; width:400px; max-width:90%;
    box-shadow:var(--shadow-lg); text-align:center; position:relative;">
    <div style="font-size:56px; margin-bottom:8px;">🏠</div>
    <h1 style="font-size:24px; font-weight:700; color:var(--text); margin-bottom:2px;">溧妍的打字练习室</h1>
    <p style="color:var(--text-secondary); font-size:14px; margin-bottom:28px;">法院书记员听写模拟训练平台</p>
    <div id="loginError" style="display:none; background:#fef2f2; color:var(--error); padding:10px 14px;
      border-radius:var(--radius-sm); margin-bottom:16px; font-size:13px;"></div>
    <label class="sr-only" for="loginUsername">账号</label>
    <input id="loginUsername" type="text" placeholder="请输入账号" autocomplete="username"
      class="input-field" style="margin-bottom:12px"
      onkeydown="if(event.key==='Enter')document.getElementById('loginPassword').focus()">
    <label class="sr-only" for="loginPassword">密码</label>
    <input id="loginPassword" type="password" placeholder="请输入密码" autocomplete="current-password"
      class="input-field" style="margin-bottom:20px"
      onkeydown="if(event.key==='Enter')app.login()">
    <button onclick="app.login()" class="btn-primary" style="width:100%; justify-content:center; padding:14px; font-size:16px;">登 录</button>
    <p style="margin:16px 0 0; font-size:12px; color:#b8aaa4;">知不足而奋进，望远山而前行</p>
  </div>
</div>
```

- [ ] **Step 2: 验证登录页**

刷新浏览器 `http://localhost:3000`，确认登录页背景渐变、卡片阴影、输入框样式、按钮渐变效果正常。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "style: redesign login page with warm gradient background"
```

---

### Task 3: 导航栏 & 全局布局重设计

**Files:**
- Modify: `public/index.html:311-324`（导航栏 header）

- [ ] **Step 1: 替换导航栏**

将第 311-324 行导航栏 HTML 替换为：

```html
<header class="card mx-4 mt-4 px-5 py-3 flex items-center justify-between flex-wrap gap-3">
  <div class="flex items-center gap-2">
    <span class="text-xl font-bold" style="color:var(--text); white-space:nowrap">🏠 溧妍打字练习</span>
  </div>
  <div class="flex items-center gap-1 flex-wrap">
    <button class="nav-link active" data-view="welcome" onclick="app.navTo('welcome')">首页</button>
    <button class="nav-link" data-view="materials" onclick="app.navTo('materials')">材料</button>
    <button class="nav-link cta-link" data-view="practice" onclick="app.navTo('practice')">开始练习</button>
    <button class="nav-link" data-view="users" id="adminNavLink" style="display:none" onclick="app.navTo('users')">用户管理</button>
    <button class="btn-ghost text-sm" onclick="app.logout()" style="margin-left:8px">退出</button>
  </div>
</header>
```

- [ ] **Step 2: 验证导航栏**

登录后检查各标签切换正常，当前页 pill 高亮，CTA 琥珀色醒目。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "style: redesign navigation bar with warm pill style"
```

---

### Task 4: 首页 — 问候卡片 & 日历 & 今日任务

**Files:**
- Modify: `public/index.html:327-372`（问候卡片 + 日历 + 今日任务）

- [ ] **Step 1: 替换问候卡片**

将第 329-332 行替换为：

```html
<div class="card px-6 py-5 mb-4 text-center">
  <h1 class="text-xl font-bold" style="color:var(--text)" id="welcomeName">欢迎回来 👋</h1>
  <p class="text-sm mt-1" style="color:var(--text-secondary)">每一次练习，都是向优秀书记员迈进的一步</p>
</div>
```

- [ ] **Step 2: 替换日历 + 今日任务区**

将第 336-372 行（日历 + 右侧面板中的今日任务部分）替换为：

```html
<div style="display:flex; gap:16px; flex-wrap:wrap">
  <!-- Calendar -->
  <div style="flex:1 1 420px; min-width:340px">
    <div class="card p-5">
      <div class="flex items-center justify-between mb-3">
        <h2 class="section-title">📅 打卡日历</h2>
        <div class="streak-badge">🔥 连续 <span id="wStreak">0</span> 天</div>
      </div>
      <div class="flex items-center justify-between mb-3">
        <button class="btn-icon btn-icon-sm" onclick="app.calendarShift(-1)">◀</button>
        <span id="calTitle" class="font-bold text-sm" style="color:var(--text)"></span>
        <button class="btn-icon btn-icon-sm" onclick="app.calendarShift(1)">▶</button>
      </div>
      <div class="calendar-grid mb-1" id="calHeader"></div>
      <div class="calendar-grid" id="calBody"></div>
    </div>
  </div>

  <!-- Right panel -->
  <div style="flex:0 0 300px; display:flex; flex-direction:column; gap:14px">
    <!-- Today's Goal -->
    <div class="card p-4">
      <h2 class="section-title-sm mb-3">🎯 今日任务</h2>
      <div class="flex justify-between text-sm mb-1">
        <span style="color:var(--text-secondary)">已输入 <b id="wTodayChars" style="color:var(--accent)">0</b> 字</span>
        <span style="color:var(--text-secondary)">目标 <b id="wGoal" style="color:var(--text)">1000</b> 字</span>
      </div>
      <div class="progress-bar mb-3"><div class="progress-fill" id="wProgressBar" style="width:0%"></div></div>
      <div class="flex justify-between items-center">
        <span id="wPercent" class="text-lg font-bold" style="color:var(--accent)">0%</span>
        <div class="flex gap-1">
          <input id="goalInput" type="number" min="100" max="50000" step="100"
            class="input-sm" style="width:80px"
            placeholder="目标字数">
          <button class="btn-secondary text-xs" onclick="app.saveGoal()">设置</button>
        </div>
      </div>
    </div>
```

注意：此时不关闭右侧面板的 `</div>`，后续任务继续替换。

- [ ] **Step 3: 验证日历和任务区**

刷新首页，确认日历格子样式、打卡点、今天高亮，进度条渐变效果正常。

- [ ] **Step 4: Commit**

```bash
git add public/index.html
git commit -m "style: redesign welcome greeting, calendar, and daily goal section"
```

---

### Task 5: 首页 — 快速统计 & CTA 按钮

**Files:**
- Modify: `public/index.html:375-397`（快速统计 + CTA）

- [ ] **Step 1: 替换统计面板和 CTA**

将第 375-397 行替换为：

```html
        <!-- Quick Stats -->
        <div class="card p-4">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px">
            <div class="stat-cell">
              <div class="stat-num" id="wTotalPractices">0</div>
              <div class="stat-lbl">练习次数</div>
            </div>
            <div class="stat-cell">
              <div class="stat-num" id="wBestWPM">0</div>
              <div class="stat-lbl">最佳 WPM</div>
            </div>
            <div class="stat-cell">
              <div class="stat-num" id="wTotalChars">0</div>
              <div class="stat-lbl">累计字数</div>
            </div>
            <div class="stat-cell">
              <div class="stat-num" id="wAvgAccuracy">--</div>
              <div class="stat-lbl">平均正确率</div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <button class="btn-cta" onclick="app.navTo('practice')">⚡ 开始练习</button>
      </div>
    </div>
```

注意：这关闭了上一任务中右侧面板的 `</div>` 和 flex 容器的 `</div>`。

- [ ] **Step 2: 验证快速统计**

确认四个 stat 格子 hover 上移效果，数字字体醒目。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "style: redesign quick stats panel with warm background cells"
```

---

### Task 6: 首页 — 勋章 & 宠物 & 最近练习

**Files:**
- Modify: `public/index.html:401-424`（勋章 + 宠物 + 记录）

- [ ] **Step 1: 替换勋章/宠物/记录区**

将第 401-424 行替换为：

```html
    <!-- Row 2: Achievements | Pet | Recent Records -->
    <div style="display:flex; gap:16px; flex-wrap:wrap; margin-top:16px">
      <!-- Achievements -->
      <div class="card p-4" style="flex:1 1 200px; min-width:180px">
        <h2 class="section-title-sm mb-3">🏅 成就勋章</h2>
        <div id="wAchievements" class="flex flex-wrap gap-1"></div>
      </div>
      <!-- Pet -->
      <div class="card p-4 text-center" style="flex:0 0 180px">
        <h2 class="section-title-sm mb-2">🐾 小妍陪你练</h2>
        <div class="pet-container" onclick="app.petClick()">
          <div class="pet-speech" id="petSpeech"></div>
          <div class="pet-body" id="petBody">🐱</div>
        </div>
        <p class="text-xs mt-2" style="color:var(--text-secondary)">点击互动 💕</p>
      </div>
      <!-- Recent Records -->
      <div class="card p-4" style="flex:2 1 300px; min-width:280px">
        <h2 class="section-title-sm mb-3">📊 最近练习</h2>
        <div id="recentRecords">
          <div style="color:var(--text-secondary);font-size:12px;text-align:center;padding:20px">还没有练习记录<br>快去练习吧！</div>
        </div>
      </div>
    </div>
  </div>
```

注意：最后的 `</div>` 关闭了 `view-welcome` 容器。

- [ ] **Step 2: 验证首页完整布局**

刷新首页，确认三个区排列正常，宠物球光泽效果可见，勋章 badge 样式正确。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "style: redesign achievements, pet, and recent records sections"
```

---

### Task 7: 材料页重设计

**Files:**
- Modify: `public/index.html:428-487`（材料页完整 HTML）

- [ ] **Step 1: 替换材料页**

将第 428-487 行替换为：

```html
  <!-- Materials View -->
  <div id="view-materials" class="view p-4 max-w-5xl mx-auto">
    <div class="flex gap-5 flex-wrap md:flex-nowrap">
      <!-- Material List -->
      <div class="card p-4 w-full md:w-[280px] flex-shrink-0">
        <div class="flex items-center justify-between mb-3">
          <h2 class="section-title-sm">📋 材料列表</h2>
          <button class="btn-ghost text-xs" onclick="app.matClear()">+ 新建</button>
        </div>
        <div id="matList" class="flex flex-col gap-1" style="max-height:500px; overflow-y:auto">
          <div style="color:var(--text-secondary);font-size:13px;padding:20px;text-align:center">暂无材料，点击"新建"创建</div>
        </div>
      </div>
      <!-- Editor -->
      <div class="card p-5 flex-1">
        <h2 class="section-title-sm mb-3" id="matEditorTitle">📝 编辑材料</h2>
        <input id="matTitle" class="input-sm w-full mb-3" placeholder="材料标题">
        <!-- File Upload -->
        <div class="p-4 rounded-lg mb-3" style="background:var(--soft-bg2);border:1px solid var(--border)">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold" style="color:var(--text);white-space:nowrap">📎 上传文件</span>
            <input type="file" id="fileInput" accept=".mp3,.wav,.ogg,.m4a,.aac,.docx,.txt" onchange="app.uploadFile()"
              class="text-xs" style="max-width:220px">
            <span id="uploadStatus" class="text-xs" style="color:var(--text-secondary)"></span>
          </div>
          <p class="text-xs mt-2" style="color:var(--text-secondary)">支持音频(mp3/wav)、Word(.docx)、文本(.txt) 文件</p>
          <!-- Remote Audio URL -->
          <div class="flex items-center gap-2 flex-wrap mt-3 pt-3" style="border-top:1px dashed var(--border)">
            <span class="text-xs font-bold" style="color:var(--text);white-space:nowrap">🔗 远程链接</span>
            <input id="audioUrlInput" class="input-sm flex-1" style="min-width:200px" placeholder="粘贴音频直链 URL (mp3/wav等)">
            <button class="btn-secondary text-xs" onclick="app.saveAudioLink()">保存链接</button>
          </div>
          <p class="text-xs mt-1" style="color:var(--text-secondary)">远程链接直接引用，无需上传文件</p>
          <div id="audioPreview" style="display:none;margin-top:8px">
            <audio id="matAudioPlayer" controls style="width:100%;max-width:400px"></audio>
          </div>
        </div>

        <!-- Auto-generate -->
        <div class="p-4 rounded-lg mb-3" style="background:var(--soft-bg2);border:1px solid var(--border)">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold" style="color:var(--text);white-space:nowrap">🤖 自动生成</span>
            <input id="genWordCount" type="number" min="50" max="20000" step="50" value="300"
              class="input-sm" style="width:80px;text-align:center">
            <span class="text-xs" style="color:var(--text-secondary)">字</span>
            <button class="btn-secondary text-xs" onclick="app.generateMaterial()">✨ 生成</button>
            <button class="btn-primary text-xs" id="saveGenBtn" onclick="app.saveGenerated()" style="display:none">💾 保存生成材料</button>
          </div>
          <p class="text-xs mt-2" style="color:var(--text-secondary)">随机生成法院相关练习材料，可设字数</p>
        </div>
        <textarea id="matContent" class="w-full p-3 rounded-lg border mb-3 text-sm" style="border-color:var(--border); min-height:250px; resize:vertical; outline:none; border-radius:var(--radius); transition:border-color 0.3s" placeholder="在此粘贴考试材料内容..."></textarea>
        <div class="flex items-center justify-between">
          <span id="matInfo" class="text-xs" style="color:var(--text-secondary)"></span>
          <div class="flex gap-2">
            <button class="btn-ghost btn-ghost-danger text-sm" id="matDeleteBtn" style="display:none" onclick="app.deleteMaterial()">🗑️ 删除</button>
            <button class="btn-primary text-sm" onclick="app.saveMaterial()">💾 保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
```

- [ ] **Step 2: 验证材料页**

切换到材料页，确认列表选中态、编辑器输入框样式、按钮层级正确。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "style: redesign materials page with warm card sections"
```

---

### Task 8: 用户管理页重设计

**Files:**
- Modify: `public/index.html:490-509`（用户管理页）

- [ ] **Step 1: 替换用户管理页**

将第 490-509 行替换为：

```html
  <!-- Users View (Admin) -->
  <div id="view-users" class="view p-4" style="max-width:1100px; margin:0 auto">
    <!-- Section 1: Progress Monitoring -->
    <div class="card p-6 mb-4">
      <h2 class="section-title mb-4">📊 学员进度监控</h2>
      <div id="adminStatsTable" style="overflow-x:auto">
        <div style="color:var(--text-secondary);font-size:13px;text-align:center;padding:20px">加载中...</div>
      </div>
    </div>

    <!-- Section 2: User Account Management -->
    <div class="card p-6">
      <h2 class="section-title mb-4">👥 账号管理</h2>
      <div class="flex gap-2 mb-4 flex-wrap">
        <input id="newUsername" class="input-sm" style="width:160px" placeholder="账号 (字母/数字)">
        <input id="newPassword" type="text" class="input-sm" style="width:140px" placeholder="密码 (4位以上)">
        <button class="btn-primary text-sm" onclick="app.addUser()">+ 添加用户</button>
      </div>
      <div id="userAddError" style="display:none;color:var(--error);font-size:12px;margin-bottom:8px"></div>
      <div id="userList" class="flex flex-col gap-1"></div>
    </div>
  </div>
```

- [ ] **Step 2: 验证用户管理页**

用 admin 账号登录，检查进度监控表格和用户列表样式。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "style: redesign users admin page"
```

---

### Task 9: 练习页 — 控制栏 & 参考文本 & 音频

**Files:**
- Modify: `public/index.html:513-569`（练习页上半部）

- [ ] **Step 1: 替换控制栏和参考文本区**

将第 513-569 行替换为：

```html
  <!-- Practice View -->
  <div id="view-practice" class="view p-4 max-w-5xl mx-auto">
    <!-- Mode Toggle + Control Bar -->
    <div class="card px-5 py-3 mb-4">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-3 flex-wrap">
          <select id="pracMaterialSelect" class="input-sm" style="min-width:180px" onchange="app.selectPracticeMaterial(this.value)">
            <option value="">-- 选择练习材料 --</option>
          </select>
          <div class="flex items-center gap-2">
            <span class="text-xs" style="color:var(--text-secondary)">语速</span>
            <input type="range" id="speedSlider" min="50" max="400" step="10" value="140"
              oninput="app.updateSpeed(this.value)" style="width:100px; --range-fill:33%">
            <span id="speedLabel" class="text-xs font-bold" style="color:var(--accent)">140字/分</span>
          </div>
          <!-- Mode Toggle -->
          <div class="flex rounded-full overflow-hidden" style="border:2px solid var(--border)">
            <button id="modePracticeBtn" class="text-xs font-bold px-4 py-1.5" style="background:var(--accent);color:#fff;border:none;cursor:pointer;transition:all 0.2s;border-radius:9999px 0 0 9999px" onclick="app.setMode('practice')">📝 练习</button>
            <button id="modeExamBtn" class="text-xs font-bold px-4 py-1.5" style="background:transparent;color:var(--text-secondary);border:none;cursor:pointer;transition:all 0.2s;border-radius:0 9999px 9999px 0" onclick="app.setMode('exam')">⏱️ 考试</button>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-1 text-xs cursor-pointer" style="color:var(--text-secondary)">
            <input type="checkbox" id="hideRefCheck" onchange="app.toggleHideRef()">隐藏原文
          </label>
          <button class="btn-secondary text-sm" onclick="app.resetPractice()">🔄 重置</button>
          <button class="btn-icon" id="playBtn" onclick="app.togglePlay()" title="空格键">▶️</button>
        </div>
      </div>
      <!-- Exam Config Row -->
      <div id="examConfig" style="display:none; margin-top:10px; padding-top:10px; border-top:1px solid var(--border); align-items:center; gap:10px; flex-wrap:wrap">
        <span class="text-xs font-bold" style="color:var(--amber)">⏱️ 考试设置</span>
        <span class="text-xs" style="color:var(--text-secondary)">时间</span>
        <input id="examTimeInput" type="number" min="1" max="180" value="20"
          class="input-sm text-center" style="width:56px">
        <span class="text-xs" style="color:var(--text-secondary)">分钟</span>
        <span class="text-xs" style="color:var(--text-secondary);margin-left:4px">目标</span>
        <input id="examTargetInput" type="number" min="50" max="20000" step="50" value="2000"
          class="input-sm text-center" style="width:72px">
        <span class="text-xs" style="color:var(--text-secondary)">字</span>
        <span class="text-xs" style="color:var(--text-secondary);margin-left:8px" id="examStatus"></span>
      </div>
    </div>

    <!-- Reference Text -->
    <div class="card p-4 mb-4" id="referenceCard">
      <div class="flex items-center justify-between mb-2">
        <h2 class="section-title-sm">📖 参考文本</h2>
        <span class="text-xs" style="color:var(--text-secondary)">已读: <span id="readCount">0</span> 字</span>
      </div>
      <div id="referenceDisplay" style="font-size:16px">👆 请先在上方选择练习材料，然后点击 ▶️ 开始</div>
    </div>

    <!-- Audio Player -->
    <audio id="audioPlayer" style="display:none" onended="app.onAudioEnded()" onpause="app.onAudioPause()"></audio>
    <div class="card px-4 py-2 mb-3" id="audioInfo" style="display:none; background:#fffbf0">
      <span class="text-xs" style="color:#92400e">🎵 当前播放音频文件：<b id="audioFileName"></b></span>
    </div>
```

- [ ] **Step 2: 验证练习页上半部**

切换到练习页，确认控制栏布局、模式切换 pill、考试设置行样式。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "style: redesign practice page control bar and reference area"
```

---

### Task 10: 练习页 — 统计条 & 打字区

**Files:**
- Modify: `public/index.html:572-601`（统计条 + 打字区）

- [ ] **Step 1: 替换统计条和打字区**

将第 572-601 行替换为：

```html
    <!-- Stats Bar -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:12px;margin-bottom:16px">
      <div class="card px-4 py-3 text-center">
        <div class="stat-value" id="wpmDisplay">0</div>
        <div class="stat-label">WPM</div>
      </div>
      <div class="card px-4 py-3 text-center">
        <div class="stat-value" id="accuracyDisplay">--</div>
        <div class="stat-label">正确率</div>
      </div>
      <div class="card px-4 py-3 text-center" id="timerCard">
        <div class="stat-value" style="transition:color 0.5s" id="elapsedDisplay">00:00</div>
        <div class="stat-label" id="timerLabel">用时</div>
      </div>
      <div class="card px-4 py-3 text-center">
        <div class="stat-value" id="charCountDisplay">0</div>
        <div class="stat-label">已输入</div>
      </div>
    </div>

    <!-- Typing Area -->
    <div class="card p-5">
      <textarea id="typingInput" aria-label="听打输入区" placeholder="选择材料后，点击 ▶️ 或按空格键开始听打练习..." oninput="app.onTyping()" onpaste="app.onTyping()"></textarea>
      <div class="flex justify-between items-center mt-2">
        <span class="text-xs" style="color:var(--text-secondary)">
          按 <kbd style="background:var(--soft-bg);color:var(--accent);padding:1px 6px;border-radius:4px;font-weight:700;border:1px solid var(--border)">空格</kbd> 暂停 | <kbd style="background:var(--soft-bg);color:var(--accent);padding:1px 6px;border-radius:4px;font-weight:700;border:1px solid var(--border)">Ctrl+空格</kbd> 输入时暂停
        </span>
        <button class="btn-primary text-sm" onclick="app.finishPractice()">🏁 结束练习</button>
      </div>
    </div>
  </div>
```

- [ ] **Step 2: 验证练习页完整流程**

在练习页完成一次完整练习：选材料 → 播放 → 打字 → 结束，确认统计条实时更新、打字区样式正确。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "style: redesign practice stats bar and typing area"
```

---

### Task 11: Footer & 模态弹窗重设计

**Files:**
- Modify: `public/index.html:603-661`（Footer + 两个模态弹窗）

- [ ] **Step 1: 替换 Footer 和模态弹窗**

将第 603-661 行替换为：

```html
  <!-- Footer -->
  <footer style="margin-top:32px; padding:20px 24px; text-align:center; border-top:1.5px solid var(--border)">
    <p style="margin:0; font-size:13px; color:var(--text-secondary)">
      © 2026 <b style="color:var(--text)">溧妍的打字练习室</b> · 法院书记员听写模拟训练平台
    </p>
    <p style="margin:6px 0 0; font-size:11px; color:#b8aaa4">
      知不足而奋进，望远山而前行
    </p>
  </footer>
</div>

<!-- Results Modal -->
<div id="resultsModal" class="modal-overlay" style="display:none">
  <div class="modal">
    <div class="text-center mb-4">
      <div id="resultsEmoji" class="text-5xl mb-3"></div>
      <h2 class="text-2xl font-bold" style="color:var(--text)">练习成绩单</h2>
    </div>
    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="text-center p-3 rounded-xl" style="background:var(--soft-bg2)">
        <div class="text-2xl font-bold" style="color:var(--accent)" id="resultWPM">0</div>
        <div class="text-xs" style="color:var(--text-secondary)">WPM</div>
      </div>
      <div class="text-center p-3 rounded-xl" style="background:var(--soft-bg2)">
        <div class="text-2xl font-bold" style="color:var(--accent)" id="resultAccuracy">0%</div>
        <div class="text-xs" style="color:var(--text-secondary)">正确率</div>
      </div>
      <div class="text-center p-3 rounded-xl" style="background:var(--soft-bg2)">
        <div class="text-2xl font-bold" style="color:var(--text)" id="resultChars">0</div>
        <div class="text-xs" style="color:var(--text-secondary)">总字符数</div>
      </div>
      <div class="text-center p-3 rounded-xl" style="background:var(--soft-bg2)">
        <div class="text-2xl font-bold" style="color:var(--text)" id="resultDuration">00:00</div>
        <div class="text-xs" style="color:var(--text-secondary)">用时</div>
      </div>
    </div>
    <div id="resultEncouragement" class="text-center text-lg font-medium mb-4 p-4 rounded-xl" style="background:var(--soft-bg2);color:var(--text)"></div>
    <div class="text-center text-sm mb-4" style="color:var(--text-secondary)">
      <span>正确: <b style="color:var(--success)" id="resultCorrect">0</b></span>
      <span class="mx-2">|</span>
      <span>错误: <b style="color:var(--error)" id="resultIncorrect">0</b></span>
    </div>
    <div class="text-center flex gap-2 justify-center">
      <button class="btn-primary" onclick="app.closeResults()">继续练习 💪</button>
      <button class="btn-secondary" onclick="app.closeResults(); app.navTo('welcome')">返回首页 🏡</button>
    </div>
  </div>
</div>

<!-- Achievement Modal -->
<div id="achievementModal" class="modal-overlay" style="display:none">
  <div class="modal text-center">
    <div class="text-6xl mb-4 bounce-in" id="achIcon"></div>
    <h2 class="text-xl font-bold mb-2" style="color:var(--text)">🏆 成就解锁！</h2>
    <div class="text-2xl font-bold mb-2" style="color:var(--accent)" id="achName"></div>
    <p class="text-sm mb-4" style="color:var(--text-secondary)" id="achDesc"></p>
    <button class="btn-primary" onclick="app.closeAchievement()">太棒了！</button>
  </div>
</div>
```

- [ ] **Step 2: 验证模态弹窗**

完成一次练习触发成绩单弹窗，确认动画、布局、颜色正确。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "style: redesign footer and modal dialogs"
```

---

### Task 12: JS 中动态创建 HTML 的样式更新

**Files:**
- Modify: `public/index.html` JS 部分中动态生成 HTML 的函数

- [ ] **Step 1: 更新 `loadWelcome` 中勋章渲染（约第 772-783 行）**

确认勋章 badge HTML 已使用 `.achievement-badge` class（CSS 已更新），无需额外修改 JS。检查 `app.loadWelcome()` 函数中 `achievement-badge` 引用的样式变量已通过 CSS class 覆盖。

- [ ] **Step 2: 更新 `loadRecentRecords` 函数中的记录行 HTML**

搜索 `loadRecentRecords` 函数（约第 800+ 行），确认渲染的记录行使用 `.record-row` class。如需调整内联颜色，改为使用 CSS class 引用。

- [ ] **Step 3: 更新日历渲染函数**

搜索 `renderCalendar` 函数，确认日历格子使用 `.calendar-day` class。检查 today 判断逻辑是否设置了正确的 class 组合。

- [ ] **Step 4: 更新 Toast 函数**

搜索 toast 相关函数（约第 900+ 行），确认 toast 元素使用 `.toast` class。

- [ ] **Step 5: 更新材料列表渲染**

搜索材料列表渲染（约第 1000+ 行），确认 `.mat-list-item` class 使用正确。

- [ ] **Step 6: 更新管理面板统计表格渲染**

搜索 `loadUsersPage` 和统计表格渲染函数，确认表格样式。

- [ ] **Step 7: 更新模式切换函数**

搜索 `setMode` 函数，确认练习/考试模式切换时按钮样式更新正确（`btn-primary` / `btn-secondary` 对应切换）。

- [ ] **Step 8: 验证所有动态渲染的 HTML**

完整走一遍流程：登录 → 首页 → 材料（新建/编辑/生成） → 练习（练习/考试两种模式）→ 结束看成绩 → 用户管理。确认所有动态生成的内容颜色和样式都符合新设计系统。

- [ ] **Step 9: Commit**

```bash
git add public/index.html
git commit -m "style: update JS-generated HTML elements with new warm theme"
```

---

### Task 13: 最终验收 & 响应式检查

**Files:**
- Modify: `public/index.html`（任何遗漏的修复）

- [ ] **Step 1: 完整功能流程测试**

```bash
cd /c/Users/HUAWEI/liyan-typing-studio && node server.js
```

在浏览器中执行完整流程：
1. 登录 (`ly` / `123123`)
2. 首页查看日历、统计、勋章、宠物互动
3. 材料页新建材料、自动生成、上传文件
4. 练习模式：选材料 → 播放 → 打字 → 结束 → 查看成绩
5. 考试模式：设置时间 → 开始 → 等待倒计时 → 自动交卷
6. 查看成绩弹窗、成就解锁弹窗
7. 退出重新登录

- [ ] **Step 2: 移动端响应式检查**

Chrome DevTools 切换到 375px / 768px 宽度：
- 导航栏标签折叠是否正常
- 首页三栏是否堆叠
- 日历格子是否可读
- 材料页是否单栏
- 练习页统计条是否自适应
- 触摸 typing input 是否正常

- [ ] **Step 3: 修复遗留问题**

搜索文件中残留的旧 CSS 变量引用（`--lavender-bg`、`--lavender-card`、`--lavender-accent` 等），确保无遗漏。

```bash
cd /c/Users/HUAWEI/liyan-typing-studio
grep -n "lavender" public/index.html
```

如果有输出，逐一替换为新的 CSS 变量或 class。

- [ ] **Step 4: 最终 Commit**

```bash
git add public/index.html
git commit -m "style: final polish and responsive verification for warm theme"
```
