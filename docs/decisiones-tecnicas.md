# Decisiones técnicas

Registro ligero de decisiones que afectan la dirección del proyecto. No sustituye la
documentación específica, pero explica por qué existe cada pieza importante.

## ADR-001 — React + TypeScript + Vite

**Decisión:** usar React para la UI, TypeScript en modo estricto y Vite para desarrollo
y build.

**Razón:** el producto tendrá interfaces interactivas, relaciones visuales y estados
de consulta que encajan bien con componentes. Vite proporciona una base pequeña y
rápida sin imponer un framework de servidor antes de necesitarlo. TypeScript protege
las fronteras entre fuentes externas y modelos internos.

## ADR-002 — Arquitectura por features

**Decisión:** organizar capacidades de producto en `src/features` y mantener
infraestructura transversal en `app`, `lib`, `services` y `components`.

**Razón:** personajes, casas, spoilers o mapa evolucionarán a ritmos distintos. La
separación por feature mantiene juntas sus páginas y hooks sin crear capas globales
para código que solo usa un módulo.

## ADR-003 — Frontera de datos para la API externa

**Decisión:** separar cliente HTTP, endpoints, tipos externos, normalizadores y modelos
internos.

**Razón:** An API of Ice and Fire no cubre todo el producto y podría complementarse,
cachearse o sustituirse. Acoplar componentes a sus DTOs convertiría cualquier cambio
de fuente en una reescritura de UI.

## ADR-004 — TanStack Query para estado remoto

**Decisión:** encapsular las consultas en hooks de feature y usar un `QueryClient`
global.

**Razón:** resuelve caché, deduplicación, reintentos, cancelación y estados asíncronos.
Evita repetir `fetch` y sincronización manual mediante `useEffect` en componentes.

## ADR-005 — React Router con rutas explícitas

**Decisión:** definir navegación declarativa para inicio, personajes, casas y
placeholders futuros.

**Razón:** las fichas necesitan URLs compartibles y navegación directa. Las rutas
futuras se reservan conceptualmente sin cargar todavía sus dependencias o lógica.

## ADR-006 — Tailwind CSS v4

**Decisión:** integrar Tailwind mediante su plugin oficial de Vite y una única entrada
global. Los tokens y las primitivas compartidas permanecen allí; una feature puede
añadir una hoja de estilos acotada por convención cuando su geometría editorial sea
demasiado densa para expresarla con utilidades aisladas.

**Razón:** permite traducir progresivamente `got_poryect_pen.dev.pen` mediante tokens
CSS y componentes pequeños, sin mantener una configuración paralela ni improvisar un
sistema visual alternativo.

## ADR-007 — Vitest + Testing Library

**Decisión:** usar Vitest en jsdom y Testing Library para pruebas de comportamiento.

**Razón:** se integra con Vite y permite verificar componentes desde la perspectiva
del usuario. Los normalizadores se prueban como funciones puras sin acceso a red.

## ADR-008 — Oxlint

**Decisión:** utilizar Oxlint para análisis estático y TypeScript para comprobación de
tipos.

**Razón:** ofrece lint rápido con reglas de React y TypeScript sin añadir una cadena
grande de plugins. El typecheck permanece como paso separado y explícito.

## ADR-009 — Sin estado global adicional

**Decisión:** no instalar una librería de estado cliente durante la foundation.

**Razón:** TanStack Query cubre el estado remoto y las preferencias actuales no
justifican otro sistema. `src/store` reserva el concepto, no una decisión de librería.

## ADR-010 — Sin Supabase ni Three.js todavía

**Decisión:** preparar límites conceptuales, pero no instalar Supabase, PostgreSQL ni
Three.js.

**Razón:** todavía no existe un esquema editorial ni una interacción 3D validada.
Añadir dependencias ahora aumentaría mantenimiento sin resolver una necesidad actual.

## ADR-011 — Español con nombres propios originales

**Decisión:** escribir interfaz y documentación en español, manteniendo nombres propios
y términos identitarios en su forma original.

**Razón:** mejora la claridad para el público principal sin deformar nombres como
Winterfell, King's Landing, The Wall o Daenerys Targaryen.

## ADR-012 — Configuración mínima de entorno

**Decisión:** exponer solo `VITE_ICE_AND_FIRE_API_URL`, opcional y sin secretos.

**Razón:** permite probar otra base de integración sin fingir credenciales de servicios
que aún no existen. La URL pública predeterminada mantiene el arranque inmediato.

## ADR-013 — Interfaz mobile-first

**Decisión:** construir estilos y componentes desde los viewports de 375, 390 y 430 px,
y ampliar progresivamente en 768, 1024 y 1440 px.

**Razón:** el caso de uso principal ocurre en teléfono mientras se ve un episodio. Las
acciones esenciales necesitan objetivos táctiles de al menos 44 px, safe areas y
funcionamiento sin hover. El desktop conserva la composición aprobada, pero no se
comprime literalmente para crear móvil.

## ADR-014 — Fuente visual principal

**Decisión:** usar `got_poryect_pen.dev.pen` como fuente visual editable y
`got_poryect_pen.dev.html` como especificación técnica visual desktop. El `.pen` se
inspecciona mediante Pencil MCP; el HTML permite consultar medidas, estilos, SVG y
jerarquía `data-pencil-name` sin trasladar su canvas absoluto a React.

**Razón:** establece trazabilidad visual sin convertir la estructura de capas del mock
en arquitectura React. El HTML exportado es solo una referencia de desarrollo: no se
importa, no se renderiza mediante `iframe` y no forma parte del bundle de producción.
`/docs` mantiene autoridad sobre producto, contenido, accesibilidad, idioma y spoilers;
el código mantiene autoridad sobre datos, rutas, queries, modelos y tests.

## ADR-015 — Temas de casas mediante variables CSS

**Decisión:** aplicar `data-house` y variables CSS para Stark, Lannister, Targaryen,
Baratheon, Greyjoy, Tyrell y Martell. Los componentes compartidos consumen acento y
material sin duplicarse por casa.

**Razón:** el `.pen` cambia la temperatura y el material de cada casa, no la estructura
de la interfaz. Esta solución permite que `HouseSigil`, `HousePiece`, badges y tarjetas
compartan semántica y deja una ranura visual para sustituir CSS por SVG, imágenes o
Three.js en una fase posterior.

## ADR-016 — Configuración editorial de Home

**Decisión:** mantener IDs estables, labels de respaldo y alias conocidos dentro de la
feature de Home, consumiendo los datos remotos mediante los hooks y modelos normalizados
existentes.

**Razón:** An API of Ice and Fire filtra listas por nombre y no cubre toda la capa
editorial. La configuración permite accesos rápidos y degradación segura sin crear
entidades duplicadas, alterar DTOs externos ni prometer una búsqueda global por títulos.
