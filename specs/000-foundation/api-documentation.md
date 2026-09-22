# Especificación — documentación técnica de la API

## Objetivo

Mantener un contrato único, navegable y verificable para todas las rutas `/api/v1`, sin publicar el portal técnico en producción.

## Reglas

- `apps/api/app/Docs/api/openapi-v1.yaml` es la fuente canónica y usa OpenAPI 3.1.
- Cada operación declara etiqueta, `operationId`, seguridad, entradas y respuestas relevantes.
- Las rutas públicas declaran `security: []`; las administrativas usan `entraBearer`.
- Las nueve secciones editoriales cuentan con esquemas estructurados y una enumeración de claves vigente.
- `docs:sync` genera la copia pública; no se mantiene manualmente una segunda fuente.
- `docs:check` falla si la copia difiere o si las operaciones reales y documentadas no coinciden.
- El portal y los documentos solo se sirven fuera de `production` y mediante una lista cerrada de archivos.
- Swagger UI se sirve desde activos locales versionados; el portal no depende de una CDN ni de acceso a Internet para cargar el contrato.
- El valor `CI_ENVIRONMENT` definido por el proceso tiene precedencia sobre cualquier valor incluido en el archivo privado seleccionado.
- Los errores documentados nunca incluyen trazas, secretos ni datos personales.

## Criterios de aceptación

1. `/docs` presenta Swagger UI en desarrollo con sus estilos y JavaScript locales, sin permanecer en estado de carga ni mostrar errores de análisis del contrato.
2. `/docs`, `/docs/api/*` y `/docs/markdown/*` no se registran en producción.
3. No es posible descargar un archivo fuera de la lista permitida.
4. `php spark docs:sync` produce una copia idéntica por SHA-256.
5. `php spark docs:check` confirma cobertura exacta de las rutas `/api/v1`.
6. La suite automatizada cubre disponibilidad, activos locales, tipos MIME, aislamiento de archivos, sincronización y cobertura de rutas.
