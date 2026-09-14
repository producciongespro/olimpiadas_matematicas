<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use RuntimeException;

class BootstrapMasterSeeder extends Seeder
{
    public function run(): void
    {
        $email = mb_strtolower(trim((string) env('auth.bootstrapMasterEmail', '')));
        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) throw new RuntimeException('Configure un correo válido en auth.bootstrapMasterEmail.');

        $builder = $this->db->table('admin_users');
        $existing = $builder->where('email', $email)->get()->getRowArray();
        if ($existing === null && $builder->countAllResults() > 0) throw new RuntimeException('El bootstrap solo puede crear el primer usuario cuando la tabla está vacía.');

        $now = date('Y-m-d H:i:s');
        if ($existing === null) {
            $builder->insert(['email' => $email, 'role' => 'master', 'status' => 'active', 'created_at' => $now, 'updated_at' => $now]);
            return;
        }

        if ($existing['role'] !== 'master' || $existing['status'] !== 'active') {
            throw new RuntimeException('La cuenta de bootstrap ya existe con un rol o estado diferente; debe revisarse desde una sesión Master activa.');
        }
    }
}
