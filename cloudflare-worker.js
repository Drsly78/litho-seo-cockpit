/**
 * cloudflare-worker.js — Proxy CORS pour Shopify Admin API
 *
 * DÉPLOIEMENT :
 * 1. Allez sur https://workers.cloudflare.com/
 * 2. Créez un nouveau Worker
 * 3. Collez ce code entier
 * 4. Déployez → copiez l'URL dans les Réglages de l'app (champ "URL du proxy")
 *
 * SÉCURITÉ :
 * Remplacez ALLOWED_ORIGIN par l'URL exacte de votre GitHub Pages
 * Ex : "https://votrenom.github.io"
 */

const ALLOWED_ORIGIN = '*'; // À restreindre en production : "https://votrenom.github.io"

export default {
  async fetch(request, env, ctx) {

    // Gestion CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(request),
      });
    }

    // On n'accepte que les POST
    if (request.method !== 'POST') {
      return jsonError(405, 'Method not allowed');
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonError(400, 'Invalid JSON payload');
    }

    const { domain, token, path, method = 'GET', body } = payload;

    // Validation basique
    if (!domain || !token || !path) {
      return jsonError(400, 'Missing required fields: domain, token, path');
    }

    // Construit l'URL Shopify
    const shopifyUrl = `https://${domain}${path}`;

    // Options de la requête vers Shopify
    const fetchOptions = {
      method,
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json',
      },
    };

    if (body && method !== 'GET') {
      fetchOptions.body = JSON.stringify(body);
    }

    try {
      const shopifyRes = await fetch(shopifyUrl, fetchOptions);
      const data = await shopifyRes.json();

      return new Response(JSON.stringify(data), {
        status: shopifyRes.status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(request),
        },
      });

    } catch (e) {
      return jsonError(502, `Shopify request failed: ${e.message}`);
    }
  },
};

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '*';
  const allowed = ALLOWED_ORIGIN === '*' ? origin : ALLOWED_ORIGIN;
  return {
    'Access-Control-Allow-Origin':  allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
  };
}

function jsonError(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
