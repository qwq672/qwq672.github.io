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
