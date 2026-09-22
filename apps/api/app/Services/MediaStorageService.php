<?php

namespace App\Services;

use CodeIgniter\HTTP\Files\UploadedFile;
use RuntimeException;

class MediaStorageService
{
    private const MIMES = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

    public function store(UploadedFile $file, string $directory, ?int $minimumDimension = null): array
    {
        if (! $file->isValid() || $file->hasMoved()) {
            throw new RuntimeException('La imagen cargada no es válida.');
        }
        $maxBytes = (int) env('media.maxBytes', 8 * 1024 * 1024);
        $minDimension = $minimumDimension ?? (int) env('media.minDimension', 640);
        $maxDimension = (int) env('media.maxDimension', 6000);
        if ($file->getSize() < 1 || $file->getSize() > $maxBytes) {
            throw new RuntimeException('La imagen debe pesar como máximo 8 MB.');
        }
        $info = @getimagesize($file->getTempName());
        $mime = is_array($info) ? ($info['mime'] ?? '') : '';
        if (! isset(self::MIMES[$mime])) {
            throw new RuntimeException('Solo se permiten imágenes JPEG, PNG o WebP válidas.');
        }
        [$width, $height] = $info;
        if (min($width, $height) < $minDimension || max($width, $height) > $maxDimension) {
            throw new RuntimeException("La imagen debe medir entre {$minDimension} y {$maxDimension} píxeles por lado.");
        }
        $uuid = $this->uuid();
        $relative = trim($directory, '/') . '/' . $uuid . '.' . self::MIMES[$mime];
        $target = WRITEPATH . 'uploads/' . dirname($relative);
        if (! is_dir($target) && ! mkdir($target, 0775, true) && ! is_dir($target)) {
            throw new RuntimeException('No fue posible preparar el almacenamiento.');
        }
        $file->move($target, basename($relative));
        $absolute = WRITEPATH . 'uploads/' . $relative;
        return [
            'uuid' => $uuid, 'storage_path' => str_replace('\\', '/', $relative),
            'original_name' => mb_substr(basename($file->getClientName()), 0, 255),
            'mime_type' => $mime, 'size_bytes' => filesize($absolute),
            'width' => $width, 'height' => $height, 'checksum_sha256' => hash_file('sha256', $absolute),
            'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s'),
        ];
    }

    public function storePdf(UploadedFile $file, string $directory): array
    {
        if (! $file->isValid() || $file->hasMoved()) throw new RuntimeException('El manual cargado no es válido.');
        $maxBytes = (int) env('media.documentMaxBytes', 16 * 1024 * 1024);
        if ($file->getSize() < 1 || $file->getSize() > $maxBytes) throw new RuntimeException('El manual debe pesar como máximo 16 MB.');
        $temporaryPath = $file->getTempName();
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($temporaryPath);
        $signature = file_get_contents($temporaryPath, false, null, 0, 5);
        if ($mime !== 'application/pdf' || $signature !== '%PDF-') throw new RuntimeException('Solo se permite un archivo PDF válido para el manual.');
        $uuid = $this->uuid();
        $relative = trim($directory, '/') . '/' . $uuid . '.pdf';
        $target = WRITEPATH . 'uploads/' . dirname($relative);
        if (! is_dir($target) && ! mkdir($target, 0775, true) && ! is_dir($target)) throw new RuntimeException('No fue posible preparar el almacenamiento.');
        $file->move($target, basename($relative));
        $absolute = WRITEPATH . 'uploads/' . $relative;
        return [
            'uuid' => $uuid, 'storage_path' => str_replace('\\', '/', $relative),
            'original_name' => mb_substr(basename($file->getClientName()), 0, 255),
            'mime_type' => 'application/pdf', 'size_bytes' => filesize($absolute),
            'width' => 0, 'height' => 0, 'checksum_sha256' => hash_file('sha256', $absolute),
            'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s'),
        ];
    }

    public function delete(string $relativePath): void
    {
        $root = realpath(WRITEPATH . 'uploads');
        $path = realpath(WRITEPATH . 'uploads/' . ltrim($relativePath, '/'));
        if ($root !== false && $path !== false && str_starts_with($path, $root . DIRECTORY_SEPARATOR) && is_file($path)) {
            unlink($path);
        }
    }

    public function importLocalImage(string $sourcePath, string $directory): array
    {
        $resolved = realpath($sourcePath);
        if ($resolved === false || ! is_file($resolved)) throw new RuntimeException('La imagen de importación no existe.');
        $info = @getimagesize($resolved);
        $mime = is_array($info) ? ($info['mime'] ?? '') : '';
        if (! isset(self::MIMES[$mime])) throw new RuntimeException('La imagen de importación no tiene un formato permitido.');
        [$width, $height] = $info;
        if (min($width, $height) < 300 || max($width, $height) > (int) env('media.maxDimension', 6000)) throw new RuntimeException('La imagen de importación no tiene dimensiones permitidas.');
        if (filesize($resolved) < 1 || filesize($resolved) > (int) env('media.maxBytes', 8 * 1024 * 1024)) throw new RuntimeException('La imagen de importación supera el tamaño permitido.');
        $uuid = $this->uuid();
        $relative = trim($directory, '/') . '/' . $uuid . '.' . self::MIMES[$mime];
        $targetDirectory = WRITEPATH . 'uploads/' . dirname($relative);
        if (! is_dir($targetDirectory) && ! mkdir($targetDirectory, 0775, true) && ! is_dir($targetDirectory)) throw new RuntimeException('No fue posible preparar el almacenamiento.');
        $target = WRITEPATH . 'uploads/' . $relative;
        if (! copy($resolved, $target)) throw new RuntimeException('No fue posible importar la imagen.');
        return ['uuid' => $uuid, 'storage_path' => str_replace('\\', '/', $relative), 'original_name' => mb_substr(basename($resolved), 0, 255), 'mime_type' => $mime, 'size_bytes' => filesize($target), 'width' => $width, 'height' => $height, 'checksum_sha256' => hash_file('sha256', $target), 'created_at' => date('Y-m-d H:i:s'), 'updated_at' => date('Y-m-d H:i:s')];
    }

    private function uuid(): string
    {
        $hex = bin2hex(random_bytes(16));
        return substr($hex, 0, 8) . '-' . substr($hex, 8, 4) . '-4' . substr($hex, 13, 3) . '-' . dechex((hexdec($hex[16]) & 3) | 8) . substr($hex, 17, 3) . '-' . substr($hex, 20);
    }
}
