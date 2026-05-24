// 自动为 Markdown 表格包裹 .table-wrapper 以实现圆角
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const articleBody = document.querySelector('.article-body');
    if (!articleBody) return;

    articleBody.querySelectorAll('table').forEach(function(table) {
      if (!table.parentElement.classList.contains('table-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
  });
})();
