# Validación de preproducción — 21-09-2026

## Alcance

Validación local de responsive, estructura accesible, contraste calculado, integración entre SPA, API, MariaDB y archivos, restauración aislada y preparación de producción.

La interfaz corresponde a un servicio educativo institucional para estudiantes, familias y personal docente, orientado a localizar información, fechas y recursos oficiales. Se conserva una dirección de `VARIACIÓN 4/10`, `MOVIMIENTO 2/10` y `DENSIDAD 5/10`.

## Resultados satisfactorios

### Responsive y estructura

- Viewports comprobados: 768 × 900 y 1280 × 900 px.
- No existe desbordamiento horizontal visible. El único elemento fuera del viewport es un texto `sr-only`, comportamiento intencional.
- Existe un solo `h1`, no hay IDs duplicados y todas las imágenes tienen atributo `alt`.
- No se encontraron botones, entradas o selectores visibles sin nombre accesible.
- El enlace de salto es el primer control del orden de tabulación y recibe un indicador de foco sólido de 3 px.

### Contraste automatizado

- La evaluación de texto visible contra el fondo sólido efectivo no encontró combinaciones por debajo de WCAG AA en los viewports revisados.
- Esta comprobación no sustituye una herramienta especializada capaz de analizar texto sobre imágenes, degradados, antialiasing y todos los estados interactivos.

### Integración

- `GET /api/v1/health`: estado `ok`.
- `GET /api/v1/site/home`: ocho secciones publicadas.
- `GET /api/v1/carousel`: 15 diapositivas.
- `GET /api/v1/events`: estado vacío esperado, con cero eventos publicados.
- Los 15 medios del carrusel respondieron HTTP 200 como `image/jpeg`.
- La vista pública y la administración respondieron HTTP 200.
- Las nueve migraciones aparecen aplicadas en MariaDB local.

### Respaldo y restauración

- Se creó un volcado consistente de la base local.
- Se copiaron 23 archivos desde `writable/uploads` y se compararon por SHA-256.
- El volcado se restauró en una base MariaDB aislada y temporal.
- Los conteos de ocho tablas críticas coincidieron entre origen y restauración.
- La base temporal y la copia temporal fueron eliminadas al finalizar.
- El ensayo puede repetirse con `powershell -File scripts/verify-backup-restore.ps1`.

### Build de producción

- `public-web` y `admin-web` compilaron correctamente con `--mode production`.
- El chunk inicial administrativo permanece en 444,77 kB; contenido y usuarios se generan como chunks independientes.
- CodeIgniter reconoce `CI_ENVIRONMENT=production` y carga el archivo privado correspondiente.

## Hallazgos

### Bloqueantes para producción

1. `app.baseURL`, `api.allowedOrigins` y `VITE_API_URL` todavía contienen destinos locales y no usan HTTPS. Deben sustituirse por los dominios definitivos del ambiente antes de desplegar.
2. No existe una definición versionada de infraestructura que demuestre que `apps/api/writable/uploads` se monta fuera del ciclo de reemplazo de la aplicación. El directorio es escribible y está excluido de Git, pero eso no garantiza persistencia en el servidor final.

### Prioridad alta

1. El enlace “Saltar al contenido principal” cambia el fragmento a `#contenido-principal`, pero el foco termina en `body`. El destino debe ser programáticamente enfocables para que la navegación salte efectivamente al contenido.
2. No fue posible ejecutar un lector de pantalla real desde el entorno automatizado disponible. El árbol de accesibilidad expone regiones, encabezados, listas, nombres de controles y estados, pero todavía se requiere una sesión manual con NVDA, Narrador o equivalente.

### Prioridad media

1. “Consultar formulario histórico” y los tres enlaces del footer tienen menos de 44 px de alto visual. Aunque WCAG 2.2 permite excepciones para enlaces en línea o con separación suficiente, conviene ampliar su área interactiva para uso táctil consistente.
2. Falta ejecutar una herramienta especializada de contraste sobre estados de hover, foco, controles deshabilitados y contenido superpuesto a imágenes.

## Criterios para autorizar despliegue

- configurar dominios HTTPS definitivos y comprobar CORS, redirect URI y scope en el ambiente objetivo;
- versionar o documentar con evidencia la configuración real del volumen persistente;
- corregir y repetir la prueba del enlace de salto;
- ejecutar una sesión manual con lector de pantalla;
- ejecutar una auditoría especializada de contraste y resolver hallazgos AA;
- realizar una restauración de ensayo sobre la infraestructura objetivo antes de habilitar escritura administrativa.
