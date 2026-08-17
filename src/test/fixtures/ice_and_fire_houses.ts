import type { IceAndFireHouseResponse } from '../../lib/api/ice-and-fire/api_types'

export function createHouseResponse(
  overrides: Partial<IceAndFireHouseResponse> &
    Pick<IceAndFireHouseResponse, 'name' | 'url'>,
): IceAndFireHouseResponse {
  return {
    region: '',
    coatOfArms: '',
    words: '',
    titles: [],
    seats: [],
    currentLord: '',
    heir: '',
    overlord: '',
    founded: '',
    founder: '',
    diedOut: '',
    ancestralWeapons: [],
    cadetBranches: [],
    swornMembers: [],
    ...overrides,
    name: overrides.name,
    url: overrides.url,
  }
}

export const STARK_HOUSE_FIXTURE = createHouseResponse({
  url: 'https://anapioficeandfire.com/api/houses/362',
  name: 'House Stark of Winterfell',
  region: 'The North',
  coatOfArms: 'A running grey direwolf, on an ice-white field',
  words: 'Winter is Coming',
  titles: [
    'King in the North',
    'Lord of Winterfell',
    'Warden of the North',
    'King of the Trident',
  ],
  seats: ['Scattered (formerly Winterfell)'],
  overlord: 'https://anapioficeandfire.com/api/houses/16',
  founded: 'Age of Heroes',
  founder: 'https://anapioficeandfire.com/api/characters/209',
  ancestralWeapons: ['Ice'],
  cadetBranches: [
    'https://anapioficeandfire.com/api/houses/170',
    'https://anapioficeandfire.com/api/houses/215',
  ],
  swornMembers: [
    'https://anapioficeandfire.com/api/characters/2',
    'https://anapioficeandfire.com/api/characters/20',
    'https://anapioficeandfire.com/api/characters/97',
    'https://anapioficeandfire.com/api/characters/98',
    'https://anapioficeandfire.com/api/characters/136',
    'https://anapioficeandfire.com/api/characters/143',
    'https://anapioficeandfire.com/api/characters/148',
  ],
})

export const LANNISTER_HOUSE_FIXTURE = createHouseResponse({
  url: 'https://anapioficeandfire.com/api/houses/229',
  name: 'House Lannister of Casterly Rock',
  region: 'The Westerlands',
  words: 'Hear Me Roar!',
  seats: ['Casterly Rock'],
  currentLord: 'https://anapioficeandfire.com/api/characters/238',
  overlord: 'https://anapioficeandfire.com/api/houses/16',
  founder: 'https://anapioficeandfire.com/api/characters/615',
})

export const TARGARYEN_HOUSE_FIXTURE = createHouseResponse({
  url: 'https://anapioficeandfire.com/api/houses/378',
  name: "House Targaryen of King's Landing",
  region: 'The Crownlands',
  words: 'Fire and Blood',
  seats: ['Red Keep (formerly)', 'Summerhall (formerly)'],
  currentLord: 'https://anapioficeandfire.com/api/characters/1303',
  cadetBranches: ['https://anapioficeandfire.com/api/houses/23'],
})

export const BARATHEON_HOUSE_FIXTURE = createHouseResponse({
  url: 'https://anapioficeandfire.com/api/houses/17',
  name: "House Baratheon of Storm's End",
  region: 'The Stormlands',
  words: 'Ours is the Fury',
  seats: ["Storm's End", 'Dragonstone (House Baratheon of Dragonstone)'],
  currentLord: 'https://anapioficeandfire.com/api/characters/1029',
  heir: 'https://anapioficeandfire.com/api/characters/775',
  overlord: 'https://anapioficeandfire.com/api/houses/16',
  founder: 'https://anapioficeandfire.com/api/characters/797',
  cadetBranches: [
    'https://anapioficeandfire.com/api/houses/15',
    'https://anapioficeandfire.com/api/houses/16',
  ],
  swornMembers: [
    'https://anapioficeandfire.com/api/characters/110',
    'https://anapioficeandfire.com/api/characters/128',
    'https://anapioficeandfire.com/api/characters/216',
    'https://anapioficeandfire.com/api/characters/230',
    'https://anapioficeandfire.com/api/characters/249',
    'https://anapioficeandfire.com/api/characters/315',
    'https://anapioficeandfire.com/api/characters/435',
    'https://anapioficeandfire.com/api/characters/679',
    'https://anapioficeandfire.com/api/characters/794',
    'https://anapioficeandfire.com/api/characters/797',
    'https://anapioficeandfire.com/api/characters/862',
    'https://anapioficeandfire.com/api/characters/870',
    'https://anapioficeandfire.com/api/characters/986',
    'https://anapioficeandfire.com/api/characters/1044',
    'https://anapioficeandfire.com/api/characters/1188',
    'https://anapioficeandfire.com/api/characters/1233',
    'https://anapioficeandfire.com/api/characters/1355',
    'https://anapioficeandfire.com/api/characters/1473',
    'https://anapioficeandfire.com/api/characters/1552',
  ],
})

export const GREYJOY_HOUSE_FIXTURE = createHouseResponse({
  url: 'https://anapioficeandfire.com/api/houses/169',
  name: 'House Greyjoy of Pyke',
  region: 'Iron Islands',
  words: 'We Do Not Sow',
  seats: ['Pyke'],
  currentLord: 'https://anapioficeandfire.com/api/characters/385',
  heir: 'https://anapioficeandfire.com/api/characters/1022',
  overlord: 'https://anapioficeandfire.com/api/houses/16',
})

export const TYRELL_HOUSE_FIXTURE = createHouseResponse({
  url: 'https://anapioficeandfire.com/api/houses/398',
  name: 'House Tyrell of Highgarden',
  region: 'The Reach',
  words: 'Growing Strong',
  seats: ['Highgarden'],
  currentLord: 'https://anapioficeandfire.com/api/characters/691',
  heir: 'https://anapioficeandfire.com/api/characters/1113',
  overlord: 'https://anapioficeandfire.com/api/houses/16',
  founder: 'https://anapioficeandfire.com/api/characters/75',
  cadetBranches: ['https://anapioficeandfire.com/api/houses/397'],
})

export const MARTELL_HOUSE_FIXTURE = createHouseResponse({
  url: 'https://anapioficeandfire.com/api/houses/285',
  name: 'House Nymeros Martell of Sunspear',
  region: 'Dorne',
  words: 'Unbowed, Unbent, Unbroken',
  seats: ['Old Palace within Sunspear'],
  currentLord: 'https://anapioficeandfire.com/api/characters/326',
  heir: 'https://anapioficeandfire.com/api/characters/130',
  overlord: 'https://anapioficeandfire.com/api/houses/16',
  founder: 'https://anapioficeandfire.com/api/characters/1718',
})

export const ALGOOD_HOUSE_FIXTURE = createHouseResponse({
  url: 'https://anapioficeandfire.com/api/houses/1',
  name: 'House Algood',
  region: 'The Westerlands',
  overlord: 'https://anapioficeandfire.com/api/houses/229',
})

export const AMBER_HOUSE_FIXTURE = createHouseResponse({
  url: 'https://anapioficeandfire.com/api/houses/3',
  name: 'House Amber',
  region: 'The North',
})

export const BARATHEON_KINGS_LANDING_FIXTURE = createHouseResponse({
  url: 'https://anapioficeandfire.com/api/houses/16',
  name: "House Baratheon of King's Landing",
  region: 'The Crownlands',
  seats: ["King's Landing"],
})

export const BARATHEON_DRAGONSTONE_FIXTURE = createHouseResponse({
  url: 'https://anapioficeandfire.com/api/houses/15',
  name: 'House Baratheon of Dragonstone',
  region: 'The Crownlands',
  seats: ['Dragonstone'],
  overlord: 'https://anapioficeandfire.com/api/houses/16',
})

export const VERIFIED_MAJOR_HOUSE_FIXTURES = [
  STARK_HOUSE_FIXTURE,
  LANNISTER_HOUSE_FIXTURE,
  TARGARYEN_HOUSE_FIXTURE,
  BARATHEON_HOUSE_FIXTURE,
  GREYJOY_HOUSE_FIXTURE,
  TYRELL_HOUSE_FIXTURE,
  MARTELL_HOUSE_FIXTURE,
] as const
