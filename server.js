const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const mammoth = require('mammoth');

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now().toString(36) + crypto.randomBytes(4).toString('hex') + ext);
  },
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// In-memory token store
const validTokens = new Map(); // token -> { username, isAdmin, createdAt }

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ----- Helpers -----
function readJSON(filePath) {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) { /* corrupt */ }
  return null;
}

function writeJSON(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function today() { return new Date().toISOString().slice(0, 10); }

// Per-user file paths
function userDir(username) { return path.join(DATA_DIR, username); }
function userFile(username, filename) { return path.join(DATA_DIR, username, filename); }

// Shared data paths
function sharedFile(filename) { return path.join(DATA_DIR, filename); }

// Password hashing
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'liyan-salt').digest('hex');
}

// ----- User Store -----
function getUsers() {
  return readJSON(sharedFile('users.json')) || { users: [] };
}

function saveUsers(data) {
  writeJSON(sharedFile('users.json'), data);
}

function findUser(username) {
  const data = getUsers();
  return data.users.find(u => u.username === username);
}

// Initialize default users if none exist
function initUsers() {
  const data = getUsers();
  if (data.users.length === 0) {
    data.users.push({
      username: 'admin',
      passwordHash: hashPassword('123123'),
      isAdmin: true,
      createdAt: new Date().toISOString(),
    });
    data.users.push({
      username: 'ly',
      passwordHash: hashPassword('123123'),
      isAdmin: false,
      createdAt: new Date().toISOString(),
    });
    saveUsers(data);
    console.log('Default users created: admin, ly (password: 123123)');
  }
}
initUsers();

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

function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: '需要管理员权限' });
  }
  next();
}

// ----- Auth API -----
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '请输入账号和密码' });
  }
  const user = findUser(username);
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: '账号或密码错误' });
  }
  const token = crypto.randomBytes(32).toString('hex');
  validTokens.set(token, { username: user.username, isAdmin: !!user.isAdmin, createdAt: new Date().toISOString() });
  res.json({ success: true, token, username: user.username, isAdmin: !!user.isAdmin });
});

app.post('/api/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    validTokens.delete(authHeader.slice(7));
  }
  res.json({ success: true });
});

app.get('/api/auth/check', requireAuth, (req, res) => {
  res.json({ valid: true, username: req.user.username, isAdmin: req.user.isAdmin });
});

// ----- File Upload API -----
app.post('/api/upload', requireAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: '请选择文件' });
  const file = req.file;
  const fileUrl = '/uploads/' + file.filename;
  const ext = path.extname(file.originalname).toLowerCase();
  let extractedText = '';
  let fileType = '';

  if (['.mp3', '.wav', '.ogg', '.m4a', '.aac'].includes(ext)) {
    fileType = 'audio';
  } else if (['.docx'].includes(ext)) {
    fileType = 'word';
    try {
      const result = await mammoth.extractRawText({ path: file.path });
      extractedText = result.value || '';
    } catch (e) {
      return res.status(400).json({ error: 'Word 文件解析失败' });
    }
  } else if (['.txt'].includes(ext)) {
    fileType = 'text';
    extractedText = fs.readFileSync(file.path, 'utf-8');
  } else {
    fs.unlinkSync(file.path);
    return res.status(400).json({ error: '不支持的文件格式，请上传 mp3/wav/docx/txt' });
  }

  res.json({
    success: true,
    fileName: file.originalname,
    fileUrl,
    fileType,
    extractedText,
    charCount: [...extractedText].length,
  });
});

// ----- User Management API (admin only) -----
app.get('/api/users', requireAuth, requireAdmin, (_req, res) => {
  const data = getUsers();
  res.json(data.users.map(u => ({ username: u.username, isAdmin: !!u.isAdmin, createdAt: u.createdAt })));
});

app.post('/api/users', requireAuth, requireAdmin, (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '请输入账号和密码' });
  }
  if (!/^[a-zA-Z0-9_]{2,20}$/.test(username)) {
    return res.status(400).json({ error: '账号需为 2-20 位字母、数字或下划线' });
  }
  if (password.length < 4) {
    return res.status(400).json({ error: '密码至少 4 位' });
  }
  const data = getUsers();
  if (data.users.find(u => u.username === username)) {
    return res.status(400).json({ error: '账号已存在' });
  }
  data.users.push({
    username,
    passwordHash: hashPassword(password),
    isAdmin: false,
    createdAt: new Date().toISOString(),
  });
  saveUsers(data);
  res.json({ success: true, username });
});

app.delete('/api/users/:username', requireAuth, requireAdmin, (req, res) => {
  const { username } = req.params;
  if (username === 'admin') return res.status(400).json({ error: '不能删除默认管理员' });
  const data = getUsers();
  const idx = data.users.findIndex(u => u.username === username);
  if (idx === -1) return res.status(404).json({ error: '用户不存在' });
  data.users.splice(idx, 1);
  saveUsers(data);
  // Invalidate any active tokens for this user
  for (const [token, user] of validTokens) {
    if (user.username === username) validTokens.delete(token);
  }
  res.json({ success: true });
});

app.put('/api/users/:username/password', requireAuth, requireAdmin, (req, res) => {
  const { username } = req.params;
  const { password } = req.body;
  if (!password || password.length < 4) return res.status(400).json({ error: '密码至少 4 位' });
  const data = getUsers();
  const user = data.users.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  user.passwordHash = hashPassword(password);
  saveUsers(data);
  // Invalidate tokens for this user
  for (const [token, u] of validTokens) {
    if (u.username === username) validTokens.delete(token);
  }
  res.json({ success: true });
});

// ----- Admin Stats API -----
app.get('/api/admin/users/stats', requireAuth, requireAdmin, (_req, res) => {
  const data = getUsers();
  const result = data.users.map(u => {
    const uname = u.username;
    const daily = readJSON(userFile(uname, 'daily.json')) || {};
    const streak = readJSON(userFile(uname, 'streak.json')) || { count: 0, lastDate: null };
    const achievements = readJSON(userFile(uname, 'achievements.json')) || [];
    const settings = readJSON(userFile(uname, 'settings.json')) || {};
    const history = readJSON(userFile(uname, 'history.json')) || [];
    const todayChars = daily[today()] || 0;
    const dailyGoal = settings.dailyGoal || 1000;
    const bestWPM = history.reduce((max, h) => Math.max(max, h.wpm || 0), 0);
    const avgAccuracy = history.length > 0 ? Math.round(history.reduce((s, h) => s + (h.accuracy || 0), 0) / history.length) : 0;
    const lastPractice = history.length > 0 ? history[history.length - 1].date : null;
    return {
      username: uname,
      isAdmin: !!u.isAdmin,
      streak: streak.count,
      todayChars,
      dailyGoal,
      todayPercent: Math.min(100, Math.round((todayChars / dailyGoal) * 100)),
      achievementsCount: achievements.length,
      totalPractices: history.length,
      bestWPM,
      avgAccuracy,
      lastPractice,
    };
  });
  res.json(result);
});

// ----- Materials API (shared) -----
app.get('/api/materials', requireAuth, (_req, res) => {
  const data = readJSON(sharedFile('materials.json')) || { materials: [], activeId: null };
  res.json(data);
});

app.post('/api/materials', requireAuth, (req, res) => {
  const { title, content, audioUrl, audioName } = req.body;
  const data = readJSON(sharedFile('materials.json')) || { materials: [], activeId: null };
  const material = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: title || '未命名材料',
    content,
    charCount: [...(content || '')].length,
    audioUrl: audioUrl || null,
    audioName: audioName || null,
    createdBy: req.user.username,
    createdAt: new Date().toISOString(),
  };
  data.materials.push(material);
  if (!data.activeId) data.activeId = material.id;
  writeJSON(sharedFile('materials.json'), data);
  res.json({ success: true, material });
});

app.put('/api/materials/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const { title, content, audioUrl, audioName } = req.body;
  const data = readJSON(sharedFile('materials.json')) || { materials: [], activeId: null };
  const idx = data.materials.findIndex(m => m.id === id);
  if (idx === -1) return res.status(404).json({ error: '材料未找到' });
  if (title !== undefined) data.materials[idx].title = title;
  if (content !== undefined) { data.materials[idx].content = content; data.materials[idx].charCount = [...content].length; }
  if (audioUrl !== undefined) data.materials[idx].audioUrl = audioUrl;
  if (audioName !== undefined) data.materials[idx].audioName = audioName;
  writeJSON(sharedFile('materials.json'), data);
  res.json({ success: true, material: data.materials[idx] });
});

app.delete('/api/materials/:id', requireAuth, (req, res) => {
  const { id } = req.params;
  const data = readJSON(sharedFile('materials.json')) || { materials: [], activeId: null };
  data.materials = data.materials.filter(m => m.id !== id);
  if (data.activeId === id) data.activeId = data.materials[0]?.id || null;
  writeJSON(sharedFile('materials.json'), data);
  res.json({ success: true });
});

app.post('/api/materials/:id/activate', requireAuth, (req, res) => {
  const { id } = req.params;
  const data = readJSON(sharedFile('materials.json')) || { materials: [], activeId: null };
  if (!data.materials.find(m => m.id === id)) return res.status(404).json({ error: '材料未找到' });
  data.activeId = id;
  writeJSON(sharedFile('materials.json'), data);
  res.json({ success: true, activeId: id });
});

// ----- Practice History API (per-user) -----
app.get('/api/history', requireAuth, (req, res) => {
  const data = readJSON(userFile(req.user.username, 'history.json')) || [];
  res.json(data);
});

app.post('/api/history', requireAuth, (req, res) => {
  const { materialId, materialTitle, wpm, accuracy, totalChars, correctChars, incorrectChars, duration, speed, mode, examTimeLimit, examTargetChars } = req.body;
  const data = readJSON(userFile(req.user.username, 'history.json')) || [];
  const record = {
    id: Date.now().toString(36), materialId, materialTitle, wpm, accuracy, totalChars,
    correctChars, incorrectChars, duration, speed,
    mode: mode || 'practice', examTimeLimit: examTimeLimit || null, examTargetChars: examTargetChars || null,
    date: new Date().toISOString(),
  };
  data.push(record);
  writeJSON(userFile(req.user.username, 'history.json'), data);
  updateDailyProgress(req.user.username, correctChars);
  updateStreak(req.user.username);
  const newAchievements = checkAchievements(req.user.username, wpm, accuracy, correctChars);
  res.json({ success: true, record, newAchievements });
});

// ----- Stats API (per-user) -----
app.get('/api/stats', requireAuth, (req, res) => {
  const uname = req.user.username;
  const daily = readJSON(userFile(uname, 'daily.json')) || {};
  const streak = readJSON(userFile(uname, 'streak.json')) || { count: 0, lastDate: null };
  const achievements = readJSON(userFile(uname, 'achievements.json')) || [];
  const dailyGoal = (readJSON(userFile(uname, 'settings.json')) || {}).dailyGoal || 1000;
  const todayChars = daily[today()] || 0;
  res.json({
    streak: streak.count, todayChars, dailyGoal,
    todayPercent: Math.min(100, Math.round((todayChars / dailyGoal) * 100)),
    achievements,
  });
});

// ----- Settings API (per-user) -----
app.get('/api/settings', requireAuth, (req, res) => {
  const defaults = { speed: 1.0, dailyGoal: 1000, hideReference: false, fontSize: 18 };
  const data = readJSON(userFile(req.user.username, 'settings.json')) || {};
  res.json({ ...defaults, ...data });
});

app.put('/api/settings', requireAuth, (req, res) => {
  const existing = readJSON(userFile(req.user.username, 'settings.json')) || {};
  const updated = { ...existing, ...req.body };
  writeJSON(userFile(req.user.username, 'settings.json'), updated);
  res.json({ success: true, settings: updated });
});

// ----- Calendar API (per-user) -----
app.get('/api/calendar', requireAuth, (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  const month = parseInt(req.query.month) || (new Date().getMonth() + 1);
  const daily = readJSON(userFile(req.user.username, 'daily.json')) || {};
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const todayStr = today();
  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({ day: d, date: dateStr, chars: daily[dateStr] || 0, practiced: !!daily[dateStr], isToday: dateStr === todayStr });
  }
  res.json({ year, month, daysInMonth, firstDayOfWeek, days });
});

// ----- Per-user helpers -----
function updateDailyProgress(username, chars) {
  const daily = readJSON(userFile(username, 'daily.json')) || {};
  const key = today();
  daily[key] = (daily[key] || 0) + chars;
  writeJSON(userFile(username, 'daily.json'), daily);
}

function updateStreak(username) {
  const streak = readJSON(userFile(username, 'streak.json')) || { count: 0, lastDate: null };
  const todayStr = today();
  if (streak.lastDate === todayStr) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  if (streak.lastDate === yesterdayStr) streak.count += 1;
  else if (streak.lastDate !== todayStr) streak.count = 1;
  streak.lastDate = todayStr;
  writeJSON(userFile(username, 'streak.json'), streak);
}

function checkAchievements(username, wpm, accuracy, correctChars) {
  const achievements = readJSON(userFile(username, 'achievements.json')) || [];
  const streak = readJSON(userFile(username, 'streak.json')) || { count: 0 };
  const newAchievements = [];
  const add = (id, name, icon, desc) => {
    if (!achievements.find(a => a.id === id)) {
      achievements.push({ id, name, icon, desc, unlockedAt: new Date().toISOString() });
      newAchievements.push({ id, name, icon, desc });
    }
  };
  const history = readJSON(userFile(username, 'history.json')) || [];
  if (history.length === 1) add('first', '初试锋芒', '⚔️', '完成首次练习');
  if (wpm >= 150) add('speed', '快如闪电', '⚡', '单次速度突破 150 WPM');
  if (streak.count >= 7) add('streak7', '持之以恒', '🔥', '连续打卡 7 天');
  if (wpm >= 100) add('wpm100', '渐入佳境', '🚀', '单次速度突破 100 WPM');
  if (accuracy >= 98 && correctChars >= 50) add('accuracy', '分毫不差', '🎯', '正确率达到 98% 以上');
  if (newAchievements.length > 0) writeJSON(userFile(username, 'achievements.json'), achievements);
  return newAchievements;
}

app.listen(PORT, () => {
  console.log(`🏠 溧妍的打字练习室 服务已启动: http://localhost:${PORT}`);
  console.log('默认账号: admin / ly  密码: 123123');
});
