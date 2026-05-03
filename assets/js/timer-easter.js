(function() {
  // ---------- 配置 ----------
  const SINGLE_PAGE_KEY = 'singlePageTimer';       // 单页面计时器（页面切换重置）
  const SITE_TOTAL_KEY = 'siteTotalTimer';         // 整站累计计时器（跨页面）
  const SINGLE_TRIGGERED_KEY = 'single30Triggered'; // 单页面30秒是否已触发
  const TOTAL_TRIGGERED_KEY = 'total60Triggered';   // 整站60秒是否已触发
  
  let currentPageStartTime = Date.now();
  let active = true;
  let lastActiveTime = Date.now();
  
  // DOM 元素
  let toastContainer = null;
  
  // 获取 toast 容器
  function getToastContainer() {
    if (toastContainer) return toastContainer;
    toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }
  
  // 显示底部消息
  function showMessage(text, autoClose = true, duration = 5000) {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<span>${text}</span><button class="close-toast" aria-label="关闭">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>`;
    container.appendChild(toast);
    
    const closeBtn = toast.querySelector('.close-toast');
    const close = () => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    };
    closeBtn.addEventListener('click', close);
    if (autoClose) {
      setTimeout(close, duration);
    }
    toast.style.animation = 'fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  }
  
  // 监听用户活动
  function resetUserActivity() {
    lastActiveTime = Date.now();
  }
  
  document.addEventListener('mousemove', resetUserActivity);
  document.addEventListener('keydown', resetUserActivity);
  document.addEventListener('scroll', resetUserActivity);
  document.addEventListener('click', resetUserActivity);
  
  // 监听页面可见性
  function handleVisibilityChange() {
    active = !document.hidden;
    if (active) {
      lastActiveTime = Date.now();
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // 计时主逻辑
  function tick() {
    const now = Date.now();
    const inactiveTimeout = 30000; // 30秒无活动视为静置
    
    if (!document.hidden && (now - lastActiveTime) < inactiveTimeout) {
      // 更新单页面计时
      const pageElapsed = Math.floor((now - currentPageStartTime) / 1000);
      
      // 更新整站累计计时
      let totalSeconds = parseInt(localStorage.getItem(SITE_TOTAL_KEY) || '0');
      totalSeconds += 1;
      localStorage.setItem(SITE_TOTAL_KEY, totalSeconds.toString());
    }
  }
  
  // 初始化
  function initTimer() {
    setInterval(tick, 1000);
  }
  
  // 页面加载完成后启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimer);
  } else {
    initTimer();
  }
})();
