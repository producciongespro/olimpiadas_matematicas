<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class Edition2026Seeder extends Seeder
{
    private const EDITION = [
        'year'               => 2026,
        'name'               => 'OLCOMEP 2026',
        'slug'               => 'olcomep-2026',
        'registration_start' => '2026-04-08',
        'registration_end'   => '2026-05-06',
        'status'             => 'published',
        'is_public'          => true,
    ];

    public function run(): void
    {
        $builder = $this->db->table('editions');
        $existing = $builder->where('year', self::EDITION['year'])->get()->getRowArray();
        $now = date('Y-m-d H:i:s');

        if ($existing === null) {
            $builder->insert(self::EDITION + [
                'created_at' => $now,
                'updated_at' => $now,
            ]);
            return;
        }

        $changes = [];
        foreach (self::EDITION as $field => $value) {
            if ((string) $existing[$field] !== (string) $value) {
                $changes[$field] = $value;
            }
        }

        if ($changes !== []) {
            $changes['updated_at'] = $now;
            $builder->where('id', $existing['id'])->update($changes);
        }
    }
}
