<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateRegistrationDomain extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id'                       => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'first_name'               => ['type' => 'VARCHAR', 'constraint' => 100],
            'first_surname'            => ['type' => 'VARCHAR', 'constraint' => 100],
            'second_surname'           => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => true],
            'biological_sex'           => ['type' => 'VARCHAR', 'constraint' => 16],
            'nationality_status'       => ['type' => 'VARCHAR', 'constraint' => 32],
            'identification_encrypted' => ['type' => 'TEXT'],
            'identification_hash'      => ['type' => 'CHAR', 'constraint' => 64],
            'identification_last_four' => ['type' => 'CHAR', 'constraint' => 4],
            'created_at'               => ['type' => 'DATETIME', 'null' => true],
            'updated_at'               => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('identification_hash');
        $this->forge->addKey(['first_surname', 'second_surname', 'first_name']);
        $this->forge->createTable('students', true);

        $this->forge->addField([
            'id'         => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'full_name'  => ['type' => 'VARCHAR', 'constraint' => 200],
            'email'      => ['type' => 'VARCHAR', 'constraint' => 254],
            'phone'      => ['type' => 'VARCHAR', 'constraint' => 24],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('email');
        $this->forge->createTable('guardians', true);

        $this->forge->addField([
            'id'                    => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'edition_id'            => ['type' => 'INT', 'unsigned' => true],
            'student_id'            => ['type' => 'INT', 'unsigned' => true],
            'school_id'             => ['type' => 'INT', 'unsigned' => true],
            'guardian_id'           => ['type' => 'INT', 'unsigned' => true],
            'grade'                 => ['type' => 'TINYINT', 'unsigned' => true],
            'guardian_relationship' => ['type' => 'VARCHAR', 'constraint' => 64],
            'source'                => ['type' => 'VARCHAR', 'constraint' => 24, 'default' => 'admin'],
            'status'                => ['type' => 'VARCHAR', 'constraint' => 24, 'default' => 'submitted'],
            'submitted_at'          => ['type' => 'DATETIME'],
            'created_at'            => ['type' => 'DATETIME', 'null' => true],
            'updated_at'            => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey(['edition_id', 'student_id']);
        $this->forge->addKey(['edition_id', 'status']);
        $this->forge->addKey(['school_id', 'edition_id']);
        $this->forge->addForeignKey('edition_id', 'editions', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->addForeignKey('student_id', 'students', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->addForeignKey('school_id', 'schools', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->addForeignKey('guardian_id', 'guardians', 'id', 'CASCADE', 'RESTRICT');
        $this->forge->createTable('registrations', true);
    }

    public function down(): void
    {
        $this->forge->dropTable('registrations', true);
        $this->forge->dropTable('guardians', true);
        $this->forge->dropTable('students', true);
    }
}
