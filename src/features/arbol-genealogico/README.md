# Feature: árbol genealógico

## Objetivo

Convertir las relaciones familiares en una estructura navegable que explique linajes,
matrimonios, descendencia y sucesión.

## Alcance

- Árbol interactivo por personaje o casa.
- Padre, madre, cónyuges, descendientes y parentescos extendidos.
- Relaciones inciertas o válidas solo durante un periodo.
- Alternativa textual y navegación accesible.

## Datos requeridos

Relaciones con tipo, dirección, fuente, periodo y nivel de spoiler. Las referencias
básicas de la API no son suficientes para construir todos los linajes.

## Ideas futuras

Recorrer una línea de sucesión, centrar cualquier nodo, comparar ramas y abrir fichas
sin perder la posición del árbol.

## Estado

Ruta `/linajes` preparada con placeholder. No se ha elegido librería de grafos ni
modelo de visualización.
