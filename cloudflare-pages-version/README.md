# qwq672 · Cloudflare Pages / GitHub Pages 静态版

这是 [qwq672 个人小站](../) 的**纯静态**版本，可以部署到 Cloudflare Pages 或 GitHub Pages 等静态托管平台。

主版本（`/home/z/my-project`）是 Next.js 16 应用，依赖服务端运行时，无法直接部署到纯静态托管。本目录把同一个站点重写成一个 Vite + React SPA，所有数据在构建时打包成 JSON，运行时不需要任何服务器。

---

## 为什么主版本不能直接部署？

主版本用了三处服务端能力，纯静态托管（Cloudflare Pages 静态模式 / GitHub Pages）都满足不了：

| 服务端依赖 | 主版本做法 | 为什么静态托管不行 |
| --- | --- | --- |
| `/api/posts`、`/api/posts/[slug]` | 用 Node `fs` 在运行时读 `content/posts/*.md`，自写 YAML frontmatter 解析器 | 静态托管没有 Node 运行时，`fs` 用不了 |
| `/api/photos` | 用 `fs.readdir` 扫描 `public/photos/*.jpg`，再用 `sharp` 读每张图的真实宽高算比例 | `sharp` 是原生模块，静态托管环境装不上，也没有文件系统 |
| `/api/github-contributions` | 运行时 `fetch('https://github.com/users/qwq672/contributions')` 拉页面 HTML，正则解析 `<td>` 的 `data-date`/`data-level` 和 `<tool-tip>` 的贡献次数 | 这本身可以客户端做，但主版本是为了规避 CORS + 1h 缓存才放在服务端 |

另外主版本还用了 Next.js 的 `next/font`（构建时下载字体）、`next/image`（构建时优化）、SSG `generateStaticParams` 等，这些都依赖 Next.js 构建器，不是"导出静态文件"能搞定的。

---

## 这个静态版本做了什么改动

整体策略：**Vite + React + TypeScript SPA，所有动态数据在构建时生成成 JSON，运行时纯客户端。**

### 1. 技术栈替换

| 主版本 | 静态版本 |
| --- | --- |
| Next.js 16 (App Router, SSR/SSG) | Vite 5 + React 18 SPA |
| Tailwind CSS 4 (`@import "tailwindcss"`) | Tailwind CSS 3 (`@tailwind base/components/utilities`) |
| `next/font` (构建时下载字体) | Google Fonts CSS `<link>` |
| `next/link` + 文件路由 | `react-router-dom` (HashRouter) |
| `next-themes` | `next-themes` (兼容纯 React) |
| Prisma / SQLite | 不需要（站点没用数据库） |

UI 设计（暖琥珀+深夜空 oklch 配色、毛玻璃、framer-motion 动画、自定义滚动条、加载遮罩、月亮变太阳主题切换、Hero 日/夜背景交叉淡入按屏幕方向选图）**完全复刻**主版本。

### 2. 静态数据策略

写了一个构建脚本 [`scripts/build-data.ts`](scripts/build-data.ts)，在 `bun run build` 时跑一次：

- **博客文章**：读主版本 `content/posts/*.md`，复用主版本 `lib/posts.ts` 里的 YAML frontmatter 解析器 + 阅读时长估算，输出 `src/data/posts.json`（含 slug / title / date / categories / tags / description / 正文 / readingMinutes，按日期倒序）。
- **照片**：扫描主版本 `public/photos/*.jpg`，输出 `src/data/photos.json`，每条含 `src`（相对路径）和 `ratio`。注意：静态版本**不用 sharp**读真实尺寸——照片墙用 CSS Grid `grid-auto-flow: row dense` + 固定行高，任何比例都能无缝铺满，所以用了一个确定性的伪比例（按文件名轮转一组常见比例），保证多次构建布局稳定。
- **GitHub 贡献**：不在构建时抓（构建机不一定能访问 GitHub，而且贡献数据每小时都变）。改成**运行时客户端 fetch** GitHub 贡献页面 HTML 直接解析。GitHub 在该页面返回 `Access-Control-Allow-Origin: *`，浏览器通常能直接读。如果被 CORS / 网络 / 限流挡了，就显示静态占位 + GitHub 主页链接（[`src/lib/github-contributions.ts`](src/lib/github-contributions.ts) + [`github-contributions-section.tsx`](src/components/sections/github-contributions-section.tsx)）。

### 3. 路由

用 `HashRouter`（URL 形如 `/#/`、`/#/posts/2025-05-03-First`），这样 **Cloudflare Pages 和 GitHub Pages 都不用配 SPA fallback** 就能直接跑。站内的"关于/兴趣/项目/随笔/照片墙/资源/联系"导航是 JS `scrollIntoView`，不靠 URL hash，所以和 HashRouter 不冲突。

如果你想用干净的 `/posts/slug` 路径（`BrowserRouter`），需要在 Cloudflare Pages 加 `_redirects` 文件（`/* /index.html 200`），或在 GitHub Pages 用 `404.html` 重定向 hack——见下文部署小节。

### 4. 复刻的组件

从主版本 `src/components/` 复制并适配（去掉 `'use client'` 因为 SPA 全是客户端；把 `next/link` 换成 `react-router-dom` 的 `Link`；把 `next/image` 换成 `<img>`；把 API fetch 换成 import JSON）：

- `HeroSection` — 日/夜背景图交叉淡入，按 `matchMedia('(orientation: portrait)')` 选桌面横版 / 移动竖版图池
- `AboutSection` — 头像 + 简介 + 三张事实卡
- `InterestsSection` — 5 张兴趣卡，lucide 图标
- `ProjectsSection` — 3 个项目卡 + logo（PNG 用 `<img>`，SVG 内联渲染支持 `currentColor`）
- `GitHubContributionsSection` — 53×7 热力图，客户端 fetch + 解析 + 失败占位
- `BlogSection` — 搜索 + 分类 chips + 页码分页（6 篇/页）
- `PhotoWallSection` — CSS Grid 零缝隙铺满，`smartShuffle` 避免相邻同比例
- `ResourcesSection` — 4 张资源卡 + 密码提示横幅
- `ContactSection` — 5 个联系方式（GitHub / Bilibili / Email×2 / Teams），Teams 用自定义 SVG
- `SiteNavbar` — 毛玻璃横向居中、滚动隐藏、移动端全屏菜单（clipPath circle 展开 + 序号 01-07）
- `SiteFooter` — 头像 + 版权 + 回到顶部
- `PageIntro` — 首次加载遮罩（672 mark + 进度线），sessionStorage 防重复
- `ThemeToggle` — SVG 月亮变太阳形变（transform 动画，GPU 合成）
- `Scrollbar` — 自定义 overlay 滚动条（触摸设备跳过）
- `MenuIcon` — 汉堡变 X 形变
- `MarkdownView` — `react-markdown` + `remark-gfm` + `remark-breaks`，表格/代码块包 `overflow-x-auto`
- 文章详情页 `/posts/:slug` — 头像 + 日期 + 阅读时长 + 正文 + 标签 + 上下篇导航 + 返回列表

### 5. 主题

主版本用 `next-themes`（`attribute="class"`, `defaultTheme="dark"`）。静态版本照搬，并在 `index.html` 里加了一段内联脚本，在 React 挂载前就读 `localStorage.theme` 给 `<html>` 加 `.dark` 类，避免主题闪烁（FOUC）。

### 6. 配置文件

- [`vite.config.ts`](vite.config.ts)：`base: './'` 让所有资源 URL 用相对路径，这样无论部署在根域名（Cloudflare 自定义域）还是子路径（GitHub Pages `用户名.github.io/仓库名/`）都能正确加载。
- [`tailwind.config.ts`](tailwind.config.ts)：和主版本一致的 oklch 配色变量映射。
- [`src/index.css`](src/index.css)：完整复制主版本 `globals.css` 的配色 token、毛玻璃、滚动条、`prose-warm` markdown 样式、动画关键帧（Tailwind v3 语法）。
- [`package.json`](package.json)：`scripts` 含 `dev` / `build`（生成数据 + Vite 构建）/ `preview` / `lint`（tsc 类型检查）。

---

## 本地开发

```bash
# 安装依赖
bun install

# 开发服务器（带 HMR）
bun run dev

# 生产构建（先生成 JSON 数据，再 Vite 打包到 dist/）
bun run build

# 预览生产构建
bun run preview

# 类型检查
bun run lint
```

> ⚠️ **构建脚本依赖主版本目录**：`scripts/build-data.ts` 默认从 `/home/z/my-project/content/posts/` 读 markdown、从 `/home/z/my-project/public/photos/` 读照片列表。如果你把这个目录单独拷出去部署，需要：
> 1. 把主版本的 `content/posts/` 也拷过来（或改 `build-data.ts` 里的 `POSTS_DIR` 路径）；
> 2. 照片已经在 `public/photos/` 里了，`build-data.ts` 会优先读主版本目录——如果想读本地，把 `PHOTOS_DIR` 改成 `path.resolve(__dirname, "..", "public", "photos")`。

---

## 部署

### Cloudflare Pages

#### 方式 A：用 GitHub Action 自动部署（推荐）

1. 把这个目录推到 GitHub 仓库。
2. 在 Cloudflare 创建一个 API Token（权限：Account > Cloudflare Pages > Edit）。
3. 在仓库 Settings → Secrets 添加：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. 推送到 `main` 分支，[`.github/workflows/deploy-cloudflare.yml`](.github/workflows/deploy-cloudflare.yml) 会自动构建并部署。

**构建配置（如果用 Cloudflare Pages 直连 Git）**：
- Framework preset: `Vite`
- Build command: `bun install && bun run build`
- Build output directory: `dist`
- 注意：构建时需要 `content/posts/` 里的 markdown，要么把主版本的 `content/` 目录也提交进这个仓库，要么 fork 后改 `scripts/build-data.ts` 里的路径。

#### 路由（可选）

用 HashRouter 时不需要任何路由配置。如果想切到 BrowserRouter 用干净 URL，在 `dist/` 里加一个 `_redirects` 文件：

```
/*    /index.html   200
```

### GitHub Pages

#### 方式 A：用 GitHub Action 自动部署（推荐）

1. 把这个目录推到 GitHub 仓库。
2. 仓库 Settings → Pages → Source 选 "GitHub Actions"。
3. 推送到 `main` 分支，[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 会自动构建并部署到 `https://<用户名>.github.io/<仓库名>/`。

因为 `vite.config.ts` 里 `base: './'` 用相对路径，所以**项目站点**（`用户名.github.io/<仓库名>/`）和**用户站点**（`用户名.github.io/`）都能直接跑，不用改配置。

#### 方式 B：手动部署到 `gh-pages` 分支

```bash
bun run build
# 用 gh-pages CLI 或手动推 dist/ 到 gh-pages 分支
npx gh-pages -d dist
```

#### 路由（可选）

HashRouter 在 GitHub Pages 上零配置可用。如果想切到 BrowserRouter：

1. 在 `public/` 加一个 `404.html`，内容是 [spa-github-pages](https://github.com/rafgraph/spa-github-pages) 的重定向脚本，把所有路径重定向到 `index.html`；
2. 或者把 `index.html` 复制一份成 `404.html`（Vite 构建后可以加 `cp dist/index.html dist/404.html`）。

---

## 目录结构

```
cloudflare-pages-version/
├── .github/workflows/
│   ├── deploy.yml              # GitHub Pages 部署
│   └── deploy-cloudflare.yml   # Cloudflare Pages 部署
├── public/                     # 静态资源（从主版本复制）
│   ├── bg/                     # day / day-mobile / night / night-mobile
│   ├── photos/                 # 38 张照片
│   ├── logo/                   # lavaarcade.png / tinycraft.png / arvgrid.svg
│   ├── avatar.webp
│   ├── icon-48.webp
│   └── apple-touch-icon.png
├── scripts/
│   └── build-data.ts           # 构建时生成 posts.json + photos.json
├── src/
│   ├── components/
│   │   ├── sections/           # Hero / About / Interests / Projects / GitHub / Blog / PhotoWall / Resources / Contact
│   │   ├── icons/teams-icon.tsx
│   │   ├── motion-helpers.tsx  # Reveal / SectionHeading / stagger
│   │   ├── markdown-view.tsx
│   │   ├── project-logo.tsx
│   │   ├── site-navbar.tsx
│   │   ├── site-footer.tsx
│   │   ├── page-intro.tsx
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── scrollbar.tsx
│   │   └── menu-icon.tsx
│   ├── data/                   # 构建时生成（gitignore）
│   │   ├── posts.json
│   │   └── photos.json
│   ├── lib/
│   │   ├── content.ts          # 兴趣 / 项目 / 资源 / 导航
│   │   ├── hero-images.ts      # 日/夜图池 + 预加载
│   │   ├── github-contributions.ts  # 客户端 fetch + 解析
│   │   ├── posts.ts            # PostMeta 类型
│   │   ├── posts-data.ts       # 读 posts.json
│   │   ├── photos-data.ts      # 读 photos.json
│   │   ├── format.ts           # 日期格式化
│   │   └── utils.ts            # cn() 类名合并
│   ├── pages/
│   │   ├── home.tsx            # 首页（所有区块）
│   │   └── post.tsx            # 文章详情页 /posts/:slug
│   ├── App.tsx                 # 路由表
│   ├── main.tsx                # 入口（HashRouter + ThemeProvider + Scrollbar）
│   ├── index.css               # 完整样式（= 主版本 globals.css）
│   └── vite-env.d.ts
├── index.html                  # 含字体 link + 主题防闪脚本
├── vite.config.ts              # base: './'
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 和主版本的功能对照

| 功能 | 主版本 (Next.js) | 静态版本 (Vite SPA) |
| --- | --- | --- |
| Hero 日/夜背景交叉淡入 + 按方向选图 | ✅ | ✅ |
| 主题切换（月亮变太阳） | ✅ | ✅ |
| 自定义滚动条 | ✅ | ✅ |
| 加载遮罩 | ✅ | ✅ |
| 移动端全屏菜单 | ✅ | ✅ |
| 兴趣 / 项目 / 资源 / 联系卡 | ✅ | ✅ |
| GitHub 贡献热力图 | 服务端 fetch + 1h 缓存 | 客户端 fetch + 失败占位 |
| 博客搜索 + 分类 + 分页 | ✅ | ✅ |
| 文章详情 + 上下篇 | ✅ SSG | ✅ 客户端路由 |
| 照片墙无缝铺满 | ✅ sharp 读真实尺寸 | ✅ 伪比例（不用 sharp） |
| Markdown 渲染（GFM + 表格） | ✅ | ✅ |
| 字体 | next/font 构建 | Google Fonts CSS |
| 部署目标 | Node 服务器 / Vercel | 任意静态托管 |

---

## 已知差异

1. **照片墙比例**：静态版本用确定性的伪比例而不是真实尺寸，所以具体哪张图占多高和主版本略有不同，但整体"无缝铺满"的视觉效果一致。
2. **GitHub 贡献数据新鲜度**：主版本服务端 1h 缓存；静态版本每次访问都客户端 fetch（GitHub 不限频的话没问题）。如果遇到 CORS / 限流，会显示占位 + 链接。
3. **URL 形式**：用 HashRouter，文章页是 `/#/posts/slug` 而不是 `/posts/slug`。这是为了零配置兼容静态托管。需要干净 URL 的话按上文"路由（可选）"配置。
4. **字体加载**：主版本用 `next/font` 把字体文件 inline 进 CSS（首屏更快）；静态版本用 Google Fonts CDN（多一个网络请求，但 Google Fonts CDN 缓存命中率极高，多数用户其实是缓存命中的）。
