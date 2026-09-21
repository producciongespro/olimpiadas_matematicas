<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use RuntimeException;

final class SyncDocumentation extends BaseCommand
{
    protected $group = 'Documentación';
    protected $name = 'docs:sync';
    protected $description = 'Publica la copia del contrato OpenAPI canónico.';

    public function run(array $params): void
    {
        $source = APPPATH . 'Docs/api/openapi-v1.yaml';
        $targetDirectory = FCPATH . 'openapi';
        $target = $targetDirectory . '/openapi-v1.yaml';
        if (! is_dir($targetDirectory) && ! mkdir($targetDirectory, 0755, true) && ! is_dir($targetDirectory)) {
            throw new RuntimeException('No se pudo crear el directorio público de documentación.');
        }
        if (! copy($source, $target)) {
            throw new RuntimeException('No se pudo publicar el contrato OpenAPI.');
        }
        CLI::write('Contrato sincronizado en public/openapi/openapi-v1.yaml.', 'green');
    }
}
