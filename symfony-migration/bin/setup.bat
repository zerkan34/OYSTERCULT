@echo off
echo ================================================================
echo OYSTERCULT - Configuration initiale de la base de données Symfony
echo ================================================================
echo.

echo 1. Création de la base de données...
php bin/console doctrine:database:create --if-not-exists
echo.

echo 2. Suppression des anciennes migrations si elles existent...
rmdir /s /q migrations
echo.

echo 3. Génération des nouvelles migrations...
php bin/console doctrine:migrations:diff
echo.

echo 4. Exécution des migrations...
php bin/console doctrine:migrations:migrate --no-interaction
echo.

echo 5. Chargement des fixtures...
php bin/console doctrine:fixtures:load --no-interaction
echo.

echo 6. Génération des clés JWT...
mkdir -p config/jwt
php bin/console lexik:jwt:generate-keypair --skip-if-exists
echo.

echo ========================================================
echo Configuration terminée ! L'application est prête à l'emploi.
echo ========================================================
echo.
echo Utilisateurs créés:
echo - Admin: admin@oystercult.com / admin123
echo - User:  user@oystercult.com / user123
echo - Jean:  jean@oystercult.com / jean123
echo.
echo Pour démarrer le serveur: symfony server:start
echo.
pause
