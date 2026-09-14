# Criterios de aceptación

- El componente público de portada recibe contenido mediante propiedades y conserva el diseño actual con los valores de respaldo.
- La ausencia o caída de la API no deja vacía la portada pública.
- El contenido administrativo se guarda como borrador sin modificar la publicación vigente.
- Publicar sustituye la versión pública completa dentro de una transacción y conserva la revisión anterior.
- La API valida los campos obligatorios, las longitudes y los enlaces internos o HTTP(S).
- Una imagen nueva se valida y almacena bajo `writable/uploads/sections/hero`.
- La base relaciona la revisión con `media_files.id`; no almacena base64 ni rutas absolutas.
- La imagen solo es accesible públicamente cuando pertenece a una revisión publicada o a otro recurso público autorizado.
- La vista previa administrativa reutiliza el componente de portada y permite evaluar el borrador en ancho móvil y escritorio.
- Guardar y publicar tienen acciones, mensajes y estados claramente diferenciados.
- Las rutas administrativas conservan autenticación JWT, autorización por rol y auditoría.
- Los builds de ambas SPA, las pruebas de API y la aplicación/reversión de la nueva migración finalizan correctamente.
