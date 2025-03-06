#!/bin/bash

# Navigate to the Symfony project directory
cd "$(dirname "$0")"

# Install PHP dependencies
composer install

# Run Doctrine migrations
php bin/console doctrine:migrations:migrate --no-interaction

# Load data fixtures
php bin/console doctrine:fixtures:load --no-interaction

# Start the Symfony server
symfony server:start
