import type { WarRoomViewModel } from './war-room.types'

/**
 * FIXTURE DE DISEÑO — NO ES PRODUCCIÓN.
 *
 * Reproduce literalmente el contenido del frame `04 · Sala de estrategia` de Pen
 * para poder validar la fidelidad visual sin depender de la API.
 *
 * No es fuente canónica, no se mezcla con la capa de datos y desaparecerá en
 * cuanto la sala reciba un `WarRoomViewModel` real. Los `sourceId` de las rutas
 * sí son los de An API of Ice and Fire, para que los enlaces funcionen ya.
 */
export const warRoomFixture: WarRoomViewModel = {
  description:
    'Siete piezas sobre la mesa. Pesa cada una: cuántos quedan vivos, cuánto territorio sostienen y a quién le deben lealtad.',
  eyebrow: 'Sala de estrategia',
  houses: [
    {
      displayName: 'Stark',
      figures: {
        alive: '11 vivos',
        members: '48 miembros',
        standing: { label: 'En pie', state: 'standing' },
      },
      id: 'stark',
      region: 'The North · Winterfell',
      theme: 'stark',
      to: '/casas/362',
      words: '“Winter is coming”',
    },
    {
      displayName: 'Lannister',
      figures: {
        alive: '6 vivos',
        members: '37 miembros',
        standing: { label: 'En pie', state: 'standing' },
      },
      id: 'lannister',
      region: 'The Westerlands · Casterly Rock',
      theme: 'lannister',
      to: '/casas/229',
      words: '“Hear me roar”',
    },
    {
      displayName: 'Targaryen',
      figures: {
        alive: '0 vivos',
        members: '41 miembros',
        standing: { label: 'Extinta', state: 'extinct' },
      },
      id: 'targaryen',
      region: 'Dragonstone · King’s Landing',
      theme: 'targaryen',
      to: '/casas/378',
      words: '“Fire and blood”',
    },
    {
      displayName: 'Baratheon',
      figures: {
        alive: '0 vivos',
        members: '19 miembros',
        standing: { label: 'Extinta', state: 'extinct' },
      },
      id: 'baratheon',
      region: 'The Stormlands · Storm’s End',
      theme: 'baratheon',
      to: '/casas/17',
      words: '“Ours is the fury”',
    },
    {
      displayName: 'Greyjoy',
      figures: {
        alive: '3 vivos',
        members: '24 miembros',
        standing: { label: 'En pie', state: 'standing' },
      },
      id: 'greyjoy',
      region: 'Iron Islands · Pyke',
      theme: 'greyjoy',
      to: '/casas/169',
      words: '“We do not sow”',
    },
    {
      displayName: 'Tyrell',
      figures: {
        alive: '0 vivos',
        members: '22 miembros',
        standing: { label: 'Extinta', state: 'extinct' },
      },
      id: 'tyrell',
      region: 'The Reach · Highgarden',
      theme: 'tyrell',
      to: '/casas/398',
      words: '“Growing strong”',
    },
    {
      displayName: 'Martell',
      figures: {
        alive: '2 vivos',
        members: '18 miembros',
        standing: { label: 'Diezmada', state: 'decimated' },
      },
      id: 'martell',
      region: 'Dorne · Sunspear',
      theme: 'martell',
      to: '/casas/285',
      words: '“Unbowed, unbent, unbroken”',
    },
  ],
  title: 'El tablero completo',
}
