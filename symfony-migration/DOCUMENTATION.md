# OYSTERCULT - Documentation de la Transposition vers Symfony

## Table des matières
1. [Introduction](#introduction)
2. [Structure du projet](#structure-du-projet)
3. [Respect des règles métier](#respect-des-règles-métier)
4. [Respect des standards d'accessibilité](#respect-des-standards-daccessibilité)
5. [Architecture de l'application](#architecture-de-lapplication)
6. [Authentification et sécurité](#authentification-et-sécurité)
7. [Tableaux de bord](#tableaux-de-bord)
8. [Comment utiliser l'application](#comment-utiliser-lapplication)
9. [Prochaines étapes](#prochaines-étapes)
10. [API Endpoints](#api-endpoints)
11. [Règles métier](#règles-métier)

## Introduction

Cette documentation détaille la transposition de l'application OYSTERCULT de son architecture originale vers une application Symfony complète. L'objectif principal a été de préserver toutes les fonctionnalités métier tout en améliorant la structure du code, la sécurité et l'accessibilité.

## Structure du projet

La structure du projet suit l'architecture standard de Symfony :

```
symfony-migration/
├── bin/                    # Commandes et scripts
├── config/                 # Fichiers de configuration
├── public/                 # Point d'entrée web
├── src/
│   ├── Controller/         # Contrôleurs
│   ├── Entity/             # Entités Doctrine
│   ├── Repository/         # Repositories pour les requêtes
│   ├── Service/            # Services métier
│   ├── Security/           # Composants de sécurité
│   └── DataFixtures/       # Données initiales
├── templates/              # Templates Twig
│   ├── base.html.twig      # Template de base
│   ├── home/               # Templates pour le dashboard
│   └── security/           # Templates pour l'authentification
└── .env                    # Variables d'environnement
```

## Respect des règles métier

### Division des tables d'huîtres

Les tables d'huîtres sont organisées selon les règles spécifiques du secteur ostréicole :

- **Colonne gauche (triploïdes)** : Tables de type "Plates" avec une couleur bordeaux
- **Colonne droite (diploïdes)** : Tables de type "Creuses" avec une couleur bleue

Cette division est implémentée dans :
- `TableFixtures.php` pour la création initiale
- `TableRepository.php` pour les requêtes spécifiques
- Les templates pour l'affichage

### Numérotation des cellules

Le système de numérotation des cellules respecte rigoureusement les règles suivantes :

1. **Numérotation séquentielle** : Commence à 1 pour chaque colonne
2. **Pas de cellules vides** : Entre deux cellules numérotées
3. **Remplissage séquentiel** : De haut en bas pour chaque colonne
4. **Standard de remplissage** : 6 premières cellules (60%) de chaque colonne

L'implémentation se trouve dans :
```php
private function createTableCells(ObjectManager $manager, Table $table, int $rows, int $cols): void
{
    $cellNumber = 1;
    
    // Créer les cellules dans l'ordre (de haut en bas)
    for ($row = 0; $row < $rows; $row++) {
        for ($col = 0; $col < $cols; $col++) {
            $cell = new Cell();
            $cell->setTable($table);
            $cell->setRowIndex($row);
            $cell->setColumnIndex($col);
            $cell->setNumber($cellNumber++);
            
            // Suivant le standard, remplir les 6 premières cellules (60%)
            if ($cellNumber <= 7) {
                $cell->setStatus('filled');
                $cell->setQuantity(100);
            } else {
                $cell->setStatus('empty');
                $cell->setQuantity(0);
            }
            
            $manager->persist($cell);
        }
    }
}
```

### Vue satellite

La vue satellite sert de référence pour la numérotation des tables. Les tables sont positionnées suivant leur coordonnées (posX, posY) et la numérotation des cellules est organisée de gauche à droite et de haut en bas, sans sauter de cellules.

## Respect des standards d'accessibilité

Tous les éléments de l'interface respectent les standards d'accessibilité WCAG :

### Formulaires et interactions

```html
<!-- Exemple du formulaire de connexion avec accessibilité -->
<form method="post" class="login-form">
    <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" name="email" class="form-control" 
               required autofocus autocomplete="email" 
               aria-describedby="email-help">
        <small id="email-help" class="form-text">Entrez votre adresse email</small>
    </div>
    
    <div class="form-group">
        <label for="password" class="form-label">Mot de passe</label>
        <input type="password" id="password" name="password" class="form-control" 
               required autocomplete="current-password"
               aria-describedby="password-help">
        <small id="password-help" class="form-text">Entrez votre mot de passe</small>
    </div>
    
    <button type="submit" class="btn btn-primary" aria-label="Se connecter">
        Se connecter
    </button>
</form>
```

### Images et contenus visuels

Toutes les images possèdent des attributs alt descriptifs, et les éléments visuellement significatifs ont des alternatives textuelles appropriées.

```html
<img src="{{ asset('images/logo.png') }}" alt="Logo OYSTERCULT" 
     title="Logo OYSTERCULT - Application de gestion ostréicole">
```

### Compatibilité navigateurs

Le CSS utilise des préfixes vendeurs pour assurer la compatibilité cross-browser :

```css
.backdrop-filter {
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
}

.user-select-none {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
```

## Architecture de l'application

### Entités principales

1. **User** - Gestion des utilisateurs et authentification
2. **Table** - Tables d'huîtres avec leurs caractéristiques
3. **Cell** - Cellules individuelles dans les tables
4. **InventoryItem** - Éléments d'inventaire
5. **Supplier** - Fournisseurs
6. **SupplierProduct** - Produits proposés par les fournisseurs

### Contrôleurs

- **AuthController** - Gestion de l'authentification API
- **SecurityController** - Formulaires de connexion
- **HomeController** - Dashboard principal
- **TableController** - CRUD pour les tables
- **InventoryController** - CRUD pour l'inventaire
- **SupplierController** - CRUD pour les fournisseurs

## Authentification et sécurité

La sécurité est assurée via :

1. **JWT pour l'API** - Avec LexikJWTAuthenticationBundle
2. **Formulaire de connexion** - Pour l'interface web
3. **Contrôle d'accès par rôles** - ROLE_USER, ROLE_ADMIN

```php
// Exemple de sécurisation d'une route
/**
 * @Route("/dashboard", name="app_dashboard")
 * @IsGranted("ROLE_USER")
 */
public function index(): Response
{
    // ...
}
```

## Tableaux de bord

Le tableau de bord présente des statistiques clés sur :

1. **Tables d'huîtres** - Nombre total, nombre par type (triploïdes/diploïdes)
2. **Cellules remplies** - Pourcentage d'occupation
3. **Inventaire** - Items par type, items récents, items à faible stock

```php
// Exemple de récupération de statistiques pour le dashboard
/**
 * Récupère les statistiques d'inventaire pour le tableau de bord
 */
public function getInventoryStatsForDashboard(): array
{
    // Total d'items par type
    $typeStats = $this->createQueryBuilder('i')
        ->select('i.type, SUM(i.quantity) as total')
        ->groupBy('i.type')
        ->getQuery()
        ->getResult();
    
    // Items les plus récents
    $recentItems = $this->createQueryBuilder('i')
        ->orderBy('i.harvestDate', 'DESC')
        ->setMaxResults(5)
        ->getQuery()
        ->getResult();
    
    // Items à faible stock (moins de 10)
    $lowStockItems = $this->createQueryBuilder('i')
        ->where('i.quantity < :threshold')
        ->setParameter('threshold', 10)
        ->orderBy('i.quantity', 'ASC')
        ->setMaxResults(5)
        ->getQuery()
        ->getResult();
    
    return [
        'byType' => $typeStats,
        'recentItems' => $recentItems,
        'lowStockItems' => $lowStockItems
    ];
}
```

## Comment utiliser l'application

### Prérequis
- PHP 7.4 ou supérieur
- Composer
- MySQL 8.0 ou supérieur

### Installation

1. Cloner le dépôt
2. Installer les dépendances avec Composer
3. Configurer le fichier .env
4. Exécuter le script d'initialisation

```bash
# Installation des dépendances
composer install

# Configuration de la base de données
bin/setup.bat

# Démarrage du serveur
symfony server:start
# ou
php -S localhost:8000 -t public/
```

### Utilisateurs par défaut

- **Admin**: admin@oystercult.com / admin123
- **User**: user@oystercult.com / user123
- **Jean**: jean@oystercult.com / jean123

## Prochaines étapes

1. **Amélioration de l'interface visuelle** - Implémentation complète du design
2. **Tests unitaires et fonctionnels** - Couverture de code
3. **Documentation API** - Installation de API Platform ou NelmioApiDocBundle
4. **Optimisation des requêtes** - Mise en place de caching
5. **Monitoring** - Intégration d'outils de surveillance

## API Endpoints

### Authentification

- **POST /api/auth/register** : Inscription d'un nouvel utilisateur
- **POST /api/auth/login** : Connexion d'un utilisateur existant
- **GET /api/auth/profile** : Récupération du profil de l'utilisateur connecté
- **PUT /api/auth/profile** : Mise à jour du profil de l'utilisateur connecté

### Tables d'huîtres

- **GET /api/tables** : Récupération de toutes les tables
- **GET /api/tables/by-type/{type}** : Récupération des tables par type (triploid ou diploid)
- **GET /api/tables/{id}** : Récupération d'une table spécifique
- **POST /api/tables** : Création d'une nouvelle table
- **PUT /api/tables/{id}** : Mise à jour d'une table existante
- **DELETE /api/tables/{id}** : Suppression d'une table
- **GET /api/tables/{id}/cells** : Récupération des cellules d'une table
- **POST /api/tables/{id}/fill** : Remplissage des cellules d'une table

### Inventaire

- **GET /api/inventory** : Récupération de tous les éléments d'inventaire
- **GET /api/inventory/by-type/{type}** : Récupération des éléments par type
- **GET /api/inventory/{id}** : Récupération d'un élément spécifique
- **POST /api/inventory** : Création d'un nouvel élément d'inventaire
- **PUT /api/inventory/{id}** : Mise à jour d'un élément existant
- **DELETE /api/inventory/{id}** : Suppression d'un élément
- **POST /api/inventory/transfer-to-table** : Transfert d'huîtres vers une table

### Fournisseurs

- **GET /api/suppliers** : Récupération de tous les fournisseurs
- **GET /api/suppliers/{id}** : Récupération d'un fournisseur spécifique
- **POST /api/suppliers** : Création d'un nouveau fournisseur
- **PUT /api/suppliers/{id}** : Mise à jour d'un fournisseur existant
- **DELETE /api/suppliers/{id}** : Suppression d'un fournisseur
- **GET /api/suppliers/search/{term}** : Recherche de fournisseurs
- **GET /api/suppliers/{supplierId}/products** : Récupération des produits d'un fournisseur
- **POST /api/suppliers/{supplierId}/products** : Ajout d'un produit à un fournisseur

## Règles métier

### Tables d'huîtres

1. Les tables d'huîtres sont divisées en deux types:
   - **Triploïdes (Plates)**: Représentées par la couleur bordeaux (code couleur: `#8c1a39`)
   - **Diploïdes (Creuses)**: Représentées par la couleur bleue (code couleur: `#2563eb`)

2. Numérotation des cellules:
   - La vue satellite est la référence pour la numérotation
   - Les numéros de cellule sont organisés de gauche à droite et du haut vers le bas
   - La numérotation est séquentielle sans sauter de cellules

3. Remplissage des tables:
   - Le standard est de remplir les 6 premières cellules (60%) de chaque colonne
   - Il ne doit jamais y avoir de cellules vides entre deux cellules numérotées
   - Les cellules sont remplies séquentiellement, de haut en bas pour chaque colonne

### Jauge du tableau de bord

Le tableau de bord reflète la distinction visuelle entre les types d'huîtres:
- Pour les tables contenant des huîtres "Plates" (Triploïdes), la jauge utilise la couleur bordeaux
- Pour les tables contenant des huîtres "Creuses" (Diploïdes), la jauge utilise la couleur bleue
- En l'absence d'identification explicite, la jauge utilise un dégradé de bordeaux à bleu

## Standards d'accessibilité

L'application respecte les standards d'accessibilité suivants:

1. Éléments interactifs:
   - Tous les boutons ont un texte discernable ou un attribut aria-label
   - Les éléments de formulaire ont des labels ou des attributs ARIA appropriés
   - Les images ont un texte alternatif ou un attribut title
   - Les éléments interactifs ont des états de focus appropriés
   - Les champs de mot de passe ont des attributs autocomplete corrects

2. Compatibilité navigateurs:
   - Les propriétés CSS utilisent des préfixes vendeurs pour la compatibilité cross-browser
   - La balise meta viewport permet le zoom utilisateur
   - Les deux versions standard et préfixées des propriétés sont utilisées
   - Des fallbacks appropriés sont fournis pour les images et fonctionnalités avancées

## Structure du projet

Le projet suit l'architecture MVC de Symfony, avec une organisation claire en:

- **Entity**: Définition des modèles de données
- **Repository**: Méthodes d'accès à la base de données
- **Controller**: Gestion des requêtes HTTP
- **Service**: Logique métier
- **Template**: Interfaces utilisateur

Les fixtures sont utilisées pour précharger des données de test.
