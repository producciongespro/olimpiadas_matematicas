<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use RuntimeException;

class PublicContentSeeder extends Seeder
{
    private const HERO = [
        'eyebrow' => 'OLCOMEP · Costa Rica',
        'title' => 'Olimpiada de Matemática para Primaria',
        'audience' => 'Para estudiantes de 1.º a 6.º año',
        'description' => 'Imaginar, resolver y crecer mediante una competencia sana que impulsa el talento y la resolución de problemas en estudiantes de Educación Primaria de todo el país.',
        'primary_label' => 'Ver edición 2026',
        'primary_href' => '#edicion-vigente',
        'secondary_label' => 'Conocer OLCOMEP',
        'secondary_href' => '#olimpiadas',
        'image_alt' => 'Niñas y niños que representan a la comunidad estudiantil de OLCOMEP',
    ];

    public function run(): void
    {
        $sections = $this->db->table('content_sections');
        $section = $sections->where('section_key', 'hero')->get()->getRowArray();
        $now = date('Y-m-d H:i:s');
        if ($section === null) {
            $sections->insert(['section_key' => 'hero', 'label' => 'Portada principal', 'schema_version' => 1, 'created_at' => $now, 'updated_at' => $now]);
            $sectionId = (int) $this->db->insertID();
        } else {
            $sectionId = (int) $section['id'];
        }

        $mediaId = $this->ensureHeroMedia($now);
        $published = $this->db->table('content_revisions')->where('section_id', $sectionId)->where('status', 'published')->get()->getRowArray();
        if ($published === null) {
            $this->db->table('content_revisions')->insert([
                'section_id' => $sectionId,
                'media_file_id' => $mediaId,
                'content_json' => json_encode(self::HERO, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                'status' => 'published',
                'created_at' => $now,
                'published_at' => $now,
            ]);
        } elseif ($published['media_file_id'] === null) {
            $this->db->table('content_revisions')->where('id', $published['id'])->update(['media_file_id' => $mediaId]);
        }
    }

    private function ensureHeroMedia(string $now): int
    {
        $uuid = 'c04f7c62-6fc9-4a25-97c7-9b3e8fabcd01';
        $media = $this->db->table('media_files')->where('uuid', $uuid)->get()->getRowArray();
        if ($media !== null) return (int) $media['id'];

        $source = dirname(rtrim(ROOTPATH, '/\\')) . '/public-web/public/assets/legacy/brand/ninos-olcomep.png';
        $directory = WRITEPATH . 'uploads/sections/hero';
        $target = $directory . '/' . $uuid . '.png';
        if (! is_file($source)) throw new RuntimeException('Falta la imagen inicial de la portada.');
        if (! is_dir($directory) && ! mkdir($directory, 0775, true) && ! is_dir($directory)) throw new RuntimeException('No fue posible preparar la carpeta de la portada.');
        if (! is_file($target) && ! copy($source, $target)) throw new RuntimeException('No fue posible importar la imagen inicial de la portada.');
        [$width, $height] = getimagesize($target);
        $this->db->table('media_files')->insert([
            'uuid' => $uuid, 'storage_path' => 'sections/hero/' . basename($target), 'original_name' => 'ninos-olcomep.png',
            'mime_type' => 'image/png', 'size_bytes' => filesize($target), 'width' => $width, 'height' => $height,
            'checksum_sha256' => hash_file('sha256', $target), 'created_at' => $now, 'updated_at' => $now,
        ]);
        return (int) $this->db->insertID();
    }
}
