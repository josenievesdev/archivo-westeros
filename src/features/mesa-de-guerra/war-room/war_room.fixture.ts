import type { WarRoomViewModel } from './war-room.types'

/**
 * FIXTURE DE DISEÑO — NO ES PRODUCCIÓN Y NO ES CANON.
 *
 * Reproduce la composición del frame `04 · Sala de estrategia` de Pen para poder
 * validar la fidelidad visual sin depender de la API.
 *
 * SPOILERS: las cifras de Pen (`11 vivos`, `EN PIE`, `EXTINTA`, `DIEZMADA`)
 * describen el desenlace de guerras y muertes, así que aquí no se usan. Mientras
 * no exista Spoiler Shield, esta pantalla solo enseña datos estructurales del
 * archivo —cuántos registros guarda y si la casa es una de las mayores—, que no
 * dependen del punto de la historia en el que vaya quien mira.
 *
 * Los recuentos de miembros son los del diseño de Pen: cuentan fichas del
 * archivo, no supervivientes, y no pretenden representar el estado canónico de
 * ninguna casa. Los `sourceId` de las rutas sí son los de An API of Ice and
 * Fire, para que los enlaces funcionen ya.
 *
 * Son dos cifras y no las tres de Pen porque una tercera obligaba a textos más
 * largos que el original: la fila se partía en dos líneas y empujaba el tablero
 * once píxeles. La geometría aprobada manda sobre el número de posiciones.
 */
export const warRoomFixture: WarRoomViewModel = {
  /* La bajada de Pen pregunta «cuántos quedan vivos»: también anticipa muertes,
     así que aquí pesa el archivo en vez del recuento de supervivientes. Mantiene
     la longitud del original para no alterar las dos líneas del frame. */
  description:
    'Siete piezas sobre la mesa. Pesa cada una: cuántos nombres reúne, qué territorio sostiene y a quién le debe lealtad.',
  eyebrow: 'Sala de estrategia',
  houses: [
    {
      displayName: 'Stark',
      figures: [
        { label: 'Miembros', value: '48 miembros' },
        { label: 'Rango', value: 'Casa mayor', tone: 'accent' },
      ],
      id: 'stark',
      region: 'The North · Winterfell',
      theme: 'stark',
      to: '/casas/362',
      words: '“Winter is coming”',
    },
    {
      displayName: 'Lannister',
      figures: [
        { label: 'Miembros', value: '37 miembros' },
        { label: 'Rango', value: 'Casa mayor', tone: 'accent' },
      ],
      id: 'lannister',
      region: 'The Westerlands · Casterly Rock',
      theme: 'lannister',
      to: '/casas/229',
      words: '“Hear me roar”',
    },
    {
      displayName: 'Targaryen',
      figures: [
        { label: 'Miembros', value: '41 miembros' },
        { label: 'Rango', value: 'Casa mayor', tone: 'accent' },
      ],
      id: 'targaryen',
      region: 'Dragonstone · King’s Landing',
      theme: 'targaryen',
      to: '/casas/378',
      words: '“Fire and blood”',
    },
    {
      displayName: 'Baratheon',
      figures: [
        { label: 'Miembros', value: '19 miembros' },
        { label: 'Rango', value: 'Casa mayor', tone: 'accent' },
      ],
      id: 'baratheon',
      region: 'The Stormlands · Storm’s End',
      theme: 'baratheon',
      to: '/casas/17',
      words: '“Ours is the fury”',
    },
    {
      displayName: 'Greyjoy',
      figures: [
        { label: 'Miembros', value: '24 miembros' },
        { label: 'Rango', value: 'Casa mayor', tone: 'accent' },
      ],
      id: 'greyjoy',
      region: 'Iron Islands · Pyke',
      theme: 'greyjoy',
      to: '/casas/169',
      words: '“We do not sow”',
    },
    {
      displayName: 'Tyrell',
      figures: [
        { label: 'Miembros', value: '22 miembros' },
        { label: 'Rango', value: 'Casa mayor', tone: 'accent' },
      ],
      id: 'tyrell',
      region: 'The Reach · Highgarden',
      theme: 'tyrell',
      to: '/casas/398',
      words: '“Growing strong”',
    },
    {
      displayName: 'Martell',
      figures: [
        { label: 'Miembros', value: '18 miembros' },
        { label: 'Rango', value: 'Casa mayor', tone: 'accent' },
      ],
      id: 'martell',
      region: 'Dorne · Sunspear',
      theme: 'martell',
      to: '/casas/285',
      words: '“Unbowed, unbent, unbroken”',
    },
  ],
  title: 'El tablero completo',
}
