/**
 * app.js — Point d'entrée
 * Initialise la navigation et charge la page de démarrage
 */

document.addEventListener('DOMContentLoaded', () => {

  // Navigation via sidebar
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      UI.navigate(el.dataset.page);
    });
  });

  // Vérifie le statut Shopify au démarrage
  if (Storage.hasShopifyConfig()) {
    UI.setConnectionStatus('unknown');
    // Test silencieux
    Shopify.testConnection()
      .then(() => UI.setConnectionStatus('ok'))
      .catch(() => UI.setConnectionStatus('error'));
  }

  // Page par défaut : dashboard
  UI.navigate('dashboard');
});
