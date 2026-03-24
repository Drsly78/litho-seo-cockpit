/**
 * storage.js — Gestion centralisée du localStorage
 * Toutes les clés sont préfixées "litho_"
 */

const Storage = (() => {
  const PREFIX = 'litho_';

  const KEYS = {
    SHOPIFY_DOMAIN:   'shopify_domain',
    SHOPIFY_TOKEN:    'shopify_token',
    PROXY_URL:        'proxy_url',
    ANTHROPIC_KEY:    'anthropic_key',
    GSC_TOKEN:        'gsc_token',
    GA4_TOKEN:        'ga4_token',
    DATAFORSEO_LOGIN: 'dataforseo_login',
    DATAFORSEO_PASS:  'dataforseo_pass',
    SHEETS_ID:        'sheets_id',
    OBSIDIAN_PORT:    'obsidian_port',
    // Paramètres éditoriaux
    EDITORIAL_TONE:   'editorial_tone',
    INTERNAL_LINKS:   'internal_links_rules',
    COMPETITORS:      'competitors',
    // Cache
    BLOGS_CACHE:      'blogs_cache',
    ARTICLES_CACHE:   'articles_cache',
    HISTORY:          'history',
  };

  function get(key) {
    try {
      const val = localStorage.getItem(PREFIX + key);
      if (val === null) return null;
      // Tente un parse JSON, sinon retourne la string brute
      try { return JSON.parse(val); } catch { return val; }
    } catch (e) {
      console.error('Storage.get error:', e);
      return null;
    }
  }

  function set(key, value) {
    try {
      const val = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(PREFIX + key, val);
      return true;
    } catch (e) {
      console.error('Storage.set error:', e);
      return false;
    }
  }

  function remove(key) {
    localStorage.removeItem(PREFIX + key);
  }

  function clear() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(PREFIX + k));
  }

  // Vérifie si les clés Shopify essentielles sont renseignées
  function hasShopifyConfig() {
    return !!(get(KEYS.SHOPIFY_DOMAIN) && get(KEYS.SHOPIFY_TOKEN) && get(KEYS.PROXY_URL));
  }

  // Ajoute une entrée à l'historique
  function addHistory(entry) {
    const history = get(KEYS.HISTORY) || [];
    history.unshift({
      ...entry,
      id: Date.now(),
      date: new Date().toISOString(),
    });
    // Garde les 200 dernières entrées
    set(KEYS.HISTORY, history.slice(0, 200));
  }

  return { get, set, remove, clear, hasShopifyConfig, addHistory, KEYS };
})();
