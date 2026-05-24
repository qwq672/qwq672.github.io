document.addEventListener('DOMContentLoaded', function() {
  const photoWall = document.querySelector('.photo-wall');
  const photoTrack = document.querySelector('.photo-track');
  if (!photoWall || !photoTrack) return;

  let originalPhotoData = [];
  let isInitialized = false;

  function initPhotoData() {
    const originalPhotos = document.querySelectorAll('.photo-item-original');
    if (originalPhotos.length === 0) return false;

    originalPhotoData = Array.from(originalPhotos).map(photo => {
      const img = photo.querySelector('img');
      return {
        src: img.src,
        width: img.naturalWidth || 1920,
        height: img.naturalHeight || 1080
      };
    });

    return originalPhotoData.length > 0;
  }

  function shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function calculatePhotoSizes() {
    if (!isInitialized) {
      isInitialized = initPhotoData();
    }
    
    if (!isInitialized || originalPhotoData.length === 0) return;

    const wallWidth = photoWall.offsetWidth;
    const wallHeight = photoWall.offsetHeight;

    if (wallWidth === 0 || wallHeight === 0) return;

    while (photoTrack.firstChild) {
      photoTrack.removeChild(photoTrack.firstChild);
    }

    // 增大图片：桌面端1/8屏幕，移动端1/4屏幕
    const isMobile = wallWidth < 768;
    const minSize = Math.floor(wallWidth / (isMobile ? 4 : 8));

    // 计算列数
    const columns = Math.ceil(wallWidth / minSize);

    // 每列精确宽度，最后一列补齐剩余空间
    const colWidths = [];
    let remainingWidth = wallWidth;
    for (let i = 0; i < columns; i++) {
      if (i === columns - 1) {
        colWidths.push(remainingWidth);
      } else {
        const width = Math.floor(wallWidth / columns);
        colWidths.push(width);
        remainingWidth -= width;
      }
    }

    // 每列高度追踪
    const columnHeights = new Array(columns).fill(0);

    // 打散图片顺序
    const shuffledPhotos = shuffleArray(originalPhotoData);

    let photoIndex = 0;

    // 填充到可视区域高度
    while (Math.min(...columnHeights) < wallHeight * 1.2) {
      const photoData = shuffledPhotos[photoIndex % shuffledPhotos.length];
      const aspectRatio = photoData.width / photoData.height;

      // 找最低列
      let shortestCol = 0;
      let minHeight = columnHeights[0];
      for (let i = 1; i < columns; i++) {
        if (columnHeights[i] < minHeight) {
          minHeight = columnHeights[i];
          shortestCol = i;
        }
      }

      const photoWidth = colWidths[shortestCol];
      const photoHeight = Math.round(photoWidth / aspectRatio);

      const img = document.createElement('img');
      img.src = photoData.src;
      img.alt = '照片';

      const photoItem = document.createElement('div');
      photoItem.className = 'photo-item';
      photoItem.appendChild(img);

      // 计算left位置
      let leftPos = 0;
      for (let i = 0; i < shortestCol; i++) {
        leftPos += colWidths[i];
      }

      // 精确整数定位
      photoItem.style.width = `${photoWidth}px`;
      photoItem.style.height = `${photoHeight}px`;
      photoItem.style.position = 'absolute';
      photoItem.style.left = `${leftPos}px`;
      photoItem.style.top = `${minHeight}px`;
      photoItem.style.transform = 'none';

      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.objectPosition = 'center';
      img.style.display = 'block';

      photoTrack.appendChild(photoItem);

      // 更新该列高度
      columnHeights[shortestCol] = minHeight + photoHeight;

      photoIndex++;
    }

    const maxH = Math.max(...columnHeights);
    photoTrack.style.width = `${wallWidth}px`;
    photoTrack.style.height = `${maxH}px`;
    photoTrack.style.position = 'absolute';
  }

  function waitForImages() {
    const originalPhotos = document.querySelectorAll('.photo-item-original img');
    if (originalPhotos.length === 0) {
      isInitialized = initPhotoData();
      calculatePhotoSizes();
      return;
    }

    let loadedCount = 0;
    const totalCount = originalPhotos.length;

    function onImageLoaded() {
      loadedCount++;
      if (loadedCount === totalCount) {
        isInitialized = initPhotoData();
        calculatePhotoSizes();
      }
    }

    originalPhotos.forEach(img => {
      if (img.complete) {
        onImageLoaded();
      } else {
        img.addEventListener('load', onImageLoaded);
        img.addEventListener('error', onImageLoaded);
      }
    });
  }

  waitForImages();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(calculatePhotoSizes, 200);
  });
});