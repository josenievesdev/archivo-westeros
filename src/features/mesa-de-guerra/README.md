# Feature: mesa de guerra

## Objetivo

Representar conflictos, ejércitos, alianzas y control territorial como una mesa
estratégica comprensible.

## Alcance

- Casas y fuerzas representadas mediante piezas.
- Guerras, batallas, bandos y movimientos.
- Integración con mapa, cronología y cambios políticos.
- Vista funcional 2D antes de cualquier capa 3D.

## Datos requeridos

Conflictos con participantes, fechas relativas, ubicaciones, líderes, movimientos y
resultados, todos con procedencia y nivel de spoiler.

## Ideas futuras

Piezas tipo ajedrez, reproducción temporal de campañas, inspección de alianzas y una
vista 3D opcional si el prototipo demuestra valor.

## Estado

Ruta `/mesa-de-guerra` con la pantalla `04 · Sala de estrategia` implementada en
`war-room/`: vista presentacional pura (`WarRoomView`) que recibe un
`WarRoomViewModel` por props y de momento se alimenta de `war_room.fixture.ts`,
un fixture de diseño. No consulta la API ni conoce TanStack Query; conectar los
datos reales consiste en construir ese ViewModel desde las entidades canónicas.

Three.js no está instalado y no existe aún modelo militar propio: el tablero se
construye con CSS, SVG y los tokens de casa.

## Spoilers

`WarRoomFigureViewModel` es genérico (`label` / `value` / `tone`) y no modela
estado de casa ni supervivientes: el contrato no debe obligar a suministrar
métricas que revelan acontecimientos futuros mientras no exista Spoiler Shield.

El fixture provisional solo reparte datos estructurales del archivo —registros,
territorio y rango—, nunca `vivos`, `extinta`, `diezmada`, pérdidas ni resultados
de batalla. Antes de enseñar esas métricas hay que conectar el nivel de
protección; está anotado en `docs/backlog.md`.
