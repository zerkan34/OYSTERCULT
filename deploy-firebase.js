const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Construire l'application
console.log('🔨 Construction de l\'application pour Firebase Hosting...');

try {
  // Nettoyer le dossier dist si nécessaire
  if (fs.existsSync('dist')) {
    console.log('Nettoyage du dossier dist...');
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Exécuter la commande de build
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Application construite avec succès !');
  
  // Lire le contenu actuel de index.html généré par Vite
  const distIndexPath = path.join(__dirname, 'dist', 'index.html');
  const indexContent = fs.readFileSync(distIndexPath, 'utf8');
  
  // Extraire les scripts et styles injectés par Vite
  const scriptTags = indexContent.match(/<script[\s\S]*?<\/script>/g) || [];
  const linkTags = indexContent.match(/<link[^>]*>/g) || [];
  
  // Template personnalisé pour index.html
  const customIndexHtml = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="./vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="theme-color" content="#0f172a" />
    <link rel="preload" href="./fonts/TT_Modernoir_Trial_Light.ttf" as="font" type="font/ttf" crossorigin />
    <link rel="preload" href="./fonts/TT_Modernoir_Trial_Regular.ttf" as="font" type="font/ttf" crossorigin />
    <link rel="preload" href="./fonts/TT_Modernoir_Trial_DemiBold.ttf" as="font" type="font/ttf" crossorigin />
    
    <!-- Script pour ajuster les chemins en fonction de l'environnement -->
    <script>
      (function() {
        // Redirige vers l'auth par défaut si nécessaire
        if (!window.location.hash && window.location.pathname === '/') {
          window.location.hash = '/auth';
        }
      })();
    </script>
    
    <style>
      @font-face {
        font-family: 'TT Modernoir';
        src: url('./fonts/TT_Modernoir_Trial_Light.ttf') format('truetype');
        font-weight: 300;
        font-style: normal;
        font-display: block;
      }

      @font-face {
        font-family: 'TT Modernoir';
        src: url('./fonts/TT_Modernoir_Trial_Regular.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
        font-display: block;
      }

      @font-face {
        font-family: 'TT Modernoir';
        src: url('./fonts/TT_Modernoir_Trial_DemiBold.ttf') format('truetype');
        font-weight: 600;
        font-style: normal;
        font-display: block;
      }

      /* Forcer l'application de la police sur les éléments spécifiques */
      .modernoir-text {
        font-family: 'TT Modernoir', sans-serif !important;
      }
    </style>
    
    <title>OysterCult - Gestion Ostréicole</title>
    
    <!-- Les styles injectés par Vite -->
    ${linkTags.join('\n    ').replace(/\/OYSTERCULT\//g, './')}
  </head>
  <body>
    <div id="root"></div>
    
    <!-- Les scripts injectés par Vite -->
    ${scriptTags.join('\n    ').replace(/\/OYSTERCULT\//g, './')}
  </body>
</html>`;

  // Écrire le nouveau fichier index.html
  console.log('Modification du fichier index.html...');
  fs.writeFileSync(distIndexPath, customIndexHtml);
  console.log('✅ Fichier index.html modifié avec succès !');

  // Créer le fichier .nojekyll pour GitHub Pages
  fs.writeFileSync(path.join(__dirname, 'dist', '.nojekyll'), '');
  console.log('✅ Fichier .nojekyll créé avec succès !');

  // Déployer sur Firebase
  console.log('🚀 Déploiement sur Firebase Hosting...');
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
  
  console.log('\n✅ Déploiement terminé avec succès !');
  console.log('\n🌐 Votre application est maintenant disponible sur:');
  console.log(' https://oystercultrocks.web.app');
  console.log(' Si vous rencontrez des problèmes, ouvrez les outils de développement du navigateur (F12) pour vérifier les erreurs.');

} catch (error) {
  console.error('❌ Erreur lors du déploiement:', error);
  process.exit(1);
}
