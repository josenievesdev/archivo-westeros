# Identidad visual de Archivo de Westeros

## Estado

El nombre, el descriptor, el concepto y la dirección visual base están aprobados. Las
fuentes de diseño se conservan juntas en la raíz:

- [`got_poryect_pen.dev.pen`](../got_poryect_pen.dev.pen) es la fuente visual editable y
  debe inspeccionarse mediante Pencil MCP, no como texto plano.
- [`got_poryect_pen.dev.html`](../got_poryect_pen.dev.html) es la especificación técnica
  visual desktop para medidas, estilos y jerarquía `data-pencil-name`.

El HTML exportado se utiliza únicamente como referencia de desarrollo. No se importa,
no se muestra mediante `iframe` y no forma parte del bundle de producción.

La foundation de código ya incorpora tokens, tipografías, superficies, temas de casas,
primitivas reutilizables, header y navegación móvil. `01 · Home` ya está traducida a
React con búsqueda funcional y adaptación responsive; las demás pantallas siguen
siendo referencias pendientes.

## Marca, descriptor y concepto

- **Nombre:** Archivo de Westeros.
- **Descriptor:** Guía viva de los Siete Reinos.
- **Promesa:** “Nadie recuerda todos los nombres. Nosotros sí.”
- **Concepto:** piedra, brasa y pergamino.

La marca debe sentirse como un archivo vivo y una cámara de estrategia, no como una
wiki enciclopédica, un dashboard administrativo o una reproducción de la identidad
oficial de la franquicia.

## Jerarquía de fuentes

1. `got_poryect_pen.dev.pen` gobierna la referencia visual editable y la comparación.
2. `got_poryect_pen.dev.html` precisa dimensiones, espaciado, color, gradientes,
   tipografía, SVG y jerarquía desktop.
3. `/docs` gobierna producto, contenido, idioma, accesibilidad, Spoiler Shield, alcance
   y decisiones técnicas.
4. El código existente gobierna arquitectura React, rutas, modelos, normalizadores,
   TanStack Query, integración con An API of Ice and Fire y tests.

La implementación traduce el diseño sin copiar su estructura de capas ni introducir
contenido ficticio para completar datos que la API no posee.

## Pantallas de referencia

El archivo `.pen` contiene seis vistas desktop y un grupo de componentes:

- `01 · Home` — implementada: hero, buscador principal, grandes casas, personajes,
  linajes e inmersión.
- `02 · Ficha de personaje`: identidad, datos rápidos, línea de vida, vínculos y
  paneles laterales.
- `03 · Ficha de casa`: identidad temática, datos, miembros, sucesión y casas
  juramentadas.
- `04 · Sala de estrategia`: tablero de piezas para las siete grandes casas.
- `05 · Árbol de linajes`: lienzo de tres linajes, herramientas, leyenda y ficha
  contextual.
- `06 · Dirección artística`: paleta, tipografía, materiales, heráldica y principios.
- Componentes: siete sigilos, pieza de casa, pieza de fondo, tarjeta de personaje,
  nodo de linaje y barra de navegación.

## Atributos deseados

- Oscura, elegante y cinematográfica.
- Medieval refinada, nunca caricaturesca.
- Material y táctil: piedra, hierro envejecido, madera, pergamino y heráldica.
- Capaz de contrastar fuego y hielo sin depender de un único color temático.
- Sobria al presentar datos complejos.
- Espacial, como mapas antiguos, archivos de linaje y mesas de guerra.

## Tokens de color

Los valores proceden de las variables y muestras de `06 · Dirección artística`.

| Familia | Token CSS | Valor | Uso principal |
| --- | --- | --- | --- |
| Piedra | `--color-void` | `#08090B` | Fondo raíz |
| Piedra | `--color-stone` | `#101216` | Secciones y fondos estructurales |
| Piedra | `--color-slab` | `#171A1F` | Tarjetas y paneles |
| Piedra | `--color-relief` | `#1E2229` | Superficie elevada |
| Línea | `--color-etch` | `#2A2F38` | Bordes grabados |
| Línea | `--color-etched-gold` | `#4A3C1E` | Filetes y ornamento noble |
| Pergamino | `--color-bone` | `#EDE6D6` | Texto principal |
| Pergamino | `--color-parchment` | `#B9B0A0` | Texto narrativo y secundario |
| Pergamino | `--color-ash` | `#7C7566` | Metadatos no esenciales |
| Metal | `--color-gold` | `#C9A44C` | Acción y jerarquía noble |
| Metal | `--color-old-gold` | `#8A6E2A` | Bordes y estados contenidos |
| Fuego | `--color-ember` | `#C4452A` | Brasa y acento cálido |
| Fuego | `--color-flame` | `#E8632F` | Llama y énfasis puntual |
| Hielo | `--color-ice` | `#8FB3C7` | Acento frío |
| Sangre | `--color-blood` | `#6E1F1A` | Fondo o énfasis crítico |

`#7FBF8A` y `#C97F78`, también presentes en el diseño, se reservan para estados
positivos y negativos. Ceniza, oro viejo y brasa no se usan como texto pequeño cuando
su contraste resulta insuficiente; en esos casos se eleva el texto a pergamino o
hueso sin alterar la atmósfera.

## Tipografía

Solo se cargan los pesos necesarios:

- **Cinzel 400/600:** títulos, nombres de casas y personajes, hitos ceremoniales.
- **Cormorant Garamond 400/italic:** narrativa, lemas, citas y descripciones.
- **Inter 400/600:** navegación, botones, datos, labels y controles.

El texto funcional parte de 16 px en móvil. Los tamaños de 8 a 11 px observados en el
desktop del `.pen` solo se conservan en metadatos no esenciales cuando el contraste y
el contexto lo permiten.

## Superficies, bordes y sombras

- El fondo raíz es Vacío; Piedra organiza secciones; Losa contiene información; y
  Relieve comunica elevación.
- El radio predominante es de 2 px. Los círculos se reservan para sigilos, avatares y
  controles que necesitan esa forma.
- Los bordes usan Grabado. El oro no rodea cada tarjeta y se reserva para acción,
  selección o nobleza.
- Las sombras son profundas y escasas: buscador principal y superficies realmente
  elevadas.
- Los gradientes simulan metal, luz o profundidad. No se usan como decoración sin
  función.

## Sistema visual por casas

La misma estructura cambia mediante `data-house` y variables CSS. No existen
componentes duplicados por casa.

| Casa | Acento | Material de referencia |
| --- | --- | --- |
| Stark | `#C9D4DA` | Granito frío |
| Lannister | `#D9B45C` | Oro envejecido |
| Targaryen | `#C8452B` | Obsidiana |
| Baratheon | `#C08A45` | Bronce |
| Greyjoy | `#94A6AB` | Hierro y sal |
| Tyrell | `#A8BE7C` | Piedra noble |
| Martell | `#E08A3C` | Arenisca |

Cada tema define acento, sombra, brillo, tono medio y profundidad del metal. La pieza
de casa usa esas variables para halo, sigilo, incrustación y pedestal. Su API separa
la representación visual de nombre, lema y región para admitir en el futuro SVG,
imagen o Three.js sin duplicar la semántica.

## Materiales y atmósferas

### Piedra e hierro

Aportan estructura, peso y permanencia. Las texturas deben usarse como capas sutiles y
no reducir la legibilidad del texto.

### Fuego e hielo

Representan fuerzas narrativas y estados ambientales. No deben convertirse en un
gradiente decorativo constante ni asociarse arbitrariamente a toda interacción.

### Humo, nieve y ceniza

Son recursos de profundidad y transición. Su movimiento debe poder reducirse o
desactivarse, y nunca ocultar información.

### Mapas y pergamino

Pueden orientar navegación, geografía y cronologías. Se evitará el aspecto de papel
amarillo genérico aplicado a todas las superficies.

### Heráldica

Los símbolos organizan identidad y relaciones. La foundation usa las equivalencias
Lucide presentes en el `.pen` como marcas abstractas de interfaz; no pretende sustituir
heráldica oficial ni inventar escudos para datos ausentes.

## Composición responsive

La dirección desktop conserva el contenedor de 1224 px dentro de un lienzo de 1440 px.
La implementación es mobile-first y parte de 375, 390 y 430 px antes de ampliar en
768, 1024 y 1440 px.

Los cortes de contenido de 1200 px para el tablero de casas y 1264 px para las cinco
tarjetas complementan esos viewports de revisión y evitan recortes intermedios.

- Móvil usa gutters de 20 px, tarjetas de personaje horizontales y navegación inferior
  compacta.
- Tablet amplía gutters, convierte rejillas a dos columnas y retira la navegación
  inferior desde 768 px.
- Escritorio recupera la barra ceremonial, rejillas más densas y el ancho de contenido
  del diseño.
- Los objetivos táctiles importantes miden al menos 44 px.
- Ninguna función depende de hover; hover solo refuerza el estado en dispositivos que
  lo soportan.
- La navegación inferior respeta `env(safe-area-inset-bottom)`.

## Movimiento

- Las transiciones comunican foco, selección o elevación y se mantienen entre 180 y
  220 ms.
- Los efectos ambientales deben ser discretos en reposo.
- `prefers-reduced-motion: reduce` elimina animaciones y reduce transiciones.
- Ninguna información esencial depende de animación, hover o 3D.

## Principios extraídos del diseño

- Una sola fuente de luz contextual: fuego o hielo, nunca ambas como ruido permanente.
- Tres niveles de oscuridad antes de introducir color.
- Oro solo para acción y jerarquía noble.
- Ornamento en bordes, nunca sobre texto.
- Movimiento lento y pesado, como piedra que se desplaza.
- Cada casa cambia la temperatura de la interfaz, no su estructura.

## Evitar

- Diseño SaaS con sidebar administrativa, métricas y tarjetas genéricas.
- Fantasía medieval caricaturesca o aspecto de videojuego móvil.
- Texturas fuertes detrás de párrafos largos.
- Exceso de dorado, biseles, runas o decoración sin función.
- Uso simultáneo de fuego, nieve, humo y partículas como demostración técnica.
- Copiar pantallas completas como imágenes o copiar spoilers del `.pen` como contenido.
- Sonido automático, controles inertes o interacciones que dependan solo de hover.

## Aplicación progresiva

La foundation actual sirve como contrato visual y Home es la primera traducción
completa. Las pantallas restantes se construirán por feature cuando sus datos, estados,
reglas editoriales y adaptación móvil estén definidos. La fidelidad desktop no
justifica romper arquitectura, accesibilidad o rendimiento.
