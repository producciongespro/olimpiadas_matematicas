<?php

namespace App\Controllers\Api\Admin;

use App\Controllers\BaseController;
use App\Exceptions\ForbiddenException;
use App\Services\AdminUserService;
use CodeIgniter\HTTP\ResponseInterface;
use InvalidArgumentException;
use Throwable;

class AdminUsersController extends BaseController
{
    private function actor(): array { return service('request')->localAdminUser ?? []; }
    private function input(): array { return $this->request->getJSON(true) ?: $this->request->getPost(); }
    private function service(): AdminUserService { return new AdminUserService(); }
    private function run(callable $action, int $status = 200): ResponseInterface
    {
        try { return $this->response->setStatusCode($status)->setJSON(['data' => $action()]); }
        catch (ForbiddenException $e) { return $this->response->setStatusCode(403)->setJSON(['message' => $e->getMessage()]); }
        catch (InvalidArgumentException $e) { return $this->response->setStatusCode(422)->setJSON(['message' => $e->getMessage()]); }
        catch (Throwable $e) { log_message('error', 'Error de usuarios administrativos: {message}', ['message' => $e->getMessage()]); return $this->response->setStatusCode(500)->setJSON(['message' => 'No fue posible completar la operación.']); }
    }
    public function profile(): ResponseInterface { return $this->run(fn () => $this->actor()); }
    public function index(): ResponseInterface { return $this->run(fn () => $this->service()->all($this->actor())); }
    public function create(): ResponseInterface { return $this->run(fn () => $this->service()->create($this->actor(), $this->input()), 201); }
    public function update(int $id): ResponseInterface { return $this->run(fn () => $this->service()->update($this->actor(), $id, $this->input())); }
}
