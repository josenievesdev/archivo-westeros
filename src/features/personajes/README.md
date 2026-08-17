# Feature: personajes

## Objetivo

Identificar personajes y explicar sus vínculos sin obligar al usuario a reconstruir
información dispersa.

## Alcance

- Listado y ficha individual.
- Nombres, alias, títulos, cultura, nacimiento y estado.
- Padre, madre, cónyuge, familia y otras relaciones.
- Lealtades, temporadas, actor y cronología.

## Datos requeridos

El modelo normalizado de An API of Ice and Fire cubre la base. Las apariciones por
episodio, cambios de estado, imágenes y nivel de spoiler necesitarán datos editoriales
propios.

## Ideas futuras

Búsqueda por alias, navegación visual de relaciones, línea temporal personal, cambios
de lealtad y comparación segura entre dos personajes.

## Estado

Disponible una lista inicial, una ficha mínima y hooks de lista/detalle. Faltan
paginación, relaciones resueltas, filtros y protección de spoilers.
