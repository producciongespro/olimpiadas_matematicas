<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAdminUsers extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'email' => ['type' => 'VARCHAR', 'constraint' => 190],
            'entra_oid' => ['type' => 'VARCHAR', 'constraint' => 64, 'null' => true],
            'display_name' => ['type' => 'VARCHAR', 'constraint' => 180, 'null' => true],
            'role' => ['type' => 'VARCHAR', 'constraint' => 20],
            'status' => ['type' => 'VARCHAR', 'constraint' => 20, 'default' => 'active'],
            'created_by' => ['type' => 'INT', 'unsigned' => true, 'null' => true],
            'updated_by' => ['type' => 'INT', 'unsigned' => true, 'null' => true],
            'last_login_at' => ['type' => 'DATETIME', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('email');
        $this->forge->addUniqueKey('entra_oid');
        $this->forge->addKey(['role', 'status']);
        $this->forge->addForeignKey('created_by', 'admin_users', 'id', 'CASCADE', 'SET NULL');
        $this->forge->addForeignKey('updated_by', 'admin_users', 'id', 'CASCADE', 'SET NULL');
        $this->forge->createTable('admin_users', true);
    }

    public function down(): void { $this->forge->dropTable('admin_users', true); }
}
