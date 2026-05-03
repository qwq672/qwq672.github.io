(function() {
  const backToTopBtn = document.getElementById('backToTop');
  
  if (!backToTopBtn) return;

  // 显示/隐藏按钮
  function toggleVisibility() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  // 滚动到顶部
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // 绑定事件
  window.addEventListener('scroll', toggleVisibility);
  backToTopBtn.addEventListener('click', scrollToTop);

  // 初始化状态
  toggleVisibility();
})();
