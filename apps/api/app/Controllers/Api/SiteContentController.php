<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Services\ContentService;
use CodeIgniter\HTTP\ResponseInterface;

class SiteContentController extends BaseController
{
    public function home(): ResponseInterface
    {
        return $this->response->setJSON(['data' => (new ContentService())->publicHome()]);
    }
}
