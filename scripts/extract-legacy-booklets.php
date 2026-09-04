<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$source = $root . '/app/index.html';
$output = $root . '/apps/public-web/src/features/booklets/historical-booklets.json';
$years = range(2024, 2016);

libxml_use_internal_errors(true);
$html = file_get_contents($source);
if (! is_string($html)) {
    fwrite(STDERR, "No se pudo leer app/index.html.\n");
    exit(1);
}

function normalizedPath(string $path): string
{
    $path = preg_replace('#^\./#', '', trim($path));
    $path = str_replace('\\', '/', (string) $path);
    return '/' . ltrim((string) $path, '/');
}

function gradeFromPath(string $path): ?int
{
    $name = preg_replace('/20(16|17|18|19|20|21|22|23|24)/', '', basename($path));
    preg_match_all('/(?<!\d)([1-6])(?:er|do|to)?(?:\.grado)?(?!\d)/i', (string) $name, $matches);
    if (($matches[1] ?? []) === []) {
        return null;
    }
    return (int) end($matches[1]);
}

function roleFromPath(string $path): string
{
    $name = strtolower(basename($path));
    return preg_match('/docente|cuadernillo-doc|^d-/', $name) === 1 ? 'docente' : 'estudiante';
}

$catalog = [];
foreach ($years as $year) {
    if (preg_match('/id=["\']cuadernillos-' . $year . '["\']/i', $html, $startMatch, PREG_OFFSET_CAPTURE) !== 1) {
        continue;
    }

    $start = $startMatch[0][1];
    $afterStart = substr($html, $start + strlen($startMatch[0][0]));
    $length = strlen($afterStart);
    if (preg_match('/id=["\']cuadernillos-20\d{2}(?:-[^"\']*)?["\']/i', $afterStart, $nextMatch, PREG_OFFSET_CAPTURE) === 1) {
        $length = $nextMatch[0][1];
    }

    $fragment = substr($html, $start, $length);
    $document = new DOMDocument();
    $document->loadHTML('<html><body>' . $fragment . '</body></html>', LIBXML_NOWARNING | LIBXML_NOERROR);
    $xpath = new DOMXPath($document);

    $resources = [];
    foreach ($xpath->query('//a[@href]') as $anchor) {
        $href = trim($anchor->getAttribute('href'));
        if (strtolower(pathinfo(parse_url($href, PHP_URL_PATH) ?? '', PATHINFO_EXTENSION)) !== 'pdf') {
            continue;
        }

        $image = $xpath->query('.//img[@src]', $anchor)->item(0);
        $imageSource = $image instanceof DOMElement ? trim($image->getAttribute('src')) : '';
        $imageSource = str_replace(['./img/iconos/', 'img/iconos/'], '/assets/legacy/booklets/', $imageSource);
        $grade = gradeFromPath($href) ?? gradeFromPath($imageSource);

        $resources[] = [
            'grade' => $grade,
            'href' => normalizedPath($href),
            'image' => $imageSource,
            'role' => $grade === null ? 'general' : roleFromPath($href),
        ];
    }

    $catalog[(string) $year] = $resources;
}

file_put_contents($output, json_encode($catalog, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . PHP_EOL);
fwrite(STDOUT, "Catálogo histórico generado: {$output}\n");
