import type { HouseTheme } from '../../../components/ui/house-theme'
import {
  FEATURED_CHARACTER_METADATA,
  type FeaturedCharacterEditorialMetadata,
} from '../../../content/character_editorial_metadata'
import {
  createCanonicalId,
  type CanonicalHouseId,
} from '../../../lib/domain/canonical_entities'
import { normalizeSearchText } from '../../../services/character_search'

export interface GreatHouseConfig {
  apiName: string
  canonicalId: CanonicalHouseId
  motto: string
  name: string
  region: string
  searchAliases: string[]
  sourceId: string
  theme: HouseTheme
}

export type FeaturedCharacterConfig = FeaturedCharacterEditorialMetadata

export const GREAT_HOUSES: GreatHouseConfig[] = [
  {
    apiName: 'House Stark of Winterfell',
    canonicalId: createCanonicalId('house', '362'),
    motto: 'Winter is Coming',
    name: 'Stark',
    region: 'The North · Winterfell',
    searchAliases: ['stark', 'winterfell', 'the north', 'el norte'],
    sourceId: '362',
    theme: 'stark',
  },
  {
    apiName: 'House Lannister of Casterly Rock',
    canonicalId: createCanonicalId('house', '229'),
    motto: 'Hear Me Roar!',
    name: 'Lannister',
    region: 'The Westerlands · Casterly Rock',
    searchAliases: ['lannister', 'casterly rock', 'the westerlands', 'el occidente'],
    sourceId: '229',
    theme: 'lannister',
  },
  {
    apiName: "House Targaryen of King's Landing",
    canonicalId: createCanonicalId('house', '378'),
    motto: 'Fire and Blood',
    name: 'Targaryen',
    region: "The Crownlands · King's Landing",
    searchAliases: ['targaryen', 'dragonstone', 'fire and blood', 'fuego y sangre'],
    sourceId: '378',
    theme: 'targaryen',
  },
  {
    apiName: "House Baratheon of Storm's End",
    canonicalId: createCanonicalId('house', '17'),
    motto: 'Ours is the Fury',
    name: 'Baratheon',
    region: "The Stormlands · Storm's End",
    searchAliases: ['baratheon', "storm's end", 'the stormlands', 'tierras de la tormenta'],
    sourceId: '17',
    theme: 'baratheon',
  },
  {
    apiName: 'House Greyjoy of Pyke',
    canonicalId: createCanonicalId('house', '169'),
    motto: 'We Do Not Sow',
    name: 'Greyjoy',
    region: 'Iron Islands · Pyke',
    searchAliases: ['greyjoy', 'pyke', 'iron islands', 'islas del hierro'],
    sourceId: '169',
    theme: 'greyjoy',
  },
  {
    apiName: 'House Tyrell of Highgarden',
    canonicalId: createCanonicalId('house', '398'),
    motto: 'Growing Strong',
    name: 'Tyrell',
    region: 'The Reach · Highgarden',
    searchAliases: ['tyrell', 'highgarden', 'the reach', 'el dominio'],
    sourceId: '398',
    theme: 'tyrell',
  },
  {
    apiName: 'House Nymeros Martell of Sunspear',
    canonicalId: createCanonicalId('house', '285'),
    motto: 'Unbowed, Unbent, Unbroken',
    name: 'Martell',
    region: 'Dorne · Sunspear',
    searchAliases: ['martell', 'nymeros martell', 'sunspear', 'dorne'],
    sourceId: '285',
    theme: 'martell',
  },
]

export const FEATURED_CHARACTERS = FEATURED_CHARACTER_METADATA

export const QUICK_SEARCHES = FEATURED_CHARACTERS.map((character) => ({
  characterId: character.characterId,
  label: character.preferredName,
  term: character.preferredName,
  theme: character.featured.houseTheme,
}))

function normalizeSearchTerm(value: string) {
  return normalizeSearchText(value)
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
