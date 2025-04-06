import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from './App';
import './index.css';
// Importer les correctifs de compatibilité en dernier pour qu'ils remplacent tous les autres styles
import './styles/vendor-fixes.css';

// Fonction pour réinitialiser la position de défilement
const resetScrollPosition = () => {
  // Forcer le défilement en haut à gauche
  window.scrollTo(0, 0);
  
  // Réinitialiser également toutes les barres de défilement internes
  document.querySelectorAll('.overflow-auto, .overflow-y-auto, .overflow-x-auto, [style*="overflow"]').forEach(el => {
    if (el instanceof HTMLElement) {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    }
  });
  
  // S'assurer que le corps du document est également réinitialisé
  if (document.body) {
    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
  }
  
  // S'assurer que l'élément HTML est également réinitialisé
  if (document.documentElement) {
    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
  }
};

// Fonction pour forcer le dézoom sur mobile
const forceMaximumZoomOut = () => {
  // Appliquer sur tous les appareils pour garantir la cohérence
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    // Appliquer les paramètres de viewport souhaités - ne pas modifier ces valeurs
    viewport.setAttribute('content', 'width=1920, initial-scale=0.25, user-scalable=yes');
    
    // Réinitialiser la position de défilement
    window.scrollTo(0, 0);
    
    // Réappliquer après un court délai pour s'assurer que ça prend effet
    setTimeout(() => {
      // Maintenir les mêmes paramètres
      viewport.setAttribute('content', 'width=1920, initial-scale=0.25, user-scalable=yes');
      
      // Réappliquer la réinitialisation de la position
      resetScrollPosition();
      
      // Appliquer une troisième fois après un délai plus long (pour les appareils plus lents)
      setTimeout(() => {
        viewport.setAttribute('content', 'width=1920, initial-scale=0.25, user-scalable=yes');
        window.scrollTo(0, 0);
      }, 300);
    }, 100);
  }
};

// Ajouter un événement pour réinitialiser la position lors du rafraîchissement
window.addEventListener('beforeunload', () => {
  // Stocker une indication que la page est en cours de rafraîchissement
  sessionStorage.setItem('pageRefreshing', 'true');
});

// Vérifier si la page vient d'être rafraîchie
if (sessionStorage.getItem('pageRefreshing') === 'true') {
  // Réinitialiser la position de défilement
  resetScrollPosition();
  // Forcer le dézoom maximum
  forceMaximumZoomOut();
  // Nettoyer l'indicateur
  sessionStorage.removeItem('pageRefreshing');
}

// Appliquer le dézoom maximum au chargement initial
forceMaximumZoomOut();

// Ajouter un écouteur d'événement pour réinitialiser la position et les paramètres du viewport lors du chargement complet
window.addEventListener('load', () => {
  // Réinitialiser la position de défilement
  resetScrollPosition();
  
  // Forcer le dézoom maximum
  forceMaximumZoomOut();
  
  // Appliquer à nouveau après un court délai
  setTimeout(() => {
    resetScrollPosition();
    window.scrollTo(0, 0);
  }, 500);
});

// Ajouter un écouteur d'événement pour réinitialiser la position lors de la navigation avec l'historique
window.addEventListener('popstate', () => {
  // Réinitialiser la position de défilement
  resetScrollPosition();
  
  // Forcer le dézoom maximum
  forceMaximumZoomOut();
});

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </StrictMode>
);