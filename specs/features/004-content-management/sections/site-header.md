# Header y navegación

El encabezado es parte fija del sitio. La vista pública y la copia administrativa comparten el componente `SiteHeader`, los logotipos, el lema, el nombre accesible del inicio, los enlaces y su orden. En la copia se muestra sin acción de edición.

Las dos vistas comparten las alturas de los logotipos. El del MEP mide 2,6 rem y el de OLCOMEP 3 rem en móvil. A partir de 640 píxeles miden 3,45 y 3,75 rem respectivamente, con el ancho proporcional.

## Navegación protegida

- El enlace de inicio lleva a `#contenido-principal`.
- La etiqueta «Edición AAAA» usa el año publicado de Edición vigente. Su destino fijo es `#edicion-vigente`. Si falta un año válido, la etiqueta es «Edición vigente». La copia editorial puede mostrar el año del borrador que se está previsualizando.
- En la carga inicial, la vista pública usa «Edición vigente» sin mostrar el año de respaldo. El ancla conserva un estado de carga hasta que finaliza la primera consulta.
- Información agrupa Reglamento, Cómo participar, Calendario y Preguntas frecuentes. Cómo participar lleva a `#edicion-vigente`, Calendario a `#calendario` y Preguntas frecuentes a `#preguntas-frecuentes`.
- Reglamento abre en otra pestaña el PDF publicado en Edición vigente. Si falta el documento, el menú muestra una opción inactiva.
- Acerca aparece entre Galería y Contacto. El menú funciona con teclado, informa su estado mediante `aria-expanded` y se cierra con Escape.

## Contrato y aceptación

- `site-header` conserva la forma de su respuesta pública para clientes existentes. Su contenido se toma de la configuración fija y el detalle administrativo informa `draft: null`.
- La lista editorial omite `site-header`. Guardar o publicar esa clave responde con HTTP 422, incluso si existe un borrador anterior.
- Una publicación previa con etiquetas o destinos distintos no altera el encabezado fijo.
