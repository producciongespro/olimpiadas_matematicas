# Requisitos fundacionales

## RF-001 — Continuidad del sitio público

La nueva vista pública debe conservar, en la medida de lo posible, el contenido, identidad, recursos descargables, enlaces y tareas disponibles en el sitio heredado.

## RF-002 — Migración progresiva

El sitio heredado permanecerá ejecutable hasta que la nueva vista pública alcance paridad funcional verificada.

## RF-003 — Separación de aplicaciones

La solución separará la vista pública, la administración y la API, permitiendo evolución y despliegue independientes.

## RF-004 — Accesibilidad y adaptación

La nueva interfaz debe ofrecer navegación por teclado, foco visible, estructura semántica y adaptación a móvil, tableta y escritorio.

## RF-005 — Base de datos local reproducible

El desarrollo local usará MySQL 8.0 y phpMyAdmin mediante Docker Compose, con datos persistentes y credenciales privadas. La API y las dos aplicaciones React continuarán ejecutándose en el equipo anfitrión.
