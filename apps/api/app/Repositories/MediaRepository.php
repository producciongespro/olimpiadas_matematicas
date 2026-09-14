<?php

namespace App\Repositories;

use CodeIgniter\Database\BaseConnection;

class MediaRepository
{
    public function __construct(private ?BaseConnection $db = null)
    {
        $this->db ??= db_connect();
    }

    public function publicCarousel(): array
    {
        return $this->db->table('carousel_slides slides')
            ->select('slides.id, slides.title, slides.alt_text, slides.link_url, slides.link_label, slides.sort_order, media.uuid AS media_uuid, media.width, media.height')
            ->join('media_files media', 'media.id = slides.media_file_id')
            ->where('slides.status', 'published')->orderBy('slides.sort_order')->get()->getResultArray();
    }

    public function events(bool $publicOnly = true): array
    {
        $builder = $this->db->table('events e')
            ->select('e.*, media.uuid AS cover_uuid, images.alt_text AS cover_alt')
            ->join('event_images images', 'images.event_id = e.id AND images.is_cover = 1', 'left')
            ->join('media_files media', 'media.id = images.media_file_id', 'left');
        if ($publicOnly) {
            $builder->where('e.status', 'published');
        }
        return $builder->orderBy('e.event_date', 'DESC')->orderBy('e.id', 'DESC')->get()->getResultArray();
    }

    public function event(string|int $value, bool $publicOnly = true): ?array
    {
        $field = is_int($value) || ctype_digit((string) $value) ? 'id' : 'slug';
        $builder = $this->db->table('events')->where($field, $value);
        if ($publicOnly) {
            $builder->where('status', 'published');
        }
        $event = $builder->get()->getRowArray();
        if ($event === null) {
            return null;
        }
        $event['images'] = $this->db->table('event_images images')
            ->select('images.id, images.alt_text, images.caption, images.sort_order, images.is_cover, media.uuid AS media_uuid, media.width, media.height')
            ->join('media_files media', 'media.id = images.media_file_id')
            ->where('images.event_id', $event['id'])->orderBy('images.sort_order')->get()->getResultArray();
        return $event;
    }

    public function adminCarousel(): array
    {
        return $this->db->table('carousel_slides slides')->select('slides.*, media.uuid AS media_uuid, media.original_name, media.width, media.height')
            ->join('media_files media', 'media.id = slides.media_file_id')->orderBy('slides.sort_order')->get()->getResultArray();
    }

    public function mediaForPublic(string $uuid): ?array
    {
        return $this->db->table('media_files media')->select('media.*')
            ->groupStart()
                ->whereIn('media.id', $this->db->table('carousel_slides')->select('media_file_id')->where('status', 'published'))
                ->orWhereIn('media.id', $this->db->table('event_images images')->select('images.media_file_id')->join('events e', 'e.id = images.event_id')->where('e.status', 'published'))
                ->orWhereIn('media.id', $this->db->table('content_revisions')->select('media_file_id')->where('status', 'published')->where('media_file_id IS NOT NULL', null, false))
            ->groupEnd()->where('media.uuid', $uuid)->get()->getRowArray();
    }
}
