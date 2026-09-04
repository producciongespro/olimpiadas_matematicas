<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class HealthController extends BaseController
{
    public function index(): ResponseInterface
    {
        return $this->response->setJSON([
            'data' => [
                'service' => 'olcomep-api',
                'status'  => 'ok',
            ],
        ]);
    }

    public function options(): ResponseInterface
    {
        return $this->response->setStatusCode(ResponseInterface::HTTP_NO_CONTENT);
    }
}
