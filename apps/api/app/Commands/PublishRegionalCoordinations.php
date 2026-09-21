<?php

namespace App\Commands;

use App\Services\ContentService;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

final class PublishRegionalCoordinations extends BaseCommand
{
    protected $group = 'Contenido';
    protected $name = 'content:publish-regional-coordinations';
    protected $description = 'Publica el borrador vigente de Coordinaciones regionales.';

    public function run(array $params): void
    {
        $result = (new ContentService())->publish('regional-coordinations');
        $contactsWithPhoto = 0;
        foreach ($result['published']['content']['regions'] ?? [] as $region) {
            foreach ($region['contacts'] ?? [] as $contact) {
                if (! empty($contact['photo_url'])) $contactsWithPhoto++;
            }
        }

        CLI::write("Coordinaciones regionales publicadas con {$contactsWithPhoto} fotografías.", 'green');
    }
}
