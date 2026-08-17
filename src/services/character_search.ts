import {
  CHARACTER_EDITORIAL_METADATA,
  mergeCanonicalCharacters,
} from '../content/character_editorial_metadata'
import { createCharacterViewModel } from '../content/character_localization'
import type {
  CanonicalCharacter,
  CanonicalCharacterId,
  CharacterEditorialMetadata,
  CharacterSearchDocument,
  CharacterSearchField,
  CharacterSearchHit,
  CharacterSearchPlan,
} from '../lib/domain/canonical_entities'
import {
  getSearchMatchQuality,
  normalizeSearchText,
} from '../lib/search/search_text'

export { normalizeSearchText } from '../lib/search/search_text'

const FIELD_MULTIPLIERS: Readonly<Record<CharacterSearchField, number>> = {
  actor: 8,
  alias: 11,
  chronology: 5,
  culture: 6,
  editorial: 9,
  name: 12,
  season: 4,
  title: 10,
}

const LOWERCASE_NAME_PARTICLES = new Set([
  'daughter',
  'first',
  'for',
  'of',
  'son',
  'the',
  'wife',
])
const CONTEXTUAL_NAME_PARTICLES = new Set(['mo', 'na', 'zo'])
const ROMAN_NUMERALS = /^[ivxlcdm]+$/
const API_NAME_OVERRIDES: Readonly<Record<string, string>> = {
  tomtoo: 'TomToo',
}

export function createApiCharacterName(value: string) {
  const normalizedValue = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/’/g, "'")
    .trim()
    .replace(/\s+/g, ' ')
  const override = API_NAME_OVERRIDES[normalizeSearchText(normalizedValue)]

  if (override) {
    return override
  }

  const words = normalizedValue.toLocaleLowerCase('en').split(' ')

  return words
    .map((word, wordIndex) =>
      word
        .split('-')
        .map((part, partIndex) => {
          if (ROMAN_NUMERALS.test(part)) {
            return part.toLocaleUpperCase('en')
          }

          const isNotFirstPart = wordIndex > 0 || partIndex > 0
          const isContextualParticle =
            CONTEXTUAL_NAME_PARTICLES.has(part) && wordIndex < words.length - 1

          if (
            isNotFirstPart &&
            (LOWERCASE_NAME_PARTICLES.has(part) || isContextualParticle)
          ) {
            return part
          }

          return `${part.charAt(0).toLocaleUpperCase('en')}${part.slice(1)}`
        })
        .join('-'),
    )
    .join(' ')
}

function uniqueStrings(values: readonly (string | null | undefined)[]) {
  const seen = new Set<string>()

  return values.filter((value): value is string => {
    if (!value) {
      return false
    }

    const normalized = normalizeSearchText(value)
    if (normalized === '' || seen.has(normalized)) {
      return false
    }

    seen.add(normalized)
    return true
  })
}

function getMetadataMatchScore(
  metadata: CharacterEditorialMetadata,
  normalizedQuery: string,
) {
  const candidates = [
    metadata.preferredName,
    metadata.featured?.title,
    ...metadata.knownActors,
    ...metadata.searchTerms.en,
    ...metadata.searchTerms.es,
  ].filter((value): value is string => Boolean(value))

  return Math.max(
    ...candidates.map((candidate) =>
      getSearchMatchQuality(candidate, normalizedQuery),
    ),
    0,
  )
}

export function createCharacterSearchPlan(
  query: string,
  preferredCharacterId?: CanonicalCharacterId,
): CharacterSearchPlan {
  const trimmedQuery = query.trim()
  const normalizedQuery = normalizeSearchText(trimmedQuery)

  if (normalizedQuery === '') {
    return {
      query: trimmedQuery,
      normalizedQuery,
      requestNames: [],
      preferredCharacterIds: [],
    }
  }

  const explicitMetadata = preferredCharacterId
    ? CHARACTER_EDITORIAL_METADATA.find(
        (metadata) => metadata.characterId === preferredCharacterId,
      )
    : undefined

  const metadataMatches = explicitMetadata
    ? [{ metadata: explicitMetadata, score: Number.MAX_SAFE_INTEGER }]
    : CHARACTER_EDITORIAL_METADATA.map((metadata) => ({
        metadata,
        score: getMetadataMatchScore(metadata, normalizedQuery),
      }))
        .filter((match) => match.score > 0)
        .sort(
          (left, right) =>
            right.score - left.score ||
            right.metadata.searchPriority - left.metadata.searchPriority,
        )

  if (metadataMatches.length === 0) {
    return {
      query: trimmedQuery,
      normalizedQuery,
      requestNames: [createApiCharacterName(trimmedQuery)],
      preferredCharacterIds: [],
    }
  }

  return {
    query: trimmedQuery,
    normalizedQuery,
    requestNames: uniqueStrings(
      metadataMatches.map((match) => match.metadata.preferredName),
    ),
    preferredCharacterIds: metadataMatches.map(
      (match) => match.metadata.characterId,
    ),
  }
}

export function createCharacterSearchDocument(
  character: CanonicalCharacter,
): CharacterSearchDocument {
  const view = createCharacterViewModel(character)
  const editorial = character.editorial

  return {
    characterId: character.id,
    sourceId: character.source.externalId,
    names: uniqueStrings([character.name, editorial?.preferredName]),
    aliases: uniqueStrings([
      ...character.aliases,
      ...view.aliases.map((alias) => alias.value),
    ]),
    titles: uniqueStrings([
      ...character.titles,
      ...view.titles.map((title) => title.value),
      view.featuredTitle?.original,
      view.featuredTitle?.value,
    ]),
    actors: uniqueStrings([
      ...character.playedBy,
      ...(editorial?.knownActors ?? []),
    ]),
    cultures: uniqueStrings([character.culture, view.culture?.value]),
    chronology: uniqueStrings([
      character.born,
      view.born?.value,
      character.died,
      view.died?.value,
    ]),
    seasons: uniqueStrings([
      ...character.tvSeries,
      ...view.tvSeries.map((season) => season.value),
    ]),
    editorialTerms: uniqueStrings([
      ...(editorial?.searchTerms.en ?? []),
      ...(editorial?.searchTerms.es ?? []),
    ]),
    editorialPriority: editorial?.searchPriority ?? 0,
  }
}

function scoreDocument(document: CharacterSearchDocument, normalizedQuery: string) {
  const fieldValues: ReadonlyArray<[
    CharacterSearchField,
    readonly string[],
  ]> = [
    ['name', document.names],
    ['alias', document.aliases],
    ['title', document.titles],
    ['editorial', document.editorialTerms],
    ['actor', document.actors],
    ['culture', document.cultures],
    ['chronology', document.chronology],
    ['season', document.seasons],
  ]
  const matchedFields: CharacterSearchField[] = []
  let score = 0

  fieldValues.forEach(([field, values]) => {
    const quality = Math.max(
      ...values.map((value) => getSearchMatchQuality(value, normalizedQuery)),
      0,
    )

    if (quality > 0) {
      matchedFields.push(field)
      score += quality * FIELD_MULTIPLIERS[field]
    }
  })

  return { matchedFields, score }
}

export function rankCharacterSearchResults(
  characters: readonly CanonicalCharacter[],
  query: string,
  preferredCharacterIds: readonly CanonicalCharacterId[] = [],
): CharacterSearchHit[] {
  const normalizedQuery = normalizeSearchText(query)
  const uniqueCharacters = mergeCanonicalCharacters(characters)
  const nameCounts = new Map<string, number>()

  uniqueCharacters.forEach((character) => {
    const name = normalizeSearchText(createCharacterViewModel(character).name)
    nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1)
  })

  return uniqueCharacters
    .map((character, index) => {
      const view = createCharacterViewModel(character)
      const document = createCharacterSearchDocument(character)
      const scored = scoreDocument(document, normalizedQuery)
      const preferredIndex = preferredCharacterIds.indexOf(character.id)
      const preferredScore = preferredIndex >= 0 ? 400 - preferredIndex * 10 : 0
      const hasHomonym = (nameCounts.get(normalizeSearchText(view.name)) ?? 0) > 1

      return {
        character,
        view,
        document,
        score: scored.score + document.editorialPriority + preferredScore,
        matchedFields: scored.matchedFields,
        disambiguation: hasHomonym ? view.disambiguation : null,
        index,
      }
    })
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ index: _index, ...hit }) => hit)
}
