# Criterios de aceptación de la reorganización inicial

- El sitio heredado permanece sin cambios dentro de `app/`.
- La raíz declara workspaces para las dos aplicaciones React y los paquetes compartidos.
- La aplicación pública tiene una ruta inicial y usa los tokens institucionales compartidos.
- La aplicación administrativa puede evolucionar sin depender de la vista pública.
- La API de CodeIgniter está integrada sin historial Git anidado y tiene un límite de responsabilidad documentado.
- La estrategia de migración y continuidad está documentada.
- No se instalan dependencias ni se aplican cambios de despliegue en esta etapa.
