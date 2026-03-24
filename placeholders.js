/**
 * pages/create.js — Créer un article (module à venir)
 */
window.renderCreate = function () {
  const page = document.getElementById('page-create');
  page.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Créer un article</h1>
      <p class="page-subtitle">Génération complète via Anthropic + push en brouillon Shopify</p>
    </div>
    <div class="card" style="text-align:center; padding:48px;">
      <div style="font-size:32px; margin-bottom:16px; opacity:0.3;">✦</div>
      <div style="font-weight:500; margin-bottom:8px;">Module en construction</div>
      <p style="color:var(--text-muted); font-size:13.5px; max-width:400px; margin:0 auto;">
        Ce module sera activé dès que la connexion Shopify est validée et les prompts système rédigés.
      </p>
    </div>
  `;
};

/**
 * pages/optimize.js — Optimiser un article existant (module à venir)
 */
window.renderOptimize = function () {
  const page = document.getElementById('page-optimize');
  page.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Optimiser</h1>
      <p class="page-subtitle">Diagnostic et réécriture des articles existants</p>
    </div>
    <div class="card" style="text-align:center; padding:48px;">
      <div style="font-size:32px; margin-bottom:16px; opacity:0.3;">⟳</div>
      <div style="font-weight:500; margin-bottom:8px;">Module en construction</div>
      <p style="color:var(--text-muted); font-size:13.5px; max-width:400px; margin:0 auto;">
        Ce module croise les données GSC/GA4 avec vos articles pour identifier les quick wins.
      </p>
    </div>
  `;
};

/**
 * pages/cocon.js — Cocon sémantique (module à venir)
 */
window.renderCocon = function () {
  const page = document.getElementById('page-cocon');
  page.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Cocon sémantique</h1>
      <p class="page-subtitle">Vue structurée de vos blogs par pierre + export Obsidian</p>
    </div>
    <div class="card" style="text-align:center; padding:48px;">
      <div style="font-size:32px; margin-bottom:16px; opacity:0.3;">⬟</div>
      <div style="font-weight:500; margin-bottom:8px;">Module en construction</div>
      <p style="color:var(--text-muted); font-size:13.5px; max-width:400px; margin:0 auto;">
        Pilier → Articles mères → Satellites. Export automatique vers votre vault Obsidian.
      </p>
    </div>
  `;
};

/**
 * pages/history.js — Historique
 */
window.renderHistory = function () {
  const page = document.getElementById('page-history');
  const history = Storage.get(Storage.KEYS.HISTORY) || [];

  page.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Historique</h1>
      <p class="page-subtitle">${history.length} entrée${history.length > 1 ? 's' : ''} enregistrée${history.length > 1 ? 's' : ''}</p>
    </div>
    ${!history.length
      ? `<div class="empty-state"><div class="empty-state-icon">◷</div><div class="empty-state-text">Aucun article généré ou optimisé pour l'instant</div></div>`
      : `<div class="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Action</th><th>Titre</th><th>Blog</th></tr>
            </thead>
            <tbody>
              ${history.map(h => `
                <tr>
                  <td style="font-size:13px; color:var(--text-muted); white-space:nowrap;">${UI.formatDate(h.date)}</td>
                  <td><span class="badge ${h.type === 'create' ? 'badge-purple' : 'badge-blue'}">${h.type === 'create' ? 'Créé' : 'Optimisé'}</span></td>
                  <td>${UI.truncate(h.title, 70)}</td>
                  <td style="font-size:13px; color:var(--text-muted);">${h.blog || '—'}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`
    }
  `;
};
