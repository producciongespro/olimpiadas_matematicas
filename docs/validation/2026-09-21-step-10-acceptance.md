# Paso 10 — Prueba de aceptación de sincronización pública

Fecha: 21-09-2026.

## Resultado

La infraestructura automática y la vista pública cumplen las comprobaciones disponibles. El recorrido editorial real queda parcialmente bloqueado porque la administración no tiene una sesión MEP autorizada: muestra únicamente la pantalla “Acceso institucional”. No se usaron ni simularon credenciales.

| Paso | Estado | Evidencia |
| --- | --- | --- |
| 1. Abrir vista pública | Correcto | HTTP/UI local; árbol accesible completo. |
| 2. Cambiar sección en administración | Bloqueado | Requiere iniciar sesión con una identidad MEP autorizada. |
| 3. Guardar borrador sin cambio público | Correcto en suite | Pruebas de servicio confirman que el borrador no sustituye la publicación. Falta repetirlo con la sesión real. |
| 4. Publicar | Correcto en suite | Publicación transaccional y revisión anterior supersedida. Falta repetirlo con la sesión real. |
| 5. Actualización sin recarga | Correcto técnicamente | Revalidación por foco, visibilidad e intervalo con `ETag`; falta observar el cambio originado desde la sesión real. |
| 6. Imágenes nuevas | Correcto en suite/HTTP | UUID nuevo, privacidad en borrador y caché inmutable después de publicar. |
| 7. Desconectar API y conservar contenido | Pendiente manual | El hook conserva el último contenido válido, pero no se interrumpió el servicio compartido durante esta ejecución. |
| 8. Restaurar API y recuperar sincronización | Pendiente manual | Requiere completar el paso anterior y observar la recuperación. |
| 9. Móvil y escritorio | Correcto | 320, 768 y 1280 px sin desbordamiento ni controles pequeños. |

## Evidencia técnica

- `npm run build`: ambas SPA correctas.
- `composer --working-dir=apps/api test`: 36 pruebas y 116 aserciones correctas.
- `scripts/verify-spa-cache-policy.ps1`: política y bundles con hash correctos.
- `docs/validation/2026-09-21-step-10-responsive.md`: un `h1`, sin IDs duplicados, saltos de encabezado, destinos internos ausentes, controles sin nombre, imágenes sin `alt` ni enlaces externos inseguros.
- La revisión en 320, 768 y 1280 px no detectó desbordamiento horizontal ni objetivos interactivos pequeños.

## Condición para cerrar el paso 10

Iniciar sesión con una identidad MEP autorizada y ejecutar consecutivamente los pasos 2–5; después interrumpir y restaurar la API de forma controlada para completar los pasos 7–8. También permanecen como controles humanos previos a producción el lector de pantalla real y la auditoría especializada de contraste.
