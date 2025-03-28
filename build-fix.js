import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Conversion du chemin ES Module vers CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire le fichier .env.production
const envPath = path.resolve(__dirname, '.env.production');
let deployTarget = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = envContent.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});
  deployTarget = envVars.VITE_DEPLOY_TARGET || '';
}

console.log('VITE_DEPLOY_TARGET environment variable:', deployTarget);

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
  
  const isFirebase = deployTarget === 'firebase';
  const basePath = isFirebase ? '/' : '/OYSTERCULT/';
  
  console.log(`🔧 Correction des chemins pour: ${isFirebase ? 'Firebase' : 'GitHub Pages'} avec basePath: ${basePath}`);
  
  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  
  if (basePath === '/OYSTERCULT/') {
    // Remplacer les chemins dans les balises <script> et <link> uniquement pour GitHub Pages
    html = html.replace(/src="\/assets\//g, `src="${basePath}assets/`);
    html = html.replace(/href="\/assets\//g, `href="${basePath}assets/`);
    
    // Ajouter la balise base si elle n'existe pas déjà
    if (!html.includes(`<base href="${basePath}"`)) {
      html = html.replace('<head>', `<head>\n  <base href="${basePath}" />`);
    }
  } else if (isFirebase) {
    // Pour Firebase, s'assurer qu'il n'y a pas de balise base qui pourrait causer des problèmes
    html = html.replace(/<base href="[^"]*"[^>]*>/g, '');
    
    // S'assurer que les chemins commencent par / pour Firebase
    html = html.replace(/src="assets\//g, 'src="/assets/');
    html = html.replace(/href="assets\//g, 'href="/assets/');
  }
  
  // Écrire le HTML modifié
  fs.writeFileSync(indexHtmlPath, html);
  console.log('✅ Chemins corrigés dans index.html');
}

/**
 * Crée un fichier 404.html pour GitHub Pages
 */
function create404Html() {
  const distDir = path.resolve(__dirname, 'dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  const notFoundPath = path.join(distDir, '404.html');
  
  if (fs.existsSync(indexHtmlPath)) {
    fs.copyFileSync(indexHtmlPath, notFoundPath);
    console.log('✅ 404.html créé');
  }
}

/**
 * Crée un fichier .nojekyll pour GitHub Pages
 */
function createNojekyllFile() {
  const distDir = path.resolve(__dirname, 'dist');
  const nojekyllPath = path.join(distDir, '.nojekyll');
  
  fs.writeFileSync(nojekyllPath, '');
  console.log('✅ .nojekyll créé');
}

// Exécuter les corrections
fixPathsInIndexHtml();
create404Html();
createNojekyllFile();
