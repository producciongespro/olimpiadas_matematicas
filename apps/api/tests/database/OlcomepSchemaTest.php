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
use CodeIgniter\HTTP\Files\UploadedFile;
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
        $this->assertSame(9, $this->db->table('content_sections')->countAllResults());
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
        $originalVersion = $service->publicHomeSnapshot()['version'];
        $initialState = $service->adminSection('hero');
        $originalPublishedId = $initialState['published']['revision_id'];
        $content = $initialState['published']['content'];
        $content['title'] = 'Portada en revisión';
        $content['primary_href'] = 'https://example.com/destino-no-autorizado';
        $content['secondary_href'] = '#destino-no-autorizado';

        $service->saveDraft('hero', $content);
        $draftContent = $service->adminSection('hero')['draft']['content'];
        $this->assertSame('#edicion-vigente', $draftContent['primary_href']);
        $this->assertSame('#olimpiadas', $draftContent['secondary_href']);
        $this->assertSame($original, $service->publicHome()['hero']['content']['title']);
        $this->assertSame($originalVersion, $service->publicHomeSnapshot()['version']);
        $this->assertSame($originalPublishedId, $service->adminSection('hero')['published']['revision_id']);

        $service->publish('hero');
        $publishedState = $service->adminSection('hero');
        $this->assertNotSame($originalVersion, $service->publicHomeSnapshot()['version']);
        $this->assertSame('Portada en revisión', $service->publicHome()['hero']['content']['title']);
        $this->assertSame('#edicion-vigente', $service->publicHome()['hero']['content']['primary_href']);
        $this->assertSame('#olimpiadas', $service->publicHome()['hero']['content']['secondary_href']);
        $this->assertNull($publishedState['draft']);
        $this->assertNotSame($originalPublishedId, $publishedState['published']['revision_id']);

        $sectionId = (int) $this->db->table('content_sections')->select('id')->where('section_key', 'hero')->get()->getRowArray()['id'];
        $this->assertSame(1, $this->db->table('content_revisions')->where('section_id', $sectionId)->where('status', 'published')->countAllResults());
        $this->assertSame(0, $this->db->table('content_revisions')->where('section_id', $sectionId)->where('status', 'draft')->countAllResults());
        $this->assertSame(1, $this->db->table('content_revisions')->where('section_id', $sectionId)->where('status', 'superseded')->countAllResults());
    }

    public function testDraftMediaIsPrivateUntilItsRevisionIsPublished(): void
    {
        $seeder = new OlcomepInitialSeeder(config(\Config\Database::class), $this->db);
        $seeder->setSilent(true)->run();
        $content = new ContentService($this->db);
        $gallery = new GalleryService($this->db);
        $hero = $content->adminSection('hero')['published']['content'];
        $content->saveDraft('hero', $hero);

        $uuid = '12345678-1234-4123-8123-123456789abc';
        $now = date('Y-m-d H:i:s');
        $this->db->table('media_files')->insert([
            'uuid' => $uuid,
            'storage_path' => 'sections/hero/' . $uuid . '.jpg',
            'original_name' => 'hero-prueba.jpg',
            'mime_type' => 'image/jpeg',
            'size_bytes' => 1024,
            'width' => 640,
            'height' => 640,
            'checksum_sha256' => str_repeat('a', 64),
            'created_at' => $now,
            'updated_at' => $now,
        ]);
        $mediaId = (int) $this->db->insertID();
        $sectionId = (int) $this->db->table('content_sections')->select('id')->where('section_key', 'hero')->get()->getRowArray()['id'];
        $this->db->table('content_revisions')->where('section_id', $sectionId)->where('status', 'draft')->update(['media_file_id' => $mediaId]);

        $this->assertNull($gallery->media($uuid));
        $content->publish('hero');
        $this->assertNotNull($gallery->media($uuid));
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

    public function testCalendarManualRemainsPrivateUntilPublication(): void
    {
        $seeder = new OlcomepInitialSeeder(config(\Config\Database::class), $this->db);
        $seeder->setSilent(true)->run();
        $service = new ContentService($this->db);
        $content = $service->adminSection('calendar')['published']['content'];
        unset($content['schedule']);
        $content['schedule_json'] = json_encode($service->publicHome()['calendar']['content']['schedule'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $temporaryPath = tempnam(sys_get_temp_dir(), 'olcomep-manual-');
        $storedPath = null;

        try {
            file_put_contents($temporaryPath, "%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF\n");
            $manual = $this->createMock(UploadedFile::class);
            $manual->method('isValid')->willReturn(true);
            $manual->method('hasMoved')->willReturn(false);
            $manual->method('getSize')->willReturn(filesize($temporaryPath));
            $manual->method('getTempName')->willReturn($temporaryPath);
            $manual->method('getClientName')->willReturn('manual-olcomep-2027.pdf');
            $manual->method('move')->willReturnCallback(static function (string $target, ?string $name) use ($temporaryPath): bool {
                return copy($temporaryPath, rtrim($target, '/\\') . DIRECTORY_SEPARATOR . $name);
            });
            $service->saveDraft('calendar', $content, null, null, ['manual' => $manual]);

            $draft = $service->adminSection('calendar')['draft']['content'];
            $publishedBefore = $service->publicHome()['calendar']['content'];
            $this->assertArrayHasKey('manual_uuid', $draft);
            $this->assertSame('manual-olcomep-2027.pdf', $draft['manual_name']);
            $this->assertStringContainsString('/api/v1/media/' . $draft['manual_uuid'], $draft['manual_href']);
            $this->assertArrayNotHasKey('manual_uuid', $publishedBefore);
            $this->assertNull((new GalleryService($this->db))->media($draft['manual_uuid']));

            $row = $this->db->table('media_files')->where('uuid', $draft['manual_uuid'])->get()->getRowArray();
            $this->assertSame('application/pdf', $row['mime_type']);
            $storedPath = WRITEPATH . 'uploads/' . $row['storage_path'];
            $this->assertFileExists($storedPath);

            $service->publish('calendar');
            $published = $service->publicHome()['calendar']['content'];
            $this->assertSame($draft['manual_uuid'], $published['manual_uuid']);
            $this->assertSame('manual-olcomep-2027.pdf', $published['manual_name']);
            $this->assertNotNull((new GalleryService($this->db))->media($draft['manual_uuid']));
        } finally {
            if ($storedPath !== null && is_file($storedPath)) unlink($storedPath);
            if (is_file($temporaryPath)) unlink($temporaryPath);
        }
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

        $service->publish('partners');
        $published = $service->publicHome()['partners']['content'];
        $this->assertCount(4, $published['collaborators']);
        $this->assertCount(2, $published['sponsors']);
        $this->assertArrayHasKey('logo_url', $published['collaborators'][0]);
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
        $this->assertCount(27, $service->publicHome()['regional-coordinations']['content']['regions']);
        $this->assertNotSame('Región de prueba', $service->publicHome()['regional-coordinations']['content']['regions'][0]['region']);

        $service->publish('regional-coordinations');
        $this->assertSame('Región de prueba', $service->publicHome()['regional-coordinations']['content']['regions'][0]['region']);
    }

    public function testRegionalContactPhotoFollowsDraftPublicationAndRemoval(): void
    {
        $seeder = new OlcomepInitialSeeder(config(\Config\Database::class), $this->db);
        $seeder->setSilent(true)->run();
        $service = new ContentService($this->db);
        $section = $this->db->table('content_sections')->where('section_key', 'regional-coordinations')->get()->getRowArray();
        $published = $this->db->table('content_revisions')->where('section_id', $section['id'])->where('status', 'published')->get()->getRowArray();
        $now = date('Y-m-d H:i:s');
        $this->db->table('media_files')->insert([
            'uuid' => '11111111-1111-4111-8111-111111111111', 'storage_path' => 'sections/regional-coordinations/advisor.png',
            'original_name' => 'advisor.png', 'mime_type' => 'image/png', 'size_bytes' => 100,
            'width' => 500, 'height' => 700, 'checksum_sha256' => str_repeat('a', 64), 'created_at' => $now, 'updated_at' => $now,
        ]);
        $mediaId = (int) $this->db->insertID();
        $this->db->table('content_revision_media')->insert(['revision_id' => $published['id'], 'item_key' => 'advisor-asesor-prueba', 'media_file_id' => $mediaId, 'created_at' => $now]);

        $input = $service->adminSection('regional-coordinations')['published']['content'];
        $input['regions_json'] = json_encode([['region' => 'Región de prueba', 'contacts' => [['key' => 'asesor-prueba', 'name' => 'Contacto de prueba', 'emails' => []]]]], JSON_UNESCAPED_UNICODE);
        $service->saveDraft('regional-coordinations', $input);
        $draft = $service->adminSection('regional-coordinations')['draft']['content'];
        $this->assertSame('11111111-1111-4111-8111-111111111111', $draft['regions'][0]['contacts'][0]['media_uuid']);
        $this->assertArrayNotHasKey('photo_url', $service->publicHome()['regional-coordinations']['content']);

        $service->publish('regional-coordinations');
        $this->assertArrayHasKey('photo_url', $service->publicHome()['regional-coordinations']['content']['regions'][0]['contacts'][0]);

        $input = $service->adminSection('regional-coordinations')['published']['content'];
        $input['regions'][0]['contacts'][0]['remove_photo'] = true;
        $input['regions_json'] = json_encode($input['regions'], JSON_UNESCAPED_UNICODE);
        $service->saveDraft('regional-coordinations', $input);
        $this->assertArrayNotHasKey('photo_url', $service->adminSection('regional-coordinations')['draft']['content']['regions'][0]['contacts'][0]);
        $this->assertArrayHasKey('photo_url', $service->publicHome()['regional-coordinations']['content']['regions'][0]['contacts'][0]);
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

    public function testContactSupportsValidatedCollectionsAndPublication(): void
    {
        $seeder = new OlcomepInitialSeeder(config(\Config\Database::class), $this->db); $seeder->setSilent(true)->run();
        $service = new ContentService($this->db); $content = $service->adminSection('contact')['published']['content'];
        $input = $content; unset($input['phones'], $input['emails'], $input['resources']);
        $input['phones_json'] = json_encode(['+506 2222-3333']); $input['emails_json'] = json_encode(['CONTACTO@EXAMPLE.ORG']); $input['resources_json'] = json_encode([]);
        $service->saveDraft('contact', $input); $draft = $service->adminSection('contact')['draft']['content'];
        $this->assertSame('contacto@example.org', $draft['emails'][0]); $this->assertSame([], $draft['resources']);
        $this->assertSame('primero.segundo.ciclos@mep.go.cr', $service->publicHome()['contact']['content']['emails'][0]);
        $service->publish('contact'); $this->assertSame('+506 2222-3333', $service->publicHome()['contact']['content']['phones'][0]);
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
