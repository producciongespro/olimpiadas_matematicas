# Integración frontend

La vista pública usa únicamente rutas sin autenticación y conserva contenido local o el último contenido válido cuando la API no está disponible. Las colecciones editoriales se revalidan con `If-None-Match`; una respuesta `304` conserva el estado actual.

La administración obtiene un access token de Microsoft Entra ID y lo envía como `Authorization: Bearer <token>`. Guardar crea o reemplaza el borrador; solo publicar cambia la respuesta pública. Los formularios con imágenes o documentos usan `multipart/form-data`.

El manual anual del calendario se envía en el campo `manual` como PDF de hasta 16 MB. Su destino no forma parte de los campos editables: la API devuelve `manual_uuid`, `manual_href`, `manual_name` y `manual_size`. La vista previa administrativa obtiene el borrador por la ruta autenticada; la vista pública abre el PDF normalmente y agrega `?download=1` cuando debe solicitarlo como adjunto descargable.

Las fotografías de contactos regionales usan la clave estable del contacto. El archivo se envía como `photo_{key}` y `remove_photo: true` dentro de `regions_json` retira la relación en el nuevo borrador. Si no hay fotografía publicada, la interfaz muestra una silueta local.

Los medios exclusivos de borradores se previsualizan mediante `GET /admin/media/{uuid}` usando el token administrativo y una URL de objeto local. Esa respuesta usa `private, no-store`; el medio solo pasa a `/media/{uuid}` cuando su revisión es publicada.

Los errores JSON exponen `message` y no deben interpretarse como una estructura de depuración. Las aplicaciones deben distinguir carga, vacío, error y éxito.
