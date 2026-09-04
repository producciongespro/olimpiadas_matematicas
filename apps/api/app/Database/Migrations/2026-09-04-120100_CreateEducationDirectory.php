<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateEducationDirectory extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id'         => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'name'       => ['type' => 'VARCHAR', 'constraint' => 120],
            'is_active'  => ['type' => 'BOOLEAN', 'default' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('name');
        $this->forge->createTable('educational_regions', true);

        $this->forge->addField([
            'id'                    => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'educational_region_id' => ['type' => 'INT', 'unsigned' => true],
            'circuit_code'          => ['type' => 'VARCHAR', 'constraint' => 8],
            'name'                  => ['type' => 'VARCHAR', 'constraint' => 180],
            'institution_type'      => ['type' => 'VARCHAR', 'constraint' => 32],
            'email'                 => ['type' => 'VARCHAR', 'constraint' => 254],
            'created_at'            => ['type' => 'DATETIME', 'null' => true],
            'updated_at'            => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey(['educational_region_id', 'circuit_code']);
        $this->forge->addUniqueKey(['educational_region_id', 'circuit_code', 'name']);
        $this->forge->addForeignKey('educational_region_id', 'educational_regions', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->createTable('schools', true);
    }

    public function down(): void
    {
        $this->forge->dropTable('schools', true);
        $this->forge->dropTable('educational_regions', true);
    }
}
