import type { HouseTheme } from '../../../components/ui/house-theme'

export interface GreatHouseConfig {
  apiName: string
  id: string
  motto: string
  name: string
  region: string
  searchAliases: string[]
  theme: HouseTheme
}

export interface FeaturedCharacterConfig {
  fallbackName: string
  fallbackTitle: string
  houseLabel: string
  houseTheme: HouseTheme
  id: string
  searchAliases: string[]
}

export const GREAT_HOUSES: GreatHouseConfig[] = [
  {
    apiName: 'House Stark of Winterfell',
    id: '362',
    motto: 'Winter is Coming',
    name: 'Stark',
    region: 'The North · Winterfell',
    searchAliases: ['stark', 'winterfell', 'the north'],
    theme: 'stark',
  },
  {
    apiName: 'House Lannister of Casterly Rock',
    id: '229',
    motto: 'Hear Me Roar!',
    name: 'Lannister',
    region: 'The Westerlands · Casterly Rock',
    searchAliases: ['lannister', 'casterly rock', 'the westerlands'],
    theme: 'lannister',
  },
  {
    apiName: "House Targaryen of King's Landing",
    id: '378',
    motto: 'Fire and Blood',
    name: 'Targaryen',
    region: "The Crownlands · King's Landing",
    searchAliases: ['targaryen', 'dragonstone', 'fire and blood'],
    theme: 'targaryen',
  },
  {
    apiName: "House Baratheon of Storm's End",
    id: '17',
    motto: 'Ours is the Fury',
    name: 'Baratheon',
    region: "The Stormlands · Storm's End",
    searchAliases: ['baratheon', "storm's end", 'the stormlands'],
    theme: 'baratheon',
  },
  {
    apiName: 'House Greyjoy of Pyke',
    id: '169',
    motto: 'We Do Not Sow',
    name: 'Greyjoy',
    region: 'Iron Islands · Pyke',
    searchAliases: ['greyjoy', 'pyke', 'iron islands'],
    theme: 'greyjoy',
  },
  {
    apiName: 'House Tyrell of Highgarden',
    id: '398',
    motto: 'Growing Strong',
    name: 'Tyrell',
    region: 'The Reach · Highgarden',
    searchAliases: ['tyrell', 'highgarden', 'the reach'],
    theme: 'tyrell',
  },
  {
    apiName: 'House Nymeros Martell of Sunspear',
    id: '285',
    motto: 'Unbowed, Unbent, Unbroken',
    name: 'Martell',
    region: 'Dorne · Sunspear',
    searchAliases: ['martell', 'nymeros martell', 'sunspear', 'dorne'],
    theme: 'martell',
  },
]

export const FEATURED_CHARACTERS: FeaturedCharacterConfig[] = [
  {
    fallbackName: 'Jon Snow',
    fallbackTitle: "Lord Commander of the Night's Watch",
    houseLabel: 'House Stark',
    houseTheme: 'stark',
    id: '583',
    searchAliases: ['jon', 'lord snow', 'lord crow', 'the bastard of winterfell'],
  },
  {
    fallbackName: 'Daenerys Targaryen',
    fallbackTitle: 'Mother of Dragons',
    houseLabel: 'House Targaryen',
    houseTheme: 'targaryen',
    id: '1303',
    searchAliases: ['daenerys', 'dany', 'mother of dragons', 'dragon queen'],
  },
  {
    fallbackName: 'Tyrion Lannister',
    fallbackTitle: 'The Imp',
    houseLabel: 'House Lannister',
    houseTheme: 'lannister',
    id: '1052',
    searchAliases: ['tyrion', 'the imp', 'halfman'],
  },
  {
    fallbackName: 'Arya Stark',
    fallbackTitle: 'Arya Underfoot',
    houseLabel: 'House Stark',
    houseTheme: 'stark',
    id: '148',
    searchAliases: ['arya', 'arry', 'arya underfoot'],
  },
  {
    fallbackName: 'Cersei Lannister',
    fallbackTitle: 'Queen Regent',
    houseLabel: 'House Lannister',
    houseTheme: 'lannister',
    id: '238',
    searchAliases: ['cersei', 'queen regent', 'light of the west'],
  },
]

export const QUICK_SEARCHES = FEATURED_CHARACTERS.map((character) => ({
  label: character.fallbackName,
  term: character.fallbackName,
  theme: character.houseTheme,
}))

function normalizeSearchTerm(value: string) {
  return value.trim().toLocaleLowerCase('en')
}

export function resolveCharacterSearchTerm(value: string) {
  const normalized = normalizeSearchTerm(value)
  const matches = FEATURED_CHARACTERS.filter((character) =>
    [character.fallbackName, character.fallbackTitle, ...character.searchAliases].some((candidate) =>
      normalizeSearchTerm(candidate).includes(normalized),
    ),
  )

  return matches.length === 1 ? matches[0].fallbackName : value.trim()
}

export function resolveHouseSearchTerm(value: string) {
  const normalized = normalizeSearchTerm(value)
  const matches = GREAT_HOUSES.filter((house) =>
    [house.name, house.apiName, ...house.searchAliases].some((candidate) =>
      normalizeSearchTerm(candidate).includes(normalized),
    ),
  )

  return matches.length === 1 ? matches[0].apiName : value.trim()
}

export function getFeaturedCharacterConfig(id: string) {
  return FEATURED_CHARACTERS.find((character) => character.id === id)
}
