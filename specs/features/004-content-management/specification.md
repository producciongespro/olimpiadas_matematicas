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

## 3. Secciones implementadas

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

La segunda implementación cubre “Conoce OLCOMEP” mediante un contrato estructurado con antetítulo, título y dos párrafos. El logotipo, la composición visual y el ancla `#olimpiadas` permanecen controlados por código. La sección reutiliza un único componente React entre la vista pública y la previsualización administrativa y conserva valores locales de respaldo.

La tercera implementación cubre el calendario: textos introductorios, nota final, enlace al manual y una lista dinámica de actividades. Cada actividad conserva fecha visible, fecha semántica ISO, fecha final opcional, título, descripción y marca de destaque. La administración permite agregar, eliminar y reordenar elementos sin un límite funcional de cantidad; la API valida cada elemento, protege el tamaño total del payload y no admite HTML libre. Un calendario vacío es válido y muestra un estado público explícito.

La cuarta implementación cubre “Colaboradores y patrocinadores”. Ambas listas permiten agregar, eliminar, reordenar y editar instituciones, con nombre obligatorio, enlace opcional, descripción para patrocinadores y logotipo opcional. Los logotipos se vinculan a cada revisión mediante `content_revision_media`; no se guardan rutas privadas en el JSON. Las revisiones publicadas anteriores conservan sus relaciones y la entrega pública de medios solo autoriza archivos asociados a una publicación vigente.

La quinta implementación cubre “Acerca de nosotros”: introducción con párrafos dinámicos, cronología ordenada y cierre institucional con título y párrafos dinámicos. Los hitos permiten altas, bajas, orden, periodo, título y descripción. No se admite HTML libre y una lista vacía se representa sin romper el diseño.

La sexta implementación cubre “Información general” y preguntas frecuentes conforme a `sections/general-information.md`: rutas e interrogantes son colecciones dinámicas, los iconos provienen de un catálogo cerrado y los destinos se validan como ancla, ruta del sitio o HTTP(S).

La séptima implementación cubre “Coordinaciones regionales” conforme a `sections/regional-coordinations.md`. El directorio editorial permanece separado de las tablas reservadas al dominio de inscripción y solo contiene información institucional destinada a publicación.

La octava implementación cubre “Edición vigente” conforme a `sections/current-edition.md`: estado de inscripción, documentos dinámicos, descarga masiva y promoción audiovisual se administran mediante campos estructurados. La imagen promocional utiliza el medio principal de la revisión y los archivos documentales conservan destinos validados.

## 4. Modelo

### `content_sections`

Catálogo estable de componentes administrables: `id`, `section_key`, `label`, `schema_version`, fechas de creación y actualización.

### `content_revisions`

Cada revisión contiene `section_id`, `content_json`, `media_file_id` opcional, estado `draft`, `published` o `superseded`, identidad administrativa opcional y fechas de creación/publicación. Solo puede existir un borrador y una publicación vigentes por sección; la capa de servicio garantiza esta regla mediante transacciones.

Las revisiones anteriores conservan su referencia de imagen para permitir trazabilidad y una futura restauración segura. La limpieza de archivos sin referencias se realizará mediante un proceso separado y auditable.

### `content_revision_media`

Relaciona una revisión con varios archivos por una clave estable de elemento. Permite que colecciones editoriales como colaboradores y patrocinadores conserven logotipos independientes por revisión sin sobrescribir medios históricos.

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

La administración incorpora un módulo “Contenido del sitio”. Presenta un selector de secciones para portada, “Conoce OLCOMEP”, calendario y colaboradores/patrocinadores, con:

- formulario estructurado;
- estado editorial visible;
- imagen actual y selector de reemplazo;
- vista previa mediante el mismo componente usado públicamente;
- controles separados para guardar borrador y publicar;
- estados de carga, error y éxito.

La vista previa resuelve sus activos de respaldo desde la propia aplicación administrativa. No requiere que `public-web` esté levantada; las imágenes persistidas por la API conservan sus URL absolutas controladas.

## 8. Evolución prevista

Después de validar edición vigente, el patrón se extiende en este orden: contacto, recursos, header y footer. Las colecciones con búsqueda, orden dinámico o relaciones usarán tablas propias y no un documento JSON genérico.
