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
- Sección institucional “Acerca de nosotros”.
- Sección “Coordinaciones regionales”.
- Sección “Información general”.
- Sección “Calendario”.
- Sección “Colaboradores y patrocinadores”.
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

El header utiliza el activo institucional del MEP `public/logotipo MEP.png` y la versión oficial más reciente de OLCOMEP, recibida como `Logo OLCOMEP V2.png` e importada como `public/logo-olcomep.png`. Ambos funcionan como parte del enlace cuyo nombre accesible es “OLCOMEP, inicio”, por lo que conservan alternativa vacía para evitar duplicación. El archivo fuente externo permanece intacto.

La sección “Conoce OLCOMEP” presenta el logotipo OLCOMEP a una escala mayor que el header y el footer, integrado en la columna de introducción como apoyo directo a la explicación de la olimpiada. Conserva la proporción y el arte original sobre fondo transparente, y utiliza alternativa vacía porque el nombre y propósito se expresan en el encabezado y los párrafos contiguos.

El footer repite ambas marcas una sola vez como firma institucional de cierre. El logotipo claro del MEP se muestra directamente sobre el fondo oscuro para conservar su contraste y el archivo OLCOMEP utiliza transparencia real para integrarse sin un recuadro blanco. Las imágenes son decorativas para tecnología de asistencia porque sus nombres completos aparecen inmediatamente como texto. Fuera de la sección “Conoce OLCOMEP”, no se repite el logotipo en el hero, las demás secciones de contenido, el carrusel ni la galería.

Los logotipos institucionales de TEC, UCR, UNA, UNED y UTN se conservan como archivos PNG con transparencia real en `apps/public-web/public`, junto al activo de OLCOMEP. Son los activos autorizados para una futura integración de las instituciones aliadas en el footer; su incorporación visual debe mantener proporciones, legibilidad y una presencia secundaria frente a las marcas MEP y OLCOMEP.

### PUB-006 — Enlaces externos

Los enlaces que abran otra pestaña usarán `rel="noopener noreferrer"` y comunicarán claramente su destino.

### PUB-007 — Movimiento

La galería tendrá controles explícitos y respetará `prefers-reduced-motion`; no será necesario conservar la reproducción automática si perjudica el acceso al contenido.

### PUB-008 — Enfoque en Educación Primaria

El header, el título principal y los metadatos identifican a OLCOMEP como la Olimpiada Costarricense de Matemática para la Educación Primaria. El primer viewport comunica explícitamente que está dirigida a estudiantes de 1.º a 6.º año. La navegación denomina los cuadernillos como práctica por nivel para facilitar su comprensión.

### PUB-009 — Acerca de nosotros

La página incluye una sección diferenciada basada en el documento institucional `Antecedentes OLCOMEP.docx`. Presenta, sin reproducir el documento de forma literal, los siguientes contenidos:

- origen regional durante la primera década de 2000 y experiencia pionera de Puriscal;
- proyección nacional asumida por la Asesoría Nacional de Matemáticas en 2014;
- nacimiento oficial de OLCOMEP en 2015 para I y II Ciclos;
- virtualización de etapas durante 2020;
- crecimiento del 120 % entre 2022 y 2024, desde 7 000 hasta más de 18 000 participantes;
- participación de las 27 Direcciones Regionales de Educación;
- alianza del MEP con UCR, UNED, UNA, TEC y UTN dentro de la Comisión Central;
- visión integral y humanista vinculada con STEAM, equidad de género, pensamiento crítico, inclusión y superación personal.

La sección mantiene un destino único en la navegación, diferencia hechos históricos de la descripción general de la olimpiada y evita afirmaciones comparativas que no puedan validarse de manera independiente.

### PUB-010 — Coordinaciones regionales

La página reconoce el alcance de OLCOMEP en las 27 Direcciones Regionales de Educación y publica el directorio suministrado en `Coordinaciones regionales OLCOMEP sitio web.docx`. Cada registro muestra región, persona coordinadora y uno o más correos institucionales disponibles. El directorio permite buscar por región, persona o correo y comunica un estado vacío cuando no existen coincidencias.

Los datos se mantienen como contenido estático de la vista pública: no se cargan en la base de datos, no modifican el formulario externo de inscripción y no habilitan endpoints administrativos. Las inconsistencias de la fuente no se corrigen mediante suposiciones: la ficha de Coto usa el encabezado regional como autoridad frente a una descripción interna que menciona Alajuela, y el correo de Allan Pérez Calderón queda pendiente de confirmación porque el documento repite el de otra persona.

### PUB-011 — Información general

La vista pública incluye un punto de entrada que organiza Reglamento, Cómo participar, Calendario y Preguntas frecuentes. La taxonomía toma como referencia la arquitectura de información de `https://www.obm.org.br/informacoes-gerais/`, sin copiar textos, reglas ni procesos de la olimpiada brasileña.

El contenido OLCOMEP se construye exclusivamente con datos confirmados en el sitio heredado, documentos institucionales y especificaciones vigentes: población de primero a sexto año, inscripción mediante formulario externo, periodo del 8 de abril al 6 de mayo de 2026, manual y reglamento 2026, materiales de preparación y directorio regional. Los temas conducen a documentos o anclas existentes, los PDF se identifican claramente y las preguntas frecuentes utilizan controles nativos operables con teclado.

### PUB-012 — Calendario

La vista pública incluye una sección “Calendario” con el cronograma oficial de la XII edición OLCOMEP 2026, suministrado en `Cronograma OLCOMEP 2026.docx` y contrastado con el manual institucional. Presenta en orden cronológico inscripción, inauguración, talleres de preparación, pruebas de Primera y Segunda Etapa, publicaciones de resultados, Etapa Final y Premiación Nacional. Las pruebas de las dos primeras etapas conservan la distribución indicada: quinto y sexto año el primer día, tercero y cuarto el segundo, y primero y segundo el tercero.

Las fechas se marcan semánticamente con elementos `time`, los intervalos conservan inicio y cierre, y las actividades sin día confirmado muestran únicamente el mes. La sección no inventa horarios ni fechas de talleres: comunica que esos detalles serán publicados en los canales oficiales. Incluye un enlace claramente identificado al manual 2026 para consultar observaciones y condiciones completas.

### PUB-013 — Colaboradores y patrocinadores

La vista pública diferencia las instituciones colaboradoras de los patrocinadores. UCR, UNED, UNA, TEC y UTN se presentan como universidades públicas colaboradoras de la Comisión Central OLCOMEP mediante los logotipos oficiales suministrados, conservados en PNG con fondo transparente y sin deformación.

El Centro Cultural Costarricense Norteamericano se identifica como patrocinador de OLCOMEP 2026 mediante su nombre completo. Mientras no exista un activo gráfico autorizado, la interfaz no inventa ni sustituye su logotipo. Cada marca universitaria cuenta con un texto alternativo informativo y dimensiones reservadas. No se repiten siglas debajo de los logotipos ni se encierran las marcas en bordes individuales: el espacio abierto se destina a ampliar los logotipos sin recortarlos, mientras sus nombres completos permanecen disponibles para tecnología de asistencia.

Al pasar el puntero por cada institución, únicamente su logotipo aumenta hasta un 6 % durante 300 ms. La transición no modifica el flujo ni las dimensiones de la retícula y se omite mediante `prefers-reduced-motion` cuando la persona usuaria solicita reducir el movimiento.

## Fuera de alcance de esta iteración

- Panel administrativo.
- Persistencia de contenido en la API.
- Cambio de autenticación.
- Eliminación del sitio heredado.
