# Criterios de aceptación

- La vista pública no depende de MSAL ni solicita inicio de sesión.
- El administrador sin sesión muestra una pantalla de acceso y no monta los módulos editoriales.
- El inicio y cierre de sesión utilizan redirecciones de Microsoft Entra ID.
- La configuración ausente produce un mensaje claro sin iniciar un flujo contra el tenant `common`.
- La SPA solicita el scope propio de la API y adquiere tokens silenciosamente cuando existe una cuenta activa.
- No existe campo para pegar tokens y la aplicación no persiste access tokens manualmente.
- Todas las solicitudes administrativas incluyen el esquema estricto `Authorization: Bearer <token>`.
- La API valida firma, vigencia, tenant, emisor v1/v2, audiencia, scope y aplicación cliente.
- Las rutas administrativas responden 401 ante identidad inválida y 403 ante identidad válida sin autorización local activa.
- Master administra los tres roles; Administrador administra únicamente Editores; Editor no accede a gestión de usuarios.
- Un Master puede crear otro Master y ninguna operación puede dejar cero Masters activos.
- El rol o estado propio no puede modificarse.
- El primer Master solo se crea cuando no existen usuarios y el correo autenticado coincide con `auth.bootstrapMasterEmail`.
- La sesión muestra nombre/correo de la cuenta activa y ofrece cierre de sesión.
- La configuración versionada contiene solo nombres y valores de ejemplo, nunca identificadores reales ni secretos.
- Las pruebas de autenticación de la API y el build administrativo finalizan correctamente.
