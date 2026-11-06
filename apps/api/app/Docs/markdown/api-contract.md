# Contrato de la API

El portal interactivo sirve localmente una versión fijada de Swagger UI. No depende de una CDN ni de conectividad a Internet para representar el contrato en desarrollo.

`app/Docs/api/openapi-v1.yaml` es la única fuente canónica. Los antiguos contratos fragmentados de `docs/api/` quedan sustituidos por este archivo.

Después de modificar rutas, entradas o respuestas:

1. Actualice el contrato canónico y su versión semántica.
2. Ejecute `php spark docs:sync` desde `apps/api`.
3. Ejecute `php spark docs:check`.
4. Ejecute `composer test`.

Como comprobación final puede ejecutar `composer verify`, que agrupa pruebas y auditoría documental.

`docs:check` compara la copia generada en `public/openapi/openapi-v1.yaml` por SHA-256 y contrasta cada operación `/api/v1` registrada en CodeIgniter con OpenAPI. Una ruta real sin contrato, o una operación documentada inexistente, hace fallar la verificación.

## Encabezado fijo

La respuesta pública conserva la clave site-header con el encabezado fijo. La lista de secciones editables la omite y su detalle administrativo devuelve un borrador nulo. Los intentos de guardar o publicar esa clave responden con HTTP 422.

La etiqueta «Edición AAAA» se calcula a partir del año publicado en Edición vigente. El destino es #edicion-vigente y, si falta un año válido, se muestra «Edición vigente».

Los borradores editoriales se envían como campos de formulario multipart o como un objeto JSON, según Content-Type. Un JSON inválido recibe HTTP 422.
