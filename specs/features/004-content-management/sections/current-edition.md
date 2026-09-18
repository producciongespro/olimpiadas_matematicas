# Edición vigente (`current-edition`)

## Campos editables

- Antetítulo, título y descripción de apertura.
- Estado de inscripción: título, descripción, texto y destino del enlace histórico.
- Documentos oficiales: título, descripción, formato, destino y tipo de icono.
- Inscripción masiva: antetítulo, título, descripción, texto y destino de descarga.
- Promoción: imagen, texto alternativo, texto y destino del enlace audiovisual.

## Colecciones dinámicas

- Los documentos permiten agregar, editar, eliminar y reordenar elementos sin un máximo funcional fijo.
- Cada documento exige una clave interna estable, título, descripción, formato y destino.
- Es válido publicar la colección vacía; el componente muestra un estado explícito.

## Validaciones

- Los campos textuales visibles son obligatorios y se limitan por longitud.
- Los destinos aceptan rutas internas o HTTP(S); no se admite JavaScript ni HTML libre.
- Los iconos de documentos se seleccionan de un catálogo cerrado: documento, archivo comprimido y hoja de cálculo.
- La imagen acepta JPEG, PNG o WebP, hasta 8 MB, con dimensión mínima de 300 px y texto alternativo obligatorio.

## Campos protegidos

- Ancla `#edicion-vigente`, composición visual, iconos funcionales, estructura semántica, estados responsive y comportamiento de apertura de enlaces.
- Los archivos documentales existentes no se cargan desde el editor en esta iteración; se administra su destino publicado.

## Flujo y aceptación

- Borrador, previsualización móvil/escritorio y publicación confirmada.
- La vista pública y la previsualización reutilizan el mismo componente.
- Los valores y activos vigentes permanecen como respaldo local si la API no está disponible.
- Una colección de documentos vacía y una imagen temporalmente no disponible no rompen la sección.
