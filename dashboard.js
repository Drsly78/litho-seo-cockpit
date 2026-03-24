/**
 * pages/dashboard.js — Tableau de bord
 */

window.renderDashboard = async function () {
  const page = document.getElementById('page-dashboard');

  const isConfigured = Storage.hasShopifyConfig();

  page.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Tableau de bord</h1>
      <p class="page-subtitle">${new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
    </div>

    ${!isConfigured ? `
      <div class="alert-banner info" style="margin-bottom:24px;">
        <span>◈</span>
        <div>
          Bienvenue sur <strong>Litho SEO Cockpit</strong>. Pour démarrer, configurez votre connexion Shopify dans les
          <a href="#" data-page="settings" class="nav-link" style="color:var(--accent); font-weight:500;">Réglages →</a>
        </div>
      </div>` : ''}

    <!-- Stats -->
    <div class="stats-grid" id="dashboard-stats">
      <div class="stat-card">
        <div class="stat-value" id="stat-articles">—</div>
        <div class="stat-label">Articles total</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" id="stat-published">—</div>
        <div class="stat-label">Publiés</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" id="stat-blogs">—</div>
        <div class="stat-label">Blogs / pierres</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" id="stat-generated">0</div>
        <div class="stat-label">Générés via cockpit</div>
      </div>
    </div>

    <!-- Connexions API -->
    <div class="card">
      <div class="card-title">Statut des connexions</div>
      <div id="api-status-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:10px;">
        ${apiStatusItem('Shopify', isConfigured ? 'pending' : 'missing')}
        ${apiStatusItem('Anthropic', Storage.get(Storage.KEYS.ANTHROPIC_KEY) ? 'configured' : 'missing')}
        ${apiStatusItem('Google Search Console', 'soon')}
        ${apiStatusItem('DataForSEO', Storage.get(Storage.KEYS.DATAFORSEO_LOGIN) ? 'configured' : 'missing')}
        ${apiStatusItem('Google Analytics 4', 'soon')}
        ${apiStatusItem('Google Sheets', 'soon')}
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="card">
      <div class="card-title">Actions rapides</div>
      <div style="display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="UI.navigate('create')">✦ Créer un article</button>
        <button class="btn btn-secondary" onclick="UI.navigate('articles')">◎ Voir les articles</button>
        <button class="btn btn-secondary" onclick="UI.navigate('cocon')">⬟ Cocon sémantique</button>
      </div>
    </div>

    <!-- Dernières activités -->
    <div class="card">
      <div class="card-title">Activité récente</div>
      <div id="recent-activity">
        ${renderRecentActivity()}
      </div>
    </div>
  `;

  // Attache les liens de navigation
  document.querySelectorAll('.nav-link[data-page]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); UI.navigate(el.dataset.page); });
  });

  // Charge les stats si Shopify est configuré
  if (isConfigured) {
    loadDashboardStats();
  }
};

async function loadDashboardStats() {
  try {
    const blogs = await Shopify.getBlogs();
    Storage.set(Storage.KEYS.BLOGS_CACHE, blogs);
    document.getElementById('stat-blogs').textContent = blogs.length;
    UI.setConnectionStatus('ok');

    let totalArticles = 0;
    let totalPublished = 0;

    // Compte les articles de chaque blog en parallèle
    await Promise.all(blogs.map(async (blog) => {
      try {
        const articles = await Shopify.getAllArticles(blog.id);
        totalArticles += articles.length;
        totalPublished += articles.filter(a => a.published_at).length;
      } catch (_) {}
    }));

    document.getElementById('stat-articles').textContent = totalArticles;
    document.getElementById('stat-published').textContent = totalPublished;

    // Généré via cockpit (historique local)
    const history = Storage.get(Storage.KEYS.HISTORY) || [];
    document.getElementById('stat-generated').textContent = history.length;

    // Met à jour le statut Shopify
    const shopifyStatus = document.querySelector('#api-status-grid .api-item:first-child');
    if (shopifyStatus) {
      shopifyStatus.querySelector('.api-dot').style.background = 'var(--green)';
      shopifyStatus.querySelector('.api-state').textContent = 'Connecté';
      shopifyStatus.querySelector('.api-state').style.color = 'var(--green)';
    }

  } catch (e) {
    UI.setConnectionStatus('error');
    document.getElementById('stat-articles').textContent = '!';
    UI.toast('Impossible de charger les stats Shopify', 'error');
  }
}

function apiStatusItem(name, status) {
  const states = {
    pending:    { dot: 'var(--orange)', label: 'Test…',       color: 'var(--orange)' },
    configured: { dot: 'var(--blue)',   label: 'Configuré',   color: 'var(--blue)' },
    missing:    { dot: 'var(--border)', label: 'Non configuré', color: 'var(--text-muted)' },
    soon:       { dot: 'var(--border)', label: 'À venir',     color: 'var(--text-muted)' },
    ok:         { dot: 'var(--green)',  label: 'Connecté',    color: 'var(--green)' },
  };
  const s = states[status] || states.missing;
  return `
    <div class="api-item" style="display:flex; align-items:center; gap:8px;">
      <span class="api-dot" style="width:8px; height:8px; border-radius:50%; background:${s.dot}; flex-shrink:0;"></span>
      <div>
        <div style="font-size:13px; font-weight:500; color:var(--text-primary);">${name}</div>
        <div class="api-state" style="font-size:11.5px; color:${s.color};">${s.label}</div>
      </div>
    </div>`;
}

function renderRecentActivity() {
  const history = (Storage.get(Storage.KEYS.HISTORY) || []).slice(0, 5);
  if (!history.length) {
    return '<div class="empty-state" style="padding:24px;"><div class="empty-state-icon" style="font-size:20px;">◷</div><div class="empty-state-text">Aucune activité pour l\'instant</div></div>';
  }
  return history.map(h => `
    <div style="display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid var(--border-light);">
      <span style="font-size:11px; color:var(--text-muted); white-space:nowrap;">${UI.formatDate(h.date)}</span>
      <span class="badge ${h.type === 'create' ? 'badge-purple' : 'badge-blue'}">${h.type === 'create' ? 'Créé' : 'Optimisé'}</span>
      <span style="font-size:13.5px;">${UI.truncate(h.title, 60)}</span>
    </div>
  `).join('');
}
