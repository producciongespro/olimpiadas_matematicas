<?php

namespace App\Commands;

use App\Services\DocumentationAudit;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use RuntimeException;

final class CheckDocumentation extends BaseCommand
{
    protected $group = 'Documentación';
    protected $name = 'docs:check';
    protected $description = 'Comprueba sincronización y cobertura de rutas en OpenAPI.';

    public function run(array $params): void
    {
        $source = APPPATH . 'Docs/api/openapi-v1.yaml';
        $published = FCPATH . 'openapi/openapi-v1.yaml';
        if (! is_file($published) || hash_file('sha256', $source) !== hash_file('sha256', $published)) {
            throw new RuntimeException('La copia pública está desactualizada. Ejecute php spark docs:sync.');
        }

        $result = (new DocumentationAudit())->compare(service('routes'), $source);
        foreach ($result['missing'] as $operation) {
            CLI::error("Falta en OpenAPI: {$operation}");
        }
        foreach ($result['extra'] as $operation) {
            CLI::error("No existe en Routes.php: {$operation}");
        }
        if ($result['missing'] !== [] || $result['extra'] !== []) {
            throw new RuntimeException('OpenAPI no coincide con las rutas reales.');
        }

        CLI::write('OpenAPI sincronizado y consistente con las rutas /api/v1.', 'green');
    }
}
