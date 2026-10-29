# Edición vigente (`current-edition`)

## Campos editables

- Antetítulo, título y descripción de apertura.
- Año de la edición, entre 2000 y 2100, usado para organizar internamente los documentos.
- Estado de inscripción: título, descripción, texto y destino del enlace histórico.
- Documentos oficiales: título, descripción y archivo PDF.
- Inscripción masiva: antetítulo, título, descripción, texto de descarga y plantilla XLSX opcional.
- Promoción: imagen, texto alternativo, texto y destino del enlace audiovisual.

## Colecciones dinámicas

- Los documentos permiten agregar, editar, eliminar y reordenar elementos sin un máximo funcional fijo.
- Cada documento exige una clave interna estable, título, descripción y un PDF nuevo o previamente asociado.
- El editor permite abrir, descargar y reemplazar el archivo actual; la ruta, el nombre almacenado, el formato y el icono se derivan automáticamente.
- Es válido publicar la colección vacía; el componente muestra un estado explícito.

## Validaciones

- Los campos textuales visibles son obligatorios y se limitan por longitud.
- Los PDF deben ser archivos válidos de hasta 16 MB. La API verifica MIME y firma, genera un UUID y conserva el nombre original como metadato.
- La plantilla debe ser un XLSX válido de hasta 16 MB. Administración permite subirla, sustituirla o retirarla sin editar rutas; solo puede existir una plantilla activa por revisión.
- Los destinos heredados permanecen compatibles mientras no sean reemplazados, pero no se exponen como campos editables.
- La imagen acepta JPEG, PNG o WebP, hasta 8 MB, con dimensión mínima de 300 px y texto alternativo obligatorio.

## Campos protegidos

- Ancla `#edicion-vigente`, composición visual, iconos funcionales, estructura semántica, estados responsive, rutas físicas y comportamiento de apertura de enlaces.
- Los archivos cargados se almacenan en `sections/current-edition/{año}` con nombre UUID y se relacionan con la revisión mediante `content_revision_media`; la ruta física nunca forma parte del JSON editorial.
- La plantilla usa la relación estable `edition-bulk-template`; una sustitución conserva el archivo de revisiones históricas y un retiro no elimina físicamente la versión publicada anterior.

## Flujo y aceptación

- Borrador, copia editorial responsive según el ancho real del navegador y publicación confirmada.
- Un reemplazo permanece privado en borrador, se previsualiza mediante la ruta administrativa autenticada y solo queda disponible públicamente después de publicar.
- Retirar la plantilla en un borrador no altera la descarga pública vigente; la acción se refleja públicamente al publicar ese borrador.
- El formulario agrupa visual y semánticamente información principal, estado de inscripción, documentos oficiales, plantilla masiva y promoción.
- La vista pública y la previsualización reutilizan el mismo componente.
- Los valores y activos vigentes permanecen como respaldo local si la API no está disponible.
- Una colección de documentos vacía y una imagen temporalmente no disponible no rompen la sección.
