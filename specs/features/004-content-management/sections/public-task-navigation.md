# Accesos por tarea de la vista pública

## Alcance y campos

- Bloque público situado inmediatamente después de la portada principal.
- Campos editables: ninguno. Los textos breves y destinos se controlan por código y corresponden a funciones estables del sitio.
- Campos protegidos: título, orden, anclas, composición, colores, iconografía y tratamiento responsive.
- Colecciones dinámicas: ninguna. Son cuatro destinos fijos: `#edicion-vigente`, `#cuadernillos`, `#calendario` y `#coordinaciones-regionales`.

## Validaciones y estados

- Cada destino debe existir una sola vez en la página y tener nombre accesible.
- No depende de una respuesta de la API: los cuatro enlaces están disponibles durante carga, error, vacío y éxito de las secciones editoriales. Cada sección de destino conserva su propio estado.
- Los enlaces usan anclas locales; no abren pestañas ni cambian la autenticación.

## Criterios de aceptación

- El bloque se muestra después de la portada y antes de la edición vigente.
- En móvil y escritorio no provoca desbordamiento horizontal y cada enlace ofrece al menos 44 px de alto.
- El foco se distingue con teclado y el orden de lectura coincide con el orden visual.
- La paleta, tipografía y movimiento mantienen el carácter institucional; no se agregan patrones de juego como HUD o controles de cámara.
