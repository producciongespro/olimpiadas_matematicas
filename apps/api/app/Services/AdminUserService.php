<?php

namespace App\Services;

use App\Exceptions\ForbiddenException;
use CodeIgniter\Database\BaseConnection;
use InvalidArgumentException;
use RuntimeException;

class AdminUserService
{
    private const ROLES = ['master', 'admin', 'editor'];
    private const STATUSES = ['active', 'inactive'];
    private BaseConnection $db;

    public function __construct(?BaseConnection $db = null) { $this->db = $db ?? db_connect(); }

    public function authenticate(array $claims): array
    {
        $email = mb_strtolower(trim((string) ($claims['preferred_username'] ?? $claims['email'] ?? $claims['upn'] ?? '')));
        $oid = trim((string) ($claims['oid'] ?? ''));
        if (! filter_var($email, FILTER_VALIDATE_EMAIL) || $oid === '') throw new ForbiddenException('La identidad no contiene correo y oid válidos.');
        $this->validateDomain($email);
        $user = $this->db->table('admin_users')->groupStart()->where('entra_oid', $oid)->orWhere('email', $email)->groupEnd()->get()->getRowArray();
        if ($user === null && $this->db->table('admin_users')->countAllResults() === 0 && hash_equals($this->bootstrapEmail(), $email)) {
            $now = date('Y-m-d H:i:s');
            $this->db->table('admin_users')->insert(['email' => $email, 'entra_oid' => $oid, 'display_name' => $this->name($claims), 'role' => 'master', 'status' => 'active', 'last_login_at' => $now, 'created_at' => $now, 'updated_at' => $now]);
            $user = $this->find((int) $this->db->insertID());
        }
        if ($user === null || $user['status'] !== 'active') throw new ForbiddenException('La cuenta MEP no está autorizada para administrar OLCOMEP.');
        if ($user['entra_oid'] !== null && ! hash_equals((string) $user['entra_oid'], $oid)) throw new ForbiddenException('La identidad no coincide con la autorización registrada.');
        $changes = ['entra_oid' => $oid, 'last_login_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s')];
        $name = $this->name($claims); if ($name !== null) $changes['display_name'] = $name;
        $this->db->table('admin_users')->where('id', $user['id'])->update($changes);
        return $this->profile($this->find((int) $user['id']));
    }

    public function all(array $actor): array
    {
        $this->requireManager($actor);
        $builder = $this->db->table('admin_users');
        if ($actor['role'] === 'admin') $builder->where('role', 'editor');
        return array_map([$this, 'profile'], $builder->orderBy('role')->orderBy('email')->get()->getResultArray());
    }

    public function create(array $actor, array $input): array
    {
        $this->requireManager($actor);
        $role = $this->role($input['role'] ?? 'editor');
        $this->assertCanAssign($actor, $role);
        $email = mb_strtolower(trim((string) ($input['email'] ?? '')));
        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) throw new InvalidArgumentException('El correo institucional no es válido.');
        $this->validateDomain($email);
        if ($this->db->table('admin_users')->where('email', $email)->countAllResults() > 0) throw new InvalidArgumentException('La cuenta ya está registrada.');
        $now = date('Y-m-d H:i:s');
        $this->db->table('admin_users')->insert(['email' => $email, 'display_name' => $this->nullable($input['display_name'] ?? null), 'role' => $role, 'status' => 'active', 'created_by' => $actor['id'], 'updated_by' => $actor['id'], 'created_at' => $now, 'updated_at' => $now]);
        return $this->profile($this->find((int) $this->db->insertID()));
    }

    public function update(array $actor, int $id, array $input): array
    {
        $this->requireManager($actor);
        $target = $this->find($id);
        if ((int) $actor['id'] === $id && (array_key_exists('role', $input) || array_key_exists('status', $input))) throw new ForbiddenException('No puede modificar su propio rol o estado.');
        $role = array_key_exists('role', $input) ? $this->role($input['role']) : $target['role'];
        $status = array_key_exists('status', $input) ? $this->status($input['status']) : $target['status'];
        $this->assertCanAssign($actor, $role);
        if ($actor['role'] === 'admin' && $target['role'] !== 'editor') throw new ForbiddenException('Un Administrador solo puede gestionar Editores.');

        $this->db->transStart();
        $this->lockMasters();
        if ($target['role'] === 'master' && $target['status'] === 'active' && ($role !== 'master' || $status !== 'active') && $this->activeMasterCount() <= 1) {
            $this->db->transRollback();
            throw new InvalidArgumentException('El sistema debe conservar al menos un Master activo.');
        }
        $changes = ['role' => $role, 'status' => $status, 'updated_by' => $actor['id'], 'updated_at' => date('Y-m-d H:i:s')];
        if (array_key_exists('display_name', $input)) $changes['display_name'] = $this->nullable($input['display_name']);
        $this->db->table('admin_users')->where('id', $id)->update($changes);
        $this->db->transComplete();
        if (! $this->db->transStatus()) throw new RuntimeException('No fue posible actualizar la autorización.');
        return $this->profile($this->find($id));
    }

    public function profile(array $user): array
    {
        return ['id' => (int) $user['id'], 'email' => $user['email'], 'display_name' => $user['display_name'], 'role' => $user['role'], 'status' => $user['status'], 'last_login_at' => $user['last_login_at'], 'can_manage_users' => in_array($user['role'], ['master', 'admin'], true), 'assignable_roles' => $user['role'] === 'master' ? self::ROLES : ($user['role'] === 'admin' ? ['editor'] : [])];
    }

    private function find(int $id): array { $user = $this->db->table('admin_users')->where('id', $id)->get()->getRowArray(); if ($user === null) throw new InvalidArgumentException('La autorización no existe.'); return $user; }
    private function requireManager(array $actor): void { if (! in_array($actor['role'] ?? '', ['master', 'admin'], true)) throw new ForbiddenException('No tiene permisos para gestionar usuarios.'); }
    private function assertCanAssign(array $actor, string $role): void { if ($actor['role'] === 'admin' && $role !== 'editor') throw new ForbiddenException('Un Administrador solo puede crear o modificar Editores.'); }
    private function role(mixed $value): string { $value = (string) $value; if (! in_array($value, self::ROLES, true)) throw new InvalidArgumentException('El rol no es válido.'); return $value; }
    private function status(mixed $value): string { $value = (string) $value; if (! in_array($value, self::STATUSES, true)) throw new InvalidArgumentException('El estado no es válido.'); return $value; }
    private function activeMasterCount(): int { return $this->db->table('admin_users')->where('role', 'master')->where('status', 'active')->countAllResults(); }
    private function lockMasters(): void { if ($this->db->DBDriver === 'MySQLi') $this->db->query("SELECT id FROM admin_users WHERE role = 'master' AND status = 'active' FOR UPDATE")->getResultArray(); }
    private function bootstrapEmail(): string { $email = mb_strtolower(trim((string) env('auth.bootstrapMasterEmail', ''))); if ($email === '') throw new ForbiddenException('El Master inicial no está configurado.'); return $email; }
    private function name(array $claims): ?string { return $this->nullable($claims['name'] ?? null); }
    private function nullable(mixed $value): ?string { $value = trim((string) $value); return $value === '' ? null : mb_substr($value, 0, 180); }
    private function validateDomain(string $email): void { $allowed = array_values(array_filter(array_map('trim', explode(',', mb_strtolower((string) env('auth.allowedEmailDomains', 'mep.go.cr')))))); $domain = substr(strrchr($email, '@') ?: '', 1); if ($allowed === [] || ! in_array($domain, $allowed, true)) throw new ForbiddenException('El correo no pertenece a un dominio institucional autorizado.'); }
}
