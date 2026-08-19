import type { CharacterDetailViewModel } from './character-detail.types'

/**
 * FIXTURE DE DISEÑO — NO ES PRODUCCIÓN.
 *
 * Existe para validar la fidelidad visual de `02 · Ficha de personaje` sin
 * depender de la API. No es fuente canónica, no se mezcla con la capa de datos
 * y desaparece en cuanto la ficha reciba un ViewModel real construido desde
 * `CanonicalCharacter` + `CharacterMedia`.
 *
 * ------------------------------------------------------------------------
 * SEGURIDAD ANTE SPOILERS
 * ------------------------------------------------------------------------
 * El frame de Pen usa a Jon Snow con contenido de temporadas tardías: linaje
 * secreto, cargos posteriores, muertes, resurrecciones y lealtades finales.
 * La geometría de ese frame es válida; su contenido no.
 *
 * Este fixture conserva la identidad visual (Jon Snow, casa Stark, el Norte)
 * porque es la que fija las proporciones del Hero, pero **reescribe todo el
 * contenido** con material neutral de diseño acotado a lo ya emitido hasta el
 * final de la temporada 3. No hay identidades secretas, parentescos revelados,
 * títulos posteriores, muertes, resurrecciones ni cronología completa.
 *
 * Nada de lo que hay aquí debe presentarse como hecho canónico.
 */

/**
 * Retrato de desarrollo.
 *
 * Vive fuera del JSX y fuera de la vista a propósito: la ficha nunca importa
 * ThronesAPI ni ninguna otra fuente, solo recibe `media` por props. Cuando la
 * conexión real esté hecha, esta constante se borra y el retrato lo aporta
 * `CharacterMedia`.
 */
const DESIGN_FIXTURE_PORTRAIT_URL =
  'https://thronesapi.com/assets/images/jon-snow.jpg'

export const characterDetailDesignFixture: CharacterDetailViewModel = {
  actions: [
    { icon: 'lineage', id: 'lineage', label: 'Ver su linaje', to: '/linajes', tone: 'primary' },
    { icon: 'house', id: 'house', label: 'Ir a House Stark', to: '/casas' },
    { icon: 'compare', id: 'compare', label: 'Comparar', to: '/personajes' },
  ],
  ambient: {
    // Solo bloque visual: no hay audio, no hay autoplay, no hay descargas.
    available: false,
    subtitle: 'Ambiente del Norte · 3:12',
    title: 'Viento en el Muro',
  },
  badges: [
    { id: 'status', label: 'Vivo', tone: 'alive' },
    { id: 'watch', label: 'Guardia de la Noche' },
    { id: 'bastard', label: 'Bastardo de Winterfell' },
    { id: 'steward', label: 'Mayordomo del Lord Comandante' },
  ],
  description:
    'Criado en Winterfell entre los hijos de Ned Stark sin llevar su apellido, tomó el negro y viajó al Norte para servir en la Guardia de la Noche. Su lugar en el archivo se explica por lo que decide, no por lo que hereda.',
  displayName: 'Jon Snow',
  facts: [
    { icon: 'house', label: 'Casa', value: 'Stark' },
    { icon: 'status', label: 'Estado', value: 'Vivo' },
    { icon: 'birth', label: 'Nacimiento', value: '283 AC' },
    { icon: 'region', label: 'Región', value: 'The North' },
    { icon: 'role', label: 'Cargo', value: 'Mayordomo' },
    { icon: 'actor', label: 'Actor', value: 'Kit Harington' },
  ],
  family: [
    { id: 'household', label: 'Casa de crianza', tone: 'ice', value: 'House Stark' },
    { id: 'home', label: 'Hogar', value: 'Winterfell' },
    { id: 'siblings', label: 'Criado con', value: 'Robb, Sansa, Arya, Bran, Rickon' },
    { id: 'order', label: 'Orden', tone: 'muted', value: 'La Guardia de la Noche' },
    { id: 'seat', label: 'Destino', value: 'Castle Black' },
    { id: 'issue', label: 'Descendencia', tone: 'muted', value: 'Ninguna registrada' },
  ],
  house: { label: 'House Stark', theme: 'stark', to: '/casas' },
  id: 'design-fixture-character',
  loyalties: [
    {
      id: 'stark',
      name: 'House Stark',
      note: 'Crianza y nombre prestado',
      period: '283 – 298 AC',
      strength: 1,
      tone: 'ice',
    },
    {
      id: 'watch',
      name: 'La Guardia de la Noche',
      note: 'Votos tomados en Castle Black',
      period: '298 AC – …',
      strength: 0.7,
      tone: 'gold',
    },
    {
      id: 'north',
      name: 'El Norte',
      note: 'Deber heredado del lugar, no del título',
      period: '283 AC – …',
      strength: 0.45,
      tone: 'muted',
    },
  ],
  media: {
    altText: 'Retrato de Jon Snow',
    caption: 'Retrato · Archivo visual',
    portraitUrl: DESIGN_FIXTURE_PORTRAIT_URL,
  },
  origin: 'criado en Winterfell',
  relationships: [
    { id: 'ned', initials: 'NS', kind: 'Casa de crianza', name: 'Ned Stark', signal: 'known', tone: 'ice' },
    { id: 'robb', initials: 'RS', kind: 'Criado con él', name: 'Robb Stark', signal: 'known' },
    { id: 'arya', initials: 'AS', kind: 'Criada con él', name: 'Arya Stark', signal: 'known' },
    { id: 'benjen', initials: 'BS', kind: 'Lo precede en la Guardia', name: 'Benjen Stark', signal: 'unknown', tone: 'muted' },
    { id: 'samwell', initials: 'ST', kind: 'Hermano juramentado', name: 'Samwell Tarly', signal: 'known' },
    { id: 'aemon', initials: 'MA', kind: 'Maestre de Castle Black', name: 'Maester Aemon', signal: 'watched', tone: 'gold' },
  ],
  relationshipsCopy: {
    caption: 'Quién lo crió, quién lo acompaña y quién lo mide.',
    title: 'Vínculos',
  },
  seasons: [
    { available: true, id: 't1', label: '1' },
    { available: true, id: 't2', label: '2' },
    { available: true, current: true, id: 't3', label: '3' },
  ],
  seasonsNote: 'Solo se listan las temporadas ya abiertas en el archivo.',
  secondaryName: 'Lord Snow',
  timeline: [
    {
      description:
        'Crece en una casa que lo alimenta y lo educa, pero que no le da su apellido. Aprende pronto que su sitio en la mesa es prestado.',
      id: 'raised',
      label: '283 AC',
      title: 'Criado en una casa que no lleva su nombre',
      tone: 'ice',
    },
    {
      description:
        'Renuncia a tierras, títulos y descendencia. La orden no pregunta de quién eres hijo, y esa es exactamente la razón por la que va.',
      id: 'oath',
      label: '298 AC',
      title: 'Se une a una orden',
      tone: 'ice',
    },
    {
      description:
        'El camino al Muro le enseña que el mundo que conocía terminaba en las puertas de Winterfell.',
      id: 'journey',
      label: '298 AC',
      title: 'Viaja al Norte',
      tone: 'muted',
    },
    {
      description:
        'Deja de ser un recluta y empieza a responder por otros. El cargo es pequeño; la costumbre de decidir, no.',
      id: 'duty',
      label: '299 AC',
      title: 'Asume nuevas responsabilidades',
      tone: 'gold',
    },
    {
      description:
        'Más allá del Muro descubre que el enemigo que le enseñaron a temer no es el único que hay.',
      id: 'beyond',
      label: '299 AC',
      title: 'Cruza una frontera',
      tone: 'ember',
    },
    {
      description:
        'Vuelve con información que nadie quiere escuchar y con la certeza de que el deber y la lealtad no siempre apuntan al mismo sitio.',
      id: 'return',
      label: '300 AC',
      title: 'Regresa con una advertencia',
      tone: 'gold',
    },
  ],
  timelineCopy: {
    caption: 'Seis momentos que explican quién es, hasta donde alcanza el archivo.',
    title: 'Línea de vida',
  },
}
