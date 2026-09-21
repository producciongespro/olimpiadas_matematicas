<?php

namespace App\Services;

use CodeIgniter\Router\RouteCollectionInterface;

final class DocumentationAudit
{
    private const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    /** @return array{missing: list<string>, extra: list<string>} */
    public function compare(RouteCollectionInterface $routes, string $openApiPath): array
    {
        $real = [];
        foreach (self::HTTP_METHODS as $method) {
            foreach (array_keys($routes->getRoutes($method, false)) as $path) {
                if (str_starts_with($path, 'api/v1/')) {
                    $real[] = $method . ' ' . $this->normalizePath(substr($path, 6));
                }
            }
        }

        $documented = $this->readOpenApiOperations($openApiPath);
        sort($real);
        sort($documented);

        return [
            'missing' => array_values(array_diff($real, $documented)),
            'extra' => array_values(array_diff($documented, $real)),
        ];
    }

    /** @return list<string> */
    private function readOpenApiOperations(string $path): array
    {
        $operations = [];
        $currentPath = null;
        foreach (file($path, FILE_IGNORE_NEW_LINES) ?: [] as $line) {
            if (preg_match('/^  (\/[^:]+):\s*$/', $line, $matches) === 1) {
                $currentPath = $this->normalizePath($matches[1]);
                continue;
            }
            if ($currentPath !== null && preg_match('/^    (get|post|put|patch|delete):\s*$/', $line, $matches) === 1) {
                $operations[] = strtoupper($matches[1]) . ' ' . $currentPath;
            }
        }

        return $operations;
    }

    private function normalizePath(string $path): string
    {
        $path = '/' . ltrim($path, '/');
        $path = preg_replace('/\([^)]*\)/', '{}', $path) ?? $path;
        return preg_replace('/\{[^}]+\}/', '{}', $path) ?? $path;
    }
}
