<?php

namespace App\Services;

use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use RuntimeException;

final class MicrosoftJwtValidator
{
    public function __construct(
        private readonly string $tenantId,
        private readonly string $audience,
        private readonly string $requiredScope,
        private readonly array $jwks,
        private readonly int $leeway = 300,
        private readonly array $allowedClientIds = [],
    ) {
    }

    public function validate(string $token): array
    {
        if ($this->tenantId === '' || $this->audience === '' || $this->requiredScope === '') throw new RuntimeException('La autenticación de Microsoft no está configurada.');
        $previousLeeway = JWT::$leeway;
        JWT::$leeway = $this->leeway;
        try { $claims = (array) JWT::decode($token, JWK::parseKeySet($this->jwks, 'RS256')); }
        finally { JWT::$leeway = $previousLeeway; }

        $issuer = rtrim((string) ($claims['iss'] ?? ''), '/');
        $issuers = ['https://login.microsoftonline.com/' . $this->tenantId . '/v2.0', 'https://sts.windows.net/' . $this->tenantId];
        $audiences = is_array($claims['aud'] ?? null) ? $claims['aud'] : [$claims['aud'] ?? ''];
        $scopes = preg_split('/\s+/', trim((string) ($claims['scp'] ?? ''))) ?: [];
        $clientId = trim((string) ($claims['azp'] ?? $claims['appid'] ?? ''));

        if (! hash_equals($this->tenantId, (string) ($claims['tid'] ?? '')) || ! in_array($issuer, $issuers, true)) throw new RuntimeException('Tenant o emisor no permitido.');
        if (array_intersect($this->audienceCandidates(), $audiences) === []) throw new RuntimeException('Audiencia no permitida.');
        if (! in_array($this->requiredScope, $scopes, true)) throw new RuntimeException('El token no contiene el permiso requerido.');
        if ($this->allowedClientIds === [] || ! in_array($clientId, $this->allowedClientIds, true)) throw new RuntimeException('Aplicación cliente no permitida.');
        return $claims;
    }

    private function audienceCandidates(): array
    {
        $audience = rtrim($this->audience, '/');
        $applicationId = str_starts_with($audience, 'api://') ? substr($audience, 6) : $audience;
        if (! preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $applicationId)) return [$audience];
        return array_values(array_unique([$audience, $applicationId, 'api://' . $applicationId]));
    }
}
