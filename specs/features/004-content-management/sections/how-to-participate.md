# Cómo participar (`como-participar`)

## Campos y origen de datos

- Campos editables propios: ninguno. El estado, título y descripción de inscripción se leen de la sección editorial existente `current-edition`.
- Texto protegido: indicación general para estudiantes de primero a sexto año y enlace al detalle de Edición vigente.
- Colecciones dinámicas: ninguna. No se crean medios, tablas, rutas ni campos nuevos en la API.

## Validaciones y estados

- Ancla protegida `#como-participar`, un único título de sección y enlaces internos a destinos existentes.
- Durante la primera carga de contenido publicado, el estado de inscripción se sustituye por un mensaje de carga sin mostrar un año de respaldo.
- Tras éxito, se muestra el estado publicado. Si la API falla, se usa el respaldo local de Edición vigente. Si los campos de inscripción están vacíos, se muestra la orientación general y el enlace al detalle, sin enlaces rotos.

## Criterios de aceptación

- Cómo participar aparece antes de Calendario y Preguntas frecuentes, y el submenú Información lleva directamente a su ancla.
- El estado de inscripción coincide con la misma publicación que usa Edición vigente; no se mantienen dos versiones de fechas o destinos.
- La sección y sus enlaces se operan con teclado, tienen foco visible y se adaptan a móvil y escritorio sin desbordamiento.
