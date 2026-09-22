<?php

use CodeIgniter\Exceptions\PageNotFoundException;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\FeatureTestTrait;

/** @internal */
final class DocumentationFeatureTest extends CIUnitTestCase
{
    use FeatureTestTrait;

    public function testPortalAndOpenApiAreAvailableOutsideProduction(): void
    {
        $portal = $this->get('docs');
        $portal->assertOK();
        $portal->assertSee('swagger-ui');
        $this->assertStringContainsString('<base href="/docs/">', $portal->getBody());

        $asset = $this->get('docs/assets/portal.css');
        $asset->assertOK();
        $asset->assertHeader('Content-Type', 'text/css; charset=UTF-8');

        $swaggerCss = $this->get('docs/assets/swagger-ui.css');
        $swaggerCss->assertOK();
        $swaggerCss->assertHeader('Content-Type', 'text/css; charset=UTF-8');
        $swaggerScript = $this->get('docs/assets/swagger-ui-bundle.js');
        $swaggerScript->assertOK();
        $swaggerScript->assertHeader('Content-Type', 'application/javascript; charset=UTF-8');
        $this->assertStringNotContainsString('unpkg.com', $portal->getBody());

        $openApi = $this->get('docs/api/openapi-v1.yaml');
        $openApi->assertOK();
        $openApi->assertHeader('Content-Type', 'application/yaml; charset=UTF-8');
        $openApi->assertSee('openapi: 3.1.0');
    }

    public function testOnlyAllowlistedDocumentsAreServed(): void
    {
        $security = $this->get('docs/markdown/security.md');
        $security->assertOK();
        $security->assertSee('# Seguridad');
        $this->get('docs/api/otro.yaml')->assertStatus(404);
        $this->get('docs/assets/secreto.css')->assertStatus(404);
        $this->get('docs/markdown/secreto.env')->assertStatus(404);
        $this->expectException(PageNotFoundException::class);
        $this->get('docs/markdown/%2e%2e%2fsecurity.md')->assertStatus(404);
    }

    public function testDocumentationRoutesAreGuardedByEnvironment(): void
    {
        $routes = (string) file_get_contents(APPPATH . 'Config/Routes.php');
        $this->assertStringContainsString("ENVIRONMENT !== 'production'", $routes);
        $this->assertStringContainsString("'docs/api/(:segment)'", $routes);
        $this->assertStringContainsString("'docs/assets/(:segment)'", $routes);
    }
}
