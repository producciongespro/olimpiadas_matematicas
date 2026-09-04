<?php

namespace App\Filters;

use App\Models\ApiAuditLogModel;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Throwable;

class ApiAuditFilter implements FilterInterface
{
    /** @var array<int, array{requestId: string}> */
    private array $contexts = [];

    public function before(RequestInterface $request, $arguments = null): ?ResponseInterface
    {
        if (! $this->enabled() || strtoupper($request->getMethod()) === 'OPTIONS') {
            return null;
        }

        $this->contexts[spl_object_id($request)] = ['requestId' => bin2hex(random_bytes(16))];

        return null;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null): ResponseInterface
    {
        $context = $this->contexts[spl_object_id($request)] ?? null;
        unset($this->contexts[spl_object_id($request)]);

        if ($context === null) {
            return $response;
        }

        $response->setHeader('X-Request-Id', $context['requestId']);
        $claims = service('request')->jwtClaims ?? [];
        $roles = service('request')->azureRoles ?? [];
        [$resourceType, $resourceId] = $this->resource($request);

        try {
            (new ApiAuditLogModel())->insert([
                'created_at'  => date('Y-m-d H:i:s'),
                'request_id'  => $context['requestId'],
                'oid'         => $this->claim($claims, 'oid'),
                'tid'         => $this->claim($claims, 'tid'),
                'azp'         => $this->claim($claims, 'azp') ?? $this->claim($claims, 'appid'),
                'roles'       => $this->roles($roles),
                'http_method' => strtoupper($request->getMethod()),
                'endpoint'    => '/' . ltrim($request->getUri()->getPath(), '/'),
                'status_code' => $response->getStatusCode(),
                'resource_type' => $resourceType,
                'resource_id' => $resourceId,
                'ip_hash'     => $this->ipHash($request),
            ], false);
        } catch (Throwable $exception) {
            log_message('error', 'No se pudo registrar la auditoría de API: {message}', ['message' => $exception->getMessage()]);
        }

        return $response;
    }

    private function enabled(): bool
    {
        return filter_var(env('audit.enabled', false), FILTER_VALIDATE_BOOL);
    }

    private function claim(mixed $claims, string $key): ?string
    {
        $value = is_array($claims) ? ($claims[$key] ?? null) : null;

        return is_string($value) && trim($value) !== '' ? trim($value) : null;
    }

    private function roles(mixed $roles): ?string
    {
        if (! is_array($roles) || $roles === []) {
            return null;
        }

        return json_encode(array_values($roles), JSON_UNESCAPED_UNICODE) ?: null;
    }

    private function ipHash(RequestInterface $request): ?string
    {
        $salt = trim((string) env('audit.ipHashSalt', ''));

        return $salt === '' ? null : hash('sha256', $salt . '|' . $request->getIPAddress());
    }

    /**
     * @return array{0: ?string, 1: ?string}
     */
    private function resource(RequestInterface $request): array
    {
        $segments = array_values(array_filter(explode('/', trim($request->getUri()->getPath(), '/'))));
        $admin = array_search('admin', $segments, true);

        if ($admin === false || ! isset($segments[$admin + 1])) {
            return [null, null];
        }

        $resourceType = $segments[$admin + 1];
        $resourceId = $segments[$admin + 2] ?? null;

        return [$resourceType, is_string($resourceId) && ctype_digit($resourceId) ? $resourceId : null];
    }
}
