# Configuración de Microsoft Entra ID para la administración

OLCOMEP utiliza registros separados para la SPA administrativa y la API. La vista pública no requiere autenticación.

## Registro de la API

1. Registrar la API y exponer el scope delegado `access_as_user`.
2. Registrar el tenant, audiencia, scope y Client ID permitido en el `.env` privado de `apps/api` usando como guía `apps/api/env`.
3. Definir `auth.bootstrapMasterEmail` con el correo MEP de la persona que realizará el primer acceso.
4. Confirmar en `auth.allowedEmailDomains` los dominios institucionales admitidos.
5. Ejecutar `php spark db:seed BootstrapMasterSeeder` para crear la autorización inicial de forma idempotente.
6. Después del primer acceso, verificar que la cuenta quedó vinculada por `oid` como Master. Los roles posteriores se administran desde OLCOMEP y no mediante App Roles de Entra.

## Registro de la SPA

1. Crear un registro de tipo SPA, sin client secret.
2. Registrar `http://localhost:5174` para desarrollo y la URL administrativa HTTPS exacta para producción.
3. Conceder permiso delegado al scope `access_as_user` de la API.
4. Copiar `apps/admin-web/.env.example` como `.env.local` y sustituir únicamente los valores locales.

## Comprobación

Iniciar API y administrador. La pantalla debe ofrecer “Ingresar con cuenta MEP”, regresar a la SPA tras la redirección y mostrar nombre, correo y rol. Una cuenta del tenant sin autorización local activa debe recibir HTTP 403; un token inválido, vencido o de otra aplicación debe recibir HTTP 401.

Master puede gestionar los tres roles; Administrador únicamente Editores; Editor no ve el módulo de usuarios. El backend impide modificar el rol o estado propio y dejar el sistema sin al menos un Master activo.

No se deben compartir ni confirmar archivos `.env`, tokens, secretos o identificadores reales fuera de la configuración privada del ambiente.
