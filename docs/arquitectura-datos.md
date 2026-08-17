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

## Composición editorial

`src/content/character_editorial_metadata.ts` es el catálogo tipado actual. Cada
entrada contiene una referencia editorial `realms-got`, la identidad de fuente, el ID
canónico, nombres de búsqueda en español e inglés y, cuando corresponde, datos para
destacados de Home.

La composición se realiza después de normalizar. Devuelve una entidad nueva con su
metadata y deja intactos tanto el DTO como la entidad de fuente. Por ejemplo, la
metadata de `ice-and-fire:character:1303` enriquece el personaje remoto `1303`; no
crea una tercera Daenerys ni sustituye al registro histórico `271`.

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

### TanStack Query

Los hooks de cada feature coordinan caché, carga, error, reintentos y cancelación. La
UI no repite `fetch` dentro de `useEffect`. Las claves distinguen listas, detalles y
búsquedas; el detalle usa el ID canónico en la clave aunque la petición reciba el ID
externo.

### Features y UI

Las features deciden cómo presentar y relacionar modelos internos. Los componentes
compartidos no realizan llamadas de red ni interpretan URLs de la fuente.

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
- Los scripts de `scripts/sync/` podrán importar o comprobar datos cuando exista una
  base propia.
- La persistencia local o remota requerirá una política de actualización y procedencia.
- Una respuesta cacheada no debe eludir las reglas del Spoiler Shield.

## Errores y datos incompletos

- Un campo vacío se representa como desconocido, no como una afirmación negativa.
- Los errores HTTP se traducen a mensajes en español en la interfaz.
- La indisponibilidad externa no debería bloquear en el futuro contenido ya almacenado.
- Los normalizadores no corrigen hechos del universo ni completan huecos por intuición.

## Reglas de dependencia

- `lib/api` puede depender de `config` y de tipos propios de su integración.
- `content` contiene datos editoriales y proyecciones deterministas, nunca transporte.
- `services` combina entidades, contenido y reglas puras de búsqueda.
- Las features pueden depender de modelos canónicos, servicios y funciones públicas de
  `lib/api`.
- Los componentes no importan DTOs externos.
- La capa API no depende de React, React Router ni componentes.
- Una futura base editorial debe incorporarse detrás de la misma frontera de contenido.
