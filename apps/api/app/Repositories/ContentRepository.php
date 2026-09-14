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
}
