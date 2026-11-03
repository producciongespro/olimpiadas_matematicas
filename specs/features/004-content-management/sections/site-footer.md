# Sección editorial: Footer y créditos

## Objetivo

Administrar los textos institucionales, enlaces y créditos del cierre del sitio, conservando identidad visual y semántica.

## Campos editables

- nombre del programa y entidad institucional;
- enlaces institucionales ordenados con clave, etiqueta y destino;
- grupos ordenados de créditos con título y líneas de nombres.

## Campos protegidos

- logotipos oficiales, composición responsive, elemento `footer` y enlace estructural de regreso al contenido;
- estilos, iconografía y tratamiento seguro de enlaces externos.

## Validaciones y aceptación

- títulos, etiquetas y destinos obligatorios; destinos limitados a anclas, rutas internas o HTTP(S);
- claves únicas, nombres como texto plano y sin HTML;
- colecciones vacías muestran un estado explícito sin romper el footer;
- vista pública y previsualización reutilizan el mismo componente;
- borrador, publicación, autorización y auditoría siguen el contrato general.

## Contrato implementado

- Clave editorial `site-footer`; `program_name` y `organization` son textos obligatorios. `links_json` contiene enlaces `{key, label, href}` y `credits_json` grupos `{key, title, names}`.
- La API valida claves únicas por colección, enlaces sin credenciales y nombres en texto plano. Las listas pueden quedar vacías y la vista indica ese estado.
- Los créditos históricos se trasladan de Contacto al componente compartido `SiteFooter`, que conserva las marcas oficiales y el enlace estructural de regreso al contenido.
