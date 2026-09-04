<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use RuntimeException;
use Throwable;

class JwtAuthFilter implements FilterInterface
{
    private const JWKS_CACHE_TTL = 21600;

    public function before(RequestInterface $request, $arguments = null): ?ResponseInterface
    {
        $header = $request->getHeaderLine('Authorization');

        if (! str_starts_with($header, 'Bearer ')) {
            return $this->error(401, 'Falta el token Bearer.');
        }

        try {
            $claims = $this->validate(trim(substr($header, 7)));
            $roles = $this->roles($claims);
            $adminRoles = $this->adminRoles();
        } catch (Throwable $exception) {
            return $this->error(401, $exception->getMessage());
        }

        service('request')->jwtClaims = $claims;
        service('request')->azureRoles = $roles;
        service('request')->azureIsAdmin = $this->hasAnyRole($roles, $adminRoles);
        service('request')->azureClientId = $this->clientApplicationId($claims);

        return null;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null): ResponseInterface
    {
        return $response;
    }

    private function validate(string $token): array
    {
        if ($token === '') {
            throw new RuntimeException('Falta el token Bearer.');
        }
        if (! filter_var(env('auth.jwtValidationEnabled', true), FILTER_VALIDATE_BOOL)) {
            throw new RuntimeException('La validación JWT no puede estar desactivada.');
        }

        $jwksUri = $this->config('azure.jwksUri');
        if ($jwksUri === '') {
            throw new RuntimeException('La configuración JWKS de Azure no está definida.');
        }
        $jwks = $this->jwks($jwksUri, $token);

        $decoded = JWT::decode($token, JWK::parseKeySet($jwks, 'RS256'));
        $claims = json_decode(json_encode($decoded), true);
        if (! is_array($claims)) {
            throw new RuntimeException('El contenido del token no es válido.');
        }

        if (! hash_equals($this->normalize($this->config('azure.issuer')), $this->normalize((string) ($claims['iss'] ?? '')))) {
            throw new RuntimeException('El emisor del token no es válido.');
        }
        $expectedAudience = $this->config('azure.expectedAudience');
        $audiences = is_array($claims['aud'] ?? null) ? $claims['aud'] : [$claims['aud'] ?? ''];
        if ($expectedAudience === '' || ! in_array($expectedAudience, $audiences, true)) {
            throw new RuntimeException('La audiencia del token no es válida.');
        }

        $this->validateTenant($claims);
        $this->validateClientApplication($claims);

        $requiredScope = $this->config('azure.requiredScope');
        if ($requiredScope === '') {
            throw new RuntimeException('El alcance requerido de Azure no está configurado.');
        }
        $scopes = explode(' ', (string) ($claims['scp'] ?? ''));
        if (! in_array($requiredScope, $scopes, true)) {
            throw new RuntimeException('El token no incluye el alcance requerido.');
        }

        return $claims;
    }

    private function roles(array $claims): array
    {
        $roles = $claims['roles'] ?? [];
        $roles = is_string($roles) ? [$roles] : (is_array($roles) ? $roles : []);

        return array_values(array_filter(array_map(
            static fn (mixed $role): string => is_string($role) ? trim($role) : '',
            $roles,
        )));
    }

    /**
     * @return list<string>
     */
    private function adminRoles(): array
    {
        $roles = $this->csvEnv('azure.adminRoles');

        if ($roles === []) {
            throw new RuntimeException('Los roles administrativos de Azure no están configurados.');
        }

        return $roles;
    }

    private function validateTenant(array $claims): void
    {
        $tenantId = trim((string) env('azure.tenantId', ''));
        $tokenTenantId = trim((string) ($claims['tid'] ?? ''));

        if ($tenantId === '' || $tokenTenantId === '' || ! hash_equals($tenantId, $tokenTenantId)) {
            throw new RuntimeException('El tenant del token no es válido.');
        }
    }

    private function validateClientApplication(array $claims): void
    {
        $clientId = $this->clientApplicationId($claims);

        if ($clientId === null || ! in_array($clientId, $this->allowedClientIds(), true)) {
            throw new RuntimeException('La aplicación cliente del token no está autorizada.');
        }
    }

    private function clientApplicationId(array $claims): ?string
    {
        $value = $claims['azp'] ?? $claims['appid'] ?? null;

        return is_string($value) && trim($value) !== '' ? trim($value) : null;
    }

    /**
     * @return list<string>
     */
    private function allowedClientIds(): array
    {
        $clients = $this->csvEnv('azure.allowedClientIds');

        if ($clients === []) {
            throw new RuntimeException('No hay aplicaciones cliente autorizadas configuradas.');
        }

        return $clients;
    }

    private function jwks(string $uri, string $token): array
    {
        $cache = service('cache');
        $cacheKey = 'azure-jwks-' . hash('sha256', $uri);
        $kid = $this->tokenKid($token);
        $cached = $cache->get($cacheKey);

        if (is_array($cached) && isset($cached['keys']) && ($kid === null || $this->containsKid($cached, $kid))) {
            return $cached;
        }

        $context = stream_context_create(['http' => ['timeout' => 5]]);
        $contents = @file_get_contents($uri, false, $context);
        $jwks = $contents === false ? null : json_decode($contents, true);
        if (! is_array($jwks) || ! isset($jwks['keys']) || ! is_array($jwks['keys'])) {
            throw new RuntimeException('No se pudieron obtener las llaves públicas de Azure.');
        }

        $cache->save($cacheKey, $jwks, self::JWKS_CACHE_TTL);

        return $jwks;
    }

    private function tokenKid(string $token): ?string
    {
        $header = explode('.', $token)[0] ?? '';
        $header .= str_repeat('=', (4 - strlen($header) % 4) % 4);
        $data = json_decode((string) base64_decode(strtr($header, '-_', '+/'), true), true);

        return is_array($data) && is_string($data['kid'] ?? null) ? $data['kid'] : null;
    }

    private function containsKid(array $jwks, string $kid): bool
    {
        foreach ($jwks['keys'] as $key) {
            if (is_array($key) && ($key['kid'] ?? null) === $kid) {
                return true;
            }
        }

        return false;
    }

    /**
     * @return list<string>
     */
    private function csvEnv(string $key): array
    {
        $value = (string) env($key, '');
        $items = array_map(static fn (string $item): string => trim($item, " \t\n\r\0\x0B'\""), explode(',', $value));

        return array_values(array_unique(array_filter($items, static fn (string $item): bool => $item !== '')));
    }

    /**
     * @param list<string> $actualRoles
     * @param list<string> $expectedRoles
     */
    private function hasAnyRole(array $actualRoles, array $expectedRoles): bool
    {
        foreach ($expectedRoles as $role) {
            if (in_array($role, $actualRoles, true)) {
                return true;
            }
        }

        return false;
    }

    private function config(string $key): string
    {
        $value = trim((string) env($key, ''));
        return str_replace('{tenantId}', trim((string) env('azure.tenantId', '')), trim($value, " \t\n\r\0\x0B'\""));
    }

    private function normalize(string $value): string
    {
        return rtrim($value, '/');
    }

    private function error(int $status, string $message): ResponseInterface
    {
        log_message('warning', 'Autenticación JWT rechazada: {message}', ['message' => $message]);

        return service('response')->setStatusCode($status)->setJSON(['message' => 'Token no válido o sin permisos.']);
    }
}
