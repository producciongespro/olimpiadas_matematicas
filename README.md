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

La API usa PHP 8.2 o superior y se configura localmente en `apps/api/.env`:

```bash
composer --working-dir=apps/api install
php apps/api/spark serve
```

El endpoint de verificación es `http://localhost:8080/api/v1/health`. La plantilla versionada de configuración se encuentra en `apps/api/env`; el archivo `.env` local no se publica.

## Convención de commits

Los commits usan el formato obligatorio `DD-MM-YYYY Descripción amplia en español`. Consulte `AGENTS.md` y `docs/development/commit-convention.md`. Después de clonar, active el hook con:

```bash
git config core.hooksPath .githooks
```
