# Sección editorial: Contacto

## Objetivo

Permitir que el equipo autorizado mantenga la información institucional de contacto y los recursos relacionados sin habilitar HTML libre ni modificar la composición, los estilos o el ancla `#contacto`.

## Campos editables

- antetítulo;
- título;
- texto introductorio;
- nombre de la persona o unidad de contacto;
- cargo o descripción funcional;
- teléfonos como colección ordenada;
- correos institucionales como colección ordenada;
- recursos adicionales como colección ordenada con título, descripción y destino.

## Campos protegidos

- ancla `#contacto`;
- jerarquía de encabezados y composición visual;
- iconografía y estilos;
- etiqueta y estructura de créditos del sitio original;
- protocolo `mailto:` o `tel:` generado a partir de valores validados.

## Validaciones

- antetítulo, título, texto introductorio, nombre o unidad y descripción funcional son obligatorios;
- los teléfonos se normalizan para el enlace `tel:` y conservan una representación visible legible;
- los correos no vacíos deben ser válidos y se normalizan en minúsculas;
- los destinos de recursos aceptan únicamente rutas internas o HTTP(S);
- título y destino son obligatorios para cada recurso;
- no se admite HTML, JavaScript, URLs con credenciales ni esquemas distintos de los permitidos;
- el payload completo conserva los límites generales del gestor editorial.

## Estados y comportamiento

- la sección tiene borrador, publicación vigente e historial independiente;
- guardar un borrador no modifica la información pública;
- publicar sustituye la revisión completa dentro de una transacción;
- la vista pública conserva el contenido local confirmado como respaldo cuando la API no responde;
- las colecciones vacías muestran un estado explícito y no rompen la composición;
- la vista previa administrativa reutiliza el componente público en ancho móvil y escritorio.

## Criterios de aceptación

- la administración permite editar los campos y reordenar, agregar o eliminar teléfonos, correos y recursos;
- los valores inválidos se rechazan con mensajes asociados al campo;
- los enlaces telefónicos, de correo y de recursos se generan únicamente después de validar y normalizar sus valores;
- guardar y publicar son acciones claramente diferenciadas;
- la vista pública y la vista previa reutilizan el mismo componente;
- las rutas administrativas conservan JWT, roles y auditoría;
- las pruebas de API cubren validación, borrador, publicación y colecciones vacías;
- los builds de ambas SPA y las pruebas de API finalizan correctamente.

## Fuera de alcance

- formularios públicos de contacto;
- envío de correo desde la API;
- edición de créditos, identidad visual o estructura del footer;
- almacenamiento de mensajes o datos personales de visitantes.
