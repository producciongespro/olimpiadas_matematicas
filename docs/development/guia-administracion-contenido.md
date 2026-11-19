# Administración de contenido: borradores y publicación

Estado documentado: 19-11-2026. Esta guía describe el funcionamiento actual de **Contenido del sitio**. Las reglas contractuales están en `specs/features/004-content-management/` y las rutas de la API en `apps/api/app/Docs/api/openapi-v1.yaml`.

## Qué se ve al editar

La administración muestra una copia de la página pública con acciones de edición junto a cada sección. Una acción abre solo los campos relacionados, por ejemplo, textos, nombres de botones, imágenes o colecciones. Cada sección mantiene **un único borrador completo**: editar textos y luego botones de la misma sección no crea publicaciones independientes.

El estado **Cambios sin guardar** significa que hay modificaciones locales en el navegador. Todavía no se han enviado a la API. La vista previa administrativa puede mostrar esos cambios, aunque el público sigue viendo la publicación anterior.

## Guardar sin publicar

1. Abra una acción de edición y haga los cambios.
2. Pulse **Guardar borrador**. La API valida y guarda una nueva revisión `draft` de la sección; si ya había un borrador, la nueva revisión lo sustituye. Los archivos nuevos quedan relacionados con esa revisión.
3. El editor permanece abierto y muestra que el borrador está guardado. **Publicar** queda habilitado si no hay otros cambios locales.
4. Puede pulsar **Cerrar** y volver otro día. Al abrir de nuevo la sección, la administración carga primero el borrador guardado.

**Guardar borrador no cambia la página pública.** La API pública entrega únicamente la revisión `published`. Los archivos exclusivos del borrador tampoco se entregan de forma anónima; la administración puede consultarlos con autenticación.

En **Editar cuadernillos**, la imagen decorativa de cada material es opcional. Se puede cargar o reemplazar con JPEG, PNG o WebP, o retirar con **Retirar imagen**. El editor no pide una ruta: la API crea el vínculo al guardar. Las imágenes históricas incluidas en el sitio se conservan al guardar si no se selecciona una nueva ni se retiran. Este cambio también permanece como borrador hasta publicar.

Si modifica algo después de guardar, vuelve a aparecer **Cambios sin guardar** y **Publicar** se deshabilita. Guarde nuevamente para publicar exactamente la versión terminada. Si intenta cerrar con cambios locales, el editor pide confirmar si desea descartarlos. Cerrar un borrador ya guardado no lo elimina.

## Publicar

1. Revise el borrador y pulse **Publicar**.
2. Confirme la publicación. La API cambia la revisión `draft` a `published` y conserva la publicación anterior en el historial como `superseded`.
3. La página pública obtiene la nueva versión desde `GET /api/v1/site/home`. Una pestaña pública abierta revalida el contenido al recuperar el foco y periódicamente mientras está visible, por lo que la actualización puede tardar hasta la próxima consulta. Una página recién abierta consulta la versión publicada al cargar.

La publicación afecta **la sección completa**, aunque la acción abierta mostrara solo algunos campos. Por eso el administrador conserva en un mismo borrador los cambios hechos desde las distintas acciones de esa sección. Si falla la publicación, la versión pública anterior sigue vigente.

## Ejemplo

La edición 2026 ya está publicada. Una persona cambia un texto de esa sección el lunes y pulsa **Guardar borrador**. El público continúa viendo la edición publicada. El miércoles vuelve a administración, abre la misma sección, completa los cambios y guarda otra vez. Solo cuando pulsa **Publicar** y confirma, la página pública comienza a mostrar la nueva versión.

## Alcance de esta regla

Este flujo de revisión por sección corresponde a **Contenido del sitio**. El carrusel, la galería de eventos y los usuarios tienen controles y operaciones propios dentro de la administración; sus reglas se especifican por separado.
