<?php

namespace App\Controllers\Api\Admin;

use App\Controllers\BaseController;
use App\Services\GalleryService;
use CodeIgniter\HTTP\Files\UploadedFile;
use CodeIgniter\HTTP\ResponseInterface;
use InvalidArgumentException;
use Throwable;

class MediaAdminController extends BaseController
{
    private function service(): GalleryService { return new GalleryService(); }
    private function input(): array { return $this->request->getJSON(true) ?: $this->request->getPost(); }
    private function image(): ?UploadedFile { $file = $this->request->getFile('image'); return $file instanceof UploadedFile ? $file : null; }
    private function ok(mixed $data, int $status = 200): ResponseInterface { return $this->response->setStatusCode($status)->setJSON(['data' => $data]); }
    private function run(callable $action): ResponseInterface
    {
        try { return $action(); }
        catch (InvalidArgumentException $e) { return $this->response->setStatusCode(422)->setJSON(['message' => $e->getMessage()]); }
        catch (Throwable $e) { log_message('error', 'Error de medios: {message}', ['message' => $e->getMessage()]); return $this->response->setStatusCode(500)->setJSON(['message' => 'No fue posible completar la operación.']); }
    }

    public function carousel(): ResponseInterface { return $this->run(fn () => $this->ok($this->service()->adminCarousel())); }
    public function file(string $uuid): ResponseInterface
    {
        return $this->run(function () use ($uuid) {
            $media = $this->service()->adminMedia($uuid);
            if ($media === null) return $this->response->setStatusCode(404)->setJSON(['message' => 'La imagen no existe.']);
            $root = realpath(WRITEPATH . 'uploads');
            $resolved = realpath(WRITEPATH . 'uploads/' . $media['storage_path']);
            if ($root === false || $resolved === false || ! str_starts_with($resolved, $root . DIRECTORY_SEPARATOR) || ! is_file($resolved)) return $this->response->setStatusCode(404)->setJSON(['message' => 'La imagen no existe.']);
            return $this->response->setHeader('Content-Type', $media['mime_type'])->setHeader('Content-Length', (string) filesize($resolved))->setHeader('Cache-Control', 'private, no-store')->setHeader('X-Content-Type-Options', 'nosniff')->setBody((string) file_get_contents($resolved));
        });
    }
    public function createSlide(): ResponseInterface { return $this->run(function () { $file = $this->image(); if ($file === null) throw new InvalidArgumentException('La imagen es obligatoria.'); return $this->ok($this->service()->createSlide($this->input(), $file), 201); }); }
    public function updateSlide(int $id): ResponseInterface { return $this->run(fn () => $this->ok($this->service()->updateSlide($id, $this->input(), $this->image()))); }
    public function archiveSlide(int $id): ResponseInterface { return $this->run(fn () => $this->ok($this->service()->archiveSlide($id))); }
    public function reorderSlides(): ResponseInterface { return $this->run(fn () => $this->ok($this->service()->reorderSlides($this->input()['ids'] ?? []))); }
    public function events(): ResponseInterface { return $this->run(fn () => $this->ok($this->service()->events(false))); }
    public function event(int $id): ResponseInterface { return $this->run(function () use ($id) { $event = $this->service()->event($id, false); if ($event === null) throw new InvalidArgumentException('El evento no existe.'); return $this->ok($event); }); }
    public function createEvent(): ResponseInterface { return $this->run(fn () => $this->ok($this->service()->createEvent($this->input()), 201)); }
    public function updateEvent(int $id): ResponseInterface { return $this->run(fn () => $this->ok($this->service()->updateEvent($id, $this->input()))); }
    public function archiveEvent(int $id): ResponseInterface { return $this->run(fn () => $this->ok($this->service()->archiveEvent($id))); }
    public function addEventImage(int $id): ResponseInterface { return $this->run(function () use ($id) { $file = $this->image(); if ($file === null) throw new InvalidArgumentException('La imagen es obligatoria.'); return $this->ok($this->service()->addEventImage($id, $this->input(), $file), 201); }); }
    public function updateEventImage(int $id): ResponseInterface { return $this->run(fn () => $this->ok($this->service()->updateEventImage($id, $this->input(), $this->image()))); }
    public function deleteEventImage(int $id): ResponseInterface { return $this->run(fn () => $this->ok($this->service()->deleteEventImage($id))); }
    public function reorderEventImages(int $id): ResponseInterface { return $this->run(fn () => $this->ok($this->service()->reorderEventImages($id, $this->input()['ids'] ?? []))); }
}
