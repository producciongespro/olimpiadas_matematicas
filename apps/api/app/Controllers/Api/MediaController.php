<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Services\GalleryService;
use CodeIgniter\HTTP\ResponseInterface;

class MediaController extends BaseController
{
    public function carousel(): ResponseInterface { return $this->cachedJson((new GalleryService())->publicCarousel()); }
    public function events(): ResponseInterface { return $this->cachedJson((new GalleryService())->events()); }

    public function event(string $slug): ResponseInterface
    {
        $event = (new GalleryService())->event($slug);
        return $event === null ? $this->response->setStatusCode(404)->setJSON(['message' => 'El evento no está disponible.']) : $this->cachedJson($event);
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
        $this->response->removeHeader('Cache-Control');
        if ($this->request->getHeaderLine('If-None-Match') === $etag) {
            return $this->response->setStatusCode(304)
                ->setHeader('Cache-Control', 'public, max-age=31536000, immutable')
                ->setHeader('ETag', $etag);
        }
        return $this->response->setHeader('Content-Type', $media['mime_type'])->setHeader('Content-Length', (string) filesize($path))
            ->setHeader('Cache-Control', 'public, max-age=31536000, immutable')->setHeader('ETag', $etag)->setHeader('X-Content-Type-Options', 'nosniff')->setBody(file_get_contents($resolved));
    }

    private function cachedJson(array $data): ResponseInterface
    {
        $etag = '"' . hash('sha256', json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) . '"';
        $this->response->removeHeader('Cache-Control');
        if ($this->request->getHeaderLine('If-None-Match') === $etag) {
            return $this->response->setStatusCode(304)
                ->setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
                ->setHeader('ETag', $etag);
        }
        return $this->response
            ->setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
            ->setHeader('ETag', $etag)
            ->setJSON(['data' => $data, 'meta' => ['version' => trim($etag, '"')]]);
    }
}
