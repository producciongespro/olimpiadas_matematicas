# Seguridad

Las rutas públicas declaran `security: []`. Todas las operaciones bajo `/admin` requieren un JWT RS256 de Microsoft Entra ID y una autorización local activa. La API valida emisor, tenant, audiencia, cliente autorizado, vigencia y scope; el filtro de rol aplica la jerarquía `master`, `admin` y `editor`.

CORS no sustituye autenticación ni autorización. No incluya tokens, secretos, datos personales, trazas ni archivos de entorno en ejemplos o incidencias. El portal `/docs` y sus rutas auxiliares solo se registran cuando `ENVIRONMENT` no es `production`.

La descarga documental usa una lista cerrada de nombres y `realpath`; no sirve rutas arbitrarias del sistema.
