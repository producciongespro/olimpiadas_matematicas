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
