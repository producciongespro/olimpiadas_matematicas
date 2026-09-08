# Estado del proyecto — OLCOMEP

## 1. Propósito de este documento

Este archivo permite retomar la reingeniería de OLCOMEP desde otra computadora o una nueva conversación sin depender del historial de chats. Debe actualizarse después de cambios relevantes en arquitectura, configuración, funcionalidades, verificaciones, despliegue o prioridades.

Última actualización: **08-09-2026**.

## 2. Repositorio y rama activa

- Repositorio: `https://github.com/producciongespro/olimpiadas_matematicas.git`
- Rama de trabajo: `devUlate`
- Upstream: `origin/devUlate`
- Commit de referencia: `03481d0`
- Mensaje: `04-09-2026 Configura el monorepo y establece la base funcional de OLCOMEP`
- Estado observado el 08-09-2026: rama local alineada con su upstream, sin commits adelantados ni atrasados antes de esta actualización documental.

El hash es una referencia local del momento de esta actualización. Antes de continuar se debe ejecutar `git fetch` y comprobar la relación con la rama remota.

## 3. Objetivo y arquitectura

El repositorio moderniza el sitio heredado de Olimpiadas Matemáticas mediante un monorepo con:

- React, Vite, JavaScript y Tailwind CSS para la vista pública.
- React, Vite, JavaScript y Tailwind CSS para la administración.
- CodeIgniter 4.7, PHP 8.2 y MySQL/MariaDB para la API.
- Microsoft Entra ID y JWT RS256 para proteger operaciones administrativas.
- npm workspaces y paquetes compartidos para clientes API, UI, utilidades y configuración visual.
- Specification-Driven Development mediante requisitos, criterios y tareas versionados en `specs/`.

La aplicación heredada permanece en `app/` como referencia funcional y de contenido. No debe eliminarse ni modificarse durante la transición sin una decisión explícita.

## 4. Estado funcional

### Vista pública

- La nueva aplicación vive en `apps/public-web`.
- El header utiliza el activo institucional `public/logotipo MEP.png` con una altura aproximada de 55 px.
- El header, el `h1` y los metadatos identifican explícitamente a OLCOMEP como una Olimpiada de Matemática para Primaria; el primer viewport muestra el rango de 1.º a 6.º año.
- Están migrados encabezado, navegación, galería, presentación institucional, edición 2026, contacto y pie de página.
- El carrusel principal consume diapositivas publicadas desde la API y aparece inmediatamente debajo del header.
- El carrusel respeta el contenedor central de 1200 px, usa alturas explícitas de 144, 176 y 208 px según el viewport, avanza automáticamente cada 6 segundos y se pausa con hover, foco, interacción manual o movimiento reducido.
- La galería permite seleccionar eventos publicados y define estados de carga, vacío, error y éxito.
- Las 15 fotografías heredadas cuentan con un seeder idempotente que las importa como diapositivas publicadas del carrusel. La galería de eventos inicia vacía.
- Las diapositivas heredadas no muestran título; “OLCOMEP en acción” fue retirado del carrusel.
- Se conservan 12 cuadernillos de 2025 para estudiantes y docentes.
- El catálogo histórico contiene 85 recursos entre 2016 y 2024.
- Los años 2020 a 2022 incluyen 27 actividades interactivas con destinos directos de Genially.
- La paridad funcional y las decisiones de migración están registradas en `docs/migration/public-site-parity.md`.
- La vista fue auditada en 320, 768 y 1280 px sin desbordamiento horizontal ni controles menores de 44 px.

### Vista administrativa

- La base de la aplicación vive en `apps/admin-web`.
- El workspace React/Vite/Tailwind compila correctamente.
- Incluye módulos funcionales para administrar diapositivas, eventos y fotografías.
- Permite crear, publicar, ocultar, archivar, ordenar y definir portadas mediante controles operables por teclado.
- Consume las rutas protegidas de la API con un token Bearer de Microsoft Entra ID conservado durante la sesión.
- La integración de inicio de sesión interactivo con MSAL queda pendiente de configurar las App Registrations reales.

### API

- La API vive en `apps/api` y fue integrada desde la base CodeIgniter proporcionada, sin copiar su historial Git.
- Expone `GET /api/v1/health`.
- Expone consultas públicas para carrusel, eventos y archivos publicados.
- Expone operaciones administrativas protegidas para diapositivas, eventos, fotografías, orden y portada.
- Valida JPEG, PNG y WebP de hasta 8 MB y almacena sus binarios bajo `writable/uploads` con nombres internos aleatorios.
- Tiene CORS configurable para las SPA locales, limitación de solicitudes, cabeceras seguras y auditoría.
- Las rutas administrativas están preparadas para filtros JWT y rol mediante Microsoft Entra ID.
- La arquitectura acordada es `Controller → Service → Repository → Database`.
- Las dependencias PHP están fijadas en `composer.lock`; `vendor/` no se confirma en Git.

### Modelo de datos

Existen migraciones iniciales para:

- `editions`
- `resources`
- `educational_regions`
- `schools`
- `students`
- `guardians`
- `registrations`
- `media_files`
- `carousel_slides`
- `events`
- `event_images`

El modelo se basó en los 16 campos del formulario oficial de inscripción masiva 2026. La identificación del estudiante se diseñó para persistirse cifrada, con una huella para unicidad y solo cuatro caracteres disponibles para soporte. No existe una columna de identificación en texto plano.

El modelo de resultados, puntajes, medallas y premiación permanece fuera de alcance hasta validar el proceso oficial.

El seeder inicial registra de forma idempotente únicamente la edición OLCOMEP 2026. La inscripción continúa mediante el formulario externo vigente, por lo que no se cargan regionales ni datos personales y no existen endpoints para administrarlos.

## 5. Especificaciones vigentes

- Fundación del monorepo: `specs/000-foundation/`.
- Migración pública: `specs/features/001-public-site-migration/`.
- Dominio inicial de inscripciones: `specs/features/002-registration-domain/`.
- Carrusel y galería de eventos: `specs/features/003-carousel-event-gallery/`.
- Modelo y decisiones de datos: `docs/migration/olcomep-data-model.md`.
- Entorno local de la API: `docs/migration/api-local-environment.md`.
- Inicialización de MariaDB: `docs/migration/mysql-initialization.md`.

Las tareas fundacionales registradas en `specs/000-foundation/tasks.md` están completadas. Esto no significa que el producto completo esté terminado: la administración, los endpoints de negocio y el despliegue continúan pendientes.

## 6. Configuración local

Los archivos `.env` no se almacenan en Git. Nunca deben copiarse secretos reales a este documento.

### Frontend

Puertos locales previstos:

- Vista pública: `http://localhost:5173`
- Administración: `http://localhost:5174`

Los workspaces se administran desde la raíz mediante npm.

### API

- URL local: `http://localhost:8080`
- Salud: `http://localhost:8080/api/v1/health`
- Base MySQL sugerida: `olcomep`
- Plantilla versionada: `apps/api/env`
- Configuración privada local: `apps/api/.env`

La plantilla autoriza por CORS los orígenes locales `5173` y `5174`. La auditoría permanece desactivada hasta ejecutar las migraciones sobre MySQL. La validación JWT permanece activa, pero los identificadores reales de Entra ID todavía deben configurarse fuera del repositorio.

## 7. Preparación en una computadora nueva

```bash
git clone https://github.com/producciongespro/olimpiadas_matematicas.git
cd olimpiadas_matematicas
git switch devUlate
git config core.hooksPath .githooks
npm install
composer --working-dir=apps/api install
```

Luego:

1. Copiar `apps/api/env` como `apps/api/.env`.
2. Crear la base MySQL `olcomep` y completar las credenciales locales.
3. Ejecutar `php apps/api/spark migrate --all`.
4. Ejecutar `php apps/api/spark db:seed OlcomepInitialSeeder`.
5. Iniciar la API con `php apps/api/spark serve`.
6. Iniciar las SPA con `npm run dev:public` y `npm run dev:admin`.

No se debe ejecutar la migración contra una base con datos existentes sin revisar primero su estado y contar con respaldo.

## 8. Verificaciones realizadas

Las siguientes verificaciones corresponden al cierre del commit de referencia del 04-09-2026:

- `npm run build`: correctos los builds de `public-web` y `admin-web`.
- `composer --working-dir=apps/api test`: 9 pruebas y 23 aserciones correctas.
- Migraciones de las siete tablas aplicadas y revertidas mediante SQLite temporal.
- `GET /api/v1/health`: respuesta HTTP 200 con servicio `olcomep-api` en estado `ok`.
- Preflight CORS desde administración: respuesta HTTP 204.
- Auditoría de Composer: sin vulnerabilidades conocidas en ese momento.
- Auditoría pública: un solo `h1`, sin IDs duplicados, saltos de encabezado, destinos internos ausentes, controles sin nombre ni enlaces externos inseguros.
- `app/` permaneció sin modificaciones.

Estas verificaciones son históricas. Después de cambios nuevos deben repetirse las que correspondan al alcance.

Verificaciones del 08-09-2026:

- `composer --working-dir=apps/api test`: 10 pruebas y 28 aserciones correctas.
- Seeder ejecutado dos veces sin duplicar la edición 2026 y sin cargar direcciones regionales.
- Base `olcomep` creada en MariaDB 10.4.32 con `utf8mb4_unicode_ci`.
- Cinco migraciones aplicadas en MariaDB, revertidas completamente y reaplicadas.
- Ocho tablas del dominio y auditoría restauradas después de la reversión.
- Cuatro llaves foráneas verificadas en `registrations` y ninguna identificación en texto plano.
- `composer --working-dir=apps/api test`: 13 pruebas y 41 aserciones correctas después de corregir la clasificación de las fotografías heredadas.
- `npm run build`: correctos los builds de `public-web` y `admin-web`.
- Contrato OpenAPI de medios creado en `docs/api/media-v1.openapi.yaml`.
- La migración de medios fue aplicada, revertida y reaplicada en MariaDB local.
- El seeder se ejecutó dos veces sin duplicar las 15 diapositivas heredadas y sin crear eventos.
- Las consultas reales devolvieron salud `ok`, 15 diapositivas, cero eventos e imágenes JPEG con HTTP 200.

## 9. Regla de commits y sincronización

- Formato obligatorio: `DD-MM-YYYY Descripción amplia en español`.
- La fecha debe coincidir con la fecha local actual.
- No se permiten prefijos `feat:`, `fix:`, `docs:` o similares antes de la fecha.
- El hook `.githooks/commit-msg` se activa mediante `core.hooksPath=.githooks`.
- Nunca se debe utilizar `--no-verify`.
- Después de cada commit se debe comprobar `git log -1 --pretty=%s`.
- Antes de sincronizar, ejecutar `git fetch`, revisar el upstream y comparar adelantos y atrasos.

El estado exacto de archivos pendientes debe obtenerse siempre mediante `git status`; este documento no mantiene una lista estática de cambios sin confirmar.

## 10. Riesgos y pendientes recomendados

1. Configurar las App Registrations reales e integrar el inicio de sesión interactivo del administrador.
2. Ejecutar una revisión visual y de accesibilidad con API, base y archivos levantados conjuntamente.
3. Mantener la inscripción externa y no activar las tablas reservadas sin una nueva decisión aprobada.
4. Definir el proceso oficial de resultados, puntajes, medallas y premiación antes de modelarlo.
5. Crear App Registrations exclusivas para la API y las SPA y configurar Entra ID por ambiente.
6. Validar la vista pública con lector de pantalla real y herramienta especializada de contraste antes de producción.
7. Definir la estrategia de almacenamiento y despliegue de documentos históricos.
8. Mantener este archivo actualizado después de cada iteración importante.

## 11. Próximo paso recomendado

Configurar Microsoft Entra ID por ambiente e integrar MSAL en `apps/admin-web`; después validar el flujo administrativo completo con una identidad autorizada y definir la estrategia de respaldo de base y `writable/uploads`.

## 12. Prompt para retomar con Codex

```text
Continúa el proyecto OLCOMEP.

Lee completamente AGENTS.md y specs/estadoProyecto.md. Después revisa la especificación relacionada con la tarea solicitada y los archivos reales involucrados.

Repositorio:
https://github.com/producciongespro/olimpiadas_matematicas.git

Rama de trabajo:
devUlate

Antes de modificar archivos, ejecuta git fetch, revisa el estado del repositorio, la relación con origin/devUlate, las migraciones, las rutas, las pruebas y la configuración local disponible. No expongas secretos, datos personales ni archivos .env. Continúa desde el estado registrado sin repetir trabajo terminado y respeta el formato obligatorio de commits DD-MM-YYYY.
```
