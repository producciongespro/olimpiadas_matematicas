<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Services\GalleryService;
use CodeIgniter\HTTP\ResponseInterface;

class MediaController extends BaseController
{
    public function carousel(): ResponseInterface { return $this->response->setJSON(['data' => (new GalleryService())->publicCarousel()]); }
    public function events(): ResponseInterface { return $this->response->setJSON(['data' => (new GalleryService())->events()]); }

    public function event(string $slug): ResponseInterface
    {
        $event = (new GalleryService())->event($slug);
        return $event === null ? $this->response->setStatusCode(404)->setJSON(['message' => 'El evento no está disponible.']) : $this->response->setJSON(['data' => $event]);
    }

    public function file(string $uuid): ResponseInterface
    {
        $media = (new GalleryService())->media($uuid);
        if ($media === null) return $this->response->setStatusCode(404)->setJSON(['message' => 'La imagen no está disponible.']);
        $path = WRITEPATH . 'uploads/' . $media['storage_path'];
        $root = realpath(WRITEPATH . 'uploads');
        $resolved = realpath($path);
        if ($root === false || $resolved === false || ! str_starts_with($resolved, $root . DIRECTORY_SEPARATOR) || ! is_file($resolved)) return $this->response->setStatusCode(404)->setJSON(['message' => 'La imagen no está disponible.']);
        $etag = '"' . $media['checksum_sha256'] . '"';
        if ($this->request->getHeaderLine('If-None-Match') === $etag) return $this->response->setStatusCode(304);
        return $this->response->setHeader('Content-Type', $media['mime_type'])->setHeader('Content-Length', (string) filesize($path))
            ->setHeader('Cache-Control', 'public, max-age=86400')->setHeader('ETag', $etag)->setHeader('X-Content-Type-Options', 'nosniff')->setBody(file_get_contents($resolved));
    }
}
