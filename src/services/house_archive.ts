import { getMajorHouseMetadata } from '../content/house_editorial_metadata'
import type { CanonicalHouse } from '../lib/domain/canonical_entities'
import type {
  HouseArchiveEntry,
  HouseSearchDocument,
  HouseSearchField,
} from '../lib/domain/house_types'
import {
  getSearchMatchQuality,
  normalizeSearchText,
} from '../lib/search/search_text'

const houseNameCollator = new Intl.Collator('es', {
  numeric: true,
  sensitivity: 'base',
})

const houseRegionCollator = new Intl.Collator('en', {
  numeric: true,
  sensitivity: 'base',
})

const FIELD_MULTIPLIERS: Readonly<Record<HouseSearchField, number>> = {
  name: 12,
  shortName: 14,
  region: 8,
  words: 10,
  seat: 9,
}

export function buildHouseArchiveEntries(
  houses: readonly CanonicalHouse[],
): HouseArchiveEntry[] {
  return houses.map((house) => {
    const metadata = getMajorHouseMetadata(house)

    return {
      canonicalId: house.id,
      sourceId: house.source.externalId,
      displayName: house.name,
      shortName: metadata?.shortName ?? null,
      region: house.region,
      words: house.words,
      seats: [...house.seats],
      isMajor: metadata !== null,
      majorOrder: metadata?.order ?? null,
      themeKey: metadata?.themeKey ?? null,
    }
  })
}

export function sortHouseArchiveEntries(
  entries: readonly HouseArchiveEntry[],
): HouseArchiveEntry[] {
  return [...entries].sort((left, right) => {
    if (left.majorOrder !== null && right.majorOrder !== null) {
      return left.majorOrder - right.majorOrder
    }

    if (left.majorOrder !== null) {
      return -1
    }

    if (right.majorOrder !== null) {
      return 1
    }

    return (
      houseNameCollator.compare(left.displayName, right.displayName) ||
      left.canonicalId.localeCompare(right.canonicalId)
    )
  })
}

export function getHouseArchiveRegions(
  entries: readonly HouseArchiveEntry[],
): string[] {
  return [...new Set(entries.flatMap((entry) => (entry.region ? [entry.region] : [])))]
    .sort(houseRegionCollator.compare)
}

export function filterHouseArchiveEntriesByRegion(
  entries: readonly HouseArchiveEntry[],
  region: string,
): HouseArchiveEntry[] {
  return region === ''
    ? [...entries]
    : entries.filter((entry) => entry.region === region)
}

export function createHouseSearchDocument(
  entry: HouseArchiveEntry,
): HouseSearchDocument {
  const metadata = entry.isMajor
    ? getMajorHouseMetadata(entry.canonicalId)
    : null

  return {
    canonicalId: entry.canonicalId,
    sourceId: entry.sourceId,
    names: [entry.displayName],
    shortNames: entry.shortName ? [entry.shortName] : [],
    regions: entry.region ? [entry.region] : [],
    words: entry.words ? [entry.words] : [],
    seats: entry.seats,
    searchBoost: metadata?.searchBoost ?? 0,
  }
}

function scoreHouseSearchDocument(
  document: HouseSearchDocument,
  normalizedQuery: string,
) {
  const fields: ReadonlyArray<[HouseSearchField, readonly string[]]> = [
    ['name', document.names],
    ['shortName', document.shortNames],
    ['region', document.regions],
    ['words', document.words],
    ['seat', document.seats],
  ]
  let score = 0

  fields.forEach(([field, values]) => {
    const quality = Math.max(
      ...values.map((value) => getSearchMatchQuality(value, normalizedQuery)),
      0,
    )

    if (quality > 0) {
      score += quality * FIELD_MULTIPLIERS[field]
    }
  })

  return score > 0 ? score + document.searchBoost : 0
}

export function searchHouseArchiveEntries(
  entries: readonly HouseArchiveEntry[],
  query: string,
): HouseArchiveEntry[] {
  const normalizedQuery = normalizeSearchText(query)
  const sortedEntries = sortHouseArchiveEntries(entries)

  if (normalizedQuery === '') {
    return sortedEntries
  }

  const archiveOrder = new Map(
    sortedEntries.map((entry, index) => [entry.canonicalId, index]),
  )

  return entries
    .map((entry) => ({
      entry,
      score: scoreHouseSearchDocument(
        createHouseSearchDocument(entry),
        normalizedQuery,
      ),
    }))
    .filter((result) => result.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        (archiveOrder.get(left.entry.canonicalId) ?? 0) -
          (archiveOrder.get(right.entry.canonicalId) ?? 0),
    )
    .map((result) => result.entry)
}
