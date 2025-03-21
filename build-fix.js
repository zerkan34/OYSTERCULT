import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Conversion du chemin ES Module vers CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Corrige les chemins dans le fichier index.html généré
 */
function fixPathsInIndexHtml() {
  const distDir = path.resolve(__dirname, 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ Erreur: Le fichier index.html n\'existe pas dans le dossier dist');
    return;
  }
  
  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Remplacer les chemins dans les balises <script> et <link>
  html = html.replace(/src="\/assets\//g, 'src="/OYSTERCULT/assets/');
  html = html.replace(/href="\/assets\//g, 'href="/OYSTERCULT/assets/');
  
  // Ajouter la balise base si elle n'existe pas déjà
  if (!html.includes('<base href="/OYSTERCULT/')) {
    html = html.replace('<head>', '<head>\n  <base href="/OYSTERCULT/" />');
  }
  
  // Écrire le HTML modifié
  fs.writeFileSync(indexHtmlPath, html);
  console.log('✅ Chemins corrigés dans index.html');

  // Copier index.html vers 404.html pour la gestion des routes
  fs.copyFileSync(indexHtmlPath, path.join(distDir, '404.html'));
  console.log('✅ 404.html créé');

  // Créer un fichier .nojekyll pour GitHub Pages
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
  console.log('✅ .nojekyll créé');
}

// Exécution de la fonction
fixPathsInIndexHtml();
