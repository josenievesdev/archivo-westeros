# Capa de aplicación

Compone infraestructura global sin contener reglas de personajes, casas o spoilers.

- `layout/`: marco de navegación compartido y `Outlet` de las páginas.
- `providers/`: instancias globales como `QueryClientProvider`.
- `router/`: rutas, página 404 y conexión entre features.

Una feature no debe depender del layout. Si aparece un provider nuevo, debe responder
a una necesidad transversal real y permanecer independiente de la UI concreta.
