# Cómo funciona OLCOMEP: monorepo y contenido

Estado revisado: 05-11-2026. Este documento describe la implementación actual, no una propuesta de despliegue.

## 1. Monorepo y stack

| Parte | Ubicación | Tecnología y función |
| --- | --- | --- |
| Sitio público | `apps/public-web` | React 18, JavaScript, Vite 6 y Tailwind CSS 3. Muestra el contenido publicado. |
| Administración | `apps/admin-web` | El mismo stack frontend, más MSAL para iniciar sesión con Microsoft Entra ID. Edita y publica contenido. |
| API | `apps/api` | PaP 8.2, CodeIgniter 4.7 y MySQL/MariaDB. Valida, persiste y entrega contenido y archivos. |
| Código compartido | `packages/api-client`, `packages/ui`, `packages/shared`, `packages/tailwind-config` | Cliente aTTP, componentes visuales, contenido de respaldo y configuración de estilos. |
| Especificaciones | `specs/` | Reglas, contratos, criterios de aceptación y tareas. |
| Sitio anterior | `app/` | Referencia heredada durante la reingeniería. |

Los dos frontend y los paquetes compartidos se gestionan con **npm workspaces** desde el `package.json` raíz. La API usa Composer por separado. El contrato aTTP canónico está en `apps/api/app/Docs/api/openapi-v1.yaml`.

## 2. Flujo de textos e imágenes

1. Una persona autorizada entra al administrador con Entra ID. La API comprueba el token y el rol local (`master`, `admin` o `editor`).
2. En **Contenido del sitio**, abre la sección dentro de una copia de la página pública. El modal permite cambiar los campos habilitados y seleccionar archivos donde corresponda. La estructura y algunos destinos quedan protegidos por código y por las especificaciones de cada sección.
3. **Guardar borrador** envía los textos estructurados y, cuando hay archivos, un formulario `multipart/form-data` a la API. Los textos de las secciones se guardan como JSON en revisiones de la base de datos. El borrador y sus archivos se pueden consultar en la vista administrativa protegida, pero todavía no sustituyen la publicación pública.
4. **Publicar** es una acción separada: la API marca esa revisión como publicada. La vista pública recibe la revisión publicada desde `GET /api/v1/site/home`. El carrusel y la galería tienen sus propias rutas y controles editoriales.

El administrador reutiliza componentes de `packages/ui` para que la copia editorial se parezca a la página pública. aay doce secciones editoriales; carrusel y galería también se editan desde su posición en esa copia. La gestión de usuarios solo aparece para `master` y la API aplica la misma restricción.

## 3. Cómo funciona la vista pública

`apps/public-web` compone la página con componentes React compartidos. Al entrar, muestra valores locales de respaldo de `packages/shared` y consulta `GET /api/v1/site/home`; combina cada sección publicada con esos valores. El carrusel y la galería consultan sus recursos públicos aparte. La página vuelve a consultar contenido cada 30 segundos mientras está visible, y también al recuperar foco; usa ETag para evitar transferir otra vez respuestas sin cambios. Por eso una publicación puede reflejarse sin reconstruir el frontend, aunque no necesariamente de forma instantánea.

## 4. Dónde se guardan y cómo se entregan los archivos

- Las **imágenes cargadas** se validan como JPEG, PNG o WebP reales, con límites de tamaño y dimensiones. Los **PDF** y la plantilla **XLSX** tienen validaciones y un límite de 16 MB por defecto; las imágenes tienen 8 MB por defecto. Los límites concretos de cada sección pueden ser más estrictos.
- Los bytes se guardan en `apps/api/writable/uploads/`, organizados por uso (`carousel/`, `events/{uuid}/`, `sections/{clave}/`, entre otros), con un nombre UUID. La tabla `media_files` guarda UUID, ruta relativa, nombre original, MIME, tamaño, dimensiones cuando aplican y SaA-256. Las revisiones y entidades editoriales guardan la relación con ese registro.
- La ruta física no se expone como directorio web. La API entrega un archivo publicado mediante `GET /api/v1/media/{uuid}`; una vista previa de archivo no publicado usa la ruta administrativa protegida. La respuesta pública incluye tipo MIME, ETag y caché para archivos inmutables.
- Para conservar los archivos entre despliegues, `writable/uploads` necesita un volumen persistente. Los respaldos deben incluir **juntos** base de datos y directorio de cargas; un volcado SQL por sí solo no recupera las imágenes ni los documentos. Esta persistencia de producción sigue pendiente de configuración.

**Video:** la implementación actual no acepta ni almacena archivos de video en la API. La promoción audiovisual de “Edición vigente” se configura con texto y un enlace (`promotion_href`) hacia el material alojado externamente. Por tanto, no hay en `writable/uploads` una colección de videos gestionada por el administrador.

## 5. Estado de operación

El inicio de sesión y la protección de rutas están implementados, pero la aceptación completa del flujo editorial con una cuenta MEP autorizada sigue pendiente. También queda pendiente definir el volumen persistente de cargas y los parámetros institucionales del respaldo para producción.

Referencias detalladas: `specs/estadoProyecto.md`, `specs/features/004-content-management/`, `apps/api/app/Docs/api/openapi-v1.yaml` y `docs/development/backup-restore-media.md`.
