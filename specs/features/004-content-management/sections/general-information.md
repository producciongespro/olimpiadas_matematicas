# Preguntas frecuentes (`general-information`)

## Alcance y compatibilidad

La clave editorial y de API `general-information` se conserva para mantener las revisiones existentes. La sección pública muestra únicamente Preguntas frecuentes. Se eliminan el bloque «Orientación para participar / Información general» y todas sus tarjetas; Reglamento, Cómo participar y Calendario se alcanzan desde el submenú de Información.

## Campos editables

- Antetítulo y título de Preguntas frecuentes.
- Colección ordenada de preguntas y respuestas, con altas, bajas y reordenamiento sin máximo funcional fijo.

## Campos protegidos y validaciones

- Ancla `#preguntas-frecuentes`, estructura semántica, acordeón y jerarquía de encabezados.
- Títulos y textos obligatorios con límites del contrato; las preguntas y respuestas son texto plano.
- El servidor acepta `faq_eyebrow`, `faq_title` y `faqs_json` al guardar. Ignora campos heredados de rutas y presentación. Las respuestas públicas y administrativas omiten `routes`, `eyebrow`, `title` y `description` de revisiones antiguas.

## Estados y aceptación

- Borrador, copia editorial responsive y publicación confirmada. La publicación vigente no cambia hasta confirmar.
- Una colección vacía muestra un mensaje explícito y no rompe el ancla ni la navegación.
- El editor administrativo se denomina «Preguntas frecuentes» y permite editar únicamente los campos vigentes.
- La vista pública conserva las preguntas predeterminadas como respaldo si la API falla.
