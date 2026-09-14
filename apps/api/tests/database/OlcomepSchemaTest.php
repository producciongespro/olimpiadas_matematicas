<?php

use App\Database\Migrations\CreateEducationDirectory;
use App\Database\Migrations\CreateEditionsAndResources;
use App\Database\Migrations\CreateRegistrationDomain;
use App\Database\Migrations\CreateMediaGalleryDomain;
use App\Database\Migrations\CreateContentManagement;
use App\Database\Migrations\CreateAdminUsers;
use App\Database\Seeds\OlcomepInitialSeeder;
use App\Services\GalleryService;
use App\Services\ContentService;
use App\Services\AdminUserService;
use App\Exceptions\ForbiddenException;
use CodeIgniter\Database\Config as DatabaseConfig;
use CodeIgniter\Database\Migration;
use CodeIgniter\Test\CIUnitTestCase;

require_once APPPATH . 'Database/Migrations/2026-09-04-120000_CreateEditionsAndResources.php';
require_once APPPATH . 'Database/Migrations/2026-09-04-120100_CreateEducationDirectory.php';
require_once APPPATH . 'Database/Migrations/2026-09-04-120200_CreateRegistrationDomain.php';
require_once APPPATH . 'Database/Migrations/2026-09-08-120000_CreateMediaGalleryDomain.php';
require_once APPPATH . 'Database/Migrations/2026-09-14-120000_CreateContentManagement.php';
require_once APPPATH . 'Database/Migrations/2026-09-14-130000_CreateAdminUsers.php';

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
            new CreateContentManagement($forge),
            new CreateAdminUsers($forge),
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
        foreach (['editions', 'resources', 'educational_regions', 'schools', 'students', 'guardians', 'registrations', 'media_files', 'carousel_slides', 'events', 'event_images', 'content_sections', 'content_revisions', 'admin_users'] as $table) {
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

    public function testContentDraftDoesNotReplacePublishedHeroUntilPublish(): void
    {
        $seeder = new OlcomepInitialSeeder(config(\Config\Database::class), $this->db);
        $seeder->setSilent(true)->run();
        $service = new ContentService($this->db);
        $original = $service->publicHome()['hero']['content']['title'];
        $content = $service->adminSection('hero')['published']['content'];
        $content['title'] = 'Portada en revisión';

        $service->saveDraft('hero', $content);
        $this->assertSame($original, $service->publicHome()['hero']['content']['title']);

        $service->publish('hero');
        $this->assertSame('Portada en revisión', $service->publicHome()['hero']['content']['title']);
        $this->assertNull($service->adminSection('hero')['draft']);
    }

    public function testMasterCanCreateAnotherMaster(): void
    {
        $service = new AdminUserService($this->db);
        $master = $this->adminUser('master@mep.go.cr', 'master');
        $created = $service->create($master, ['email' => 'segundo.master@mep.go.cr', 'role' => 'master']);
        $this->assertSame('master', $created['role']);
        $this->assertSame(2, $this->db->table('admin_users')->where('role', 'master')->where('status', 'active')->countAllResults());
    }

    public function testAdministratorCanOnlyCreateEditors(): void
    {
        $service = new AdminUserService($this->db);
        $admin = $this->adminUser('admin@mep.go.cr', 'admin');
        $this->assertSame('editor', $service->create($admin, ['email' => 'editor@mep.go.cr', 'role' => 'editor'])['role']);
        $this->expectException(ForbiddenException::class);
        $service->create($admin, ['email' => 'otro.admin@mep.go.cr', 'role' => 'admin']);
    }

    public function testCannotDeactivateLastActiveMaster(): void
    {
        $service = new AdminUserService($this->db);
        $master = $this->adminUser('master@mep.go.cr', 'master');
        $other = $this->adminUser('admin@mep.go.cr', 'admin');
        $this->expectException(InvalidArgumentException::class);
        $service->update(array_merge($other, ['role' => 'master']), (int) $master['id'], ['status' => 'inactive']);
    }

    public function testCannotModifyOwnRole(): void
    {
        $service = new AdminUserService($this->db);
        $master = $this->adminUser('master@mep.go.cr', 'master');
        $this->expectException(ForbiddenException::class);
        $service->update($master, (int) $master['id'], ['role' => 'editor']);
    }

    private function adminUser(string $email, string $role): array
    {
        $now = date('Y-m-d H:i:s');
        $this->db->table('admin_users')->insert(['email' => $email, 'role' => $role, 'status' => 'active', 'created_at' => $now, 'updated_at' => $now]);
        return (new AdminUserService($this->db))->profile($this->db->table('admin_users')->where('id', $this->db->insertID())->get()->getRowArray());
    }
}
