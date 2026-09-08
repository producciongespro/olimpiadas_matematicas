<?php

use App\Database\Migrations\CreateEducationDirectory;
use App\Database\Migrations\CreateEditionsAndResources;
use App\Database\Migrations\CreateRegistrationDomain;
use App\Database\Migrations\CreateMediaGalleryDomain;
use App\Database\Seeds\OlcomepInitialSeeder;
use App\Services\GalleryService;
use CodeIgniter\Database\Config as DatabaseConfig;
use CodeIgniter\Database\Migration;
use CodeIgniter\Test\CIUnitTestCase;

require_once APPPATH . 'Database/Migrations/2026-09-04-120000_CreateEditionsAndResources.php';
require_once APPPATH . 'Database/Migrations/2026-09-04-120100_CreateEducationDirectory.php';
require_once APPPATH . 'Database/Migrations/2026-09-04-120200_CreateRegistrationDomain.php';
require_once APPPATH . 'Database/Migrations/2026-09-08-120000_CreateMediaGalleryDomain.php';

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
            new CreateMediaGalleryDomain($forge),
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
        foreach (['editions', 'resources', 'educational_regions', 'schools', 'students', 'guardians', 'registrations', 'media_files', 'carousel_slides', 'events', 'event_images'] as $table) {
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

    public function testInitialSeederIsIdempotent(): void
    {
        $seeder = new OlcomepInitialSeeder(config(\Config\Database::class), $this->db);
        $seeder->setSilent(true)->run();

        $edition = $this->db->table('editions')->where('year', 2026)->get()->getRowArray();

        $this->assertNotNull($edition);
        $this->assertSame('2026-04-08', $edition['registration_start']);
        $this->assertSame('2026-05-06', $edition['registration_end']);

        $seeder->run();

        $this->assertSame($edition, $this->db->table('editions')->where('year', 2026)->get()->getRowArray());
        $this->assertSame(0, $this->db->table('educational_regions')->countAllResults());
        $this->assertSame(0, $this->db->table('events')->countAllResults());
        $this->assertSame(15, $this->db->table('carousel_slides')->countAllResults());
    }

    public function testPublishedLegacyCarouselIsAvailableThroughService(): void
    {
        $seeder = new OlcomepInitialSeeder(config(\Config\Database::class), $this->db);
        $seeder->setSilent(true)->run();

        $service = new GalleryService($this->db);
        $slides = $service->publicCarousel();
        $events = $service->events();

        $this->assertCount(15, $slides);
        $this->assertSame('Actividad educativa de OLCOMEP, fotografía 1', $slides[0]['alt_text']);
        $this->assertCount(0, $events);
        $this->assertNotNull($service->media($slides[0]['media_uuid']));
    }

    public function testEmptyEventCannotBePublished(): void
    {
        $service = new GalleryService($this->db);
        $event = $service->createEvent(['name' => 'Evento de prueba']);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('al menos una fotografía');
        $service->updateEvent((int) $event['id'], ['status' => 'published']);
    }
}
