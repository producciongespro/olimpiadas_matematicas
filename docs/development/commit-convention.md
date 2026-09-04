# Convención de commits

## Regla adoptada

El monorepo usa la misma regla bloqueante observada en los proyectos `diccionario-bribri-app` y `diccionario-bribri-api`:

```text
DD-MM-YYYY Descripción amplia en español
```

La fecha encabeza el mensaje, usa la fecha local del día y no lleva dos puntos. No se admiten prefijos de Conventional Commits antes de la fecha.

## Alcance del commit

Cada commit representa una intención verificable. Un cambio coordinado de contrato puede incluir frontend, backend, pruebas y especificación en un mismo commit; tareas independientes deben separarse.

### Cambios frontend

El cuerpo debe mencionar la aplicación afectada (`public-web`, `admin-web` o paquetes compartidos) y el build ejecutado.

### Cambios backend

El cuerpo debe mencionar rutas, servicios, repositorios, migraciones o seguridad afectados y el resultado de `composer test`.

### Cambios coordinados

Cuando una iteración cambia un contrato entre SPA y API, el mismo commit debe incluir la especificación y las pruebas de ambas superficies, o dejar documentada la secuencia de compatibilidad.

## Preparación

```bash
git status --short
git add <archivos de la iteración>
git diff --cached --stat
git diff --cached --check
```

No se incluyen secretos, `.env`, `vendor/`, `node_modules/`, datos personales ni archivos generados ajenos a la tarea.

## Validación posterior

```bash
git log -1 --pretty=%s
```

El encabezado real debe comenzar con la fecha actual en formato `DD-MM-YYYY` seguida de un espacio y una descripción no vacía.

## Activación del hook

Cada clon debe ejecutar una vez:

```bash
git config core.hooksPath .githooks
```

No se permite omitir la validación mediante `--no-verify`.
