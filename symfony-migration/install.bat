@echo off

REM Navigate to the Symfony project directory
cd /d "%~dp0"

REM Install PHP dependencies
composer install

REM Run Doctrine migrations
php bin/console doctrine:migrations:migrate --no-interaction

REM Load data fixtures
php bin/console doctrine:fixtures:load --no-interaction

REM Start the Symfony server
symfony server:start
