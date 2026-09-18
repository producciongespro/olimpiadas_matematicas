<?php

declare(strict_types=1);

use CodeIgniter\Config\DotEnv;
use Config\Paths;

/**
 * Loads the environment-specific private file before CodeIgniter boots.
 */
function loadEnvironmentFile(Paths $paths): void
{
    $configuredEnvironment = $_ENV['CI_ENVIRONMENT']
        ?? $_SERVER['CI_ENVIRONMENT']
        ?? getenv('CI_ENVIRONMENT')
        ?: null;

    if ($configuredEnvironment === 'testing') {
        return;
    }

    $environment = $configuredEnvironment === 'production' ? 'production' : 'development';
    $environmentDirectory = $paths->envDirectory ?? $paths->appDirectory . '/../';

    require_once $paths->systemDirectory . '/Config/DotEnv.php';
    (new DotEnv($environmentDirectory, '.env.' . $environment))->load();
}
