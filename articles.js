/**
 * pages/articles.js — Liste des articles par blog
 */

window.renderArticles = async function () {
  const page = document.getElementById('page-articles');

  page.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Articles</h1>
      <p class="page-subtitle">Tous vos articles Shopify, organisés par blog</p>
    </div>
    <div id="articles-body">
      <div style="display:flex; align-items:center; gap:10px; color:var(--text-muted); font-size:14px;">
        ${UI.spinner()} Chargement des blogs…
      </div>
    </div>
  `;

  if (!Storage.hasShopifyConfig()) {
    document.getElementById('articles-body').innerHTML = `
      <div class="alert-banner info">
        <span>ℹ</span>
        <div>Shopify n'est pas encore configuré. <a href="#" data-page="settings" class="nav-link" style="color:var(--accent); font-weight:500;">Aller aux réglages →</a></div>
      </div>`;
    attachNavLinks();
    return;
  }

  try {
    const blogs = await Shopify.getBlogs();
    Storage.set(Storage.KEYS.BLOGS_CACHE, blogs);

    if (!blogs.length) {
      document.getElementById('articles-body').innerHTML =
        '<div class="empty-state"><div class="empty-state-icon">◎</div><div class="empty-state-text">Aucun blog trouvé</div></div>';
      return;
    }

    renderBlogTabs(blogs);

  } catch (e) {
    document.getElementById('articles-body').innerHTML = `
      <div class="alert-banner warning">
        <span>⚠</span>
        <div>Erreur lors du chargement : <strong>${e.message}</strong></div>
      </div>`;
    UI.setConnectionStatus('error');
  }
};

function renderBlogTabs(blogs) {
  const body = document.getElementById('articles-body');

  const tabsHtml = blogs.map((b, i) =>
    `<button class="blog-tab ${i === 0 ? 'active' : ''}" data-blog-id="${b.id}" data-blog-handle="${b.handle}">
      ${b.title}
    </button>`
  ).join('');

  body.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
      <div class="blog-tabs" id="blog-tabs">${tabsHtml}</div>
      <button class="btn btn-ghost" id="articles-refresh" style="font-size:12.5px;">⟳ Actualiser</button>
    </div>
    <div id="articles-table-wrap">
      <div style="display:flex; align-items:center; gap:10px; color:var(--text-muted); font-size:14px;">
        ${UI.spinner()} Chargement des articles…
      </div>
    </div>
  `;

  // Style des tabs
  injectTabStyles();

  // Charge les articles du premier blog
  loadArticlesForBlog(blogs[0].id);

  // Gestion des tabs
  document.getElementById('blog-tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.blog-tab');
    if (!tab) return;
    document.querySelectorAll('.blog-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    loadArticlesForBlog(tab.dataset.blogId);
  });

  // Actualiser
  document.getElementById('articles-refresh').addEventListener('click', () => {
    const activeTab = document.querySelector('.blog-tab.active');
    if (activeTab) loadArticlesForBlog(activeTab.dataset.blogId);
  });
}

async function loadArticlesForBlog(blogId) {
  const wrap = document.getElementById('articles-table-wrap');
  wrap.innerHTML = `<div style="display:flex; align-items:center; gap:10px; color:var(--text-muted); font-size:14px;">${UI.spinner()} Chargement…</div>`;

  try {
    const articles = await Shopify.getAllArticles(blogId);

    if (!articles.length) {
      wrap.innerHTML = '<div class="empty-state"><div class="empty-state-icon">◎</div><div class="empty-state-text">Aucun article dans ce blog</div></div>';
      return;
    }

    // Trie par date de mise à jour décroissante
    articles.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    wrap.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
        <span style="font-size:13px; color:var(--text-muted);">${articles.length} article${articles.length > 1 ? 's' : ''}</span>
        <input class="input" id="articles-search" type="search" placeholder="Rechercher…"
          style="width:220px; padding:6px 10px; font-size:13px;">
      </div>
      <div class="table-wrap">
        <table id="articles-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Statut</th>
              <th>Mots</th>
              <th>Mis à jour</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="articles-tbody">
            ${articles.map(a => articleRow(a)).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Recherche live
    document.getElementById('articles-search').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('#articles-tbody tr').forEach(row => {
        row.style.display = row.dataset.title.includes(q) ? '' : 'none';
      });
    });

  } catch (e) {
    wrap.innerHTML = `<div class="alert-banner warning"><span>⚠</span><div>${e.message}</div></div>`;
  }
}

function articleRow(a) {
  const words = UI.wordCount(a.body_html || '');
  const wordsColor = words < 800 ? 'color:var(--orange)' : 'color:var(--text-secondary)';

  return `
    <tr data-title="${(a.title || '').toLowerCase()}" data-id="${a.id}">
      <td>
        <div style="font-weight:500; font-size:13.5px;">${UI.truncate(a.title, 70)}</div>
        <div style="font-size:11.5px; color:var(--text-muted); font-family:var(--font-mono); margin-top:2px;">/${a.handle}</div>
      </td>
      <td>${UI.articleStatusBadge(a.published_at)}</td>
      <td><span style="${wordsColor}; font-size:13px;">${words.toLocaleString('fr')}</span></td>
      <td style="font-size:13px; color:var(--text-secondary);">${UI.formatDate(a.updated_at)}</td>
      <td>
        <div style="display:flex; gap:6px;">
          <a href="https://${Storage.get(Storage.KEYS.SHOPIFY_DOMAIN)}/blogs/${a.blog_id ? '' : ''}${a.handle ? `…/${a.handle}` : ''}"
             target="_blank" class="btn btn-ghost" style="padding:4px 10px; font-size:12px;">↗</a>
        </div>
      </td>
    </tr>
  `;
}

function injectTabStyles() {
  if (document.getElementById('blog-tab-styles')) return;
  const style = document.createElement('style');
  style.id = 'blog-tab-styles';
  style.textContent = `
    .blog-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
    .blog-tab {
      padding: 6px 14px;
      border-radius: 6px;
      border: 1px solid var(--border);
      background: var(--bg);
      font-size: 13px;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.12s;
      font-family: var(--font-sans);
    }
    .blog-tab:hover { background: var(--bg-hover); color: var(--text-primary); }
    .blog-tab.active {
      background: var(--accent);
      color: #fff;
      border-color: var(--accent);
      font-weight: 500;
    }
  `;
  document.head.appendChild(style);
}

function attachNavLinks() {
  document.querySelectorAll('.nav-link[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      UI.navigate(el.dataset.page);
    });
  });
}
