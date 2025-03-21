const fs = require('fs');
const path = require('path');

// Fonction principale pour préparer le déploiement GitHub Pages
function prepareGitHubPages() {
  console.log('Préparation des fichiers pour GitHub Pages...');
  
  try {
    // Chemin vers le dossier de build
    const distDir = path.join(__dirname, 'dist');
    
    // 1. Copier gh-pages-index.html vers la racine comme index.html
    fs.copyFileSync(
      path.join(__dirname, 'public', 'gh-pages-index.html'),
      path.join(distDir, 'index.html')
    );
    
    // 2. Copier 404.html dans le dossier dist
    fs.copyFileSync(
      path.join(__dirname, '404.html'),
      path.join(distDir, '404.html')
    );
    
    // 3. S'assurer que .nojekyll existe
    fs.writeFileSync(
      path.join(distDir, '.nojekyll'),
      ''
    );
    
    console.log('✅ Préparation terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la préparation:', error);
  }
}

// Exécuter le script
prepareGitHubPages();
