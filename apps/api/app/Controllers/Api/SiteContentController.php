<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Services\ContentService;
use CodeIgniter\HTTP\ResponseInterface;

class SiteContentController extends BaseController
{
    public function home(): ResponseInterface
    {
        $snapshot = (new ContentService())->publicHomeSnapshot();
        $etag = '"' . hash('sha256', json_encode($snapshot, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) . '"';
        $this->response->removeHeader('Cache-Control');
        if ($this->request->getHeaderLine('If-None-Match') === $etag) {
            return $this->response->setStatusCode(304)
                ->setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
                ->setHeader('ETag', $etag);
        }

        return $this->response
            ->setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
            ->setHeader('ETag', $etag)
            ->setJSON(['data' => $snapshot['sections'], 'meta' => ['version' => $snapshot['version']]]);
    }
}
