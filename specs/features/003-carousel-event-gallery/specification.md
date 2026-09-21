# Carrusel principal y galería histórica de eventos

## 1. Objetivo

Permitir que el equipo administrador gestione las imágenes destacadas del carrusel principal y las fotografías de eventos anteriores, almacenando los archivos en la API y publicando en el sitio únicamente contenido aprobado.

## 2. Contexto y audiencia

La vista pública es una interfaz institucional educativa para estudiantes, familias, personal docente y personas interesadas en OLCOMEP. Debe comunicar actividad y continuidad histórica sin dificultar el acceso a información, inscripciones y recursos.

Dirección inicial:

- Variación visual: 4/10.
- Movimiento: 2/10.
- Densidad: 5/10.
- Identidad: institucional, clara y cercana, basada en los tokens y activos existentes.
- La administración identifica el producto mediante una copia íntegra de `Logo OLCOMEP V2.png`; la documentación de la API referencia el mismo activo desde su directorio público.

## 3. Conceptos separados

### Carrusel principal

- Ocupa una franja inmediatamente debajo del header en la página principal.
- Presenta imágenes destacadas vigentes.
- No representa un evento histórico ni sustituye la galería.
- Su orden y estado se administran de manera independiente.

### Galería histórica

- Ocupa una sección propia dentro de la página principal.
- Agrupa fotografías por evento.
- Permite elegir un evento publicado y recorrer sus imágenes.
- Cada evento conserva su identidad, descripción, fecha y orden fotográfico.

## 4. Roles y permisos

### Visitante público

- Consulta exclusivamente diapositivas, eventos e imágenes publicadas.
- No necesita autenticación.

### Administrador

- Usa las rutas protegidas por Microsoft Entra ID, JWT y rol administrativo.
- Crea, edita, ordena, publica, oculta y archiva diapositivas.
- Crea, edita, publica, oculta y archiva eventos.
- Carga, ordena, reemplaza y retira fotografías de cada evento.
- Define una imagen de portada para cada evento.

No se define un rol editorial adicional en esta iteración.

## 5. Requisitos funcionales

### MED-001 — Posición del carrusel

El carrusel principal se renderiza inmediatamente después del header y antes del resto del contenido de la página de inicio.

### MED-002 — Administración del carrusel

El administrador puede:

- cargar una imagen;
- registrar título opcional y texto alternativo obligatorio;
- agregar un enlace opcional con etiqueta accesible;
- cambiar el orden;
- publicar, ocultar o archivar;
- reemplazar o retirar la imagen.

No se permite publicar una diapositiva sin archivo válido ni texto alternativo.

### MED-003 — Eventos

Cada evento contiene:

- nombre obligatorio;
- slug único y estable;
- fecha o año del evento;
- descripción opcional;
- estado `draft`, `published` o `archived`;
- fecha de publicación cuando corresponda;
- fechas de creación y actualización.

El administrador puede crear el evento antes de cargar sus imágenes. Un evento sin fotografías no puede publicarse.

### MED-004 — Fotografías por evento

El administrador puede cargar una o varias imágenes en un evento. Cada fotografía incluye:

- texto alternativo obligatorio;
- pie de foto opcional;
- orden dentro del evento;
- indicador de portada;
- metadatos técnicos del archivo.

Cada evento publicado tiene exactamente una portada. Si no se define manualmente, la primera imagen por orden se convierte en portada al publicar.

### MED-005 — Consulta pública de eventos

La galería pública:

- muestra un selector con los eventos publicados;
- utiliza inicialmente el evento publicado más reciente;
- actualiza nombre, fecha, descripción y fotografías al cambiar la selección;
- comunica el cambio a tecnologías de asistencia sin mover el foco inesperadamente;
- ofrece un estado vacío claro cuando no hay eventos publicados.

### MED-006 — Orden consistente

Las posiciones de diapositivas y fotografías son enteros no negativos y no se repiten dentro de su colección. La API normaliza la secuencia en una transacción al reordenar, insertar o retirar elementos.

### MED-007 — Publicación

Las rutas públicas excluyen borradores y elementos archivados. Un evento oculto o archivado oculta también sus imágenes en la consulta pública, sin eliminar inmediatamente los archivos.

### MED-008 — Transición desde el carrusel actual

Las 15 fotografías heredadas pertenecen al carrusel principal. Deben importarse como diapositivas publicadas sin título visible, verificarse en la API y aprobarse su paridad visual. La galería histórica inicia sin eventos hasta que el administrador cree uno y cargue sus fotografías.

### MED-009 — Altura y rotación automática

El carrusel respeta el contenedor central de 1200 px y los márgenes laterales responsive del sitio; no ocupa el ancho completo del viewport. Utiliza alturas explícitas de 144 px en móvil, 176 px en tableta y 208 px en escritorio, y conserva las imágenes sin deformación mediante recorte con `object-fit: cover`. Cuando existen varias diapositivas avanza automáticamente cada 6 segundos.

La rotación se pausa mientras el puntero está sobre el carrusel, mientras el foco permanece dentro de él o después de una interacción manual. Las personas con `prefers-reduced-motion: reduce` conservan los controles manuales, pero no reciben avance automático.

### MED-010 — Sincronización automática de contenido publicado

Las consultas públicas del carrusel, la lista de eventos y el detalle del evento seleccionado exponen una versión derivada de su representación y una cabecera `ETag`. La vista pública revalida estos recursos mediante `If-None-Match` al recuperar el foco, al volver a estar visible y cada 30 segundos mientras permanezca visible.

Una respuesta `304 Not Modified` conserva el contenido ya renderizado. Si la representación cambia, la interfaz incorpora los datos publicados sin recargar la página, conserva la diapositiva activa cuando todavía existe y mantiene el evento seleccionado cuando continúa publicado. Las solicitudes concurrentes del mismo recurso se deduplican y la revalidación se pausa mientras la pestaña está oculta.

## 6. Almacenamiento de archivos

Los binarios se almacenan dentro de la API:

```text
apps/api/writable/uploads/
├── carousel/
└── events/
    └── {event-uuid}/
```

Reglas:

- `writable/uploads` permanece fuera de Git.
- La base guarda metadatos y rutas relativas, nunca el binario.
- La API genera nombres internos aleatorios; no reutiliza el nombre enviado por el usuario.
- La ruta guardada no contiene segmentos proporcionados directamente por el cliente.
- El nombre original se conserva solo como metadato administrativo saneado.
- Los archivos no se sirven mediante acceso directo al directorio `writable`; se entregan por un endpoint público controlado.
- En producción, `writable/uploads` debe usar almacenamiento persistente e incluirse en la estrategia de respaldo.

## 7. Validación y seguridad de archivos

- Formatos iniciales permitidos: JPEG, PNG y WebP.
- Se valida extensión, MIME detectado por el servidor y decodificación real como imagen.
- SVG, GIF animado y archivos ejecutables no están permitidos en esta iteración.
- El tamaño máximo y las dimensiones admitidas se configuran mediante variables de entorno; sus valores definitivos deben aprobarse antes de implementar la carga.
- La API rechaza archivos vacíos, corruptos, con doble extensión engañosa o que excedan los límites.
- Las cargas administrativas tienen rate limit y auditoría.
- Las respuestas no revelan rutas absolutas, trazas ni configuración interna.
- El reemplazo crea primero el nuevo archivo y actualiza la base dentro de una operación coordinada; el archivo anterior se elimina solo después de confirmar el cambio.
- Si falla la persistencia, la API elimina cualquier archivo huérfano creado por la operación.

## 8. Modelo de datos propuesto

### `media_files`

Metadatos técnicos compartidos:

- `id`, `uuid`;
- `storage_path`;
- `original_name`;
- `mime_type`, `size_bytes`, `width`, `height`;
- `checksum_sha256`;
- `created_at`, `updated_at`.

### `carousel_slides`

- `id`, `media_file_id`;
- `title`, `alt_text`;
- `link_url`, `link_label`;
- `sort_order`, `status`;
- `published_at`, `created_at`, `updated_at`.

### `events`

- `id`, `uuid`, `name`, `slug`;
- `event_date`, `description`;
- `status`, `published_at`;
- `created_at`, `updated_at`.

### `event_images`

- `id`, `event_id`, `media_file_id`;
- `alt_text`, `caption`;
- `sort_order`, `is_cover`;
- `created_at`, `updated_at`.

Restricciones:

- `events.slug`, `events.uuid` y `media_files.uuid` son únicos.
- Cada relación referencia un archivo existente.
- Un archivo no puede pertenecer simultáneamente al carrusel y a una fotografía de evento.
- La capa de servicio garantiza una sola portada por evento y posiciones consecutivas.
- Las eliminaciones físicas deben respetar referencias existentes.

## 9. Contrato API propuesto

Todas las respuestas JSON exitosas usan el contenedor `data`. Los errores usan un mensaje general y detalles de validación seguros cuando corresponda.

### Rutas públicas

| Método | Ruta | Propósito |
| --- | --- | --- |
| `GET` | `/api/v1/carousel` | Lista diapositivas publicadas en orden |
| `GET` | `/api/v1/events` | Lista eventos publicados con portada |
| `GET` | `/api/v1/events/{slug}` | Entrega un evento publicado y sus fotografías |
| `GET` | `/api/v1/media/{uuid}` | Entrega una imagen publicada con cabeceras seguras y caché |

Las tres respuestas JSON públicas incluyen `ETag`, `Cache-Control: public, max-age=0, must-revalidate` y `meta.version`; aceptan `If-None-Match` y responden `304` sin cuerpo cuando la representación no cambió. Los archivos se identifican mediante UUID estable y se entregan con caché inmutable, pues un reemplazo genera una URL distinta.

### Rutas administrativas protegidas

| Método | Ruta | Propósito |
| --- | --- | --- |
| `GET` | `/api/v1/admin/carousel` | Lista todos los estados |
| `POST` | `/api/v1/admin/carousel` | Crea una diapositiva mediante `multipart/form-data` |
| `PUT` | `/api/v1/admin/carousel/{id}` | Actualiza metadatos o reemplaza la imagen |
| `PUT` | `/api/v1/admin/carousel/order` | Reordena la colección completa |
| `DELETE` | `/api/v1/admin/carousel/{id}` | Archiva o retira una diapositiva |
| `GET` | `/api/v1/admin/events` | Lista eventos de todos los estados |
| `POST` | `/api/v1/admin/events` | Crea un evento |
| `GET` | `/api/v1/admin/events/{id}` | Obtiene detalle administrativo |
| `PUT` | `/api/v1/admin/events/{id}` | Actualiza metadatos y estado |
| `DELETE` | `/api/v1/admin/events/{id}` | Archiva el evento |
| `POST` | `/api/v1/admin/events/{id}/images` | Carga una o varias fotografías |
| `PUT` | `/api/v1/admin/events/{id}/images/order` | Reordena todas las fotografías |
| `PUT` | `/api/v1/admin/event-images/{id}` | Actualiza, reemplaza o define portada |
| `DELETE` | `/api/v1/admin/event-images/{id}` | Retira una fotografía |

La forma exacta de payloads, paginación, códigos de error y límites se formalizará en OpenAPI antes de implementar los controladores.

## 10. Experiencia pública

### Carrusel

- Debe reservar la proporción de la imagen para evitar saltos de layout.
- Tiene botones anterior y siguiente con nombre accesible y foco visible.
- Presenta indicadores operables por teclado con objetivos táctiles de al menos 44 por 44 px.
- Avanza automáticamente cada 6 segundos cuando hay más de una diapositiva.
- La rotación se pausa con hover, foco o interacción manual.
- Respeta `prefers-reduced-motion`, desactiva la rotación automática y mantiene comprensible el cambio sin animación.
- El texto superpuesto, si existe, usa una superficie que garantice contraste WCAG 2.2 AA frente a cualquier imagen.

### Galería de eventos

- El selector tiene etiqueta visible y no depende solo de la portada.
- La lista y el visor mantienen orden lógico de foco.
- Las fotografías usan `alt_text`; el pie de foto no duplica innecesariamente la alternativa.
- La interfaz define estados de carga, vacío, error y reintento.
- La composición se reorganiza en móvil sin scroll horizontal.
- La carga inicial solicita únicamente la portada necesaria; el resto de fotografías se carga bajo demanda.

## 11. Experiencia administrativa

- Carrusel y eventos aparecen como módulos separados.
- Los formularios tienen etiquetas visibles, ayuda contextual y errores asociados al campo.
- La carga muestra progreso, resultado por archivo y errores recuperables.
- La previsualización no sustituye el nombre del archivo ni el campo de texto alternativo.
- El orden puede modificarse con teclado; arrastrar y soltar, si se implementa, debe tener una alternativa mediante botones.
- Las acciones destructivas comunican alcance y requieren confirmación dentro de la interfaz, sin usar `alert`, `confirm` o `prompt` del navegador.
- Se muestran estados de borrador, publicado y archivado mediante texto, no solo color.
- Al abandonar cambios sin guardar se presenta una advertencia recuperable.

## 12. Rendimiento

- La primera implementación conserva el archivo validado y limita sus dimensiones a 6000 px. La generación de variantes queda preparada como optimización posterior.
- Las respuestas públicas incluyen dimensiones y una URL estable del medio.
- Las imágenes fuera del primer viewport usan carga diferida.
- Los endpoints de listado no incluyen binarios ni contenido base64.
- Las respuestas de imagen permiten caché HTTP y validación condicional mediante `ETag` o `Last-Modified`.
- Las colecciones y detalles públicos permiten revalidación condicional mediante `ETag` sin transferir nuevamente una representación sin cambios.

## 13. Auditoría y operación

La bitácora registra, sin almacenar el archivo:

- identidad administrativa;
- acción;
- tipo e identificador del recurso;
- fecha;
- resultado HTTP.

Los respaldos de producción deben incluir coordinadamente la base y `writable/uploads`. La restauración debe mantener las rutas relativas y relaciones de archivos.

## 14. Migración y compatibilidad

1. Crear migraciones nuevas; no modificar migraciones ya ejecutadas.
2. Implementar almacenamiento y servicios de archivos.
3. Implementar rutas públicas y administrativas con pruebas.
4. Importar las 15 fotografías heredadas como diapositivas del carrusel.
5. Implementar la administración.
6. Conectar carrusel y galería pública a la API.
7. Verificar paridad, responsive, accesibilidad y recuperación ante fallos.
8. Retirar la configuración estática solo después de aprobar la transición.

## 15. Fuera de alcance

- Inscripción de estudiantes y administración de datos personales.
- Resultados, puntajes, medallas y premiación.
- Video, audio, SVG y GIF animado.
- Reconocimiento facial, etiquetado automático o analítica sobre personas fotografiadas.
- Sustitución de `writable/uploads` por almacenamiento en nube.
- Eliminación del sitio heredado `app/`.

## 16. Decisiones aprobadas para la primera implementación

- Tamaño máximo: 8 MB por archivo.
- Dimensiones: mínimo 640 px en el lado menor y máximo 6000 px en el lado mayor.
- Formatos: JPEG, PNG y WebP, conservando inicialmente el archivo validado sin recomprimir.
- Cantidades: máximo 15 diapositivas publicadas y 100 fotografías por evento.
- Diapositivas y eventos se archivan; las fotografías retiradas y los archivos reemplazados se eliminan físicamente después de confirmar la operación en base.
- La revisión de derechos de uso corresponde a la identidad administrativa que publica el evento; la definición de un rol editorial separado queda para una iteración posterior.
