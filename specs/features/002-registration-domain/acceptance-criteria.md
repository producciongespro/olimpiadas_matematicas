# Criterios de aceptación

- Las migraciones crean las siete tablas del dominio: `editions`, `resources`, `educational_regions`, `schools`, `students`, `guardians` y `registrations`.
- Las migraciones pueden aplicarse y revertirse sin intervención manual.
- `editions.year` y `editions.slug` son únicos.
- `students.identification_hash` es único y no existe una columna de identificación en texto plano.
- La combinación `registrations.edition_id` y `registrations.student_id` es única.
- Las relaciones de inscripción están protegidas mediante llaves foráneas.
- Los campos del formato masivo 2026 tienen correspondencia documentada.
- El seeder inicial registra una edición 2026 y no carga direcciones regionales.
- Ejecutar dos veces el seeder inicial conserva la misma edición sin duplicarla.
- No existen rutas API para recibir o administrar inscripciones y datos personales.
- La suite automatizada y el endpoint de salud continúan funcionando después del cambio.
