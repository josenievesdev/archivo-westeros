# Feature: Spoiler Shield

## Objetivo

Permitir que cada persona consulte el universo sin recibir información posterior a la
temporada y episodio que está viendo.

## Alcance

- Selección de temporada y episodio.
- Niveles de protección y revelado manual.
- Filtrado de fichas, relaciones, búsqueda, mapas y cronologías.
- Persistencia y actualización segura del progreso.

## Datos requeridos

Cada afirmación, evento y relación sensible debe incluir el punto desde el que puede
mostrarse. Un único indicador por personaje no sería suficiente porque su ficha cambia
a lo largo de la serie.

## Ideas futuras

Modo estricto, avisos antes de revelar, perfiles de progreso y explicación de por qué
un bloque permanece oculto sin describir su contenido.

## Estado

Concepto documentado. No hay lógica de filtrado ni datos por episodio; cualquier UI
actual puede mostrar información de la fuente sin protección.
