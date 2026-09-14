# Inicio de sesión administrativo con cuenta MEP

## Objetivo

Proteger `apps/admin-web` y las operaciones administrativas de `apps/api` mediante Microsoft Entra ID, usando una cuenta institucional MEP y autorización explícita por rol de aplicación.

## Separación de superficies

- `apps/public-web` continúa siendo pública y no carga MSAL.
- `apps/admin-web` tiene su propio registro SPA, URL de redirección, build y variables de entorno.
- `apps/api` tiene un registro independiente, expone un scope delegado y valida cada token antes de ejecutar rutas administrativas.

## Flujo

1. El administrador abre la SPA administrativa.
2. Sin una cuenta activa, se muestra una pantalla institucional de acceso.
3. “Ingresar con cuenta MEP” inicia `loginRedirect` contra el tenant configurado y solicita el scope delegado de la API.
4. Al volver, MSAL procesa la respuesta y establece la cuenta activa.
5. Cada solicitud protegida obtiene un access token mediante `acquireTokenSilent` y lo envía como `Authorization: Bearer`.
6. Si Microsoft exige interacción, la SPA redirige nuevamente; nunca solicita pegar o guardar tokens manualmente.
7. Cerrar sesión usa `logoutRedirect` y limpia la cuenta de la sesión.

## Configuración del frontend

Variables sin secretos:

- `VITE_ENTRA_CLIENT_ID`: identificador del registro SPA administrativo.
- `VITE_ENTRA_TENANT_ID`: tenant institucional.
- `VITE_ENTRA_API_SCOPE`: scope completo, por ejemplo `api://<api-id>/access_as_user`.
- `VITE_ENTRA_REDIRECT_URI`: URI registrada; por defecto usa el origen actual.
- `VITE_API_URL`: base de la API.

La caché de MSAL usa `sessionStorage`; no se persisten access tokens en almacenamiento propio de la aplicación.

## Validación de la API

La API rechaza de forma segura tokens que incumplan firma RS256/JWKS, `kid`, vigencia, tenant `tid`, emisor oficial v1 o v2, audiencia, scope o aplicación cliente `azp`/`appid`. La audiencia acepta las representaciones GUID y `api://GUID` únicamente cuando derivan del mismo identificador configurado.

Después de autenticar, la API vincula `oid` y correo con una autorización local activa. La pertenencia al tenant MEP no concede por sí misma acceso administrativo.

## Roles locales

- `master`: edita contenido y gestiona masters, administradores y editores.
- `admin`: edita contenido y gestiona únicamente editores.
- `editor`: edita contenido y no gestiona usuarios.

Un Master puede crear otro Master. Ninguna operación puede desactivar, degradar o eliminar al último Master activo. La validación se realiza dentro de una transacción y la API impide que una persona modifique su propio rol o estado.

El primer Master se declara mediante `auth.bootstrapMasterEmail` en el `.env` privado de la API. `BootstrapMasterSeeder` crea la autorización únicamente cuando la tabla está vacía y es idempotente para esa misma cuenta. El primer inicio de sesión cuyo correo coincide exactamente vincula el `oid` de Microsoft. La variable no otorga privilegios adicionales después del bootstrap.

## Registro de Entra requerido

- Registro API: exponer `access_as_user`.
- Registro SPA: agregar las URI exactas de desarrollo y producción y conceder permiso delegado al scope de la API.
- Configurar el Client ID de la SPA en `azure.allowedClientIds`.

Ningún client secret se utiliza en la SPA ni se confirma en Git.
