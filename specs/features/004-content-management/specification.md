# Administración del contenido público

## 1. Objetivo

Permitir que el equipo administrador actualice la información de la vista pública mediante formularios estructurados y una vista previa fiel, sin habilitar edición libre de HTML, estilos o componentes React.

## 2. Principios

- La vista pública y la vista previa administrativa reutilizan los mismos componentes de presentación.
- El diseño, la identidad y la estructura permanecen controlados por código.
- El contenido se guarda primero como borrador y solo llega al público mediante una acción explícita de publicación.
- Cada tipo de sección tiene un contrato versionado y validación en la API.
- Las imágenes se almacenan en `apps/api/writable/uploads`; la base conserva metadatos en `media_files` y referencias mediante `media_file_id`.
- Una revisión publicada nunca depende de una ruta absoluta ni de un archivo público escrito por el navegador.

## 3. Primer corte vertical

La primera implementación cubre la portada principal (`hero`):

- antetítulo;
- título principal;
- identificación de la población participante;
- descripción;
- dos enlaces de acción;
- imagen y texto alternativo;
- borrador, vista previa y publicación;
- historial inmutable de revisiones publicadas.

El contenido actual permanece como respaldo cuando la API todavía no tiene una versión publicada o no está disponible. El seeder importa la imagen inicial a `writable/uploads/sections/hero` y relaciona su registro en `media_files`; el activo público heredado funciona únicamente como recuperación ante indisponibilidad de la API.

## 4. Modelo

### `content_sections`

Catálogo estable de componentes administrables: `id`, `section_key`, `label`, `schema_version`, fechas de creación y actualización.

### `content_revisions`

Cada revisión contiene `section_id`, `content_json`, `media_file_id` opcional, estado `draft`, `published` o `superseded`, identidad administrativa opcional y fechas de creación/publicación. Solo puede existir un borrador y una publicación vigentes por sección; la capa de servicio garantiza esta regla mediante transacciones.

Las revisiones anteriores conservan su referencia de imagen para permitir trazabilidad y una futura restauración segura. La limpieza de archivos sin referencias se realizará mediante un proceso separado y auditable.

## 5. Archivos

Las imágenes editables de una sección se almacenan así:

```text
apps/api/writable/uploads/sections/{section-key}/{uuid}.{extension}
```

Se aplican las mismas validaciones de MIME real, dimensiones, tamaño, nombre interno aleatorio y entrega controlada ya utilizadas por el carrusel y la galería.

## 6. API inicial

### Pública

- `GET /api/v1/site/home`: entrega un mapa de las revisiones publicadas para la página de inicio.

### Administrativa

- `GET /api/v1/admin/site/sections`: lista secciones, borradores y publicaciones.
- `GET /api/v1/admin/site/sections/{key}`: obtiene el estado editorial de una sección.
- `POST /api/v1/admin/site/sections/{key}/draft`: crea o reemplaza el borrador; acepta `multipart/form-data` cuando cambia la imagen.
- `POST /api/v1/admin/site/sections/{key}/publish`: publica el borrador completo.

Las rutas administrativas conservan los filtros JWT y rol. Las respuestas exitosas usan `data`; los errores no exponen trazas ni rutas internas.

## 7. Experiencia administrativa

La administración incorpora un módulo “Contenido del sitio”. En el primer corte muestra la portada con:

- formulario estructurado;
- estado editorial visible;
- imagen actual y selector de reemplazo;
- vista previa mediante el mismo componente usado públicamente;
- controles separados para guardar borrador y publicar;
- estados de carga, error y éxito.

## 8. Evolución prevista

Después de validar la portada, el patrón se extiende en este orden: “Conoce OLCOMEP”, calendario, colaboradores y patrocinadores, acerca de nosotros, información general y preguntas frecuentes, coordinaciones regionales, edición vigente, contacto, recursos, header y footer. Las colecciones con búsqueda, orden o relaciones usarán tablas propias y no un documento JSON genérico.
