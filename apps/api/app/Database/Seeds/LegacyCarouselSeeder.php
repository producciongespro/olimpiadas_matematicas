<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;
use RuntimeException;

class LegacyCarouselSeeder extends Seeder
{
    private const OLD_EVENT_UUID = '7a5ca6d3-9c33-4dfa-b848-ae86ce68b271';

    public function run(): void
    {
        $sourceRoot = dirname(rtrim(ROOTPATH, '/\\'), 2) . '/app/img';
        $targetRoot = WRITEPATH . 'uploads/carousel';
        if (! is_dir($targetRoot) && ! mkdir($targetRoot, 0775, true) && ! is_dir($targetRoot)) {
            throw new RuntimeException('No fue posible preparar el carrusel heredado.');
        }
        $oldEvent = $this->db->table('events')->where('uuid', self::OLD_EVENT_UUID)->get()->getRowArray();
        if ($oldEvent !== null) {
            $this->db->table('event_images')->where('event_id', $oldEvent['id'])->delete();
            $this->db->table('events')->where('id', $oldEvent['id'])->delete();
        }
        $now = date('Y-m-d H:i:s');
        foreach (range(1, 15) as $index) {
            $uuid = sprintf('b171ca01-0000-4000-8000-%012d', $index);
            $source = $sourceRoot . '/olimp' . $index . '.jpg';
            $filename = $uuid . '.jpg';
            $target = $targetRoot . '/' . $filename;
            if (! is_file($source)) throw new RuntimeException('Falta una fotografía heredada requerida.');
            if (! is_file($target) && ! copy($source, $target)) throw new RuntimeException('No fue posible copiar una imagen del carrusel.');
            [$width, $height] = getimagesize($target);
            $media = $this->db->table('media_files')->where('uuid', $uuid)->get()->getRowArray();
            $values = [
                'storage_path' => 'carousel/' . $filename, 'original_name' => 'olimp' . $index . '.jpg',
                'mime_type' => 'image/jpeg', 'size_bytes' => filesize($target), 'width' => $width, 'height' => $height,
                'checksum_sha256' => hash_file('sha256', $target), 'updated_at' => $now,
            ];
            if ($media === null) {
                $this->db->table('media_files')->insert(['uuid' => $uuid, 'created_at' => $now] + $values);
                $mediaId = (int) $this->db->insertID();
            } else {
                $mediaId = (int) $media['id'];
                $this->db->table('media_files')->where('id', $mediaId)->update($values);
            }
            if ($this->db->table('carousel_slides')->where('media_file_id', $mediaId)->countAllResults() === 0) {
                $this->db->table('carousel_slides')->insert([
                    'media_file_id' => $mediaId, 'title' => null,
                    'alt_text' => 'Actividad educativa de OLCOMEP, fotografía ' . $index,
                    'sort_order' => $index - 1, 'status' => 'published', 'published_at' => $now,
                    'created_at' => $now, 'updated_at' => $now,
                ]);
            }
            $this->db->table('carousel_slides')->where('media_file_id', $mediaId)->update([
                'title' => null,
                'updated_at' => $now,
            ]);
        }

        $oldDirectory = WRITEPATH . 'uploads/events/' . self::OLD_EVENT_UUID;
        if (is_dir($oldDirectory)) {
            foreach (glob($oldDirectory . '/b171ca01-0000-4000-8000-*.jpg') ?: [] as $oldFile) {
                unlink($oldFile);
            }
            @rmdir($oldDirectory);
        }
    }
}
