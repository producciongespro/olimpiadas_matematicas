# Desarrollo local con Docker

## Alcance

La guía de referencia proporcionada describe MySQL 8.0 y phpMyAdmin en Docker Desktop con WSL 2, mientras CodeIgniter y Vite corren en Windows. Este repositorio conserva su monorepo: `apps/api`, `apps/public-web` y `apps/admin-web`. La API permanece en el puerto 3600 y las vistas en 5173 y 5174. No se crean la tabla ni la ruta `cursos` del ejemplo genérico; el esquema de OLCOMEP se gestiona con sus migraciones.

## Preparación

1. Instale Docker Desktop con WSL 2 y compruebe `docker --version`, `docker compose version` y que Docker Engine esté activo.
2. Copie `.env.example` a `.env` en la raíz. Sustituya `MYSQL_ROOT_PASSWORD` y `MYSQL_PASSWORD` por claves locales distintas. El archivo `.env` está ignorado por Git.
3. Copie `apps/api/env` a `apps/api/.env.development`. En este archivo, ponga en `database.default.password` la misma clave que `MYSQL_PASSWORD`. La conexión usa `127.0.0.1`, la base `olcomep`, el usuario `olcomep`, `MySQLi` y el puerto 3307. Si cambia `MYSQL_HOST_PORT`, cambie también `database.default.port`.
4. Si falta, instale las dependencias con `composer --working-dir=apps/api install` y `npm ci` en la raíz.

## Inicio y verificación

```powershell
docker compose config --quiet
docker compose up -d
docker compose ps
php apps/api/spark migrate --all
php apps/api/spark db:seed OlcomepInitialSeeder
php apps/api/spark migrate:status
php apps/api/spark serve --port 3600
```

En otras terminales, ejecute `npm run dev:public` y `npm run dev:admin`. La salud de la API está en `http://localhost:3600/api/v1/health`; phpMyAdmin está en `http://localhost:8080` y acepta el usuario `olcomep` y su clave local. El esquema se genera mediante migraciones, sin `init.sql` ni datos reales de estudiantes. Los valores CORS ya incluyen ambos puertos Vite y no requieren crear rutas de prueba.

`OlcomepInitialSeeder` prepara la edición inicial, importa las 15 imágenes heredadas del carrusel y publica las secciones editoriales iniciales, con imagen de portada, promoción y cinco logotipos universitarios. Antes de ejecutarlo sobre una base con contenido editorial, revise el alcance de `LegacyCarouselSeeder`, al que invoca: retira un evento heredado específico si existe. La vista pública necesita que la API esté en ejecución para obtener imágenes y contenido publicado.

Las 27 coordinaciones se crean con sus contactos, pero sus fotografías no forman parte del repositorio. Para recuperar retratos al trasladar una base, restaure juntos el volcado de MySQL y `apps/api/writable/uploads` según `docs/development/backup-restore-media.md`; copiar solo las imágenes deja sin relación sus UUID y contactos. Si no hay fotografía confirmada, la vista muestra una silueta. No asigne una imagen a una persona por el nombre de la región cuando hay varios contactos, como ocurre en Heredia.

## Operación y datos

`docker compose stop` detiene los servicios y `docker compose start` los reanuda. `docker compose down` elimina contenedores y red, pero conserva `mysql_datos`. `docker compose down -v` elimina el volumen y todos sus datos: úselo solo si se pretende restablecer la base. Las variables de inicialización de MySQL se aplican únicamente al crear un volumen vacío; cambiar contraseñas en `.env` no cambia usuarios existentes. Para cambiar una clave sin perder datos, use SQL y actualice después la configuración privada.

Los puertos están vinculados a `127.0.0.1`. Se usa 3307 por defecto para evitar conflictos con un MySQL local en 3306. Si 3307 u 8080 está ocupado, cambie `MYSQL_HOST_PORT` o `PHPMYADMIN_HOST_PORT` en `.env`; actualice también el puerto de CodeIgniter si corresponde. No se debe confirmar `.env`, volcados SQL, credenciales ni el volumen de MySQL. Para respaldos use el procedimiento de `docs/development/backup-restore-media.md`.
