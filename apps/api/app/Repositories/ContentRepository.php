<?php

namespace App\Repositories;

use CodeIgniter\Database\BaseConnection;

class ContentRepository
{
    public function __construct(private ?BaseConnection $db = null)
    {
        $this->db ??= db_connect();
    }

    public function section(string $key): ?array
    {
        return $this->db->table('content_sections')->where('section_key', $key)->get()->getRowArray();
    }

    public function revision(int $sectionId, string $status): ?array
    {
        return $this->db->table('content_revisions revisions')
            ->select('revisions.*, media.uuid AS media_uuid, media.width, media.height')
            ->join('media_files media', 'media.id = revisions.media_file_id', 'left')
            ->where('revisions.section_id', $sectionId)->where('revisions.status', $status)
            ->orderBy('revisions.id', 'DESC')->get()->getRowArray();
    }

    public function sections(): array
    {
        return $this->db->table('content_sections')->orderBy('id')->get()->getResultArray();
    }

    public function revisionMedia(int $revisionId): array
    {
        return $this->db->table('content_revision_media links')
            ->select('links.item_key, media.id AS media_file_id, media.uuid, media.original_name, media.mime_type, media.size_bytes, media.width, media.height')
            ->join('media_files media', 'media.id = links.media_file_id')
            ->where('links.revision_id', $revisionId)->get()->getResultArray();
    }

    public function latestPublishedRevision(): ?array
    {
        return $this->db->table('content_revisions')
            ->select('id, published_at, created_at')
            ->where('status', 'published')
            ->orderBy('id', 'DESC')
            ->get()->getRowArray();
    }
}
