<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateContentManagement extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'section_key' => ['type' => 'VARCHAR', 'constraint' => 80],
            'label' => ['type' => 'VARCHAR', 'constraint' => 120],
            'schema_version' => ['type' => 'SMALLINT', 'unsigned' => true, 'default' => 1],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('section_key');
        $this->forge->createTable('content_sections', true);

        $this->forge->addField([
            'id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'section_id' => ['type' => 'INT', 'unsigned' => true],
            'media_file_id' => ['type' => 'INT', 'unsigned' => true, 'null' => true],
            'content_json' => ['type' => 'LONGTEXT'],
            'status' => ['type' => 'VARCHAR', 'constraint' => 20, 'default' => 'draft'],
            'created_by' => ['type' => 'VARCHAR', 'constraint' => 180, 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'published_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey(['section_id', 'status']);
        $this->forge->addForeignKey('section_id', 'content_sections', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('media_file_id', 'media_files', 'id', 'CASCADE', 'SET NULL');
        $this->forge->createTable('content_revisions', true);
    }

    public function down(): void
    {
        $this->forge->dropTable('content_revisions', true);
        $this->forge->dropTable('content_sections', true);
    }
}
