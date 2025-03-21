const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Chemin vers le dossier dist
const distDir = path.join(__dirname, 'dist');

// Construction du projet
console.log('🏗️ Construction de l\'application...');
try {
  // Utiliser npm run build pour construire l'application
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Application construite avec succès !');
} catch (error) {
  console.error('❌ Erreur lors de la construction:', error);
  process.exit(1);
}

// Modification du fichier index.html généré
console.log('🔧 Adaptation de index.html pour GitHub Pages...');
try {
  // Lire le fichier index.html
  const indexPath = path.join(distDir, 'index.html');
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Modifier les chemins relatifs
  content = content.replace(/assets\//g, 'assets/');
  
  // Ajouter une redirection pour les utilisateurs qui accèdent directement
  content = content.replace('<head>', `<head>
  <base href="/OYSTERCULT/" />
  <script>
    // Vérifier si nous devons rediriger vers la page d'auth
    (function() {
      if (window.location.hash === '') {
        window.location.hash = '#/auth';
      }
    })();
  </script>`);
  
  // Sauvegarder le fichier modifié
  fs.writeFileSync(indexPath, content);
  console.log('✅ index.html modifié avec succès !');
  
  // Copier index.html vers 404.html
  fs.copyFileSync(indexPath, path.join(distDir, '404.html'));
  console.log('✅ 404.html créé');
  
  // Créer le fichier .nojekyll
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
  console.log('✅ .nojekyll créé');
} catch (error) {
  console.error('❌ Erreur lors de la modification des fichiers:', error);
  process.exit(1);
}

// Déploiement sur GitHub Pages
console.log('🚀 Déploiement sur GitHub Pages...');
try {
  execSync('npx gh-pages -d dist', { stdio: 'inherit' });
  console.log('✅ Déploiement terminé avec succès !');
} catch (error) {
  console.error('❌ Erreur lors du déploiement:', error);
  process.exit(1);
}

console.log('\n🎉 Tout est terminé ! Votre application est maintenant disponible sur:');
console.log('📝 https://zerkan34.github.io/OYSTERCULT/');
console.log('🔍 Si vous rencontrez des problèmes, vérifiez la console du navigateur pour des erreurs.');
