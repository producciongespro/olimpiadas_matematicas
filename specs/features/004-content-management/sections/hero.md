# Portada principal (`hero`)

- Editables: antetítulo, título, población, descripción, textos de las dos acciones, imagen y texto alternativo.
- Protegidos: composición, estilos, jerarquía `h1`, dimensiones responsive y destinos de ambas acciones.
- Destinos oficiales: el botón principal siempre dirige a `#edicion-vigente` y el secundario a `#olimpiadas`; no se muestran como campos administrativos y la API descarta cualquier valor recibido para esas propiedades.
- Imagen: JPEG, PNG o WebP validada y vinculada a la revisión.
- Flujo: borrador, copia editorial responsive según el ancho real del navegador y publicación confirmada.
- Acciones administrativas: «Editar textos» abre antetítulo, título, población y descripción; «Editar nombres de botones» abre solamente las dos etiquetas; «Editar imagen» abre el texto alternativo y el reemplazo del archivo. Todas guardan un único borrador de portada.
- Respaldo: contenido e imagen locales cuando la API no responde.
- La vista pública sitúa después de la portada un bloque fijo de accesos por tarea, seguido de Información; no agrega campos ni cambia los destinos editoriales del hero.
