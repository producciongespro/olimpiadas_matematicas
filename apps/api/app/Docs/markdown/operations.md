# Operaciones

En desarrollo, inicie la API con `php spark serve --port 3600` y abra `/docs`. La interfaz es de consulta: `try it out` permanece desactivado para reducir operaciones accidentales.

Antes de desplegar ejecute `php spark docs:check` y `composer test`. La copia generada vive en `public/openapi/openapi-v1.yaml`; el portal y sus rutas controladas no existen en producción.

Los JSON editoriales requieren revalidación; las imágenes publicadas mediante UUID son inmutables durante un año. El almacenamiento `writable/uploads` debe residir en un volumen persistente y respaldarse coordinadamente con MariaDB.

La carga inicial de fotografías regionales puede realizarse con `php spark content:import-regional-photos`. El comando crea un borrador y no altera la publicación vigente. La opción `--move` retira de `recursos-pendientes` únicamente los PNG cuya copia almacenada fue verificada por SHA-256.

Después de revisar el borrador, `php spark content:publish-regional-coordinations` permite promoverlo explícitamente desde consola cuando no se dispone de una sesión administrativa interactiva.
