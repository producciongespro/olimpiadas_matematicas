# Errores y versionamiento

La versión mayor de la URL es `/api/v1`. Cambios compatibles incrementan la versión menor o de parche de `info.version`; un cambio incompatible exige una nueva versión mayor de la API y un periodo de transición explícito.

Los errores controlados usan `{ "message": "..." }`. Los estados usuales son `401` para token ausente o inválido, `403` para autorización insuficiente, `404` para recurso público no disponible y `422` para datos o reglas de negocio inválidas. Los errores internos devuelven un mensaje seguro sin trazas.

Las respuestas `304` no incluyen cuerpo y dependen del `ETag` enviado previamente por la API.
