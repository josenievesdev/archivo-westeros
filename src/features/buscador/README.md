# Feature: buscador

## Objetivo

Resolver rápidamente quién es una persona o qué representa una casa. Será uno de los
puntos de entrada principales mientras el usuario ve un episodio.

## Alcance

- Búsqueda global de personajes, casas y alias.
- Extensión futura a títulos, lugares y términos del glosario.
- Navegación completa por teclado y resultados agrupados por tipo.
- Aplicación del Spoiler Shield antes de mostrar coincidencias.

## Datos requeridos

Índice normalizado de nombres, alias, casas y relaciones básicas. La API pública
permite filtros limitados, por lo que una búsqueda flexible probablemente requerirá un
índice propio o datos sincronizados.

## Ideas futuras

Tolerancia a errores tipográficos, búsquedas recientes, comandos rápidos y resultados
contextuales por episodio sin exponer contenido posterior.

## Estado

Solo está definida la frontera funcional. No existe todavía interfaz, índice ni
dependencia de búsqueda.
