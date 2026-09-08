<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Api\\HealthController::index');
$routes->options('api/v1/(:any)', 'Api\\HealthController::options', ['filter' => 'cors']);

$routes->group('api/v1', ['filter' => 'cors'], static function (RouteCollection $routes): void {
    $routes->get('health', 'Api\\HealthController::index');
    $routes->get('carousel', 'Api\\MediaController::carousel');
    $routes->get('events', 'Api\\MediaController::events');
    $routes->get('events/(:segment)', 'Api\\MediaController::event/$1');
    $routes->get('media/(:segment)', 'Api\\MediaController::file/$1');

    $routes->group('admin', ['filter' => ['jwt-auth', 'role']], static function (RouteCollection $routes): void {
        $routes->get('carousel', 'Api\\Admin\\MediaAdminController::carousel');
        $routes->post('carousel', 'Api\\Admin\\MediaAdminController::createSlide');
        $routes->put('carousel/order', 'Api\\Admin\\MediaAdminController::reorderSlides');
        $routes->post('carousel/(:num)', 'Api\\Admin\\MediaAdminController::updateSlide/$1');
        $routes->put('carousel/(:num)', 'Api\\Admin\\MediaAdminController::updateSlide/$1');
        $routes->delete('carousel/(:num)', 'Api\\Admin\\MediaAdminController::archiveSlide/$1');
        $routes->get('events', 'Api\\Admin\\MediaAdminController::events');
        $routes->post('events', 'Api\\Admin\\MediaAdminController::createEvent');
        $routes->get('events/(:num)', 'Api\\Admin\\MediaAdminController::event/$1');
        $routes->put('events/(:num)', 'Api\\Admin\\MediaAdminController::updateEvent/$1');
        $routes->delete('events/(:num)', 'Api\\Admin\\MediaAdminController::archiveEvent/$1');
        $routes->post('events/(:num)/images', 'Api\\Admin\\MediaAdminController::addEventImage/$1');
        $routes->put('events/(:num)/images/order', 'Api\\Admin\\MediaAdminController::reorderEventImages/$1');
        $routes->put('event-images/(:num)', 'Api\\Admin\\MediaAdminController::updateEventImage/$1');
        $routes->post('event-images/(:num)', 'Api\\Admin\\MediaAdminController::updateEventImage/$1');
        $routes->delete('event-images/(:num)', 'Api\\Admin\\MediaAdminController::deleteEventImage/$1');
    });
});
