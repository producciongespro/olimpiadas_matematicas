# Criterios de aceptación

## Carrusel público

- Se renderiza inmediatamente debajo del header.
- Consume exclusivamente diapositivas publicadas y respeta su orden.
- Las 15 fotografías heredadas tienen correspondencia como diapositivas publicadas antes de retirar el respaldo estático.
- Puede recorrerse completamente con teclado.
- Sus controles tienen nombres accesibles, foco visible y un área mínima de 44 por 44 px.
- Su imagen mide 144 px en móvil, 176 px desde `sm` y 208 px desde `lg`, sin deformarse.
- Respeta el contenedor central de 1200 px y los márgenes laterales responsive de la página.
- Avanza automáticamente cada 6 segundos cuando existen varias diapositivas.
- La rotación se pausa mientras recibe hover, foco o interacción manual.
- Con `prefers-reduced-motion: reduce` no inicia reproducción automática.
- No provoca desbordamiento horizontal en 320, 768 y 1280 px.
- Muestra un estado estable y comprensible cuando no existen diapositivas o falla la API.

## Galería pública

- Permite elegir entre eventos publicados mediante un control con etiqueta visible.
- Selecciona inicialmente el evento publicado más reciente.
- Nunca expone eventos en borrador o archivados.
- Muestra nombre, fecha, descripción y fotografías del evento seleccionado.
- Todas las fotografías informativas tienen texto alternativo.
- Define estados de carga, vacío, error y reintento.
- Mantiene orden de foco y reflow sin scroll horizontal.
- Muestra un estado vacío hasta que el administrador publique el primer evento con fotografías.

## Administración

- El encabezado muestra el logotipo oficial de OLCOMEP sin deformarlo y mantiene visible el título de la herramienta.
- Solo una identidad autenticada con rol administrativo puede modificar carrusel y eventos.
- El administrador puede crear, editar, publicar, ocultar, archivar y ordenar diapositivas.
- El administrador puede crear, editar, publicar, ocultar y archivar eventos.
- Puede cargar una o varias fotografías por evento, ordenarlas y definir portada.
- No puede publicar una diapositiva sin imagen y texto alternativo.
- No puede publicar un evento sin fotografías.
- Puede operar el reordenamiento sin depender de arrastrar y soltar.
- Las confirmaciones destructivas ocurren dentro de la interfaz.
- Formularios y cargas comunican estados de procesamiento, éxito y error.

## API y almacenamiento

- El README y el contrato OpenAPI identifican la API con el logotipo oficial servido desde `public/assets/logo-olcomep.png`.
- Los archivos se guardan bajo `apps/api/writable/uploads/carousel` o `apps/api/writable/uploads/events/{event-uuid}`.
- Ningún archivo cargado aparece en Git.
- La base almacena rutas relativas y metadatos, no binarios ni base64.
- Los nombres internos son aleatorios y no aceptan segmentos de ruta del cliente.
- Solo se aceptan JPEG, PNG y WebP válidos dentro de los límites configurados.
- Las rutas públicas entregan exclusivamente medios asociados con contenido publicado.
- Las rutas administrativas se encuentran dentro del grupo protegido existente.
- Reemplazos fallidos no dejan archivos huérfanos ni eliminan el archivo vigente.
- El reordenamiento conserva posiciones consecutivas y no repetidas.
- El borrado respeta referencias y mantiene consistencia entre archivo y base.
- Las respuestas no exponen rutas absolutas, trazas o secretos.

## Datos, pruebas y operación

- Las migraciones nuevas pueden aplicarse y revertirse en SQLite de pruebas y MariaDB local.
- Existen pruebas para autorización, validación de archivos, publicación, orden, portada, reemplazo y limpieza ante errores.
- El contrato OpenAPI coincide con rutas, payloads y respuestas implementadas.
- `composer --working-dir=apps/api test` termina correctamente.
- Los workspaces frontend afectados compilan correctamente.
- La base y `writable/uploads` cuentan con una estrategia coordinada de respaldo y restauración antes de producción.
- `app/` permanece intacta hasta aprobar la paridad.
