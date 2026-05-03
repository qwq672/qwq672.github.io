let searchData = [];

async function getSearchData() {
    if (searchData.length > 0) return searchData;

    try {
        const response = await fetch('/index.json');
        if (response.ok) {
            searchData = await response.json();
            return searchData;
        }
    } catch (e) {
        console.log('index.json 不存在，使用页面内数据');
    }

    searchData = Array.from(document.querySelectorAll('a'))
        .filter(a => a.href && !a.href.includes('javascript') && a.href.startsWith('/'))
        .map(a => ({
            title: a.textContent.trim(),
            url: a.href,
            date: '',
            summary: ''
        }))
        .filter(item => item.title.length > 0 && item.title.length < 100);

    return searchData;
}

function performSearch(query) {
    const results = document.getElementById('searchResults');
    if (!results) return;

    if (!query || query.trim().length === 0) {
        results.innerHTML = '<div class="search-hint">输入关键词搜索文章...</div>';
        return;
    }

    const lowerQuery = query.toLowerCase();
    const data = searchData.filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        (item.summary && item.summary.toLowerCase().includes(lowerQuery))
    );

    if (data.length === 0) {
        results.innerHTML = '<div class="search-result-empty">没有找到相关文章</div>';
        return;
    }

    results.innerHTML = data.slice(0, 10).map(item => `
        <a href="${item.url}" class="search-result-item">
            <div class="search-result-title">${escapeHtml(item.title)}</div>
            ${item.date ? `<div class="search-result-date">${item.date}</div>` : ''}
            ${item.summary ? `<div class="search-result-summary">${escapeHtml(item.summary)}</div>` : ''}
        </a>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function initSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    const searchResults = document.getElementById('searchResults');

    if (!searchToggle || !searchOverlay || !searchInput || !searchClose) return;

    searchToggle.addEventListener('click', async (e) => {
        e.preventDefault();
        searchOverlay.classList.add('active');
        searchInput.value = '';
        searchInput.focus();
        if (searchResults) {
            searchResults.innerHTML = '<div class="search-hint">输入关键词搜索文章...</div>';
        }
        await getSearchData();
        document.body.style.overflow = 'hidden';
    });

    searchClose.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}
