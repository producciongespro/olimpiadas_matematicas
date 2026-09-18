<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateContentRevisionMedia extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'revision_id' => ['type' => 'INT', 'unsigned' => true],
            'item_key' => ['type' => 'VARCHAR', 'constraint' => 80],
            'media_file_id' => ['type' => 'INT', 'unsigned' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey(['revision_id', 'item_key']);
        $this->forge->addKey('media_file_id');
        $this->forge->addForeignKey('revision_id', 'content_revisions', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('media_file_id', 'media_files', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->createTable('content_revision_media', true);
    }

    public function down(): void
    {
        $this->forge->dropTable('content_revision_media', true);
    }
}
