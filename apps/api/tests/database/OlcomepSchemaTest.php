<?php

use App\Database\Migrations\CreateEducationDirectory;
use App\Database\Migrations\CreateEditionsAndResources;
use App\Database\Migrations\CreateRegistrationDomain;
use App\Database\Migrations\CreateMediaGalleryDomain;
use App\Database\Migrations\CreateContentManagement;
use App\Database\Migrations\CreateAdminUsers;
use App\Database\Migrations\CreateContentRevisionMedia;
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
require_once APPPATH . 'Database/Migrations/2026-09-18-120000_CreateContentRevisionMedia.php';

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
            new CreateContentRevisionMedia($forge),
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
        foreach (['editions', 'resources', 'educational_regions', 'schools', 'students', 'guardians', 'registrations', 'media_files', 'carousel_slides', 'events', 'event_images', 'content_sections', 'content_revisions', 'content_revision_media', 'admin_users'] as $table) {
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
        $this->assertSame(8, $this->db->table('content_sections')->countAllResults());
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

    public function testOlcomepIntroductionSupportsDraftAndPublication(): void
    {
        $seeder = new OlcomepInitialSeeder(config(\Config\Database::class), $this->db);
        $seeder->setSilent(true)->run();
        $service = new ContentService($this->db);
        $content = $service->adminSection('olcomep-introduction')['published']['content'];
        $content['title'] = 'Conoce la nueva OLCOMEP';

        $service->saveDraft('olcomep-introduction', $content);
        $this->assertSame('Una competencia que conecta al país', $service->publicHome()['olcomep-introduction']['content']['title']);

        $service->publish('olcomep-introduction');
        $this->assertSame('Conoce la nueva OLCOMEP', $service->publicHome()['olcomep-introduction']['content']['title']);
        $this->assertNull($service->adminSection('olcomep-introduction')['draft']);
    }

    public function testCalendarSupportsStructuredDraftAndPublication(): void
    {
        $seeder = new OlcomepInitialSeeder(config(\Config\Database::class), $this->db);
        $seeder->setSilent(true)->run();
        $service = new ContentService($this->db);
        $content = $service->adminSection('calendar')['published']['content'];
        $schedule = $content['schedule'];
        array_shift($schedule);
        array_shift($schedule);
        array_unshift($schedule, [
            'date' => '15 de marzo', 'dateTime' => '2026-03-15', 'title' => 'Nueva actividad',
            'description' => 'Actividad incorporada desde el gestor editorial.', 'highlighted' => true,
        ]);
        unset($content['schedule']);
        $content['schedule_json'] = json_encode($schedule, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $content['title'] = 'Cronograma oficial';

        $service->saveDraft('calendar', $content);
        $this->assertSame('Calendario', $service->publicHome()['calendar']['content']['title']);
        $draftSchedule = $service->adminSection('calendar')['draft']['content']['schedule'];
        $this->assertCount(11, $draftSchedule);
        $this->assertSame('Nueva actividad', $draftSchedule[0]['title']);

        $service->publish('calendar');
        $this->assertSame('Cronograma oficial', $service->publicHome()['calendar']['content']['title']);
    }

    public function testCalendarAcceptsAnEmptyActivityList(): void
    {
        $seeder = new OlcomepInitialSeeder(config(\Config\Database::class), $this->db);
        $seeder->setSilent(true)->run();
        $service = new ContentService($this->db);
        $content = $service->adminSection('calendar')['published']['content'];
        unset($content['schedule']);
        $content['schedule_json'] = '[]';

        $service->saveDraft('calendar', $content);

        $this->assertSame([], $service->adminSection('calendar')['draft']['content']['schedule']);
    }

    public function testPartnersSupportDynamicDraftWhilePreservingLogos(): void
    {
        $seeder = new OlcomepInitialSeeder(config(\Config\Database::class), $this->db);
        $seeder->setSilent(true)->run();
        $service = new ContentService($this->db);
        $content = $service->adminSection('partners')['published']['content'];
        $this->assertCount(5, $content['collaborators']);
        $this->assertArrayHasKey('logo_url', $content['collaborators'][0]);

        $content['collaborators'] = array_slice($content['collaborators'], 1);
        $content['sponsors'][] = ['key' => 'nuevo-patrocinador', 'name' => 'Nuevo patrocinador', 'description' => 'Apoyo institucional.'];
        $input = $content;
        unset($input['collaborators'], $input['sponsors']);
        $input['collaborators_json'] = json_encode($content['collaborators'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $input['sponsors_json'] = json_encode($content['sponsors'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $service->saveDraft('partners', $input);
        $draft = $service->adminSection('partners')['draft']['content'];
        $this->assertCount(4, $draft['collaborators']);
        $this->assertCount(2, $draft['sponsors']);
        $this->assertArrayHasKey('logo_url', $draft['collaborators'][0]);
        $this->assertCount(5, $service->publicHome()['partners']['content']['collaborators']);
    }

    public function testAboutSupportsDynamicMilestonesAndParagraphs(): void
    {
        $seeder = new OlcomepInitialSeeder(config(\Config\Database::class), $this->db);
        $seeder->setSilent(true)->run();
        $service = new ContentService($this->db);
        $content = $service->adminSection('about')['published']['content'];
        array_shift($content['milestones']);
        $content['milestones'][] = ['key' => 'nuevo-hito', 'period' => '2026', 'title' => 'Nuevo hito', 'description' => 'Descripción del nuevo hito.'];
        $content['introduction'][] = 'Un tercer párrafo introductorio.';
        $input = $content;
        unset($input['introduction'], $input['milestones'], $input['closing_paragraphs']);
        $input['introduction_json'] = json_encode($content['introduction'], JSON_UNESCAPED_UNICODE);
        $input['milestones_json'] = json_encode($content['milestones'], JSON_UNESCAPED_UNICODE);
        $input['closing_paragraphs_json'] = json_encode($content['closing_paragraphs'], JSON_UNESCAPED_UNICODE);

        $service->saveDraft('about', $input);
        $draft = $service->adminSection('about')['draft']['content'];
        $this->assertCount(3, $draft['introduction']);
        $this->assertSame('nuevo-hito', $draft['milestones'][5]['key']);
        $this->assertSame('Nuestra historia', $service->publicHome()['about']['content']['eyebrow']);
    }

    public function testGeneralInformationSupportsDynamicRoutesAndFaqs(): void
    {
        $seeder = new OlcomepInitialSeeder(config(\Config\Database::class), $this->db);
        $seeder->setSilent(true)->run();
        $service = new ContentService($this->db);
        $content = $service->adminSection('general-information')['published']['content'];
        array_shift($content['routes']);
        $content['faqs'][] = ['key' => 'nueva-pregunta', 'question' => '¿Nueva pregunta?', 'answer' => 'Nueva respuesta.'];
        $input = $content;
        unset($input['routes'], $input['faqs']);
        $input['routes_json'] = json_encode($content['routes'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $input['faqs_json'] = json_encode($content['faqs'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $service->saveDraft('general-information', $input);
        $draft = $service->adminSection('general-information')['draft']['content'];
        $this->assertCount(3, $draft['routes']);
        $this->assertCount(5, $draft['faqs']);
        $this->assertCount(4, $service->publicHome()['general-information']['content']['routes']);
    }

    public function testRegionalCoordinationsSupportDynamicRegionsContactsAndEmails(): void
    {
        $seeder = new OlcomepInitialSeeder(config(\Config\Database::class), $this->db);
        $seeder->setSilent(true)->run();
        $service = new ContentService($this->db);
        $content = $service->adminSection('regional-coordinations')['published']['content'];
        $content['regions_json'] = json_encode([
            [
                'region' => 'Región de prueba',
                'contacts' => [
                    ['name' => 'Contacto de prueba', 'emails' => ['CONTACTO@EXAMPLE.ORG']],
                ],
            ],
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $service->saveDraft('regional-coordinations', $content);
        $draft = $service->adminSection('regional-coordinations')['draft']['content'];

        $this->assertCount(1, $draft['regions']);
        $this->assertSame('contacto@example.org', $draft['regions'][0]['contacts'][0]['emails'][0]);
        $this->assertArrayNotHasKey('regions', $service->publicHome()['regional-coordinations']['content']);

        $service->publish('regional-coordinations');
        $this->assertSame('Región de prueba', $service->publicHome()['regional-coordinations']['content']['regions'][0]['region']);
    }

    public function testCurrentEditionSupportsDynamicDocumentsAndPublication(): void
    {
        $seeder = new OlcomepInitialSeeder(config(\Config\Database::class), $this->db);
        $seeder->setSilent(true)->run();
        $service = new ContentService($this->db);
        $content = $service->adminSection('current-edition')['published']['content'];
        $this->assertArrayHasKey('image_url', $content);
        array_shift($content['resources']);
        $content['resources'][] = ['key' => 'documento-prueba', 'title' => 'Documento de prueba', 'description' => 'Descripción de prueba.', 'format' => 'PDF', 'href' => '/documento-prueba.pdf', 'icon' => 'file'];
        $input = $content;
        unset($input['resources']);
        $input['resources_json'] = json_encode($content['resources'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $input['title'] = 'Edición de prueba';

        $service->saveDraft('current-edition', $input);
        $draft = $service->adminSection('current-edition')['draft']['content'];

        $this->assertCount(4, $draft['resources']);
        $this->assertSame('Edición OLCOMEP 2026', $service->publicHome()['current-edition']['content']['title']);
        $this->assertArrayHasKey('image_url', $draft);

        $service->publish('current-edition');
        $this->assertSame('Edición de prueba', $service->publicHome()['current-edition']['content']['title']);
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
