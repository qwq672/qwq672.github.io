---
title: "第一篇博客"
date: 2026-05-03
draft: false
---

这是测试内容。

```html

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=yes">
    <title>流光映像 · 林述光 | 多列自动照片墙</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* 主题变量 */
        :root {
            --bg-page: #0f0e0c;
            --surface: rgba(25, 22, 20, 0.7);
            --text-primary: #f2eee9;
            --text-secondary: #cdc5b8;
            --accent: #e0863a;
            --border-light: rgba(255, 255, 255, 0.08);
            --shadow-md: 0 12px 24px rgba(0,0,0,0.3);
            --card-radius: 20px;
        }

        body.light {
            --bg-page: #f5f2ef;
            --surface: rgba(245, 240, 235, 0.8);
            --text-primary: #1f1c19;
            --text-secondary: #5a524a;
            --accent: #e0863a;
            --border-light: rgba(0, 0, 0, 0.08);
            --shadow-md: 0 8px 20px rgba(0,0,0,0.08);
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg-page);
            color: var(--text-primary);
            transition: background 0.3s ease;
            min-height: 100vh;
            overflow-x: hidden;
        }

        /* 静态背景氛围 */
        .bg-ambient {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 30% 20%, rgba(224,134,58,0.08), transparent 70%);
            pointer-events: none;
            z-index: 0;
        }

        /* 主内容区（顶部介绍部分） */
        .main-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem 1.8rem 1rem;
            position: relative;
            z-index: 2;
        }

        /* 导航栏 - 无圆角，顶层 */
        .navbar {
            position: sticky;
            top: 0;
            z-index: 100;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
            padding: 0.8rem 1.8rem;
            background: rgba(15, 14, 12, 0.85);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--border-light);
            width: 100%;
        }
        body.light .navbar {
            background: rgba(245, 240, 235, 0.85);
        }
        .logo {
            font-weight: 700;
            font-size: 1.3rem;
            background: linear-gradient(125deg, var(--text-primary), var(--accent));
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
        }
        .nav-links {
            display: flex;
            align-items: center;
            gap: 1.8rem;
        }
        .nav-links a {
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            transition: color 0.2s;
        }
        .nav-links a:hover {
            color: var(--accent);
        }
        .theme-switch-nav {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--accent);
            font-size: 1.2rem;
            padding: 0 0.2rem;
            transition: transform 0.2s;
        }
        .theme-switch-nav:hover {
            transform: scale(1.05);
        }

        /* 两栏简介布局 */
        .two-col {
            display: flex;
            flex-wrap: wrap;
            gap: 2rem;
            margin-bottom: 3rem;
        }
        .info-card {
            flex: 1;
            min-width: 260px;
            background: var(--surface);
            backdrop-filter: blur(16px);
            border-radius: var(--card-radius);
            padding: 1.8rem;
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border-light);
            transition: transform 0.2s;
        }
        .info-card:hover {
            transform: translateY(-3px);
        }
        .avatar {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }
        .avatar-icon {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, var(--accent), #9f4a1a);
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .avatar-icon i {
            font-size: 1.8rem;
            color: #fff2e2;
        }
        .name h1 {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--text-primary);
        }
        .name .title {
            font-size: 0.8rem;
            color: var(--accent);
        }
        .bio {
            font-size: 0.9rem;
            line-height: 1.6;
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            border-left: 2px solid var(--accent);
            padding-left: 0.8rem;
        }
        .section {
            margin-bottom: 1.2rem;
        }
        .section-label {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: var(--accent);
            margin-bottom: 0.5rem;
        }
        .tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .tag {
            background: rgba(224, 134, 58, 0.12);
            padding: 0.2rem 0.9rem;
            border-radius: 30px;
            font-size: 0.7rem;
            color: var(--text-secondary);
            border: 0.5px solid rgba(224, 134, 58, 0.3);
        }
        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.7rem;
            font-size: 0.85rem;
            color: var(--text-secondary);
            margin-bottom: 0.6rem;
        }
        .contact-item i {
            width: 24px;
            color: var(--accent);
        }
        .social {
            display: flex;
            gap: 0.8rem;
            margin-top: 1.2rem;
        }
        .social-link {
            width: 38px;
            height: 38px;
            background: rgba(224, 134, 58, 0.12);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--border-light);
            color: var(--accent);
            font-size: 1rem;
            transition: all 0.2s;
            text-decoration: none;
        }
        .social-link:hover {
            background: var(--accent);
            color: #1e120c;
            transform: translateY(-2px);
        }

        /* ---------- 照片墙分区（铺满屏幕宽度，多行多列，无间隔，自动缓慢平移） ---------- */
        .photo-wall-section {
            width: 100vw;
            position: relative;
            left: 50%;
            transform: translateX(-50%);
            margin: 1.5rem 0 0;
            padding: 0;
            overflow: hidden;
            background: transparent;
        }
        /* 暗角效果 */
        .photo-wall-section::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 3;
            background: radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.45) 100%);
            box-shadow: inset 0 0 60px rgba(0,0,0,0.3);
        }

        /* 滚动容器：溢出隐藏，鼠标可拖拽暂停 */
        .wall-scroll {
            width: 100%;
            overflow-x: hidden;
            overflow-y: visible;
            cursor: grab;
            user-select: none;
        }
        .wall-scroll:active {
            cursor: grabbing;
        }

        /* 多列布局核心：使用 column-count 实现多行多列瀑布墙 */
        .wall-track {
            column-gap: 0;          /* 列之间无间隔 */
            column-fill: auto;
            break-inside: avoid;
            width: max-content;
            animation: slowPanLinear 100s linear infinite;
            will-change: transform;
        }
        /* 鼠标悬浮时暂停移动 */
        .photo-wall-section:hover .wall-track {
            animation-play-state: paused;
        }

        /* 单个图片项：无任何卡片样式，内部图片自适应宽度 */
        .wall-track .photo-item {
            display: inline-block;
            width: 100%;
            margin: 0;
            padding: 0;
            border: none;
            background: none;
            box-shadow: none;
            line-height: 0;
            break-inside: avoid;
        }
        .wall-track img {
            display: block;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            border: none;
            border-radius: 0;
            background: #2a241e;    /* 占位色，避免加载闪烁 */
            transition: filter 0.2s;
        }
        .wall-track img:hover {
            filter: brightness(1.02);
        }

        /* 慢速水平平移动画（极缓移动，像墙在呼吸） */
        @keyframes slowPanLinear {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(-50%);
            }
        }

        /* 底部脚注 */
        .footer-note {
            text-align: left;
            max-width: 1400px;
            margin: 2rem auto 1rem;
            padding: 1rem 1.8rem 1.5rem;
            border-top: 1px solid var(--border-light);
            font-size: 0.8rem;
            color: var(--text-secondary);
        }

        /* ---------- 响应式：不同设备自动调整列数 ---------- */
        /* 通过动态 column-count 实现自适应，移动端减少列数，保证可读性 */
        @media (min-width: 1400px) {
            .wall-track {
                column-count: 8;
            }
        }
        @media (max-width: 1399px) and (min-width: 1024px) {
            .wall-track {
                column-count: 6;
            }
        }
        @media (max-width: 1023px) and (min-width: 768px) {
            .wall-track {
                column-count: 4;
            }
        }
        @media (max-width: 767px) and (min-width: 480px) {
            .wall-track {
                column-count: 3;
            }
        }
        @media (max-width: 479px) {
            .wall-track {
                column-count: 2;
            }
        }

        /* 导航栏移动端适配 */
        @media (max-width: 768px) {
            .main-content {
                padding: 1rem;
            }
            .navbar {
                padding: 0.5rem 1rem;
            }
            .nav-links {
                gap: 1rem;
            }
            .info-card {
                padding: 1.2rem;
            }
            .avatar-icon {
                width: 52px;
                height: 52px;
            }
            .name h1 {
                font-size: 1.5rem;
            }
        }
        /* 高PPI优化 */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .wall-track img {
                image-rendering: crisp-edges;
            }
        }
    </style>
</head>
<body>
<div class="bg-ambient"></div>

<!-- 导航栏（无圆角，深色模式开关在右侧） -->
<nav class="navbar">
    <div class="logo">流光映像 · 林述光</div>
    <div class="nav-links">
        <a href="#">主页</a>
        <a href="#">作品</a>
        <a href="#">摄影</a>
        <a href="#">关于</a>
        <button class="theme-switch-nav" id="navThemeToggle" aria-label="切换主题">
            <i class="fas fa-moon"></i>
        </button>
    </div>
</nav>

<div class="main-content">
    <div class="two-col">
        <div class="info-card">
            <div class="avatar">
                <div class="avatar-icon">
                    <i class="fas fa-sun"></i>
                </div>
                <div class="name">
                    <h1>林述光</h1>
                    <div class="title">暖域叙事 · 光之构筑师</div>
                </div>
            </div>
            <div class="bio">
                在数字与感知的交界，用光与色编织情绪的栖息地。每一束暖光，都是一段沉默而有力的对话。
            </div>
            <div class="section">
                <div class="section-label">创作光谱</div>
                <div class="tags">
                    <span class="tag">沉浸式光域</span>
                    <span class="tag">粒子美学</span>
                    <span class="tag">生成艺术</span>
                    <span class="tag">氛围交互</span>
                </div>
            </div>
            <div class="section">
                <div class="section-label">进行时</div>
                <div class="tags">
                    <span class="tag">《琥珀纪》文献</span>
                    <span class="tag">动态光效装置</span>
                    <span class="tag">AI 暖色调引擎</span>
                </div>
            </div>
            <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i> <span>杭州 · 上海</span>
            </div>
            <div class="contact-item">
                <i class="fas fa-globe"></i> <span>shuguang.space</span>
            </div>
            <div class="contact-item">
                <i class="fas fa-envelope"></i> <span>hello@shuguang.space</span>
            </div>
            <div class="social">
                <a href="#" class="social-link"><i class="fab fa-github"></i></a>
                <a href="#" class="social-link"><i class="fab fa-dribbble"></i></a>
                <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                <a href="#" class="social-link"><i class="fab fa-behance"></i></a>
            </div>
        </div>
        <div class="info-card">
            <div class="section-label" style="margin-bottom: 1rem;">✨ 正在创作</div>
            <div class="bio" style="border-left-color: var(--accent); margin-bottom: 0;">
                最新系列《琥珀色记忆》—— 用光影捕捉时间的温度，即将呈现。
            </div>
        </div>
    </div>
</div>

<!-- 多行多列自动照片墙（铺满屏幕宽度） -->
<div class="photo-wall-section">
    <div class="wall-scroll" id="wallScroll">
        <div class="wall-track" id="wallTrack">
            <!-- 图片由js动态生成（双倍内容实现无缝循环） -->
        </div>
    </div>
</div>

<div class="footer-note">
    <i class="fas fa-feather-alt"></i> 光是暖的，慢下来才会看见形状。
</div>

<script>
    // ---------- 图片池：不同比例，无边框，无卡片 ----------
    // 使用不同比例的高质量图片，确保多列瀑布墙自然错落
    const rawImages = [
        { url: 'https://picsum.photos/id/104/500/750', w: 500, h: 750 },   // 竖向
        { url: 'https://picsum.photos/id/106/800/600', w: 800, h: 600 },
        { url: 'https://picsum.photos/id/107/600/900', w: 600, h: 900 },
        { url: 'https://picsum.photos/id/116/700/500', w: 700, h: 500 },
        { url: 'https://picsum.photos/id/119/600/600', w: 600, h: 600 },
        { url: 'https://picsum.photos/id/127/650/850', w: 650, h: 850 },
        { url: 'https://picsum.photos/id/155/900/600', w: 900, h: 600 },
        { url: 'https://picsum.photos/id/169/480/720', w: 480, h: 720 },
        { url: 'https://picsum.photos/id/186/750/500', w: 750, h: 500 },
        { url: 'https://picsum.photos/id/200/600/800', w: 600, h: 800 },
        { url: 'https://picsum.photos/id/201/700/700', w: 700, h: 700 },
        { url: 'https://picsum.photos/id/203/850/550', w: 850, h: 550 },
        { url: 'https://picsum.photos/id/210/580/780', w: 580, h: 780 },
        { url: 'https://picsum.photos/id/215/620/620', w: 620, h: 620 },
        { url: 'https://picsum.photos/id/219/720/480', w: 720, h: 480 },
        { url: 'https://picsum.photos/id/225/680/900', w: 680, h: 900 },
        { url: 'https://picsum.photos/id/238/800/800', w: 800, h: 800 },
        { url: 'https://picsum.photos/id/239/550/820', w: 550, h: 820 }
    ];

    // 生成足够数量的图片（复制多份，保证滚动墙内容足够长），并随机排序
    let allImages = [];
    for (let i = 0; i < 6; i++) {  // 重复6遍增强长度
        const shuffled = [...rawImages];
        for (let j = shuffled.length - 1; j > 0; j--) {
            const rand = Math.floor(Math.random() * (j + 1));
            [shuffled[j], shuffled[rand]] = [shuffled[rand], shuffled[j]];
        }
        allImages = allImages.concat(shuffled);
    }
    // 最终随机打乱顺序，使不同尺寸交替出现
    for (let i = allImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allImages[i], allImages[j]] = [allImages[j], allImages[i]];
    }

    // 构建双倍内容实现无缝无限滚动（因为动画移动距离为总宽度的一半）
    const track = document.getElementById('wallTrack');
    function buildWall(images) {
        const doubleImages = [...images, ...images];
        let html = '';
        doubleImages.forEach(img => {
            // 图片使用原始宽高比例，在CSS中宽度由容器决定（100%），高度自动
            // 添加 loading="lazy" 优化性能
            html += `<div class="photo-item">
                        <img src="${img.url}" style="aspect-ratio: ${img.w} / ${img.h};" loading="lazy" alt="">
                     </div>`;
        });
        track.innerHTML = html;
    }
    buildWall(allImages);

    // 调整动画速度：根据屏幕宽度适当微调移动端速度，但整体已经较慢（100s缓慢平移）
    // CSS 中已设置 100s，符合用户“稍微慢一丢丢”需求。

    // 拖拽互动：鼠标/触摸可以暂停移动并手动拖动，感知更精致
    const scrollContainer = document.getElementById('wallScroll');
    let isDragging = false;
    let startX = 0, startScrollLeft = 0;
    let trackEl = document.querySelector('.wall-track');

    if (scrollContainer && trackEl) {
        scrollContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX - scrollContainer.offsetLeft;
            startScrollLeft = scrollContainer.scrollLeft;
            scrollContainer.style.cursor = 'grabbing';
            trackEl.style.animationPlayState = 'paused';  // 暂停移动
        });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 1.2;
            scrollContainer.scrollLeft = startScrollLeft - walk;
        });
        window.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                scrollContainer.style.cursor = 'grab';
                if (!scrollContainer.matches(':hover')) {
                    trackEl.style.animationPlayState = 'running';
                }
            }
        });
        // 触摸事件
        scrollContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX - scrollContainer.offsetLeft;
            startScrollLeft = scrollContainer.scrollLeft;
            trackEl.style.animationPlayState = 'paused';
        });
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const x = e.touches[0].pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 1.2;
            scrollContainer.scrollLeft = startScrollLeft - walk;
        });
        window.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                if (!scrollContainer.matches(':hover')) {
                    trackEl.style.animationPlayState = 'running';
                }
            }
        });
        // 鼠标离开容器时恢复自动移动（若无拖拽）
        scrollContainer.addEventListener('mouseleave', () => {
            if (!isDragging) {
                trackEl.style.animationPlayState = 'running';
            }
        });
    }

    // 图片加载优化：为避免初次加载堆积请求，可设置懒加载已通过 loading="lazy" 实现
    // 添加占位背景色，图片加载后覆盖

    // 主题切换 (导航栏按钮)
    const themeBtn = document.getElementById('navThemeToggle');
    const body = document.body;
    let isDark = true;
    function setTheme(dark) {
        if (dark) {
            body.classList.remove('light');
            themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('ui_theme', 'dark');
        } else {
            body.classList.add('light');
            themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('ui_theme', 'light');
        }
    }
    const savedTheme = localStorage.getItem('ui_theme');
    if (savedTheme === 'light') setTheme(false);
    else setTheme(true);
    themeBtn.addEventListener('click', () => {
        const isLight = body.classList.contains('light');
        setTheme(isLight);
    });

    // 确保照片墙适应不同设备后的列数刷新（无额外操作，CSS媒体查询自动处理）
    // 增加一小段处理，避免图片加载后布局抖动（重绘）
    window.addEventListener('load', () => {
        // 可触发一次轻微重绘，确保列宽准确
        if (trackEl) {
            trackEl.style.transform = 'translateX(0.01px)';
            setTimeout(() => { trackEl.style.transform = ''; }, 50);
        }
    });
</script>
</body>
</html>
```