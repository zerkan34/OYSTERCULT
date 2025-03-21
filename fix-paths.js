// Script pour corriger les chemins d'accès dans les fichiers générés
const fs = require('fs');
const path = require('path');

// Fonction pour corriger les chemins d'accès dans le fichier HTML
function fixPaths() {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    console.log('Fixing paths in index.html...');
    
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Remplacer toutes les occurrences de href="/... par href="/OYSTERCULT/...
    content = content.replace(/href="\//g, 'href="/OYSTERCULT/');
    content = content.replace(/src="\//g, 'src="/OYSTERCULT/');
    
    // Ajouter une balise <base> avant tout autre élément dans le <head>
    content = content.replace(/<head>/, '<head>\n    <base href="/OYSTERCULT/">');
    
    // Écrire les modifications dans le fichier
    fs.writeFileSync(indexPath, content);
    
    console.log('Paths fixed successfully!');
  } else {
    console.error('index.html not found in dist folder');
  }

  // Copier 404.html dans le dossier dist
  const sourcePath = path.join(__dirname, '404.html');
  const destPath = path.join(__dirname, 'dist', '404.html');
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log('404.html copied to dist folder');
  }
}

// Exécuter la fonction
fixPaths();
