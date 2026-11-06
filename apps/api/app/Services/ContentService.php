<?php

namespace App\Services;

use App\Repositories\ContentRepository;
use CodeIgniter\Database\BaseConnection;
use CodeIgniter\HTTP\Files\UploadedFile;
use Config\SiteNavigation;
use InvalidArgumentException;
use RuntimeException;

class ContentService
{
    private const HERO_PROTECTED_LINKS = [
        'primary_href' => '#edicion-vigente',
        'secondary_href' => '#olimpiadas',
    ];
    private const CALENDAR_MANUAL_KEY = 'calendar-manual';
    private const EDITION_DOCUMENT_PREFIX = 'edition-document-';
    private const EDITION_BULK_TEMPLATE_KEY = 'edition-bulk-template';
    private const CALENDAR_FALLBACK_MANUAL = '/data/2026/manual-OLCOMEP-primaria-2026.pdf';

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
            if ($revision !== null) $result[$section['section_key']] = $this->presentSection($section['section_key'], $revision);
        }
        if (isset($result['site-header'])) {
            $result['site-header']['content'] = SiteNavigation::headerForEdition($result['current-edition']['content']['edition_year'] ?? null);
        }
        return $result;
    }

    public function publicHomeSnapshot(): array
    {
        $latest = $this->repository->latestPublishedRevision();
        $publishedAt = $latest['published_at'] ?? $latest['created_at'] ?? null;

        return [
            'sections' => $this->publicHome(),
            'version' => $latest === null ? 'empty' : sprintf('%s-%d', str_replace([' ', ':'], ['T', ''], (string) $publishedAt), (int) $latest['id']),
        ];
    }

    public function adminSections(): array
    {
        $editable = array_filter($this->repository->sections(), static fn (array $section): bool => $section['section_key'] !== 'site-header');
        return array_values(array_map(fn (array $section): array => $this->adminSection($section['section_key']), $editable));
    }

    public function adminSection(string $key): array
    {
        $section = $this->requireSection($key);
        $published = $this->nullablePresent($key, $this->repository->revision((int) $section['id'], 'published'));
        if ($key === 'site-header' && $published !== null) {
            $edition = $this->repository->section('current-edition');
            $revision = $edition === null ? null : $this->repository->revision((int) $edition['id'], 'published');
            $editionContent = $revision === null ? [] : json_decode($revision['content_json'], true, 512, JSON_THROW_ON_ERROR);
            $published['content'] = SiteNavigation::headerForEdition($editionContent['edition_year'] ?? null);
        }
        return [
            'key' => $section['section_key'], 'label' => $key === 'general-information' ? 'Preguntas frecuentes' : $section['label'], 'schema_version' => (int) $section['schema_version'],
            'draft' => $key === 'site-header' ? null : $this->nullablePresent($key, $this->repository->revision((int) $section['id'], 'draft')),
            'published' => $published,
        ];
    }

    public function saveDraft(string $key, array $input, ?UploadedFile $file = null, ?string $actor = null, array $files = [], array $localFiles = []): array
    {
        $this->requireEditableSection($key);
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
        if ($key === 'calendar') $this->saveCalendarManual($revisionId, $content, $files, $sourceRevision);
        if ($key === 'current-edition') $this->saveEditionDocumentMedia($revisionId, $content, $files, $sourceRevision);
        if ($key === 'regional-coordinations') $this->saveRegionalContactMedia($revisionId, $content, $files, $sourceRevision, $localFiles);
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
        $this->requireEditableSection($key);
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

    private function requireEditableSection(string $key): void
    {
        if ($key === 'site-header') throw new InvalidArgumentException('El encabezado y la navegación son de solo lectura.');
    }

    private function validate(string $key, array $input): array
    {
        $limits = match ($key) {
            'hero' => ['eyebrow' => 80, 'title' => 120, 'audience' => 100, 'description' => 420, 'primary_label' => 60, 'secondary_label' => 60, 'image_alt' => 255],
            'olcomep-introduction' => ['eyebrow' => 80, 'title' => 120, 'first_paragraph' => 600, 'second_paragraph' => 600],
            'calendar' => ['eyebrow' => 80, 'title' => 120, 'description' => 500, 'notice' => 400, 'footer' => 500, 'manual_label' => 80],
            'partners' => ['eyebrow' => 80, 'title' => 120, 'description' => 500, 'collaborators_title' => 160, 'collaborators_note' => 120, 'sponsors_title' => 160],
            'about' => ['eyebrow' => 80, 'title' => 120, 'closing_title' => 180],
            'general-information' => ['faq_eyebrow' => 80, 'faq_title' => 160],
            'regional-coordinations' => ['eyebrow' => 80, 'title' => 120, 'description' => 600, 'summary_title' => 180, 'summary_description' => 600, 'directory_title' => 180, 'search_label' => 160],
            'current-edition' => ['eyebrow' => 80, 'title' => 160, 'description' => 600, 'registration_title' => 180, 'registration_description' => 600, 'registration_label' => 120, 'bulk_eyebrow' => 80, 'bulk_title' => 180, 'bulk_description' => 600, 'bulk_label' => 120, 'promotion_label' => 120, 'image_alt' => 255],
            'contact' => ['eyebrow' => 80, 'title' => 120, 'description' => 600, 'contact_name' => 180, 'contact_role' => 240],
            'resource-booklets' => ['eyebrow' => 80, 'title' => 120, 'description' => 600],
            'site-footer' => ['program_name' => 180, 'organization' => 180],
            default => throw new InvalidArgumentException('La sección todavía no admite edición.'),
        };
        $result = [];
        foreach ($limits as $field => $limit) {
            $value = trim((string) ($input[$field] ?? ''));
            if ($value === '') throw new InvalidArgumentException("El campo {$field} es obligatorio.");
            $result[$field] = mb_substr($value, 0, $limit);
        }
        if ($key === 'hero') $result = array_merge($result, self::HERO_PROTECTED_LINKS);
        if ($key === 'calendar') {
            $result['manual_href'] = self::CALENDAR_FALLBACK_MANUAL;
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
            $result['faqs'] = $this->validateFaqs((string) ($input['faqs_json'] ?? ''));
        }
        if ($key === 'regional-coordinations') $result['regions'] = $this->validateRegions((string) ($input['regions_json'] ?? ''));
        if ($key === 'current-edition') {
            $year = filter_var($input['edition_year'] ?? null, FILTER_VALIDATE_INT);
            if ($year === false || $year < 2000 || $year > 2100) throw new InvalidArgumentException('El año de la edición debe estar entre 2000 y 2100.');
            $result['edition_year'] = $year;
            foreach (['registration_href', 'promotion_href'] as $field) $result[$field] = $this->validateHref((string) ($input[$field] ?? ''), $field);
            if (! empty($input['bulk_href'])) $result['bulk_href'] = $this->validateHref((string) $input['bulk_href'], 'bulk_href');
            $result['bulk_remove'] = filter_var($input['bulk_remove'] ?? false, FILTER_VALIDATE_BOOLEAN);
            $result['resources'] = $this->validateEditionResources((string) ($input['resources_json'] ?? ''));
        }
        if ($key === 'contact') {
            $result['phones'] = $this->validateContactPhones((string) ($input['phones_json'] ?? ''));
            $result['emails'] = $this->validateContactEmails((string) ($input['emails_json'] ?? ''));
            $result['resources'] = $this->validateContactResources((string) ($input['resources_json'] ?? ''));
        }
        if ($key === 'resource-booklets') $result['editions'] = $this->validateResourceEditions((string) ($input['editions_json'] ?? ''));
        if ($key === 'site-footer') $result['links'] = $this->validateEditorialLinks((string) ($input['links_json'] ?? ''));
        if ($key === 'site-footer') $result['credits'] = $this->validateEditorialCredits((string) ($input['credits_json'] ?? ''));
        return $result;
    }

    private function validateEditorialLinks(string $json): array
    {
        if (strlen($json) > 200_000) throw new InvalidArgumentException('La navegación supera el tamaño permitido.');
        $items = json_decode($json, true);
        if (! is_array($items) || ! array_is_list($items)) throw new InvalidArgumentException('Los enlaces no son válidos.');
        $keys = [];
        $result = array_map(function (mixed $item) use (&$keys): array {
            if (! is_array($item) || ! preg_match('/^[a-z0-9-]{3,80}$/', (string) ($item['key'] ?? ''))) throw new InvalidArgumentException('La clave de un enlace no es válida.');
            $key = (string) $item['key'];
            if (isset($keys[$key])) throw new InvalidArgumentException('Hay un enlace repetido.');
            $keys[$key] = true;
            $label = trim((string) ($item['label'] ?? ''));
            if ($label === '' || str_contains($label, '<') || str_contains($label, '>')) throw new InvalidArgumentException('La etiqueta del enlace no es válida.');
            return ['key' => $key, 'label' => mb_substr($label, 0, 120), 'href' => $this->validateResourceHref((string) ($item['href'] ?? ''), 'href')];
        }, $items);
        return $result;
    }

    private function validateEditorialCredits(string $json): array
    {
        if (strlen($json) > 200_000) throw new InvalidArgumentException('Los créditos superan el tamaño permitido.');
        $items = json_decode($json, true);
        if (! is_array($items) || ! array_is_list($items)) throw new InvalidArgumentException('Los créditos no son válidos.');
        $keys = [];
        return array_map(function (mixed $item) use (&$keys): array {
            if (! is_array($item) || ! preg_match('/^[a-z0-9-]{3,80}$/', (string) ($item['key'] ?? ''))) throw new InvalidArgumentException('La clave de un grupo de créditos no es válida.');
            $key = (string) $item['key'];
            if (isset($keys[$key])) throw new InvalidArgumentException('Hay un grupo de créditos repetido.');
            $keys[$key] = true;
            $title = trim((string) ($item['title'] ?? ''));
            if ($title === '' || strpbrk($title, '<>') !== false) throw new InvalidArgumentException('El título de créditos no es válido.');
            $names = $item['names'] ?? null;
            if (! is_array($names) || ! array_is_list($names)) throw new InvalidArgumentException('Los nombres de créditos no son válidos.');
            $names = array_map(static function (mixed $name): string { $value = trim((string) $name); if ($value === '' || strpbrk($value, '<>') !== false) throw new InvalidArgumentException('Un nombre de créditos no es válido.'); return mb_substr($value, 0, 180); }, $names);
            return ['key' => $key, 'title' => mb_substr($title, 0, 180), 'names' => $names];
        }, $items);
    }

    private function validateResourceEditions(string $json): array
    {
        if (strlen($json) > 2_000_000) throw new InvalidArgumentException('El catálogo de recursos supera el tamaño permitido.');
        $editions = json_decode($json, true);
        if (! is_array($editions) || ! array_is_list($editions)) throw new InvalidArgumentException('Las ediciones no son válidas.');
        $editionKeys = [];
        return array_map(function (mixed $edition) use (&$editionKeys): array {
            if (! is_array($edition) || ! preg_match('/^\d{4}$/', (string) ($edition['year'] ?? ''))) throw new InvalidArgumentException('El año de una edición no es válido.');
            $type = (string) ($edition['type'] ?? '');
            if (! in_array($type, ['pdf', 'interactive'], true)) throw new InvalidArgumentException('El tipo de edición no es válido.');
            $editionKey = $edition['year'] . '-' . $type;
            if (isset($editionKeys[$editionKey])) throw new InvalidArgumentException('Hay una edición repetida.');
            $editionKeys[$editionKey] = true;
            $items = $edition['materials'] ?? null;
            if (! is_array($items) || ! array_is_list($items)) throw new InvalidArgumentException('Los materiales de una edición no son válidos.');
            $materialKeys = [];
            $materials = array_map(function (mixed $item) use (&$materialKeys): array {
                if (! is_array($item) || ! preg_match('/^[a-z0-9-]{3,80}$/', (string) ($item['key'] ?? ''))) throw new InvalidArgumentException('La clave de un material no es válida.');
                $key = $item['key'];
                if (isset($materialKeys[$key])) throw new InvalidArgumentException('Hay un material repetido.');
                $materialKeys[$key] = true;
                $role = (string) ($item['role'] ?? '');
                if (! in_array($role, ['estudiante', 'docente', 'general'], true)) throw new InvalidArgumentException('El rol de un material no es válido.');
                $grade = $item['grade'] ?? null;
                if ($grade !== null && (! filter_var($grade, FILTER_VALIDATE_INT) || (int) $grade < 1 || (int) $grade > 6)) throw new InvalidArgumentException('El grado de un material no es válido.');
                $result = ['key' => $key, 'grade' => $grade === null ? null : (int) $grade, 'role' => $role];
                foreach (['title' => 180, 'description' => 700] as $field => $limit) {
                    $value = trim((string) ($item[$field] ?? ''));
                    if ($value === '') throw new InvalidArgumentException("El campo {$field} de un material es obligatorio.");
                    $result[$field] = mb_substr($value, 0, $limit);
                }
                $result['href'] = $this->validateResourceHref((string) ($item['href'] ?? ''), 'href');
                foreach (['part' => 30, 'image' => 512] as $field => $limit) {
                    $value = trim((string) ($item[$field] ?? ''));
                    if ($value !== '') $result[$field] = $field === 'image' ? $this->validateResourceHref($value, $field) : mb_substr($value, 0, $limit);
                }
                return $result;
            }, $items);
            return ['year' => (int) $edition['year'], 'type' => $type, 'materials' => $materials];
        }, $editions);
    }

    private function validateResourceHref(string $value, string $field): string
    {
        $value = trim($value);
        if (mb_strlen($value) > 512 || preg_match('/[\x00-\x20\\\\]/', $value)) throw new InvalidArgumentException("El enlace {$field} no es válido.");
        if (str_starts_with($value, '/') && ! str_starts_with($value, '//')) return $value;
        if (preg_match('/^#[a-z][a-z0-9_-]*$/i', $value)) return $value;
        $parts = parse_url($value);
        if (! is_array($parts) || ! in_array(strtolower($parts['scheme'] ?? ''), ['http', 'https'], true) || empty($parts['host']) || isset($parts['user']) || isset($parts['pass'])) throw new InvalidArgumentException("El enlace {$field} no es válido.");
        return $value;
    }

    private function validateContactPhones(string $json): array
    {
        $items = json_decode($json, true); if (! is_array($items)) throw new InvalidArgumentException('Los teléfonos no son válidos.');
        return array_values(array_map(function (mixed $phone): string { $value = trim((string) $phone); if ($value === '' || ! preg_match('/^[+0-9() .-]{7,40}$/', $value) || strlen(preg_replace('/\D/', '', $value)) < 7) throw new InvalidArgumentException('Un teléfono no es válido.'); return $value; }, $items));
    }

    private function validateContactEmails(string $json): array
    {
        $items = json_decode($json, true); if (! is_array($items)) throw new InvalidArgumentException('Los correos no son válidos.');
        return array_values(array_map(function (mixed $email): string { $value = mb_strtolower(trim((string) $email)); if (! filter_var($value, FILTER_VALIDATE_EMAIL)) throw new InvalidArgumentException('Un correo institucional no es válido.'); return mb_substr($value, 0, 180); }, $items));
    }

    private function validateContactResources(string $json): array
    {
        $items = json_decode($json, true); if (! is_array($items)) throw new InvalidArgumentException('Los recursos de contacto no son válidos.');
        return array_map(function (mixed $item): array { if (! is_array($item) || ! preg_match('/^[a-z0-9-]{3,80}$/', (string) ($item['key'] ?? ''))) throw new InvalidArgumentException('Un recurso de contacto no es válido.'); $result=['key'=>$item['key']]; foreach (['title'=>180,'description'=>700] as $field=>$limit) { $value=trim((string)($item[$field]??'')); if ($value==='') throw new InvalidArgumentException("El campo {$field} del recurso es obligatorio."); $result[$field]=mb_substr($value,0,$limit); } $result['href']=$this->validateContentHref((string)($item['href']??''),'href'); return $result; }, $items);
    }

    private function validateEditionResources(string $json): array
    {
        if (strlen($json) > 1_000_000) throw new InvalidArgumentException('Los documentos de la edición superan el tamaño permitido.');
        $items = json_decode($json, true);
        if (! is_array($items)) throw new InvalidArgumentException('Los documentos de la edición no son válidos.');
        return array_map(function (mixed $item): array {
            if (! is_array($item) || ! preg_match('/^[a-z0-9-]{3,80}$/', (string) ($item['key'] ?? ''))) throw new InvalidArgumentException('Un documento de la edición no es válido.');
            $result = ['key' => $item['key']];
            foreach (['title' => 180, 'description' => 700] as $field => $limit) { $value = trim((string) ($item[$field] ?? '')); if ($value === '') throw new InvalidArgumentException("El campo {$field} del documento es obligatorio."); $result[$field] = mb_substr($value, 0, $limit); }
            // Compatibilidad de lectura con los destinos incluidos antes de habilitar cargas administradas.
            if (! empty($item['href'])) {
                $result['href'] = $this->validateHref((string) $item['href'], 'href');
                $result['format'] = mb_substr(trim((string) ($item['format'] ?? 'PDF')), 0, 100);
                $result['icon'] = in_array(($item['icon'] ?? ''), ['file', 'archive', 'spreadsheet'], true) ? $item['icon'] : 'file';
            }
            return $result;
        }, $items);
    }

    private function validateRegions(string $json): array
    {
        if (strlen($json) > 2_000_000) throw new InvalidArgumentException('El directorio regional supera el tamaño permitido.');
        $regions = json_decode($json, true);
        if (! is_array($regions)) throw new InvalidArgumentException('El directorio regional no es válido.');
        return array_map(function (mixed $region, int $regionIndex): array {
            if (! is_array($region)) throw new InvalidArgumentException('Una región no es válida.');
            $name = trim((string) ($region['region'] ?? ''));
            if ($name === '') throw new InvalidArgumentException('El nombre de la región es obligatorio.');
            $contacts = $region['contacts'] ?? null;
            if (! is_array($contacts)) throw new InvalidArgumentException('Los contactos de la región no son válidos.');
            return ['region' => mb_substr($name, 0, 180), 'contacts' => array_map(function (mixed $contact, int $contactIndex) use ($regionIndex): array {
                if (! is_array($contact)) throw new InvalidArgumentException('Un contacto regional no es válido.');
                $key = (string) ($contact['key'] ?? "regional-" . ($regionIndex + 1) . "-contact-" . ($contactIndex + 1));
                if (! preg_match('/^[a-z0-9-]{3,70}$/', $key)) throw new InvalidArgumentException('La clave del contacto regional no es válida.');
                $contactName = trim((string) ($contact['name'] ?? ''));
                if ($contactName === '') throw new InvalidArgumentException('El nombre del contacto es obligatorio.');
                $emails = $contact['emails'] ?? null;
                if (! is_array($emails)) throw new InvalidArgumentException('Los correos del contacto no son válidos.');
                $validEmails = array_map(function (mixed $email): string { $value = mb_strtolower(trim((string) $email)); if (! filter_var($value, FILTER_VALIDATE_EMAIL)) throw new InvalidArgumentException('Un correo institucional no es válido.'); return mb_substr($value, 0, 180); }, array_filter($emails, static fn (mixed $email): bool => trim((string) $email) !== ''));
                return ['key' => $key, 'name' => mb_substr($contactName, 0, 180), 'emails' => array_values($validEmails), 'remove_photo' => ! empty($contact['remove_photo'])];
            }, $contacts, array_keys($contacts))];
        }, $regions, array_keys($regions));
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

    private function saveCalendarManual(int $revisionId, array &$content, array $files, ?array $sourceRevision): void
    {
        $sourceMedia = [];
        if ($sourceRevision !== null) {
            foreach ($this->repository->revisionMedia((int) $sourceRevision['id']) as $media) $sourceMedia[$media['item_key']] = $media;
        }
        $mediaId = $sourceMedia[self::CALENDAR_MANUAL_KEY]['media_file_id'] ?? null;
        $file = $files['manual'] ?? null;
        if ($file instanceof UploadedFile && $file->isValid()) {
            $media = $this->storage->storePdf($file, 'sections/calendar');
            $this->db->table('media_files')->insert($media);
            $mediaId = (int) $this->db->insertID();
        }
        if ($mediaId !== null) {
            $this->db->table('content_revision_media')->insert([
                'revision_id' => $revisionId, 'item_key' => self::CALENDAR_MANUAL_KEY,
                'media_file_id' => $mediaId, 'created_at' => date('Y-m-d H:i:s'),
            ]);
        }
    }

    private function saveEditionDocumentMedia(int $revisionId, array &$content, array $files, ?array $sourceRevision): void
    {
        $sourceMedia = [];
        if ($sourceRevision !== null) {
            foreach ($this->repository->revisionMedia((int) $sourceRevision['id']) as $media) $sourceMedia[$media['item_key']] = $media;
        }
        foreach ($content['resources'] as &$resource) {
            $relationKey = self::EDITION_DOCUMENT_PREFIX . $resource['key'];
            $file = $files['document_' . $resource['key']] ?? null;
            $mediaId = $sourceMedia[$relationKey]['media_file_id'] ?? null;
            if ($file instanceof UploadedFile && $file->isValid()) {
                $media = $this->storage->storePdf($file, 'sections/current-edition/' . $content['edition_year']);
                $this->db->table('media_files')->insert($media);
                $mediaId = (int) $this->db->insertID();
            }
            if ($mediaId === null && empty($resource['href'])) throw new InvalidArgumentException('Cada documento oficial nuevo debe incluir un archivo PDF.');
            unset($resource['file_uuid'], $resource['file_name'], $resource['file_size']);
            if ($mediaId !== null) {
                unset($resource['href'], $resource['format'], $resource['icon']);
                $this->db->table('content_revision_media')->insert(['revision_id' => $revisionId, 'item_key' => $relationKey, 'media_file_id' => $mediaId, 'created_at' => date('Y-m-d H:i:s')]);
            }
        }
        unset($resource);
        $templateFile = $files['bulk_template'] ?? null;
        $removeTemplate = $content['bulk_remove'];
        $templateMediaId = ! $removeTemplate ? ($sourceMedia[self::EDITION_BULK_TEMPLATE_KEY]['media_file_id'] ?? null) : null;
        if ($templateFile instanceof UploadedFile && $templateFile->isValid()) {
            $templateMedia = $this->storage->storeXlsx($templateFile, 'sections/current-edition/' . $content['edition_year']);
            $this->db->table('media_files')->insert($templateMedia);
            $templateMediaId = (int) $this->db->insertID();
        }
        unset($content['bulk_remove'], $content['bulk_file_uuid'], $content['bulk_file_name'], $content['bulk_file_size']);
        if ($templateMediaId !== null) {
            unset($content['bulk_href']);
            $this->db->table('content_revision_media')->insert(['revision_id' => $revisionId, 'item_key' => self::EDITION_BULK_TEMPLATE_KEY, 'media_file_id' => $templateMediaId, 'created_at' => date('Y-m-d H:i:s')]);
        } elseif ($removeTemplate) {
            unset($content['bulk_href']);
        }
        $this->db->table('content_revisions')->where('id', $revisionId)->update(['content_json' => json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);
    }

    private function saveRegionalContactMedia(int $revisionId, array &$content, array $files, ?array $sourceRevision, array $localFiles = []): void
    {
        $sourceMedia = [];
        if ($sourceRevision !== null) {
            foreach ($this->repository->revisionMedia((int) $sourceRevision['id']) as $media) $sourceMedia[$media['item_key']] = $media;
        }
        foreach ($content['regions'] as &$region) {
            foreach ($region['contacts'] as &$contact) {
                $itemKey = 'advisor-' . $contact['key'];
                $file = $files['photo_' . $contact['key']] ?? null;
                $mediaId = ! $contact['remove_photo'] ? ($sourceMedia[$itemKey]['media_file_id'] ?? null) : null;
                if ($file instanceof UploadedFile && $file->isValid()) {
                    $media = $this->storage->store($file, 'sections/regional-coordinations', 300);
                    $this->db->table('media_files')->insert($media);
                    $mediaId = (int) $this->db->insertID();
                } elseif (isset($localFiles[$contact['key']])) {
                    $media = $this->storage->importLocalImage((string) $localFiles[$contact['key']], 'sections/regional-coordinations');
                    $this->db->table('media_files')->insert($media);
                    $mediaId = (int) $this->db->insertID();
                }
                unset($contact['remove_photo'], $contact['media_uuid'], $contact['photo_url'], $contact['photo_width'], $contact['photo_height']);
                if ($mediaId !== null) $this->db->table('content_revision_media')->insert(['revision_id' => $revisionId, 'item_key' => $itemKey, 'media_file_id' => $mediaId, 'created_at' => date('Y-m-d H:i:s')]);
            }
            unset($contact);
        }
        unset($region);
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

    private function nullablePresent(string $key, ?array $revision): ?array { return $revision === null ? null : $this->presentSection($key, $revision); }
    private function presentSection(string $key, array $revision): array
    {
        $presented = $this->present($revision);
        if ($key === 'general-information') {
            $presented['content'] = array_intersect_key($presented['content'], array_flip(['faq_eyebrow', 'faq_title', 'faqs']));
        }
        if ($key === 'site-header') $presented['content'] = SiteNavigation::HEADER;
        return $presented;
    }
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
        $calendarManual = $revisionMedia[self::CALENDAR_MANUAL_KEY] ?? null;
        if ($calendarManual !== null) {
            $content['manual_uuid'] = $calendarManual['uuid'];
            $content['manual_href'] = site_url('api/v1/media/' . $calendarManual['uuid']);
            $content['manual_name'] = $calendarManual['original_name'];
            $content['manual_size'] = (int) $calendarManual['size_bytes'];
        }
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
        if (isset($content['regions']) && is_array($content['regions'])) {
            foreach ($content['regions'] as &$region) {
                foreach ($region['contacts'] as &$contact) {
                    $media = $revisionMedia['advisor-' . ($contact['key'] ?? '')] ?? null;
                    if ($media !== null) {
                        $contact['media_uuid'] = $media['uuid'];
                        $contact['photo_url'] = site_url('api/v1/media/' . $media['uuid']);
                        $contact['photo_width'] = (int) $media['width'];
                        $contact['photo_height'] = (int) $media['height'];
                    }
                }
                unset($contact);
            }
            unset($region);
        }
        if (isset($content['resources']) && is_array($content['resources']) && isset($content['edition_year'])) {
            foreach ($content['resources'] as &$resource) {
                $media = $revisionMedia[self::EDITION_DOCUMENT_PREFIX . ($resource['key'] ?? '')] ?? null;
                if ($media !== null) {
                    $resource['file_uuid'] = $media['uuid'];
                    $resource['href'] = site_url('api/v1/media/' . $media['uuid']);
                    $resource['file_name'] = $media['original_name'];
                    $resource['file_size'] = (int) $media['size_bytes'];
                    $resource['format'] = 'PDF';
                    $resource['icon'] = 'file';
                }
            }
            unset($resource);
            $template = $revisionMedia[self::EDITION_BULK_TEMPLATE_KEY] ?? null;
            if ($template !== null) {
                $content['bulk_file_uuid'] = $template['uuid'];
                $content['bulk_href'] = site_url('api/v1/media/' . $template['uuid']);
                $content['bulk_file_name'] = $template['original_name'];
                $content['bulk_file_size'] = (int) $template['size_bytes'];
            }
        }
        return ['revision_id' => (int) $revision['id'], 'status' => $revision['status'], 'content' => $content, 'created_at' => $revision['created_at'], 'published_at' => $revision['published_at']];
    }
}
