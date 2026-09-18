# Coordinaciones regionales (`regional-coordinations`)

## Campos editables

- Antetítulo, título y descripción de apertura.
- Título y descripción del resumen territorial.
- Título del directorio y etiqueta del buscador.
- Regiones: nombre regional y lista de contactos.
- Contactos: nombre público y lista de correos institucionales.

## Colecciones dinámicas

- Regiones, contactos y correos permiten agregar y eliminar.
- Las regiones y contactos permiten reordenarse; el orden del borrador determina el orden publicado.
- Una región puede publicarse sin contactos y un contacto sin correo; ambos casos muestran estados explícitos.
- No existe un máximo funcional fijo; la API limita únicamente el tamaño total del payload.

## Validaciones

- Región y nombre de contacto son obligatorios cuando el elemento existe.
- Los correos no vacíos deben tener formato válido y se normalizan en minúsculas.
- No se admite HTML, URLs arbitrarias ni datos estudiantiles.
- Los datos iniciales continúan como respaldo local; no se insertan automáticamente en tablas del dominio de inscripción.

## Campos protegidos

- Ancla `#coordinaciones-regionales`, buscador, contador, iconos, estructura semántica, diseño de tarjetas y comportamiento responsive.

## Flujo y aceptación

- Borrador, previsualización responsive y publicación confirmada.
- La búsqueda pública filtra la revisión publicada por región, persona o correo.
- Una lista vacía muestra un estado explícito y no rompe la sección.
