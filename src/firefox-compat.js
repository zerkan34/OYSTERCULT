// Script de compatibilité pour Firefox
// Supprime les balises meta theme-color qui causent des avertissements

(function() {
  // Détecte si le navigateur est Firefox
  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  
  if (isFirefox) {
    // Supprime toutes les balises meta theme-color existantes
    const themeColorMetas = document.querySelectorAll('meta[name="theme-color"]');
    themeColorMetas.forEach(meta => meta.remove());
    
    // Observe le <head> pour supprimer toute balise meta theme-color ajoutée dynamiquement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'META' && node.getAttribute('name') === 'theme-color') {
              node.remove();
            }
          });
        }
      });
    });
    
    // Commence l'observation du <head>
    observer.observe(document.head, { childList: true, subtree: true });
  }
})();
