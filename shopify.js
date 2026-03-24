/**
 * shopify.js — Client Shopify Admin API
 * Passe par un proxy Cloudflare Worker pour contourner CORS
 *
 * Proxy attendu : reçoit POST avec { domain, token, path, method, body }
 *                 retourne la réponse JSON de Shopify
 */

const Shopify = (() => {

  // ---- Requête de base via proxy ----
  async function request(path, method = 'GET', body = null) {
    const proxyUrl  = Storage.get(Storage.KEYS.PROXY_URL);
    const domain    = Storage.get(Storage.KEYS.SHOPIFY_DOMAIN);
    const token     = Storage.get(Storage.KEYS.SHOPIFY_TOKEN);

    if (!proxyUrl || !domain || !token) {
      throw new Error('Configuration Shopify incomplète. Vérifiez les réglages.');
    }

    const payload = { domain, token, path, method };
    if (body) payload.body = body;

    const res = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Proxy error ${res.status}: ${errText}`);
    }

    return res.json();
  }

  // ---- Test de connexion ----
  async function testConnection() {
    const data = await request('/admin/api/2024-01/shop.json');
    return data.shop;
  }

  // ---- Récupère tous les blogs ----
  async function getBlogs() {
    const data = await request('/admin/api/2024-01/blogs.json');
    return data.blogs || [];
  }

  // ---- Récupère les articles d'un blog (pagination) ----
  async function getArticles(blogId, page = 1, limit = 50) {
    const data = await request(
      `/admin/api/2024-01/blogs/${blogId}/articles.json?limit=${limit}&page=${page}`
    );
    return data.articles || [];
  }

  // ---- Récupère TOUS les articles d'un blog (toutes pages) ----
  async function getAllArticles(blogId) {
    let all = [];
    let page = 1;
    let batch;
    do {
      batch = await getArticles(blogId, page, 50);
      all = all.concat(batch);
      page++;
    } while (batch.length === 50);
    return all;
  }

  // ---- Récupère un article par ID ----
  async function getArticle(blogId, articleId) {
    const data = await request(
      `/admin/api/2024-01/blogs/${blogId}/articles/${articleId}.json`
    );
    return data.article;
  }

  // ---- Compte les articles d'un blog ----
  async function countArticles(blogId) {
    const data = await request(
      `/admin/api/2024-01/blogs/${blogId}/articles/count.json`
    );
    return data.count || 0;
  }

  // ---- Crée un article en brouillon ----
  async function createArticle(blogId, articleData) {
    const payload = {
      article: {
        title:            articleData.title,
        body_html:        articleData.body_html,
        author:           articleData.author || 'Litho SEO Cockpit',
        tags:             articleData.tags || '',
        published:        false,   // toujours en brouillon
        metafields: articleData.meta_description ? [
          {
            key:       'description_tag',
            value:     articleData.meta_description,
            type:      'single_line_text_field',
            namespace: 'global',
          }
        ] : [],
      }
    };

    const data = await request(
      `/admin/api/2024-01/blogs/${blogId}/articles.json`,
      'POST',
      payload
    );
    return data.article;
  }

  // ---- Met à jour un article existant (en brouillon) ----
  async function updateArticle(blogId, articleId, articleData) {
    const payload = { article: { id: articleId, ...articleData, published: false } };
    const data = await request(
      `/admin/api/2024-01/blogs/${blogId}/articles/${articleId}.json`,
      'PUT',
      payload
    );
    return data.article;
  }

  // ---- Récupère les métafields d'un article ----
  async function getArticleMetafields(articleId) {
    const data = await request(
      `/admin/api/2024-01/articles/${articleId}/metafields.json`
    );
    return data.metafields || [];
  }

  // ---- Récupère les produits (pour le maillage) ----
  async function getProducts(limit = 50) {
    const data = await request(
      `/admin/api/2024-01/products.json?limit=${limit}&fields=id,title,handle`
    );
    return data.products || [];
  }

  // ---- Récupère les collections ----
  async function getCollections(limit = 50) {
    const data = await request(
      `/admin/api/2024-01/custom_collections.json?limit=${limit}&fields=id,title,handle`
    );
    return data.custom_collections || [];
  }

  return {
    testConnection,
    getBlogs,
    getArticles,
    getAllArticles,
    getArticle,
    countArticles,
    createArticle,
    updateArticle,
    getArticleMetafields,
    getProducts,
    getCollections,
  };
})();
