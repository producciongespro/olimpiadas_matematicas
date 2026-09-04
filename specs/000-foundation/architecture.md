# Arquitectura inicial

## Contexto

El sistema actual es un sitio estático de una sola página basado en HTML, Bootstrap 3, jQuery, CSS propio y un repositorio local de documentos e imágenes.

## Decisión

- React con JavaScript/JSX para las aplicaciones web.
- Vite como servidor de desarrollo y sistema de construcción.
- Tailwind CSS con tokens institucionales compartidos.
- React Router para navegación pública futura.
- CodeIgniter 4.7+ y PHP 8.2+ para la API REST.
- Microsoft Entra ID y JWT RS256 para proteger las operaciones administrativas.
- Arquitectura de API por capas: Controller → Service → Repository → Database.
- npm workspaces para los paquetes JavaScript del monorepo.

## Estrategia de transición

1. Mantener `app/` intacta como referencia y versión desplegable.
2. Inventariar contenido, enlaces, recursos y comportamientos.
3. Migrar una sección pública por iteración.
4. Comparar cada sección con el sitio heredado y sus criterios de aceptación.
5. Cambiar el punto de despliegue solamente cuando exista paridad funcional.

No se duplicarán inicialmente todos los archivos binarios del sitio público. Su ubicación definitiva se decidirá junto con la estrategia de despliegue y almacenamiento.

## Base de backend

La plantilla proporcionada se integró en `apps/api` sin su repositorio `.git`. Se conservaron sus controles de CORS, rate limit, auditoría, autenticación y roles. La carpeta de origen permanece intacta como referencia.
