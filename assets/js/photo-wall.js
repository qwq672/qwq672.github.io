document.addEventListener('DOMContentLoaded', function() {
  const photoWall = document.querySelector('.photo-wall');
  const photoTrack = document.querySelector('.photo-track');
  if (!photoWall || !photoTrack) return;

  // 存储原始照片数据
  let originalPhotoData = [];

  function initPhotoData() {
    const originalPhotos = document.querySelectorAll('.photo-item-original');
    originalPhotoData = Array.from(originalPhotos).map(photo => {
      const img = photo.querySelector('img');
      return {
        src: img.src,
        width: img.naturalWidth || 1920,
        height: img.naturalHeight || 1080
      };
    });
  }

  function calculatePhotoSizes() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const wallWidth = photoWall.offsetWidth;
    const wallHeight = photoWall.offsetHeight;

    // 照片尺寸范围
    const minSize = Math.floor(screenWidth / 12);
    const maxSize = Math.floor(screenWidth / 4);

    // 清空轨道
    while (photoTrack.firstChild) {
      photoTrack.removeChild(photoTrack.firstChild);
    }

    // 如果没有原始照片数据，先初始化
    if (originalPhotoData.length === 0) {
      initPhotoData();
    }

    if (originalPhotoData.length === 0) return;

    // 瀑布流布局
    // 计算列数
    const columns = Math.max(3, Math.floor(wallWidth / minSize));
    const columnWidth = Math.floor(wallWidth / columns);
    
    // 初始化列高度数组
    const columnHeights = new Array(columns).fill(0);
    
    // 创建足够的照片以填满区域
    let photoIndex = 0;
    let totalHeight = 0;
    
    // 使用瀑布流布局填充照片
    while (totalHeight < wallHeight * 1.5) {
      const photoData = originalPhotoData[photoIndex % originalPhotoData.length];
      const aspectRatio = photoData.width / photoData.height;

      // 随机决定跨越几列（1-2列）
      const spanColumns = Math.random() > 0.85 ? Math.min(2, columns) : 1;
      const actualWidth = columnWidth * spanColumns - 2;

      // 根据宽度和比例计算高度
      let height = Math.floor(actualWidth / aspectRatio);
      
      // 确保高度在范围内
      height = Math.max(minSize, Math.min(maxSize * 1.5, height));

      // 找到最短的列
      let minColumn = 0;
      for (let i = 1; i < columns - spanColumns + 1; i++) {
        if (columnHeights[i] < columnHeights[minColumn]) {
          minColumn = i;
        }
      }

      // 创建照片元素
      const img = document.createElement('img');
      img.src = photoData.src;
      img.alt = '照片';

      const photoItem = document.createElement('div');
      photoItem.className = 'photo-item';
      photoItem.appendChild(img);

      // 设置样式
      photoItem.style.width = `${actualWidth}px`;
      photoItem.style.height = `${height}px`;
      photoItem.style.position = 'absolute';
      photoItem.style.left = `${minColumn * columnWidth + 1}px`;
      photoItem.style.top = `${columnHeights[minColumn]}px`;
      photoItem.style.transform = 'none';

      // 计算object-fit位置以保留至少75%的图片内容
      const imgAspect = photoData.width / photoData.height;
      const containerAspect = actualWidth / height;
      
      if (imgAspect > containerAspect) {
        const scale = height / photoData.height;
        const visibleWidth = actualWidth / scale;
        const visiblePercent = (visibleWidth / photoData.width) * 100;
        if (visiblePercent < 75) {
          const offset = (photoData.width - actualWidth / scale) / 2;
          img.style.objectPosition = `${(offset / photoData.width) * 100}% 50%`;
        } else {
          img.style.objectPosition = '50% 50%';
        }
      } else {
        const scale = actualWidth / photoData.width;
        const visibleHeight = height / scale;
        const visiblePercent = (visibleHeight / photoData.height) * 100;
        if (visiblePercent < 75) {
          const offset = (photoData.height - height / scale) / 2;
          img.style.objectPosition = `50% ${(offset / photoData.height) * 100}%`;
        } else {
          img.style.objectPosition = '50% 50%';
        }
      }

      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';

      photoTrack.appendChild(photoItem);

      // 更新列高度
      for (let i = 0; i < spanColumns; i++) {
        columnHeights[minColumn + i] = columnHeights[minColumn] + height + 2;
      }

      // 更新总高度
      totalHeight = Math.max(...columnHeights);
      photoIndex++;
    }

    // 设置轨道尺寸（1.5倍大小用于滚动动画）
    photoTrack.style.width = `${wallWidth}px`;
    photoTrack.style.height = `${totalHeight}px`;
    photoTrack.style.position = 'absolute';
    photoTrack.style.display = 'block';
    photoTrack.style.top = '0';
    photoTrack.style.left = '0';
  }

  // 初始计算
  initPhotoData();
  calculatePhotoSizes();

  // 窗口大小改变时重新计算
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(calculatePhotoSizes, 200);
  });
});