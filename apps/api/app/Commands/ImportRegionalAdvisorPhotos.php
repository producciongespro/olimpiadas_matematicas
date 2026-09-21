<?php

namespace App\Commands;

use App\Services\ContentService;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use RuntimeException;

final class ImportRegionalAdvisorPhotos extends BaseCommand
{
    protected $group = 'Contenido';
    protected $name = 'content:import-regional-photos';
    protected $description = 'Importa fotografías identificadas de asesorías regionales a un borrador editorial.';
    protected $options = ['--move' => 'Retira de recursos-pendientes las fotografías verificadas después de importarlas.'];

    private const FILES = [
        'alajuela-lizbeth-arguedas' => 'asesorAlajuela.png',
        'canas-laura-briceno' => 'asesorCanas.png',
        'cartago-ana-navarro' => 'asesorCartago.png',
        'central-pacifico-marilu-rodriguez' => 'asesorCentralDelPacifico.png',
        'desamparados-yamil-fernandez' => 'asesorDesamparados.png',
        'grande-terraba-corry-castillo' => 'asesorGrandeTerraba.png',
        'guapiles-luis-mena' => 'asesorGuapiles.png',
        'liberia-gualberto-morales' => 'asesorLiberia.png',
        'los-santos-laura-urena' => 'asesorLosSantos.png',
        'perez-zeledon-henry-campos' => 'asesorPerezZeledon.png',
        'puntarenas-cristian-barrientos' => 'asesorPuntarenas.png',
        'san-carlos-erika-mendez' => 'asesorSanCarlos.png',
        'santa-cruz-krystel-fernandez' => 'asesorSantaCruz.png',
        'sula-ileana-lezcano' => 'asesorSula.png',
    ];

    public function run(array $params): void
    {
        $sourceDirectory = realpath(ROOTPATH . '../../recursos-pendientes/fotosAsesores');
        if ($sourceDirectory === false) throw new RuntimeException('No existe el directorio de fotografías pendientes.');
        $catalogPath = APPPATH . 'Database/Seeds/Data/regional-coordinations.json';
        $catalog = json_decode((string) file_get_contents($catalogPath), true, 512, JSON_THROW_ON_ERROR);
        if (! is_array($catalog)) throw new RuntimeException('El catálogo regional no es válido.');

        $sourceFiles = [];
        foreach (self::FILES as $key => $filename) {
            $path = $sourceDirectory . DIRECTORY_SEPARATOR . $filename;
            if (! is_file($path)) throw new RuntimeException("Falta la fotografía {$filename}.");
            $sourceFiles[$key] = $path;
        }

        $service = new ContentService();
        $state = $service->adminSection('regional-coordinations');
        $content = $state['draft']['content'] ?? $state['published']['content'] ?? [];
        if (($content['regions'] ?? []) === []) $content['regions'] = $catalog;
        $contactsByKey = [];
        foreach ($content['regions'] as $region) foreach ($region['contacts'] as $contact) $contactsByKey[$contact['key'] ?? ''] = $contact;
        $localFiles = array_filter($sourceFiles, static fn (string $path, string $key): bool => empty($contactsByKey[$key]['media_uuid']), ARRAY_FILTER_USE_BOTH);
        $content['regions_json'] = json_encode($content['regions'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
        $result = $service->saveDraft('regional-coordinations', $content, null, 'cli-import', [], $localFiles);

        $imported = 0;
        foreach ($result['draft']['content']['regions'] as $region) {
            foreach ($region['contacts'] as $contact) {
                if (isset(self::FILES[$contact['key'] ?? '']) && ! empty($contact['media_uuid'])) $imported++;
            }
        }
        if ($imported !== count(self::FILES)) throw new RuntimeException('El borrador no contiene todas las fotografías esperadas.');

        CLI::write("{$imported} fotografías importadas en un borrador sin modificar la publicación vigente.", 'green');
        if (CLI::getOption('move')) {
            $contactsByKey = [];
            foreach ($result['draft']['content']['regions'] as $region) foreach ($region['contacts'] as $contact) $contactsByKey[$contact['key'] ?? ''] = $contact;
            foreach ($sourceFiles as $key => $sourcePath) {
                $uuid = $contactsByKey[$key]['media_uuid'] ?? null;
                $media = $uuid === null ? null : db_connect()->table('media_files')->where('uuid', $uuid)->get()->getRowArray();
                $storedPath = $media === null ? null : WRITEPATH . 'uploads/' . $media['storage_path'];
                if ($storedPath === null || ! is_file($storedPath) || hash_file('sha256', $sourcePath) !== hash_file('sha256', $storedPath)) throw new RuntimeException('No se pudo verificar la copia almacenada de ' . basename($sourcePath) . '.');
            }
            foreach ($sourceFiles as $sourcePath) {
                if (! unlink($sourcePath)) throw new RuntimeException('No se pudo retirar ' . basename($sourcePath) . ' del directorio pendiente.');
            }
            CLI::write(count($sourceFiles) . ' PNG verificados y movidos fuera de recursos-pendientes.', 'green');
        }
        CLI::write('asesorHeredia.png permanece pendiente de identificar entre los dos contactos de Heredia.', 'yellow');
    }
}
