# Respaldo, restauración y persistencia de medios

## Alcance

La recuperación de OLCOMEP requiere tratar como una sola unidad lógica:

- la base de datos de la API;
- `apps/api/writable/uploads`;
- la versión desplegada del código y sus migraciones.

La base conserva las rutas relativas y relaciones editoriales; los archivos no son recuperables únicamente a partir de un volcado SQL. Un respaldo parcial no se considera válido.

## Persistencia en producción

`apps/api/writable/uploads` debe residir en un volumen persistente ajeno al ciclo de reemplazo de la aplicación. El proceso PHP necesita lectura y escritura sobre ese volumen, pero el servidor web no debe publicarlo como directorio estático: los archivos se entregan mediante las rutas controladas de la API.

La ruta persistente debe conservar la estructura interna `carousel/`, `events/{event-uuid}/` y `sections/{section-key}/`. No se deben cambiar nombres internos ni rutas relativas durante un despliegue.

## Respaldo coordinado

1. Poner las operaciones administrativas de escritura en mantenimiento o detener temporalmente sus trabajadores.
2. Registrar la versión desplegada y el último lote de migraciones aplicado.
3. Crear un volcado consistente de MariaDB con estructura, datos, rutinas aplicables y codificación `utf8mb4`.
4. Copiar íntegramente `apps/api/writable/uploads`, preservando rutas relativas, fechas y permisos necesarios.
5. Generar y guardar inventarios con cantidad de archivos, tamaño total y suma SHA-256 de cada archivo.
6. Almacenar el volcado, los archivos y los inventarios dentro del mismo conjunto de respaldo cifrado.
7. Rehabilitar las escrituras y registrar el resultado de la operación.

La retención, ubicación externa, cifrado y responsables deben ser aprobados por la institución antes de producción. Los respaldos no se almacenan en Git.

## Restauración

1. Preparar una instancia aislada con la misma versión de código que originó el respaldo.
2. Restaurar la base en una base vacía con la codificación esperada.
3. Restaurar `writable/uploads` en el volumen persistente sin modificar las rutas relativas.
4. Verificar las sumas SHA-256 contra el inventario.
5. Ejecutar `php apps/api/spark migrate:status` y aplicar únicamente migraciones posteriores requeridas por la versión que se desplegará.
6. Ejecutar `composer --working-dir=apps/api test`.
7. Comprobar salud, carrusel, eventos, contenido publicado y entrega de una muestra de medios de cada dominio.
8. Validar desde ambas SPA antes de habilitar tráfico o escritura administrativa.

## Prueba periódica

La restauración debe ensayarse en un ambiente aislado antes de producción y después de cambios de esquema o almacenamiento. La evidencia debe registrar fecha, versión, cantidad de archivos, resultado de hashes, migraciones y verificaciones ejecutadas, sin incluir secretos ni datos personales.

En el entorno local puede repetirse el ensayo automatizado mediante:

```powershell
powershell -File scripts/verify-backup-restore.ps1
```

El script crea una base MariaDB temporal, restaura el volcado, compara tablas críticas y hashes de archivos y elimina los recursos temporales en su bloque de cierre. No debe ejecutarse contra un servidor de producción sin una ventana operativa y autorización explícita.

## Fallos que bloquean una restauración

- falta el volcado o el directorio de cargas;
- existen diferencias de hashes no explicadas;
- una ruta de `media_files.storage_path` escapa del volumen esperado;
- las migraciones no coinciden con la versión restaurada;
- una publicación vigente referencia un archivo ausente;
- las rutas públicas exponen un medio no publicado o una ruta interna.
