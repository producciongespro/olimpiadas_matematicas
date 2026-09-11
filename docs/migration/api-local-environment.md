# Entorno local de la API

Fecha de verificación: 2026-09-04.

## Servicios

| Servicio | URL local |
| --- | --- |
| API CodeIgniter | `http://localhost:3600` |
| Salud | `http://localhost:3600/api/v1/health` |
| Vista pública | `http://localhost:5173` |
| Administración | `http://localhost:5174` |

La configuración versionada vive en `apps/api/env`. Cada desarrollador crea `apps/api/.env`, archivo ignorado por Git, para sus valores locales y secretos.

## Validación realizada

- PHP 8.2.12 con `mysqli`, `pdo_mysql`, `sqlite3`, `intl` y `mbstring` disponibles.
- CodeIgniter 4.7.4 y dependencias instaladas desde `composer.lock`.
- Suite: 6 pruebas y 11 aserciones correctas.
- `GET /api/v1/health`: HTTP 200 y servicio `olcomep-api` en estado `ok`.
- Preflight desde la vista administrativa: HTTP 204.
- CORS devuelve el origen exacto autorizado para los puertos 5173 y 5174.
- Composer no reporta vulnerabilidades conocidas.

## Decisiones temporales

- La base local sugerida se llama `olcomep`; su esquema se creará mediante migraciones en el siguiente paso.
- La auditoría está desactivada hasta ejecutar esas migraciones para evitar intentos de escritura sobre una tabla inexistente.
- La validación JWT permanece activa. Los identificadores de Microsoft Entra ID se completarán con los registros reales de las aplicaciones, sin incluir secretos en el repositorio.

## Validación en MariaDB

El 08-09-2026 se creó la base local `olcomep` en MariaDB 10.4.32 con `utf8mb4_unicode_ci`. Las cinco migraciones disponibles se aplicaron, revirtieron y aplicaron nuevamente de forma correcta.

El estado final contiene:

- Las ocho tablas funcionales y de auditoría esperadas, además de la tabla de control de migraciones.
- Una edición OLCOMEP 2026 publicada, con inscripción del 8 de abril al 6 de mayo.
- Cero direcciones regionales, centros, estudiantes, personas tutoras e inscripciones cargadas; esos datos continúan fuera del sistema.
- Cuatro llaves foráneas en `registrations`.
- Ninguna columna de identificación personal en texto plano.
