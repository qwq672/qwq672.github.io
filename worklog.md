# Worklog - qwq672 Personal Website

## Project Overview
Building a refined personal website for qwq672 (student) with:
- Hero, About, Interests, Projects, Blog, Contact, Footer sections
- Dark/light mode with smooth icon transition (moon <-> sun)
- Custom scrollbar (trackless, auto-show thumb)
- Day images for light mode bg, night images for dark mode bg
- Blog posts from posts.zip rendered with markdown
- Custom fonts, high-end UI, responsive

## Image Assets
- Day (light mode): anime sunset/dreamy warm scenes
- Night (dark mode): anime starry/magical night scenes

## Blog Posts (11 total, skip _index.md.disable & my-first-post.md is reference HTML)
1. 2025-05-03-First - 网站第一篇文章
2. 2025-05-04-ShareLink - 所有资源分享网站链接
3. 2025-05-06-GetIncentiveCape - Minecraft Incentive 披风
4. 2025-05-09-BedrockCapeToJava - 基岩版披风同步Java版
5. 2025-07-21-MinecraftBE - 注册Xbox账户、安装基岩版
6. 2025-10-03-MCForum - Teams Minecraft社区
7. MinecraftLIVEMar26 - MC LIVE 2026 March 总结
8. MinecraftLIVEMay26 - MC LIVE 2026 May 总结
9. about.md - 关于（含联系方式，作为内容素材参考）

---
Task ID: 1
Agent: main
Task: 准备素材 - 复制图片到 public，建立博客文章数据结构

Work Log:
- 创建 public/bg/day 和 public/bg/night 目录
- 复制并重命名图片为语义化名称
- 复制博客 markdown 到 content/posts 目录用于 API 读取
- 解析 frontmatter 获取标题、日期、分类、标签

Stage Summary:
- 素材就位，准备进入样式与组件构建阶段

---
Task ID: 2-7
Agent: main
Task: 全站构建 + 自检

Work Log:
- globals.css: 暖琥珀+深夜空配色（亮色羊皮纸暖白 / 深色深靛夜空），完全避开蓝/靛主色
- 自定义 overlay 滚动条（Scrollbar 组件）：轨道透明让页面视觉居中，滑块默认隐藏、滚动时淡入、可拖拽
- layout: 加载 5 套字体（Inter / Space Grotesk / Noto Sans SC / Noto Serif SC / JetBrains Mono），ThemeProvider 默认深色
- ThemeToggle: SVG + framer-motion 实现月亮→太阳流畅形变（光线伸缩 + 月牙遮罩滑出 + 整体微旋）
- 博客 API: 自写 YAML frontmatter 解析器，/api/posts 列表 + /api/posts/[slug] 详情，静态生成
- 6 大区块: Hero（日/夜背景图交叉淡入 + Ken Burns）、About、Interests（6 卡片）、Projects（3 项目）、Blog（8 篇文章 + 弹窗渲染 GFM markdown 含表格）、Contact（5 联系方式）、Footer
- 图片用 sharp 压缩至 ~200KB/张
- 修复 framer-motion opacity undefined 警告（给所有动画元素补 initial 值）
- 修复 SiteNavbar 导出名不匹配导致的 500

自检结果 (Agent Browser):
- 深色模式首页: ✓ 宇宙星空背景 + 琥珀 qwq672 标题，对比度好
- 亮色模式首页: ✓ 暖色夕阳背景交叉淡入切换正常
- About / Interests / Projects / Blog / Contact 区块: ✓ 全部正确渲染，布局统一
- 博客弹窗: ✓ markdown 正常渲染（标题/正文/表格）
- 主题切换图标: ✓ 月亮↔太阳形变动画
- 移动端 390px: ✓ Hero 文字可读、按钮可触、卡片堆叠
- 移动端汉堡菜单: ✓ 5 个导航项正常展开
- 自定义滚动条: ✓ 滚动时右侧出现滑块
- 控制台: ✓ 无错误无警告
- Lint: ✓ 0 errors

Stage Summary:
- 全站构建完成并通过端到端可视化自检
- 8 篇博客文章可通过 API 读取并在弹窗中渲染
- 深浅色双主题完整可用，背景图随主题切换

---
Task ID: 8-10 (v2 迭代)
Agent: main
Task: 文章独立页 + 文档板块 + 项目logo + 加载动画 + 导航修复 + UI优化

Work Log:
- 解压 project-logo.zip (LavaArcade.png/TinyCraft.png/namemc.svg→arvgrid.svg) + LavaArcade文档(6篇)
- 用 sharp 压缩 logo；arvgrid.svg 改为 currentColor 适配主题
- 新建文档数据层 lib/docs.ts (有序 TOC) + API /api/docs + /api/docs/[slug]
- 文章改为独立页面 /posts/[slug] (服务端渲染 markdown)，删除原弹窗 PostDialog
- 博客区块卡片改为 <Link> 跳转独立文章页
- 新建 DocsSection: 页内双栏浏览器(左侧序号目录 sticky + 右侧 markdown 渲染，移动端目录横滚)，切换文档有 AnimatePresence 过渡
- content.ts 更新: 项目准确描述(LavaArcade=AI+离线多人小游戏模组/TinyCraft=C语言命令行启动器/Arvgrid=网页端MIDI编曲工具)+官网链接+logo引用；兴趣改为5项；navLinks 加"文档"
- ProjectsSection 用 ProjectLogo 组件(PNG用img，SVG内联渲染支持currentColor)
- 新建 PageIntro: 首次加载遮罩(672 mark + 进度线)上滑消失，sessionStorage 防重复
- 重写 SiteNavbar: 改用 rAF 滚动检测确定 active 段落(不再用IO抖动)+ 滚动下隐藏/滚动上显示 + 更高弹簧刚度防lag
- globals.css: 加 text-gradient-animate(8s渐变缓动)、focus-visible 精致环、styled-scroll 内部滚动条样式
- Hero 标题改用 text-gradient-animate 活力渐变
- 文档区内容容器加 styled-scroll

自检结果 (Agent Browser):
- 首次加载 intro 遮罩 ✓ → 上滑露出 hero
- Projects 三个 logo 亮/暗模式均清晰显示(Arvgrid SVG 内联渲染为琥珀色)✓
- 文档板块目录切换 ✓ markdown 表格正确渲染 ✓ 移动端目录横滚 ✓
- 独立文章页 /posts/[slug] ✓ 顶栏返回+站点标识+文章头+正文+标签+返回
- 导航栏 active 跟踪稳定不再跳跃 ✓ 滚动下隐藏/上显示 ✓
- 控制台 errors:[] ✓ lint 0 error ✓
- 移动端 hero/about/docs 均正常 ✓

Stage Summary:
- v2 迭代完成: 文章独立页化、新增文档板块、项目logo与准确信息、丝滑intro动画、导航修复、UI精细优化
- 全站通过端到端自检

---
Task ID: v3 (架构扩展 + 修复)
Agent: main
Task: Arvgrid图标修复 + 文档多项目架构 + 博客搜索筛选 + 移动端全屏菜单

Work Log:
- Arvgrid 图标: 用新 icon.svg（手写A字形），白色描边改 currentColor；原 namemc.svg 改作 favicon（琥珀色672方块）
- 文档多项目架构重构:
  - 目录改为 content/docs/<project>/（lavaarcade/ 下6篇）
  - lib/docs.ts 重写: REGISTRY 注册表定义项目集(project/name/tagline/logo/TOC)，getDocSets() + getDoc(project,slug)
  - API: /api/doc-sets（所有项目集TOC）+ /api/docs/[...params]（catch-all，规避Next.js嵌套动态段不同名限制，force-dynamic支持中文slug）
  - DocsSection UI: 加项目切换器(>1项目时显示)，目前只有LavaArcade所以隐藏，结构已就绪可扩展
- 博客可扩展性: 加搜索框(标题/摘要/标签/分类全文匹配) + 分类chips筛选 + 结果计数 + 空状态(带清除筛选按钮) + 加载骨架
- 移动端全屏菜单:
  - MenuIcon 组件: 3条线流畅形变为X（上线旋45°/中线淡出缩放/下线旋-45°）
  - 全屏遮罩: clipPath circle 从右上角展开，大号导航项(2xl字体+序号01-06)，staggered入场，Esc关闭，body滚动锁
  - 菜单按钮aria-label随状态切换(打开菜单↔关闭菜单)
- 修复 framer-motion opacity undefined 警告(MenuIcon 加 initial)
- 清理 .next 缓存解决旧路由结构残留的 "different slug names" 错误

自检结果 (Agent Browser):
- Arvgrid logo: ✓ 手写A字形图标（不再是像素网格）
- 博客搜索: ✓ 输入minecraft过滤出6篇，显示"共6篇"计数
- 博客分类筛选: ✓ Minecraft/Minecraft披风/网站/测试 chips 可切换
- 文档切换: ✓ 点"下载与安装"加载表格内容(TABLE FOUND)
- 移动端全屏菜单: ✓ 全屏遮罩+大号序号导航项+汉堡变X+Esc关闭+点X复原
- 控制台: ✓ 无错误无警告
- 页面errors: ✓ []
- Lint: ✓ 0 error

Stage Summary:
- 架构扩展完成: 文档支持多项目(注册表+目录+切换器)、博客支持搜索筛选应对文章增长
- Arvgrid图标修正、移动端全屏菜单升级
- 注: 沙箱会清理后台进程，dev server需用 nohup+disown 启动，跨调用可能需重启
