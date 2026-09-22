# Calendario (`calendar`)

- Editables: encabezado, avisos, nota final, texto del botón del manual, archivo PDF anual y actividades.
- Cada actividad contiene fecha visible, fecha ISO inicial, fecha ISO final opcional, título, descripción y destaque.
- Colección dinámica: agregar, editar, eliminar y reordenar sin máximo funcional fijo; se protege el tamaño total del payload.
- Puede publicarse vacío y debe mostrar un estado público explícito.
- El manual acepta únicamente un PDF real de hasta 16 MB. Cargar uno nuevo crea un UUID y conserva el archivo vigente cuando no se selecciona reemplazo.
- El PDF exclusivo del borrador solo se abre mediante la ruta administrativa autenticada y `private, no-store`; no queda disponible en la ruta pública antes de publicar.
- Al publicar, la vista pública ofrece acciones separadas para abrir y descargar el PDF. Si todavía no existe un archivo administrado, conserva el manual institucional incluido en el código como respaldo.
- Protegidos: destino y metadatos del manual, diseño de cronología, iconos, numeración y ancla `#calendario`.
