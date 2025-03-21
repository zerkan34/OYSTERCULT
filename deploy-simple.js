import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Conversion du chemin ES Module vers CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constantes
const distDir = path.resolve(__dirname, 'dist');

// 1. Nettoyer le dossier dist s'il existe
console.log(' Nettoyage du dossier dist...');
try {
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
    console.log(' Dossier dist nettoyé avec succès !');
  }
} catch (error) {
  console.error(' Erreur lors du nettoyage du dossier dist:', error);
  // Continuer malgré l'erreur
}

// 2. Copier index.html de public vers index.html.template
console.log(' Préparation du fichier index.html...');
try {
  const publicIndexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(publicIndexPath)) {
    console.log(' Utilisation du fichier index.html du dossier public');
  } else {
    // Créer le fichier template à partir du code donné
    const templateContent = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="theme-color" content="#0f172a" />
    <link rel="preload" href="/fonts/TT_Modernoir_Trial_Light.ttf" as="font" type="font/ttf" crossorigin />
    <link rel="preload" href="/fonts/TT_Modernoir_Trial_Regular.ttf" as="font" type="font/ttf" crossorigin />
    <link rel="preload" href="/fonts/TT_Modernoir_Trial_DemiBold.ttf" as="font" type="font/ttf" crossorigin />
    <!-- Script pour fixer les chemins en production sur GitHub Pages -->
    <script>
      (function() {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
          // Nous sommes en production
          var baseTag = document.createElement('base');
          baseTag.href = '/OYSTERCULT/';
          document.head.prepend(baseTag);
        }
      })();
    </script>
    <style>
      @font-face {
        font-family: 'TT Modernoir';
        src: url('/fonts/TT_Modernoir_Trial_Light.ttf') format('truetype');
        font-weight: 300;
        font-style: normal;
        font-display: block;
      }

      @font-face {
        font-family: 'TT Modernoir';
        src: url('/fonts/TT_Modernoir_Trial_Regular.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
        font-display: block;
      }

      @font-face {
        font-family: 'TT Modernoir';
        src: url('/fonts/TT_Modernoir_Trial_DemiBold.ttf') format('truetype');
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
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
    fs.writeFileSync(path.join(__dirname, 'index.html.template'), templateContent);
    console.log(' Fichier index.html.template créé avec succès');
  }
} catch (error) {
  console.error(' Erreur lors de la préparation du fichier template:', error);
  // Continuer malgré l'erreur
}

// 3. Construction de l'application
console.log(' Construction de l\'application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log(' Application construite avec succès !');
} catch (error) {
  console.error(' Erreur lors de la construction:', error);
  process.exit(1);
}

// 4. Modifier le fichier index.html généré
console.log(' Modification du fichier index.html...');
try {
  // Lire le fichier index.html généré
  const indexPath = path.join(distDir, 'index.html');
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Lire le template (soit de public/index.html ou de index.html.template)
  const templatePath = fs.existsSync(path.join(__dirname, 'public', 'index.html')) 
    ? path.join(__dirname, 'public', 'index.html')
    : path.join(__dirname, 'index.html.template');
  
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  
  // Extraire le script généré par Vite
  const scriptMatch = indexContent.match(/<script type="module" crossorigin src="(\/assets\/.*?)"><\/script>/);
  const scriptSrc = scriptMatch ? scriptMatch[1] : null;
  
  // Extraire les stylesheets générés par Vite
  const styleMatch = indexContent.match(/<link rel="stylesheet" crossorigin href="(\/assets\/.*?)">/);
  const styleSrc = styleMatch ? styleMatch[1] : null;
  
  // Insertion des scripts et styles dans le template
  let finalHtml = templateContent;
  
  // Ajouter le script de redirection vers auth
  finalHtml = finalHtml.replace('</script>', `
          // Rediriger vers auth si nécessaire
          if (window.location.hash === '') {
            window.location.hash = '#/auth';
          }
        })();
      </script>`);
  
  // Remplacer les chemins pour GitHub Pages
  finalHtml = finalHtml.replace(/src="\/fonts\//g, 'src="/OYSTERCULT/fonts/');
  finalHtml = finalHtml.replace(/href="\/fonts\//g, 'href="/OYSTERCULT/fonts/');
  finalHtml = finalHtml.replace(/src="\/assets\//g, 'src="/OYSTERCULT/assets/');
  finalHtml = finalHtml.replace(/href="\/assets\//g, 'href="/OYSTERCULT/assets/');
  finalHtml = finalHtml.replace(/src="\/vite.svg/g, 'src="/OYSTERCULT/vite.svg');
  
  // Remplacer le script original par celui généré par Vite
  if (scriptSrc) {
    finalHtml = finalHtml.replace(/<script type="module" src="\/src\/main.tsx"><\/script>/, 
      `<script type="module" src="/OYSTERCULT${scriptSrc}"></script>`);
  }
  
  // Ajouter la feuille de style générée par Vite
  if (styleSrc) {
    finalHtml = finalHtml.replace('</title>', 
      `</title>\n    <link rel="stylesheet" href="/OYSTERCULT${styleSrc}">`);
  }
  
  // Écrire le fichier final
  fs.writeFileSync(indexPath, finalHtml);
  console.log(' Fichier index.html modifié avec succès !');
  
  // Copier index.html vers 404.html
  fs.writeFileSync(path.join(distDir, '404.html'), finalHtml);
  console.log(' Fichier 404.html créé avec succès !');
  
  // Créer .nojekyll
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
  console.log(' Fichier .nojekyll créé avec succès !');
} catch (error) {
  console.error(' Erreur lors de la modification des fichiers:', error);
  process.exit(1);
}

// 5. Déploiement sur GitHub Pages
console.log(' Déploiement sur GitHub Pages...');
try {
  execSync('npx gh-pages -d dist', { stdio: 'inherit' });
  console.log(' Déploiement terminé avec succès !');
} catch (error) {
  console.error(' Erreur lors du déploiement:', error);
  process.exit(1);
}

console.log('\n Tout est terminé ! Votre application est maintenant disponible sur:');
console.log(' https://zerkan34.github.io/OYSTERCULT/');
console.log(' Si vous rencontrez des problèmes, ouvrez les outils de développement du navigateur (F12) pour vérifier les erreurs.');
