<?php

use App\Database\Migrations\CreateEducationDirectory;
use App\Database\Migrations\CreateEditionsAndResources;
use App\Database\Migrations\CreateRegistrationDomain;
use CodeIgniter\Database\Config as DatabaseConfig;
use CodeIgniter\Database\Migration;
use CodeIgniter\Test\CIUnitTestCase;

require_once APPPATH . 'Database/Migrations/2026-09-04-120000_CreateEditionsAndResources.php';
require_once APPPATH . 'Database/Migrations/2026-09-04-120100_CreateEducationDirectory.php';
require_once APPPATH . 'Database/Migrations/2026-09-04-120200_CreateRegistrationDomain.php';

/**
 * @internal
 */
final class OlcomepSchemaTest extends CIUnitTestCase
{
    /** @var list<Migration> */
    private array $domainMigrations = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->db = DatabaseConfig::connect('tests', true);
        $forge = DatabaseConfig::forge($this->db);
        $this->domainMigrations = [
            new CreateEditionsAndResources($forge),
            new CreateEducationDirectory($forge),
            new CreateRegistrationDomain($forge),
        ];

        foreach ($this->domainMigrations as $migration) {
            $migration->up();
        }
    }

    protected function tearDown(): void
    {
        foreach (array_reverse($this->domainMigrations) as $migration) {
            $migration->down();
        }

        $this->db->close();
        parent::tearDown();
    }

    public function testCreatesEveryDomainTable(): void
    {
        foreach (['editions', 'resources', 'educational_regions', 'schools', 'students', 'guardians', 'registrations'] as $table) {
            $this->assertTrue($this->db->tableExists($table), "No se creó la tabla {$table}.");
        }
    }

    public function testSensitiveIdentificationHasNoPlainTextColumn(): void
    {
        $fields = $this->db->getFieldNames('students');

        $this->assertContains('identification_encrypted', $fields);
        $this->assertContains('identification_hash', $fields);
        $this->assertContains('identification_last_four', $fields);
        $this->assertNotContains('identification', $fields);
    }

    public function testRegistrationHasAllRequiredRelations(): void
    {
        $foreignKeys = $this->db->getForeignKeyData('registrations');
        $referencedTables = array_map(
            static fn (object $key): string => preg_replace('/^db_/', '', $key->foreign_table_name),
            $foreignKeys,
        );

        sort($referencedTables);
        $this->assertSame(['editions', 'guardians', 'schools', 'students'], $referencedTables);
    }
}
