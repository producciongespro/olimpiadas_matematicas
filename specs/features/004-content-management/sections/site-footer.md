# Sección editorial: Footer y créditos

## Objetivo

Presentar los textos institucionales, enlaces y créditos del cierre del sitio como contenido fijo de solo lectura, conservando identidad visual y semántica.

## Datos visibles no editables

- nombre del programa y entidad institucional;
- enlaces institucionales ordenados con etiqueta y destino;
- grupos ordenados de créditos con título y líneas de nombres.

## Campos protegidos

- logotipos oficiales, composición responsive, elemento `footer` y enlace estructural de regreso al contenido; ambos logotipos provienen de «Identidad institucional»;
- estilos, iconografía y tratamiento seguro de enlaces externos.
- claves internas de enlaces y grupos de créditos ya publicados.
- la publicación vigente del Footer permanece como fuente de sus textos, enlaces y créditos; la administración no permite guardar borradores ni publicar cambios de esta sección.

## Validaciones y aceptación

- el contenido publicado conserva títulos, etiquetas, destinos y nombres como texto plano;
- `site-footer` se omite del catálogo editorial; su detalle administrativo informa borrador nulo y guardar o publicar devuelve HTTP 422;
- colecciones vacías muestran un estado explícito sin romper el footer;
- vista pública y previsualización reutilizan el mismo componente;
- la última publicación se conserva sin migración de datos ni cambios en su respuesta pública.
- la vista pública espera la primera respuesta de la API antes de mostrar los datos fijos del Footer; durante la espera muestra un estado de carga y, si falla sin datos confirmados, un estado de error, sin presentar la copia local antigua.

## Contrato implementado

- Clave editorial `site-footer`; `program_name` y `organization` son textos obligatorios. `links_json` contiene enlaces `{key, label, href}` y `credits_json` grupos `{key, title, names}`.
- Los datos publicados se leen desde la última revisión vigente. La administración no muestra controles de edición del Footer.
- Los créditos históricos se trasladan de Contacto al componente compartido `SiteFooter`, que conserva las marcas oficiales y el enlace estructural de regreso al contenido.
- En escritorio, marcas y datos institucionales, enlaces y créditos comparten una sola franja horizontal sin barra divisoria entre enlaces y créditos. En pantallas estrechas los bloques se acomodan en filas para conservar la lectura.
- Los grupos de créditos en dos columnas se apilan de forma independiente: el tercero comienza inmediatamente debajo del primero, sin esperar la altura del segundo. En móvil se conserva el orden editorial de los grupos.
- El rótulo visible «Créditos» se omite; el grupo mantiene su nombre accesible y comienza a la misma altura que los enlaces institucionales.
- En escritorio amplio, el Footer usa cuatro columnas: identidad institucional, primera columna de créditos, segunda columna de créditos y enlaces «Sitio oficial del MEP», «Conozca GESPRO» y «Volver al inicio» al extremo derecho. Los créditos tienen ancho suficiente para reducir los saltos de línea de sus títulos. En anchos intermedios y móviles, las áreas se reorganizan sin desbordamiento y conservan sus datos.

- La copia administrativa muestra el Footer para referencia visual, sin accesos de edición.
