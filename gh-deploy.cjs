const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script de déploiement pour GitHub Pages
 * Ce script effectue les étapes suivantes :
 * 1. Construction de l'application
 * 2. Préparation des fichiers pour GitHub Pages
 * 3. Déploiement avec gh-pages
 */

// Chemin vers le dossier de build
const distDir = path.join(__dirname, 'dist');

// 1. Construire l'application
console.log('🏗️ Construction de l\'application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Application construite avec succès !');
} catch (error) {
  console.error('❌ Erreur lors de la construction:', error);
  process.exit(1);
}

// 2. Préparer les fichiers pour GitHub Pages
console.log('🔧 Préparation des fichiers pour GitHub Pages...');
try {
  // 2.1 Remplacer index.html par notre version spéciale
  fs.copyFileSync(
    path.join(__dirname, 'dist-index.html'),
    path.join(distDir, 'index.html')
  );
  console.log('✅ index.html remplacé');
  
  // 2.2 Copier index.html vers 404.html
  fs.copyFileSync(
    path.join(distDir, 'index.html'),
    path.join(distDir, '404.html')
  );
  console.log('✅ 404.html créé');
  
  // 2.3 Créer .nojekyll
  fs.writeFileSync(
    path.join(distDir, '.nojekyll'),
    ''
  );
  console.log('✅ .nojekyll créé');
  
  console.log('✅ Préparation terminée avec succès !');
} catch (error) {
  console.error('❌ Erreur lors de la préparation:', error);
  process.exit(1);
}

// 3. Déployer avec gh-pages
console.log('🚀 Déploiement vers GitHub Pages...');
try {
  execSync('npx gh-pages -d dist', { stdio: 'inherit' });
  console.log('✅ Déploiement terminé avec succès !');
} catch (error) {
  console.error('❌ Erreur lors du déploiement:', error);
  process.exit(1);
}

console.log('🎉 Tout est terminé ! Votre application est maintenant disponible sur GitHub Pages.');
console.log('📑 URL: https://zerkan34.github.io/OYSTERCULT/');
