# qwq672 · 随笔与小破站（静态部署版）

基于主版本（Next.js 16 应用）派生的**纯静态版本**，可部署到 Cloudflare Pages / GitHub Pages 等任意静态托管平台，无需服务端运行时。

主版本仓库：`/home/z/my-project`（Next.js 16 + App Router）。

---

## 为什么需要一个静态版本？

主版本是一个 Next.js 16 应用，依赖以下**只能在服务端运行**的能力，因此无法直接静态导出（`next export` / `output: export`）部署到纯静态托管：

| 主版本依赖 | 为什么不能静态化 |
| --- | --- |
| `src/app/api/posts/route.ts` | 服务端读取 `content/posts/*.md` 并解析 frontmatter |
| `src/app/api/posts/[slug]/route.ts` | 服务端按 slug 读取单篇 markdown |
| `src/app/api/photos/route.ts` | 服务端用 `sharp` 读取 `public/photos/*.jpg` 的真实宽高 |
| `src/app/api/github-contributions/route.ts` | 服务端 fetch `github.com/users/qwq672/contributions`（绕过 CORS、带 1 小时缓存） |
| `src/app/posts/[slug]/page.tsx` | 服务端渲染 markdown 为 HTML（`generateStaticParams` + `force-static`） |
| `next/font/google` | 构建时下载并自托管字体（需要 Node 构建环境） |

Cloudflare Pages / GitHub Pages 只托管静态文件，不能跑 Node 服务端，所以主版本的 API routes 和服务端渲染都会失效。

---

## 静态版本做了什么改动？

### 架构

- **框架**：Next.js 16 → **Vite + React 18 + TypeScript**（纯客户端 SPA）
- **路由**：App Router 文件路由 → **react-router-dom v6 `HashRouter`**
  - 用 hash 路由（`/#/`、`/#/posts/slug`）是因为 Cloudflare Pages / GitHub Pages **零配置**可用，不需要配 SPA fallback（`_redirects` / `404.html`）
- **样式**：Tailwind v4（`@theme inline` + `@import "tailwindcss"`）→ **Tailwind v3**（`@tailwind` 指令 + `theme.extend.colors` 引用 oklch 通道变量）
  - 颜色变量从完整 oklch 值改为**通道值**（如 `--background: 0.985 0.008 75`），Tailwind 工具类用 `oklch(var(--background) / <alpha-value>)` 包裹，保留 `bg-background/35` 这类透明度用法
- **字体**：`next/font/google` → **Google Fonts CDN `<link>`**（`index.html` 里引入）

### 数据

- **博客文章**：服务端 API → **构建时生成 `src/data/posts.json`**
  - `scripts/build-data.ts` 读取 `content/posts/*.md`，解析 frontmatter + 正文 + 阅读时长，输出 JSON
  - 运行时直接 `import` JSON（打包进 JS，无网络请求）
- **照片墙**：服务端 `sharp` 读宽高 → **构建时读 JPEG 头部**（纯 JS，无 sharp 依赖）
  - `scripts/build-data.ts` 扫描 `public/photos/*.jpg`，解析 SOF 标记拿到真实宽高，输出 `src/data/photos.json`
- **GitHub 贡献热力图**：服务端 fetch → **客户端 fetch**
  - `src/lib/github-contributions.ts` 直接在浏览器拉 `github.com/users/qwq672/contributions` 并正则解析
  - GitHub 不发 CORS 头，多数情况会被浏览器拦截 → 显示「加载失败 + 直接去 GitHub 看」的兜底 UI（带 @qwq672 链接）
  - 这是静态版本唯一的功能性差异（主版本有服务端代理 + 1 小时缓存）

### 路由 / 页面

| 主版本 | 静态版本 |
| --- | --- |
| `src/app/page.tsx` | `src/pages/home.tsx`（`<Route path="/" />`） |
| `src/app/posts/[slug]/page.tsx` | `src/pages/post-page.tsx`（`<Route path="/posts/:slug" />`） |
| `src/app/not-found.tsx` | `src/pages/not-found.tsx`（`<Route path="*" />`） |
| `src/app/loading.tsx` | `src/pages/loading.tsx`（Suspense fallback，按需引用） |
| `src/app/error.tsx` | `src/pages/error.tsx`（react-router `errorElement`） |
| `next/link` | `react-router-dom` `Link`（站内）/ `<a>`（外链） |
| `next/image` | 普通 `<img>`（主版本已经是 `<img>`） |
| `next-themes` | 直接用（兼容 Vite，无改动） |
| `generateMetadata`（动态 title） | `document.title` 在 `useEffect` 里设置 |
| `next/font/google` | Google Fonts CDN |

### 组件

- 去掉所有 `'use client'` 指令（Vite 里全是客户端）
- `theme-toggle.tsx`：Next.js 的 `<style jsx>` → 移到 `src/index.css`（Vite 不支持 styled-jsx）
- `project-logo.tsx`：SVG 内联逻辑不变（fetch `.svg` 文本后 `dangerouslySetInnerHTML`，让 `currentColor` 生效）
- `github-contributions-section.tsx`：`fetch("/api/github-contributions")` → `fetchGitHubContributions()`（客户端，带兜底）
- `blog-section.tsx`：`fetch("/api/posts")` → `getAllPosts()`（读 JSON）
- `photo-wall-section.tsx`：`fetch("/api/photos")` → `getPhotos()`（读 JSON）

### 资源路径

- 主版本用绝对路径 `/avatar.webp`、`/bg/day/...`
- 静态版本用**相对路径** `./avatar.webp`、`bg/day/...`（`vite.config.ts` 里 `base: "./"`）
  - 这样无论部署在根域名（`user.pages.dev`）还是子路径（`user.github.io/repo/`）都能正确加载

### 主题切换 / FOUC

- `index.html` 里有内联脚本，在首次绘制前根据 `localStorage.theme` 给 `<html>` 加 `dark` 类，防止主题闪烁（替代 next-themes 的服务端注入）

---

## 功能对照表

| 功能 | 主版本 | 静态版本 | 差异 |
| --- | :---: | :---: | --- |
| Hero 日/夜背景交叉淡入 + 按 orientation 选图 | ✅ | ✅ | 无 |
| PageIntro 加载遮罩（等两张图加载完） | ✅ | ✅ | 无 |
| Navbar 毛玻璃 + 居中 + 滚动隐藏 + 移动端全屏菜单 | ✅ | ✅ | 无 |
| About / Interests / Projects / Resources / Contact | ✅ | ✅ | 无 |
| GitHub 贡献热力图（53×7） | ✅ 服务端 | ✅ 客户端 | 静态版可能因 CORS 失败，有兜底 UI |
| Blog 搜索 + 分类筛选 + 页码分页 | ✅ | ✅ | 无 |
| 照片墙 CSS Grid dense 零缝隙 | ✅ sharp 读宽高 | ✅ JPEG 头读宽高 | 无（构建时读真实尺寸） |
| 文章详情页 + 上下篇导航 | ✅ | ✅ | 无 |
| 主题切换（纯 CSS 月亮↔太阳形变） | ✅ | ✅ | 无 |
| 404 / loading / error 页面 | ✅ | ✅ | 无 |
| 暖琥珀 + 深夜空 oklch 配色 | ✅ | ✅ | 无 |
| 5 套字体（Inter / Space Grotesk / Noto SC / JetBrains Mono） | ✅ next/font | ✅ Google Fonts CDN | 加载方式不同 |
| 自定义滚动条（桌面 overlay / 移动原生） | ✅ | ✅ | 无 |

---

## 项目结构

```
cloudflare-pages-version/
├── .github/workflows/
│   ├── deploy.yml              # GitHub Pages 部署
│   └── deploy-cloudflare.yml   # Cloudflare Pages 部署
├── content/posts/*.md          # 博客源文件（从主版本复制）
├── public/
│   ├── bg/{day,day-mobile,night,night-mobile}/  # hero 背景图
│   ├── photos/*.jpg            # 照片墙原图（38 张）
│   ├── logo/                   # 项目 logo（PNG/SVG）
│   ├── avatar.webp / icon-48.webp / apple-touch-icon.png / favicon.svg
│   └── robots.txt
├── scripts/
│   └── build-data.ts           # 构建时生成 posts.json + photos.json
├── src/
│   ├── components/
│   │   ├── icons/teams-icon.tsx
│   │   ├── sections/           # 9 个区块组件
│   │   ├── markdown-view.tsx
│   │   ├── menu-icon.tsx
│   │   ├── motion-helpers.tsx
│   │   ├── page-intro.tsx
│   │   ├── project-logo.tsx
│   │   ├── scrollbar.tsx
│   │   ├── site-footer.tsx
│   │   ├── site-navbar.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── data/
│   │   ├── posts.json          # 构建生成（8 篇）
│   │   └── photos.json         # 构建生成（38 张）
│   ├── lib/
│   │   ├── content.ts          # 兴趣/项目/资源/联系方式/导航
│   │   ├── format.ts           # 日期格式化
│   │   ├── github-contributions.ts  # 客户端 fetch + 解析
│   │   ├── hero-images.ts      # hero 图池 + 预加载
│   │   ├── photos.ts           # 读 photos.json
│   │   ├── posts.ts            # 读 posts.json
│   │   └── utils.ts            # cn() 类名合并
│   ├── pages/
│   │   ├── home.tsx
│   │   ├── post-page.tsx
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   └── loading.tsx
│   ├── app.tsx                 # 路由 + ThemeProvider + Scrollbar
│   ├── main.tsx                # 入口
│   ├── index.css               # 完整样式（oklch 配色 / 毛玻璃 / 滚动条 / prose-warm / 主题图标）
│   └── vite-env.d.ts
├── index.html                  # Google Fonts + 防 FOUC 内联脚本
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts              # base: "./"
└── README.md（本文件）
```

---

## 本地开发

```bash
# 安装依赖
bun install

# 开发服务器（http://localhost:5173）
bun run dev

# 类型检查
bun run lint      # tsc --noEmit

# 重新生成数据 JSON（读 content/posts + public/photos）
bun run build:data

# 生产构建（自动先跑 build:data，再 tsc + vite build）
bun run build

# 本地预览构建产物
bun run preview
```

---

## 部署

### GitHub Pages（GitHub Actions 自动部署）

1. 把本项目推到一个 GitHub 仓库（项目文件放在仓库根目录）
2. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**
3. 推送到 `main` / `master` 分支即可触发 `.github/workflows/deploy.yml`
4. 部署完成后访问 `https://<user>.github.io/<repo>/`

> 因为 `vite.config.ts` 用 `base: "./"`（相对路径），项目页面（`/<repo>/`）和用户页面（`/<user>.github.io/`）都能正确加载资源。

### Cloudflare Pages（GitHub Actions 部署）

1. 在 Cloudflare 创建一个 Pages 项目（名字随意，例如 `qwq672`）
2. 拿到 **API Token**（需要 Cloudflare Pages 编辑权限）和 **Account ID**
3. 在 GitHub 仓库 **Settings → Secrets and variables → Actions** 添加：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. 推送到 `main` / `master` 触发 `.github/workflows/deploy-cloudflare.yml`
5. 部署完成后访问 `https://<project>.pages.dev/`

### Cloudflare Pages（UI 直连部署，更简单）

也可以不用 GitHub Actions，直接用 Cloudflare Pages 的 Git 集成：

1. Cloudflare Dashboard → Pages → Create a project → Connect to Git
2. 选仓库，配置：
   - **Framework preset**：无（或 Vite）
   - **Build command**：`bun run build`
   - **Build output directory**：`dist`
   - **Environment**：`BUN_VERSION=latest`
3. Save and Deploy

---

## 已知差异（相对主版本）

1. **GitHub 贡献热力图**：静态版本在客户端直接 fetch GitHub，可能被 CORS 拦截。失败时显示兜底 UI（提示 + @qwq672 主页链接），不影响其他功能。主版本通过服务端代理绕过 CORS 并带 1 小时缓存。
2. **URL 形态**：用 hash 路由（`/#/posts/slug`）而非干净路径（`/posts/slug`）。这是为了 Cloudflare Pages / GitHub Pages 零配置可用。若部署环境支持 SPA fallback，可改用 `BrowserRouter`。
3. **字体加载**：用 Google Fonts CDN（需联网），主版本用 `next/font` 自托管。如需完全离线，可下载字体文件到 `public/fonts/` 并改 `index.html` 的 `<link>`。
4. **照片尺寸**：静态版本构建时读 JPEG 头部拿真实宽高（纯 JS），主版本用 `sharp`。两者结果一致。
