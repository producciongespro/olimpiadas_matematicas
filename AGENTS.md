# Reglas operativas del monorepo OLCOMEP

Estas instrucciones aplican a la vista pública, la vista administrativa, la API y la documentación del repositorio.

## Desarrollo guiado por especificaciones

- Antes de implementar una capacidad, revisar la especificación vigente en `specs/`.
- Leer `specs/estadoProyecto.md` al retomar el proyecto desde una nueva conversación o computadora.
- Si cambia una regla estable, actualizar primero o junto con el código su especificación, criterios de aceptación y tareas.
- Actualizar `specs/estadoProyecto.md` después de cambios relevantes en arquitectura, configuración, funcionalidades, verificaciones, despliegue o prioridades.
- Preservar `app/` como referencia heredada mientras continúa la reingeniería.
- No inventar contratos entre frontend y backend; documentarlos y mantenerlos sincronizados.

## Seguridad y datos

- No confirmar `.env`, credenciales, tokens, datos personales reales, archivos de `writable/` ni dependencias instaladas.
- No usar información real de estudiantes en pruebas, fixtures, ejemplos o documentación.
- Todo cambio de esquema se realiza mediante una migración nueva. No editar una migración que ya pudo ejecutarse en otro ambiente.
- Las rutas administrativas deben conservar autenticación y autorización; CORS no sustituye esos controles.

## Verificación por superficie

### Frontend React

- Ejecutar el build del workspace afectado.
- Revisar estados de carga, vacío, error y éxito cuando apliquen.
- Verificar al menos comportamiento móvil y escritorio para cambios visuales.
- Mantener textos visibles en español y revisar caracteres UTF-8.

### Backend CodeIgniter

- Ejecutar `composer --working-dir=apps/api test`.
- Si cambian rutas o payloads, actualizar el contrato y ejemplos relacionados.
- Si cambia el esquema, probar aplicación y reversión de las migraciones.
- No exponer trazas ni valores sensibles en respuestas JSON.

## Regla obligatoria y bloqueante para commits

Cuando la persona usuaria solicite crear un commit:

1. Leer completamente esta sección antes de ejecutar `git commit`.
2. Revisar `git status --short` y todos los cambios que se incluirán.
3. Preparar solo archivos de una intención coherente. No usar `git add .` cuando existan cambios de tareas distintas.
4. Revisar `git diff --cached --stat` y `git diff --cached --check`.
5. Usar exactamente este encabezado:

   ```text
   DD-MM-YYYY Descripción amplia en español
   ```

6. La fecha debe ser la fecha local actual de `America/Guatemala`, con dos dígitos para día y mes.
7. No anteponer `feat:`, `fix:`, `docs:`, `chore:` ni ningún otro prefijo.
8. No usar `git commit --no-verify` ni desactivar el hook.
9. Después del commit, ejecutar `git log -1 --pretty=%s` y comprobar el encabezado. Si no cumple y no fue publicado, corregirlo antes de informar éxito.

Ejemplo válido:

```text
04-09-2026 Configura el monorepo y documenta el modelo inicial de OLCOMEP
```

Ejemplos inválidos:

```text
feat: configura el monorepo
04/09/2026 Configura el monorepo
04-09-2026: Configura el monorepo
Configura el monorepo
```

El hook versionado `.githooks/commit-msg` aplica automáticamente el formato y la fecha del encabezado.

## Contenido recomendado del cuerpo

Cuando la iteración necesite trazabilidad adicional, usar:

```text
Alcance:
- Módulos o comportamientos modificados.

Evidencia:
- Especificación, tarea o necesidad atendida.

Verificación:
- Comandos ejecutados y resultados.

Notas:
- Riesgos o seguimientos pendientes.
```

No declarar una verificación que no se ejecutó. Si no fue posible ejecutarla, indicar la causa.
