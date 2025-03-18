# OYSTER CULT - Backend

Ce dossier contient le backend de l'application OYSTER CULT pour la gestion des tables d'huîtres.

## Structure du projet

```
server/
├── src/
│   ├── config/         # Configuration du serveur
│   ├── controllers/    # Contrôleurs pour gérer les requêtes HTTP
│   ├── models/         # Modèles de données
│   ├── routes/         # Définition des routes API
│   ├── services/       # Services pour la logique métier
│   └── index.ts        # Point d'entrée de l'application
├── .env                # Variables d'environnement
├── package.json        # Dépendances et scripts
├── tsconfig.json       # Configuration TypeScript
└── README.md           # Documentation
```

## Installation

```bash
# Installer les dépendances
npm install

# Construire le projet
npm run build

# Démarrer le serveur en mode développement
npm run dev

# Démarrer le serveur en mode production
npm run start
```

## API Endpoints

### Dashboard

- `GET /api/dashboard/tables` - Récupérer toutes les tables d'huîtres
- `GET /api/dashboard/tables/:tableId` - Récupérer une table spécifique par ID
- `GET /api/dashboard/stats` - Récupérer les statistiques du dashboard

## Configuration du frontend

Pour connecter le frontend React au backend, vous devez configurer les appels API. 

Exemple d'utilisation avec Axios :

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchTables = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/tables`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des tables:', error);
    throw error;
  }
};
```

## Notes de développement

- Ce backend utilise actuellement des données simulées dans le service `DashboardService`.
- Pour une version de production, vous devrez intégrer une base de données (comme MongoDB, PostgreSQL, etc.)
- Les routes ont été conçues pour correspondre aux besoins spécifiques du dashboard des tables d'huîtres.
