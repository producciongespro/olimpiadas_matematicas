<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateApiAuditLog extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'created_at' => ['type' => 'DATETIME'],
            'request_id' => ['type' => 'CHAR', 'constraint' => 32],
            'oid' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'tid' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'azp' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'roles' => ['type' => 'TEXT', 'null' => true],
            'http_method' => ['type' => 'VARCHAR', 'constraint' => 10],
            'endpoint' => ['type' => 'VARCHAR', 'constraint' => 255],
            'status_code' => ['type' => 'SMALLINT', 'unsigned' => true],
            'ip_hash' => ['type' => 'CHAR', 'constraint' => 64, 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('created_at');
        $this->forge->addKey(['oid', 'created_at']);
        $this->forge->addKey(['request_id']);
        $this->forge->createTable('api_audit_log', true);
    }

    public function down(): void
    {
        $this->forge->dropTable('api_audit_log', true);
    }
}
