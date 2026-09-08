# Migración de la vista pública

## Objetivo

Reproducir en React la experiencia pública existente de OLCOMEP, conservando su contenido y recursos, mientras se corrigen barreras de accesibilidad, navegación y adaptación responsive.

## Audiencia

- Estudiantes de educación primaria y sus familias.
- Personal docente y administrativo.
- Personas que buscan lineamientos, inscripciones y cuadernillos históricos.

## Alcance inicial

- Navegación principal.
- Galería fotográfica.
- Presentación y objetivo de OLCOMEP.
- Información, inscripción y descargas de la edición vigente.
- Cuadernillos por año, nivel y tipo de usuario.
- Cuadernillos interactivos.
- Contacto, créditos y enlaces institucionales.

## Requisitos

### PUB-001 — Paridad de contenido

Los 155 enlaces y las 154 referencias de imagen inventariadas deben conservarse o contar con una decisión de migración explícita.

### PUB-002 — Recursos históricos

Los documentos desde 2016 hasta 2026 deben seguir disponibles mediante rutas estables o redirecciones documentadas.

### PUB-003 — Jerarquía semántica

La página tendrá un único `h1`; las secciones y subsecciones mantendrán un orden de encabezados coherente.

### PUB-004 — Navegación accesible

El encabezado y sus menús serán operables con teclado, tendrán foco visible y funcionarán en móvil sin depender del hover.

### PUB-005 — Imágenes

Las imágenes informativas tendrán texto alternativo útil y las decorativas usarán `alt=""`.

El header utiliza el activo institucional `public/logotipo MEP.png` con una altura visual aproximada de 55 px; el logotipo funciona como parte del enlace cuyo nombre accesible es “OLCOMEP, inicio”, por lo que conserva alternativa vacía para evitar duplicación.

### PUB-006 — Enlaces externos

Los enlaces que abran otra pestaña usarán `rel="noopener noreferrer"` y comunicarán claramente su destino.

### PUB-007 — Movimiento

La galería tendrá controles explícitos y respetará `prefers-reduced-motion`; no será necesario conservar la reproducción automática si perjudica el acceso al contenido.

### PUB-008 — Enfoque en Educación Primaria

El header, el título principal y los metadatos identifican a OLCOMEP como la Olimpiada Costarricense de Matemática para la Educación Primaria. El primer viewport comunica explícitamente que está dirigida a estudiantes de 1.º a 6.º año. La navegación denomina los cuadernillos como práctica por nivel para facilitar su comprensión.

## Fuera de alcance de esta iteración

- Panel administrativo.
- Persistencia de contenido en la API.
- Cambio de autenticación.
- Eliminación del sitio heredado.
