# Sección editorial: Recursos y cuadernillos

## Objetivo

Administrar los textos y catálogos de cuadernillos recientes, archivo histórico e interactivos sin perder archivos, orden, grado, rol ni edición.

## Campos editables

- antetítulo, título y descripción general;
- colección ordenada de ediciones;
- por edición: año, tipo `pdf` o `interactive` y materiales ordenados;
- por material: clave estable, grado, rol, parte opcional, título, descripción, destino e imagen decorativa opcional.

## Campos protegidos

- anclas `#cuadernillos` y `#interactivos`;
- composición, selectores, iconografía y estados accesibles;
- archivos físicos existentes; esta iteración edita referencias validadas y no carga documentos nuevos.

## Validaciones y estados

- años de cuatro dígitos y claves únicas por colección;
- rol limitado a `estudiante`, `docente` o `general`;
- destinos internos o HTTP(S), sin credenciales ni JavaScript;
- grado entre 1 y 6 cuando corresponda;
- colecciones vacías muestran un estado explícito;
- borrador y publicación siguen la regla transaccional general.

## Criterios de aceptación

- administración permite agregar, eliminar, editar y reordenar ediciones y materiales;
- vista pública y previsualización comparten componentes;
- el contenido inicial conserva todos los recursos vigentes;
- pruebas cubren validación, colecciones vacías y publicación.

## Contrato implementado

- Clave editorial: `resource-booklets`; se publica dentro de `GET /api/v1/site/home` y utiliza las rutas generales protegidas de borrador y publicación.
- `eyebrow`, `title` y `description` son obligatorios. `editions_json` contiene una lista ordenada de `{year, type, materials}`; la respuesta expone `editions` como arreglo.
- La pareja año/tipo es única. Cada edición admite cero o más materiales y exige claves únicas dentro de ella. Cada material conserva `key`, `grade` opcional, `role`, `title`, `description`, `href`, `image` decorativa opcional y `part` opcional.
- El catálogo inicial contiene 13 ediciones y 124 materiales: 12 cuadernillos de 2025, 85 recursos históricos y 27 actividades interactivas. El generador reproducible está en `scripts/generate-resource-catalog.mjs`.
- Los destinos se limitan a rutas internas, anclas o HTTP(S) sin credenciales, espacios ni barras invertidas. Esta capacidad edita referencias; no carga documentos.
- La vista pública y la copia administrativa usan `ResourceBookletsSection` de `packages/ui`; si una colección está vacía muestran un mensaje explícito.
