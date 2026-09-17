# Estado del proyecto — OLCOMEP

## 1. Propósito de este documento

Este archivo permite retomar la reingeniería de OLCOMEP desde otra computadora o una nueva conversación sin depender del historial de chats. Debe actualizarse después de cambios relevantes en arquitectura, configuración, funcionalidades, verificaciones, despliegue o prioridades.

Última actualización: **17-09-2026**.

## 2. Repositorio y rama activa

- Repositorio: `https://github.com/producciongespro/olimpiadas_matematicas.git`
- Rama de trabajo: `devUlate`
- Upstream: `origin/devUlate`
- Commit de referencia: `5cb0fb4`
- Mensaje: `16-09-2026 Actualiza el estado y los próximos pasos del proyecto`
- Estado observado el 17-09-2026: rama local alineada con `origin/devUlate`, sin commits adelantados ni atrasados antes de esta actualización documental.

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
- El header presenta conjuntamente el activo institucional `public/logotipo MEP.png` y la versión oficial más reciente `Logo OLCOMEP V2.png`, publicada como `public/logo-olcomep.png` con el fondo exterior convertido a transparencia.
- La sección “Conoce OLCOMEP” utiliza el logotipo oficial como aparición principal dentro del contenido, a mayor escala que en el header y el footer.
- El footer reutiliza ambas marcas como firma institucional de cierre; fuera de “Conoce OLCOMEP”, se evita repetir el logotipo en el hero, carrusel, galería y demás secciones.
- Los logotipos suministrados de TEC, UCR, UNA, UNED y UTN están preparados con fondo transparente en `apps/public-web/public`, junto a `logo-olcomep.png`, para su posterior incorporación en el footer.
- El header, el `h1` y los metadatos identifican explícitamente a OLCOMEP como una Olimpiada de Matemática para Primaria; el primer viewport muestra el rango de 1.º a 6.º año.
- Están migrados encabezado, navegación, galería, presentación institucional, edición 2026, contacto y pie de página.
- La sección “Acerca de nosotros” sintetiza el documento institucional `Antecedentes OLCOMEP.docx` mediante una cronología desde las experiencias regionales de la primera década de 2000 hasta la alianza actual con universidades públicas, e incluye las cifras de crecimiento 2022–2024 y la visión integral, humanista y STEAM.
- La sección “Coordinaciones regionales” publica como contenido estático las 27 fichas suministradas en `Coordinaciones regionales OLCOMEP sitio web.docx`, con búsqueda por región, persona o correo. No carga regionales en la base ni altera la inscripción externa; el correo duplicado de Allan Pérez Calderón permanece marcado como pendiente de confirmación.
- La sección “Información general” funciona como un centro de orientación hacia Reglamento, Cómo participar, Calendario y Preguntas frecuentes. Adapta la arquitectura observada en la referencia de OBM a contenido confirmado de OLCOMEP, sin trasladar reglas brasileñas.
- La sección “Calendario” publica las 12 actividades suministradas en `Cronograma OLCOMEP 2026.docx`, desde la inscripción del 8 de abril hasta la Premiación Nacional del 3 de diciembre; detalla la distribución de niveles para las pruebas y enlaza al manual institucional para consultar sus condiciones completas.
- La sección “Colaboradores y patrocinadores” reconoce a UCR, UNED, UNA, TEC y UTN como universidades públicas colaboradoras y al Centro Cultural Costarricense Norteamericano como patrocinador de OLCOMEP 2026; este último se presenta sin imagen hasta contar con un activo autorizado.
- Los logotipos de las universidades aplican un zoom de 6 % al pasar el puntero, sin alterar la retícula y respetando `prefers-reduced-motion`.
- Los logotipos colaboradores utilizan un área visual ampliada y no repiten sus siglas debajo de la imagen; el nombre completo se conserva como alternativa accesible.
- La retícula de colaboradores utiliza espaciado abierto, sin bordes grises alrededor de cada marca.
- La portada principal es el primer componente conectado al gestor de contenido: conserva valores locales de respaldo, consume su publicación desde la API y comparte el mismo componente React con la vista previa administrativa.
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
- Incluye el primer módulo de “Contenido del sitio”, con edición estructurada de la portada, reemplazo de imagen, vista previa móvil/escritorio, guardado de borrador y publicación confirmada.
- Su encabezado incorpora el logotipo oficial de OLCOMEP con dimensiones reservadas y alternativa vacía porque el nombre aparece como texto adyacente.
- Permite crear, publicar, ocultar, archivar, ordenar y definir portadas mediante controles operables por teclado.
- Consume las rutas protegidas de la API con un token Bearer de Microsoft Entra ID conservado durante la sesión.
- La integración de inicio de sesión interactivo con MSAL está implementada; queda pendiente proporcionar los identificadores reales de las App Registrations exclusivamente mediante variables privadas de cada ambiente.
- El ingreso manual de tokens fue retirado. `admin-web` usa MSAL con redirect, caché de sesión, adquisición silenciosa del scope de la API, identidad visible y cierre de sesión; sin configuración Entra muestra un estado seguro y no monta los módulos.
- El acceso utiliza roles locales `master`, `admin` y `editor`: Master gestiona los tres roles, Administrador únicamente Editores y Editor solo contenido. El módulo “Usuarios” respeta esas capacidades y permite activar o desactivar autorizaciones.

### API

- La API vive en `apps/api` y fue integrada desde la base CodeIgniter proporcionada, sin copiar su historial Git.
- Expone `GET /api/v1/health`.
- Expone consultas públicas para carrusel, eventos y archivos publicados.
- Expone operaciones administrativas protegidas para diapositivas, eventos, fotografías, orden y portada.
- Expone el contenido público agregado mediante `GET /api/v1/site/home` y rutas protegidas para consultar, guardar borradores y publicar secciones.
- Las tablas `content_sections` y `content_revisions` separan catálogo, borrador, publicación e historial; las imágenes editables referencian `media_files.id` y se almacenan bajo `writable/uploads/sections/{section-key}`.
- Valida JPEG, PNG y WebP de hasta 8 MB y almacena sus binarios bajo `writable/uploads` con nombres internos aleatorios.
- Tiene CORS configurable para las SPA locales, limitación de solicitudes, cabeceras seguras y auditoría.
- Las rutas administrativas están preparadas para filtros JWT y rol mediante Microsoft Entra ID.
- El filtro JWT delega en un validador probado que comprueba firma RS256/JWKS, vigencia, tenant, emisor Microsoft v1/v2, audiencia GUID o `api://GUID`, scope y Client ID autorizado; `RoleFilter` exige una autorización local activa con rol reconocido.
- La tabla `admin_users` vincula correo MEP con `oid`, rol y estado. La API impide cambiar el rol/estado propio o dejar cero Masters activos; el primer Master solo puede incorporarse mediante el correo privado `auth.bootstrapMasterEmail` cuando la tabla está vacía.
- La arquitectura acordada es `Controller → Service → Repository → Database`.
- El README y el contrato OpenAPI identifican visualmente la API mediante `public/assets/logo-olcomep.png`.
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
- Administración del contenido público: `specs/features/004-content-management/`.
- Inicio de sesión administrativo con cuenta MEP: `specs/features/005-admin-entra-authentication/`.
- Modelo y decisiones de datos: `docs/migration/olcomep-data-model.md`.
- Entorno local de la API: `docs/migration/api-local-environment.md`.
- Inicialización de MariaDB: `docs/migration/mysql-initialization.md`.

Las tareas fundacionales registradas en `specs/000-foundation/tasks.md` están completadas. La administración ya cubre contenido, medios y usuarios, y la API dispone de los endpoints relacionados; continúan pendientes la ampliación de capacidades de negocio, la configuración real de Entra ID, las validaciones integrales y el despliegue.

## 6. Configuración local

Los archivos `.env` no se almacenan en Git. Nunca deben copiarse secretos reales a este documento.

### Frontend

Puertos locales previstos:

- Vista pública: `http://localhost:5173`
- Administración: `http://localhost:5174`

Los workspaces se administran desde la raíz mediante npm.

### API

- URL local: `http://localhost:3600`
- Salud: `http://localhost:3600/api/v1/health`
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
5. Iniciar la API con `php apps/api/spark serve --port 3600`.
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

Decisión local del 11-09-2026:

- El puerto oficial de desarrollo de la API cambió de `8080` a `3600`; el cliente compartido, la plantilla de entorno, CodeIgniter, el contrato OpenAPI y la documentación quedaron alineados.
- `Logo OLCOMEP V2.png` sustituyó al activo heredado como versión oficial más reciente y se copió sin alteraciones a las vistas pública y administrativa y al directorio público de la API.
- `npm run build`: correctos los builds de `public-web` y `admin-web` después de integrar el logotipo y ajustar su escala responsive desde 320 px.
- `npm run build --workspace=@olcomep/public-web`: correcto después de incorporar “Acerca de nosotros”, su destino de navegación y la cronología adaptada desde `Antecedentes OLCOMEP.docx`.
- `npm run build --workspace=@olcomep/public-web`: correcto después de actualizar “Coordinaciones regionales” con las 27 fichas y la búsqueda del directorio institucional.
- `npm run build --workspace=@olcomep/public-web`: correcto después de incorporar “Información general”, sus accesos a reglamento, participación, calendario y preguntas frecuentes, y ajustar la navegación compacta para evitar desbordamiento horizontal.
- Revisión visual de escritorio: la sección conserva jerarquía editorial, enlaces legibles y navegación sin recortes; en resoluciones menores a 1536 px el encabezado utiliza el menú compacto.
- `composer --working-dir=apps/api test`: 13 pruebas y 41 aserciones correctas después de incorporar el activo a la documentación pública de la API.
- `npm run build --workspace=@olcomep/public-web` y `npm run build --workspace=@olcomep/admin-web`: correctos después de sustituir el logotipo por `Logo OLCOMEP V2.png`; las tres copias publicadas conservan el mismo hash SHA-256.
- `composer --working-dir=apps/api test`: 13 pruebas y 41 aserciones correctas después de actualizar el logotipo expuesto por la documentación de la API.
- El fondo exterior del logotipo se extrajo a transparencia sin alterar los píxeles visibles; las tres superficies conservan una copia PNG idéntica con 297 757 píxeles transparentes y esquinas alfa 0.

Verificaciones del 14-09-2026:

- `npm run build --workspace=@olcomep/public-web`: correcto después de incorporar la sección “Calendario” con las 12 actividades oficiales de la edición 2026.
- Auditoría visual en escritorio y móvil: una sola sección `#calendario`, 12 actividades, 15 elementos `time`, un único `h1` y sin desbordamiento horizontal a 360 px.
- `npm run build --workspace=@olcomep/public-web`: correcto después de incorporar “Colaboradores y patrocinadores”.
- Auditoría visual en escritorio y móvil: una sola sección de alianzas, cinco logotipos informativos, patrocinador textual, un único `h1` y sin desbordamiento horizontal a 360 px.
- `npm run build --workspace=@olcomep/public-web`: correcto después de añadir el zoom sutil y la reducción de movimiento a los logotipos colaboradores.
- `npm run build --workspace=@olcomep/public-web`: correcto después de eliminar las siglas repetidas y ampliar el área visible de los cinco logotipos colaboradores.
- `npm run build --workspace=@olcomep/public-web`: correcto después de retirar los bordes individuales de la retícula de colaboradores.
- `composer --working-dir=apps/api test`: 14 pruebas y 46 aserciones correctas después de incorporar el modelo y el flujo editorial de la portada; la prueba de esquema aplica y revierte la migración nueva en SQLite temporal.
- `npm run build --workspace=@olcomep/public-web`: correcto con la portada compartida, consumo público y respaldo local.
- `npm run build --workspace=@olcomep/admin-web`: correcto con el editor, carga y vista previa responsive de la portada.
- `php apps/api/spark migrate --all`: migración `CreateContentManagement` aplicada correctamente en MariaDB local después de levantar XAMPP; `PublicContentSeeder` registró la portada y vinculó su imagen inicial mediante `media_file_id`.
- Verificación real en `GET /api/v1/site/home`: portada publicada con revisión 1; la imagen se entregó desde `/api/v1/media/{uuid}` como `image/png`, HTTP 200 y 109 603 bytes.
- `composer --working-dir=apps/api test`: 21 pruebas y 53 aserciones correctas después de extraer y cubrir el validador JWT de Microsoft; no quedaron pruebas omitidas.
- `npm run build --workspace=@olcomep/admin-web`: correcto después de integrar `@azure/msal-browser` y `@azure/msal-react`.
- `npm run build --workspace=@olcomep/public-web`: correcto después de permitir adquisición asíncrona de tokens en el cliente API compartido; la vista pública continúa sin depender de MSAL.
- `composer --working-dir=apps/api test`: 25 pruebas y 60 aserciones correctas después de incorporar roles locales, creación jerárquica y protección del último Master.
- `npm run build --workspace=@olcomep/admin-web`: correcto después de incorporar el perfil autorizado y el módulo de gestión de usuarios.
- `php apps/api/spark migrate --all`: migración `CreateAdminUsers` aplicada correctamente en MariaDB local.
- `BootstrapMasterSeeder` ejecutado dos veces de forma idempotente: existe exactamente un Master activo inicial, configurado mediante el `.env` privado, pendiente únicamente de vincular su `oid` en el primer inicio de sesión Microsoft.

## 9. Regla de commits y sincronización

- Formato obligatorio: `DD-MM-YYYY Descripción amplia en español`.
- La fecha debe coincidir con la fecha local actual.
- No se permiten prefijos `feat:`, `fix:`, `docs:` o similares antes de la fecha.
- El hook `.githooks/commit-msg` se activa mediante `core.hooksPath=.githooks`.
- Nunca se debe utilizar `--no-verify`.
- Después de cada commit se debe comprobar `git log -1 --pretty=%s`.
- Antes de preparar cualquier commit solicitado, se debe revisar y actualizar este archivo con todo el estado vigente de la iteración.
- Antes de sincronizar, ejecutar `git fetch`, revisar el upstream y comparar adelantos y atrasos.

El estado exacto de archivos pendientes debe obtenerse siempre mediante `git status`; este documento no mantiene una lista estática de cambios sin confirmar.

## 10. Riesgos y pendientes recomendados

1. Crear y configurar por ambiente las App Registrations exclusivas para la API y la SPA administrativa, y validar con una identidad MEP real el inicio de sesión interactivo ya implementado.
2. Ejecutar una revisión visual y de accesibilidad con API, base y archivos levantados conjuntamente.
3. Mantener la inscripción externa y no activar las tablas reservadas sin una nueva decisión aprobada.
4. Definir el proceso oficial de resultados, puntajes, medallas y premiación antes de modelarlo.
5. Validar la vista pública con lector de pantalla real y herramienta especializada de contraste antes de producción.
6. Definir la estrategia de almacenamiento y despliegue de documentos históricos.
7. Mantener este archivo actualizado después de cada iteración importante.

## 11. Próximo paso recomendado

Configurar Microsoft Entra ID por ambiente y validar con una identidad administrativa MEP el inicio de sesión interactivo y el flujo real de borrador/publicación de la portada. El ingreso manual de tokens ya fue retirado. Después, extender el patrón editorial a “Conoce OLCOMEP”.

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
