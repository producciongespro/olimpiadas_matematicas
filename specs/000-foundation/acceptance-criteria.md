# Criterios de aceptación de la reorganización inicial

- El sitio heredado permanece sin cambios dentro de `app/`.
- La raíz declara workspaces para las dos aplicaciones React y los paquetes compartidos.
- La aplicación pública tiene una ruta inicial y usa los tokens institucionales compartidos.
- La aplicación administrativa puede evolucionar sin depender de la vista pública.
- La API de CodeIgniter está integrada sin historial Git anidado y tiene un límite de responsabilidad documentado.
- La estrategia de migración y continuidad está documentada.
- No se instalan dependencias ni se aplican cambios de despliegue en esta etapa.

## Entorno local con Docker

- `docker compose config` valida el archivo YAML cuando se proporcionan las variables privadas.
- MySQL crea `olcomep` con `utf8mb4_unicode_ci` y un usuario de aplicación separado de `root`.
- Los puertos de MySQL y phpMyAdmin se publican solo en `127.0.0.1`; los datos sobreviven a `docker compose down`.
- La API usa el puerto publicado 3307 y ejecuta sus migraciones existentes. No se importan datos de ejemplo de la guía ni datos personales.
- La documentación indica cómo iniciar y verificar los servicios, y distingue la comprobación estática del arranque real.
