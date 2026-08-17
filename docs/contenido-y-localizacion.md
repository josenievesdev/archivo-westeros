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
el significado editorial. Una futura capa de contenido podrá ofrecer traducciones
curadas sin perder el valor original.

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

`src/content/glossary/` contendrá decisiones terminológicas que afecten a la UI. Cada
entrada debería registrar forma preferida, variantes admitidas, contexto y fuente.
No se añadirá un sistema de internacionalización hasta que exista un segundo idioma o
una necesidad real de gestionar catálogos de mensajes.

## Spoilers y redacción

Una descripción puede ser un spoiler aunque no incluya una fecha. El contenido futuro
deberá etiquetarse por temporada y episodio a nivel de afirmación o evento, no solo a
nivel de página. Los resultados de búsqueda, títulos y estados también deben pasar por
el filtro de spoilers.
