# Task CF-1 · 创建 Cloudflare Pages 静态版本

**Agent**: full-stack-developer
**Task ID**: CF-1
**Status**: ✅ Completed

## 任务概述
在 `/home/z/my-project/cloudflare-pages-version/` 创建一个纯静态版本的 qwq672 个人站点（Vite + React + TS SPA），可部署到 Cloudflare Pages / GitHub Pages，不修改主版本任何文件。

## 关键决策

1. **技术栈**：Vite 5 + React 18 + TypeScript + Tailwind CSS 3（主版本是 Tailwind 4，这里降级到 3 因为 Vite 生态对 3 更稳）。
2. **路由**：用 `HashRouter`（`/#/`、`/#/posts/slug`），这样 Cloudflare Pages 和 GitHub Pages 都零配置可用，不用配 SPA fallback。站内导航是 JS scrollIntoView，不靠 hash，所以不冲突。
3. **静态数据**：构建脚本 `scripts/build-data.ts` 读主版本 `content/posts/*.md` + `public/photos/*.jpg`，输出 `src/data/posts.json` + `photos.json`。照片用伪比例（不用 sharp），因为照片墙是 CSS Grid dense 填充，任何比例都能无缝铺满。
4. **GitHub 贡献**：客户端 fetch GitHub 贡献页 HTML 直接解析（GitHub 该页面允许 CORS）。失败则显示占位 + 主页链接。
5. **主题**：照搬 next-themes（纯 React 也兼容），加 index.html 内联脚本防 FOUC。
6. **资源路径**：所有静态资源用相对路径 `./`（vite base `./` + content.ts/photos.json 里都写 `./`），兼容根域名和子路径部署。

## 产出文件清单

- `package.json` / `tsconfig.json` / `tsconfig.node.json` / `vite.config.ts` / `postcss.config.js` / `tailwind.config.ts` / `index.html`
- `scripts/build-data.ts` — 构建时生成 JSON
- `src/main.tsx` / `src/App.tsx` — 入口 + 路由
- `src/index.css` — 完整复刻主版本 globals.css（Tailwind v3 语法）
- `src/lib/` — content / hero-images / github-contributions / posts / posts-data / photos-data / format / utils
- `src/components/` — 16 个组件（9 个 section + navbar / footer / page-intro / theme-* / scrollbar / menu-icon / motion-helpers / markdown-view / project-logo / teams-icon）
- `src/pages/` — home / post
- `public/` — bg / photos / logo / avatar.webp / icon-48.webp / apple-touch-icon.png / favicon.svg / robots.txt（全从主版本复制）
- `.github/workflows/deploy.yml`（GitHub Pages）+ `deploy-cloudflare.yml`（Cloudflare Pages）
- `README.md` — 详述为什么主版本不能静态部署 + 改动 + 部署指南
- `.gitignore`

## 自检结果

- **TypeScript 类型检查**（`bun run lint` = `tsc --noEmit`）：✅ 0 errors
- **生产构建**（`bun run build`）：✅ 生成 `dist/`（index.html 2KB + CSS 38KB + JS 552KB gzip 186KB）
- **预览服务器**（python http.server 提供 dist/）：
  - 根路径 `/` → HTTP 200，index.html 正常 ✅
  - 静态资源 `/assets/*.js` `/photos/*.jpg` `/bg/*/*.jpg` → 全部 HTTP 200 ✅
- **Agent Browser 可视化自检**（1440×900）：
  - 首页渲染：✅ Hero(qwq672 标题+渐变) → About(关于我+事实卡) → Interests(5卡) → Projects(3项目+logo) → GitHub(@qwq672 链接可见，客户端 fetch 成功) → Blog(搜索框+分类chips+文章列表) → PhotoWall → Resources → Contact
  - 主题切换：✅ dark→light html class 正确切换，再切回 dark 正常
  - 移动端 390×844：✅ 移动端"打开菜单"按钮可见
  - 文章详情页 `/#/posts/2025-05-03-First`：✅ 标题动态更新为"网站第一篇文章 · qwq672"，文章头/正文/标签/上下篇导航/返回按钮全渲染
  - 控制台：✅ 无 error / 无 warning
  - 页面 errors：✅ []

## 已知差异（vs 主版本）

1. 照片墙用伪比例而非真实尺寸（不用 sharp），整体视觉效果一致但具体布局略不同
2. GitHub 贡献每次访问客户端 fetch（主版本服务端 1h 缓存）
3. URL 用 hash 路由 `/#/posts/slug`（主版本 `/posts/slug`）——为了零配置兼容静态托管
4. 字体用 Google Fonts CDN（主版本 next/font inline）

## 后续打包
- 已追加工作记录到 `/home/z/my-project/worklog.md`
- 待打包为 `/home/z/my-project/cloudflare-pages-version.zip`
