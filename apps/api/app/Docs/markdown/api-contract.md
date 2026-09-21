# Contrato de la API

`app/Docs/api/openapi-v1.yaml` es la única fuente canónica. Los antiguos contratos fragmentados de `docs/api/` quedan sustituidos por este archivo.

Después de modificar rutas, entradas o respuestas:

1. Actualice el contrato canónico y su versión semántica.
2. Ejecute `php spark docs:sync` desde `apps/api`.
3. Ejecute `php spark docs:check`.
4. Ejecute `composer test`.

Como comprobación final puede ejecutar `composer verify`, que agrupa pruebas y auditoría documental.

`docs:check` compara la copia generada en `public/openapi/openapi-v1.yaml` por SHA-256 y contrasta cada operación `/api/v1` registrada en CodeIgniter con OpenAPI. Una ruta real sin contrato, o una operación documentada inexistente, hace fallar la verificación.
