/**
 * pages/settings.js — Page Réglages
 */

window.renderSettings = function () {
  const page = document.getElementById('page-settings');

  page.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Réglages</h1>
      <p class="page-subtitle">Clés API et paramètres éditoriaux — stockés localement dans votre navigateur</p>
    </div>

    <div class="alert-banner warning">
      <span>⚠</span>
      <div>Les clés API sont stockées dans le <strong>localStorage</strong> de votre navigateur. N'utilisez cet outil que sur un appareil personnel et sécurisé.</div>
    </div>

    <!-- SHOPIFY -->
    <div class="card">
      <div class="card-title">Shopify</div>

      <div class="form-group">
        <label class="form-label">Domaine Shopify</label>
        <input class="input" id="s-shopify-domain" type="text"
          placeholder="monstore.myshopify.com"
          value="${Storage.get(Storage.KEYS.SHOPIFY_DOMAIN) || ''}">
        <div class="form-hint">Sans https://</div>
      </div>

      <div class="form-group">
        <label class="form-label">Token Admin API (Custom App)</label>
        <input class="input input-password" id="s-shopify-token" type="password"
          placeholder="shpat_xxxxxxxxxxxx"
          value="${Storage.get(Storage.KEYS.SHOPIFY_TOKEN) || ''}">
        <div class="form-hint">Applications → Développer des apps → Créer une app → Admin API access token</div>
      </div>

      <div class="form-group">
        <label class="form-label">URL du proxy Cloudflare Worker</label>
        <input class="input" id="s-proxy-url" type="text"
          placeholder="https://litho-proxy.moncompte.workers.dev"
          value="${Storage.get(Storage.KEYS.PROXY_URL) || ''}">
        <div class="form-hint">Voir le fichier <code>cloudflare-worker.js</code> fourni avec l'app</div>
      </div>

      <div style="display:flex; gap:10px; align-items:center;">
        <button class="btn btn-primary" id="s-shopify-save">Enregistrer</button>
        <button class="btn btn-ghost" id="s-shopify-test">Tester la connexion</button>
        <span id="s-shopify-result" style="font-size:13px; color: var(--text-muted);"></span>
      </div>
    </div>

    <!-- ANTHROPIC -->
    <div class="card">
      <div class="card-title">Anthropic</div>
      <div class="form-group">
        <label class="form-label">Clé API Anthropic</label>
        <input class="input input-password" id="s-anthropic-key" type="password"
          placeholder="sk-ant-xxxxxxxxxxxx"
          value="${Storage.get(Storage.KEYS.ANTHROPIC_KEY) || ''}">
      </div>
      <button class="btn btn-primary" id="s-anthropic-save">Enregistrer</button>
    </div>

    <!-- DATAFORSEO -->
    <div class="card">
      <div class="card-title">DataForSEO</div>
      <div class="form-group">
        <label class="form-label">Login</label>
        <input class="input" id="s-dfs-login" type="text"
          placeholder="email@exemple.com"
          value="${Storage.get(Storage.KEYS.DATAFORSEO_LOGIN) || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Mot de passe API</label>
        <input class="input input-password" id="s-dfs-pass" type="password"
          placeholder="••••••••"
          value="${Storage.get(Storage.KEYS.DATAFORSEO_PASS) || ''}">
      </div>
      <button class="btn btn-primary" id="s-dfs-save">Enregistrer</button>
    </div>

    <!-- GOOGLE -->
    <div class="card">
      <div class="card-title">Google (GSC & GA4) <span class="badge badge-orange" style="margin-left:8px;">OAuth2 — à venir</span></div>
      <p style="font-size:13.5px; color: var(--text-muted); margin-bottom: 16px;">
        La connexion OAuth2 Google Search Console et GA4 sera activée dans une prochaine version.
      </p>
    </div>

    <!-- GOOGLE SHEETS -->
    <div class="card">
      <div class="card-title">Google Sheets <span class="badge badge-orange" style="margin-left:8px;">À venir</span></div>
      <div class="form-group">
        <label class="form-label">ID du Google Sheet de suivi</label>
        <input class="input" id="s-sheets-id" type="text"
          placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
          value="${Storage.get(Storage.KEYS.SHEETS_ID) || ''}">
      </div>
      <button class="btn btn-primary" id="s-sheets-save">Enregistrer</button>
    </div>

    <!-- OBSIDIAN -->
    <div class="card">
      <div class="card-title">Obsidian (API locale)</div>
      <div class="form-group">
        <label class="form-label">Port de l'API locale Obsidian</label>
        <input class="input" id="s-obsidian-port" type="number"
          placeholder="27123"
          value="${Storage.get(Storage.KEYS.OBSIDIAN_PORT) || '27123'}">
        <div class="form-hint">Plugin requis : Local REST API. Note : fonctionne uniquement en exécution locale.</div>
      </div>
      <button class="btn btn-primary" id="s-obsidian-save">Enregistrer</button>
    </div>

    <div class="divider"></div>

    <!-- PARAMÈTRES ÉDITORIAUX -->
    <div class="page-header" style="margin-bottom:16px;">
      <h2 class="page-title" style="font-size:17px;">Paramètres éditoriaux</h2>
      <p class="page-subtitle">Ces directives seront injectées dans chaque prompt de rédaction</p>
    </div>

    <div class="card">
      <div class="card-title">Ton éditorial</div>
      <div class="form-group">
        <textarea class="input" id="s-tone" rows="3"
          placeholder="Ex : Ton bienveillant et pédagogique, vocabulaire accessible, vouvoiement, phrases courtes..."
          style="resize:vertical;">${Storage.get(Storage.KEYS.EDITORIAL_TONE) || ''}</textarea>
      </div>

      <div class="card-title" style="margin-top:16px;">Règles de maillage interne</div>
      <div class="form-group">
        <textarea class="input" id="s-links" rows="3"
          placeholder="Ex : 1 lien vers la page mère, 1 vers l'article précédent du cocon, 1 vers un produit, 1 vers une collection. Pas plus de 4 liens internes par article."
          style="resize:vertical;">${Storage.get(Storage.KEYS.INTERNAL_LINKS) || ''}</textarea>
      </div>

      <div class="card-title" style="margin-top:16px;">Concurrents principaux</div>
      <div class="form-group">
        <input class="input" id="s-competitors" type="text"
          placeholder="concurrent1.fr, concurrent2.fr, concurrent3.fr"
          value="${Storage.get(Storage.KEYS.COMPETITORS) || ''}">
      </div>

      <button class="btn btn-primary" id="s-editorial-save">Enregistrer les paramètres éditoriaux</button>
    </div>

    <div class="divider"></div>

    <div style="display:flex; gap:10px;">
      <button class="btn btn-ghost" id="s-export-config" style="color:var(--text-secondary);">
        ↓ Exporter la config
      </button>
      <button class="btn btn-ghost" id="s-import-config" style="color:var(--text-secondary);">
        ↑ Importer une config
      </button>
      <input type="file" id="s-import-file" accept=".json" style="display:none;">
    </div>
  `;

  // ---- Sauvegarde Shopify ----
  document.getElementById('s-shopify-save').addEventListener('click', () => {
    Storage.set(Storage.KEYS.SHOPIFY_DOMAIN, document.getElementById('s-shopify-domain').value.trim());
    Storage.set(Storage.KEYS.SHOPIFY_TOKEN,  document.getElementById('s-shopify-token').value.trim());
    Storage.set(Storage.KEYS.PROXY_URL,      document.getElementById('s-proxy-url').value.trim());
    UI.toast('Configuration Shopify enregistrée', 'success');
  });

  // ---- Test connexion Shopify ----
  document.getElementById('s-shopify-test').addEventListener('click', async () => {
    const result = document.getElementById('s-shopify-result');
    const btn = document.getElementById('s-shopify-test');
    btn.disabled = true;
    result.innerHTML = UI.spinner() + ' Test en cours…';

    try {
      const shop = await Shopify.testConnection();
      result.innerHTML = `<span style="color:var(--green);">✓ Connecté — ${shop.name}</span>`;
      UI.setConnectionStatus('ok');
      UI.toast(`Connecté à ${shop.name}`, 'success');
    } catch (e) {
      result.innerHTML = `<span style="color:var(--red);">✕ ${e.message}</span>`;
      UI.setConnectionStatus('error');
      UI.toast('Erreur de connexion Shopify', 'error');
    } finally {
      btn.disabled = false;
    }
  });

  // ---- Sauvegarde Anthropic ----
  document.getElementById('s-anthropic-save').addEventListener('click', () => {
    Storage.set(Storage.KEYS.ANTHROPIC_KEY, document.getElementById('s-anthropic-key').value.trim());
    UI.toast('Clé Anthropic enregistrée', 'success');
  });

  // ---- Sauvegarde DataForSEO ----
  document.getElementById('s-dfs-save').addEventListener('click', () => {
    Storage.set(Storage.KEYS.DATAFORSEO_LOGIN, document.getElementById('s-dfs-login').value.trim());
    Storage.set(Storage.KEYS.DATAFORSEO_PASS,  document.getElementById('s-dfs-pass').value.trim());
    UI.toast('DataForSEO enregistré', 'success');
  });

  // ---- Sauvegarde Sheets ----
  document.getElementById('s-sheets-save').addEventListener('click', () => {
    Storage.set(Storage.KEYS.SHEETS_ID, document.getElementById('s-sheets-id').value.trim());
    UI.toast('Google Sheets enregistré', 'success');
  });

  // ---- Sauvegarde Obsidian ----
  document.getElementById('s-obsidian-save').addEventListener('click', () => {
    Storage.set(Storage.KEYS.OBSIDIAN_PORT, document.getElementById('s-obsidian-port').value.trim());
    UI.toast('Port Obsidian enregistré', 'success');
  });

  // ---- Sauvegarde éditorial ----
  document.getElementById('s-editorial-save').addEventListener('click', () => {
    Storage.set(Storage.KEYS.EDITORIAL_TONE,   document.getElementById('s-tone').value.trim());
    Storage.set(Storage.KEYS.INTERNAL_LINKS,   document.getElementById('s-links').value.trim());
    Storage.set(Storage.KEYS.COMPETITORS,      document.getElementById('s-competitors').value.trim());
    UI.toast('Paramètres éditoriaux enregistrés', 'success');
  });

  // ---- Export config ----
  document.getElementById('s-export-config').addEventListener('click', () => {
    const config = {};
    Object.entries(Storage.KEYS).forEach(([k, v]) => {
      // On n'exporte pas les caches ni l'historique
      if (!['BLOGS_CACHE','ARTICLES_CACHE','HISTORY'].includes(k)) {
        config[v] = Storage.get(v);
      }
    });
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'litho-seo-config.json';
    a.click();
    URL.revokeObjectURL(url);
    UI.toast('Config exportée', 'success');
  });

  // ---- Import config ----
  document.getElementById('s-import-config').addEventListener('click', () => {
    document.getElementById('s-import-file').click();
  });

  document.getElementById('s-import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const config = JSON.parse(ev.target.result);
        Object.entries(config).forEach(([k, v]) => { if (v !== null) Storage.set(k, v); });
        UI.toast('Config importée — rechargez la page', 'success');
        setTimeout(() => window.renderSettings(), 500);
      } catch {
        UI.toast('Fichier invalide', 'error');
      }
    };
    reader.readAsText(file);
  });
};
