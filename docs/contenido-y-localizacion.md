# Contenido y localización

## Idioma principal

La interfaz, navegación, mensajes del sistema y documentación interna se escriben en
español. El objetivo es que una persona hispanohablante comprenda la aplicación sin
traducir mentalmente sus controles.

## Nombres propios

Los nombres propios del universo conservan su forma original. No se traducen casas,
personajes ni lugares únicamente porque exista una palabra equivalente en español.

Ejemplos que deben mantenerse:

- Stark
- Lannister
- Targaryen
- Baratheon
- Greyjoy
- Martell
- Tyrell
- Winterfell
- King's Landing
- The Wall
- Jon Snow
- Daenerys Targaryen

También pueden conservarse términos icónicos cuando su forma original sea parte de
la identidad, como Dracarys, Lords o Iron Throne. La elección debe ser coherente en
toda la interfaz y registrarse en el glosario cuando genere dudas.

## Contenido procedente de APIs

Los valores devueltos por An API of Ice and Fire no se traducen en el normalizador.
Normalizar significa limpiar vacíos, separar referencias y adaptar tipos, no alterar
el significado editorial. La capa de contenido ofrece traducciones curadas sin perder
el valor original.

`LocalizedValue<T>` registra cuatro datos: `original`, `value`, locale `es` y método
`dictionary`, `pattern` u `original`. Los modelos canónicos conservan siempre el texto
normalizado de la fuente; los componentes consumen una proyección de UI.

## Cobertura inicial

`src/content/character_localization.ts` contiene la primera cobertura determinista:

- Culturas frecuentes, como `Northmen` → `Norteños`.
- Títulos y aliases curados, como `Mother of Dragons` → `Madre de Dragones`.
- Temporadas con el patrón `Season N` → `Temporada N`.
- Fechas conocidas de la API, como `In 284 AC, at Dragonstone` →
  `En 284 d. C., en Dragonstone`.

En este contexto `d. C.` significa “después de la Conquista”. Los lugares y nombres
propios dentro de una frase se conservan. Un patrón desconocido vuelve al texto
original completo; no se traducen fragmentos por intuición.

La cobertura inicial se aplica a cultura, aliases, títulos y nacimiento en la ficha
básica de personaje. Actor y nombres propios permanecen sin cambios.

## Búsqueda bilingüe

El catálogo editorial registra términos de búsqueda en español e inglés vinculados a
un ID canónico. La normalización de consulta ignora mayúsculas, espacios repetidos,
signos y tildes, pero el texto visible conserva su ortografía.

Los términos editoriales solo ayudan a localizar una entidad remota. Nunca se
renderizan como un personaje independiente. Los homónimos se conservan y se ordenan
por coincidencia y prioridad editorial.

Los nombres no catalogados se consultan con la capitalización exacta que requiere la
fuente, tolerando la entrada del usuario en mayúsculas, minúsculas o sin tildes. La
búsqueda parcial por alias/título está limitada al catálogo curado hasta disponer de
un índice sincronizado del archivo completo.

## Reglas de redacción

- Usar frases cortas y directas para estados, errores y acciones.
- Evitar lenguaje técnico en la interfaz cuando no ayuda al usuario.
- Distinguir entre “no indicado” y “no existe”; la ausencia de datos no prueba un
  hecho del universo.
- No inventar nombres, relaciones, lemas, eventos ni ubicaciones para rellenar huecos.
- Usar terminología consistente para casa, personaje, linaje, lealtad y relación.
- Mantener tildes y signos propios del español en contenido visible.

## Estados del sistema

Patrones iniciales:

| Situación | Texto recomendado |
| --- | --- |
| Carga | `Cargando personajes...` |
| Error remoto | `No fue posible obtener los personajes.` |
| Dato vacío | `No indicado` / `No indicada` |
| Lista vacía | `No hay resultados para esta búsqueda.` |
| Ruta ausente | `Ruta no encontrada` |

Los errores deben explicar el efecto y, cuando sea posible, la recuperación. No deben
mostrar trazas ni términos internos de la API.

## Glosario futuro

`src/content/glossary/` podrá contener decisiones terminológicas que afecten a la UI. Cada
entrada debería registrar forma preferida, variantes admitidas, contexto y fuente.
No se añadirá un sistema de internacionalización hasta que exista un segundo idioma o
una necesidad real de gestionar catálogos de mensajes.

## Spoilers y redacción

Una descripción puede ser un spoiler aunque no incluya una fecha. El contenido futuro
deberá etiquetarse por temporada y episodio a nivel de afirmación o evento, no solo a
nivel de página. Los resultados de búsqueda, títulos y estados también deben pasar por
el filtro de spoilers.
