(function() {
  // 收集所有文章的标签数据
  const tagData = {};
  const articles = document.querySelectorAll('.post-card[data-tags]');

  articles.forEach(article => {
    const tags = article.getAttribute('data-tags').split(',').filter(t => t.trim());
    tags.forEach(tag => {
      if (!tagData[tag]) {
        tagData[tag] = [];
      }
      tagData[tag].push(article);
    });
  });

  // 生成标签列表
  const tagFilter = document.getElementById('tagFilter');
  if (!tagFilter) return;

  const allTags = Object.keys(tagData);

  if (allTags.length === 0) {
    tagFilter.style.display = 'none';
    return;
  }

  // 添加"全部"标签
  const allButton = document.createElement('button');
  allButton.className = 'tag active';
  allButton.textContent = '全部';
  allButton.dataset.tag = 'all';
  tagFilter.appendChild(allButton);

  // 添加各个标签
  allTags.forEach(tag => {
    const button = document.createElement('button');
    button.className = 'tag';
    button.textContent = tag;
    button.dataset.tag = tag;
    tagFilter.appendChild(button);
  });

  // 标签点击事件
  tagFilter.addEventListener('click', (e) => {
    if (e.target.classList.contains('tag')) {
      // 更新 active 状态
      tagFilter.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');

      const selectedTag = e.target.dataset.tag;

      // 过滤文章
      articles.forEach(article => {
        if (selectedTag === 'all') {
          article.style.display = '';
        } else {
          const articleTags = article.getAttribute('data-tags').split(',').map(t => t.trim());
          if (articleTags.includes(selectedTag)) {
            article.style.display = '';
          } else {
            article.style.display = 'none';
          }
        }
      });
    }
  });
})();
