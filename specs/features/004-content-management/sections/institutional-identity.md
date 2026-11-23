# Identidad institucional de OLCOMEP

## Alcance

Los logotipos de OLCOMEP y del MEP son recursos globales independientes de los textos de «Conoce OLCOMEP». OLCOMEP se usa en encabezado, pie e introducción públicos, copia editorial, acceso y cabecera de administración. El MEP se usa en encabezado y pie públicos, incluida la copia editorial. Ambos se administran por separado desde la misma opción.

## Campos y estados

- Editables solo por Master: archivo de reemplazo del logotipo OLCOMEP y archivo de reemplazo del logotipo MEP, independientes entre sí.
- Protegidos: nombres institucionales, ubicaciones, tamaños visuales y rutas internas de medios.
- Colecciones dinámicas: ninguna.
- Estados: una publicación conjunta de identidad y a lo sumo un borrador que puede cambiar uno o ambos logotipos. Los archivos estáticos actuales funcionan como respaldo cuando aún no hay medio publicado o falla la API.

## Validación y flujo

Cada archivo debe ser una imagen real JPEG, PNG o WebP de hasta 8 MB y dimensiones entre 256 y 6000 píxeles por lado. Se recomienda **1000 × 1000 píxeles** para OLCOMEP (cuadrado; archivo actual 690 × 690) y **2400 × 720 píxeles** para MEP (horizontal, relación aproximada 3,33:1; archivo actual 2531 × 754). La recomendación orienta la calidad visual; no recorta ni deforma las imágenes cargadas.

El formulario muestra vistas previas independientes. Guardar crea o reemplaza un único borrador conjunto sin modificar los logotipos públicos; el archivo no reemplazado conserva su versión vigente o la del borrador anterior. Publicar requiere confirmación y sustituye las URL globales correspondientes; el borrador solo puede verse con autenticación Master. Las URL de archivos publicados son versionadas e inmutables. Las URL anteriormente publicadas siguen disponibles para páginas abiertas durante la actualización; los borradores nunca publicados permanecen privados.

La opción «Identidad institucional» aparece solo a Master, separada de «Conoce OLCOMEP». Administrador y Editor reciben 403 en las rutas administrativas de esta identidad, aunque envíen solicitudes directas. La API pública entrega únicamente la identidad publicada.

## Criterios de aceptación

- Master puede cargar, revisar, guardar un borrador y publicar uno o ambos logotipos; antes de publicar, todas las vistas conservan los logotipos anteriores.
- Tras publicar, encabezado y pie usan las URL publicadas respectivas; introducción, acceso y cabecera administrativa usan la de OLCOMEP. Los respaldos locales funcionan ante ausencia de API.
- Administrador y Editor no ven la opción ni pueden consultar, guardar o publicar el borrador.
- Archivos inválidos muestran un error seguro y no alteran la publicación.
- Los dos logotipos y los textos de «Conoce OLCOMEP» permanecen independientes.
