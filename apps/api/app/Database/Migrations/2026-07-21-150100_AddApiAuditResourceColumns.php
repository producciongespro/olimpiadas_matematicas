<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddApiAuditResourceColumns extends Migration
{
    public function up(): void
    {
        $this->forge->addColumn('api_audit_log', [
            'resource_type' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true, 'after' => 'status_code'],
            'resource_id' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true, 'after' => 'resource_type'],
        ]);
        $this->forge->addKey(['resource_type', 'resource_id']);
        $this->forge->processIndexes('api_audit_log');
    }

    public function down(): void
    {
        $this->forge->dropColumn('api_audit_log', ['resource_type', 'resource_id']);
    }
}
