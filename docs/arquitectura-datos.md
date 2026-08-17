# Arquitectura de datos

## Objetivo

La interfaz no debe conocer el contrato de An API of Ice and Fire. Esa API es la
fuente inicial, pero no contiene todo lo necesario para episodios, spoilers,
cronologías o una experiencia visual avanzada. Una frontera explícita evita que el
producto dependa para siempre de sus nombres de campos, URLs y ausencias.

## Flujo actual

```text
An API of Ice and Fire
        ↓
Capa API (cliente HTTP + endpoints + DTOs)
        ↓
Normalizadores
        ↓
Entidades canónicas + referencias de fuente
        ↓
Composición editorial
        ↓
Localización / documentos de búsqueda / modelos de UI
        ↓
TanStack Query
        ↓
Features
        ↓
UI
```

## Responsabilidades

### Cliente HTTP

`api_client.ts` conoce la URL base, construye parámetros, envía `Accept: application/json`,
propaga cancelación y convierte respuestas HTTP fallidas en un error de integración.
No conoce personajes ni casas.

### Endpoints

`api_endpoints.ts` concentra las rutas de recursos. Evita cadenas de URL dispersas y
codifica identificadores antes de formar una ruta.

### Tipos externos

`api_types.ts` describe literalmente la respuesta remota. Sus nombres siguen el
contrato externo, incluidos valores vacíos y referencias expresadas como URLs. Estos
tipos no deben importarse desde componentes.

### Normalizadores

Los normalizadores convierten cada DTO externo al modelo interno. Actualmente:

- Validan las URLs y extraen referencias tipadas de fuente.
- Construyen IDs canónicos para entidades y relaciones.
- Convierten cadenas vacías en `null` cuando representan ausencia.
- Eliminan elementos vacíos de listas.
- Conservan el valor textual original sin inventar ni traducir contenido.

La normalización es una transformación determinista y se prueba sin red.

### Modelos internos

`canonical_entities.ts` define los contratos estables que consume el producto:

- `SourceIdentity` identifica fuente, tipo de recurso e ID externo.
- `SourceRef` añade la URL original como procedencia.
- `CanonicalCharacter` y `CanonicalHouse` usan identidad estable y relaciones
  canónicas.
- `CharacterEditorialMetadata` relaciona una referencia editorial con una entidad,
  sin crear otro personaje.
- `MajorHouseMetadata` identifica las siete casas priorizadas sin duplicar sus
  entidades remotas.
- `HouseArchiveEntry`, `HouseSearchDocument` y `HouseDataBundle` separan archivo,
  búsqueda y relaciones resueltas de cualquier representación visual.
- `LocalizedValue<T>` conserva a la vez el valor de fuente y el valor visible.
- `CharacterViewModel`, `CharacterSearchDocument` y `CharacterSearchHit` separan la
  entidad persistible de las necesidades de presentación y búsqueda.

`internal_types.ts` conserva únicamente parámetros propios del contrato HTTP.

## Identidad canónica

El formato actual es:

```text
ice-and-fire:<tipo>:<id-externo>
```

Ejemplos:

```text
ice-and-fire:character:1303
ice-and-fire:house:378
ice-and-fire:book:1
```

El nombre nunca participa en el ID. Dos registros llamados `Daenerys Targaryen`, con
IDs externos `271` y `1303`, producen dos entidades distintas. La combinación solo
elimina repeticiones del mismo ID canónico; nunca deduplica por nombre.

Las rutas públicas mantienen por ahora el ID externo (`/personajes/1303`) porque es el
segmento que acepta la API. Componentes y hooks lo obtienen desde
`entity.source.externalId`; no reinterpretan el ID canónico ni analizan URLs.

Las relaciones canónicas sí necesitan volver al ID externo para consultar la fuente.
Esa conversión se realiza únicamente mediante `parseCanonicalId`, que valida fuente,
tipo de recurso e ID. Los servicios no separan cadenas canónicas manualmente.

## Composición editorial

`src/content/character_editorial_metadata.ts` es el catálogo tipado actual. Cada
entrada contiene una referencia editorial `realms-got`, la identidad de fuente, el ID
canónico, nombres de búsqueda en español e inglés y, cuando corresponde, datos para
destacados de Home.

La composición se realiza después de normalizar. Devuelve una entidad nueva con su
metadata y deja intactos tanto el DTO como la entidad de fuente. Por ejemplo, la
metadata de `ice-and-fire:character:1303` enriquece el personaje remoto `1303`; no
crea una tercera Daenerys ni sustituye al registro histórico `271`.

`src/content/house_editorial_metadata.ts` aplica el mismo principio a Stark,
Lannister, Targaryen, Baratheon, Greyjoy, Tyrell y Martell. Cada entrada referencia una
casa real mediante `source.externalId` y `canonicalId`, e incorpora únicamente orden,
nombre corto, prioridad de búsqueda, estado destacado y `themeKey` semántico. No copia
la casa ni sustituye nombre, región, lema o asientos procedentes de la API.

Los IDs verificados son:

| Casa | Source ID | ID canónico |
| --- | --- | --- |
| Stark | `362` | `ice-and-fire:house:362` |
| Lannister | `229` | `ice-and-fire:house:229` |
| Targaryen | `378` | `ice-and-fire:house:378` |
| Baratheon | `17` | `ice-and-fire:house:17` |
| Greyjoy | `169` | `ice-and-fire:house:169` |
| Tyrell | `398` | `ice-and-fire:house:398` |
| Martell | `285` | `ice-and-fire:house:285` |

## Localización y búsqueda

La localización es una proyección determinista desde la entidad canónica. Diccionarios
y parsers curados producen `LocalizedValue<T>`; si no conocen un valor, muestran el
original. El normalizador permanece ajeno al idioma.

La búsqueda de personajes sigue estos pasos:

1. Normaliza mayúsculas, espacios, signos y diacríticos de la consulta.
2. Resuelve nombres, aliases, títulos y términos editoriales ES/EN a nombres que la
   API puede consultar.
3. Consulta una sola vez cada nombre candidato y compone sus entidades canónicas.
4. Une exclusivamente por ID canónico.
5. Construye documentos con valores originales, localizados, actores, cronología y
   temporadas.
6. Puntúa coincidencia exacta por encima de prefijo y coincidencia parcial, con pesos
   explícitos por campo y prioridad editorial.

Una búsqueda de Daenerys conserva `1303` y `271`. La entidad `1303` obtiene prioridad
por la referencia editorial, mientras ambas reciben una descripción de desambiguación
basada en actor, nacimiento, títulos o aliases disponibles.

Para nombres sin metadata, la consulta reconstruye la capitalización que exige la API
y conserva partículas, números romanos, compuestos y excepciones ortográficas
conocidas. La API solo admite nombres completos fuera del catálogo curado; ampliar la
búsqueda parcial a todo el archivo requerirá sincronizar un índice propio.

### Archivo y búsqueda de casas

`buildHouseArchiveEntries` proyecta casas ya cargadas a un modelo de archivo con ambas
identidades, nombre, nombre corto editorial, región, lema, asientos y clasificación
major/minor. `sortHouseArchiveEntries` y `sortHousesForArchive` sitúan primero las siete
casas major en orden editorial y conservan después todas las casas menores en orden
alfabético estable.

La búsqueda local crea documentos con nombre completo, `shortName`, región, `words` y
`seats`. Reutiliza la normalización de texto compartida y no traduce nombres propios.
Solo busca sobre las entradas entregadas al servicio; no presenta una página remota
parcial como si fueran las 444 casas del archivo.

`/casas` separa dos colecciones con coberturas distintas:

- “Las grandes casas” recorre `MAJOR_HOUSE_METADATA` y usa `loadMajorHouses` para
  resolver por detalle las siete entidades exactas. La metadata decide identidad,
  orden, nombre corto y tema; nombre completo, región, lema y asientos proceden de la
  entidad remota. Las resoluciones correctas se conservan si otra major falla.
- “Archivo de casas” solicita una sola página remota de 12 elementos mediante
  `getHouseArchivePage`. El cliente preserva las relaciones `first`, `prev`, `next` y
  `last` del header HTTP `Link`; no deduce páginas por el tamaño del cuerpo ni fija un
  total propio.
- Cada página cargada se proyecta con `buildHouseArchiveEntries`, mantiene todas sus
  casas menores y puede ordenarse, buscarse y filtrarse localmente. Las cards de este
  bloque usan iconografía genérica para no prestarles la identidad de una casa major.
- La búsqueda por nombre, `shortName`, región, lema o asiento, y el filtro de región,
  cubren exclusivamente la página cargada. La interfaz declara este alcance. La lista
  de regiones se deriva de esas entidades y conserva los valores geográficos de la
  fuente.
- Una búsqueda parcial global requerirá acumular un snapshot completo o sincronizar un
  índice propio; no se descarga el archivo entero durante una visita ni se simula esa
  cobertura.

### Relaciones de casas

`HouseDataBundle` compone una casa canónica con metadata y las relaciones literales de
la API:

- `currentLord`, `heir` y `founder` resuelven referencias a personajes.
- `overlord` y `cadetBranches` resuelven referencias a casas.
- `swornMembers` resuelve referencias a personajes con límite configurable.
- `counts` conserva totales de fuente, elementos solicitados, resueltos y omitidos.
- `relationFailures` registra fallos por relación sin descartar la casa principal ni
  las referencias resueltas correctamente.

El límite inicial de `swornMembers` es 6, con máximo explícito de 25. Las ramas cadete
se limitan a 12 por defecto. La resolución deduplica IDs antes de solicitar, reconstruye
el orden original, ejecuta 4 referencias por grupo de forma concurrente por defecto y
acepta cancelación por consumidor. Un consumidor cancelado deja de esperar y no
programa nuevas referencias, pero una petición ya compartida puede terminar y poblar
cache para otros consumidores. Después se apoya en claves de detalle compartidas con
TanStack Query para reutilizar cache y solicitudes concurrentes sin abortarlas entre sí.

La ficha `/casas/:id` solicita el bundle con un límite explícito de 4 `swornMembers`.
Este límite pertenece a esa proyección de UI y no modifica el valor por defecto del
servicio. El ViewModel conserva el conteo total reportado por la fuente aunque solo
incluya los personajes resueltos dentro del límite.

Estas relaciones no cambian de significado al presentarse:

- `swornMembers` son personajes que la fuente enumera como juramentados; no son
  “miembros relevantes” ni casas subordinadas.
- `cadetBranches` son ramas de la casa; no son “casas juramentadas”.
- `overlord` es una referencia singular de la fuente; una colección inversa de casas
  vasallas solo puede derivarse de un catálogo completo y debe declarar su cobertura.
- `currentLord` no representa historial de mando.

El bundle no incluye copy, componentes, visibilidad por episodio ni `spoilerLevel`.
Esas políticas podrán proyectarse después sin alterar la entidad o el resolver.

### TanStack Query

Los hooks de cada feature coordinan caché, carga, error, reintentos y cancelación. La
UI no repite `fetch` dentro de `useEffect`. Las claves distinguen listas, detalles y
búsquedas; el detalle usa el ID canónico en la clave aunque la petición reciba el ID
externo.

Las claves de detalle de personajes y casas viven en
`lib/query/ice_and_fire_query_keys.ts`. `createQueryClientEntityReader` permite que un
servicio no React use `QueryClient.fetchQuery` con esas mismas claves. Así, detalle,
bundle y resolución comparten cache y deduplicación sin importar hooks ni un cliente
global dentro del dominio. Los tests pueden inyectar lectores o loaders sin red.

`useHouseDataBundle` asigna al bundle una clave distinta que incluye ID externo y límite
de miembros, pero su primera lectura de la casa utiliza la clave canónica de detalle ya
existente. Por ello, navegar a la ficha no descarga la entidad principal dos veces y
una casa previamente cacheada se reutiliza. Las relaciones resueltas también quedan en
sus claves de detalle. La query exterior no reintenta el bundle completo: un fallo
secundario se conserva en `relationFailures`, mientras que un fallo de la casa principal
mantiene los estados de error o recurso inexistente de la ruta.

`useMajorHouses` envuelve la colección prioritaria con una clave estable y delega cada
detalle al lector canónico. Al volver a intentar una carga parcial, las entidades
correctas aún frescas se reutilizan y solo las ausentes necesitan red. La página de
archivo usa otra clave que incluye sus parámetros remotos y mantiene la página anterior
mientras llega la siguiente. Cada entidad de lista normalizada también puede sembrar su
clave de detalle, de modo que abrir una casa cargada no exige repetir su petición.

### Features y UI

Las features deciden cómo presentar y relacionar modelos internos. Los componentes
compartidos no realizan llamadas de red ni interpretan URLs de la fuente.

La página de archivo mantiene independientes carga y error de las majors y de la página
remota. Un fallo de una major no oculta las otras seis ni el archivo; un fallo de la
página tampoco elimina las majors. El grid usa enlaces construidos con el `sourceId` de
cada entidad y reserva los facts de sus cards a nombre, región, asiento, lema e identidad
de casa, sin liderazgo, estado narrativo o relaciones futuras.

La conexión de la ficha de casa recibe exclusivamente `HouseDataBundle`. Proyecta
`currentLord` como cabeza actual, expone `heir`, `founder`, `overlord` y
`cadetBranches` como relaciones con su significado original, y muestra hasta cuatro
`swornMembers` sin añadir estado, relevancia ni títulos editoriales. No llena la
cronología de mando con `founder` o `currentLord`, ni convierte `overlord` o
`cadetBranches` en casas juramentadas. Hasta que existan fuentes apropiadas, ambos
paneles permanecen en su estado vacío. El rótulo visual heredado para miembros no
cambia el origen ni la semántica de los personajes proyectados.

## Fuente actual

Base pública:

```text
https://anapioficeandfire.com/api
```

Recursos conectados:

```text
GET /characters
GET /characters/:id
GET /houses
GET /houses/:id
```

`VITE_ICE_AND_FIRE_API_URL` permite sustituir la base en desarrollo o integración,
pero no es obligatoria y no contiene secretos.

## Datos complementarios futuros

La aplicación necesitará una fuente propia para información que no está modelada o
no tiene el detalle necesario en la API pública:

- Apariciones y revelaciones por temporada y episodio.
- Nivel de spoiler de cada afirmación y evento.
- Eventos narrativos y cambios de estado.
- Relaciones familiares y políticas con periodo de validez.
- Imágenes, créditos, licencias y recursos visuales.
- Lugares, coordenadas, regiones y recorridos.
- Guerras, batallas, ejércitos y control territorial.
- Cronologías y orden relativo de acontecimientos.
- Traducciones editoriales y términos curados.

Esa fuente podrá usar PostgreSQL y Supabase si el modelo y los flujos justifican la
decisión. No se han instalado todavía.

## Integración futura de fuentes

Los servicios de dominio ya combinan datos remotos con el catálogo editorial local
antes de devolver modelos de presentación o resultados de búsqueda. La UI no debería
distinguir si un campo procede de caché, API pública o base editorial, salvo cuando
mostrar procedencia sea importante para la confianza.

Un posible flujo futuro es:

```text
API pública ───────┐
                   ├─→ composición por ID canónico → queries → UI
Catálogo editorial ┘
```

El catálogo tipado es deliberadamente pequeño y sustituible. Cuando su volumen,
edición o sincronización lo justifiquen, sus registros podrán migrarse a PostgreSQL o
Supabase conservando `characterId`, `source`, `ref` y los contratos de composición.
La migración no debe cambiar IDs, rutas ni modelos consumidos por la UI.

## Caché y sincronización

- TanStack Query proporciona caché en memoria durante esta fase.
- El lector canónico recibe `QueryClient` por inyección; no crea una segunda cache.
- Las relaciones exitosas se cachean como detalles independientes. Un fallo secundario
  no se guarda como entidad válida ni invalida las demás.
- Los scripts de `scripts/sync/` podrán importar o comprobar datos cuando exista una
  base propia.
- La persistencia local o remota requerirá una política de actualización y procedencia.
- Una respuesta cacheada no debe eludir las reglas del Spoiler Shield.

## Errores y datos incompletos

- Un campo vacío se representa como desconocido, no como una afirmación negativa.
- Una referencia ausente (`null`) se diferencia de una referencia presente cuya
  resolución falló; el segundo caso aparece en `relationFailures`.
- Una URL de relación malformada todavía se descarta durante la normalización y no
  llega al bundle. Por tanto, los conteos actuales describen referencias canónicas
  válidas, no el número literal de cadenas del DTO. Registrar diagnósticos de
  normalización queda pendiente.
- Los límites se representan como conteos omitidos, no como si la fuente tuviera menos
  relaciones.
- Los errores HTTP se traducen a mensajes en español en la interfaz.
- La indisponibilidad externa no debería bloquear en el futuro contenido ya almacenado.
- Los normalizadores no corrigen hechos del universo ni completan huecos por intuición.

## Reglas de dependencia

- `lib/api` puede depender de `config` y de tipos propios de su integración.
- `content` contiene datos editoriales y proyecciones deterministas, nunca transporte.
- `services` combina entidades, contenido y reglas puras de búsqueda.
- `lib/query` define identidad de cache; los adaptadores reciben `QueryClient` por
  inyección y los servicios de dominio reciben un `CanonicalEntityReader`.
- Las features pueden depender de modelos canónicos, servicios y funciones públicas de
  `lib/api`.
- Los componentes no importan DTOs externos.
- La capa API no depende de React, React Router ni componentes.
- Una futura base editorial debe incorporarse detrás de la misma frontera de contenido.
