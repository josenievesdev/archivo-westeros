# Roadmap

El roadmap describe una secuencia lógica, no fechas rígidas. Cada fase debe cerrar
sus criterios de calidad antes de añadir complejidad visual o de datos.

## Fase 1 — Foundation

**Objetivo:** disponer de una base ejecutable, testeable y documentada.

- React, TypeScript, Vite y Tailwind CSS v4.
- Router, TanStack Query, Vitest, Testing Library y Oxlint.
- Capa para An API of Ice and Fire con DTOs, normalizadores y modelos internos.
- Rutas principales y una interfaz temporal.
- Documentación de visión, contenido, datos y decisiones.

**Estado:** completada en su alcance inicial.

## Fase 2 — Personajes

**Objetivo:** convertir la ficha mínima en una consulta útil durante un episodio.

- Búsqueda por nombre y alias.
- Listado paginado y estados vacíos.
- Ficha con títulos, familia, relaciones, lealtades, temporadas y actor.
- Resolución eficiente de referencias entre recursos.
- Pruebas de hooks, errores y navegación.

## Fase 3 — Casas

**Objetivo:** explicar pertenencia, jerarquía y contexto territorial.

- Búsqueda y filtros por región.
- Miembros, señor actual, heredero, casa superior y casas juramentadas.
- Lema, asientos, títulos, ramas y armas ancestrales.
- Enlaces cruzados con personajes y linajes.

## Fase 4 — Spoiler Shield

**Objetivo:** adaptar cada dato a temporada y episodio.

- Modelo de progreso del usuario.
- Reglas de visibilidad y niveles de spoiler.
- Datos editoriales por episodio.
- Preferencias persistentes y pruebas de filtrado.
- Tratamiento seguro de búsquedas y resultados relacionados.

## Fase 5 — Árboles y relaciones

**Objetivo:** visualizar familia y política sin perder contexto.

- Árbol genealógico navegable.
- Tipos de relación y periodos de validez.
- Relaciones políticas, matrimonios y cambios de lealtad.
- Accesibilidad mediante alternativas textuales y navegación sin puntero.

## Fase 6 — Inmersión

**Objetivo:** definir una capa ambiental opcional y medible.

- Sistema de preferencias y reducción de movimiento.
- Audio ambiental con controles claros.
- Fuego, hielo, nieve, humo y ceniza en pruebas controladas.
- Transiciones coherentes con navegación y rendimiento.
- Validación de la dirección visual desarrollada en pen.dev.

## Fase 7 — Piezas de guerra

**Objetivo:** crear un lenguaje visual para casas y fuerzas.

- Prototipos de piezas heráldicas tipo ajedrez.
- Evaluación técnica de Three.js cuando exista un caso validado.
- Niveles de detalle y alternativa 2D.
- Interacciones, selección y estados de las piezas.

## Fase 8 — Mapa

**Objetivo:** conectar geografía, viajes y eventos.

- Modelo propio de lugares y regiones.
- Capas de información y navegación contextual.
- Rutas de personajes y localización de batallas.
- Integración con Spoiler Shield y cronología.

## Fase 9 — Mesa de guerra

**Objetivo:** reunir casas, mapa, conflictos y piezas en una vista estratégica.

- Guerras, batallas, ejércitos, alianzas y control territorial.
- Línea temporal de movimientos y cambios políticos.
- Piezas interactivas y estados por episodio.
- Modo de exploración accesible sin efectos avanzados.

## Criterio transversal

Supabase, PostgreSQL, Three.js y Cloudflare se evaluarán cuando una fase los necesite.
No se incorporarán solo para anticipar un futuro posible.
