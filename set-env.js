// Script pour définir les variables d'environnement avant le build
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire le fichier .env.production
const envPath = path.resolve(__dirname, '.env.production');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = envContent.split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});

  // Définir VITE_DEPLOY_TARGET
  process.env.VITE_DEPLOY_TARGET = envVars.VITE_DEPLOY_TARGET || '';
  console.log('✅ Variable d\'environnement VITE_DEPLOY_TARGET définie à:', process.env.VITE_DEPLOY_TARGET);
} else {
  console.log('⚠️ Fichier .env.production non trouvé');
}
