# 温暖学习风 UI 全面翻新 — 设计规格书

> 日期：2026-05-12 | 状态：已确认

## 概述

对「溧妍的打字练习室」前端进行全方位视觉翻新，从薰衣草淡紫极简风格转变为**温暖活力的学习风**。在保留现有 HTML/JS 功能逻辑不变的前提下，重构设计系统（色彩、字体、阴影、圆角、动效），将内联 style 抽离为 class，优化关键页面布局。

---

## 色彩系统

| 角色 | CSS 变量名 | 色值 | 用途 |
|------|-----------|------|------|
| 页面背景 | `--bg-page` | `#fef7f2` | 整体暖奶油底色 |
| 卡片背景 | `--bg-card` | `#ffffff` | 白色卡片 |
| 主强调色 | `--accent` | `#f9726e` | 按钮、选中、进度条、链接 |
| 主强调深 | `--accent-dark` | `#e8635f` | 按钮 hover/active |
| 辅助强调 | `--amber` | `#f59e0b` | 打卡 badge、勋章、高亮 |
| 柔和底色 | `--soft-bg` | `#fef0ee` | hover 态、badge 背景、浅填充 |
| 柔和二色 | `--soft-bg2` | `#fff8f5` | 斑马纹交替行 |
| 主文字 | `--text` | `#3d2d2a` | 标题、正文 |
| 次文字 | `--text-secondary` | `#8b7d79` | 辅助说明、标签 |
| 边框色 | `--border` | `#e8ddd8` | 输入框、分割线 |
| CTA 渐变 | `--gradient-cta` | `#f9726e → #fb923c` | 主行动按钮 |
| 琥珀渐变 | `--gradient-amber` | `#fef3c7 → #fde68a` | 勋章 badge |
| 粉红渐变 | `--gradient-pink` | `#f9a8d4 → #f472b6` | 宠物 motivated 态 |
| 暖金渐变 | `--gradient-gold` | `#fbbf24 → #f59e0b` | 宠物 excited 态 |
| 成功绿 | `--success` | `#22c55e` | 正确数 |
| 错误红 | `--error` | `#ef4444` | 错误标记 |
| 阴影基准 | `--shadow-sm/md/lg` | 暖棕系 | 卡片层次 |

---

## 字体层级

| 层级 | 字号 | 字重 | 用途 |
|------|------|------|------|
| 页面标题 | `24px` | 700 | 登录页标题、模态标题 |
| 区域标题 | `18px` | 700 | 卡片标题 |
| 小节标题 | `15px` | 600 | 列表标题、编辑器标题 |
| 正文 | `15px` | 400 | 输入、参考文本 |
| 辅助文字 | `13px` | 400 | 标签、说明 |
| 小字 | `12px` | 400 | 时间戳、脚注 |
| 数据大字 | `28px` | 700 | stat-value（WPM、字数等） |

字体栈：`-apple-system, BlinkMacSystemFont, "Microsoft YaHei", "PingFang SC", sans-serif`（保留现有）

---

## 组件设计

### 登录页
- 全屏背景：暖奶油到浅珊瑚渐变 + CSS `repeating-linear-gradient` 细网格纹理
- 白色登录卡片：`border-radius: 24px`，暖棕柔阴影
- 标题 "溧妍的打字练习室"：暖棕色加粗 24px
- 副标题：暖灰 14px
- 输入框：`border-radius: 12px`，边框 `--border`，focus → 珊瑚色边框 + `box-shadow` 光晕
- 登录按钮：CTA 渐变全宽 pill，hover 上移 2px + 阴影加深
- 底部一句励志语 "知不足而奋进，望远山而前行"

### 导航栏
- 白色卡片，`mx-4 mt-4`，`border-radius: 16px`
- 标题 "🏠 溧妍打字练习" 保留 emoji，暖棕加粗
- 导航 pill：当前页 → `--accent` 填充 + 白字；非当前 → 暖灰字 hover `--soft-bg`
- "开始练习" pill：琥珀渐变填充，始终醒目
- 退出按钮：ghost 样式（浅灰边框，无填充），右对齐

### 卡片
- 统一 `border-radius: 16px`
- 背景 `--bg-card`，阴影 `--shadow-sm`
- Hover 时阴影提升为 `--shadow-md`
- 内边距统一 `p-5`（大卡片）或 `p-4`（小卡片）

### 按钮层级
| 级别 | 样式 | 用途 |
|------|------|------|
| 主按钮 (btn-primary) | CTA 渐变填充 + 白字 + 微阴影 | 保存、登录、结束练习 |
| 次按钮 (btn-secondary) | 浅珊瑚背景 + 珊瑚字 | 重置、新建、取消 |
| Ghost 按钮 | 边框 + 透明背景 | 删除、退出、导航次要操作 |
| 图标按钮 (btn-icon) | 圆形 40px，浅背景 | 播放/暂停、月份切换 |

所有按钮 hover 时上移 1-2px，active 时回弹，transition 0.2s。

### 输入框 / Textarea
- `border-radius: 12px`，边框 2px `--border`
- focus 态：边框 `--accent` + `box-shadow: 0 0 0 3px rgba(249,114,110,0.12)`
- Placeholder 颜色暖灰

### 进度条
- 高度 `12px`，`border-radius: 6px`
- 背景 `--soft-bg`
- 填充渐变 `--accent → --amber`
- 过渡 `width 0.5s ease`

### 统计数字卡片
- 背景交替：白 / 浅珊瑚（`--soft-bg2`）
- 数字 `28px` 加粗暖棕
- 标签 `12px` 暖灰

### 日历
- 格子 `border-radius: 10px`
- 练习日：`--soft-bg` 背景 + 底部珊瑚小圆点 `::after`
- 今天：`--accent` 填充 + 白字 + 阴影
- 其他月：`color: #ddd6d2`
- 头部日一二：暖灰小字

### 材料列表项
- `border-radius: 10px`，选中态：`--soft-bg` 背景 + 右边框珊瑚色
- 标题加粗暖棕，字数字号缩小暖灰
- 滚动条美化：`::-webkit-scrollbar` 宽度 6px，thumb 暖灰圆角

### 勋章 Badge
- 已解锁：琥珀渐变背景 + 暖棕字
- 未解锁：浅灰背景 + grayscale(0.5)
- `border-radius: 20px`，内边距 `6px 12px`

### 电子宠物
- 保留现有功能和 emoji
- 宠物球增加 `inset` 内阴影模拟光泽
- 对话气泡圆角加大至 `14px`
- 宠物状态色映射：
  - happy → 琥珀渐变
  - sad → 灰阶渐变
  - motivated → 粉红渐变
  - sleepy → 淡紫渐变（保留少许薰衣草元素）
  - excited → 暖金渐变

### Toast 提示
- 白色卡片，暖棕阴影，圆角 `12px`
- 右侧滑入动画

### 模态弹窗
- 背景遮罩：`rgba(61,45,42,0.4)` 暖棕半透明
- 弹窗卡片：`border-radius: 20px`，底部上滑动画
- 成绩单数据格：`--soft-bg` 背景圆角卡片

### 练习页控制栏
- 材料选择下拉框统一输入框风格
- 语速滑块保持现有 range 样式，轨道和 thumb 改用珊瑚色
- 模式切换：tab 式 pill（练习/考试），选中态珊瑚填充
- 考试设置区：浅琥珀背景分割线下方，紧凑排列

---

## 布局调整

### 首页
- 保持现有 flex 网格结构
- 最大宽度 `1024px` 居中
- 日历区 flex: `1 1 420px`，右侧面板 flex: `0 0 300px`
- 勋章/宠物/最近记录 行保持 flex 三栏

### 材料页
- 双栏 flex gap `20px`
- 左侧材料列表 `width: 280px; flex-shrink: 0`
- 右侧编辑器 flex: `1`

### 用户管理页
- 最大宽度 `1100px` 居中
- 保持两段式（进度监控 + 账号管理）

### 练习页
- 最大宽度 `960px` 居中
- 控制栏、参考文本、统计条、输入区垂直排列
- 统计条使用 CSS Grid `repeat(auto-fit, minmax(110px, 1fr))`

---

## 动效规范

| 场景 | 动效 | 时长 |
|------|------|------|
| 视图切换 | fadeIn opacity | 0.25s |
| 模态打开 | slideUp + fadeIn | 0.3s |
| Toast 滑入 | slideIn translateX | 0.3s |
| 按钮 hover | translateY(-1px) + shadow | 0.2s |
| 按钮 active | translateY(0) | 0.1s |
| 成就解锁 | bounceIn scale | 0.5s |
| 进度条 | width ease | 0.5s |
| 宠物浮动 | translateY 往返 | 3-5s |
| 宠物弹跳 | translateY + scale | 0.4-0.8s |

---

## 实施约束

- **不修改 server.js** 和任何后端代码
- **不修改 JS 逻辑** — 只重组 CSS/class，不动 app 对象中的业务方法
- **HTML 结构调整最小化** — 主要是移除内联 style，替换为 class
- **保持 Tailwind CSS CDN** — 不改构建工具链
- **保留 emoji** — 功能性 emoji（宠物、勋章、标题图标）不替换，不引入 SVG 图标库
- **不添加暗色模式** — 保持单一主题

---

## 回退策略

- 全部改动限于 `public/index.html` 单文件
- 先提交当前版本作为回退点
- 实施过程中可通过 git checkout 恢复

---

## 验收标准

1. 所有 5 个视图（登录、首页、材料、练习、用户管理）在新设计下功能正常
2. 无 JS 控制台错误
3. 色彩系统完全切换到暖色学习风
4. 按钮/卡片/输入框 hover/focus/active 交互状态完整
5. 移动端（768px 断点）布局正常
6. 练习核心流程可用：登录 → 选材料 → 播放/打字 → 结束 → 查看成绩
