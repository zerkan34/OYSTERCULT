const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// Fonction pour générer un hash pour le cache busting
function generateCacheBustingHash() {
  return crypto.randomBytes(4).toString('hex');
}

// Construire l'application
console.log('🔨 Construction de l\'application pour GitHub Pages...');

try {
  // Nettoyer le dossier dist si nécessaire
  if (fs.existsSync('dist')) {
    console.log('Nettoyage du dossier dist...');
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // Générer un hash pour le cache busting
  const cacheBustHash = generateCacheBustingHash();
  console.log(`Utilisation du hash ${cacheBustHash} pour le cache busting`);

  // S'assurer que la variable d'environnement n'est pas définie pour GitHub Pages
  delete process.env.DEPLOY_TARGET;
  console.log('Configuration de la base URL pour GitHub Pages (/OYSTERCULT/)');

  // Exécuter la commande de build
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Application construite avec succès !');
  
  // Lire le contenu actuel de index.html généré par Vite
  const distIndexPath = path.join(__dirname, 'dist', 'index.html');
  const indexContent = fs.readFileSync(distIndexPath, 'utf8');
  
  // Extraire les scripts et styles injectés par Vite
  const scriptTags = indexContent.match(/<script[\s\S]*?<\/script>/g) || [];
  const linkTags = indexContent.match(/<link[^>]*>/g) || [];
  
  // Ajouter le hash aux chemins des ressources pour le cache busting
  const cacheBustedScriptTags = scriptTags.map(tag => {
    return tag.replace(/src="([^"]+)"/g, (match, src) => {
      if (src.includes('?')) {
        return `src="${src}&v=${cacheBustHash}"`;
      } else {
        return `src="${src}?v=${cacheBustHash}"`;
      }
    });
  });
  
  const cacheBustedLinkTags = linkTags.map(tag => {
    return tag.replace(/href="([^"]+)"/g, (match, href) => {
      if (href.includes('?')) {
        return `href="${href}&v=${cacheBustHash}"`;
      } else {
        return `href="${href}?v=${cacheBustHash}"`;
      }
    });
  });
  
  // Template personnalisé pour index.html
  const customIndexHtml = `<!doctype html>
<html lang="fr">
  <head>
    <base href="/OYSTERCULT/" />
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/OYSTERCULT/vite.svg?v=${cacheBustHash}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
    <meta name="color-scheme" content="dark light" />
    <link rel="preload" href="/OYSTERCULT/fonts/TT_Modernoir_Trial_Light.ttf?v=${cacheBustHash}" as="font" type="font/ttf" crossorigin />
    <link rel="preload" href="/OYSTERCULT/fonts/TT_Modernoir_Trial_Regular.ttf?v=${cacheBustHash}" as="font" type="font/ttf" crossorigin />
    <link rel="preload" href="/OYSTERCULT/fonts/TT_Modernoir_Trial_DemiBold.ttf?v=${cacheBustHash}" as="font" type="font/ttf" crossorigin />
    
    <!-- Script pour rediriger vers l'auth si nécessaire -->
    <script>
      (function() {
        // Redirige vers l'auth par défaut si nécessaire
        if (!window.location.hash && window.location.pathname === '/OYSTERCULT/') {
          window.location.hash = '/auth';
        }
      })();
    </script>
    
    <!-- Script de correction des textes sur mobile -->
    <script src="/OYSTERCULT/scripts/mobile-text-fix.js?v=${cacheBustHash}"></script>
    
    <style>
      @font-face {
        font-family: 'TT Modernoir';
        src: url('/OYSTERCULT/fonts/TT_Modernoir_Trial_Light.ttf?v=${cacheBustHash}') format('truetype');
        font-weight: 300;
        font-style: normal;
        font-display: block;
      }

      @font-face {
        font-family: 'TT Modernoir';
        src: url('/OYSTERCULT/fonts/TT_Modernoir_Trial_Regular.ttf?v=${cacheBustHash}') format('truetype');
        font-weight: 400;
        font-style: normal;
        font-display: block;
      }

      @font-face {
        font-family: 'TT Modernoir';
        src: url('/OYSTERCULT/fonts/TT_Modernoir_Trial_DemiBold.ttf?v=${cacheBustHash}') format('truetype');
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
    ${cacheBustedLinkTags.join('\n    ')}
  </head>
  <body>
    <div id="root"></div>
    
    <!-- Les scripts injectés par Vite -->
    ${cacheBustedScriptTags.join('\n    ')}
  </body>
</html>`;

  // Écrire le nouveau fichier index.html
  console.log('Modification du fichier index.html...');
  fs.writeFileSync(distIndexPath, customIndexHtml);
  console.log('✅ Fichier index.html modifié avec succès !');

  // Créer le fichier 404.html pour GitHub Pages (redirection vers index.html)
  const html404 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>OysterCult - Redirection</title>
    <script>
      // Redirection simple vers la page principale
      sessionStorage.redirect = location.href;
      window.location.href = "/OYSTERCULT/";
    </script>
  </head>
  <body>
    <h1>Redirection...</h1>
    <p>Si vous n'êtes pas redirigé automatiquement, <a href="/OYSTERCULT/">cliquez ici</a>.</p>
  </body>
</html>`;

  fs.writeFileSync(path.join(__dirname, 'dist', '404.html'), html404);
  console.log('✅ Fichier 404.html créé avec succès !');

  // Créer le fichier .nojekyll pour GitHub Pages
  fs.writeFileSync(path.join(__dirname, 'dist', '.nojekyll'), '');
  console.log('✅ Fichier .nojekyll créé avec succès !');

  // Déployer sur GitHub Pages
  console.log('🚀 Déploiement sur GitHub Pages...');
  execSync('npx gh-pages -d dist', { stdio: 'inherit' });
  
  console.log('\n✅ Déploiement terminé avec succès !');
  console.log('\n🌐 Votre application est maintenant disponible sur:');
  console.log(' https://zerkan34.github.io/OYSTERCULT/');
  console.log(' Si vous rencontrez des problèmes, ouvrez les outils de développement du navigateur (F12) pour vérifier les erreurs.');

} catch (error) {
  console.error('❌ Erreur lors du déploiement:', error);
  process.exit(1);
}
