# Sección editorial: Footer y créditos

## Objetivo

Administrar los textos institucionales, enlaces y créditos del cierre del sitio, conservando identidad visual y semántica.

## Campos editables

- nombre del programa y entidad institucional;
- enlaces institucionales ordenados con etiqueta y destino;
- grupos ordenados de créditos con título y líneas de nombres.

## Campos protegidos

- logotipos oficiales dentro del editor del Footer, composición responsive, elemento `footer` y enlace estructural de regreso al contenido; ambos logotipos provienen de «Identidad institucional»;
- estilos, iconografía y tratamiento seguro de enlaces externos.
- claves internas de enlaces y grupos de créditos, generadas al agregarlos y conservadas al editar textos o destinos.

## Validaciones y aceptación

- títulos, etiquetas y destinos obligatorios; destinos limitados a anclas, rutas internas o HTTP(S);
- claves únicas, nombres como texto plano y sin HTML;
- colecciones vacías muestran un estado explícito sin romper el footer;
- vista pública y previsualización reutilizan el mismo componente;
- borrador, publicación, autorización y auditoría siguen el contrato general.

## Contrato implementado

- Clave editorial `site-footer`; `program_name` y `organization` son textos obligatorios. `links_json` contiene enlaces `{key, label, href}` y `credits_json` grupos `{key, title, names}`.
- La API valida claves únicas por colección, enlaces sin credenciales y nombres en texto plano. Las listas pueden quedar vacías y la vista indica ese estado.
- El formulario no muestra ni permite modificar las claves internas; al agregar un enlace o grupo se genera una clave válida y única, y al editar se conserva la existente.
- Los créditos históricos se trasladan de Contacto al componente compartido `SiteFooter`, que conserva las marcas oficiales y el enlace estructural de regreso al contenido.

- Acciones administrativas: textos y enlaces con créditos se editan desde accesos separados y guardan un único borrador de la sección.
