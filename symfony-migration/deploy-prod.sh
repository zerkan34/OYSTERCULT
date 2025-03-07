#!/bin/bash

# Arrêter en cas d'erreur
set -e

# Variables
DOCKER_REGISTRY="registry.digitalocean.com"
APP_NAME="oystercult"
NAMESPACE="your-namespace"

# Se connecter au registry DigitalOcean (à configurer avec votre token)
# doctl auth init --context prod

# Builder et pousser les images
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml push

# Déployer sur DigitalOcean
doctl apps create \
  --spec .do/app.yaml \
  --access-token $DO_ACCESS_TOKEN

echo "Déploiement terminé !"
