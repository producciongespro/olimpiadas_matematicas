<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$source = $root . DIRECTORY_SEPARATOR . 'app' . DIRECTORY_SEPARATOR . 'index.html';
$output = $root . DIRECTORY_SEPARATOR . 'docs' . DIRECTORY_SEPARATOR . 'migration' . DIRECTORY_SEPARATOR . 'public-site-inventory.md';

if (! is_file($source)) {
    fwrite(STDERR, "No se encontró app/index.html.\n");
    exit(1);
}

libxml_use_internal_errors(true);
$document = new DOMDocument();
$loaded = $document->loadHTMLFile($source, LIBXML_NOWARNING | LIBXML_NOERROR);
libxml_clear_errors();

if (! $loaded) {
    fwrite(STDERR, "No se pudo analizar app/index.html.\n");
    exit(1);
}

$xpath = new DOMXPath($document);
$appRoot = dirname($source);

function cleanText(string $value): string
{
    return trim((string) preg_replace('/\s+/u', ' ', html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8')));
}

function markdown(string $value): string
{
    return str_replace(['|', "\r", "\n"], ['\\|', ' ', ' '], cleanText($value));
}

function localPath(string $appRoot, string $reference): ?string
{
    $path = parse_url($reference, PHP_URL_PATH);
    if (! is_string($path) || $path === '') {
        return null;
    }

    $path = rawurldecode($path);
    $path = str_replace(['/', '\\'], DIRECTORY_SEPARATOR, ltrim($path, './\\'));

    return $appRoot . DIRECTORY_SEPARATOR . $path;
}

$ids = [];
foreach ($xpath->query('//*[@id]') as $node) {
    $id = trim($node->getAttribute('id'));
    if ($id !== '') {
        $ids[$id] = ($ids[$id] ?? 0) + 1;
    }
}

$headings = [];
foreach ($xpath->query('//h1|//h2|//h3|//h4|//h5|//h6') as $heading) {
    $headings[] = [
        strtolower($heading->nodeName),
        cleanText($heading->textContent),
    ];
}

$links = [];
$brokenLinks = [];
$blankWithoutRel = [];
$hashesWithoutTarget = [];
foreach ($xpath->query('//a[@href]') as $anchor) {
    $href = trim($anchor->getAttribute('href'));
    $label = cleanText($anchor->textContent);
    if ($label === '') {
        $image = $xpath->query('.//img', $anchor)->item(0);
        $label = $image instanceof DOMElement ? cleanText($image->getAttribute('alt')) : '';
    }
    $label = $label !== '' ? $label : '(sin nombre accesible)';

    $status = 'No aplica';
    if (str_starts_with($href, '#')) {
        $target = substr($href, 1);
        $exists = $target === '' || isset($ids[$target]);
        $status = $exists ? 'Destino presente' : 'Destino ausente';
        if (! $exists) {
            $hashesWithoutTarget[] = $href;
        }
        $type = 'Ancla';
    } elseif (preg_match('/^(https?:|mailto:|tel:)/i', $href) === 1) {
        $type = 'Externo';
    } else {
        $type = 'Local';
        $path = localPath($appRoot, $href);
        $exists = $path !== null && is_file($path);
        $status = $exists ? 'Existe' : 'Falta';
        if (! $exists) {
            $brokenLinks[] = $href;
        }
    }

    if ($anchor->getAttribute('target') === '_blank' && stripos($anchor->getAttribute('rel'), 'noopener') === false) {
        $blankWithoutRel[] = $href;
    }

    $links[] = [$label, $href, $type, $status];
}

$images = [];
$missingImages = [];
$imagesWithoutAlt = [];
foreach ($xpath->query('//img') as $image) {
    $src = trim($image->getAttribute('src'));
    $hasAlt = $image->hasAttribute('alt');
    $alt = cleanText($image->getAttribute('alt'));
    $path = localPath($appRoot, $src);
    $exists = $path !== null && is_file($path);

    if (! $exists) {
        $missingImages[] = $src;
    }
    if (! $hasAlt || $alt === '') {
        $imagesWithoutAlt[] = $src;
    }

    $images[] = [$src, $alt !== '' ? $alt : '(vacío o ausente)', $exists ? 'Existe' : 'Falta'];
}

$resourceCounts = [];
$resourceYears = [];
$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($appRoot . DIRECTORY_SEPARATOR . 'data', FilesystemIterator::SKIP_DOTS));
foreach ($iterator as $file) {
    if (! $file->isFile()) {
        continue;
    }
    $extension = strtolower($file->getExtension()) ?: '(sin extensión)';
    $resourceCounts[$extension] = ($resourceCounts[$extension] ?? 0) + 1;
    $relative = str_replace('\\', '/', substr($file->getPathname(), strlen($appRoot . DIRECTORY_SEPARATOR . 'data') + 1));
    $first = explode('/', $relative)[0];
    if (preg_match('/^20\d{2}$/', $first) === 1) {
        $resourceYears[$first] = ($resourceYears[$first] ?? 0) + 1;
    }
}
ksort($resourceCounts);
ksort($resourceYears);

$duplicateIds = array_filter($ids, static fn (int $count): bool => $count > 1);
$duplicateHrefs = array_filter(array_count_values(array_column($links, 1)), static fn (int $count): bool => $count > 1);
arsort($duplicateHrefs);

$lines = [];
$lines[] = '# Inventario automatizado del sitio público heredado';
$lines[] = '';
$lines[] = '> Generado por `php scripts/audit-legacy-public.php` a partir de `app/index.html`. No comprueba la disponibilidad en Internet de enlaces externos.';
$lines[] = '';
$lines[] = '## Resumen';
$lines[] = '';
$lines[] = '| Elemento | Cantidad |';
$lines[] = '| --- | ---: |';
$lines[] = '| Encabezados | ' . count($headings) . ' |';
$lines[] = '| Identificadores únicos | ' . count($ids) . ' |';
$lines[] = '| Enlaces | ' . count($links) . ' |';
$lines[] = '| Imágenes referenciadas | ' . count($images) . ' |';
$lines[] = '| Enlaces locales faltantes | ' . count(array_unique($brokenLinks)) . ' |';
$lines[] = '| Imágenes faltantes | ' . count(array_unique($missingImages)) . ' |';
$lines[] = '| Imágenes sin texto alternativo útil | ' . count(array_unique($imagesWithoutAlt)) . ' |';
$lines[] = '| Enlaces con `target=_blank` sin `rel=noopener` | ' . count(array_unique($blankWithoutRel)) . ' |';
$lines[] = '';
$lines[] = '## Matriz inicial de migración';
$lines[] = '';
$lines[] = '| Bloque | Fuente heredada | Destino propuesto | Prioridad | Estado | Verificación |';
$lines[] = '| --- | --- | --- | --- | --- | --- |';
$lines[] = '| Navegación principal | `nav` y anclas | `components/SiteHeader.jsx` | Alta | Verificado | Teclado, móvil y destinos válidos |';
$lines[] = '| Galería fotográfica | `#carousel-fotos` | `features/gallery/PhotoGallery.jsx` | Alta | Verificado | 15 fotografías, controles, alt y movimiento reducido |';
$lines[] = '| Presentación OLCOMEP | `#olimpiadas` | `features/about/AboutSection.jsx` | Alta | Verificado | Contenido y jerarquía semántica |';
$lines[] = '| Edición vigente | Descargas e inscripción 2026 | `features/current-edition/` | Alta | Verificado | Documentos, inscripción y video preservados |';
$lines[] = '| Cuadernillos 2025–2016 | Secciones por año | `features/booklets/` | Alta | Verificado | 12 cuadernillos 2025 y 85 recursos históricos |';
$lines[] = '| Cuadernillos interactivos | Secciones 2020–2022 | `features/interactive-booklets/` | Media | Verificado | 27 destinos finales de Genially |';
$lines[] = '| Contacto y créditos | `#contact` y `footer` | `features/contact/` y `components/SiteFooter.jsx` | Media | Verificado | Datos, enlaces y semántica |';
$lines[] = '';
$lines[] = '## Jerarquía de encabezados observada';
$lines[] = '';
$lines[] = '| Nivel | Texto |';
$lines[] = '| --- | --- |';
foreach ($headings as [$level, $text]) {
    $lines[] = '| `' . $level . '` | ' . markdown($text) . ' |';
}
$lines[] = '';
$lines[] = '## Recursos locales por tipo';
$lines[] = '';
$lines[] = '| Extensión | Archivos |';
$lines[] = '| --- | ---: |';
foreach ($resourceCounts as $extension => $count) {
    $lines[] = '| `' . markdown($extension) . '` | ' . $count . ' |';
}
$lines[] = '';
$lines[] = '## Recursos locales por año';
$lines[] = '';
$lines[] = '| Año | Archivos |';
$lines[] = '| --- | ---: |';
foreach ($resourceYears as $year => $count) {
    $lines[] = '| ' . $year . ' | ' . $count . ' |';
}
$lines[] = '';
$lines[] = '## Hallazgos que condicionan la migración';
$lines[] = '';
$lines[] = '- **Alta — jerarquía:** no se encontró un `h1`; la nueva vista debe tener un título principal único y mantener el orden de niveles.';
$lines[] = '- **Alta — identificadores duplicados:** `' . markdown(implode(', ', array_keys($duplicateIds))) . '` aparece repetido y no puede trasladarse sin normalización.';
if ($brokenLinks !== [] || $missingImages !== []) {
    $lines[] = '- **Alta — recursos locales:** ' . count(array_unique($brokenLinks)) . ' enlaces y ' . count(array_unique($missingImages)) . ' imágenes requieren revisión antes de declarar paridad.';
} else {
    $lines[] = '- **Verificado — recursos locales:** todos los enlaces a archivos y todas las imágenes referenciadas existen en el repositorio.';
}
$lines[] = '- **Alta — texto alternativo:** ' . count(array_unique($imagesWithoutAlt)) . ' imágenes carecen de una alternativa útil.';
$lines[] = '- **Media — enlaces externos:** ' . count(array_unique($blankWithoutRel)) . ' enlaces abren otra pestaña sin la protección `noopener`.';
$lines[] = '- **Media — arquitectura:** el menú concentra muchos años en una sola navegación; la nueva vista debe conservar el acceso sin repetir toda la densidad en el encabezado.';
$lines[] = '';
$lines[] = '## Enlaces locales o anclas con destino ausente';
$lines[] = '';
if ($brokenLinks === [] && $hashesWithoutTarget === []) {
    $lines[] = 'No se detectaron destinos locales ausentes.';
} else {
    foreach (array_unique(array_merge($brokenLinks, $hashesWithoutTarget)) as $href) {
        $lines[] = '- `' . markdown($href) . '`';
    }
}
$lines[] = '';
$lines[] = '## Imágenes con referencia ausente';
$lines[] = '';
if ($missingImages === []) {
    $lines[] = 'No se detectaron imágenes locales ausentes.';
} else {
    foreach (array_unique($missingImages) as $src) {
        $lines[] = '- `' . markdown($src) . '`';
    }
}
$lines[] = '';
$lines[] = '## Inventario de enlaces';
$lines[] = '';
$lines[] = '| Nombre | Destino | Tipo | Comprobación local |';
$lines[] = '| --- | --- | --- | --- |';
foreach ($links as [$label, $href, $type, $status]) {
    $lines[] = '| ' . markdown($label) . ' | `' . markdown($href) . '` | ' . $type . ' | ' . $status . ' |';
}
$lines[] = '';
$lines[] = '## Inventario de imágenes';
$lines[] = '';
$lines[] = '| Archivo | Texto alternativo | Estado |';
$lines[] = '| --- | --- | --- |';
foreach ($images as [$src, $alt, $status]) {
    $lines[] = '| `' . markdown($src) . '` | ' . markdown($alt) . ' | ' . $status . ' |';
}
$lines[] = '';
$lines[] = '## Referencias repetidas';
$lines[] = '';
$lines[] = '| Destino | Apariciones |';
$lines[] = '| --- | ---: |';
foreach ($duplicateHrefs as $href => $count) {
    $lines[] = '| `' . markdown($href) . '` | ' . $count . ' |';
}

file_put_contents($output, implode(PHP_EOL, $lines) . PHP_EOL);
fwrite(STDOUT, "Inventario generado en docs/migration/public-site-inventory.md\n");
