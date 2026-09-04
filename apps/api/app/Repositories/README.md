# Repositories

Cada repositorio encapsula el acceso a una entidad o agregado de datos.

- Extienda `BaseRepository`.
- Reciba una conexión opcional en el constructor para facilitar pruebas y transacciones.
- Mantenga aquí consultas, filtros, paginación y persistencia.
- No use `RequestInterface`, `ResponseInterface` ni `service('response')` en esta capa.
- No coloque reglas de negocio ni autorización HTTP; esas responsabilidades pertenecen al servicio.

Ejemplo de flujo: `RecursoController` llama a `RecursoService`; el servicio aplica reglas y usa `RecursoRepository`; el repositorio consulta la base de datos.
