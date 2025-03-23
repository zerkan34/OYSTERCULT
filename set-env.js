// Script pour définir les variables d'environnement avant le build
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire actuel en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vérifier si nous sommes en mode Firebase
const isFirebase = process.env.DEPLOY_TARGET === 'firebase';

// Créer un fichier .env.local avec la bonne valeur
const envContent = `VITE_DEPLOY_TARGET=${isFirebase ? 'firebase' : ''}\n`;
fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);

console.log(`✅ Variable d'environnement VITE_DEPLOY_TARGET définie à: ${isFirebase ? 'firebase' : ''}`);
