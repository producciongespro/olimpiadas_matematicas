<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class ApiRateLimitFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null): ?ResponseInterface
    {
        if (strtoupper($request->getMethod()) === 'OPTIONS') {
            return null;
        }

        $capacity = max(1, (int) env('api.rateLimitRequests', 120));
        $window = max(1, (int) env('api.rateLimitWindowSeconds', 60));
        $key = 'api-rate-limit-' . hash('sha256', $request->getIPAddress());
        $throttler = service('throttler');

        if ($throttler->check($key, $capacity, $window)) {
            return null;
        }

        return service('response')
            ->setStatusCode(429)
            ->setHeader('Retry-After', (string) $throttler->getTokenTime())
            ->setJSON(['message' => 'Demasiadas solicitudes. Intente nuevamente más tarde.']);
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null): ResponseInterface
    {
        return $response;
    }
}
