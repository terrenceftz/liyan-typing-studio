const express = require('express');
const fs = require('fs');
const path = require('path');

const crypto = require('crypto');

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Default credentials
const DEFAULT_USER = 'ly';
const DEFAULT_PASS = '123123';

// In-memory token store (survives until server restart)
const validTokens = new Map(); // token -> { username, createdAt }

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ----- Auth Middleware -----
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录，请先登录' });
  }
  const token = authHeader.slice(7);
  if (!validTokens.has(token)) {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }
  req.user = validTokens.get(token);
  next();
}

// ----- Auth API -----
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '请输入账号和密码' });
  }
  if (username !== DEFAULT_USER || password !== DEFAULT_PASS) {
    return res.status(401).json({ error: '账号或密码错误' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  validTokens.set(token, { username, createdAt: new Date().toISOString() });
  res.json({ success: true, token, username });
});

app.post('/api/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    validTokens.delete(authHeader.slice(7));
  }
  res.json({ success: true });
});

app.get('/api/auth/check', requireAuth, (req, res) => {
  res.json({ valid: true, username: req.user.username });
});

// ----- Helpers -----
function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (e) { /* corrupt file, return default */ }
  return null;
}

function writeJSON(filename, data) {
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2), 'utf-8');
}

function today() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

// ----- Materials API -----
app.get('/api/materials', requireAuth, (_req, res) => {
  const data = readJSON('materials.json') || { materials: [], activeId: null };
  res.json(data);
});

app.post('/api/materials', requireAuth, (req, res) => {
  const { title, content } = req.body;
  const data = readJSON('materials.json') || { materials: [], activeId: null };
  const material = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: title || '未命名材料',
    content,
    charCount: [...(content || '')].length,
    createdAt: new Date().toISOString(),
  };
  data.materials.push(material);
  if (!data.activeId) data.activeId = material.id;
  writeJSON('materials.json', data);
  res.json({ success: true, material });
});

app.put('/api/materials/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const data = readJSON('materials.json') || { materials: [], activeId: null };
  const idx = data.materials.findIndex((m) => m.id === id);
  if (idx === -1) return res.status(404).json({ error: '材料未找到' });
  if (title !== undefined) data.materials[idx].title = title;
  if (content !== undefined) {
    data.materials[idx].content = content;
    data.materials[idx].charCount = [...content].length;
  }
  writeJSON('materials.json', data);
  res.json({ success: true, material: data.materials[idx] });
});

app.delete('/api/materials/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const data = readJSON('materials.json') || { materials: [], activeId: null };
  data.materials = data.materials.filter((m) => m.id !== id);
  if (data.activeId === id) data.activeId = data.materials[0]?.id || null;
  writeJSON('materials.json', data);
  res.json({ success: true });
});

app.post('/api/materials/:id/activate', requireAuth, (req, res) => {
  const { id } = req.params;
  const data = readJSON('materials.json') || { materials: [], activeId: null };
  if (!data.materials.find((m) => m.id === id)) {
    return res.status(404).json({ error: '材料未找到' });
  }
  data.activeId = id;
  writeJSON('materials.json', data);
  res.json({ success: true, activeId: id });
});

// ----- Practice History API -----
app.get('/api/history', requireAuth, (_req, res) => {
  const data = readJSON('history.json') || [];
  res.json(data);
});

app.post('/api/history', requireAuth, (req, res) => {
  const { materialId, materialTitle, wpm, accuracy, totalChars, correctChars, incorrectChars, duration, speed, mode, examTimeLimit, examTargetChars } = req.body;
  const data = readJSON('history.json') || [];
  const record = {
    id: Date.now().toString(36),
    materialId,
    materialTitle,
    wpm,
    accuracy,
    totalChars,
    correctChars,
    incorrectChars,
    duration,
    speed,
    mode: mode || 'practice',
    examTimeLimit: examTimeLimit || null,
    examTargetChars: examTargetChars || null,
    date: new Date().toISOString(),
  };
  data.push(record);
  writeJSON('history.json', data);

  // Update daily progress
  updateDailyProgress(correctChars);

  // Update streak
  updateStreak();

  // Check achievements
  const newAchievements = checkAchievements(wpm, accuracy, correctChars);
  res.json({ success: true, record, newAchievements });
});

// ----- Stats API -----
app.get('/api/stats', requireAuth, (_req, res) => {
  const daily = readJSON('daily.json') || {};
  const streak = readJSON('streak.json') || { count: 0, lastDate: null };
  const achievements = readJSON('achievements.json') || [];
  const dailyGoal = readJSON('settings.json')?.dailyGoal || 1000;
  const todayChars = daily[today()] || 0;

  res.json({
    streak: streak.count,
    todayChars,
    dailyGoal,
    todayPercent: Math.min(100, Math.round((todayChars / dailyGoal) * 100)),
    achievements,
  });
});

// ----- Settings API -----
app.get('/api/settings', requireAuth, (_req, res) => {
  const defaults = { speed: 1.0, dailyGoal: 1000, hideReference: false, fontSize: 18 };
  const data = readJSON('settings.json') || {};
  res.json({ ...defaults, ...data });
});

app.put('/api/settings', requireAuth, (req, res) => {
  const existing = readJSON('settings.json') || {};
  const updated = { ...existing, ...req.body };
  writeJSON('settings.json', updated);
  res.json({ success: true, settings: updated });
});

// ----- Calendar API -----
app.get('/api/calendar', requireAuth, (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const month = parseInt(req.query.month) || (new Date().getMonth() + 1);
  const daily = readJSON('daily.json') || {};

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const todayStr = today();
  const days = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      day: d,
      date: dateStr,
      chars: daily[dateStr] || 0,
      practiced: !!daily[dateStr],
      isToday: dateStr === todayStr,
    });
  }

  res.json({ year, month, daysInMonth, firstDayOfWeek, days });
});

// ----- Helpers -----
function updateDailyProgress(chars) {
  const daily = readJSON('daily.json') || {};
  const key = today();
  daily[key] = (daily[key] || 0) + chars;
  writeJSON('daily.json', daily);
}

function updateStreak() {
  const streak = readJSON('streak.json') || { count: 0, lastDate: null };
  const todayStr = today();
  if (streak.lastDate === todayStr) return; // already practiced today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (streak.lastDate === yesterdayStr) {
    streak.count += 1;
  } else if (streak.lastDate !== todayStr) {
    streak.count = 1;
  }
  streak.lastDate = todayStr;
  writeJSON('streak.json', streak);
}

function checkAchievements(wpm, accuracy, correctChars) {
  const achievements = readJSON('achievements.json') || [];
  const streak = readJSON('streak.json') || { count: 0 };
  const newAchievements = [];

  const add = (id, name, icon, desc) => {
    if (!achievements.find((a) => a.id === id)) {
      achievements.push({ id, name, icon, desc, unlockedAt: new Date().toISOString() });
      newAchievements.push({ id, name, icon, desc });
    }
  };

  // First practice
  const history = readJSON('history.json') || [];
  if (history.length === 1) {
    add('first', '初试锋芒', '⚔️', '完成首次练习');
  }

  // Speed demon
  if (wpm >= 150) {
    add('speed', '快如闪电', '⚡', '单次速度突破 150 WPM');
  }

  // 7-day streak
  if (streak.count >= 7) {
    add('streak7', '持之以恒', '🔥', '连续打卡 7 天');
  }

  // 100 WPM milestone
  if (wpm >= 100) {
    add('wpm100', '渐入佳境', '🚀', '单次速度突破 100 WPM');
  }

  // Accuracy master
  if (accuracy >= 98 && correctChars >= 50) {
    add('accuracy', '分毫不差', '🎯', '正确率达到 98% 以上');
  }

  if (newAchievements.length > 0) {
    writeJSON('achievements.json', achievements);
  }

  return newAchievements;
}

app.listen(PORT, () => {
  console.log(`🏠 溧妍的打字练习室 服务已启动: http://localhost:${PORT}`);
});
