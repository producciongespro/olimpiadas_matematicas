<?php

namespace App\Services;

use App\Repositories\ContentRepository;
use CodeIgniter\Database\BaseConnection;
use CodeIgniter\HTTP\Files\UploadedFile;
use InvalidArgumentException;
use RuntimeException;

class ContentService
{
    private BaseConnection $db;
    private ContentRepository $repository;
    private MediaStorageService $storage;

    public function __construct(?BaseConnection $db = null)
    {
        $this->db = $db ?? db_connect();
        $this->repository = new ContentRepository($this->db);
        $this->storage = new MediaStorageService();
    }

    public function publicHome(): array
    {
        $result = [];
        foreach ($this->repository->sections() as $section) {
            $revision = $this->repository->revision((int) $section['id'], 'published');
            if ($revision !== null) $result[$section['section_key']] = $this->present($revision);
        }
        return $result;
    }

    public function adminSections(): array
    {
        return array_map(fn (array $section): array => $this->adminSection($section['section_key']), $this->repository->sections());
    }

    public function adminSection(string $key): array
    {
        $section = $this->requireSection($key);
        return [
            'key' => $section['section_key'], 'label' => $section['label'], 'schema_version' => (int) $section['schema_version'],
            'draft' => $this->nullablePresent($this->repository->revision((int) $section['id'], 'draft')),
            'published' => $this->nullablePresent($this->repository->revision((int) $section['id'], 'published')),
        ];
    }

    public function saveDraft(string $key, array $input, ?UploadedFile $file = null, ?string $actor = null, array $files = []): array
    {
        $section = $this->requireSection($key);
        $content = $this->validate($key, $input);
        $published = $this->repository->revision((int) $section['id'], 'published');
        $draft = $this->repository->revision((int) $section['id'], 'draft');
        $sourceRevision = $draft ?? $published;
        $newMedia = null;
        if ($file !== null && $file->isValid()) $newMedia = $this->storage->store($file, 'sections/' . $key, $key === 'current-edition' ? 300 : null);
        $mediaId = $newMedia === null ? ($draft['media_file_id'] ?? $published['media_file_id'] ?? null) : null;
        $now = date('Y-m-d H:i:s');

        $this->db->transStart();
        if ($draft !== null) $this->db->table('content_revisions')->where('id', $draft['id'])->update(['status' => 'superseded']);
        if ($newMedia !== null) {
            $this->db->table('media_files')->insert($newMedia);
            $mediaId = $this->db->insertID();
        }
        $this->db->table('content_revisions')->insert([
            'section_id' => $section['id'], 'media_file_id' => $mediaId,
            'content_json' => json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'status' => 'draft', 'created_by' => $actor, 'created_at' => $now,
        ]);
        $revisionId = (int) $this->db->insertID();
        if ($key === 'partners') $this->savePartnerMedia($revisionId, $content, $files, $sourceRevision);
        $this->db->table('content_sections')->where('id', $section['id'])->update(['updated_at' => $now]);
        $this->db->transComplete();
        if (! $this->db->transStatus()) {
            if ($newMedia !== null) $this->storage->delete($newMedia['storage_path']);
            throw new RuntimeException('No fue posible guardar el borrador.');
        }
        return $this->adminSection($key);
    }

    public function publish(string $key): array
    {
        $section = $this->requireSection($key);
        $draft = $this->repository->revision((int) $section['id'], 'draft');
        if ($draft === null) throw new InvalidArgumentException('La sección no tiene un borrador para publicar.');
        $now = date('Y-m-d H:i:s');
        $this->db->transStart();
        $this->db->table('content_revisions')->where('section_id', $section['id'])->where('status', 'published')->update(['status' => 'superseded']);
        $this->db->table('content_revisions')->where('id', $draft['id'])->update(['status' => 'published', 'published_at' => $now]);
        $this->db->table('content_sections')->where('id', $section['id'])->update(['updated_at' => $now]);
        $this->db->transComplete();
        if (! $this->db->transStatus()) throw new RuntimeException('No fue posible publicar la sección.');
        return $this->adminSection($key);
    }

    private function validate(string $key, array $input): array
    {
        $limits = match ($key) {
            'hero' => ['eyebrow' => 80, 'title' => 120, 'audience' => 100, 'description' => 420, 'primary_label' => 60, 'secondary_label' => 60, 'image_alt' => 255],
            'olcomep-introduction' => ['eyebrow' => 80, 'title' => 120, 'first_paragraph' => 600, 'second_paragraph' => 600],
            'calendar' => ['eyebrow' => 80, 'title' => 120, 'description' => 500, 'notice' => 400, 'footer' => 500, 'manual_label' => 80],
            'partners' => ['eyebrow' => 80, 'title' => 120, 'description' => 500, 'collaborators_title' => 160, 'collaborators_note' => 120, 'sponsors_title' => 160],
            'about' => ['eyebrow' => 80, 'title' => 120, 'closing_title' => 180],
            'general-information' => ['eyebrow' => 80, 'title' => 120, 'description' => 500, 'faq_eyebrow' => 80, 'faq_title' => 160],
            'regional-coordinations' => ['eyebrow' => 80, 'title' => 120, 'description' => 600, 'summary_title' => 180, 'summary_description' => 600, 'directory_title' => 180, 'search_label' => 160],
            'current-edition' => ['eyebrow' => 80, 'title' => 160, 'description' => 600, 'registration_title' => 180, 'registration_description' => 600, 'registration_label' => 120, 'bulk_eyebrow' => 80, 'bulk_title' => 180, 'bulk_description' => 600, 'bulk_label' => 120, 'promotion_label' => 120, 'image_alt' => 255],
            default => throw new InvalidArgumentException('La sección todavía no admite edición.'),
        };
        $result = [];
        foreach ($limits as $field => $limit) {
            $value = trim((string) ($input[$field] ?? ''));
            if ($value === '') throw new InvalidArgumentException("El campo {$field} es obligatorio.");
            $result[$field] = mb_substr($value, 0, $limit);
        }
        foreach ($key === 'hero' ? ['primary_href', 'secondary_href'] : [] as $field) {
            $value = trim((string) ($input[$field] ?? ''));
            if (! preg_match('#^(https?://|\#[a-z][a-z0-9_-]*)$#i', $value)) throw new InvalidArgumentException("El enlace {$field} no es válido.");
            $result[$field] = mb_substr($value, 0, 512);
        }
        if ($key === 'calendar') {
            $result['manual_href'] = $this->validateHref((string) ($input['manual_href'] ?? ''), 'manual_href');
            $scheduleJson = (string) ($input['schedule_json'] ?? '');
            if (strlen($scheduleJson) > 1_000_000) throw new InvalidArgumentException('El calendario supera el tamaño permitido.');
            $schedule = json_decode($scheduleJson, true);
            if (! is_array($schedule)) throw new InvalidArgumentException('Las actividades del calendario no son válidas.');
            $result['schedule'] = array_map(fn (mixed $activity): array => $this->validateCalendarActivity($activity), $schedule);
        }
        if ($key === 'partners') {
            $result['collaborators'] = $this->validatePartners((string) ($input['collaborators_json'] ?? ''), 'colaborador');
            $result['sponsors'] = $this->validatePartners((string) ($input['sponsors_json'] ?? ''), 'patrocinador');
        }
        if ($key === 'about') {
            $result['introduction'] = $this->validateParagraphs((string) ($input['introduction_json'] ?? ''), 'introducción');
            $result['closing_paragraphs'] = $this->validateParagraphs((string) ($input['closing_paragraphs_json'] ?? ''), 'cierre');
            $result['milestones'] = $this->validateMilestones((string) ($input['milestones_json'] ?? ''));
        }
        if ($key === 'general-information') {
            $result['routes'] = $this->validateInformationRoutes((string) ($input['routes_json'] ?? ''));
            $result['faqs'] = $this->validateFaqs((string) ($input['faqs_json'] ?? ''));
        }
        if ($key === 'regional-coordinations') $result['regions'] = $this->validateRegions((string) ($input['regions_json'] ?? ''));
        if ($key === 'current-edition') {
            foreach (['registration_href', 'bulk_href', 'promotion_href'] as $field) $result[$field] = $this->validateHref((string) ($input[$field] ?? ''), $field);
            $result['resources'] = $this->validateEditionResources((string) ($input['resources_json'] ?? ''));
        }
        return $result;
    }

    private function validateEditionResources(string $json): array
    {
        if (strlen($json) > 1_000_000) throw new InvalidArgumentException('Los documentos de la edición superan el tamaño permitido.');
        $items = json_decode($json, true);
        if (! is_array($items)) throw new InvalidArgumentException('Los documentos de la edición no son válidos.');
        return array_map(function (mixed $item): array {
            if (! is_array($item) || ! preg_match('/^[a-z0-9-]{3,80}$/', (string) ($item['key'] ?? ''))) throw new InvalidArgumentException('Un documento de la edición no es válido.');
            $icon = (string) ($item['icon'] ?? '');
            if (! in_array($icon, ['file', 'archive', 'spreadsheet'], true)) throw new InvalidArgumentException('El icono del documento no es válido.');
            $result = ['key' => $item['key'], 'icon' => $icon];
            foreach (['title' => 180, 'description' => 700, 'format' => 100] as $field => $limit) { $value = trim((string) ($item[$field] ?? '')); if ($value === '') throw new InvalidArgumentException("El campo {$field} del documento es obligatorio."); $result[$field] = mb_substr($value, 0, $limit); }
            $result['href'] = $this->validateHref((string) ($item['href'] ?? ''), 'href');
            return $result;
        }, $items);
    }

    private function validateRegions(string $json): array
    {
        if (strlen($json) > 2_000_000) throw new InvalidArgumentException('El directorio regional supera el tamaño permitido.');
        $regions = json_decode($json, true);
        if (! is_array($regions)) throw new InvalidArgumentException('El directorio regional no es válido.');
        return array_map(function (mixed $region): array {
            if (! is_array($region)) throw new InvalidArgumentException('Una región no es válida.');
            $name = trim((string) ($region['region'] ?? ''));
            if ($name === '') throw new InvalidArgumentException('El nombre de la región es obligatorio.');
            $contacts = $region['contacts'] ?? null;
            if (! is_array($contacts)) throw new InvalidArgumentException('Los contactos de la región no son válidos.');
            return ['region' => mb_substr($name, 0, 180), 'contacts' => array_map(function (mixed $contact): array {
                if (! is_array($contact)) throw new InvalidArgumentException('Un contacto regional no es válido.');
                $contactName = trim((string) ($contact['name'] ?? ''));
                if ($contactName === '') throw new InvalidArgumentException('El nombre del contacto es obligatorio.');
                $emails = $contact['emails'] ?? null;
                if (! is_array($emails)) throw new InvalidArgumentException('Los correos del contacto no son válidos.');
                $validEmails = array_map(function (mixed $email): string { $value = mb_strtolower(trim((string) $email)); if (! filter_var($value, FILTER_VALIDATE_EMAIL)) throw new InvalidArgumentException('Un correo institucional no es válido.'); return mb_substr($value, 0, 180); }, array_filter($emails, static fn (mixed $email): bool => trim((string) $email) !== ''));
                return ['name' => mb_substr($contactName, 0, 180), 'emails' => array_values($validEmails)];
            }, $contacts)];
        }, $regions);
    }

    private function validateInformationRoutes(string $json): array
    {
        if (strlen($json) > 1_000_000) throw new InvalidArgumentException('Las rutas informativas superan el tamaño permitido.');
        $items = json_decode($json, true);
        if (! is_array($items)) throw new InvalidArgumentException('Las rutas informativas no son válidas.');
        return array_map(function (mixed $item): array {
            if (! is_array($item) || ! preg_match('/^[a-z0-9-]{3,80}$/', (string) ($item['key'] ?? ''))) throw new InvalidArgumentException('Una ruta informativa no es válida.');
            $icon = (string) ($item['icon'] ?? '');
            if (! in_array($icon, ['file', 'users', 'calendar', 'help'], true)) throw new InvalidArgumentException('El icono de una ruta no es válido.');
            $result = ['key' => $item['key'], 'icon' => $icon, 'external' => ! empty($item['external'])];
            foreach (['title' => 180, 'description' => 700, 'label' => 255] as $field => $limit) { $value = trim((string) ($item[$field] ?? '')); if ($value === '') throw new InvalidArgumentException("El campo {$field} de una ruta es obligatorio."); $result[$field] = mb_substr($value, 0, $limit); }
            $result['href'] = $this->validateContentHref((string) ($item['href'] ?? ''), 'href');
            return $result;
        }, $items);
    }

    private function validateFaqs(string $json): array
    {
        if (strlen($json) > 1_000_000) throw new InvalidArgumentException('Las preguntas frecuentes superan el tamaño permitido.');
        $items = json_decode($json, true);
        if (! is_array($items)) throw new InvalidArgumentException('Las preguntas frecuentes no son válidas.');
        return array_map(function (mixed $item): array { if (! is_array($item) || ! preg_match('/^[a-z0-9-]{3,80}$/', (string) ($item['key'] ?? ''))) throw new InvalidArgumentException('Una pregunta frecuente no es válida.'); $question = trim((string) ($item['question'] ?? '')); $answer = trim((string) ($item['answer'] ?? '')); if ($question === '' || $answer === '') throw new InvalidArgumentException('La pregunta y la respuesta son obligatorias.'); return ['key' => $item['key'], 'question' => mb_substr($question, 0, 300), 'answer' => mb_substr($answer, 0, 1200)]; }, $items);
    }

    private function validateContentHref(string $value, string $field): string
    {
        $value = trim($value);
        if (! preg_match('#^(https?://|/[^\s]*|\#[a-z][a-z0-9_-]*)$#i', $value)) throw new InvalidArgumentException("El enlace {$field} no es válido.");
        return mb_substr($value, 0, 512);
    }

    private function validateParagraphs(string $json, string $label): array
    {
        if (strlen($json) > 500_000) throw new InvalidArgumentException("Los párrafos de {$label} superan el tamaño permitido.");
        $items = json_decode($json, true);
        if (! is_array($items)) throw new InvalidArgumentException("Los párrafos de {$label} no son válidos.");
        return array_map(function (mixed $paragraph) use ($label): string {
            $value = trim((string) $paragraph);
            if ($value === '') throw new InvalidArgumentException("Un párrafo de {$label} está vacío.");
            return mb_substr($value, 0, 1200);
        }, $items);
    }

    private function validateMilestones(string $json): array
    {
        if (strlen($json) > 1_000_000) throw new InvalidArgumentException('La cronología supera el tamaño permitido.');
        $items = json_decode($json, true);
        if (! is_array($items)) throw new InvalidArgumentException('La cronología no es válida.');
        return array_map(function (mixed $item): array {
            if (! is_array($item) || ! preg_match('/^[a-z0-9-]{3,80}$/', (string) ($item['key'] ?? ''))) throw new InvalidArgumentException('Un hito de la cronología no es válido.');
            $result = ['key' => $item['key']];
            foreach (['period' => 100, 'title' => 180, 'description' => 900] as $field => $limit) {
                $value = trim((string) ($item[$field] ?? ''));
                if ($value === '') throw new InvalidArgumentException("El campo {$field} del hito es obligatorio.");
                $result[$field] = mb_substr($value, 0, $limit);
            }
            return $result;
        }, $items);
    }

    private function validatePartners(string $json, string $type): array
    {
        if (strlen($json) > 1_000_000) throw new InvalidArgumentException('La lista de instituciones supera el tamaño permitido.');
        $items = json_decode($json, true);
        if (! is_array($items)) throw new InvalidArgumentException("La lista de {$type}es no es válida.");
        return array_map(function (mixed $item) use ($type): array {
            if (! is_array($item) || ! preg_match('/^[a-z0-9-]{3,80}$/', (string) ($item['key'] ?? ''))) throw new InvalidArgumentException("Un {$type} no es válido.");
            $name = trim((string) ($item['name'] ?? ''));
            if ($name === '') throw new InvalidArgumentException("El nombre del {$type} es obligatorio.");
            $result = ['key' => $item['key'], 'name' => mb_substr($name, 0, 180)];
            $description = trim((string) ($item['description'] ?? ''));
            if ($description !== '') $result['description'] = mb_substr($description, 0, 600);
            $url = trim((string) ($item['url'] ?? ''));
            if ($url !== '') $result['url'] = $this->validateHref($url, 'url');
            if (! empty($item['media_uuid'])) $result['media_uuid'] = (string) $item['media_uuid'];
            return $result;
        }, $items);
    }

    private function savePartnerMedia(int $revisionId, array &$content, array $files, ?array $sourceRevision): void
    {
        $sourceMedia = [];
        if ($sourceRevision !== null) {
            foreach ($this->repository->revisionMedia((int) $sourceRevision['id']) as $media) $sourceMedia[$media['item_key']] = $media;
        }
        foreach (['collaborators', 'sponsors'] as $collection) {
            foreach ($content[$collection] as &$item) {
                $itemKey = $item['key'];
                $file = $files['logo_' . $itemKey] ?? null;
                $mediaId = $sourceMedia[$itemKey]['media_file_id'] ?? null;
                if ($file instanceof UploadedFile && $file->isValid()) {
                    $media = $this->storage->store($file, 'sections/partners', 128);
                    $this->db->table('media_files')->insert($media);
                    $mediaId = (int) $this->db->insertID();
                }
                unset($item['media_uuid']);
                if ($mediaId !== null) $this->db->table('content_revision_media')->insert(['revision_id' => $revisionId, 'item_key' => $itemKey, 'media_file_id' => $mediaId, 'created_at' => date('Y-m-d H:i:s')]);
            }
            unset($item);
        }
        $this->db->table('content_revisions')->where('id', $revisionId)->update(['content_json' => json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);
    }

    private function validateCalendarActivity(mixed $activity): array
    {
        if (! is_array($activity)) throw new InvalidArgumentException('Una actividad del calendario no es válida.');
        $result = [];
        foreach (['date' => 100, 'title' => 180, 'description' => 700] as $field => $limit) {
            $value = trim((string) ($activity[$field] ?? ''));
            if ($value === '') throw new InvalidArgumentException("El campo {$field} de una actividad es obligatorio.");
            $result[$field] = mb_substr($value, 0, $limit);
        }
        foreach (['dateTime', 'endDateTime'] as $field) {
            $value = trim((string) ($activity[$field] ?? ''));
            if ($field === 'endDateTime' && $value === '') continue;
            if (! $this->isValidCalendarDate($value)) throw new InvalidArgumentException("La fecha {$field} no es válida.");
            $result[$field] = $value;
        }
        if (! empty($activity['highlighted'])) $result['highlighted'] = true;
        return $result;
    }

    private function validateHref(string $value, string $field): string
    {
        $value = trim($value);
        if (! preg_match('#^(https?://[^\s]+|/[^\s]*)$#i', $value)) throw new InvalidArgumentException("El enlace {$field} no es válido.");
        return mb_substr($value, 0, 512);
    }

    private function isValidCalendarDate(string $value): bool
    {
        if (preg_match('/^(\d{4})-(\d{2})$/', $value, $parts)) {
            return (int) $parts[2] >= 1 && (int) $parts[2] <= 12;
        }
        if (preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $value, $parts)) {
            return checkdate((int) $parts[2], (int) $parts[3], (int) $parts[1]);
        }
        return false;
    }

    private function requireSection(string $key): array
    {
        if (! preg_match('/^[a-z][a-z0-9-]{1,79}$/', $key)) throw new InvalidArgumentException('La sección no es válida.');
        $section = $this->repository->section($key);
        if ($section === null) throw new InvalidArgumentException('La sección no existe.');
        return $section;
    }

    private function nullablePresent(?array $revision): ?array { return $revision === null ? null : $this->present($revision); }
    private function present(array $revision): array
    {
        $content = json_decode($revision['content_json'], true, 512, JSON_THROW_ON_ERROR);
        if (! empty($revision['media_uuid'])) {
            $content['image_url'] = site_url('api/v1/media/' . $revision['media_uuid']);
            $content['image_width'] = (int) $revision['width'];
            $content['image_height'] = (int) $revision['height'];
        }
        $revisionMedia = [];
        foreach ($this->repository->revisionMedia((int) $revision['id']) as $media) $revisionMedia[$media['item_key']] = $media;
        foreach (['collaborators', 'sponsors'] as $collection) {
            if (! isset($content[$collection]) || ! is_array($content[$collection])) continue;
            foreach ($content[$collection] as &$item) {
                $media = $revisionMedia[$item['key'] ?? ''] ?? null;
                if ($media !== null) {
                    $item['media_uuid'] = $media['uuid'];
                    $item['logo_url'] = site_url('api/v1/media/' . $media['uuid']);
                    $item['logo_width'] = (int) $media['width'];
                    $item['logo_height'] = (int) $media['height'];
                }
            }
            unset($item);
        }
        return ['revision_id' => (int) $revision['id'], 'status' => $revision['status'], 'content' => $content, 'created_at' => $revision['created_at'], 'published_at' => $revision['published_at']];
    }
}
