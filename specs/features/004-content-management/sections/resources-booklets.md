# Sección editorial: Recursos y cuadernillos

## Objetivo

Administrar los textos y catálogos de cuadernillos recientes, archivo histórico e interactivos sin perder archivos, orden, grado, rol ni edición.

## Campos editables

- antetítulo, título y descripción general;
- colección ordenada de ediciones;
- por edición: año, tipo `pdf` o `interactive` y materiales ordenados;
- por material: clave estable, grado, rol, parte opcional, título, descripción e imagen decorativa opcional que se puede cargar, reemplazar o retirar; los PDF permiten cargar o reemplazar el archivo, y las actividades interactivas conservan un enlace externo editable.

## Campos protegidos

- anclas `#cuadernillos` y `#interactivos`;
- composición, selectores, iconografía y estados accesibles;
- los destinos de cuadernillos PDF: la API genera el enlace del archivo cargado; las referencias históricas se conservan sin edición manual.
- la ruta de la imagen decorativa: administración no permite escribirla; las rutas heredadas se conservan hasta reemplazar o retirar la imagen.

## Validaciones y estados

- años de cuatro dígitos y claves únicas por colección;
- rol limitado a `estudiante`, `docente` o `general`;
- enlaces interactivos internos o HTTP(S), sin credenciales ni JavaScript; archivos PDF reales de hasta 16 MB;
- grado entre 1 y 6 cuando corresponda;
- colecciones vacías muestran un estado explícito;
- borrador y publicación siguen la regla transaccional general.

## Criterios de aceptación

- administración permite agregar, eliminar, editar y reordenar ediciones y materiales;
- un material PDF nuevo exige cargar un archivo; reemplazarlo crea un UUID nuevo, y guardar sin reemplazar conserva el archivo o enlace heredado de esa edición;
- una imagen decorativa nueva o reemplazada se valida como JPEG, PNG o WebP, se asocia al material y al año de edición y permanece privada mientras la revisión es borrador. Guardar sin reemplazo conserva la imagen administrada o la ruta heredada; retirarla elimina la relación de la nueva revisión sin borrar archivos históricos. Un material sin imagen conserva su presentación textual;
- vista pública y previsualización comparten componentes;
- Cuadernillos interactivos ofrece solo el selector de edición y muestra todos los materiales de la edición elegida, con su actividad o parte en la descripción;
- la edición PDF más reciente muestra un selector de Todos, Estudiantes y Docentes sin selector de año; Todos es la opción inicial y muestra todos los materiales vigentes, mientras las opciones por rol muestran únicamente sus materiales; una selección vacía comunica su estado;
- al agregar y publicar una edición PDF de un año posterior, la anterior pasa automáticamente al archivo histórico con sus materiales, roles, claves y destinos intactos, sin traslado manual ni modificación de archivos físicos;
- el contenido inicial conserva todos los recursos vigentes;
- pruebas cubren validación, colecciones vacías y publicación.

## Contrato implementado

- Clave editorial: `resource-booklets`; se publica dentro de `GET /api/v1/site/home` y utiliza las rutas generales protegidas de borrador y publicación.
- `eyebrow`, `title` y `description` son obligatorios. `editions_json` contiene una lista ordenada de `{year, type, materials}`; la respuesta expone `editions` como arreglo.
- La pareja año/tipo es única. Cada edición admite cero o más materiales y exige claves únicas dentro de ella. Cada material conserva `key`, `grade` opcional, `role`, `title`, `description`, `href`, `image` decorativa opcional y `part` opcional.
- El catálogo inicial contiene 13 ediciones y 124 materiales: 12 cuadernillos de 2025, 85 recursos históricos y 27 actividades interactivas. El generador reproducible está en `scripts/generate-resource-catalog.mjs`.
- Las actividades interactivas admiten enlaces internos o HTTP(S) validados. Los cuadernillos PDF nuevos se cargan como campos multipart `booklet_{año}_{clave}`; la API valida el PDF, lo almacena bajo el año de edición y genera `href` al presentar la revisión. Los PDF heredados conservan su enlace hasta que se reemplacen; la administración no permite escribirlo.
- Las imágenes decorativas de cualquier tipo de edición se cargan como campos multipart `booklet_image_{año}_{tipo}_{clave}` y se almacenan bajo el año. La relación usa la pareja año/tipo y la clave del material para distinguir ediciones PDF e interactivas. La API expone `image_uuid`, `image_name` e `image` generado para los medios administrados. `remove_image` retira la imagen solo en la nueva revisión. Las rutas históricas en `image` permanecen compatibles mientras no exista reemplazo ni retiro.
- La vista pública y la copia administrativa usan `ResourceBookletsSection` de `packages/ui`; si una colección está vacía muestran un mensaje explícito.
- La colección PDF vigente se determina por el año mayor publicado, independientemente del orden de las ediciones. En ella el selector de tipo usa los roles presentes. El archivo histórico muestra todas las demás ediciones PDF y conserva sus selectores de año y rol. El administrador puede agregar una nueva edición PDF con materiales de ambos roles y publicarla; esa acción desplaza automáticamente la edición anterior al histórico sin reescribirla.
- El editor explica este cambio automático junto a la colección de ediciones y permite cargar PDF sin escribir destinos. La revisión histórica conserva sus relaciones de medios y el paso al archivo histórico no mueve los archivos físicos.

- Acciones administrativas: textos y ediciones con cuadernillos se editan desde accesos separados y guardan un único borrador de la sección.
