// 平滑进度条，监听页面导航和资源加载
(function() {
  let progressBar = null;
  let timeoutId = null;
  let isActive = false;
  
  function createProgressBar() {
    if (progressBar) return;
    const bar = document.createElement('div');
    bar.id = 'nprogress';
    bar.innerHTML = '<div class="bar" role="bar"><div class="peg"></div></div>';
    document.body.appendChild(bar);
    progressBar = bar.querySelector('.bar');
  }
  
  function setProgress(percent) {
    if (!progressBar) createProgressBar();
    progressBar.style.width = percent + '%';
    if (percent >= 100) {
      setTimeout(() => {
        if (progressBar) {
          progressBar.style.opacity = '0';
          setTimeout(() => {
            if (progressBar) {
              progressBar.style.width = '0%';
              progressBar.style.opacity = '1';
            }
          }, 300);
        }
      }, 200);
    }
  }
  
  function start() {
    if (isActive) return;
    isActive = true;
    if (timeoutId) clearTimeout(timeoutId);
    setProgress(0);
    let step = 0;
    function increase() {
      if (!isActive) return;
      step += Math.random() * 8 + 2;
      if (step < 85) {
        setProgress(step);
        timeoutId = setTimeout(increase, 150);
      }
    }
    increase();
  }
  
  function done() {
    isActive = false;
    if (timeoutId) clearTimeout(timeoutId);
    setProgress(100);
  }
  
  document.addEventListener('startNProgress', function() {
    start();
  });
  
  document.addEventListener('doneNProgress', function() {
    done();
  });
  
  let lastClickTime = 0;
  document.addEventListener('click', function(e) {
    const now = Date.now();
    if (now - lastClickTime < 300) return;
    lastClickTime = now;
    
    const target = e.target.closest('a');
    if (!target || !target.href) return;
    
    const isInternal = target.href.startsWith(window.location.origin) && !target.target;
    const isDownload = target.hasAttribute('download');
    const isExcluded = target.closest('.no-progress') !== null;
    
    if (isInternal && !isDownload && !isExcluded) {
      const href = target.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('/#')) {
        start();
      }
    }
  });
  
  window.addEventListener('popstate', function() {
    start();
    setTimeout(done, 500);
  });
  
  window.addEventListener('load', function() {
    done();
  });
})();