# Paridad funcional de la vista pública

Fecha de verificación: 2026-09-04.

## Resultado

La nueva vista conserva el contenido y los recorridos funcionales del sitio heredado. La estructura visual se modernizó para React y responsive, sin trasladar defectos del HTML anterior.

| Área | Correspondencia en React | Estado |
| --- | --- | --- |
| Navegación | Encabezado, menú móvil y anclas a las secciones | Verificado |
| Galería | 15 fotografías organizadas en 5 grupos | Verificado |
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
- Las 154 referencias de imagen del legado incluían miniaturas repetidas de documentos. La nueva interfaz conserva las 15 fotografías y utiliza tarjetas textuales para los documentos, con mejores nombres accesibles.

## Evidencia

- El inventario de origen confirma que los recursos locales heredados existen.
- La auditoría automatizada verifica 320, 768 y 1280 px, destinos internos, encabezados, nombres accesibles, texto alternativo y seguridad de enlaces externos.
- La compilación de producción valida que todos los módulos y catálogos importados son resolubles.

La validación con lectores de pantalla reales y una herramienta especializada de contraste permanece como control humano previo a producción.
