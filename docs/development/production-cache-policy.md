# Política de caché de producción

## Alcance

La política separa recursos mutables de artefactos identificados por contenido:

| Recurso | Política |
| --- | --- |
| JSON editorial, carrusel y eventos | `public, max-age=0, must-revalidate`, `ETag` y respuesta `304` |
| Imágenes publicadas mediante UUID | `public, max-age=31536000, immutable` y `ETag` |
| `index.html` de ambas SPA | `no-cache, must-revalidate` |
| JavaScript y CSS compilados con hash | `public, max-age=31536000, immutable` |
| Activos públicos sin hash | `public, max-age=0, must-revalidate` |

## Apache

Cada workspace contiene `public/.htaccess`. Vite lo copia a la raíz de `dist`, por lo que la política acompaña el artefacto desplegable. La configuración requiere `mod_headers` y utiliza `mod_rewrite` para devolver `index.html` en rutas de la SPA que no correspondan a un archivo o directorio real.

El servidor o proxy frontal no debe sobrescribir estas cabeceras con una regla más amplia. Si un CDN se coloca delante de Apache, debe respetar `Cache-Control` y la clave de caché no debe ignorar la URL completa del recurso.

## Servidores distintos de Apache

La infraestructura debe reproducir exactamente la tabla anterior. No debe copiarse `.htaccess` como si configurara Nginx, IIS o un almacenamiento de objetos: en esos destinos las reglas equivalentes se definen en el servidor o CDN y se validan mediante solicitudes HTTP después del despliegue.

## Verificación

Después de compilar, ejecutar:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/verify-spa-cache-policy.ps1
```

En producción se debe repetir la comprobación contra las URLs públicas: `index.html` debe revalidarse y un archivo `assets/*-[hash].js` debe ser inmutable durante un año.
