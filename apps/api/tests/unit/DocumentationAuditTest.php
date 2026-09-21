<?php

use App\Services\DocumentationAudit;
use CodeIgniter\Test\CIUnitTestCase;

/** @internal */
final class DocumentationAuditTest extends CIUnitTestCase
{
    public function testPublishedContractMatchesCanonicalSource(): void
    {
        $source = APPPATH . 'Docs/api/openapi-v1.yaml';
        $published = FCPATH . 'openapi/openapi-v1.yaml';
        $this->assertFileExists($published);
        $this->assertSame(hash_file('sha256', $source), hash_file('sha256', $published));
    }

    public function testEveryApiRouteIsRepresentedInOpenApi(): void
    {
        $result = (new DocumentationAudit())->compare(service('routes'), APPPATH . 'Docs/api/openapi-v1.yaml');
        $this->assertSame([], $result['missing'], 'Hay rutas reales ausentes en OpenAPI.');
        $this->assertSame([], $result['extra'], 'OpenAPI documenta rutas inexistentes.');
    }

    public function testContractDeclaresPublicAndAdministrativeSecurity(): void
    {
        $contract = (string) file_get_contents(APPPATH . 'Docs/api/openapi-v1.yaml');
        $this->assertStringContainsString('openapi: 3.1.0', $contract);
        $this->assertStringContainsString('entraBearer:', $contract);
        $this->assertStringContainsString('security: []', $contract);
        $this->assertStringContainsString('enum: [hero, presentation, calendar, partners, about, general-information, regional-coordinations, current-edition, contact]', $contract);
    }
}
