# Información general (`general-information`)

## Campos editables

- Antetítulo, título y descripción de apertura.
- Antetítulo y título de preguntas frecuentes.
- Rutas informativas: título, descripción, texto accesible del enlace, destino, indicador de enlace externo e icono de catálogo.
- Preguntas frecuentes: pregunta y respuesta.

## Colecciones

- Las rutas y preguntas permiten agregar, editar, eliminar y reordenar sin máximo funcional fijo.
- El catálogo de iconos permitido es `file`, `users`, `calendar` y `help`; no se aceptan clases, SVG ni código arbitrario.
- Los enlaces admiten anclas internas, rutas absolutas del sitio y HTTP(S). Los externos se abren de forma segura.
- Las colecciones vacías muestran un estado explícito y no rompen la navegación.

## Campos protegidos

- Anclas `#informacion-general` y `#preguntas-frecuentes`, estructura semántica, estilos, acordeón y jerarquía de encabezados.

## Flujo y aceptación

- Borrador, previsualización móvil/escritorio y publicación confirmada.
- La vista pública conserva el contenido actual como respaldo cuando la API falla.
- La API valida longitudes, iconos y destinos y rechaza HTML libre.
