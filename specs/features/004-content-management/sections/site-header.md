# Sección editorial: Header y navegación

## Objetivo

Administrar la identidad textual y los destinos de la navegación principal sin permitir alterar la estructura accesible del encabezado.

## Campos editables

- nombre accesible del enlace de inicio;
- lema institucional;
- elementos ordenados de navegación con clave, etiqueta y destino; el elemento `informacion` conserva su posición pero su etiqueta, destino y presencia son estructurales. `Acerca` se ubica después de `Galería` y antes de `Contacto` cuando esos enlaces existen.

## Campos protegidos

- logotipos oficiales, dimensiones, menú responsive, botón móvil y comportamiento de teclado;
- destino estructural `#contenido-principal` del salto e inicio;
- grupo `Información` con cuatro opciones estructurales: PDF del reglamento publicado en Edición vigente, `#edicion-vigente`, `#calendario` y `#preguntas-frecuentes`;
- estilos, jerarquía y nombres accesibles de los controles.

## Validaciones y aceptación

- etiquetas obligatorias y destinos limitados a anclas, rutas internas o HTTP(S);
- claves únicas y colecciones reordenables; al guardar y presentar, la API normaliza únicamente la posición de `Acerca` junto a `Galería` y `Contacto` sin cambiar etiquetas ni destinos;
- la navegación conserva obligatoriamente `Información`; la colección de enlaces adicionales puede quedar vacía;
- vista pública y previsualización reutilizan el mismo componente;
- borrador, publicación, autorización y auditoría siguen el contrato general.

## Contrato implementado

- Clave editorial `site-header`; `home_label` y `slogan` son textos obligatorios, `links_json` es una lista ordenada de `{key, label, href}`.
- La API rechaza claves repetidas, etiquetas vacías y destinos con credenciales. La respuesta pública entrega `links` como arreglo.
- El menú, su control responsive, los logotipos y `#contenido-principal` permanecen en el componente compartido `SiteHeader`.
- Si no hay enlaces adicionales, la identidad y el submenú de Información siguen disponibles.

## Submenú de Información

El elemento editorial de clave `informacion` se muestra como botón que abre y cierra un submenú. La API exige su presencia y normaliza su etiqueta a `Información` y su destino estructural a `#preguntas-frecuentes`; el administrador muestra esos campos de solo lectura e impide eliminar el elemento. Los destinos del submenú se controlan por código; Reglamento toma el PDF del documento de Edición vigente cuya clave o título identifica «Reglamento» y lo abre en pestaña nueva. Si ese documento no está publicado, se muestra una opción no accionable. El submenú se abre por clic o teclado, comunica `aria-expanded`, cierra con Escape y devuelve el foco al botón; seleccionar un destino cierra tanto el submenú como el menú móvil.

«Cómo participar» conduce directamente a la sección `#edicion-vigente`, donde se informa el estado de inscripción y se muestran los documentos de la edición. No existe una tarjeta intermedia en Información general.

«Reglamento» abre directamente el PDF de la edición publicada. No existe una tarjeta intermedia en Información general; reemplazar el PDF desde administración actualiza el destino al publicar la revisión de Edición vigente.

`Calendario` deja de ser un enlace principal independiente. La API rechaza su clave o un enlace con destino `#calendario` en nuevos borradores de Header. El cliente filtra ambos casos en publicaciones anteriores y el componente compartido aplica la misma protección al dibujar el menú. Al leer revisiones previas, el cliente también normaliza el texto y destino de `informacion` y restituye el grupo si faltara.
