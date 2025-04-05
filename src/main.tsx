import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from './App';
import './index.css';
// Importer les correctifs de compatibilité en dernier pour qu'ils remplacent tous les autres styles
import './styles/vendor-fixes.css';

// Fonction pour réinitialiser la position de défilement
const resetScrollPosition = () => {
  window.scrollTo(0, 0);
  
  // Réinitialiser également toutes les barres de défilement internes
  document.querySelectorAll('.overflow-auto, .overflow-y-auto, .overflow-x-auto, [style*="overflow"]').forEach(el => {
    if (el instanceof HTMLElement) {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    }
  });
};

// Fonction pour forcer le dézoom sur mobile
const forceMaximumZoomOut = () => {
  // Vérifier si c'est un appareil mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Forcer le dézoom en définissant une largeur de viewport fixe
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=1920, initial-scale=0.1, maximum-scale=1.0, user-scalable=no');
      
      // Réappliquer après un court délai pour s'assurer que ça prend effet
      setTimeout(() => {
        viewport.setAttribute('content', 'width=1920, initial-scale=0.1, maximum-scale=1.0, user-scalable=no');
      }, 300);
    }
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