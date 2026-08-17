import type { HouseDetailViewModel } from './house-detail.types'

/**
 * FIXTURE DE DISEÑO — NO ES PRODUCCIÓN.
 *
 * Reproduce literalmente el contenido del frame `03 · Ficha de casa` de Pen para
 * poder validar la fidelidad visual de la pantalla sin depender de la API.
 *
 * No es fuente canónica, no se mezcla con la capa de datos y desaparecerá en
 * cuanto la ficha reciba un `HouseDetailViewModel` real.
 */
export const targaryenHouseDetailFixture: HouseDetailViewModel = {
  currentHead: 'Daenerys Targaryen',
  description:
    'La última casa dragón de Valyria. Gobernaron los Siete Reinos durante casi trescientos años montando dragones, hasta que la locura y el fuego los consumieron a ellos también.',
  displayName: 'House Targaryen',
  founded: '114 AC (Valyria: −700)',
  heraldry: {
    colors: [
      { name: 'Sangre', value: '#c4452a' },
      { name: 'Sable', value: '#0e0b0a' },
      { name: 'Brasa', value: '#e8632f' },
      { name: 'Hueso', value: '#d8c9a8' },
    ],
    description: 'Dragón tricéfalo, gules, sobre sable.',
  },
  id: 'targaryen',
  leadership: [
    {
      description: 'Unió los Siete Reinos con tres dragones.',
      epithet: 'el Conquistador',
      id: 'aegon-i',
      name: 'Aegon I',
      period: '1 – 37 AC',
      tone: 'gold',
    },
    {
      description: 'Ardió a sus propios Lords. Cayó en la Rebelión de Robert.',
      epithet: 'the Mad King',
      id: 'aerys-ii',
      name: 'Aerys II',
      period: '262 – 283 AC',
      tone: 'ember',
    },
    {
      description: 'Vendió a su hermana por un ejército. Murió coronado en oro.',
      epithet: 'the Beggar King',
      id: 'viserys',
      name: 'Viserys',
      period: '283 – 298 AC',
      tone: 'bronze',
    },
    {
      description: 'Rompió cadenas y después rompió King’s Landing.',
      epithet: 'Mother of Dragons',
      id: 'daenerys',
      name: 'Daenerys',
      period: '298 – 305 AC',
      tone: 'ember',
    },
  ],
  members: [
    {
      alias: 'Mother of Dragons',
      houseLabel: 'House Targaryen',
      id: 'daenerys-targaryen',
      name: 'Daenerys Targaryen',
      status: { label: 'Muerta', state: 'dead' },
    },
    {
      alias: 'Prince of Dragonstone',
      houseLabel: 'House Targaryen',
      id: 'rhaegar-targaryen',
      name: 'Rhaegar Targaryen',
      status: { label: 'Muerto', state: 'dead' },
    },
    {
      alias: 'The Beggar King',
      houseLabel: 'House Targaryen',
      id: 'viserys-targaryen',
      name: 'Viserys Targaryen',
      status: { label: 'Muerto', state: 'dead' },
    },
    {
      alias: 'The Mad King',
      houseLabel: 'House Targaryen',
      id: 'aerys-ii-targaryen',
      name: 'Aerys II Targaryen',
      status: { label: 'Muerto', state: 'dead' },
    },
  ],
  membersCount: 41,
  motto: 'Fire and Blood',
  name: 'Targaryen',
  region: 'Dragonstone · Crownlands',
  regionCaption: 'Dragonstone · King’s Landing',
  seat: 'Dragonstone Castle',
  statusLabel: 'Linaje extinto',
  statusTone: 'extinct',
  swornHouses: [
    { accent: '#7fa6b8', id: 'velaryon', name: 'House Velaryon', seat: 'Driftmark', sigil: 'anchor' },
    { accent: '#9c7f4a', id: 'celtigar', name: 'House Celtigar', seat: 'Claw Isle', sigil: 'anchor' },
    { accent: '#c9b87a', id: 'sunglass', name: 'House Sunglass', seat: 'Sweetport', sigil: 'sun' },
    { accent: '#6e8a9c', id: 'bar-emmon', name: 'House Bar Emmon', seat: 'Sharp Point', sigil: 'waves' },
    { accent: '#8a8a94', id: 'massey', name: 'House Massey', seat: 'Stonedance', sigil: 'swords' },
  ],
  swornHousesCount: 9,
  theme: 'targaryen',
  words: 'Fire and Blood',
}
