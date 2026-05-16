# AGENTS.md — 个人品牌网站

> 本文档供 AI 编码助手阅读。项目主要使用中文注释和文档，因此本文档以中文撰写。

---

## 项目概述

这是一个基于 **React 18 + Vite + Tailwind CSS** 构建的单页应用（SPA），是章海林的个人品牌网站 / 作品集站点。网站采用客户端路由，所有内容通过 JSON 数据文件驱动，部署在 GitHub Pages 上，同时支持 Vercel 镜像部署。

**在线地址**：https://zhl3218524121-sys.github.io/

### 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 18.2.0 |
| 构建工具 | Vite | 5.1.0 |
| 样式框架 | Tailwind CSS | 3.4.1 |
| 路由 | React Router DOM | 6.22.0（HashRouter）|
| 图标库 | Lucide React | 0.344.0 |
| 认证服务 | Firebase Authentication | 12.12.1 |
| 部署 | gh-pages | 6.3.0 |

---

## 项目结构

```
├── public/                    # 静态资源（构建时直接复制到 dist）
│   ├── assets/                # 图片、PDF、SVG 架构图等
│   │   ├── architectures/     # 系统架构图 SVG（1.svg, 2.svg, 3.svg）
│   │   ├── avatar/avatar.jpg  # 头像
│   │   ├── bg/                # 首页背景轮播图（bg1-3.jpg）
│   │   ├── gallery/           # 灵感板图片
│   │   └── resume/resume.pdf  # 简历 PDF
│   ├── data/                  # JSON 内容数据文件
│   │   ├── architectures.json # 架构图元数据
│   │   ├── articles.json      # 博客文章（含 Markdown 内容）
│   │   ├── books.json         # 推荐书籍
│   │   ├── config.json        # 站点配置（名称、社交链接等）
│   │   ├── photos.json        # 灵感板照片数据
│   │   ├── skills.json        # 技能与熟练度
│   │   ├── timeline.json      # 人生/职业时间线
│   │   └── works.json         # 作品集项目
│   ├── export-gallery.html    # 独立画廊导出页面
│   ├── favicon.svg            # 网站图标
│   └── apple-touch-icon.svg   # iOS 图标
├── src/
│   ├── components/            # 可复用 UI 组件（16 个）
│   │   ├── AudioPlayer.jsx    # 背景音乐播放器（当前未使用）
│   │   ├── BackToTop.jsx      # 回到顶部按钮
│   │   ├── BgSwitcher.jsx     # 首页背景轮播
│   │   ├── CommentSlot.jsx    # 本地评论系统（含管理员审核）
│   │   ├── Footer.jsx         # 页脚
│   │   ├── GitHubCard.jsx     # GitHub 统计卡片
│   │   ├── Navbar.jsx         # 响应式导航栏
│   │   ├── NotFound.jsx       # 404 页面
│   │   ├── ShareButtons.jsx   # 链接复制分享
│   │   ├── SocialIcons.jsx    # 社交媒体图标链接
│   │   ├── StatusBadge.jsx    # 动态状态徽章
│   │   ├── SubscribeBar.jsx   # 邮件订阅栏
│   │   ├── TagCloud.jsx       # 交互式标签云
│   │   ├── TechTag.jsx        # 分类技术标签
│   │   ├── TerminalWidget.jsx # 交互式终端（当前未使用）
│   │   └── ThemeMenu.jsx      # 深色/浅色模式切换菜单
│   ├── hooks/                 # 自定义 React Hooks（4 个）
│   │   ├── useAdminAuth.js    # Firebase 管理员认证
│   │   ├── useDarkMode.js     # 主题持久化（localStorage + 系统偏好）
│   │   ├── useJsonData.js     # 通用 JSON 数据获取 Hook
│   │   └── useScrollPosition.js # 滚动位置追踪
│   ├── pages/                 # 页面级组件（12 个）
│   │   ├── AboutPage.jsx      # 关于我（含时间线）
│   │   ├── ArticleDetailPage.jsx # 文章阅读器（内置简易 Markdown 解析器）
│   │   ├── ArticlesPage.jsx   # 文章列表（支持筛选）
│   │   ├── BooksPage.jsx      # 推荐书籍网格
│   │   ├── ContactPage.jsx    # 联系表单 + 订阅
│   │   ├── GalleryPage.jsx    # 照片画廊（支持管理员上传）
│   │   ├── HomePage.jsx       # 首页（Hero + 精选内容）
│   │   ├── ProjectDetailPage.jsx # 项目详情（含架构图）
│   │   ├── ResumePage.jsx     # 简历展示 + PDF 下载
│   │   ├── SkillsPage.jsx     # 技能可视化（按分类）
│   │   ├── TimelinePage.jsx   # 时间线页面
│   │   └── WorksPage.jsx      # 作品集网格（支持标签筛选）
│   ├── App.jsx                # 根组件（路由定义）
│   ├── firebase.js            # Firebase 初始化配置
│   ├── index.css              # Tailwind 指令 + 自定义工具类
│   └── main.jsx               # 应用入口（HashRouter）
├── index.html                 # HTML 入口（含 SEO meta 标签）
├── package.json               # 依赖与脚本
├── vite.config.js             # Vite 配置（base: '/'）
├── tailwind.config.js         # Tailwind 配置（自定义动画、字体）
├── postcss.config.js          # PostCSS（tailwind + autoprefixer）
├── vercel.json                # Vercel SPA 路由 + 缓存头
└── README.md                  # 项目说明（中文）
```

---

## 构建与运行命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建（输出到 dist/）
npm run build

# 预览生产构建
npm run preview

# 部署到 GitHub Pages
npm run deploy
```

### Vercel 部署

- **方式一（推荐）**：在 Vercel 控制台导入 GitHub 仓库，框架预设选择 **Vite**
- **方式二**：使用 Vercel CLI：`npm i -g vercel && vercel`

Vercel 会自动读取 `vercel.json` 中的 SPA 回退和缓存配置。

---

## 路由架构

使用 `HashRouter`（为了兼容 GitHub Pages 静态托管）：

| 路径 | 页面 |
|------|------|
| `/` | HomePage |
| `/about` | AboutPage |
| `/works` | WorksPage |
| `/works/:id` | ProjectDetailPage |
| `/articles` | ArticlesPage |
| `/articles/:id` | ArticleDetailPage |
| `/gallery` | GalleryPage |
| `/timeline` | TimelinePage |
| `/resume` | ResumePage |
| `/books` | BooksPage |
| `/skills` | SkillsPage |
| `/contact` | ContactPage |
| `*` | NotFound |

---

## 数据管理

**没有使用全局状态管理库**（无 Redux、Zustand 等）。状态管理方式：

1. **组件本地状态**：`useState`、`useEffect`
2. **JSON 数据驱动**：所有内容（文章、作品、技能、时间线、书籍、照片）存储在 `public/data/*.json`，通过 `useJsonData` Hook 异步获取
3. **本地存储**：
   - `localStorage.theme` — 主题偏好（dark / light）
   - `localStorage.gallery-local` — 本地上传的画廊图片（Base64）
   - `localStorage.comments-${workId}` / `comments-pending-${workId}` — 已审核/待审核评论
4. **Firebase Auth**：管理员身份认证（用于评论审核、画廊管理）

### useJsonData Hook

```js
const { data, loading, error } = useJsonData('/data/articles.json')
```

- 内部使用 `fetch` 获取 JSON
- 支持请求取消（cleanup 时设置 `cancelled` 标志）
- 返回 `{ data, loading, error }` 三元组

---

## 样式规范

### Tailwind CSS 配置

- **深色模式**：`class` 策略，通过 `html.dark` 类切换
- **自定义字体栈**：system-ui 优先的无衬线字体族
- **自定义过渡时长**：`duration-400`（400ms）、`duration-600`（600ms）
- **自定义动画**：`animate-fade-in`、`animate-slide-up`
- **颜色主题**：Stone 色板（`stone-50` 到 `stone-900`）+ Emerald 强调色

### 自定义 CSS 工具类（index.css）

| 类名 | 作用 |
|------|------|
| `.glass` | 毛玻璃效果（白色/深色半透明 + backdrop-blur）|
| `.glass-strong` | 更强的毛玻璃效果 |
| `.tooltip` | 左侧悬浮提示（通过 `data-tip` 属性设置内容）|
| `.tooltip-top` | 顶部悬浮提示 |
| `.comment-slot` | 评论区域分隔样式 |

### 编码风格

- **组件文件**：PascalCase，默认导出（如 `Navbar.jsx`）
- **Hook 文件**：camelCase，`use` 前缀，命名导出（如 `useDarkMode.js`）
- **页面文件**：PascalCase，`Page` 后缀（如 `HomePage.jsx`）
- **JSON 数据文件**：kebab-case（如 `articles.json`）
- **组件模式**：函数组件 + Hooks，参数中解构 props
- **条件渲染**：三元运算符为主
- **性能优化**：适度使用 `useMemo`（筛选、分组计算）、`useCallback`（事件处理）

---

## 关键功能实现

### 1. 深色/浅色模式（useDarkMode）

- 优先读取 `localStorage.theme`
- 无记录时跟随系统偏好 `prefers-color-scheme`
- 通过切换 `html.dark` 类实现，Tailwind `dark:` 前缀响应

### 2. 本地评论系统（CommentSlot）

- 评论存储在 `localStorage`
- 新评论默认状态为 **待审核**（`approved: false`）
- 用户提交后显示"评论已提交"，不提示需要审核
- 管理员通过 Firebase 登录后可审核（通过/拒绝/删除）
- 管理员邮箱硬编码：`3218524121@qq.com`

### 3. 画廊管理（GalleryPage）

- 照片来源：`public/data/photos.json` + `localStorage.gallery-local`
- **管理员上传**：通过 FileReader 读取为 Base64，存入 localStorage
- **导出功能**：下载图片文件 + 复制 JSON 配置，便于迁移到仓库
- 瀑布流布局：`columns-1 sm:columns-2 lg:columns-3`
- Lightbox 全览查看

### 4. 简易 Markdown 解析器（ArticleDetailPage）

文章正文以 Markdown 字符串存储在 `articles.json`，由页面内置的 `renderContent` 函数解析：

- 代码块（```）：带语法高亮背景
- 标题（`##`、`###`）
- 表格（`|`）：简单 flex 布局渲染
- 引用（`>`）
- 分隔线（`---`）
- 普通段落

**注意**：这是轻量级实现，不支持内联样式（如 `**bold**`、链接等）。

### 5. 背景轮播（BgSwitcher）

- 首页全屏背景图自动轮播
- 配置在 `public/data/config.json` 的 `background.images` 和 `background.interval`

### 6. 联系表单（ContactPage）

- 使用 Web3Forms 服务（通过 iframe 绕开 CORS）
- 访问密钥配置在 `config.json` 的 `services.web3formsKey`

---

## Firebase 配置

文件：`src/firebase.js`

项目使用 Firebase Authentication 仅用于**管理员登录**（评论审核、画廊管理）。

```js
const firebaseConfig = {
  apiKey: "AIzaSyBO_a73INPVXzdBIkpAYNFJJCdZWz2nXpw",
  authDomain: "rersonl-website.firebaseapp.com",
  projectId: "rersonl-website",
  // ...
}
```

**安全注意**：Firebase API Key 以明文硬编码在源码中。这是 Firebase 的设计方式（API Key 是客户端标识，非秘密密钥），但应确保 Firebase 控制台中的安全规则配置正确。

---

## 测试

**当前项目没有配置任何测试框架。**

- 无 Jest / Vitest / Playwright 依赖
- 无测试脚本
- 无测试文件

如需添加测试，建议：
- 单元测试：Vitest（与 Vite 生态一致）
- 组件测试：React Testing Library
- E2E 测试：Playwright

---

## 部署配置

### GitHub Pages（主要部署目标）

- `vite.config.js` 中 `base: '/'`
- `npm run deploy` 使用 `gh-pages` 将 `dist/` 推送到 `gh-pages` 分支
- 远程仓库：`https://github.com/zhl3218524121-sys/zhl3218524121-sys.github.io.git`
- 使用 `HashRouter` 避免刷新 404 问题

### Vercel（镜像部署）

`vercel.json` 配置：
- SPA 回退：所有路由指向 `index.html`
- 静态资源缓存：`/assets/*` 设置 `Cache-Control: public, max-age=31536000, immutable`

---

## 安全注意事项

1. **Firebase API Key 硬编码**：虽然 Firebase API Key 是客户端凭证，但仍应限制其使用域名（在 Firebase 控制台设置）
2. **管理员邮箱硬编码**：`3218524121@qq.com` 写在 `useAdminAuth.js` 中
3. **localStorage 存储敏感数据**：画廊图片以 Base64 存 localStorage，有大小限制（约 5-10MB），且数据仅存在于当前浏览器
4. **Web3Forms 访问密钥**：以明文存储在 `config.json` 中
5. **无 CSRF / XSS 防护**：评论系统直接渲染用户输入文本（未做 HTML 转义），但由于是本地存储且需管理员审核，风险可控

---

## 开发注意事项

1. **未使用的组件**：`AudioPlayer.jsx` 和 `TerminalWidget.jsx` 已完整实现但未被 `App.jsx` 引用，可随时启用
2. **时间线数据**：`public/data/timeline.json` 中存在大量空占位条目，需填充实际内容
3. **Mailchimp 集成**：`config.json` 中 `services.mailchimpUrl` 为占位符 `YOUR_MAILCHIMP_URL_HERE`
4. **Giscus 评论**：`config.json` 中 `comments.enabled` 为 `false`，当前使用本地评论系统替代
5. **图片资源**：部分图片使用 Unsplash 外链，部分使用本地资源；建议统一托管以保证稳定性
6. **构建输出**：`dist/` 目录已预构建并提交到仓库，修改源码后需重新运行 `npm run build` 更新
