# Inicialización local de MariaDB

Fecha de verificación: 08-09-2026.

## Entorno verificado

- Motor: MariaDB 10.4.32 de XAMPP.
- Base: `olcomep`.
- Juego de caracteres: `utf8mb4`.
- Intercalación: `utf8mb4_unicode_ci`.

## Procedimiento

Con la conexión local definida en `apps/api/.env.development`:

```bash
php spark migrate --all
php spark db:seed OlcomepInitialSeeder
php spark migrate:status
```

El seeder puede ejecutarse nuevamente. Sincroniza la edición por año, sin duplicar registros. No importa direcciones regionales ni datos de inscripción.

## Evidencia

| Comprobación | Resultado |
| --- | ---: |
| Migraciones aplicadas | 5 |
| Tablas funcionales y de auditoría | 8 |
| Direcciones regionales cargadas | 0 |
| Ediciones 2026 | 1 |
| Llaves foráneas de inscripción | 4 |
| Columnas de identificación en texto plano | 0 |

La reversión del primer lote eliminó las ocho tablas y la reaplicación restauró el esquema y la edición inicial. Esta prueba se realizó antes de introducir datos operativos.

## Advertencias

- No ejecutar `migrate:rollback` en un ambiente con datos operativos sin respaldo y autorización.
- No confirmar `apps/api/.env.development`, `apps/api/.env.production` ni contraseñas en Git.
- En producción se debe usar un usuario de base con privilegios mínimos; `root` corresponde únicamente al entorno local actual.
