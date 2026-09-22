<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <base href="<?= esc($docsBase, 'attr') ?>">
    <title>Documentación técnica | API OLCOMEP</title>
    <link rel="stylesheet" href="assets/swagger-ui.css">
    <link rel="stylesheet" href="assets/portal.css">
</head>
<body>
    <a class="skip-link" href="#referencia-api">Saltar a la referencia de la API</a>
    <header class="docs-header">
        <div class="docs-brand">
            <img src="/assets/logo-olcomep.png" alt="OLCOMEP">
            <div>
                <p class="eyebrow">Portal para desarrollo e integración</p>
                <h1>Documentación técnica de la API</h1>
                <p>Contrato único para la vista pública, administración editorial, medios y autorizaciones.</p>
            </div>
        </div>
        <div class="badges" aria-label="Características del contrato">
            <span>OpenAPI 3.1</span><span>Solo desarrollo</span><span>Microsoft Entra ID</span>
        </div>
    </header>
    <nav aria-label="Guías técnicas">
        <a href="#referencia-api" aria-current="page">Referencia API</a>
        <a href="markdown/api-contract.md">Mantenimiento</a>
        <a href="markdown/frontend-integration.md">Integración frontend</a>
        <a href="markdown/security.md">Seguridad</a>
        <a href="markdown/operations.md">Operaciones</a>
        <a href="markdown/errors-and-versioning.md">Errores y versiones</a>
        <a href="api/openapi-v1.yaml">Descargar OpenAPI</a>
    </nav>
    <main id="referencia-api" tabindex="-1">
        <div class="intro"><p class="eyebrow">Contrato interactivo</p><h2>Referencia de endpoints</h2><p>Consulte parámetros, cuerpos, respuestas y requisitos de autenticación.</p></div>
        <div id="swagger-ui"></div>
    </main>
    <footer>OLCOMEP · Documentación técnica para desarrollo</footer>
    <noscript>Active JavaScript para consultar la referencia interactiva.</noscript>
    <script src="assets/swagger-ui-bundle.js"></script>
    <script>window.addEventListener('load', function () { SwaggerUIBundle({url: 'api/openapi-v1.yaml', dom_id: '#swagger-ui', deepLinking: true, displayRequestDuration: true, persistAuthorization: false, tryItOutEnabled: false}); });</script>
</body>
</html>
