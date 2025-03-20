# Page de Gestion des Tâches - OYSTER CULT

Cette partie du projet contient uniquement la page de gestion des tâches de l'application OYSTER CULT.

## Fonctionnalités

- Création et modification de tâches
- Système de commentaires
- Suivi des performances
- Tâches récurrentes
- Filtres et recherche
- Interface responsive
- Support de l'accessibilité

## Structure des fichiers

```
src/
  features/
    tasks/
      components/
        TaskForm.tsx       # Formulaire de création/modification
        TaskList.tsx       # Liste des tâches
        TaskComments.tsx   # Système de commentaires
        TaskCard.css       # Styles des cartes de tâches
        TaskList.css       # Styles de la liste
      pages/
        TasksPage.tsx        # Page principale
        TasksPage.responsive.css  # Styles responsifs
```

## Configuration requise

- Node.js 18+
- Firebase project
- Variables d'environnement Firebase (voir ci-dessous)

## Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
VITE_FIREBASE_API_KEY=votre_api_key
VITE_FIREBASE_AUTH_DOMAIN=votre_auth_domain
VITE_FIREBASE_PROJECT_ID=votre_project_id
VITE_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
VITE_FIREBASE_MEASUREMENT_ID=votre_measurement_id
```

## Installation

1. Installez les dépendances :
```bash
npm install
```

2. Démarrez le serveur de développement :
```bash
npm run dev
```

## Accessibilité

- Support des lecteurs d'écran
- Navigation au clavier
- Contraste et tailles de texte conformes aux normes WCAG
- Support des préférences de mouvement réduit

## Design Responsive

- Support mobile et tablette
- Grilles adaptatives
- Comportement bottom sheet sur mobile
- Safe areas iOS
- Optimisation des formulaires pour mobile
