/**
 * ui.js — Utilitaires interface
 */

const UI = (() => {

  // ---- Toasts ----
  function toast(message, type = 'default', duration = 3500) {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;

    const icons = { success: '✓', error: '✕', info: 'ℹ', default: '◈' };
    el.innerHTML = `<span>${icons[type] || icons.default}</span><span>${message}</span>`;

    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'all 0.2s ease';
      setTimeout(() => el.remove(), 200);
    }, duration);
  }

  // ---- Navigation ----
  function navigate(page) {
    // Désactive tous les items nav
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    // Active le bon
    const navEl = document.querySelector(`[data-page="${page}"]`);
    if (navEl) navEl.classList.add('active');

    // Cache toutes les pages
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    // Affiche la bonne
    const pageEl = document.getElementById(`page-${page}`);
    if (pageEl) pageEl.classList.add('active');

    // Rend la page si elle a un renderer
    const renderers = {
      dashboard: window.renderDashboard,
      articles:  window.renderArticles,
      create:    window.renderCreate,
      optimize:  window.renderOptimize,
      cocon:     window.renderCocon,
      history:   window.renderHistory,
      settings:  window.renderSettings,
    };
    if (renderers[page]) renderers[page]();
  }

  // ---- Statut connexion Shopify ----
  function setConnectionStatus(status) {
    const dot = document.getElementById('connection-status');
    dot.className = 'status-dot';
    if (status === 'ok')    { dot.classList.add('status-ok');    dot.title = 'Shopify connecté'; }
    if (status === 'error') { dot.classList.add('status-error'); dot.title = 'Shopify — erreur de connexion'; }
    if (status === 'unknown') { dot.classList.add('status-unknown'); dot.title = 'Non configuré'; }
  }

  // ---- Crée un spinner inline ----
  function spinner() {
    return '<span class="spinner"></span>';
  }

  // ---- Formate une date ISO en lisible ----
  function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // ---- Tronque un texte ----
  function truncate(str, max = 60) {
    if (!str) return '';
    return str.length > max ? str.slice(0, max) + '…' : str;
  }

  // ---- Badge statut article ----
  function articleStatusBadge(published) {
    return published
      ? '<span class="badge badge-green">Publié</span>'
      : '<span class="badge badge-gray">Brouillon</span>';
  }

  // ---- Extrait le texte brut d'un HTML ----
  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  // ---- Compte les mots d'un HTML ----
  function wordCount(html) {
    const text = stripHtml(html);
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  return {
    toast,
    navigate,
    setConnectionStatus,
    spinner,
    formatDate,
    truncate,
    articleStatusBadge,
    stripHtml,
    wordCount,
  };
})();
