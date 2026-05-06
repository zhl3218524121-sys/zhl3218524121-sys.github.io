# 个人品牌网站

章海林的个人品牌网站，基于 React + Vite + Tailwind CSS 构建。

## 在线访问

- **GitHub Pages**: https://zhl3218524121-sys.github.io/
- **Vercel 镜像**: （部署后自动获得）

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署到 GitHub Pages

```bash
npm run deploy
```

## 部署到 Vercel

### 方式一：GitHub 自动同步（推荐）

1. 打开 https://vercel.com/
2. 点击 "Add New Project"
3. 选择 `zhl3218524121-sys.github.io` 仓库
4. 框架预设选择 **Vite**
5. 点击 "Deploy"

Vercel 会自动检测 `vercel.json` 配置，每次推送代码到 GitHub 都会自动重新部署。

### 方式二：Vercel CLI

```bash
npm i -g vercel
vercel
```

## 项目结构

```
├── public/              # 静态资源
│   ├── assets/          # 图片、PDF 等
│   └── data/            # JSON 数据文件
├── src/
│   ├── components/      # 组件
│   ├── pages/           # 页面
│   ├── hooks/           # 自定义 Hooks
│   ├── firebase.js      # Firebase 配置
│   └── main.jsx         # 入口
└── vercel.json          # Vercel 配置
```

## 技术栈

- React 18
- Vite
- Tailwind CSS
- React Router
- Firebase Authentication
- Lucide Icons
