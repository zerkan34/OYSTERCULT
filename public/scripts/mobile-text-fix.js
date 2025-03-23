/**
 * Script pour résoudre les problèmes de texte non wrappé sur mobile
 * Applique la classe force-wrap uniquement aux éléments qui en ont vraiment besoin
 */

// Fonction qui s'exécute quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth <= 768) {
    applyTargetedTextFixes();
  }
  
  // Exécuter également lors du redimensionnement
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
      applyTargetedTextFixes();
    }
  });
});

/**
 * Applique des corrections ciblées uniquement aux éléments problématiques
 * sans affecter les widgets météo et autres éléments structurés
 */
function applyTargetedTextFixes() {
  // Ajouter la classe no-wrap-content aux widgets et éléments qui ne doivent pas être affectés
  const preservedElements = document.querySelectorAll(
    '.weather-widget, .weather-card, .stat-widget, .dashboard-card, .metric-display, ' +
    '.temperature, .forecast, .widget-data, .chart-container, .calendar-event'
  );
  
  preservedElements.forEach(element => {
    element.classList.add('no-wrap-content');
  });
  
  // Liste des sélecteurs d'éléments à vérifier pour les problèmes de texte
  const problemSelectors = [
    '.task-description', 
    '.comment-text', 
    '.long-text',
    '.card-description',
    '.detail-text'
  ];
  
  // Sélectionner uniquement les éléments susceptibles d'avoir des problèmes de texte long
  const textElements = document.querySelectorAll(problemSelectors.join(', '));
  
  textElements.forEach(element => {
    // Ne pas toucher aux éléments qui ont déjà la classe header-title
    // ou qui sont des widgets préservés
    if (element.classList.contains('header-title') || 
        element.classList.contains('no-wrap-content') ||
        isWidgetOrPreservedElement(element)) {
      return;
    }
    
    // Vérifier si le contenu peut causer un problème (mots longs sans espaces)
    const text = element.textContent || '';
    const words = text.split(' ');
    
    // Appliquer seulement si un mot est vraiment trop long ou si l'élément déborde
    if (words.some(word => word.length > 20) || isOverflowing(element)) {
      element.classList.add('force-wrap');
    }
  });
}

/**
 * Vérifie si l'élément est un widget ou descendant d'un widget préservé
 */
function isWidgetOrPreservedElement(element) {
  // Vérifier si l'élément lui-même ou un de ses parents a une classe préservée
  let currentNode = element;
  const preservedClasses = [
    'weather-widget', 'weather-card', 'stat-widget', 'dashboard-card', 
    'metric-display', 'no-wrap-content', 'temperature', 'forecast', 
    'widget-data', 'chart-container', 'calendar-event'
  ];
  
  while (currentNode) {
    if (currentNode.classList) {
      for (const className of preservedClasses) {
        if (currentNode.classList.contains(className)) {
          return true;
        }
      }
    }
    currentNode = currentNode.parentElement;
  }
  
  return false;
}

/**
 * Vérifie si un élément déborde de son conteneur
 */
function isOverflowing(element) {
  // Est-ce que l'élément est plus large que son parent?
  const parent = element.parentElement;
  if (!parent) return false;
  
  return element.scrollWidth > parent.clientWidth;
}
