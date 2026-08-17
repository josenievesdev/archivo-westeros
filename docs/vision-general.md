# Visión general

## Propósito

**Archivo de Westeros**, Guía viva de los Siete Reinos, quiere ayudar a una persona a
comprender **Game of Thrones** mientras ve la serie. “Nadie recuerda todos los nombres.
Nosotros sí.” resume su promesa: resolver con rapidez quién es un personaje, a qué casa
pertenece, qué relación tiene con otra persona y qué títulos o lealtades posee, sin
obligar a recorrer una wiki extensa.

La consulta rápida es el punto de entrada. La visión completa es una experiencia
visual y espacial inspirada en mapas, castillos, linajes y mesas de guerra.
Su lenguaje material se resume en piedra, brasa y pergamino.

## Problema

La historia combina una gran cantidad de nombres, alias, matrimonios, parentescos,
juramentos, territorios y conflictos. Las herramientas existentes suelen presentar
todo el conocimiento a la vez, separar los datos de su contexto narrativo o revelar
eventos que el espectador todavía no ha visto.

El producto debe reducir tres fricciones:

- El tiempo necesario para reconocer a una persona o casa.
- La dificultad de comprender relaciones familiares y políticas.
- El riesgo de encontrar spoilers al buscar una respuesta sencilla.

## Experiencia objetivo

La aplicación no debe sentirse como una tabla de administración ni como una wiki
tradicional. La información debe poder explorarse a través de fichas, linajes,
cronologías, mapas y relaciones visuales. La inmersión debe reforzar la comprensión,
no competir con ella.

Una sesión típica podría ser:

1. El usuario indica la temporada y el episodio que está viendo.
2. Busca a Jon Snow, Daenerys Targaryen o una casa por nombre o alias.
3. Obtiene una ficha breve, segura para su punto de avance.
4. Abre familia, lealtades, ubicaciones o cronología si necesita más contexto.
5. Regresa al episodio sin haber recorrido contenido irrelevante.

El teléfono es el dispositivo prioritario para esta sesión. La interfaz debe poder
consultarse con una mano, interrumpir lo mínimo y ofrecer más densidad de información
solo cuando el viewport y el contexto lo permiten.

## Pilares

### Consulta inmediata

El buscador global debe ser rápido y tolerar nombres, casas, títulos y alias. Las
fichas deben priorizar identidad, familia, lealtad, estado, temporadas y actor.

### Mobile-first

La composición parte de 375, 390 y 430 px. Tablet y escritorio amplían la experiencia;
no reciben una versión móvil obtenida al comprimir el diseño desktop. Las acciones
esenciales deben tener objetivos táctiles cómodos y funcionar sin hover.

### Comprensión de relaciones

Los árboles genealógicos, vínculos políticos y cambios de lealtad deben convertir
listas complejas en estructuras comprensibles.

### Control de spoilers

El futuro Spoiler Shield debe filtrar información por temporada y episodio. No será
solo un aviso visual: la capa de datos deberá conocer desde cuándo es segura cada
afirmación o evento.

### Exploración espacial y temporal

El mapa de Westeros y las cronologías deberán conectar lugares, viajes, batallas,
personajes y casas sin inventar información ausente de las fuentes.

### Inmersión con propósito

Piedra, hierro, fuego, hielo, nieve, humo, audio y transiciones pueden crear atmósfera.
Los efectos deberán ser discretos, accesibles, opcionales y compatibles con el
rendimiento del dispositivo.

## Capacidades previstas

- Fichas de personajes con nombres, alias, títulos, familia, relaciones, lealtades,
  estado, temporadas y actor.
- Fichas de casas con región, lema, señor, heredero, vasallaje, miembros y armas.
- Árboles genealógicos interactivos y recorridos de linaje.
- Cronologías por personaje, casa, guerra y ubicación.
- Relaciones políticas y cambios de alianzas.
- Mapa interactivo de Westeros.
- Mesa de guerra con casas, ejércitos, conflictos y piezas tipo ajedrez.
- Ambientación sonora y visual por contexto.
- Interacciones especiales, incluida una posible experiencia Dracarys.

## Principios de producto

- La claridad está por encima del espectáculo.
- El usuario controla spoilers, audio y nivel de efectos.
- Los nombres propios conservan su forma original.
- Los datos externos se verifican y se distinguen del contenido editorial propio.
- Las ideas inmersivas se incorporan solo cuando existe una utilidad concreta.
- La arquitectura crece por necesidades reales, no por anticipación.
- Mobile-first es un criterio permanente de producto, no una optimización posterior.

## Estado de la visión

La foundation actual valida navegación, obtención de personajes y casas, modelos
internos, herramientas de calidad y un primer sistema visual reusable. La dirección
visual principal está definida en `got_poryect_pen.dev.pen`; su traducción al producto
es progresiva y las pantallas completas y capacidades avanzadas permanecen pendientes.
