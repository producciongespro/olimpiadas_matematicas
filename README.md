# Olimpiadas Matemáticas OLCOMEP

Monorepo para la modernización progresiva del sitio de Olimpiadas Matemáticas.

## Estado de la migración

El sitio estático vigente permanece en `app/` y continúa siendo la referencia visual, funcional y de contenido. La nueva implementación se construye en `apps/public-web/` sin modificar todavía las rutas públicas heredadas.

## Estructura

- `app/`: sitio público heredado, preservado durante la transición.
- `apps/public-web/`: nueva vista pública en React, Vite y Tailwind.
- `apps/admin-web/`: base del futuro panel administrativo.
- `apps/api/`: API de CodeIgniter 4 basada en la plantilla institucional proporcionada.
- `packages/`: código compartido entre aplicaciones web.
- `specs/`: requisitos, arquitectura, contratos y criterios de aceptación.
- `docs/`: inventarios y documentación de la migración.

El estado consolidado para retomar el trabajo se mantiene en `specs/estadoProyecto.md`.

## Desarrollo frontend

Requiere Node.js 20 o superior. Después de instalar las dependencias en la raíz:

```bash
npm run dev:public
npm run dev:admin
```

## Desarrollo de la API

La API usa PHP 8.2 o superior y se configura localmente en `apps/api/.env.development`:

```bash
composer --working-dir=apps/api install
php apps/api/spark serve --port 3600
```

El endpoint de verificación es `http://localhost:3600/api/v1/health`. La plantilla versionada se encuentra en `apps/api/env`; los archivos privados `.env.development` y `.env.production` no se publican.

## Base de datos local con Docker

Docker Compose inicia MySQL 8.0 y phpMyAdmin. Copie `.env.example` como `.env` en la raíz, sustituya ambas contraseñas y copie `apps/api/env` como `apps/api/.env.development` con la misma `MYSQL_PASSWORD`. Después ejecute:

```powershell
docker compose up -d
docker compose ps
php apps/api/spark migrate --all
php apps/api/spark db:seed OlcomepInitialSeeder
```

MySQL queda en `127.0.0.1:3307` y phpMyAdmin en `http://localhost:8080`. Use `olcomep` y la contraseña de aplicación para ingresar. Los datos permanecen en el volumen nombrado al ejecutar `docker compose down`; `docker compose down -v` los elimina. Consulte [la guía local](docs/development/docker-local.md) para el procedimiento completo.

## Convención de commits

Los commits usan el formato obligatorio `DD-MM-YYYY Descripción amplia en español`. Consulte `AGENTS.md` y `docs/development/commit-convention.md`. Después de clonar, active el hook con:

```bash
git config core.hooksPath .githooks
```
