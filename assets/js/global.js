// 1. 主题管理器 (Theme Manager)
// ============================================

const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const applyTheme = (theme) => {
  const isDark = theme === 'dark';
  const htmlElement = document.documentElement;

  // 添加过渡类
  htmlElement.classList.add('theme-transitioning');

  if (isDark) {
    htmlElement.setAttribute('data-theme', 'dark');
  } else {
    htmlElement.removeAttribute('data-theme');
  }

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    const themeColor = isDark ? '#1a1612' : '#fffef7';
    metaThemeColor.setAttribute('content', themeColor);
  }

  // 动画完成后移除过渡类
  setTimeout(() => {
    htmlElement.classList.remove('theme-transitioning');
  }, 400);
};

const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  let activeTheme = savedTheme;

  if (savedTheme === 'system') {
    activeTheme = getSystemTheme();
  } else if (!savedTheme) {
    activeTheme = getSystemTheme();
    localStorage.setItem('theme', 'system');
  }

  applyTheme(activeTheme);
};

const setTheme = (mode) => {
  localStorage.setItem('theme', mode);
  let activeTheme = mode;

  if (mode === 'system') {
    activeTheme = getSystemTheme();
  }

  applyTheme(activeTheme);
};

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  const currentSetting = localStorage.getItem('theme');
  if (currentSetting === 'system') {
    const newTheme = e.matches ? 'dark' : 'light';
    applyTheme(newTheme);
  }
});

function attachThemeToggleEvent() {
  const themeToggles = document.querySelectorAll('.theme-toggle');
  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = localStorage.getItem('theme') || 'system';
      let newTheme;
      if (currentTheme === 'system') newTheme = 'dark';
      else if (currentTheme === 'dark') newTheme = 'light';
      else if (currentTheme === 'light') newTheme = 'system';
      setTheme(newTheme);
    });
  });
}

// 2. 汉堡菜单切换
function attachMenuToggleEvent() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const logo = document.querySelector('.logo');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.contains('active');
      if (isActive) {
        // 关闭菜单
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        if (logo) {
          logo.classList.remove('mobile-hidden');
        }
        document.body.style.overflow = '';
      } else {
        // 打开菜单 - 先添加 mobile-fullscreen 类显示菜单，再添加 active 类触发动画
        navMenu.classList.add('mobile-fullscreen');
        setTimeout(() => {
          navMenu.classList.add('active');
        }, 10);
        menuToggle.classList.add('active');
        if (logo) {
          logo.classList.add('mobile-hidden');
        }
        document.body.style.overflow = 'hidden';
      }
    });
  }
}

// 3. 平滑滚动
function attachSmoothScrollEvent() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === "#" || href === "") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// 4. 返回顶部按钮
function initBackToTop() {
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 5. 博客标签筛选
function initTagFilter() {
  const tagFilter = document.getElementById('tagFilter');
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (!tagFilter || timelineItems.length === 0) return;

  const allTags = new Set();
  timelineItems.forEach(item => {
    const tagsStr = item.getAttribute('data-tags') || '';
    tagsStr.split(',').forEach(tag => {
      if (tag.trim()) allTags.add(tag.trim());
    });
  });

  if (allTags.size === 0) return;

  const sortedTags = Array.from(allTags).sort();
  const allTagBtn = document.createElement('span');
  allTagBtn.className = 'tag active';
  allTagBtn.textContent = '全部';
  allTagBtn.dataset.tag = 'all';
  tagFilter.appendChild(allTagBtn);

  sortedTags.forEach(tag => {
    const tagBtn = document.createElement('span');
    tagBtn.className = 'tag';
    tagBtn.textContent = tag;
    tagBtn.dataset.tag = tag;
    tagFilter.appendChild(tagBtn);
  });

  tagFilter.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag')) {
      const selectedTag = e.target.dataset.tag;

      document.querySelectorAll('#tagFilter .tag').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');

      timelineItems.forEach(item => {
        if (selectedTag === 'all') {
          item.classList.remove('hidden');
        } else {
          const itemTags = item.getAttribute('data-tags') || '';
          if (itemTags.split(',').map(t => t.trim()).includes(selectedTag)) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        }
      });
    }
  });
}

// 6. 时间线项点击跳转
function initTimelineLinks() {
  document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
        const link = item.querySelector('.timeline-title a');
        if (link) {
          window.location.href = link.href;
        }
      }
    });
  });
}

// 页面启动
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    attachThemeToggleEvent();
    attachMenuToggleEvent();
    attachSmoothScrollEvent();
    initBackToTop();
    initTagFilter();
    initTimelineLinks();
  });
} else {
  initTheme();
  attachThemeToggleEvent();
  attachMenuToggleEvent();
  attachSmoothScrollEvent();
  initBackToTop();
  initTagFilter();
  initTimelineLinks();
}
