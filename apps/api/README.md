# API OLCOMEP

<img alt="Logotipo oficial de OLCOMEP" src="public/assets/logo-olcomep.png" width="180">

API de OLCOMEP construida sobre la base institucional de CodeIgniter 4 y PHP 8.2+. Incluye CORS configurable, limitación de solicitudes, bitácora de auditoría y protección de rutas administrativas con Microsoft Entra ID.

## Incluye

- Rutas explícitas, con auto-routing deshabilitado.
- `GET /api/v1/health` para verificación de disponibilidad.
- Rutas públicas para carrusel, eventos y entrega controlada de imágenes.
- CRUD administrativo de diapositivas, eventos, fotografías, portada y orden.
- CORS definido por variables de entorno y respuesta `OPTIONS` para preflight.
- Filtros `jwt-auth` y `role` para rutas administrativas.
- Validación de JWT RS256: firma, JWKS, emisor, audiencia, tenant, aplicación cliente autorizada y scope.
- Rol administrativo configurable; el valor sugerido es `api.admin` y debe cambiarse si el proyecto lo requiere.
- Bitácora `api_audit_log`, limitación de solicitudes y cabeceras de seguridad.

## Arquitectura en capas

Todo endpoint de negocio debe respetar este flujo:

`Controller → Service → Repository → Database`

- **Controller:** recibe la solicitud HTTP, valida el formato de entrada, delega al servicio y construye la respuesta HTTP. No contiene reglas de negocio ni consultas SQL.
- **Service:** concentra las reglas de negocio, autorización específica del caso de uso y transacciones que involucren más de un repositorio.
- **Repository:** encapsula consultas y persistencia. No conoce solicitudes HTTP ni respuestas JSON.
- **Database:** se modifica exclusivamente mediante migraciones versionadas; cada proyecto define sus propias tablas e índices.

La clase `App\Repositories\BaseRepository` es el punto de partida para los repositorios del proyecto.

## Instalación

```bash
composer install
copy env .env.development
php spark migrate
php spark db:seed OlcomepInitialSeeder
php spark serve --port 3600
```

Edite `.env.development` con los valores locales. Los puntos de entrada cargan `.env.development` por defecto y `.env.production` cuando el proceso define `CI_ENVIRONMENT=production`. Nunca publique esos archivos ni credenciales reales.

### Entorno local del monorepo

- API: `http://localhost:3600`
- Vista pública: `http://localhost:5173`
- Administración: `http://localhost:5174`
- Salud: `GET http://localhost:3600/api/v1/health`
- Base MySQL sugerida: `olcomep`

La plantilla `env` autoriza por CORS únicamente las dos SPA locales. La auditoría queda desactivada hasta crear la base y ejecutar las migraciones; después debe activarse con `audit.enabled = true`.

El seeder `OlcomepInitialSeeder` registra la edición 2026 e importa las 15 fotografías heredadas como diapositivas publicadas del carrusel. No crea eventos: sus fotografías se cargarán desde administración. Es idempotente y puede ejecutarse nuevamente sin duplicar datos.

El contrato de medios está documentado en `../../docs/api/media-v1.openapi.yaml`. Los archivos se almacenan en `writable/uploads`, que debe desplegarse como volumen persistente y respaldarse coordinadamente con la base de datos.

## Microsoft Entra ID

Registre una aplicación para la API y una aplicación independiente para cada SPA autorizada. En la API, exponga el scope configurado en `azure.requiredScope`; OLCOMEP administra localmente los roles `master`, `admin` y `editor` después de validar la identidad institucional.

La SPA obtiene un *access token* mediante MSAL con Authorization Code Flow + PKCE y solicita el scope de la API. Debe enviar el token en cada llamada administrativa:

```http
Authorization: Bearer <access_token>
```

Las rutas dentro de `api/v1/admin` requieren un token cuyo `aud`, `tid`, `azp` (o `appid`), `scp` y `roles` coincidan con la configuración. Las rutas públicas deben exponer únicamente datos aptos para acceso anónimo; CORS no sustituye autorización.

## Producción

- Use `CI_ENVIRONMENT=production`, HTTPS y dominios CORS exactos.
- Cree un usuario MySQL exclusivo con privilegios mínimos sobre la base de esta API.
- Defina un `audit.ipHashSalt` largo, aleatorio y único por ambiente.
- Configure `azure.allowedClientIds` exclusivamente con los client IDs de las SPA autorizadas.
- Use Redis para caché y rate limit si se despliega más de una instancia.
- Agregue validación de entrada y autorización específica en cada endpoint nuevo.

## Pruebas

```bash
composer test
composer audit --locked
```
