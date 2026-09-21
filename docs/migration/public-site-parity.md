# Paridad funcional de la vista pública

Fecha de verificación inicial: 2026-09-04.

Revalidación del carrusel administrable: 2026-09-21.

## Resultado

La nueva vista conserva el contenido y los recorridos funcionales del sitio heredado. La estructura visual se modernizó para React y responsive, sin trasladar defectos del HTML anterior.

| Área | Correspondencia en React | Estado |
| --- | --- | --- |
| Navegación | Encabezado, menú móvil y anclas a las secciones | Verificado |
| Carrusel administrable | 15 fotografías publicadas por la API, en orden y con texto alternativo | Verificado |
| Galería histórica | Selector de eventos publicados; estado vacío mientras no existan eventos | Verificado |
| Presentación | Descripción y propósito de OLCOMEP | Verificado |
| Edición 2026 | Manual, temarios, reglamento, protocolo, inscripción individual y masiva, patrocinio y video | Verificado |
| Cuadernillos 2025 | 6 grados para estudiantes y 6 para docentes | Verificado |
| Histórico 2024–2016 | 85 archivos, consultables por año y rol | Verificado |
| Interactivos 2020–2022 | 27 actividades, enlazadas directamente a Genially | Verificado |
| Contacto y créditos | Correo, canal de YouTube, Calificame, responsables y GESPRO | Verificado |

## Decisiones de migración

- Los 155 enlaces del inventario heredado incluyen controles, anclas repetidas y recursos. No se exige una igualdad numérica en el DOM inicial porque los catálogos nuevos muestran el año y rol seleccionados para reducir densidad.
- Los enlaces acortados de Bitly se sustituyeron por sus 27 destinos finales de Genially para hacer visible el destino real.
- Los enlaces internos `#home` y `#menu1` usados como pestañas se sustituyeron por créditos visibles y semánticos.
- Los controles con destino `#`, el identificador duplicado `band` y las anclas del carrusel Bootstrap no se trasladaron; React gestiona esos estados sin URL falsa.
- La atribución a W3Schools no se conserva porque pertenecía a la plantilla Bootstrap retirada, no al contenido institucional.
- Las 154 referencias de imagen del legado incluían miniaturas repetidas de documentos. La nueva interfaz conserva las 15 fotografías mediante medios persistidos en la API y utiliza tarjetas textuales para los documentos, con mejores nombres accesibles.
- Las 15 copias de `public/assets/legacy/gallery` se retiraron después de comprobar que cada archivo publicado por la API conserva exactamente el mismo SHA-256. El seeder conserva como fuente de instalación los originales de `app/img`, dentro de la referencia heredada que el proyecto mantiene deliberadamente; esta limpieza no afecta `app/` ni los recursos históricos de cuadernillos y documentos.

## Evidencia

- El inventario de origen confirma que los recursos locales heredados existen.
- La auditoría automatizada verifica 320, 768 y 1280 px, destinos internos, encabezados, nombres accesibles, texto alternativo y seguridad de enlaces externos.
- La compilación de producción valida que todos los módulos y catálogos importados son resolubles.
- La revalidación del 21-09-2026 confirmó 15 diapositivas, 15 identificadores únicos, 15 textos alternativos, 15 URLs de medios controladas y coincidencia SHA-256 de los 15 binarios frente a las copias heredadas.
- La vista pública no referencia archivos de `assets/legacy/gallery`; carrusel y galería consumen exclusivamente sus endpoints públicos y revalidan mediante `ETag`.
- Una instalación nueva continúa importando las fotografías desde `app/img` hacia el almacenamiento administrado de la API; no depende de copias publicadas por la SPA.

La validación con lectores de pantalla reales y una herramienta especializada de contraste permanece como control humano previo a producción.
