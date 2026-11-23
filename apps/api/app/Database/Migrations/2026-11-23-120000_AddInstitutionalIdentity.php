<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddInstitutionalIdentity extends Migration
{
    public function up(): void
    {
        $sections = $this->db->table('content_sections');
        $existing = $sections->where('section_key', 'institutional-identity')->get()->getRowArray();
        if ($existing !== null) return;

        $now = date('Y-m-d H:i:s');
        $sections->insert([
            'section_key' => 'institutional-identity', 'label' => 'Identidad institucional',
            'schema_version' => 1, 'created_at' => $now, 'updated_at' => $now,
        ]);
        $this->db->table('content_revisions')->insert([
            'section_id' => $this->db->insertID(), 'content_json' => '{}',
            'status' => 'published', 'created_at' => $now, 'published_at' => $now,
        ]);
    }

    public function down(): void
    {
        $this->db->table('content_sections')->where('section_key', 'institutional-identity')->delete();
    }
}
