# Archivo de Westeros

**Guía viva de los Siete Reinos**

> Nadie recuerda todos los nombres. Nosotros sí.

Aplicación web mobile-first para consultar y comprender personajes, casas y
relaciones del universo de **Game of Thrones / A Song of Ice and Fire** mientras se
ve la serie. Su concepto visual es **piedra, brasa y pergamino**.

> **Estado:** foundation técnica y visual. La identidad base está definida; las
> pantallas completas y las capacidades avanzadas siguen en desarrollo.

## Qué problema resuelve

El universo presenta muchos personajes, alias, títulos, parentescos, lealtades,
lugares y conflictos. Buscar cada dato en una wiki tradicional suele romper el ritmo
del episodio y puede revelar información posterior. El proyecto pretende ofrecer
respuestas rápidas, visuales y contextualizadas sin perder la sensación de estar
explorando Westeros.

## Propuesta

- Consultas claras de personajes, casas, títulos, familia y lealtades.
- Experiencia mobile-first para consultas breves durante un episodio, ampliada
  progresivamente en tablet y escritorio.
- Navegación visual por linajes, cronologías, mapas y relaciones políticas.
- Un futuro **Spoiler Shield** ajustado por temporada y episodio.
- Una experiencia progresivamente inmersiva con audio, ambiente, fuego, hielo,
  humo, nieve y una mesa de guerra.
- Una capa de datos propia que pueda complementar o sustituir fuentes externas sin
  acoplar la interfaz a ellas.

No se plantea como una wiki enciclopédica ni como un dashboard SaaS. El objetivo a
largo plazo es una herramienta de consulta con identidad narrativa y espacial.

## Alcance actual

La primera etapa incluye:

- Aplicación React y TypeScript construida con Vite.
- Navegación para inicio, personajes, casas y rutas futuras.
- Integración mínima con personajes y casas de An API of Ice and Fire.
- Separación entre respuestas externas, normalizadores y modelos internos.
- Caché y ciclo de peticiones mediante TanStack Query.
- Tailwind CSS v4 para la base de estilos.
- Tokens, tipografías, temas de casas y primitivas visuales extraídos de la referencia
  aprobada de pen.dev.
- Header responsive y navegación móvil inferior con safe areas.
- Tests mínimos de render y normalización.
- Documentación de visión, datos, diseño, roadmap y decisiones técnicas.

No incluye todavía Supabase, Three.js, persistencia propia, modelos 3D, audio,
Spoiler Shield completo, motor global de búsqueda ni las pantallas completas de la
referencia visual.

## Stack

| Área | Tecnología |
| --- | --- |
| Interfaz | React 19 + TypeScript |
| Desarrollo y build | Vite 8 |
| Estilos | Tailwind CSS v4 |
| Rutas | React Router 7 |
| Estado remoto | TanStack Query 5 |
| Iconografía | Lucide React |
| Tests | Vitest + Testing Library + jsdom |
| Lint | Oxlint |
| Gestor de paquetes | npm |

## Requisitos

- Node.js 22.12 o superior. El proyecto se inicializó y verificó con Node.js 24.
- npm 10 o superior.

## Instalación

```bash
npm install
```

La API pública funciona con la URL predeterminada y no requiere secretos. Para
sobrescribirla de forma local se puede crear `.env` a partir de `.env.example`.

## Ejecución

```bash
npm run dev
```

Vite mostrará la URL local. Para revisar una compilación de producción:

```bash
npm run build
npm run preview
```

## Scripts

| Script | Propósito |
| --- | --- |
| `npm run dev` | Inicia Vite con recarga en caliente. |
| `npm run build` | Valida TypeScript y crea `dist/`. |
| `npm run preview` | Sirve localmente el build de producción. |
| `npm test` | Ejecuta los tests una vez. |
| `npm run test:watch` | Ejecuta Vitest en modo interactivo. |
| `npm run lint` | Analiza el proyecto con Oxlint. |
| `npm run typecheck` | Comprueba tipos sin emitir archivos. |

## Estructura

```text
realms-got/
├── got_poryect_pen.dev.pen  # Fuente visual principal, inspeccionada con Pencil MCP
├── docs/                    # Visión, roadmap y decisiones
├── public/                  # Audio, iconos, imágenes y texturas futuras
├── scripts/                 # Sincronización y semillas futuras
└── src/
    ├── app/                 # Layout, providers y router
    ├── assets/              # Recursos importados por el bundler
    ├── components/          # UI compartida y piezas genéricas
    ├── config/              # Configuración de entorno
    ├── content/             # Copy y glosario localizable
    ├── features/            # Módulos orientados al producto
    ├── hooks/               # Hooks realmente compartidos
    ├── lib/                 # API, normalizadores, búsqueda y utilidades
    ├── services/            # Integraciones de infraestructura futuras
    ├── store/               # Estado cliente futuro, solo si resulta necesario
    ├── styles/              # Estilos globales y entrada de Tailwind
    └── types/               # Tipos transversales
```

Cada feature contiene un README con su objetivo, datos necesarios, alcance futuro y
estado. La carpeta no implica que la funcionalidad ya esté implementada.

## Arquitectura de datos

```text
An API of Ice and Fire
        ↓
Cliente HTTP y endpoints
        ↓
DTOs externos
        ↓
Normalizadores
        ↓
Modelos internos
        ↓
TanStack Query
        ↓
Features y UI
```

Los componentes nunca consumen directamente la forma original de la API. Esta
frontera permite añadir caché persistente, datos editoriales o una fuente propia sin
reescribir la interfaz. Consulta [docs/arquitectura-datos.md](docs/arquitectura-datos.md).

## Rutas disponibles

| Ruta | Estado |
| --- | --- |
| `/` | Inicio temporal y prueba de conexión. |
| `/personajes` | Muestra inicial de personajes. |
| `/personajes/:id` | Ficha mínima de personaje. |
| `/casas` | Muestra inicial de casas. |
| `/casas/:id` | Ficha mínima de casa. |
| `/mapa` | Placeholder. |
| `/linajes` | Placeholder. |
| `/cronologia` | Placeholder. |
| `/mesa-de-guerra` | Placeholder. |
| `/mas` | Hub compacto para la navegación móvil. |

## Variables de entorno

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `VITE_ICE_AND_FIRE_API_URL` | No | Sobrescribe la base pública de la API. |

No se han añadido variables ficticias de Supabase ni secretos que todavía no
existen.

## Fuente de datos

La fuente inicial es [An API of Ice and Fire](https://anapioficeandfire.com/), con
base `https://anapioficeandfire.com/api`. En esta fase se consultan únicamente:

- `GET /characters`
- `GET /characters/:id`
- `GET /houses`
- `GET /houses/:id`

El proyecto necesitará más adelante datos editoriales propios para episodios,
spoilers, eventos, relaciones, imágenes, ubicaciones, batallas y cronologías.

## Documentación

El índice completo se encuentra en [docs/README.md](docs/README.md). La fuente visual
principal es [`got_poryect_pen.dev.pen`](got_poryect_pen.dev.pen): define apariencia,
composición desktop, jerarquía, paleta y patrones. Los documentos fijan visión,
alcance, restricciones editoriales, accesibilidad y decisiones técnicas. El código
conserva la autoridad sobre arquitectura, rutas, modelos, normalizadores, consultas y
tests.

## Aviso

Proyecto de aficionados sin afiliación oficial. Game of Thrones, A Song of Ice and
Fire y sus nombres propios pertenecen a sus respectivos titulares. Los datos de la
fuente externa conservan sus términos originales.
