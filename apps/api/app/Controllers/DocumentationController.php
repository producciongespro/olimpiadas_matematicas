<?php

namespace App\Controllers;

use CodeIgniter\HTTP\ResponseInterface;

final class DocumentationController extends BaseController
{
    private const API_FILES = ['openapi-v1.yaml'];
    private const ASSET_FILES = ['portal.css'];
    private const MARKDOWN_FILES = [
        'api-contract.md',
        'errors-and-versioning.md',
        'frontend-integration.md',
        'operations.md',
        'security.md',
    ];

    public function index(): string
    {
        $scriptName = str_replace('\\', '/', (string) $this->request->getServer('SCRIPT_NAME'));
        $publicBase = is_cli() ? '' : rtrim(str_replace('\\', '/', dirname($scriptName)), '/.');

        return view('docs/index', [
            'docsBase' => ($publicBase === '' ? '' : $publicBase) . '/docs/',
        ]);
    }

    public function api(string $file): ResponseInterface
    {
        return $this->serveAllowedFile($file, self::API_FILES, APPPATH . 'Docs/api/', 'application/yaml; charset=UTF-8');
    }

    public function asset(string $file): ResponseInterface
    {
        return $this->serveAllowedFile($file, self::ASSET_FILES, APPPATH . 'Docs/assets/', 'text/css; charset=UTF-8');
    }

    public function markdown(string $file): ResponseInterface
    {
        return $this->serveAllowedFile($file, self::MARKDOWN_FILES, APPPATH . 'Docs/markdown/', 'text/markdown; charset=UTF-8');
    }

    /** @param list<string> $allowed */
    private function serveAllowedFile(string $file, array $allowed, string $directory, string $contentType): ResponseInterface
    {
        if (! in_array($file, $allowed, true) || basename($file) !== $file) {
            return $this->notFound();
        }

        $basePath = realpath($directory);
        $filePath = realpath($directory . $file);
        if ($basePath === false || $filePath === false || ! str_starts_with($filePath, $basePath . DIRECTORY_SEPARATOR)) {
            return $this->notFound();
        }

        return $this->response
            ->setHeader('Content-Type', $contentType)
            ->setHeader('X-Content-Type-Options', 'nosniff')
            ->setBody((string) file_get_contents($filePath));
    }

    private function notFound(): ResponseInterface
    {
        return $this->response->setStatusCode(404)->setJSON([
            'message' => 'Documento no encontrado.',
        ]);
    }
}
