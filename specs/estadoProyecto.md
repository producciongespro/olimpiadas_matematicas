# Estado del proyecto — OLCOMEP

## 1. Propósito de este documento

Este archivo permite retomar la reingeniería de OLCOMEP desde otra computadora o una nueva conversación sin depender del historial de chats. Debe actualizarse después de cambios relevantes en arquitectura, configuración, funcionalidades, verificaciones, despliegue o prioridades.

Última actualización: **22-09-2026**.

## 2. Repositorio y rama activa

- Repositorio: `https://github.com/producciongespro/olimpiadas_matematicas.git`
- Rama de trabajo: `devUlate`
- Upstream: `origin/devUlate`
- Commit de referencia: `abcdeba`
- Mensaje: `18-09-2026 Extiende el gestor editorial a ocho secciones públicas`
- Estado observado el 21-09-2026: rama local alineada con `origin/devUlate`, sin commits adelantados ni atrasados antes de los cambios sin confirmar de esta iteración.

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
- La sección “Coordinaciones regionales” conserva como respaldo local las 27 fichas suministradas, con búsqueda por región, persona o correo; el gestor editorial permite publicar el directorio sin alterar las tablas de inscripción externa.
- La sección “Información general” funciona como un centro de orientación hacia Reglamento, Cómo participar, Calendario y Preguntas frecuentes. Adapta la arquitectura observada en la referencia de OBM a contenido confirmado de OLCOMEP, sin trasladar reglas brasileñas.
- La sección “Calendario” publica las 12 actividades suministradas en `Cronograma OLCOMEP 2026.docx`, desde la inscripción del 8 de abril hasta la Premiación Nacional del 3 de diciembre; detalla la distribución de niveles para las pruebas y permite abrir o descargar el manual anual vigente.
- La sección “Colaboradores y patrocinadores” reconoce a UCR, UNED, UNA, TEC y UTN como universidades públicas colaboradoras y al Centro Cultural Costarricense Norteamericano como patrocinador de OLCOMEP 2026; este último se presenta sin imagen hasta contar con un activo autorizado.
- Los logotipos de las universidades aplican un zoom de 6 % al pasar el puntero, sin alterar la retícula y respetando `prefers-reduced-motion`.
- Los logotipos colaboradores utilizan un área visual ampliada y no repiten sus siglas debajo de la imagen; el nombre completo se conserva como alternativa accesible.
- La retícula de colaboradores utiliza espaciado abierto, sin bordes grises alrededor de cada marca.
- La portada principal es el primer componente conectado al gestor de contenido: conserva valores locales de respaldo, consume su publicación desde la API y comparte el mismo componente React con la vista previa administrativa.
- “Conoce OLCOMEP” consume su propia revisión publicada desde la API y conserva el contenido institucional local como respaldo; el logotipo, la composición y el ancla permanecen controlados por código.
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
- “Contenido del sitio” también administra “Conoce OLCOMEP”: el selector permite alternar secciones, editar antetítulo, título y dos párrafos, guardar un borrador independiente, previsualizar con el componente público compartido y publicar explícitamente.
- El calendario es la tercera sección editorial: permite modificar textos generales, cargar o reemplazar el manual anual en PDF y administrar cualquier cantidad de actividades mediante campos estructurados. El destino del manual está protegido y se genera desde su UUID; el borrador conserva acceso privado hasta publicar.
- “Colaboradores y patrocinadores” es la cuarta sección editorial: administra listas independientes con altas, bajas, orden, enlaces, descripciones y logotipos opcionales vinculados a cada revisión.
- “Acerca de nosotros” es la quinta sección editorial: administra párrafos introductorios, cronología y párrafos de cierre; los hitos y textos pueden agregarse, eliminarse y reordenarse dentro de un borrador independiente.
- “Información general” es la sexta sección editorial: administra rutas informativas y preguntas frecuentes con altas, bajas y orden, destinos validados e iconos seleccionados desde un catálogo controlado.
- “Coordinaciones regionales” es la séptima sección editorial: administra encabezados, regiones, contactos y múltiples correos con altas, bajas y orden; la búsqueda pública filtra por región, persona o correo.
- “Edición vigente” es la octava sección editorial: administra estado de inscripción, documentos descargables dinámicos, inscripción masiva, promoción audiovisual e imagen versionada.
- Su encabezado incorpora el logotipo oficial de OLCOMEP con dimensiones reservadas y alternativa vacía porque el nombre aparece como texto adyacente.
- Permite crear, publicar, ocultar, archivar, ordenar y definir portadas mediante controles operables por teclado.
- Consume las rutas protegidas de la API con un token Bearer de Microsoft Entra ID conservado durante la sesión.
- La integración de inicio de sesión interactivo con MSAL está implementada y la configuración privada local contiene identificadores con formato válido; queda pendiente completar una validación interactiva con una identidad MEP autorizada.
- El ingreso manual de tokens fue retirado. `admin-web` usa MSAL con redirect, caché de sesión, adquisición silenciosa del scope de la API, identidad visible y cierre de sesión; sin configuración Entra muestra un estado seguro y no monta los módulos.
- El acceso utiliza roles locales `master`, `admin` y `editor`: Master gestiona los tres roles, Administrador únicamente Editores y Editor solo contenido. El módulo “Usuarios” respeta esas capacidades y permite activar o desactivar autorizaciones.
- El editor de contenido y la gestión de usuarios se cargan de forma diferida: el bundle inicial administrativo pesa 444,77 kB minificado y los módulos secundarios se descargan al abrirlos.

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
- La identidad validada se comparte mediante un contexto de autenticación tipado y reiniciado por solicitud; filtros, auditoría y controladores ya no agregan propiedades dinámicas a `IncomingRequest` bajo PHP 8.2.
- La arquitectura acordada es `Controller → Service → Repository → Database`.
- El README y el contrato OpenAPI identifican visualmente la API mediante `public/assets/logo-olcomep.png`.
- La documentación técnica tiene una única fuente canónica OpenAPI 3.1 en `apps/api/app/Docs/api/openapi-v1.yaml`; cubre las 32 operaciones, las nueve secciones editoriales, caché, errores y seguridad pública/administrativa.
- En desarrollo, `/docs` presenta el contrato mediante Swagger UI servido íntegramente desde activos locales y enlaza guías de integración, seguridad, operaciones, errores y mantenimiento. El portal no depende de CDN, no se registra en producción y solo sirve archivos incluidos en listas cerradas.
- `php spark docs:sync` publica una copia generada del contrato y `php spark docs:check` comprueba su SHA-256 y la correspondencia exacta entre OpenAPI y las rutas `/api/v1`.
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
- Respaldo, restauración y persistencia de medios: `docs/development/backup-restore-media.md`.
- Las nueve secciones editoriales implementadas cuentan con especificación individual en `specs/features/004-content-management/sections/`.

Las tareas fundacionales registradas en `specs/000-foundation/tasks.md` están completadas. La administración ya cubre contenido, medios y usuarios, y la API dispone de los endpoints relacionados; continúan pendientes la ampliación de capacidades de negocio, la configuración real de Entra ID, las validaciones integrales y el despliegue.

## 6. Configuración local

Los archivos `.env` no se almacenan en Git. Nunca deben copiarse secretos reales a este documento.

La convención privada es `.env.development` para desarrollo y `.env.production` para producción en `admin-web` y `api`. Vite realiza la selección por modo; los puntos de entrada de CodeIgniter cargan el archivo de desarrollo por defecto y el de producción cuando el proceso define `CI_ENVIRONMENT=production`. La antigua `.env.example` del administrador fue eliminada y `apps/api/env` permanece como única plantilla versionada del backend.

### Frontend

Puertos locales previstos:

- Vista pública: `http://localhost:5173`
- Administración: `http://localhost:5174`

Los workspaces se administran desde la raíz mediante npm. Vite fija ambos puertos con `strictPort` para impedir que una aplicación ocupe silenciosamente el puerto reservado a la otra.

### API

- URL local: `http://localhost:3600`
- Salud: `http://localhost:3600/api/v1/health`
- Base MySQL sugerida: `olcomep`
- Plantilla versionada: `apps/api/env`
- Configuración privada local: `apps/api/.env.development`

La plantilla autoriza por CORS los orígenes locales `5173` y `5174`. La auditoría permanece desactivada hasta ejecutar las migraciones sobre MySQL. La validación JWT permanece activa. Los valores de identidad de los archivos privados de producción se copiaron literalmente a la configuración local ignorada por Git. La App Registration real expone `api.read`; la SPA acepta el nombre de scope delegado configurado y la API exige ese mismo valor mediante `azure.requiredScope`.

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

1. Copiar `apps/api/env` como `apps/api/.env.development` y crear `apps/admin-web/.env.development` con las variables Vite requeridas.
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

Verificaciones del 17-09-2026:

- `composer --working-dir=apps/api test`: 25 pruebas y 60 aserciones correctas.
- `npm run build`: correctos los builds de `public-web` y `admin-web` después de configurar localmente el tenant institucional.
- Microsoft Entra confirmó la identidad MEP, pero rechazó la creación de registros por falta de permisos de la cuenta; no se creó ni modificó ninguna aplicación del tenant.
- La SPA administrativa rechaza marcadores de plantilla e identificadores Entra inválidos antes de iniciar una redirección a Microsoft.
- Las vistas pública y administrativa publican explícitamente `favicon.ico`, evitando solicitudes 404 del navegador en desarrollo.
- Vite reserva estrictamente `5173` para `public-web` y `5174` para `admin-web`; si el puerto correspondiente está ocupado, el servidor informa el conflicto en lugar de cambiar de puerto o intercambiar las aplicaciones.
- Los archivos privados `.env.production` de API y administración fueron revisados sin exponer valores y excluidos explícitamente de Git. Sus valores de identidad se copiaron a `apps/api/.env.development` y `apps/admin-web/.env.development`, conservando las URLs, puertos y base de datos locales; las cuatro configuraciones privadas permanecen ignoradas por Git.
- Los fallos de inicialización de MSAL ya no se ocultan: la pantalla y la consola muestran un código seguro de diagnóstico sin registrar identificadores ni tokens.
- La prueba interactiva llegó a Microsoft, que respondió `invalid_client` antes de emitir un token o contactar la API. La base local conserva un único usuario Master activo, todavía sin `entra_oid` ni primer inicio de sesión registrado.

Diagnóstico del 18-09-2026:

- Los Client ID y Tenant ID locales tienen formato válido y coinciden literalmente con sus archivos privados de producción.
- El bloqueo local se aisló al scope real `api.read`: la SPA lo rechazaba por exigir de forma rígida `access_as_user`, mientras la API privada esperaba incorrectamente `User.Read` de Microsoft Graph.
- El contrato, las plantillas y la configuración privada de la API quedaron alineados con `api://<API_CLIENT_ID>/api.read`; queda pendiente repetir el flujo interactivo después de reiniciar los servicios.
- `npm run build --workspace=@olcomep/admin-web`: correcto después de permitir el nombre de scope delegado configurado.
- `composer --working-dir=apps/api test`: 25 pruebas y 60 aserciones correctas con el scope privado alineado.
- La vista previa administrativa incluye su propia copia del activo de respaldo de la portada y ya no intenta obtenerlo desde `localhost:5173` cuando la vista pública está apagada.
- La sesión administrativa estabiliza la cuenta mediante `homeAccountId`; las adquisiciones silenciosas de MSAL ya no recrean periódicamente el cliente API ni alternan el estado `busy` de los botones.
- `npm run build --workspace=@olcomep/admin-web`: correcto después de estabilizar la identidad de sesión y las dependencias de carga.
- El inicio de sesión real alcanzó las rutas administrativas y reveló advertencias `DEPRECATED` de PHP 8.2 por propiedades dinámicas en `IncomingRequest`; el contexto de autenticación fue extraído a un servicio tipado que se reinicia en cada solicitud.
- `composer --working-dir=apps/api test`: 26 pruebas y 69 aserciones correctas después de incorporar y cubrir el contexto de autenticación por solicitud y retirar la comprobación heredada del nombre `.env`.
- Los archivos privados locales fueron renombrados a `.env.development`; Git confirmó que las configuraciones de desarrollo y producción permanecen ignoradas. `php apps/api/spark env` informó el ambiente `development` mediante el cargador nuevo.
- `npm run build --workspace=@olcomep/admin-web`: correcto después de adoptar la convención por ambiente.
- `PublicContentSeeder` registró idempotentemente `olcomep-introduction` en la base local; `GET /api/v1/site/home` confirmó las publicaciones `hero` y `olcomep-introduction`.
- `composer --working-dir=apps/api test`: 27 pruebas y 73 aserciones correctas con el ciclo de borrador y publicación de “Conoce OLCOMEP”.
- `npm run build --workspace=@olcomep/public-web` y `npm run build --workspace=@olcomep/admin-web`: correctos con el componente compartido y el selector de secciones editoriales.
- `PublicContentSeeder` registró idempotentemente `calendar`; el endpoint público confirmó tres secciones y 12 actividades publicadas.
- `composer --working-dir=apps/api test`: 28 pruebas y 76 aserciones correctas con el contrato estructurado del calendario.
- Los builds de `public-web` y `admin-web` finalizaron correctamente después de compartir el componente de calendario entre ambas superficies.
- El editor del calendario permite agregar, eliminar y reordenar actividades sin un máximo funcional fijo; también admite publicar una lista vacía con estado público explícito.
- `composer --working-dir=apps/api test`: 29 pruebas y 78 aserciones correctas después de cubrir altas, bajas, orden y calendario vacío.
- Los builds de `public-web` y `admin-web` finalizaron correctamente con los controles dinámicos del cronograma.
- La migración `CreateContentRevisionMedia` fue aplicada en MariaDB local y permite múltiples logotipos trazables por revisión editorial.
- `PublicContentSeeder` registró `partners`, importó los cinco logotipos universitarios y conservó el patrocinador textual; el endpoint público confirmó cuatro secciones, cinco colaboradores y un patrocinador.
- `composer --working-dir=apps/api test`: 30 pruebas y 85 aserciones correctas, incluida aplicación/reversión de la migración y conservación de logotipos entre publicación y borrador.
- Los builds de `public-web` y `admin-web` finalizaron correctamente con el componente compartido y las listas administrativas dinámicas.
- `PublicContentSeeder` registró idempotentemente `about`; el endpoint público confirmó cinco secciones, seis hitos y dos párrafos introductorios.
- `composer --working-dir=apps/api test`: 31 pruebas y 88 aserciones correctas con altas, bajas y orden de la historia institucional.
- Los builds de `public-web` y `admin-web` finalizaron correctamente con el componente compartido de “Acerca de nosotros”.
- `AGENTS.md` exige desde esta iteración una spec individual previa para cada sección editorial y su actualización obligatoria ante cualquier cambio funcional; las ocho secciones vigentes cuentan con archivo propio en `specs/features/004-content-management/sections/`.
- `PublicContentSeeder` registró `general-information`; el endpoint público confirmó seis secciones, cuatro rutas informativas y cuatro preguntas frecuentes.
- `composer --working-dir=apps/api test`: 32 pruebas y 91 aserciones correctas con edición dinámica de rutas y preguntas.
- Los builds de `public-web` y `admin-web` finalizaron correctamente con el componente compartido de Información general.
- `PublicContentSeeder` registra `regional-coordinations` sin duplicar en la base los contactos institucionales de respaldo; la primera publicación administrativa persiste el directorio editado dentro de su revisión.
- `composer --working-dir=apps/api test`: 33 pruebas y 95 aserciones correctas con altas, bajas, orden, correos normalizados y ciclo de publicación del directorio regional.
- Los builds de `public-web` y `admin-web` finalizaron correctamente con el componente regional compartido; el build administrativo mantiene únicamente la advertencia no bloqueante por un chunk superior a 500 kB.
- `PublicContentSeeder` registró idempotentemente `current-edition` e importó la imagen promocional heredada como medio principal de la revisión.
- `composer --working-dir=apps/api test`: 34 pruebas y 100 aserciones correctas con documentos dinámicos, enlaces internos/HTTP(S), conservación de imagen y publicación de Edición vigente.
- Los builds de `public-web` y `admin-web` finalizaron correctamente con el componente compartido de Edición vigente; permanece la advertencia no bloqueante sobre el tamaño del bundle administrativo.

Verificaciones y mejoras del 21-09-2026:

- `git fetch --prune origin` y la comparación con el upstream confirmaron `0` commits adelantados y `0` atrasados en `devUlate` antes de iniciar la iteración.
- La API, la vista pública y la administración respondieron localmente en `3600`, `5173` y `5174`; salud y contenido público devolvieron HTTP 200.
- La inspección pública confirmó un solo `h1`, ausencia de IDs duplicados, imágenes con alternativa y controles accesibles del carrusel; a 320 px no presentó desbordamiento horizontal.
- La administración alcanzó correctamente la pantalla de acceso institucional, pero la validación autenticada continúa pendiente porque no había una sesión MEP activa y no se automatizaron credenciales.
- Los módulos de contenido y usuarios se cargan ahora de forma diferida. El chunk inicial administrativo bajó de 521,24 kB a 444,77 kB; `ContentEditor` y `UserManagement` se generan como chunks independientes y desapareció la advertencia de 500 kB.
- `npm run build`: correctos los builds de `public-web` y `admin-web`.
- `composer --working-dir=apps/api test`: 34 pruebas y 100 aserciones correctas.
- `php apps/api/spark migrate:status`: las nueve migraciones versionadas aparecen aplicadas en la base local, incluida `CreateContentRevisionMedia` en el lote 5.
- La estrategia coordinada de respaldo, restauración y persistencia de base y `writable/uploads` quedó documentada en `docs/development/backup-restore-media.md`.
- La futura sección editorial “Contacto” cuenta con especificación individual previa en `specs/features/004-content-management/sections/contact.md`; su implementación permanece pendiente.
- La validación en 768 y 1280 px no encontró desbordamiento horizontal, IDs duplicados, imágenes sin `alt`, controles sin nombre ni fallos automáticos de contraste AA. El enlace de salto conserva foco visible, pero después de activarlo el foco termina en `body`; cuatro enlaces tienen menos de 44 px de alto visual.
- La prueba integral confirmó salud `ok`, ocho secciones publicadas, 15 diapositivas, cero eventos —estado vacío esperado—, 15 medios JPEG con HTTP 200 y ambas SPA con HTTP 200.
- `scripts/verify-backup-restore.ps1` creó un volcado, verificó 23 archivos por SHA-256, restauró una base MariaDB aislada, comparó ocho tablas críticas y eliminó los recursos temporales con resultado correcto.
- Los builds con `--mode production` finalizaron correctamente y CodeIgniter reconoció el ambiente `production`.
- La preparación productiva permanece bloqueada porque `app.baseURL`, `api.allowedOrigins` y `VITE_API_URL` privados todavía apuntan a destinos locales, y no existe evidencia versionada del montaje persistente de `writable/uploads` en la infraestructura final.
- El entorno automatizado permitió revisar el árbol de accesibilidad y la navegación por teclado, pero no dispone de un lector de pantalla real; la prueba manual con NVDA, Narrador o equivalente continúa pendiente.
- El informe completo quedó registrado en `docs/validation/2026-09-21-preproduction-validation.md`.
- La regla editorial quedó formalizada: guardar solo reemplaza el borrador; publicar es la única operación que cambia la respuesta pública, supersede la publicación anterior y promueve el borrador completo —contenido y medios— dentro de una transacción. `composer --working-dir=apps/api test` confirmó 34 pruebas y 108 aserciones; la sincronización automática de páginas abiertas se mantiene como el siguiente paso independiente.
- La vista pública centraliza ahora la consulta y combinación de las ocho publicaciones mediante `usePublishedSiteContent`; `HomePage` consume un único estado estructurado, conserva respaldos locales y el último contenido válido ante errores, y dispone de una operación `refresh` reutilizable para la sincronización posterior. `npm run build` compiló correctamente ambas SPA y las 34 pruebas de API conservaron sus 108 aserciones correctas.
- `GET /api/v1/site/home` expone una versión global de publicación y un `ETag` fuerte; el cliente revalida con `If-None-Match` y conserva su estado ante respuestas `304`. Guardar un borrador no modifica la versión pública. La verificación local confirmó HTTP 200 con ocho secciones, versión y `ETag`, seguido de HTTP 304 sin cuerpo para el identificador vigente; los builds finalizaron correctamente y la API alcanzó 34 pruebas con 110 aserciones.
- Las páginas públicas abiertas revalidan las ocho secciones editoriales al recuperar foco, al volver visibles y cada 30 segundos mientras permanecen visibles. El intervalo se pausa en segundo plano, las solicitudes concurrentes se deduplican y los errores conservan el último contenido válido. Los builds de ambas SPA y las 34 pruebas con 110 aserciones finalizaron correctamente; carrusel y galería todavía requieren extender este mismo patrón.
- Los medios publicados usan URLs con UUID, `ETag` por SHA-256 y `Cache-Control: public, max-age=31536000, immutable`. Un reemplazo genera una URL nueva y los archivos exclusivos de borradores permanecen fuera del acceso anónimo hasta publicar la revisión completa. La comprobación HTTP confirmó las mismas cabeceras en respuestas 200 y 304 sin cuerpo; ambas SPA compilaron y la API alcanzó 35 pruebas con 112 aserciones.
- El carrusel, la lista de eventos y el detalle seleccionado exponen versión y `ETag`, y la vista pública los revalida al recuperar foco o visibilidad y cada 30 segundos mientras la pestaña permanece visible. Las respuestas sin cambios usan HTTP 304 sin cuerpo; las actualizaciones preservan la diapositiva y el evento seleccionados cuando siguen publicados. La comprobación HTTP real confirmó el ciclo 200/304 y `Cache-Control: public, max-age=0, must-revalidate` para carrusel y eventos; `npm run build` compiló ambas SPA y `composer --working-dir=apps/api test` finalizó con 35 pruebas y 112 aserciones.
- La paridad del carrusel administrable quedó aprobada: sus 15 medios públicos coinciden por SHA-256 con las 15 fotografías heredadas, y todos cuentan con identificador único, texto alternativo y URL controlada. Se retiraron únicamente las copias sin referencias de `apps/public-web/public/assets/legacy/gallery`; el seeder de instalaciones nuevas toma ahora los originales preservados en `app/img`. `app/`, cuadernillos y documentos históricos permanecen intactos. El build público finalizó correctamente y la API conservó 35 pruebas y 112 aserciones correctas.
- “Contacto” es la novena sección editorial: textos, persona o unidad, cargo, teléfonos, correos y recursos adicionales cuentan con borrador y publicación independiente. La API normaliza correos, valida teléfonos y destinos, la vista pública y la previsualización comparten el componente y los créditos permanecen protegidos. El seeder local confirmó nueve secciones publicadas; ambas SPA compilaron y la API alcanzó 36 pruebas con 116 aserciones.
- La política de caché productiva quedó empaquetada en ambas SPA: `index.html` y las rutas virtuales exigen revalidación, los activos públicos sin hash se revalidan y los JS/CSS con hash usan caché inmutable de un año. Vite copió las reglas Apache a ambos `dist`; el verificador confirmó dos recursos compilados en la vista pública y cuatro en administración. Una prueba HTTP real mediante Apache devolvió `no-cache, must-revalidate` para HTML y `public, max-age=31536000, immutable` para los bundles, conservando HTTP 200 en una ruta interna de la SPA. La política de JSON editorial e imágenes UUID permanece alineada y está documentada en `docs/development/production-cache-policy.md`.
- El paso 10 de aceptación se ejecutó hasta el límite de la sesión disponible. La vista pública abrió correctamente y la auditoría en 320, 768 y 1280 px no encontró desbordamiento, controles pequeños, IDs duplicados, saltos de encabezado, imágenes sin alternativa ni controles sin nombre. Ambas SPA compilaron, la API finalizó 36 pruebas con 116 aserciones y la caché empaquetada pasó su verificación. El recorrido real guardar borrador → publicar → actualización abierta y la interrupción/restauración controlada de la API permanecen pendientes: la administración solo presenta “Acceso institucional” porque no existe una sesión MEP autorizada. La evidencia detallada está en `docs/validation/2026-09-21-step-10-acceptance.md`.
- La documentación de API se consolidó desde tres contratos fragmentados en una fuente canónica OpenAPI 3.1 con 31 operaciones y esquemas estructurados para las nueve secciones editoriales. El portal protegido por ambiente, las guías técnicas, la sincronización SHA-256 y la auditoría automática de rutas quedaron cubiertos por pruebas. La selección de entorno también preserva la precedencia de `CI_ENVIRONMENT` del proceso para impedir que un archivo privado rebaje accidentalmente producción a desarrollo. La prueba HTTP real confirmó 200 para portal, CSS y contrato; el inventario productivo confirmó cero rutas `/docs`. `composer --working-dir=apps/api verify` finalizó correctamente con 42 pruebas, 143 aserciones y el contrato sincronizado.
- `AGENTS.md` establece como regla bloqueante que todo cambio observable de la API actualice conjuntamente especificaciones y Markdown, el OpenAPI canónico, su copia generada, ejemplos y pruebas. `composer --working-dir=apps/api verify` pasa a ser la comprobación obligatoria antes de cerrar cualquier cambio de API o preparar su commit.
- Las tarjetas de Coordinaciones regionales reservan un retrato 5:7 por asesor y muestran una silueta accesible cuando no existe fotografía. Cada contacto cuenta con clave estable; administración permite cargar, reemplazar y retirar JPEG, PNG o WebP mediante un borrador, y la publicación genera URLs UUID inmutables. Los medios exclusivos del borrador se recuperan con token desde `GET /api/v1/admin/media/{uuid}` y `private, no-store`, sin abrir su acceso público. Se importaron y verificaron por SHA-256 14 PNG, se retiraron de `recursos-pendientes` y se publicó explícitamente la revisión regional; las 14 URLs públicas respondieron HTTP 200 como `image/png`. `asesorHeredia.png` permanece pendiente porque la región tiene dos contactos y el archivo no identifica inequívocamente a la persona. El catálogo editorial inicial incluye ahora las 27 regiones. Los builds de ambas SPA finalizaron correctamente y `composer --working-dir=apps/api verify` alcanzó 43 pruebas y 149 aserciones.
- El directorio de Coordinaciones regionales muestra ahora una tarjeta independiente por asesor dentro de un carrusel manual sin reproducción automática. Conserva el buscador visible, filtra por región, persona o correo, reinicia la posición al cambiar el criterio y comunica el total de asesorías y regiones coincidentes. La composición muestra continuidad en móvil, dos tarjetas en tableta y tres en escritorio; admite toque, trackpad, flechas y teclado, mantiene focos visibles y elimina el desplazamiento animado con `prefers-reduced-motion`.
- En la portada principal, los textos de ambos botones permanecen editables, pero sus destinos son estructurales y protegidos: `#edicion-vigente` para la acción principal y `#olimpiadas` para la secundaria. Administración ya no presenta campos para modificarlos y la API restablece ambos valores oficiales al guardar, incluso si una solicitud manual intenta sustituirlos. La prueba focalizada confirmó 14 aserciones y `composer --working-dir=apps/api verify` finalizó con 43 pruebas, 153 aserciones y OpenAPI sincronizado.
- El calendario ya no expone “Destino del manual” como texto editable. Administración permite seleccionar un PDF real de hasta 16 MB, abrirlo o descargarlo en la vista previa y conservarlo al guardar sin reemplazo. El archivo recibe UUID, se relaciona con la revisión mediante `calendar-manual`, permanece privado durante el borrador y solo responde públicamente al publicar; la vista pública ofrece acciones separadas para abrir y descargar y conserva el documento institucional incluido en código como respaldo. OpenAPI documenta el multipart, sus metadatos de lectura y `?download=1`; `composer --working-dir=apps/api verify` finalizó con 44 pruebas, 163 aserciones y el contrato sincronizado. Por indicación de la iteración no se generaron builds de las SPA.
- El portal `/docs` dejó de depender de `unpkg.com`: Swagger UI 5.17.14, su licencia y aviso se sirven desde la API con tipos MIME explícitos. Se corrigió además el YAML inválido ocasionado por `{key}` sin comillas en la descripción de fotografías regionales. La comprobación real en `http://localhost:3600/docs/` mostró la referencia OpenAPI 3.1 completa, incluidos medios, gestión editorial y `EditorialDraftInput`; `composer --working-dir=apps/api verify` finalizó con 44 pruebas, 170 aserciones y el contrato sincronizado.

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

1. Validar con una sesión MEP autorizada el ciclo editorial de las nueve secciones, incluyendo contacto, carga de logotipos, cronología, rutas informativas, directorio regional y Edición vigente.
2. Corregir el destino de foco del enlace de salto, ampliar las áreas táctiles señaladas y validar manualmente con lector de pantalla real y una herramienta especializada de contraste.
3. Mantener la inscripción externa y no activar las tablas reservadas sin una nueva decisión aprobada.
4. Definir el proceso oficial de resultados, puntajes, medallas y premiación antes de modelarlo.
5. Validar la vista pública con lector de pantalla real y herramienta especializada de contraste antes de producción.
6. Aprobar institucionalmente retención, ubicación externa, cifrado y responsables de los respaldos; el procedimiento y el ensayo local ya están verificados.
7. Sustituir los destinos locales de la configuración privada de producción y definir el montaje persistente de `writable/uploads` antes de desplegar.
8. Mantener este archivo actualizado después de cada iteración importante.

## 11. Próximo paso recomendado

Iniciar sesión con una identidad MEP autorizada y validar el flujo real de las nueve secciones editoriales. Después, completar las secciones pendientes de Recursos y cuadernillos, Header y navegación, y Footer y créditos conforme a sus especificaciones individuales.

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
