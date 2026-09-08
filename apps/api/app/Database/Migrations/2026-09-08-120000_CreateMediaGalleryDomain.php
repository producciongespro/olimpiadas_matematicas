<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateMediaGalleryDomain extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'uuid' => ['type' => 'VARCHAR', 'constraint' => 36],
            'storage_path' => ['type' => 'VARCHAR', 'constraint' => 512],
            'original_name' => ['type' => 'VARCHAR', 'constraint' => 255],
            'mime_type' => ['type' => 'VARCHAR', 'constraint' => 40],
            'size_bytes' => ['type' => 'INT', 'unsigned' => true],
            'width' => ['type' => 'INT', 'unsigned' => true],
            'height' => ['type' => 'INT', 'unsigned' => true],
            'checksum_sha256' => ['type' => 'VARCHAR', 'constraint' => 64],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('uuid');
        $this->forge->addKey('checksum_sha256');
        $this->forge->createTable('media_files', true);

        $this->forge->addField([
            'id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'media_file_id' => ['type' => 'INT', 'unsigned' => true],
            'title' => ['type' => 'VARCHAR', 'constraint' => 180, 'null' => true],
            'alt_text' => ['type' => 'VARCHAR', 'constraint' => 255],
            'link_url' => ['type' => 'VARCHAR', 'constraint' => 512, 'null' => true],
            'link_label' => ['type' => 'VARCHAR', 'constraint' => 120, 'null' => true],
            'sort_order' => ['type' => 'SMALLINT', 'unsigned' => true, 'default' => 0],
            'status' => ['type' => 'VARCHAR', 'constraint' => 20, 'default' => 'draft'],
            'published_at' => ['type' => 'DATETIME', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('media_file_id');
        $this->forge->addKey(['status', 'sort_order']);
        $this->forge->addForeignKey('media_file_id', 'media_files', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->createTable('carousel_slides', true);

        $this->forge->addField([
            'id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'uuid' => ['type' => 'VARCHAR', 'constraint' => 36],
            'name' => ['type' => 'VARCHAR', 'constraint' => 180],
            'slug' => ['type' => 'VARCHAR', 'constraint' => 180],
            'event_date' => ['type' => 'DATE', 'null' => true],
            'description' => ['type' => 'TEXT', 'null' => true],
            'status' => ['type' => 'VARCHAR', 'constraint' => 20, 'default' => 'draft'],
            'published_at' => ['type' => 'DATETIME', 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('uuid');
        $this->forge->addUniqueKey('slug');
        $this->forge->addKey(['status', 'event_date']);
        $this->forge->createTable('events', true);

        $this->forge->addField([
            'id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'event_id' => ['type' => 'INT', 'unsigned' => true],
            'media_file_id' => ['type' => 'INT', 'unsigned' => true],
            'alt_text' => ['type' => 'VARCHAR', 'constraint' => 255],
            'caption' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'sort_order' => ['type' => 'SMALLINT', 'unsigned' => true, 'default' => 0],
            'is_cover' => ['type' => 'BOOLEAN', 'default' => false],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('media_file_id');
        $this->forge->addKey(['event_id', 'sort_order']);
        $this->forge->addForeignKey('event_id', 'events', 'id', 'CASCADE', 'CASCADE');
        $this->forge->addForeignKey('media_file_id', 'media_files', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->createTable('event_images', true);
    }

    public function down(): void
    {
        $this->forge->dropTable('event_images', true);
        $this->forge->dropTable('events', true);
        $this->forge->dropTable('carousel_slides', true);
        $this->forge->dropTable('media_files', true);
    }
}
