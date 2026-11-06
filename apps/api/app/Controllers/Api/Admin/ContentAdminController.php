<?php

namespace App\Controllers\Api\Admin;

use App\Controllers\BaseController;
use App\Services\ContentService;
use CodeIgniter\HTTP\Files\UploadedFile;
use CodeIgniter\HTTP\Exceptions\HTTPException;
use CodeIgniter\HTTP\ResponseInterface;
use InvalidArgumentException;
use Throwable;

class ContentAdminController extends BaseController
{
    private function service(): ContentService { return new ContentService(); }
    private function input(): array
    {
        $contentType = strtolower(trim(explode(';', $this->request->getHeaderLine('Content-Type'), 2)[0]));
        if ($contentType !== 'application/json') return $this->request->getPost();

        try {
            $input = $this->request->getJSON(true);
        } catch (HTTPException $exception) {
            throw new InvalidArgumentException('El cuerpo JSON del borrador no es válido.', 0, $exception);
        }
        if (! is_array($input) || array_is_list($input)) throw new InvalidArgumentException('El cuerpo JSON del borrador debe ser un objeto con campos.');

        return $input;
    }
    private function image(): ?UploadedFile { $file = $this->request->getFile('image'); return $file instanceof UploadedFile ? $file : null; }
    private function run(callable $action): ResponseInterface
    {
        try { return $action(); }
        catch (InvalidArgumentException $e) { return $this->response->setStatusCode(422)->setJSON(['message' => $e->getMessage()]); }
        catch (Throwable $e) { log_message('error', 'Error de contenido: {message}', ['message' => $e->getMessage()]); return $this->response->setStatusCode(500)->setJSON(['message' => 'No fue posible completar la operación.']); }
    }
    private function ok(mixed $data): ResponseInterface { return $this->response->setJSON(['data' => $data]); }

    public function sections(): ResponseInterface { return $this->run(fn () => $this->ok($this->service()->adminSections())); }
    public function section(string $key): ResponseInterface { return $this->run(fn () => $this->ok($this->service()->adminSection($key))); }
    public function saveDraft(string $key): ResponseInterface { return $this->run(fn () => $this->ok($this->service()->saveDraft($key, $this->input(), $this->image(), service('adminAuthContext')->user()['email'] ?? null, $this->request->getFiles()))); }
    public function publish(string $key): ResponseInterface { return $this->run(fn () => $this->ok($this->service()->publish($key))); }
}
