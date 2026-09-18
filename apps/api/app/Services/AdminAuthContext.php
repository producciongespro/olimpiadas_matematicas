<?php

namespace App\Services;

final class AdminAuthContext
{
    private array $claims = [];
    private array $user = [];
    private ?string $clientId = null;

    public function reset(): void
    {
        $this->claims = [];
        $this->user = [];
        $this->clientId = null;
    }

    public function authenticate(array $claims, array $user, ?string $clientId): void
    {
        $this->claims = $claims;
        $this->user = $user;
        $this->clientId = $clientId;
    }

    public function claims(): array
    {
        return $this->claims;
    }

    /** @return list<string> */
    public function roles(): array
    {
        $role = $this->user['role'] ?? null;

        return is_string($role) && $role !== '' ? [$role] : [];
    }

    public function isAdmin(): bool
    {
        return $this->user !== [];
    }

    public function clientId(): ?string
    {
        return $this->clientId;
    }

    public function user(): array
    {
        return $this->user;
    }
}
