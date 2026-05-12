# 指法练习页面 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增"指法练习"页面，包含可视化虚拟键盘 + 基础键位练习 + 段落指法练习

**Architecture:** 单文件 SPA 扩展，在 `public/index.html` 中新增视图 + CSS + JS，`server.js` 新增 2 个 API。键盘纯 CSS/HTML 渲染，练习逻辑复用现有字符比对。

**Tech Stack:** Vanilla JS, Tailwind CSS CDN, CSS Custom Properties, Express.js

---

### Task 1: 服务端 — 指法练习 API

**Files:**
- Modify: `server.js` — 在 Settings API 之后新增两个端点

- [ ] **Step 1: 新增 GET/PUT /api/fingering 端点**

在 `server.js` 的 Settings API（约第 382 行）之后添加以下代码：

```javascript
// ----- Fingering Practice API (per-user) -----
app.get('/api/fingering', requireAuth, (req, res) => {
  const defaults = {
    levels: {
      '1': { completed: false, bestWPM: 0, bestAccuracy: 0, bestTime: 0 },
      '2': { completed: false, bestWPM: 0, bestAccuracy: 0, bestTime: 0 },
      '3': { completed: false, bestWPM: 0, bestAccuracy: 0, bestTime: 0 },
      '4': { completed: false, bestWPM: 0, bestAccuracy: 0, bestTime: 0 },
      '5': { completed: false, bestWPM: 0, bestAccuracy: 0, bestTime: 0 },
    },
    fingerStats: {
      leftPinky: { hits: 0, errors: 0 },
      leftRing: { hits: 0, errors: 0 },
      leftMiddle: { hits: 0, errors: 0 },
      leftIndex: { hits: 0, errors: 0 },
      rightIndex: { hits: 0, errors: 0 },
      rightMiddle: { hits: 0, errors: 0 },
      rightRing: { hits: 0, errors: 0 },
      rightPinky: { hits: 0, errors: 0 },
      thumbs: { hits: 0, errors: 0 },
    },
  };
  const data = readJSON(userFile(req.user.username, 'fingering.json')) || {};
  res.json({ ...defaults, ...data, levels: { ...defaults.levels, ...(data.levels || {}) }, fingerStats: { ...defaults.fingerStats, ...(data.fingerStats || {}) } });
});

app.put('/api/fingering', requireAuth, (req, res) => {
  const existing = readJSON(userFile(req.user.username, 'fingering.json')) || {};
  const updated = { ...existing, ...req.body };
  writeJSON(userFile(req.user.username, 'fingering.json'), updated);
  res.json({ success: true });
});
```

- [ ] **Step 2: 验证 API 可用**

重启服务器后测试：

```bash
cd /c/Users/HUAWEI/liyan-typing-studio && node server.js
```

用 curl 或浏览器测试：
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/fingering
```
预期返回 defaults JSON 结构。

- [ ] **Step 3: Commit**

```bash
git add server.js
git commit -m "feat: add fingering practice API endpoints"
```

---

### Task 2: 键盘 CSS 样式 & HTML 模板

**Files:**
- Modify: `public/index.html` — 在 `<style>` 块末尾 `@media` 之前新增键盘样式；在用户管理视图之后新增指法练习视图 HTML

- [ ] **Step 1: 新增键盘 CSS 样式**

在 `<style>` 块中 `@media` 之前（约第 330 行）插入：

```css
/* Fingering keyboard */
.keyboard { display: flex; flex-direction: column; gap: 4px; align-items: center; user-select: none; }
.keyboard-row { display: flex; gap: 3px; }
.key-key {
  min-width: 40px; height: 42px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; color: #fff;
  transition: all 0.15s; cursor: default; position: relative;
}
.key-key.sm { min-width: 30px; font-size: 10px; }
.key-key.lg { min-width: 56px; }
.key-key.xl { min-width: 200px; }
.key-key.f-pinky { background: #c4b5fd; }
.key-key.f-ring { background: #93c5fd; }
.key-key.f-middle { background: #86efac; color: #166534; }
.key-key.f-index-l { background: #fdba74; }
.key-key.f-index-r { background: #fb923c; }
.key-key.f-thumb { background: #e8ddd8; color: var(--text); }
.key-key.target {
  box-shadow: 0 0 0 3px #fff, 0 0 14px 3px rgba(249,114,110,0.6);
  transform: scale(1.08); z-index: 2;
  animation: keyPulse 0.8s ease-in-out infinite;
}
@keyframes keyPulse {
  0%, 100% { box-shadow: 0 0 0 3px #fff, 0 0 14px 3px rgba(249,114,110,0.6); }
  50% { box-shadow: 0 0 0 5px #fff, 0 0 22px 6px rgba(249,114,110,0.85); }
}
.key-key.hit { background: #22c55e !important; transition: background 0.15s; }
.key-key.miss { background: #ef4444 !important; animation: shake 0.3s ease; }
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}
.finger-stat-bar { height: 8px; border-radius: 4px; transition: width 0.3s; }
.level-card { cursor: pointer; transition: all 0.2s; }
.level-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.level-card.locked { opacity: 0.5; cursor: not-allowed; }
.level-card.locked:hover { transform: none; box-shadow: var(--shadow-sm); }
.level-card.completed { border: 2px solid #22c55e; }
```

- [ ] **Step 2: 新增指法练习视图 HTML 骨架**

在 `view-users` 闭合 `</div>` 之后、`<!-- Practice View -->` 之前插入：

```html
  <!-- Fingering View -->
  <div id="view-fingering" class="view p-4 max-w-5xl mx-auto">
    <!-- Mode Tabs -->
    <div class="flex items-center gap-2 mb-4">
      <button id="fingerModeBasic" class="nav-link active" onclick="app.fingerSetMode('basic')">⌨️ 基础键位</button>
      <button id="fingerModePara" class="nav-link" onclick="app.fingerSetMode('para')">📝 段落练习</button>
    </div>

    <!-- Basic Mode -->
    <div id="fingerBasicPanel">
      <!-- Level Selection -->
      <div class="card p-4 mb-4">
        <h2 class="section-title-sm mb-3">🎯 选择关卡</h2>
        <div id="fingerLevels" class="grid grid-cols-5 gap-3"></div>
      </div>
      <!-- Practice Area -->
      <div id="fingerBasicPractice" style="display:none">
        <div style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:16px">
          <div class="card p-5 text-center" style="flex:2; min-width:280px">
            <div id="fingerTargetChar" style="font-size:72px;font-weight:700;color:var(--text);transition:color 0.2s">A</div>
            <p class="text-xs mt-2" style="color:var(--text-secondary)">按下键盘上高亮的键</p>
            <div id="fingerProgressText" class="text-sm mt-2" style="color:var(--text-secondary)">0 / 0</div>
          </div>
          <div class="card p-4" style="flex:1; min-width:160px">
            <div class="stat-value" id="fingerBasicWPM">0</div>
            <div class="stat-label">WPM</div>
            <div class="stat-value mt-2" id="fingerBasicAcc">--</div>
            <div class="stat-label">正确率</div>
            <div class="stat-value mt-2" id="fingerBasicTime">00:00</div>
            <div class="stat-label">用时</div>
          </div>
        </div>
        <div class="card p-4 mb-3">
          <div id="fingerKeyboard"></div>
        </div>
        <div class="flex gap-2 justify-center">
          <button class="btn-secondary" onclick="app.fingerBasicBack()">↩ 返回选关</button>
          <button class="btn-primary" onclick="app.fingerBasicRestart()">🔄 重练</button>
        </div>
      </div>
    </div>

    <!-- Paragraph Mode -->
    <div id="fingerParaPanel" style="display:none">
      <div class="card px-5 py-3 mb-4">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <select id="fingerParaSelect" class="input-sm" style="min-width:200px" onchange="app.fingerParaSelect(this.value)">
            <option value="">-- 选择练习文本 --</option>
          </select>
          <button class="btn-secondary text-sm" onclick="app.fingerParaReset()">🔄 重置</button>
        </div>
      </div>
      <div style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:16px">
        <div class="card p-4" style="flex:1; min-width:280px">
          <div id="fingerParaRef" style="font-size:18px;line-height:2;letter-spacing:0.05em;padding:16px;border-radius:var(--radius);background:#fffefd;border:1px solid var(--border);min-height:80px;word-break:break-all"></div>
          <textarea id="fingerParaInput" class="w-full p-3 rounded-lg border mt-3" style="border-color:var(--border);min-height:120px;resize:vertical;outline:none;font-size:16px;line-height:2;border-radius:var(--radius)" placeholder="在此输入..." oninput="app.fingerParaTyping()"></textarea>
        </div>
        <div class="card p-4" style="flex:0 0 220px">
          <div class="stat-value" id="fingerParaWPM">0</div><div class="stat-label mb-2">WPM</div>
          <div class="stat-value" id="fingerParaAcc">--</div><div class="stat-label mb-2">正确率</div>
          <div class="stat-value" id="fingerParaChars">0</div><div class="stat-label mb-3">已输入</div>
          <div class="section-title-sm mb-2">✋ 手指统计</div>
          <div id="fingerParaStats"></div>
        </div>
      </div>
      <div class="card p-4 mb-3">
        <div id="fingerParaKeyboard"></div>
      </div>
    </div>
  </div>
```

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "feat: add fingering keyboard CSS and view HTML skeleton"
```

---

### Task 3: 导航栏 & 首页集成

**Files:**
- Modify: `public/index.html` — 导航栏加标签；首页 stat-cell 加指法进度

- [ ] **Step 1: 导航栏新增"指法练习"标签**

在导航栏的"开始练习"按钮之后、"用户管理"之前插入：

```html
<button class="nav-link cta-link" data-view="fingering" onclick="app.navTo('fingering')">指法练习</button>
```

- [ ] **Step 2: 导航切换逻辑注册新视图**

在 `navTo` 函数中（约第 818 行），在 `if (view==='users')` 之前添加：

```javascript
if (view==='fingering') this.loadFingeringPage();
```

- [ ] **Step 3: 首页统计面板新增指法进度**

在快速统计面板的 2x2 grid 中，将最后一个 stat-cell 替换为两个（累计字数 + 指法进度）：

在"平均正确率"的 stat-cell 之后添加：

```html
<div class="stat-cell" onclick="app.navTo('fingering')" style="cursor:pointer" title="点击进入指法练习">
  <div class="stat-num" id="wFingerProgress">0/5</div>
  <div class="stat-lbl">指法进度</div>
</div>
```

原来的 4 格变为 5 格（将 grid 改为 `grid-template-columns: 1fr 1fr` 保持不变，5 格中有 4 格占 2 列），或者改为：

将 grid 改为 3 列布局：

```html
<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px">
```

原 4 格 + 新增 1 格 = 5 格保留（但 5 不好整除）。改为 6 格，保留原来的 4 个，再加"指法进度"和第 6 个占位或去一个。

实际改为：把原来的 2x2 变成 3x2（6格），增加指法进度和连续天数：

原结构有 4 个 stat-cell：练习次数、最佳 WPM、累计字数、平均正确率。新增 2 个：指法进度、连续天数。

```html
<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px">
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
  <div class="stat-cell" onclick="app.navTo('fingering')" style="cursor:pointer" title="点击进入指法练习">
    <div class="stat-num" id="wFingerProgress">0/5</div>
    <div class="stat-lbl">指法进度</div>
  </div>
  <div class="stat-cell">
    <div class="stat-num" id="wStreakDays" style="color:var(--amber)">0</div>
    <div class="stat-lbl">连续天数</div>
  </div>
</div>
```

在 `loadWelcome()` 中更新指法进度数据（需先 fetch `/api/fingering`）：

```javascript
const fingerData = await this.api('/api/fingering');
if (fingerData && fingerData.levels) {
  const completed = Object.values(fingerData.levels).filter(l => l.completed).length;
  document.getElementById('wFingerProgress').textContent = completed + '/5';
}
document.getElementById('wStreakDays').textContent = stats.streak || 0;
```

- [ ] **Step 4: Commit**

```bash
git add public/index.html
git commit -m "feat: add fingering nav tab and home page integration"
```

---

### Task 4: 键盘渲染引擎 & 键位映射

**Files:**
- Modify: `public/index.html` — 在 `<script>` 中 app 对象新增指法相关属性与方法

- [ ] **Step 1: 新增键盘数据定义和渲染函数**

在 `app` 对象初始化属性区域新增：

```javascript
// Fingering data
fingerMode: 'basic',
fingerLevel: null,
fingerSequence: [],
fingerSeqIndex: 0,
fingerCorrect: 0,
fingerErrors: 0,
fingerStartTime: null,
fingerTimer: null,
fingerKeyMap: {
  leftPinky: ['1','`','q','a','z','Tab','Caps','Shift'],
  leftRing: ['2','w','s','x'],
  leftMiddle: ['3','e','d','c'],
  leftIndex: ['4','5','r','f','v','t','g','b'],
  rightIndex: ['6','7','y','h','n','u','j','m'],
  rightMiddle: ['8','i','k',','],
  rightRing: ['9','o','l','.'],
  rightPinky: ['0','-','=','p','[',']','\\',';','\'','/','Enter','Backspace'],
  thumbs: [' '],
},
fingerColors: {
  leftPinky: 'f-pinky', leftRing: 'f-ring', leftMiddle: 'f-middle',
  leftIndex: 'f-index-l', rightIndex: 'f-index-r',
  rightMiddle: 'f-middle', rightRing: 'f-ring',
  rightPinky: 'f-pinky', thumbs: 'f-thumb',
},
fingerNames: {
  leftPinky: '左小指', leftRing: '左无名指', leftMiddle: '左中指',
  leftIndex: '左食指', rightIndex: '右食指',
  rightMiddle: '右中指', rightRing: '右无名指',
  rightPinky: '右小指', thumbs: '拇指',
},
fingerStats: {
  leftPinky: { hits: 0, errors: 0 },
  leftRing: { hits: 0, errors: 0 },
  leftMiddle: { hits: 0, errors: 0 },
  leftIndex: { hits: 0, errors: 0 },
  rightIndex: { hits: 0, errors: 0 },
  rightMiddle: { hits: 0, errors: 0 },
  rightRing: { hits: 0, errors: 0 },
  rightPinky: { hits: 0, errors: 0 },
  thumbs: { hits: 0, errors: 0 },
},
```

- [ ] **Step 2: 新增键盘渲染函数**

```javascript
getFingerForKey(key) {
  const k = key.toLowerCase();
  for (const [finger, keys] of Object.entries(this.fingerKeyMap)) {
    if (keys.some(k2 => k2.toLowerCase() === k)) return finger;
  }
  return null;
},

renderKeyboard(containerId, targetKey) {
  const rows = [
    ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'],
    ['Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
    ['Caps','a','s','d','f','g','h','j','k','l',';','\'','Enter'],
    ['Shift','z','x','c','v','b','n','m',',','.','/','Shift'],
    ['Space'],
  ];
  const specialClass = {
    'Backspace': 'lg', 'Tab': 'lg', 'Caps': 'lg', 'Enter': 'lg',
    'Shift': 'lg', 'Space': 'xl',
  };
  const container = document.getElementById(containerId);
  if (!container) return;
  let html = '<div class="keyboard">';
  for (const row of rows) {
    html += '<div class="keyboard-row">';
    for (const key of row) {
      const finger = this.getFingerForKey(key);
      const cls = finger ? this.fingerColors[finger] : 'f-thumb';
      const size = specialClass[key] || '';
      const label = key === 'Space' ? '␣' : key;
      const targetClass = (targetKey && key.toLowerCase() === targetKey.toLowerCase()) ? ' target' : '';
      html += `<div class="key-key ${cls} ${size}${targetClass}" data-key="${key.toLowerCase()}">${label}</div>`;
    }
    html += '</div>';
  }
  html += '</div>';
  container.innerHTML = html;
},

highlightKey(containerId, key, cls) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.key-key').forEach(el => {
    if (el.dataset.key === key.toLowerCase()) {
      el.classList.add(cls);
      if (cls === 'miss' || cls === 'hit') {
        setTimeout(() => el.classList.remove(cls), 300);
      }
    }
  });
},
```

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "feat: add keyboard render engine and key mapping"
```

---

### Task 5: 基础键位练习逻辑

**Files:**
- Modify: `public/index.html` — JS 部分新增基础键位练习函数

- [ ] **Step 1: 新增关卡定义和练习控制函数**

```javascript
fingerLevelDefs: [
  { id: 1, name: '基准行', keys: 'ASDFJKL;', color: 'var(--accent)' },
  { id: 2, name: '基准+上排', keys: 'ASDFJKL;QWERUIOP', color: '#fb923c' },
  { id: 3, name: '基准+下排', keys: 'ASDFJKL;QWERUIOPZXCVM,./', color: '#22c55e' },
  { id: 4, name: '全字母', keys: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', color: '#3b82f6' },
  { id: 5, name: '综合', keys: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789，。！？；：、', color: '#8b5cf6' },
],

generateFingerSeq(keys, len) {
  len = len || (70 + Math.floor(Math.random() * 60));
  const arr = [...keys.replace(/\s/g, '')];
  let seq = '';
  for (let i = 0; i < len; i++) {
    seq += arr[Math.floor(Math.random() * arr.length)];
  }
  return seq;
},

async fingerSetMode(mode) {
  this.fingerMode = mode;
  document.getElementById('fingerModeBasic').className = mode === 'basic' ? 'nav-link active' : 'nav-link';
  document.getElementById('fingerModePara').className = mode === 'para' ? 'nav-link active' : 'nav-link';
  document.getElementById('fingerBasicPanel').style.display = mode === 'basic' ? '' : 'none';
  document.getElementById('fingerParaPanel').style.display = mode === 'para' ? '' : 'none';
  if (mode === 'basic') this.fingerLoadLevels();
  if (mode === 'para') this.fingerLoadPara();
},

async fingerLoadLevels() {
  const data = await this.api('/api/fingering');
  const levels = (data && data.levels) || {};
  const container = document.getElementById('fingerLevels');
  container.innerHTML = this.fingerLevelDefs.map(l => {
    const saved = levels[String(l.id)] || {};
    const completed = saved.completed;
    const prevCompleted = l.id === 1 || (levels[String(l.id - 1)] && levels[String(l.id - 1)].completed);
    const locked = !prevCompleted && !completed && l.id > 1;
    const cls = locked ? 'locked' : (completed ? 'completed' : '');
    return `<div class="card level-card p-3 text-center ${cls}" onclick="${locked ? '' : `app.fingerStartLevel(${l.id})`}">
      <div style="font-size:24px;font-weight:700;color:${locked ? '#b8aaa4' : l.color}">${saved.bestWPM || '—'}</div>
      <div class="text-xs mt-1" style="color:var(--text-secondary)">${l.name}</div>
      <div class="text-xs" style="color:var(--accent)">${completed ? '✅ 已通关' : (locked ? '🔒 未解锁' : '▶ 开始')}</div>
      ${completed ? `<div class="text-xs mt-1" style="color:var(--text-secondary)">最佳 ${saved.bestAccuracy || 0}%</div>` : ''}
    </div>`;
  }).join('');
},

async fingerStartLevel(id) {
  this.fingerLevel = id;
  const def = this.fingerLevelDefs.find(l => l.id === id);
  if (!def) return;
  this.fingerSequence = [...this.generateFingerSeq(def.keys)];
  this.fingerSeqIndex = 0;
  this.fingerCorrect = 0;
  this.fingerErrors = 0;
  this.fingerStartTime = Date.now();
  document.getElementById('fingerBasicPractice').style.display = '';
  document.getElementById('fingerTargetChar').textContent = this.fingerSequence[0];
  document.getElementById('fingerTargetChar').style.color = 'var(--text)';
  document.getElementById('fingerProgressText').textContent = `0 / ${this.fingerSequence.length}`;
  document.getElementById('fingerBasicWPM').textContent = '0';
  document.getElementById('fingerBasicAcc').textContent = '--';
  document.getElementById('fingerBasicTime').textContent = '00:00';
  this.renderKeyboard('fingerKeyboard', this.fingerSequence[0]);
  if (this.fingerTimer) clearInterval(this.fingerTimer);
  this.fingerTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - this.fingerStartTime) / 1000);
    document.getElementById('fingerBasicTime').textContent = this.formatTime(elapsed);
  }, 500);
  document.addEventListener('keydown', this._fingerKeyHandler);
},

_fingerKeyHandler(e) {
  if (this.fingerMode !== 'basic' || this.fingerLevel === null) return;
  e.preventDefault();
  const expected = this.fingerSequence[this.fingerSeqIndex];
  const pressed = e.key;
  const finger = this.getFingerForKey(expected);
  if (pressed === expected) {
    this.fingerCorrect++;
    if (finger) this.fingerStats[finger].hits++;
    document.getElementById('fingerTargetChar').style.color = '#22c55e';
    this.highlightKey('fingerKeyboard', expected, 'hit');
    this.fingerSeqIndex++;
    if (this.fingerSeqIndex >= this.fingerSequence.length) {
      this.fingerFinishLevel();
      return;
    }
    setTimeout(() => {
      document.getElementById('fingerTargetChar').textContent = this.fingerSequence[this.fingerSeqIndex];
      document.getElementById('fingerTargetChar').style.color = 'var(--text)';
      this.renderKeyboard('fingerKeyboard', this.fingerSequence[this.fingerSeqIndex]);
    }, 80);
  } else {
    this.fingerErrors++;
    if (finger) this.fingerStats[finger].errors++;
    document.getElementById('fingerTargetChar').style.color = '#ef4444';
    this.highlightKey('fingerKeyboard', expected, 'miss');
    setTimeout(() => {
      document.getElementById('fingerTargetChar').style.color = 'var(--text)';
    }, 200);
  }
  const total = this.fingerSeqIndex + 1;
  const minutes = ((Date.now() - this.fingerStartTime) / 1000) / 60;
  const wpm = minutes > 0 ? Math.round(this.fingerCorrect / minutes) : 0;
  const acc = this.fingerCorrect + this.fingerErrors > 0
    ? Math.round((this.fingerCorrect / (this.fingerCorrect + this.fingerErrors)) * 100) : 100;
  document.getElementById('fingerProgressText').textContent = `${this.fingerSeqIndex} / ${this.fingerSequence.length}`;
  document.getElementById('fingerBasicWPM').textContent = wpm;
  document.getElementById('fingerBasicAcc').textContent = acc + '%';
},

async fingerFinishLevel() {
  document.removeEventListener('keydown', this._fingerKeyHandler);
  if (this.fingerTimer) clearInterval(this.fingerTimer);
  const elapsed = Math.floor((Date.now() - this.fingerStartTime) / 1000);
  const minutes = elapsed / 60;
  const wpm = minutes > 0 ? Math.round(this.fingerCorrect / minutes) : 0;
  const acc = this.fingerCorrect + this.fingerErrors > 0
    ? Math.round((this.fingerCorrect / (this.fingerCorrect + this.fingerErrors)) * 100) : 100;

  // Save progress
  const data = await this.api('/api/fingering') || {};
  const levels = data.levels || {};
  const existing = levels[String(this.fingerLevel)] || {};
  const isBetter = !existing.completed || wpm > (existing.bestWPM || 0);
  levels[String(this.fingerLevel)] = {
    completed: true,
    bestWPM: isBetter ? wpm : (existing.bestWPM || wpm),
    bestAccuracy: isBetter ? acc : Math.max(existing.bestAccuracy || 0, acc),
    bestTime: isBetter ? elapsed : Math.min(existing.bestTime || elapsed, elapsed),
  };
  await this.api('/api/fingering', {
    method: 'PUT',
    body: JSON.stringify({ levels, fingerStats: this.fingerStats }),
  });

  // Show result
  const def = this.fingerLevelDefs.find(l => l.id === this.fingerLevel);
  const emoji = acc >= 95 ? '🎉' : (acc >= 80 ? '👍' : '💪');
  alert(`${emoji} ${def.name} 完成！
WPM: ${wpm}
正确率: ${acc}%
用时: ${this.formatTime(elapsed)}
${isBetter ? '🏆 新纪录！' : ''}`);

  this.fingerLevel = null;
  document.getElementById('fingerBasicPractice').style.display = 'none';
  this.fingerLoadLevels();
  // Update home stat
  const newData = await this.api('/api/fingering');
  if (newData && newData.levels) {
    const completed = Object.values(newData.levels).filter(l => l.completed).length;
    const el = document.getElementById('wFingerProgress');
    if (el) el.textContent = completed + '/5';
  }
},

fingerBasicBack() {
  document.removeEventListener('keydown', this._fingerKeyHandler);
  if (this.fingerTimer) clearInterval(this.fingerTimer);
  this.fingerLevel = null;
  document.getElementById('fingerBasicPractice').style.display = 'none';
  this.fingerLoadLevels();
},

fingerBasicRestart() {
  document.removeEventListener('keydown', this._fingerKeyHandler);
  if (this.fingerTimer) clearInterval(this.fingerTimer);
  if (this.fingerLevel) this.fingerStartLevel(this.fingerLevel);
},
```

- [ ] **Step 2: 验证基础键位练习流程**

启动服务器，进入指法练习页，选择关卡1，确认：键盘渲染正确、按键响应正常、完成弹窗显示成绩、进度保存。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "feat: add basic fingering level practice logic"
```

---

### Task 6: 段落指法练习逻辑

**Files:**
- Modify: `public/index.html` — JS 部分新增段落练习函数

- [ ] **Step 1: 新增段落练习逻辑**

```javascript
fingerBuiltinTexts: [
  { id: 'builtin_1', title: '高频偏旁部首', content: '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞' },
  { id: 'builtin_2', title: '数字日期练习', content: '2024年12月31日，案件受理号为（2024）京01民初第1889号。涉及金额人民币1238.56万元，占总标的75.3%。原告住所地为北京市朝阳区建国路88号SOHO现代城3号楼1502室，邮编100022。被告于2023年6月15日签订的第7份补充协议第3条第2款约定，违约金按日万分之五计算，自2022年11月1日起至实际履行之日止，暂计至2024年6月30日共608天。本院于2024年1月8日立案后，依法适用普通程序，分别于2024年3月20日、5月15日、9月28日公开开庭进行了审理。本案现已审理终结，判决如下：一、被告于本判决生效之日起15日内支付原告货款865.42万元及利息（以865.42万元为基数，自2023年1月1日起按年利率4.35%计算至实际清偿之日止）。二、驳回原告其他诉讼请求。案件受理费72490元，由原告负担22490元，被告负担50000元。如不服本判决，可在判决书送达之日起15日内向本院递交上诉状，并按对方当事人人数提出副本，上诉于北京市高级人民法院。' },
  { id: 'builtin_3', title: '标点符号练习', content: '《中华人民共和国民法典》第一千零四条规定："自然人享有健康权。自然人的身心健康受法律保护。任何组织或者个人不得侵害他人的健康权。"最高人民法院《关于适用〈中华人民共和国民法典〉合同编通则若干问题的解释》（法释〔2023〕12号）第一条指出："人民法院依据民法典第一百四十二条第一款、第四百六十六条第一款的规定对合同条款进行解释时，应当以通常理解为基础，结合合同的性质和目的、交易习惯以及诚实信用原则，确定合同条款的真实意思。"原告主张：（1）被告构成根本违约；（2）合同应予解除；（3）被告应赔偿损失。被告辩称：第一，原告未履行通知义务；第二，损失计算缺乏依据；第三，原告自身存在过错。法院认为：本案的争议焦点是——合同是否有效？违约行为是否存在？损失数额如何确定？' },
  { id: 'builtin_4', title: '法院术语缩写', content: '原告（以下简称YG）与被告（以下简称BG）于2022年1月1日签订了编号为No.HT2022-0889的《钢材买卖合同》。该合同约定：BG向YG购买HRB400E螺纹钢5000吨，单价为CNY 3850元/吨，总金额为RMB 1925万元整。交货地点为YG指定的工地：北京市朝阳区CBD核心区Z-12地块项目施工现场。质量标准执行GB/T 1499.2-2018。验收方式为：由监理单位（JL-2022-0156号监理合同项下）依据图纸（图号JZ-01至JZ-88）和SGS检测报告进行抽检。2019-nCoV疫情期间，BG以不可抗力（Force Majeure）为由，通过E-mail（地址：legal@bg-steel.com.cn）向YG发送了延期交货通知（文号：BG-FY-2022-001）。YG回函称：不同意延期，要求严格履行合同，否则将申请仲裁（Arbitration），适用CIETAC仲裁规则，仲裁地为北京。' },
  { id: 'builtin_5', title: '身份证号+案号', content: '申请人张三，男，1985年7月23日出生，汉族，公民身份号码110101198507230018，住北京市海淀区中关村南大街5号院12号楼3单元401室。联系电话：13801001234。被申请人李四，女，1990年12月5日出生，汉族，公民身份号码320106199012052820，住上海市浦东新区陆家嘴环路958号2201室。案由：民间借贷纠纷，案号：（2024）沪0115民初25678号。原审法院：（2023）沪0115民初12345号民事判决书已于2024年1月15日生效。再审申请审查期间，申请人提交了新证据：招商银行转账凭证（账号6214830109876543，金额200万元，交易流水号CMB2024010800001）、微信聊天记录截图（微信号zhang_san_1985，共计136页）。本院于2024年9月1日作出（2024）沪民申567号民事裁定书，裁定提审本案。再审案号：（2024）沪民再890号。' },
],

async fingerLoadPara() {
  const sel = document.getElementById('fingerParaSelect');
  sel.innerHTML = '<option value="">-- 选择练习文本 --</option>' +
    this.fingerBuiltinTexts.map(t => `<option value="${t.id}">📄 ${t.title} (${t.content.length}字)</option>`).join('');
  document.getElementById('fingerParaRef').innerHTML = '<span style="color:var(--text-secondary)">👆 请选择练习文本</span>';
  document.getElementById('fingerParaInput').value = '';
  this.renderKeyboard('fingerParaKeyboard', null);
},

fingerParaSelect(id) {
  const text = this.fingerBuiltinTexts.find(t => t.id === id);
  if (!text) { this.fingerParaReset(); return; }
  window._fingerParaText = text;
  const chars = [...text.content];
  document.getElementById('fingerParaRef').innerHTML = chars.map(c => `<span class="char-pending">${this.esc(c)}</span>`).join('');
  document.getElementById('fingerParaInput').value = '';
  document.getElementById('fingerParaInput').disabled = false;
  document.getElementById('fingerParaInput').focus();
  this._fingerParaCorrect = 0;
  this._fingerParaErrors = 0;
  this._fingerParaStart = Date.now();
  this.renderKeyboard('fingerParaKeyboard', null);
},

fingerParaTyping() {
  if (!window._fingerParaText) return;
  const text = window._fingerParaText;
  const input = document.getElementById('fingerParaInput').value;
  const inputChars = [...input];
  const refChars = [...text.content];
  const isPunct = ch => /^[\s\p{P}\p{S}]$/u.test(ch);
  let correct = 0, errors = 0;
  const spans = document.getElementById('fingerParaRef').querySelectorAll('span');
  let currentKey = null;
  for (let i = 0; i < Math.min(inputChars.length, refChars.length); i++) {
    if (isPunct(refChars[i])) { spans[i].className = 'char-correct'; continue; }
    if (inputChars[i] === refChars[i]) {
      spans[i].className = 'char-correct';
      correct++;
    } else {
      spans[i].className = 'char-error';
      errors++;
    }
    if (i === inputChars.length - 1 && i + 1 < refChars.length) {
      currentKey = refChars[i + 1];
    }
  }
  if (inputChars.length < refChars.length && inputChars.length > 0) {
    spans[inputChars.length - 1].className = 'char-cursor';
  }
  for (let i = inputChars.length; i < spans.length; i++) {
    spans[i].className = 'char-pending';
  }
  this._fingerParaCorrect = correct;
  this._fingerParaErrors = errors;
  const total = correct + errors;
  const elapsed = (Date.now() - this._fingerParaStart) / 1000;
  const wpm = elapsed > 0.05 ? Math.round(correct / (elapsed / 60)) : 0;
  const acc = total > 0 ? Math.round((correct / total) * 100) : 100;
  document.getElementById('fingerParaWPM').textContent = wpm;
  document.getElementById('fingerParaAcc').textContent = acc + '%';
  document.getElementById('fingerParaChars').textContent = inputChars.length;
  if (currentKey) this.renderKeyboard('fingerParaKeyboard', currentKey);
  this._updateFingerParaStats();
},

_updateFingerParaStats() {
  const container = document.getElementById('fingerParaStats');
  if (!container) return;
  const fingers = ['leftPinky','leftRing','leftMiddle','leftIndex','rightIndex','rightMiddle','rightRing','rightPinky','thumbs'];
  const maxHits = Math.max(1, ...fingers.map(f => this.fingerStats[f].hits));
  container.innerHTML = fingers.map(f => {
    const s = this.fingerStats[f];
    const pct = Math.round((s.hits / maxHits) * 100);
    const total = s.hits + s.errors;
    const errRate = total > 0 ? Math.round((s.errors / total) * 100) : 0;
    return `<div class="mb-2">
      <div class="flex justify-between text-xs mb-1">
        <span style="color:var(--text)">${this.fingerNames[f]}</span>
        <span style="color:var(--text-secondary)">${s.hits} 击 | ${errRate}% 错</span>
      </div>
      <div class="progress-bar" style="height:6px">
        <div class="finger-stat-bar" style="width:${pct}%;background:${f === 'thumbs' ? '#e8ddd8' : this._fingerColorVal(f)}"></div>
      </div>
    </div>`;
  }).join('');
},

_fingerColorVal(f) {
  const map = { leftPinky: '#c4b5fd', leftRing: '#93c5fd', leftMiddle: '#86efac', leftIndex: '#fdba74', rightIndex: '#fb923c', rightMiddle: '#86efac', rightRing: '#93c5fd', rightPinky: '#c4b5fd' };
  return map[f] || '#e8ddd8';
},

fingerParaReset() {
  document.getElementById('fingerParaRef').innerHTML = '<span style="color:var(--text-secondary)">👆 请选择练习文本</span>';
  document.getElementById('fingerParaInput').value = '';
  document.getElementById('fingerParaInput').disabled = true;
  document.getElementById('fingerParaWPM').textContent = '0';
  document.getElementById('fingerParaAcc').textContent = '--';
  document.getElementById('fingerParaChars').textContent = '0';
  document.getElementById('fingerParaStats').innerHTML = '';
  document.getElementById('fingerParaSelect').value = '';
  window._fingerParaText = null;
  this.renderKeyboard('fingerParaKeyboard', null);
},
```

- [ ] **Step 2: 验证段落练习流程**

选择内置文本，键入字符，确认键盘高亮跟随、参考文字变灰变红、手指统计柱状图实时更新。

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "feat: add paragraph fingering practice logic with built-in texts"
```

---

### Task 7: 页面初始化 & 事件绑定

**Files:**
- Modify: `public/index.html` — JS 部分新增 loadFingeringPage 和 handler 绑定

- [ ] **Step 1: 新增页面初始化函数**

```javascript
async loadFingeringPage() {
  // Bind keydown handler (stored as named reference for removal)
  this._fingerKeyHandler = this._fingerKeyHandler.bind(this);
  this.fingerMode = 'basic';
  this.fingerLevel = null;
  document.getElementById('fingerModeBasic').className = 'nav-link active';
  document.getElementById('fingerModePara').className = 'nav-link';
  document.getElementById('fingerBasicPanel').style.display = '';
  document.getElementById('fingerParaPanel').style.display = 'none';
  document.getElementById('fingerBasicPractice').style.display = 'none';
  // Load finger stats from server
  const data = await this.api('/api/fingering');
  if (data && data.fingerStats) {
    this.fingerStats = { ...this.fingerStats, ...data.fingerStats };
  }
  this.fingerLoadLevels();
  this.renderKeyboard('fingerKeyboard', null);
},
```

- [ ] **Step 2: 在 navTo 和 init 中注册视图**

确保 `navTo` 中已添加：
```javascript
if (view==='fingering') this.loadFingeringPage();
```

在首页 `loadWelcome` 中加载指法进度（Task 3 已添加代码块）。

- [ ] **Step 3: 提交并全面测试**

```bash
git add public/index.html
git commit -m "feat: add fingering page init and event wiring"
```

完整流程测试：
1. 登录 → 首页看到指法进度 0/5
2. 点击"指法练习"标签进入指法页
3. 基础键位：选关卡1 → 键盘高亮 A → 按 A → 绿闪 → 跳到 S → 依次完成 → 弹窗显示成绩
4. 返回选关，确认关卡1标记为"已通关"，关卡2解锁
5. 段落练习：选内置文本 → 打字 → 键盘跟随高亮 → 手指统计实时更新
6. 回到首页确认指法进度更新

---

### Task 8: 最终验收

**Files:**
- Modify: `public/index.html`, `server.js` — 可能的微调修复

- [ ] **Step 1: 全流程测试**

```bash
cd /c/Users/HUAWEI/liyan-typing-studio && node server.js
```

测试矩阵：
- [ ] 导航栏"指法练习"标签正常显示/切换
- [ ] 基础键位 5 关均正常可玩
- [ ] 键盘渲染键位正确、颜色分区正确
- [ ] 按键反馈（绿色正确/红色错误/脉冲目标）正常
- [ ] 关卡完成保存到服务端
- [ ] 段落练习键盘跟随输入高亮
- [ ] 手指统计柱状图实时更新
- [ ] 首页指法进度数字正确
- [ ] 移动端键盘可正常显示（缩小）
- [ ] 不影响现有练习页、材料页功能

- [ ] **Step 2: 修复遗留问题**

搜索残留调试代码或 eslint 警告并修复。

- [ ] **Step 3: Final Commit**

```bash
git add public/index.html server.js
git commit -m "feat: final polish for fingering practice page"
```
