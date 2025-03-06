<?php
namespace Deployer;

require 'recipe/symfony.php';

// Config
set('repository', 'git@github.com:your-repo/oystercult.git');
set('git_tty', true);
set('keep_releases', 5);

// Shared files/dirs between deploys
add('shared_files', ['.env.prod']);
add('shared_dirs', [
    'var/log',
    'var/sessions',
    'public/uploads'
]);

// Writable dirs by web server
add('writable_dirs', [
    'var',
    'var/cache',
    'var/log',
    'var/sessions',
    'public/uploads'
]);

// Hosts
host('production')
    ->setHostname('your-server.com')
    ->setRemoteUser('deployer')
    ->setDeployPath('/var/www/oystercult')
    ->set('composer_options', '--verbose --prefer-dist --no-progress --no-interaction --no-dev --optimize-autoloader')
    ->set('branch', 'main');

// Tasks
task('build', function () {
    cd('{{release_path}}');
    run('composer install --no-dev --optimize-autoloader');
    run('php bin/console cache:clear');
    run('php bin/console doctrine:migrations:migrate --no-interaction');
    run('php bin/console assets:install public');
    run('yarn install');
    run('yarn build');
});

// Custom task pour la vérification de l'environnement
task('verify:environment', function () {
    $output = run('php -v');
    writeln("<info>PHP version:</info>");
    writeln($output);

    $output = run('composer -V');
    writeln("<info>Composer version:</info>");
    writeln($output);

    $output = run('node -v');
    writeln("<info>Node.js version:</info>");
    writeln($output);

    $output = run('yarn -v');
    writeln("<info>Yarn version:</info>");
    writeln($output);
});

// Custom task pour la sauvegarde de la base de données
task('database:backup', function () {
    $date = date('Y-m-d_H-i-s');
    run("mysqldump -u {{db_user}} -p'{{db_pass}}' {{db_name}} > backup_${date}.sql");
});

// Custom task pour la vérification de la santé de l'application
task('app:health-check', function () {
    $url = 'https://your-domain.com/api/health';
    $response = file_get_contents($url);
    $health = json_decode($response, true);

    if ($health['status'] !== 'healthy') {
        throw new \Exception('Health check failed!');
    }
});

// Hooks
before('deploy', 'verify:environment');
before('deploy:symlink', 'database:backup');
after('deploy', 'app:health-check');

// Main deploy task
task('deploy', [
    'deploy:prepare',
    'deploy:vendors',
    'deploy:cache:clear',
    'deploy:publish'
]);
