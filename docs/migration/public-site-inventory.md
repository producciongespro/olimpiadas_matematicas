# Inventario automatizado del sitio público heredado

> Generado por `php scripts/audit-legacy-public.php` a partir de `app/index.html`. No comprueba la disponibilidad en Internet de enlaces externos.

## Resumen

| Elemento | Cantidad |
| --- | ---: |
| Encabezados | 24 |
| Identificadores únicos | 23 |
| Enlaces | 155 |
| Imágenes referenciadas | 154 |
| Enlaces locales faltantes | 0 |
| Imágenes faltantes | 0 |
| Imágenes sin texto alternativo útil | 16 |
| Enlaces con `target=_blank` sin `rel=noopener` | 131 |

## Matriz inicial de migración

| Bloque | Fuente heredada | Destino propuesto | Prioridad | Estado | Verificación |
| --- | --- | --- | --- | --- | --- |
| Navegación principal | `nav` y anclas | `components/SiteHeader.jsx` | Alta | Verificado | Teclado, móvil y destinos válidos |
| Galería fotográfica | `#carousel-fotos` | `features/gallery/PhotoGallery.jsx` | Alta | Verificado | 15 fotografías, controles, alt y movimiento reducido |
| Presentación OLCOMEP | `#olimpiadas` | `features/about/AboutSection.jsx` | Alta | Verificado | Contenido y jerarquía semántica |
| Edición vigente | Descargas e inscripción 2026 | `features/current-edition/` | Alta | Verificado | Documentos, inscripción y video preservados |
| Cuadernillos 2025–2016 | Secciones por año | `features/booklets/` | Alta | Verificado | 12 cuadernillos 2025 y 85 recursos históricos |
| Cuadernillos interactivos | Secciones 2020–2022 | `features/interactive-booklets/` | Media | Verificado | 27 destinos finales de Genially |
| Contacto y créditos | `#contact` y `footer` | `features/contact/` y `components/SiteFooter.jsx` | Media | Verificado | Datos, enlaces y semántica |

## Jerarquía de encabezados observada

| Nivel | Texto |
| --- | --- |
| `h4` | ESTE AÑO EL CENTRO CULTURAL PATROCINA TU ESFUERZO |
| `h4` | DESCARGAS |
| `h4` | Niveles de Participación |
| `h3` | Colección de los Cuadernillos |
| `h3` | Cuadernillos 2025 |
| `h4` | Estudiantes |
| `h4` | Docentes |
| `h3` | Cuadernillos 2024 |
| `h3` | Cuadernillos 2023 |
| `h3` | Cuadernillos 2022 |
| `h3` | Cuadernillos 2022 Interactivo |
| `h3` | Cuadernillos 2021 |
| `h3` | Cuadernillos 2021 Interactivo |
| `h3` | Cuadernillos 2020 |
| `h3` | Cuadernillos 2020 Interactivo |
| `h3` | Cuadernillos 2019 |
| `h3` | Cuadernillos 2018 |
| `h3` | Cuadernillos 2017 |
| `h3` | Cuadernillos 2016 |
| `h3` | Contáctenos |
| `h3` | Desarrolladores |
| `h2` | Yeri Charpentier Díaz |
| `h2` | GESPRO: Gestión y Producción de Recursos Tecnológicos |
| `h2` | Diseño Gráfico |

## Recursos locales por tipo

| Extensión | Archivos |
| --- | ---: |
| `docx` | 5 |
| `jpg` | 4 |
| `pdf` | 122 |
| `xlsx` | 3 |
| `zip` | 2 |

## Recursos locales por año

| Año | Archivos |
| --- | ---: |
| 2016 | 1 |
| 2017 | 6 |
| 2018 | 14 |
| 2019 | 15 |
| 2020 | 19 |
| 2021 | 12 |
| 2022 | 13 |
| 2023 | 15 |
| 2024 | 11 |
| 2025 | 22 |
| 2026 | 3 |

## Hallazgos que condicionan la migración

- **Alta — jerarquía:** no se encontró un `h1`; la nueva vista debe tener un título principal único y mantener el orden de niveles.
- **Alta — identificadores duplicados:** `band` aparece repetido y no puede trasladarse sin normalización.
- **Verificado — recursos locales:** todos los enlaces a archivos y todas las imágenes referenciadas existen en el repositorio.
- **Alta — texto alternativo:** 16 imágenes carecen de una alternativa útil.
- **Media — enlaces externos:** 131 enlaces abren otra pestaña sin la protección `noopener`.
- **Media — arquitectura:** el menú concentra muchos años en una sola navegación; la nueva vista debe conservar el acceso sin repetir toda la densidad en el encabezado.

## Enlaces locales o anclas con destino ausente

No se detectaron destinos locales ausentes.

## Imágenes con referencia ausente

No se detectaron imágenes locales ausentes.

## Inventario de enlaces

| Nombre | Destino | Tipo | Comprobación local |
| --- | --- | --- | --- |
| (sin nombre accesible) | `#` | Ancla | Destino presente |
| OLIMPIADAS | `#olimpiadas` | Ancla | Destino presente |
| CUADERNILLOS-AÑOS ANTERIORES | `#` | Ancla | Destino presente |
| CUADERNILLOS-2024 | `#cuadernillos-2024` | Ancla | Destino presente |
| CUADERNILLOS-2023 | `#cuadernillos-2023` | Ancla | Destino presente |
| CUADERNILLOS-2022 | `#cuadernillos-2022` | Ancla | Destino presente |
| CUADERNILLOS-2022-Interactivos | `#cuadernillos-2022-Interactivos` | Ancla | Destino presente |
| CUADERNILLOS-2021 | `#cuadernillos-2021` | Ancla | Destino presente |
| CUADERNILLOS-2021-Interactivos | `#cuadernillos-2021-Interactivos` | Ancla | Destino presente |
| CUADERNILLOS-2020 | `#cuadernillos-2020` | Ancla | Destino presente |
| CUADERNILLOS-2020-Interactivos | `#cuadernillos-2020-Interactivo` | Ancla | Destino presente |
| CUADERNILLOS-2019 | `#cuadernillos-2019` | Ancla | Destino presente |
| CUADERNILLOS-2018 | `#cuadernillos-2018` | Ancla | Destino presente |
| CUADERNILLOS-2017 | `#cuadernillos-2017` | Ancla | Destino presente |
| CUADERNILLOS-2016 | `#cuadernillos-2016` | Ancla | Destino presente |
| CUADERNILLOS-2025 | `#cuadernillos-2025` | Ancla | Destino presente |
| CONTACTO | `#contact` | Ancla | Destino presente |
| Imagen para calificar este curso | `https://recursos.mep.go.cr/0_calificame/app/index.html?id_app=15` | Externo | No aplica |
| Anterior | `#carousel-fotos` | Ancla | Destino presente |
| Siguiente | `#carousel-fotos` | Ancla | Destino presente |
| Ver acá video de promoción | `https://www.youtube.com/watch?v=3kaI2PLOzG0` | Externo | No aplica |
| Imagen icono Olimpiadas 2026 | `data/2026/manual-OLCOMEP-primaria-2026.pdf` | Local | Existe |
| Imagen temario | `data/2025/temarios.zip` | Local | Existe |
| Imagen Reglamento | `data/2026/reglamento-OLCOMEP-2026.pdf` | Local | Existe |
| Imagen Reglamento | `data/2024/protocolo-2024.pdf` | Local | Existe |
| Inscripción OLCOMEP 2026 (Únicamente del 08 de abril al 06 de mayo del 2026) | `https://forms.gle/QStuNgoiQCtoDMfD9` | Externo | No aplica |
| Inscripción Masiva - OLCOMEP 2026 | `data/2026/Inscripcion-masiva-OLCOMEP-2026.xlsx` | Local | Existe |
| sectores | `https://www.youtube.com/channel/UCb1Mihv34LjcEzjicn76Omw` | Externo | No aplica |
| Cuadernillos primero | `./data/2025/cuadernillos/cuadernillo_mateamtica_1ero_2025-ESTUDIANTE.pdf` | Local | Existe |
| Cuadernillos segundo | `./data/2025/cuadernillos/cuadernillo_mateamtica_2do_2025-ESTUDIANTE.pdf` | Local | Existe |
| Cuadernillos tercero | `./data/2025/cuadernillos/cuadernillo_mateamtica_3ero_2025-ESTUDIANTE.pdf` | Local | Existe |
| Cuadernillos cuarto | `./data/2025/cuadernillos/cuadernillo_mateamtica_4to_2025-ESTUDIANTE.pdf` | Local | Existe |
| Cuadernillos quinto | `./data/2025/cuadernillos/cuadernillo_mateamtica_5to_2025-ESTUDIANTE.pdf` | Local | Existe |
| Cuadernillos sexto | `./data/2025/cuadernillos/cuadernillo_mateamtica_6to_2025-ESTUDIANTE.pdf` | Local | Existe |
| Cuadernillo para el docente | `./data/2025/cuadernillos/cuadernillo_mateamtica_1ero_2025-DOCENTE.pdf` | Local | Existe |
| Cuadernillo para el docente | `./data/2025/cuadernillos/cuadernillo_mateamtica_2do_2025-DOCENTE.pdf` | Local | Existe |
| Cuadernillo para el docente | `./data/2025/cuadernillos/cuadernillo_mateamtica_3ero_2025-DOCENTE.pdf` | Local | Existe |
| Cuadernillo para el docente | `./data/2025/cuadernillos/cuadernillo_mateamtica_4to_2025-DOCENTE.pdf` | Local | Existe |
| Cuadernillo para el docente | `./data/2025/cuadernillos/cuadernillo_mateamtica_5to_2025-DOCENTE.pdf` | Local | Existe |
| Cuadernillo para el docente | `./data/2025/cuadernillos/cuadernillo_mateamtica_6to_2025-DOCENTE.pdf` | Local | Existe |
| Cuadernillos | `data/2024/cuadernillo_estudiante_1er.grado.pdf` | Local | Existe |
| Cuadernillos | `data/2024/cuadernillo_estudiante_2er.grado.pdf` | Local | Existe |
| Cuadernillos | `data/2024/cuadernillo_estudiante_3er.grado.pdf` | Local | Existe |
| Cuadernillos | `data/2024/cuadernillo_estudiante_4er.grado.pdf` | Local | Existe |
| Cuadernillos | `data/2024/cuadernillo_estudiante_5er.grado.pdf` | Local | Existe |
| Cuadernillos | `data/2024/cuadernillo_estudiante_6er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 1 -2022 | `data/2023/cuadernillo_estudiante_1er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 1 -2022 | `data/2023/cuadernillo_docente_1er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 2 -2022 | `data/2023/cuadernillo_estudiante_2er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 2 -2022 | `data/2023/cuadernillo_docente_2er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 3 -2022 | `data/2023/cuadernillo_estudiante_3er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 3 -2022 | `data/2023/cuadernillo_docente_3er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 4 -2022 | `data/2023/cuadernillo_estudiante_4to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 4 -2022 | `data/2023/cuadernillo_docente_4to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 5 -2022 | `data/2023/cuadernillo_estudiante_5to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 5 -2022 | `data/2023/cuadernillo_docente_5to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 6 -2022 | `data/2023/cuadernillo_estudiante_6to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 6 -2022 | `data/2023/cuadernillo_docente_6to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 1 -2022 | `data/2022/cuadernillo_estudiante_1er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 1 -2022 | `data/2022/cuadernillo_docente_1er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 2 -2022 | `data/2022/cuadernillo_estudiante_2er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 2 -2022 | `data/2022/cuadernillo_docente_2er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 3 -2022 | `data/2022/cuadernillo_estudiante_3er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 3 -2022 | `data/2022/cuadernillo_docente_3er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 4 -2022 | `data/2022/cuadernillo_estudiante_4to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 4 -2022 | `data/2022/cuadernillo_docente_4to.grado-2.pdf` | Local | Existe |
| Imagen Cuadernillos est 5 -2022 | `data/2022/cuadernillo_estudiante_5to.grado-2.pdf` | Local | Existe |
| Imagen Cuadernillos doc 5 -2022 | `data/2022/cuadernillo_docente_5to.grado-2.pdf` | Local | Existe |
| Imagen Cuadernillos est 6 -2022 | `data/2022/cuadernillo_estudiante_6to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 6 -2022 | `data/2022/cuadernillo_docente_6to.grado-2.pdf` | Local | Existe |
| Imagen Interactivo-2022 1a | `https://bit.ly/3m50d94` | Externo | No aplica |
| Imagen Interactivo-2022 2a | `https://bit.ly/3nzKEXF` | Externo | No aplica |
| Imagen Interactivo-2022 2b | `https://bit.ly/3lXePrb` | Externo | No aplica |
| Imagen Interactivo-2022 3a | `https://bit.ly/40yfBKd` | Externo | No aplica |
| Imagen Interactivo-2022 3b | `https://bit.ly/4190ZRF` | Externo | No aplica |
| Imagen Interactivo-2022 4a | `https://bit.ly/3nD4IZ5` | Externo | No aplica |
| Imagen Interactivo-2022 4b | `https://bit.ly/3zFNf5b` | Externo | No aplica |
| Imagen Interactivo-2022 5a | `https://bit.ly/40y2icE` | Externo | No aplica |
| Imagen Interactivo-2022 5b | `https://bit.ly/3Ko6Uws` | Externo | No aplica |
| Imagen Cuadernillos est 1 -2021 | `data/2021/cuadernillo_estudiante_1er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 1 -2021 | `data/2021/cuadernillo_docente_1er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 2 -2021 | `data/2021/cuadernillo_estudiante_2do.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 2 -2021 | `data/2021/cuadernillo_docente_2do.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 3 -2021 | `data/2021/cuadernillo_estudiante_3er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 3 -2021 | `data/2021/cuadernillo_docente_3er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 4 -2021 | `data/2021/cuadernillo_estudiante_4to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 4 -2021 | `data/2021/cuadernillo_docente_4to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 5 -2021 | `data/2021/cuadernillo_estudiante_5to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 5 -2021 | `data/2021/cuadernillo_docente_5to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 6 -2021 | `data/2021/cuadernillo_estudiante_6to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 6 -2021 | `data/2021/cuadernillo_docente_6to.grado.pdf` | Local | Existe |
| Imagen Interactivo-2021 3a | `https://view.genial.ly/6127a4c98e89e10d404671c5/interactive-content-cuadernillo-1a` | Externo | No aplica |
| Imagen Interactivo-2021 3b | `https://view.genial.ly/6143ca1ca6d4510d84e24aaa/interactive-content-copia-cuadernillo-1b` | Externo | No aplica |
| Imagen Interactivo-2021 2a | `https://view.genial.ly/61343566c9f49f0d6e515b83/interactive-content-segundo-ano-a` | Externo | No aplica |
| Imagen Interactivo-2021 2b | `https://view.genial.ly/61490dda8271660d8410d216/interactive-content-segundo-ano-b` | Externo | No aplica |
| Imagen Interactivo-2021 3a | `https://view.genial.ly/6131609c0596190d611b8372/presentation-practica-de-cuadernillo-tercero-olcomep` | Externo | No aplica |
| Imagen Interactivo-2021 3b | `https://view.genial.ly/612a75e255b8400d4c7028fe/interactive-content-problemas-de-repaso-y-practica-olcomep` | Externo | No aplica |
| Imagen Interactivo-2021 4a | `https://view.genial.ly/612e77b648aac90d8946a4bb/interactive-content-quiz-genial` | Externo | No aplica |
| Imagen Interactivo-2021 4b | `https://view.genial.ly/614cca594691c70d429b46f9/presentation-practica-cuadernillo-4-ano` | Externo | No aplica |
| Imagen Interactivo-2021 5a | `https://view.genial.ly/6134e42608de150d59895ab7/interactive-content-quinto-ano-a` | Externo | No aplica |
| Imagen Interactivo-2021 5b | `https://view.genial.ly/61491b7e270ddb0dbb1f8b4e/interactive-content-quinto-ano-b` | Externo | No aplica |
| Imagen Interactivo-2021 6a | `https://view.genial.ly/613bc8598c0fd10d5c8a687b/presentation-practica-sexto-ano` | Externo | No aplica |
| Imagen Interactivo-2021 6b | `https://view.genial.ly/61363c09ba9d630d9ce767f0/interactive-content-cuadernillo-6b` | Externo | No aplica |
| Imagen Cuadernillos est 1 -2020 | `data/2020/Cuadernillo_estudiante_1er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 1 -2020 | `data/2020/Cuadernillo_docente_1er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 2 -2020 | `data/2020/Cuadernillo_estudiante_2do.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 2 -2020 | `data/2020/Cuadernillo_docente_2do.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 3 -2020 | `data/2020/Cuadernillo_estudiante_3er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 3 -2020 | `data/2020/Cuadernillo_docente_3er.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 4 -2020 | `data/2020/Cuadernillo_estudiante_4to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 4 -2020 | `data/2020/Cuadernillo_docente_4to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 5 -2020 | `data/2020/Cuadernillo_estudiante_5to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 5 -2020 | `data/2020/Cuadernillo_docente_5to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos est 6 -2020 | `data/2020/Cuadernillo_estudiante_6to.grado.pdf` | Local | Existe |
| Imagen Cuadernillos doc 6 -2020 | `data/2020/Cuadernillo_docente_6to.grado.pdf` | Local | Existe |
| Imagen 1 año I parte | `https://bit.ly/3Cnqyn6` | Externo | No aplica |
| Imagen 2 año I parte | `https://bit.ly/3MIH1qV` | Externo | No aplica |
| Imagen 2 año II parte | `https://bit.ly/3SXugux` | Externo | No aplica |
| Imagen 3 año I parte | `https://bit.ly/3RSmalO` | Externo | No aplica |
| Imagen 3 año II parte | `https://bit.ly/3Vp4a5v` | Externo | No aplica |
| Imagen Cuadernillos est 1 -2019 | `data/2019/cuadernillo-est-1-2019.pdf` | Local | Existe |
| Imagen Cuadernillos doc 1 -2019 | `data/2019/cuadernillo-doc-1-2019.pdf` | Local | Existe |
| Imagen Cuadernillos est 2 -2019 | `data/2019/cuadernillo-est-2-2019.pdf` | Local | Existe |
| Imagen Cuadernillos doc 2 -2019 | `data/2019/cuadernillo-doc-2-2019.pdf` | Local | Existe |
| Imagen Cuadernillos est 3 -2019 | `data/2019/cuadernillo-est-3-2019.pdf` | Local | Existe |
| Imagen Cuadernillos doc 3 -2019 | `data/2019/cuadernillo-doc-3-2019.pdf` | Local | Existe |
| Imagen Cuadernillos est 4 -2019 | `data/2019/cuadernillo-est-4-2019.pdf` | Local | Existe |
| Imagen Cuadernillos doc 4 -2019 | `data/2019/cuadernillo-doc-4-2019.pdf` | Local | Existe |
| Imagen Cuadernillos est 5 -2019 | `data/2019/cuadernillo-est-5-2019.pdf` | Local | Existe |
| Imagen Cuadernillos doc 5 -2019 | `data\2019\cuadernillo-doc-5-2019.pdf` | Local | Existe |
| Imagen Cuadernillos est 6 -2019 | `data\2019\cuadernillo-est-6-2019.pdf` | Local | Existe |
| Imagen Cuadernillos doc 6 -2019 | `data\2019\cuadernillo-doc-6-2019.pdf` | Local | Existe |
| Imagen Cuadernillos est 1 -2018 | `data/2018/cuadernillo-est-1-2018.pdf` | Local | Existe |
| Imagen Cuadernillos doc 1 -2018 | `data/2018/cuadernillo-doc-1-2018.pdf` | Local | Existe |
| Imagen Cuadernillos est 2 -2018 | `data/2018/cuadernillo-est-2-2018.pdf` | Local | Existe |
| Imagen Cuadernillos doc 2 -2018 | `data/2018/cuadernillo-doc-2-2018.pdf` | Local | Existe |
| Imagen Cuadernillos est 3 -2018 | `data/2018/cuadernillo-est-3-2018.pdf` | Local | Existe |
| Imagen Cuadernillos doc 3 -2018 | `data/2018/cuadernillo-doc-3-2018.pdf` | Local | Existe |
| Imagen Cuadernillos est 4 -2018 | `data/2018/cuadernillo-est-4-2018.pdf` | Local | Existe |
| Imagen Cuadernillos doc 4 -2018 | `data/2018/cuadernillo-doc-4-2018.pdf` | Local | Existe |
| Imagen Cuadernillos est 5 -2018 | `data/2018/cuadernillo-est-5-2018.pdf` | Local | Existe |
| Imagen Cuadernillos doc 5 -2018 | `data\2018\cuadernillo-doc-5-2018.pdf` | Local | Existe |
| Imagen Cuadernillos est 6 -2018 | `data\2018\apoyo-estudiantes-2018.pdf` | Local | Existe |
| Imagen Cuadernillos doc 6 -2018 | `data\2018\apoyo-docente-2018.pdf` | Local | Existe |
| Imagen Cuadernillos 1 -2017 | `data/2017/cuadernillo1-2017.pdf` | Local | Existe |
| Imagen Cuadernillos 2 -2017 | `data/2017/cuadernillo2-2017.pdf` | Local | Existe |
| Imagen Cuadernillos 3 -2017 | `data/2017/cuadernillo3-2017.pdf` | Local | Existe |
| Imagen Cuadernillos 4 -2017 | `data/2017/cuadernillo4-2017.pdf` | Local | Existe |
| Imagen Cuadernillos 5 -2017 | `data/2017/cuadernillo5-2017.pdf` | Local | Existe |
| Imagen Cuadernillos 6 -2017 | `data/2017/cuadernillo6-2017.pdf` | Local | Existe |
| Imagen estudiantes 2016 | `data/2016/Cuadernillo-2016.pdf` | Local | Existe |
| Asesora de Curricular | `#menu1` | Ancla | Destino presente |
| Recursos Tecnológicos | `#home` | Ancla | Destino presente |
| GESPRO-MEP | `https://www.mep.go.cr/educatico.com` | Externo | No aplica |
| www.w3schools.com | `https://www.w3schools.com` | Externo | No aplica |

## Inventario de imágenes

| Archivo | Texto alternativo | Estado |
| --- | --- | --- |
| `img/logo.png` | (vacío o ausente) | Existe |
| `img/calificame.png` | Imagen para calificar este curso | Existe |
| `./img/olimp15.jpg` | (vacío o ausente) | Existe |
| `./img/olimp14.jpg` | (vacío o ausente) | Existe |
| `./img/olimp13.jpg` | (vacío o ausente) | Existe |
| `./img/olimp12.jpg` | (vacío o ausente) | Existe |
| `./img/olimp11.jpg` | (vacío o ausente) | Existe |
| `./img/olimp10.jpg` | (vacío o ausente) | Existe |
| `./img/olimp9.jpg` | (vacío o ausente) | Existe |
| `./img/olimp8.jpg` | (vacío o ausente) | Existe |
| `./img/olimp7.jpg` | (vacío o ausente) | Existe |
| `./img/olimp6.jpg` | (vacío o ausente) | Existe |
| `./img/olimp5.jpg` | (vacío o ausente) | Existe |
| `./img/olimp4.jpg` | (vacío o ausente) | Existe |
| `./img/olimp3.jpg` | (vacío o ausente) | Existe |
| `./img/olimp2.jpg` | (vacío o ausente) | Existe |
| `./img/olimp1.jpg` | (vacío o ausente) | Existe |
| `img/2023/ninos.png` | Niños jugando | Existe |
| `img/iconos/GIF-Nuevo.gif` | Imagen Nuevo | Existe |
| `img/flecha.gif` | Flecha | Existe |
| `img/centro.jpg` | Centro Cultural Costarricense Norteamericano se une a las Olimpiadas de matemáticas para celebrar y premiar a los ganadores de oro reafirmando nuestro compromiso con el fortalecimiento y la promoción de talento en la educación nacional costarricense | Existe |
| `img/iconos/olimpiada-virtual-2026.png` | Imagen icono Olimpiadas 2026 | Existe |
| `img/iconos/temario.png` | Imagen temario | Existe |
| `img/iconos/reglamento.png` | Imagen Reglamento | Existe |
| `img/iconos/protocolo.png` | Imagen Reglamento | Existe |
| `img/flecha.gif` | Flecha | Existe |
| `img/flecha.gif` | Flecha | Existe |
| `img/2023/logo.png` | logo | Existe |
| `img/iconos/logoYouTube.png` | sectores | Existe |
| `./img/iconos/2025/ico-01-2025.png` | Cuadernillos primero | Existe |
| `./img/iconos/2025/ico-02-2025.png` | Cuadernillos segundo | Existe |
| `./img/iconos/2025/ico-03-2025.png` | Cuadernillos tercero | Existe |
| `./img/iconos/2025/ico-04-2025.png` | Cuadernillos cuarto | Existe |
| `./img/iconos/2025/ico-05-2025.png` | Cuadernillos quinto | Existe |
| `./img/iconos/2025/ico-06-2025.png` | Cuadernillos sexto | Existe |
| `./img/iconos/2025/ico-01-2025-docente.png` | Cuadernillo para el docente | Existe |
| `./img/iconos/2025/ico-02-2025-docente.png` | Cuadernillo para el docente | Existe |
| `./img/iconos/2025/ico-03-2025-docente.png` | Cuadernillo para el docente | Existe |
| `./img/iconos/2025/ico-04-2025-docente.png` | Cuadernillo para el docente | Existe |
| `./img/iconos/2025/ico-05-2025-docente.png` | Cuadernillo para el docente | Existe |
| `./img/iconos/2025/ico-06-2025-docente.png` | Cuadernillo para el docente | Existe |
| `img/iconos/2024/alumno-1.png` | Cuadernillos | Existe |
| `img/iconos/2024/alumno-2.png` | Cuadernillos | Existe |
| `img/iconos/2024/alumno-3.png` | Cuadernillos | Existe |
| `img/iconos/2024/alumno-4.png` | Cuadernillos | Existe |
| `img/iconos/2024/alumno-5.png` | Cuadernillos | Existe |
| `img/iconos/2024/alumno-6.png` | Cuadernillos | Existe |
| `img/iconos/2023/alumno-1.png` | Imagen Cuadernillos est 1 -2022 | Existe |
| `img/iconos/2023/docente-1.png` | Imagen Cuadernillos doc 1 -2022 | Existe |
| `img/iconos/2023/alumno-2.png` | Imagen Cuadernillos est 2 -2022 | Existe |
| `img/iconos/2023/docente-2.png` | Imagen Cuadernillos doc 2 -2022 | Existe |
| `img/iconos/2023/alumno-3.png` | Imagen Cuadernillos est 3 -2022 | Existe |
| `img/iconos/2023/docente-3.png` | Imagen Cuadernillos doc 3 -2022 | Existe |
| `img/iconos/2023/alumno-4.png` | Imagen Cuadernillos est 4 -2022 | Existe |
| `img/iconos/2023/docente-4.png` | Imagen Cuadernillos doc 4 -2022 | Existe |
| `img/iconos/2023/alumno-5.png` | Imagen Cuadernillos est 5 -2022 | Existe |
| `img/iconos/2023/docente-5.png` | Imagen Cuadernillos doc 5 -2022 | Existe |
| `img/iconos/2023/alumno-6.png` | Imagen Cuadernillos est 6 -2022 | Existe |
| `img/iconos/2023/docente-6.png` | Imagen Cuadernillos doc 6 -2022 | Existe |
| `img/iconos/2022/alumno-1.png` | Imagen Cuadernillos est 1 -2022 | Existe |
| `img/iconos/2022/docente-1.png` | Imagen Cuadernillos doc 1 -2022 | Existe |
| `img/iconos/2022/alumno-2.png` | Imagen Cuadernillos est 2 -2022 | Existe |
| `img/iconos/2022/docente-2.png` | Imagen Cuadernillos doc 2 -2022 | Existe |
| `img/iconos/2022/alumno-3.png` | Imagen Cuadernillos est 3 -2022 | Existe |
| `img/iconos/2022/docente-3.png` | Imagen Cuadernillos doc 3 -2022 | Existe |
| `img/iconos/2022/alumno-4.png` | Imagen Cuadernillos est 4 -2022 | Existe |
| `img/iconos/2022/docente-4.png` | Imagen Cuadernillos doc 4 -2022 | Existe |
| `img/iconos/2022/alumno-5.png` | Imagen Cuadernillos est 5 -2022 | Existe |
| `img/iconos/2022/docente-5.png` | Imagen Cuadernillos doc 5 -2022 | Existe |
| `img/iconos/2022/alumno-6.png` | Imagen Cuadernillos est 6 -2022 | Existe |
| `img/iconos/2022/docente-6.png` | Imagen Cuadernillos doc 6 -2022 | Existe |
| `img/iconos/2022/int/guia-estudiante-1a.png` | Imagen Interactivo-2022 1a | Existe |
| `img/iconos/2022/int//guia-estudiante-2a.png` | Imagen Interactivo-2022 2a | Existe |
| `img/iconos/2022/int//guia-estudiante-2b.png` | Imagen Interactivo-2022 2b | Existe |
| `img/iconos/2022/int//guia-estudiante-3a.png` | Imagen Interactivo-2022 3a | Existe |
| `img/iconos/2022/int//guia-estudiante-3b.png` | Imagen Interactivo-2022 3b | Existe |
| `img/iconos/2022/int//guia-estudiante-4a.png` | Imagen Interactivo-2022 4a | Existe |
| `img/iconos/2022/int//guia-estudiante-4b.png` | Imagen Interactivo-2022 4b | Existe |
| `img/iconos/2022/int//guia-estudiante-5a.png` | Imagen Interactivo-2022 5a | Existe |
| `img/iconos/2022/int//guia-estudiante-5b.png` | Imagen Interactivo-2022 5b | Existe |
| `img/iconos/2021/alumno-1.png` | Imagen Cuadernillos est 1 -2021 | Existe |
| `img/iconos/2021/docente-1.png` | Imagen Cuadernillos doc 1 -2021 | Existe |
| `img/iconos/2021/alumno-2.png` | Imagen Cuadernillos est 2 -2021 | Existe |
| `img/iconos/2021/docente-2.png` | Imagen Cuadernillos doc 2 -2021 | Existe |
| `img/iconos/2021/alumno-3.png` | Imagen Cuadernillos est 3 -2021 | Existe |
| `img/iconos/2021/docente-3.png` | Imagen Cuadernillos doc 3 -2021 | Existe |
| `img/iconos/2021/alumno-4.png` | Imagen Cuadernillos est 4 -2021 | Existe |
| `img/iconos/2021/docente-4.png` | Imagen Cuadernillos doc 4 -2021 | Existe |
| `img/iconos/2021/alumno-5.png` | Imagen Cuadernillos est 5 -2021 | Existe |
| `img/iconos/2021/docente-5.png` | Imagen Cuadernillos doc 5 -2021 | Existe |
| `img/iconos/2021/alumno-6.png` | Imagen Cuadernillos est 6 -2021 | Existe |
| `img/iconos/2021/docente-6.png` | Imagen Cuadernillos doc 6 -2021 | Existe |
| `img/iconos/2021/guia-estudiante-1a.png` | Imagen Interactivo-2021 3a | Existe |
| `img/iconos/2021/guia-estudiante-1b.png` | Imagen Interactivo-2021 3b | Existe |
| `img/iconos/2021/guia-estudiante-2a.png` | Imagen Interactivo-2021 2a | Existe |
| `img/iconos/2021/guia-estudiante-2b.png` | Imagen Interactivo-2021 2b | Existe |
| `img/iconos/2021/guia-estudiante-3a.png` | Imagen Interactivo-2021 3a | Existe |
| `img/iconos/2021/guia-estudiante-3b.png` | Imagen Interactivo-2021 3b | Existe |
| `img/iconos/2021/guia-estudiante-4a.png` | Imagen Interactivo-2021 4a | Existe |
| `img/iconos/2021/guia-estudiante-4b.png` | Imagen Interactivo-2021 4b | Existe |
| `img/iconos/2021/guia-estudiante-5a.png` | Imagen Interactivo-2021 5a | Existe |
| `img/iconos/2021/guia-estudiante-5b.png` | Imagen Interactivo-2021 5b | Existe |
| `img/iconos/2021/guia-estudiante-6a.png` | Imagen Interactivo-2021 6a | Existe |
| `img/iconos/2021/guia-estudiante-6b.png` | Imagen Interactivo-2021 6b | Existe |
| `img/iconos/2020/olimpiadas-mate-alumno-1.png` | Imagen Cuadernillos est 1 -2020 | Existe |
| `img/iconos/2020/olimpiadas-mate-docente-1.png` | Imagen Cuadernillos doc 1 -2020 | Existe |
| `img/iconos/2020/olimpiadas-mate-alumno-2.png` | Imagen Cuadernillos est 2 -2020 | Existe |
| `img/iconos/2020/olimpiadas-mate-docente-2.png` | Imagen Cuadernillos doc 2 -2020 | Existe |
| `img/iconos/2020/olimpiadas-mate-alumno-3.png` | Imagen Cuadernillos est 3 -2020 | Existe |
| `img/iconos/2020/olimpiadas-mate-docente-3.png` | Imagen Cuadernillos doc 3 -2020 | Existe |
| `img/iconos/2020/olimpiadas-mate-alumno-4.png` | Imagen Cuadernillos est 4 -2020 | Existe |
| `img/iconos/2020/olimpiadas-mate-docente-4.png` | Imagen Cuadernillos doc 4 -2020 | Existe |
| `img/iconos/2020/olimpiadas-mate-alumno-5.png` | Imagen Cuadernillos est 5 -2020 | Existe |
| `img/iconos/2020/olimpiadas-mate-docente-5.png` | Imagen Cuadernillos doc 5 -2020 | Existe |
| `img/iconos/2020/olimpiadas-mate-alumno-6.png` | Imagen Cuadernillos est 6 -2020 | Existe |
| `img/iconos/2020/olimpiadas-mate-docente-6.png` | Imagen Cuadernillos doc 6 -2020 | Existe |
| `img/iconos/2020/int/1a_1p.png` | Imagen 1 año I parte | Existe |
| `img/iconos/2020/int/2a_1p.png` | Imagen 2 año I parte | Existe |
| `img/iconos/2020/int/2a_2p.png` | Imagen 2 año II parte | Existe |
| `img/iconos/2020/int/3a_1p.png` | Imagen 3 año I parte | Existe |
| `img/iconos/2020/int/3a_2p.png` | Imagen 3 año II parte | Existe |
| `img/iconos/2019/e-2019-1.png` | Imagen Cuadernillos est 1 -2019 | Existe |
| `img/iconos/2019/d-2019-1.png` | Imagen Cuadernillos doc 1 -2019 | Existe |
| `img/iconos/2019/e-2019-2.png` | Imagen Cuadernillos est 2 -2019 | Existe |
| `img/iconos/2019/d-2019-2.png` | Imagen Cuadernillos doc 2 -2019 | Existe |
| `img/iconos/2019/e-2019-3.png` | Imagen Cuadernillos est 3 -2019 | Existe |
| `img/iconos/2019/d-2019-3.png` | Imagen Cuadernillos doc 3 -2019 | Existe |
| `img/iconos/2019/e-2019-4.png` | Imagen Cuadernillos est 4 -2019 | Existe |
| `img/iconos/2019/d-2019-4.png` | Imagen Cuadernillos doc 4 -2019 | Existe |
| `img/iconos/2019/e-2019-5.png` | Imagen Cuadernillos est 5 -2019 | Existe |
| `img/iconos/2019/d-2019-5.png` | Imagen Cuadernillos doc 5 -2019 | Existe |
| `img/iconos/2019/e-2019-6.png` | Imagen Cuadernillos est 6 -2019 | Existe |
| `img/iconos/2019/d-2019-6.png` | Imagen Cuadernillos doc 6 -2019 | Existe |
| `img/iconos/2018/e-2018-1.png` | Imagen Cuadernillos est 1 -2018 | Existe |
| `img/iconos/2018/d-2018-1.png` | Imagen Cuadernillos doc 1 -2018 | Existe |
| `img/iconos/2018/e-2018-2.png` | Imagen Cuadernillos est 2 -2018 | Existe |
| `img/iconos/2018/d-2018-2.png` | Imagen Cuadernillos doc 2 -2018 | Existe |
| `img/iconos/2018/e-2018-3.png` | Imagen Cuadernillos est 3 -2018 | Existe |
| `img/iconos/2018/d-2018-3.png` | Imagen Cuadernillos doc 3 -2018 | Existe |
| `img/iconos/2018/e-2018-4.png` | Imagen Cuadernillos est 4 -2018 | Existe |
| `img/iconos/2018/d-2018-4.png` | Imagen Cuadernillos doc 4 -2018 | Existe |
| `img/iconos/2018/e-2018-5.png` | Imagen Cuadernillos est 5 -2018 | Existe |
| `img/iconos/2018/d-2018-5.png` | Imagen Cuadernillos doc 5 -2018 | Existe |
| `img/iconos/2018/e-2018-6.png` | Imagen Cuadernillos est 6 -2018 | Existe |
| `img/iconos/2018/d-2018-6.png` | Imagen Cuadernillos doc 6 -2018 | Existe |
| `img/iconos/2017/e-2017-1.png` | Imagen Cuadernillos 1 -2017 | Existe |
| `img/iconos/2017/e-2017-2.png` | Imagen Cuadernillos 2 -2017 | Existe |
| `img/iconos/2017/e-2017-3.png` | Imagen Cuadernillos 3 -2017 | Existe |
| `img/iconos/2017/e-2017-4.png` | Imagen Cuadernillos 4 -2017 | Existe |
| `img/iconos/2017/e-2017-5.png` | Imagen Cuadernillos 5 -2017 | Existe |
| `img/iconos/2017/e-2017-6.png` | Imagen Cuadernillos 6 -2017 | Existe |
| `img/iconos/2016/2016.png` | Imagen estudiantes 2016 | Existe |
| `img/2023/dado.png` | dado | Existe |
| `img/2023/dado.png` | dado | Existe |

## Referencias repetidas

| Destino | Apariciones |
| --- | ---: |
| `#` | 2 |
| `#carousel-fotos` | 2 |
