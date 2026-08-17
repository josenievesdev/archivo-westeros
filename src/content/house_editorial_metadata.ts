import {
  createCanonicalId,
  createSourceIdentity,
  type CanonicalHouse,
  type CanonicalHouseId,
  type EditorialHouseKey,
} from '../lib/domain/canonical_entities'
import type { MajorHouseMetadata } from '../lib/domain/house_types'

interface MajorHouseInput {
  sourceId: string
  order: number
  shortName: string
  themeKey: EditorialHouseKey
}

function defineMajorHouse(input: MajorHouseInput): MajorHouseMetadata {
  return {
    ref: {
      source: 'realms-got',
      resource: 'house',
      key: input.themeKey,
    },
    canonicalId: createCanonicalId('house', input.sourceId),
    source: createSourceIdentity('house', input.sourceId),
    order: input.order,
    shortName: input.shortName,
    themeKey: input.themeKey,
    featured: true,
    searchBoost: 100,
  }
}

export const MAJOR_HOUSE_METADATA: readonly MajorHouseMetadata[] = [
  defineMajorHouse({
    sourceId: '362',
    order: 1,
    shortName: 'Stark',
    themeKey: 'stark',
  }),
  defineMajorHouse({
    sourceId: '229',
    order: 2,
    shortName: 'Lannister',
    themeKey: 'lannister',
  }),
  defineMajorHouse({
    sourceId: '378',
    order: 3,
    shortName: 'Targaryen',
    themeKey: 'targaryen',
  }),
  defineMajorHouse({
    sourceId: '17',
    order: 4,
    shortName: 'Baratheon',
    themeKey: 'baratheon',
  }),
  defineMajorHouse({
    sourceId: '169',
    order: 5,
    shortName: 'Greyjoy',
    themeKey: 'greyjoy',
  }),
  defineMajorHouse({
    sourceId: '398',
    order: 6,
    shortName: 'Tyrell',
    themeKey: 'tyrell',
  }),
  defineMajorHouse({
    sourceId: '285',
    order: 7,
    shortName: 'Martell',
    themeKey: 'martell',
  }),
]

const metadataByCanonicalId = new Map(
  MAJOR_HOUSE_METADATA.map((metadata) => [metadata.canonicalId, metadata]),
)
const houseNameCollator = new Intl.Collator('es', {
  numeric: true,
  sensitivity: 'base',
})

type HouseIdentity = Pick<CanonicalHouse, 'id'> | CanonicalHouseId

function getCanonicalHouseId(house: HouseIdentity) {
  return typeof house === 'string' ? house : house.id
}

export function getMajorHouseMetadata(
  house: HouseIdentity,
): MajorHouseMetadata | null {
  return metadataByCanonicalId.get(getCanonicalHouseId(house)) ?? null
}

export function isMajorHouse(house: HouseIdentity) {
  return getMajorHouseMetadata(house) !== null
}

export function sortHousesForArchive(
  houses: readonly CanonicalHouse[],
): CanonicalHouse[] {
  return [...houses].sort((left, right) => {
    const leftMetadata = getMajorHouseMetadata(left)
    const rightMetadata = getMajorHouseMetadata(right)

    if (leftMetadata && rightMetadata) {
      return leftMetadata.order - rightMetadata.order
    }

    if (leftMetadata) {
      return -1
    }

    if (rightMetadata) {
      return 1
    }

    return (
      houseNameCollator.compare(left.name, right.name) ||
      left.id.localeCompare(right.id)
    )
  })
}
