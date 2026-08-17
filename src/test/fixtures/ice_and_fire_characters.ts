import type { IceAndFireCharacterResponse } from '../../lib/api/ice-and-fire/api_types'

export function createCharacterResponse(
  overrides: Partial<IceAndFireCharacterResponse> &
    Pick<IceAndFireCharacterResponse, 'name' | 'url'>,
): IceAndFireCharacterResponse {
  return {
    gender: '',
    culture: '',
    born: '',
    died: '',
    titles: [],
    aliases: [],
    father: '',
    mother: '',
    spouse: '',
    allegiances: [],
    books: [],
    povBooks: [],
    tvSeries: [],
    playedBy: [],
    ...overrides,
    name: overrides.name,
    url: overrides.url,
  }
}

export const JON_SNOW_RESPONSE = createCharacterResponse({
  url: 'https://anapioficeandfire.com/api/characters/583',
  name: 'Jon Snow',
  gender: 'Male',
  culture: 'Northmen',
  born: 'In 283 AC',
  titles: ["Lord Commander of the Night's Watch"],
  aliases: [
    'Lord Snow',
    "Ned Stark's Bastard",
    'The Bastard of Winterfell',
    'Lord Crow',
  ],
  allegiances: ['https://anapioficeandfire.com/api/houses/362'],
  books: ['https://anapioficeandfire.com/api/books/5'],
  povBooks: [
    'https://anapioficeandfire.com/api/books/1',
    'https://anapioficeandfire.com/api/books/2',
  ],
  tvSeries: ['Season 1', 'Season 6'],
  playedBy: ['Kit Harington'],
})

export const DAENERYS_HISTORICAL_RESPONSE = createCharacterResponse({
  url: 'https://anapioficeandfire.com/api/characters/271',
  name: 'Daenerys Targaryen',
  gender: 'Female',
  born: 'In 172 AC',
  titles: ['Princess'],
  spouse: 'https://anapioficeandfire.com/api/characters/719',
  allegiances: [
    'https://anapioficeandfire.com/api/houses/285',
    'https://anapioficeandfire.com/api/houses/378',
  ],
  books: [
    'https://anapioficeandfire.com/api/books/6',
    'https://anapioficeandfire.com/api/books/8',
    'https://anapioficeandfire.com/api/books/11',
  ],
})

export const DAENERYS_MAIN_RESPONSE = createCharacterResponse({
  url: 'https://anapioficeandfire.com/api/characters/1303',
  name: 'Daenerys Targaryen',
  gender: 'Female',
  culture: 'Valyrian',
  born: 'In 284 AC, at Dragonstone',
  titles: [
    'Queen of the Andals and the Rhoynar and the First Men, Lord of the Seven Kingdoms',
    'Khaleesi of the Great Grass Sea',
    'Breaker of Shackles/Chains',
    'Queen of Meereen',
    'Princess of Dragonstone',
  ],
  aliases: [
    'Dany',
    'Daenerys Stormborn',
    'The Unburnt',
    'Mother of Dragons',
    'The Silver Queen',
    'Dragonmother',
    'The Dragon Queen',
  ],
  spouse: 'https://anapioficeandfire.com/api/characters/1346',
  allegiances: ['https://anapioficeandfire.com/api/houses/378'],
  books: ['https://anapioficeandfire.com/api/books/5'],
  povBooks: [
    'https://anapioficeandfire.com/api/books/1',
    'https://anapioficeandfire.com/api/books/2',
    'https://anapioficeandfire.com/api/books/3',
    'https://anapioficeandfire.com/api/books/8',
  ],
  tvSeries: [
    'Season 1',
    'Season 2',
    'Season 3',
    'Season 4',
    'Season 5',
    'Season 6',
  ],
  playedBy: ['Emilia Clarke'],
})
