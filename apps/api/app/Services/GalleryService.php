<?php

namespace App\Services;

use App\Repositories\MediaRepository;
use CodeIgniter\Database\BaseConnection;
use CodeIgniter\HTTP\Files\UploadedFile;
use InvalidArgumentException;
use RuntimeException;

class GalleryService
{
    private BaseConnection $db;
    private MediaRepository $repository;
    private MediaStorageService $storage;

    public function __construct(?BaseConnection $db = null)
    {
        $this->db = $db ?? db_connect();
        $this->repository = new MediaRepository($this->db);
        $this->storage = new MediaStorageService();
    }

    public function publicCarousel(): array
    {
        return array_map([$this, 'withMediaUrl'], $this->repository->publicCarousel());
    }

    public function events(bool $publicOnly = true): array
    {
        return array_map(function (array $event): array {
            if (! empty($event['cover_uuid'])) {
                $event['cover_url'] = site_url('api/v1/media/' . $event['cover_uuid']);
            }
            return $event;
        }, $this->repository->events($publicOnly));
    }

    public function event(string|int $value, bool $publicOnly = true): ?array
    {
        $event = $this->repository->event($value, $publicOnly);
        if ($event !== null) {
            $event['images'] = array_map([$this, 'withMediaUrl'], $event['images']);
        }
        return $event;
    }

    public function adminCarousel(): array
    {
        return array_map([$this, 'withMediaUrl'], $this->repository->adminCarousel());
    }

    public function createSlide(array $input, UploadedFile $file): array
    {
        $alt = $this->required($input, 'alt_text', 'El texto alternativo es obligatorio.');
        $status = $this->status($input['status'] ?? 'draft');
        if ($status === 'published' && $this->publishedSlideCount() >= 15) {
            throw new InvalidArgumentException('Solo se permiten 15 diapositivas publicadas.');
        }
        $media = $this->storage->store($file, 'carousel');
        $this->db->transStart();
        $this->db->table('media_files')->insert($media);
        $mediaId = $this->db->insertID();
        $now = date('Y-m-d H:i:s');
        $this->db->table('carousel_slides')->insert([
            'media_file_id' => $mediaId, 'title' => $this->nullable($input['title'] ?? null), 'alt_text' => $alt,
            'link_url' => $this->safeUrl($input['link_url'] ?? null), 'link_label' => $this->nullable($input['link_label'] ?? null),
            'sort_order' => $this->nextOrder('carousel_slides'), 'status' => $status,
            'published_at' => $status === 'published' ? $now : null, 'created_at' => $now, 'updated_at' => $now,
        ]);
        $id = $this->db->insertID();
        $this->db->transComplete();
        if (! $this->db->transStatus()) {
            $this->storage->delete($media['storage_path']);
            throw new RuntimeException('No fue posible guardar la diapositiva.');
        }
        return $this->findSlide($id);
    }

    public function updateSlide(int $id, array $input, ?UploadedFile $file = null): array
    {
        $slide = $this->findSlide($id);
        $status = array_key_exists('status', $input) ? $this->status($input['status']) : $slide['status'];
        $alt = array_key_exists('alt_text', $input) ? $this->required($input, 'alt_text', 'El texto alternativo es obligatorio.') : $slide['alt_text'];
        if ($status === 'published' && $slide['status'] !== 'published' && $this->publishedSlideCount() >= 15) {
            throw new InvalidArgumentException('Solo se permiten 15 diapositivas publicadas.');
        }
        $newMedia = null;
        if ($file !== null && $file->isValid()) {
            $newMedia = $this->storage->store($file, 'carousel');
        }
        $this->db->transStart();
        $mediaId = $slide['media_file_id'];
        if ($newMedia !== null) {
            $this->db->table('media_files')->insert($newMedia);
            $mediaId = $this->db->insertID();
        }
        $changes = ['media_file_id' => $mediaId, 'alt_text' => $alt, 'status' => $status, 'updated_at' => date('Y-m-d H:i:s')];
        foreach (['title', 'link_label'] as $field) {
            if (array_key_exists($field, $input)) $changes[$field] = $this->nullable($input[$field]);
        }
        if (array_key_exists('link_url', $input)) $changes['link_url'] = $this->safeUrl($input['link_url']);
        if ($status === 'published' && $slide['status'] !== 'published') $changes['published_at'] = date('Y-m-d H:i:s');
        $this->db->table('carousel_slides')->where('id', $id)->update($changes);
        if ($newMedia !== null) $this->db->table('media_files')->where('id', $slide['media_file_id'])->delete();
        $this->db->transComplete();
        if (! $this->db->transStatus()) {
            if ($newMedia !== null) $this->storage->delete($newMedia['storage_path']);
            throw new RuntimeException('No fue posible actualizar la diapositiva.');
        }
        if ($newMedia !== null) $this->storage->delete($slide['storage_path']);
        return $this->findSlide($id);
    }

    public function archiveSlide(int $id): array
    {
        $this->findSlide($id);
        $this->db->table('carousel_slides')->where('id', $id)->update(['status' => 'archived', 'updated_at' => date('Y-m-d H:i:s')]);
        return $this->findSlide($id);
    }

    public function reorderSlides(array $ids): array
    {
        $this->reorder('carousel_slides', $ids);
        return $this->adminCarousel();
    }

    public function createEvent(array $input): array
    {
        $name = $this->required($input, 'name', 'El nombre es obligatorio.');
        $slug = $this->slug($input['slug'] ?? $name);
        if ($this->db->table('events')->where('slug', $slug)->countAllResults() > 0) throw new InvalidArgumentException('El slug ya está en uso.');
        $now = date('Y-m-d H:i:s');
        $this->db->table('events')->insert([
            'uuid' => $this->uuid(), 'name' => $name, 'slug' => $slug,
            'event_date' => $this->date($input['event_date'] ?? null), 'description' => $this->nullable($input['description'] ?? null),
            'status' => 'draft', 'created_at' => $now, 'updated_at' => $now,
        ]);
        return $this->event((int) $this->db->insertID(), false);
    }

    public function updateEvent(int $id, array $input): array
    {
        $event = $this->event($id, false);
        if ($event === null) throw new InvalidArgumentException('El evento no existe.');
        $changes = ['updated_at' => date('Y-m-d H:i:s')];
        if (array_key_exists('name', $input)) $changes['name'] = $this->required($input, 'name', 'El nombre es obligatorio.');
        if (array_key_exists('slug', $input)) $changes['slug'] = $this->slug($input['slug']);
        if (isset($changes['slug']) && $this->db->table('events')->where('slug', $changes['slug'])->where('id !=', $id)->countAllResults() > 0) {
            throw new InvalidArgumentException('El slug ya está en uso.');
        }
        if (array_key_exists('event_date', $input)) $changes['event_date'] = $this->date($input['event_date']);
        if (array_key_exists('description', $input)) $changes['description'] = $this->nullable($input['description']);
        if (array_key_exists('status', $input)) {
            $changes['status'] = $this->status($input['status']);
            if ($changes['status'] === 'published') {
                if ($event['images'] === []) throw new InvalidArgumentException('El evento necesita al menos una fotografía para publicarse.');
                if (! array_filter($event['images'], static fn ($image) => (bool) $image['is_cover'])) {
                    $this->db->table('event_images')->where('id', $event['images'][0]['id'])->update(['is_cover' => true]);
                }
                $changes['published_at'] = $event['published_at'] ?? date('Y-m-d H:i:s');
            }
        }
        $this->db->table('events')->where('id', $id)->update($changes);
        return $this->event($id, false);
    }

    public function archiveEvent(int $id): array
    {
        return $this->updateEvent($id, ['status' => 'archived']);
    }

    public function addEventImage(int $eventId, array $input, UploadedFile $file): array
    {
        $event = $this->event($eventId, false);
        if ($event === null) throw new InvalidArgumentException('El evento no existe.');
        if (count($event['images']) >= 100) throw new InvalidArgumentException('El evento alcanzó el máximo de 100 fotografías.');
        $alt = $this->required($input, 'alt_text', 'El texto alternativo es obligatorio.');
        $media = $this->storage->store($file, 'events/' . $event['uuid']);
        $this->db->transStart();
        $this->db->table('media_files')->insert($media);
        $mediaId = $this->db->insertID();
        $cover = $event['images'] === [] || filter_var($input['is_cover'] ?? false, FILTER_VALIDATE_BOOL);
        if ($cover) $this->db->table('event_images')->where('event_id', $eventId)->update(['is_cover' => false]);
        $now = date('Y-m-d H:i:s');
        $this->db->table('event_images')->insert([
            'event_id' => $eventId, 'media_file_id' => $mediaId, 'alt_text' => $alt,
            'caption' => $this->nullable($input['caption'] ?? null), 'sort_order' => count($event['images']),
            'is_cover' => $cover, 'created_at' => $now, 'updated_at' => $now,
        ]);
        $this->db->transComplete();
        if (! $this->db->transStatus()) {
            $this->storage->delete($media['storage_path']);
            throw new RuntimeException('No fue posible guardar la fotografía.');
        }
        return $this->event($eventId, false);
    }

    public function updateEventImage(int $id, array $input, ?UploadedFile $file = null): array
    {
        $image = $this->db->table('event_images')->where('id', $id)->get()->getRowArray();
        if ($image === null) throw new InvalidArgumentException('La fotografía no existe.');
        $event = $this->event((int) $image['event_id'], false);
        $oldMedia = $this->db->table('media_files')->where('id', $image['media_file_id'])->get()->getRowArray();
        $newMedia = null;
        if ($file !== null && $file->isValid()) $newMedia = $this->storage->store($file, 'events/' . $event['uuid']);
        $changes = ['updated_at' => date('Y-m-d H:i:s')];
        if (array_key_exists('alt_text', $input)) $changes['alt_text'] = $this->required($input, 'alt_text', 'El texto alternativo es obligatorio.');
        if (array_key_exists('caption', $input)) $changes['caption'] = $this->nullable($input['caption']);
        if (filter_var($input['is_cover'] ?? false, FILTER_VALIDATE_BOOL)) {
            $this->db->table('event_images')->where('event_id', $image['event_id'])->update(['is_cover' => false]);
            $changes['is_cover'] = true;
        }
        $this->db->transStart();
        if ($newMedia !== null) {
            $this->db->table('media_files')->insert($newMedia);
            $changes['media_file_id'] = $this->db->insertID();
        }
        $this->db->table('event_images')->where('id', $id)->update($changes);
        if ($newMedia !== null) $this->db->table('media_files')->where('id', $image['media_file_id'])->delete();
        $this->db->transComplete();
        if (! $this->db->transStatus()) {
            if ($newMedia !== null) $this->storage->delete($newMedia['storage_path']);
            throw new RuntimeException('No fue posible actualizar la fotografía.');
        }
        if ($newMedia !== null && $oldMedia !== null) $this->storage->delete($oldMedia['storage_path']);
        return $this->event((int) $image['event_id'], false);
    }

    public function deleteEventImage(int $id): array
    {
        $image = $this->db->table('event_images')->where('id', $id)->get()->getRowArray();
        if ($image === null) throw new InvalidArgumentException('La fotografía no existe.');
        $event = $this->event((int) $image['event_id'], false);
        if ($event['status'] === 'published' && count($event['images']) === 1) throw new InvalidArgumentException('No se puede dejar sin fotografías un evento publicado.');
        $media = $this->db->table('media_files')->where('id', $image['media_file_id'])->get()->getRowArray();
        $this->db->transStart();
        $this->db->table('event_images')->where('id', $id)->delete();
        $this->db->table('media_files')->where('id', $image['media_file_id'])->delete();
        $remaining = $this->db->table('event_images')->where('event_id', $image['event_id'])->orderBy('sort_order')->get()->getResultArray();
        foreach ($remaining as $order => $item) $this->db->table('event_images')->where('id', $item['id'])->update(['sort_order' => $order, 'is_cover' => $item['is_cover'] || ($image['is_cover'] && $order === 0)]);
        $this->db->transComplete();
        if ($media !== null) $this->storage->delete($media['storage_path']);
        return $this->event((int) $image['event_id'], false);
    }

    public function reorderEventImages(int $eventId, array $ids): array
    {
        $this->reorder('event_images', $ids, ['event_id' => $eventId]);
        return $this->event($eventId, false);
    }

    public function media(string $uuid): ?array { return $this->repository->mediaForPublic($uuid); }

    private function findSlide(int $id): array
    {
        $row = $this->db->table('carousel_slides slides')->select('slides.*, media.uuid AS media_uuid, media.storage_path, media.original_name, media.width, media.height')
            ->join('media_files media', 'media.id = slides.media_file_id')->where('slides.id', $id)->get()->getRowArray();
        if ($row === null) throw new InvalidArgumentException('La diapositiva no existe.');
        return $this->withMediaUrl($row);
    }

    private function reorder(string $table, array $ids, array $scope = []): void
    {
        $ids = array_values(array_unique(array_map('intval', $ids)));
        $builder = $this->db->table($table);
        foreach ($scope as $field => $value) $builder->where($field, $value);
        $actual = array_map('intval', array_column($builder->select('id')->get()->getResultArray(), 'id'));
        sort($actual); $check = $ids; sort($check);
        if ($actual !== $check) throw new InvalidArgumentException('La lista debe contener todos los identificadores de la colección una sola vez.');
        $this->db->transStart();
        foreach ($ids as $order => $id) $this->db->table($table)->where('id', $id)->update(['sort_order' => $order, 'updated_at' => date('Y-m-d H:i:s')]);
        $this->db->transComplete();
    }

    private function withMediaUrl(array $item): array
    {
        $item['media_url'] = site_url('api/v1/media/' . $item['media_uuid']);
        return $item;
    }
    private function publishedSlideCount(): int { return $this->db->table('carousel_slides')->where('status', 'published')->countAllResults(); }
    private function nextOrder(string $table): int { $row = $this->db->table($table)->selectMax('sort_order')->get()->getRowArray(); return isset($row['sort_order']) ? (int) $row['sort_order'] + 1 : 0; }
    private function required(array $input, string $key, string $message): string { $value = trim((string) ($input[$key] ?? '')); if ($value === '') throw new InvalidArgumentException($message); return mb_substr($value, 0, 255); }
    private function nullable(mixed $value): ?string { $value = trim((string) $value); return $value === '' ? null : $value; }
    private function status(mixed $value): string { $value = (string) $value; if (! in_array($value, ['draft', 'published', 'archived'], true)) throw new InvalidArgumentException('El estado no es válido.'); return $value; }
    private function safeUrl(mixed $value): ?string { $value = $this->nullable($value); if ($value !== null && ! preg_match('#^(https?://|/)#i', $value)) throw new InvalidArgumentException('El enlace debe ser HTTPS, HTTP o una ruta interna.'); return $value; }
    private function date(mixed $value): ?string { $value = $this->nullable($value); if ($value !== null && ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) throw new InvalidArgumentException('La fecha no es válida.'); return $value; }
    private function slug(mixed $value): string { $slug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', iconv('UTF-8', 'ASCII//TRANSLIT', (string) $value) ?: (string) $value), '-')); if ($slug === '') throw new InvalidArgumentException('El slug no es válido.'); return mb_substr($slug, 0, 180); }
    private function uuid(): string { $hex = bin2hex(random_bytes(16)); return substr($hex, 0, 8) . '-' . substr($hex, 8, 4) . '-4' . substr($hex, 13, 3) . '-' . dechex((hexdec($hex[16]) & 3) | 8) . substr($hex, 17, 3) . '-' . substr($hex, 20); }
}
