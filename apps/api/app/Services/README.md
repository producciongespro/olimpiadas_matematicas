# Services

Cada servicio representa un caso de uso de negocio.

- Recibe datos ya normalizados por el controlador.
- Aplica reglas de negocio y autorización específica del recurso.
- Coordina uno o varios repositorios y abre transacciones cuando corresponde.
- Devuelve datos o errores de dominio; no crea respuestas HTTP ni ejecuta consultas SQL directamente.
