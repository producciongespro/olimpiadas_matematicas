<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Api\\HealthController::index');
$routes->options('api/v1/(:any)', 'Api\\HealthController::options', ['filter' => 'cors']);

$routes->group('api/v1', ['filter' => 'cors'], static function (RouteCollection $routes): void {
    $routes->get('health', 'Api\\HealthController::index');

    $routes->group('admin', ['filter' => ['jwt-auth', 'role']], static function (RouteCollection $routes): void {
        // Agregue aquí únicamente las rutas administrativas.
    });
});
