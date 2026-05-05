# 个人品牌网站

一个干净、克制但功能丰富的中文个人品牌展示网站，基于 **React + Vite + Tailwind CSS** 构建。

## 特性

- 大面积留白，极简排版
- 深色/浅色模式切换
- 全屏背景图自动轮播 + 手动切换
- 头像旁状态指示（可合作 / 读书中等）
- 关于我 + 可折叠时间线
- 技能标签云（按熟练度显示不同大小和颜色）
- 作品集瀑布流/网格，支持按技术筛选
- 照片墙/灵感板（CSS 瀑布流，悬停显示说明）
- 在线简历 + 一键下载 PDF
- 个人书架/阅读清单
- GitHub 动态卡片（github-readme-stats）
- 联系表单（Web3Forms / Formspree）
- 邮件订阅（Mailchimp 等）
- 迷你音频播放器
- 友好 404 页面
- 社交图标组与分享按钮
- 回到顶部按钮

## 项目结构

```
├── public/
│   ├── assets/
│   │   └── bg/              # 背景图片文件夹，放入图片自动读取
│   └── data/                # JSON 数据配置
│       ├── config.json      # 全局配置（姓名、社交链接、第三方服务）
│       ├── works.json       # 作品集数据
│       ├── timeline.json    # 教育/工作经历
│       ├── skills.json      # 技能标签
│       ├── books.json       # 书籍列表
│       └── photos.json      # 照片墙数据
├── src/
│   ├── components/          # 公共组件
│   ├── pages/               # 页面组件
│   ├── hooks/               # 自定义 Hooks
│   ├── App.jsx              # 路由与布局
│   └── main.jsx             # 入口
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 本地预览

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 如何修改内容

所有动态内容都通过 `public/data/` 下的 JSON 文件管理，**无需修改代码**：

| 文件 | 内容 |
|------|------|
| `public/data/config.json` | 姓名、头像、一句话定位、社交链接、Web3Forms Key、Mailchimp URL、GitHub 用户名、背景图配置 |
| `public/data/works.json` | 项目标题、描述、图片、标签、演示/源码链接 |
| `public/data/timeline.json` | 教育/工作经历（支持 `work` / `education` 类型） |
| `public/data/skills.json` | 技能名称与熟练度 `1-5` |
| `public/data/books.json` | 书名、作者、封面、推荐语 |
| `public/data/photos.json` | 照片墙图片与说明 |
| `public/assets/bg/` | 背景图片，支持多图自动轮播 |

### 快速开始

1. 修改 `public/data/config.json` 中的个人信息
2. 将背景图片放入 `public/assets/bg/`
3. 修改各 JSON 文件替换为自己的内容
4. 替换头像链接为本地或线上图片
5. 配置 Web3Forms Key 和 Mailchimp URL（可选）

## 部署

### Vercel

```bash
npm run build
# 将 dist/ 文件夹部署到 Vercel
```

### Netlify

```bash
npm run build
# 将 dist/ 文件夹拖拽到 Netlify 即可
```

或连接 Git 仓库自动部署。

## 技术栈

- React 18
- React Router 6
- Vite 5
- Tailwind CSS 3
- Lucide React（图标）

## 自定义提示

- 颜色主题通过 Tailwind 的 `stone` 色系实现，如需更改可在 `tailwind.config.js` 中调整
- 深色模式通过 `dark` class 切换，样式使用 `dark:` 前缀
- 背景图轮播间隔在 `config.json` 的 `background.interval` 中配置（毫秒）
- 所有交互动画均使用 CSS transition，保持轻量
