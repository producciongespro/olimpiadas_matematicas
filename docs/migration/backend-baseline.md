# Línea base del backend

## Origen

El código fue integrado desde `base-backend` como copia de trabajo. La carpeta de origen y su historial Git permanecen intactos; `apps/api` pertenece exclusivamente al monorepo de OLCOMEP.

## Tecnología y capacidades

- PHP 8.2 o superior.
- CodeIgniter 4.7 o superior.
- Firebase PHP-JWT 7.1 o superior.
- Endpoint público `GET /api/v1/health`.
- CORS configurable por entorno.
- Rate limit mediante el servicio throttler.
- Auditoría de solicitudes mediante migraciones versionadas.
- Validación JWT RS256 con Microsoft Entra ID.
- Autorización administrativa por roles.
- Capas Controller, Service, Repository y Database.

## Adaptaciones realizadas

- Se conservó la identidad original del paquete Composer para mantener sincronizado `composer.lock`; se cambiará cuando se actualice el lock de forma controlada.
- El endpoint de salud reporta el servicio `olcomep-api`.
- No se copió la carpeta `.git` de la base.
- No se creó una `.env` ni se añadieron credenciales.

## Trabajo pendiente

- Definir dominios, entidades y permisos propios de OLCOMEP.
- Configurar base de datos, orígenes CORS y aplicaciones de Entra ID por ambiente.
- Revisar las migraciones de auditoría antes de ejecutarlas.
- Instalar dependencias con Composer y ejecutar las pruebas.
