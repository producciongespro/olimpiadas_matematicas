# Dominio inicial de datos OLCOMEP

## Objetivo

Definir el esquema reservado para una posible gestión futura de inscripciones, sin activarlo mientras OLCOMEP continúa utilizando el formulario externo vigente. La implementación actual persiste únicamente ediciones y recursos públicos.

## Decisión vigente

- La inscripción se realiza fuera del sistema mediante el formulario oficial existente.
- La vista pública conserva el enlace al formulario y la descarga del archivo de inscripción masiva.
- La API no expone endpoints de estudiantes, personas tutoras, centros educativos, regionales ni inscripciones.
- No se cargan catálogos regionales ni datos personales en la base.
- Las tablas de inscripción existentes permanecen vacías y reservadas; activarlas requiere una nueva decisión y especificación aprobada.

## Fuente funcional

El formato oficial de inscripción masiva 2026 establece una fila por estudiante y solicita 16 datos sobre la persona participante, su centro educativo y su persona tutora. También indica que cada centro debe remitir un solo archivo consolidado.

## Alcance del esquema reservado

- Ediciones anuales y sus periodos de inscripción.
- Recursos publicados por edición, audiencia y grado.
- Direcciones regionales, circuitos y centros educativos.
- Estudiantes y personas tutoras.
- Una inscripción por estudiante en cada edición.
- Trazabilidad del origen y estado de cada inscripción.

## Requisitos

### DAT-001 — Unicidad de inscripción

Una persona estudiante solo puede tener una inscripción en una misma edición.

### DAT-002 — Protección de identificación

La identificación se cifra antes de persistirla. Una huella SHA-256 con secreto de aplicación permite detectar duplicados y los cuatro últimos caracteres permiten soporte operativo sin exponer el valor completo.

### DAT-003 — Catálogos validables

Grado, sexo biológico, nacionalidad, tipo de institución, relación, origen y estado usan columnas portables; los servicios validarán sus valores contra catálogos cerrados.

### DAT-004 — Integridad referencial

Una inscripción siempre referencia una edición, estudiante, centro educativo y persona tutora existentes. No se permite eliminar esos registros mientras conserven inscripciones.

### DAT-005 — Recursos desacoplados

Los documentos internos y enlaces externos comparten un catálogo de recursos. La URL permanece independiente del almacenamiento para permitir una migración futura.

### DAT-006 — Edición inicial repetible

El proyecto provee un seeder idempotente para la edición OLCOMEP 2026. Ejecutarlo más de una vez no duplica el registro ni modifica datos que ya coinciden con la definición vigente.

## Fuera de alcance

- Resultados, puntajes, medallas y premiación, hasta validar su proceso oficial.
- Autenticación de participantes; la administración continúa protegida mediante Microsoft Entra ID.
- Importación automática del Excel y endpoints CRUD, que corresponden a iteraciones posteriores.
- Sustitución del formulario externo de inscripción.
- Carga del catálogo de direcciones regionales en la base.
- Política definitiva de retención y anonimizado, pendiente de aprobación institucional.
