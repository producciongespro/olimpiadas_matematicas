# Coordinaciones regionales (`regional-coordinations`)

## Campos editables

- Antetítulo, título y descripción de apertura.
- Título y descripción del resumen territorial.
- Título del directorio y etiqueta del buscador.
- Regiones: nombre regional y lista de contactos.
- Contactos: clave técnica estable, nombre público, lista de correos institucionales y fotografía opcional.

## Colecciones dinámicas

- Regiones, contactos y correos permiten agregar y eliminar.
- Las regiones y contactos permiten reordenarse; el orden del borrador determina el orden publicado.
- Cada contacto permite cargar, reemplazar o retirar su fotografía. La relación se conserva al reordenar o editar el nombre gracias a su clave estable.
- Una región puede publicarse sin contactos y un contacto sin correo; ambos casos muestran estados explícitos.
- No existe un máximo funcional fijo; la API limita únicamente el tamaño total del payload.

## Validaciones

- Región y nombre de contacto son obligatorios cuando el elemento existe.
- Los correos no vacíos deben tener formato válido y se normalizan en minúsculas.
- No se admite HTML, URLs arbitrarias ni datos estudiantiles.
- Las fotografías admiten JPEG, PNG o WebP de hasta 8 MB, se validan como imágenes reales y se almacenan como medios versionados con UUID.
- Una fotografía nueva crea un UUID nuevo. Retirarla elimina la relación del borrador, sin alterar la publicación vigente hasta publicar.
- Los datos iniciales continúan como respaldo local; no se insertan automáticamente en tablas del dominio de inscripción.

## Campos protegidos

- Ancla `#coordinaciones-regionales`, buscador, contador, iconos, estructura semántica y comportamiento responsive.
- Proporción y espacio reservado del retrato, silueta de respaldo y alternativa accesible no editable.

## Flujo y aceptación

- Borrador, previsualización responsive y publicación confirmada.
- La búsqueda pública filtra la revisión publicada por región, persona o correo.
- Cada asesor muestra su fotografía publicada o una silueta neutra cuando no dispone de ella.
- La previsualización administrativa refleja inmediatamente una selección o retiro, pero la vista pública solo cambia después de publicar.
- Los medios exclusivos del borrador se consultan mediante una ruta administrativa autenticada y `private, no-store`; no quedan disponibles desde la ruta pública de medios.
- Una lista vacía muestra un estado explícito y no rompe la sección.
