<?php

namespace App\Filters;

use App\Services\MicrosoftJwtValidator;
use App\Services\AdminUserService;
use App\Exceptions\ForbiddenException;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
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
        } catch (Throwable $exception) {
            return $this->error(401, $exception->getMessage());
        }

        try { $user = (new AdminUserService())->authenticate($claims); }
        catch (ForbiddenException $exception) { return $this->error(403, $exception->getMessage()); }
        catch (Throwable $exception) { log_message('error', 'No se pudo resolver la autorización local: {message}', ['message' => $exception->getMessage()]); return service('response')->setStatusCode(500)->setJSON(['message' => 'No fue posible validar la autorización local.']); }

        service('request')->jwtClaims = $claims;
        service('request')->azureRoles = [$user['role']];
        service('request')->azureIsAdmin = true;
        service('request')->azureClientId = $this->clientApplicationId($claims);
        service('request')->localAdminUser = $user;

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

        return (new MicrosoftJwtValidator(
            $this->config('azure.tenantId'), $this->config('azure.expectedAudience'), $this->config('azure.requiredScope'),
            $jwks, (int) env('azure.clockSkewSeconds', 300), $this->allowedClientIds(),
        ))->validate($token);
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

    private function config(string $key): string
    {
        $value = trim((string) env($key, ''));
        return str_replace('{tenantId}', trim((string) env('azure.tenantId', '')), trim($value, " \t\n\r\0\x0B'\""));
    }

    private function error(int $status, string $message): ResponseInterface
    {
        log_message('warning', 'Autenticación JWT rechazada: {message}', ['message' => $message]);

        return service('response')->setStatusCode($status)->setJSON(['message' => 'Token no válido o sin permisos.']);
    }
}
