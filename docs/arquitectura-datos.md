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
Modelos internos
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

- Extraen identificadores de URLs de recursos.
- Convierten cadenas vacías en `null` cuando representan ausencia.
- Eliminan elementos vacíos de listas.
- Conservan el valor textual original sin inventar ni traducir contenido.

La normalización es una transformación determinista y se prueba sin red.

### Modelos internos

`internal_types.ts` define la forma estable que consume el producto. Sus referencias
usan identificadores y su ausencia es explícita. Puede evolucionar según las
necesidades de la aplicación aunque la API externa no cambie.

### TanStack Query

Los hooks de cada feature coordinan caché, carga, error, reintentos y cancelación. La
UI no repite `fetch` dentro de `useEffect`. Las claves distinguen listas, detalles y
parámetros de consulta.

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

Los servicios de dominio podrán combinar datos remotos y propios antes de devolver el
modelo interno. La UI no debería distinguir si un campo procede de caché, API pública
o base editorial, salvo cuando mostrar procedencia sea importante para la confianza.

Un posible flujo futuro es:

```text
API pública ──────┐
                  ├─→ composición → modelo interno versionado → queries → UI
Base editorial ───┘
```

No se implementará esa composición hasta tener el primer conjunto editorial real.

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
- Las features pueden depender de modelos internos y funciones públicas de `lib/api`.
- Los componentes no importan DTOs externos.
- La capa API no depende de React, React Router ni componentes.
- Los datos editoriales futuros se incorporarán detrás de la misma frontera.
