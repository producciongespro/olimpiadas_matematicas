# Rutas del entorno institucional `_test`

Las tres aplicaciones comparten `https://recursos.mep.go.cr/_test/olimpiadas-matematicas-primaria-cr/` y se publican en directorios distintos:

| Aplicación | URL base | Origen del artefacto |
| --- | --- | --- |
| Vista pública | `https://recursos.mep.go.cr/_test/olimpiadas-matematicas-primaria-cr/app/` | `apps/public-web/dist/` |
| Administración | `https://recursos.mep.go.cr/_test/olimpiadas-matematicas-primaria-cr/admin/` | `apps/admin-web/dist/` |
| API | `https://recursos.mep.go.cr/_test/olimpiadas-matematicas-primaria-cr/webservices/` | `apps/api/public/` como raíz web de CodeIgniter |

La base REST consumida por ambas SPA es `https://recursos.mep.go.cr/_test/olimpiadas-matematicas-primaria-cr/webservices/api/v1`. El sufijo `/api/v1` es parte de las rutas de CodeIgniter, no del directorio de despliegue.

## Archivos privados de entorno

Se conservan `.env.development` y `.env.production` por separado. Los tres archivos `.env.production` están ignorados por Git y deben prepararse en cada equipo o servidor:

- `apps/public-web/.env.production`: `VITE_API_URL` y `VITE_BASE_PATH=/_test/olimpiadas-matematicas-primaria-cr/app/`.
- `apps/admin-web/.env.production`: `VITE_API_URL`, `VITE_BASE_PATH=/_test/olimpiadas-matematicas-primaria-cr/admin/`, `VITE_PUBLIC_SITE_URL` y `VITE_ENTRA_REDIRECT_URI` con la URL completa del administrador terminada en `/`. Los identificadores públicos de Entra siguen siendo los de la aplicación registrada.
- `apps/api/.env.production`: `app.baseURL` con `/webservices/` final y `api.allowedOrigins` con **solo el origen** `https://recursos.mep.go.cr`, sin rutas. Deben completarse las credenciales de base de datos y demás valores privados del servidor. El proceso PHP debe arrancar con `CI_ENVIRONMENT=production`; ese valor determina cuál archivo carga CodeIgniter.

El build de Vite lee los `.env.production` al ejecutarse. Cambiar sus valores después de compilar no modifica los archivos JavaScript ya generados. La vista pública usa la base `/app/` para los recursos estáticos heredados; las URL de medios generadas por la API dependen de `app.baseURL`.

## Verificaciones antes de publicar

1. Compilar ambos workspaces en modo producción y comprobar que `dist/index.html` apunta a `/app/assets/` y `/admin/assets/` bajo la ruta `_test`.
2. Configurar el servidor para servir cada `dist/` y exponer **solo** `apps/api/public/` en `/webservices/`; confirmar que las rutas `/api/v1` y los medios UUID llegan a CodeIgniter.
3. Registrar en Microsoft Entra la URI de retorno administrativa exacta usada por `VITE_ENTRA_REDIRECT_URI`, incluido su `/` final, y verificar el inicio y cierre de sesión en el navegador.
4. Confirmar que la API devuelve las URL de medios con `/webservices/` y que la vista pública descarga los archivos heredados bajo `/app/data/`.
5. Establecer almacenamiento persistente para `apps/api/writable/uploads` y configurar las credenciales de producción antes de desplegar.

La institución confirmó que las rutas `_test` estarán disponibles por HTTPS. La disponibilidad del servidor, su configuración de reescritura y el registro de Entra deben verificarse en la infraestructura institucional; esta configuración local no ejecuta un despliegue.
