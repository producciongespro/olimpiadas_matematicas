# Seguridad

Las rutas públicas declaran `security: []`. Todas las operaciones bajo `/admin` requieren un JWT RS256 de Microsoft Entra ID y una autorización local activa. La API valida emisor, tenant, audiencia, cliente autorizado, vigencia y scope; los roles `master`, `admin` y `editor` pueden editar contenido. En `/admin/users`, Master gestiona los tres roles, Administrador solo editores y Editor no tiene acceso.

La clave editorial `institutional-identity` es global y solo Master puede consultar su borrador, cargar un reemplazo o publicarlo. `GET /site/identity` y la identidad incluida en `GET /site/home` entregan solo la publicación vigente; un archivo exclusivo del borrador permanece privado hasta publicar. Las URL de logotipos previamente publicados siguen disponibles para páginas abiertas durante la transición.

CORS no sustituye autenticación ni autorización. No incluya tokens, secretos, datos personales, trazas ni archivos de entorno en ejemplos o incidencias. El portal `/docs` y sus rutas auxiliares solo se registran cuando `ENVIRONMENT` no es `production`.

La descarga documental usa una lista cerrada de nombres y `realpath`; no sirve rutas arbitrarias del sistema.
