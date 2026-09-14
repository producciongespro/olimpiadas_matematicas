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

    public function saveDraft(string $key, array $input, ?UploadedFile $file = null, ?string $actor = null): array
    {
        $section = $this->requireSection($key);
        $content = $this->validate($key, $input);
        $published = $this->repository->revision((int) $section['id'], 'published');
        $draft = $this->repository->revision((int) $section['id'], 'draft');
        $newMedia = null;
        if ($file !== null && $file->isValid()) $newMedia = $this->storage->store($file, 'sections/' . $key);
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
        if ($key !== 'hero') throw new InvalidArgumentException('La sección todavía no admite edición.');
        $limits = ['eyebrow' => 80, 'title' => 120, 'audience' => 100, 'description' => 420, 'primary_label' => 60, 'secondary_label' => 60, 'image_alt' => 255];
        $result = [];
        foreach ($limits as $field => $limit) {
            $value = trim((string) ($input[$field] ?? ''));
            if ($value === '') throw new InvalidArgumentException("El campo {$field} es obligatorio.");
            $result[$field] = mb_substr($value, 0, $limit);
        }
        foreach (['primary_href', 'secondary_href'] as $field) {
            $value = trim((string) ($input[$field] ?? ''));
            if (! preg_match('#^(https?://|\#[a-z][a-z0-9_-]*)$#i', $value)) throw new InvalidArgumentException("El enlace {$field} no es válido.");
            $result[$field] = mb_substr($value, 0, 512);
        }
        return $result;
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
        return ['revision_id' => (int) $revision['id'], 'status' => $revision['status'], 'content' => $content, 'created_at' => $revision['created_at'], 'published_at' => $revision['published_at']];
    }
}
