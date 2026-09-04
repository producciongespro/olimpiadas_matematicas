<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateEditionsAndResources extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id'                 => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'year'               => ['type' => 'SMALLINT', 'unsigned' => true],
            'name'               => ['type' => 'VARCHAR', 'constraint' => 120],
            'slug'               => ['type' => 'VARCHAR', 'constraint' => 80],
            'registration_start' => ['type' => 'DATE', 'null' => true],
            'registration_end'   => ['type' => 'DATE', 'null' => true],
            'status'             => ['type' => 'VARCHAR', 'constraint' => 20, 'default' => 'draft'],
            'is_public'          => ['type' => 'BOOLEAN', 'default' => false],
            'created_at'         => ['type' => 'DATETIME', 'null' => true],
            'updated_at'         => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('year');
        $this->forge->addUniqueKey('slug');
        $this->forge->addKey(['status', 'is_public']);
        $this->forge->createTable('editions', true);

        $this->forge->addField([
            'id'            => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'edition_id'    => ['type' => 'INT', 'unsigned' => true, 'null' => true],
            'title'         => ['type' => 'VARCHAR', 'constraint' => 180],
            'resource_type' => ['type' => 'VARCHAR', 'constraint' => 32],
            'audience'      => ['type' => 'VARCHAR', 'constraint' => 32, 'null' => true],
            'grade'         => ['type' => 'TINYINT', 'unsigned' => true, 'null' => true],
            'url'           => ['type' => 'VARCHAR', 'constraint' => 512],
            'thumbnail_url' => ['type' => 'VARCHAR', 'constraint' => 512, 'null' => true],
            'is_external'   => ['type' => 'BOOLEAN', 'default' => false],
            'sort_order'    => ['type' => 'SMALLINT', 'unsigned' => true, 'default' => 0],
            'published_at'  => ['type' => 'DATETIME', 'null' => true],
            'created_at'    => ['type' => 'DATETIME', 'null' => true],
            'updated_at'    => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey(['edition_id', 'resource_type']);
        $this->forge->addKey(['audience', 'grade']);
        $this->forge->addForeignKey('edition_id', 'editions', 'id', 'CASCADE', 'SET NULL');
        $this->forge->createTable('resources', true);
    }

    public function down(): void
    {
        $this->forge->dropTable('resources', true);
        $this->forge->dropTable('editions', true);
    }
}
