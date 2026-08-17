export const ICE_AND_FIRE_SOURCE = 'ice-and-fire' as const

export type CanonicalResource = 'book' | 'character' | 'house'
export type CanonicalId<Resource extends CanonicalResource = CanonicalResource> =
  `${typeof ICE_AND_FIRE_SOURCE}:${Resource}:${string}`
export type CanonicalBookId = CanonicalId<'book'>
export type CanonicalCharacterId = CanonicalId<'character'>
export type CanonicalHouseId = CanonicalId<'house'>

export interface SourceIdentity<Resource extends CanonicalResource> {
  source: typeof ICE_AND_FIRE_SOURCE
  resource: Resource
  externalId: string
}

export interface SourceRef<Resource extends CanonicalResource>
  extends SourceIdentity<Resource> {
  url: string
}

export interface EditorialRef<Resource extends 'character' | 'house'> {
  source: 'realms-got'
  resource: Resource
  key: string
}

export type EditorialHouseKey =
  | 'stark'
  | 'lannister'
  | 'targaryen'
  | 'baratheon'
  | 'greyjoy'
  | 'tyrell'
  | 'martell'

export interface FeaturedCharacterMetadata {
  readonly order: number
  readonly title: string
  readonly houseLabel: string
  readonly houseTheme: EditorialHouseKey
}

export interface CharacterEditorialMetadata {
  readonly ref: EditorialRef<'character'>
  readonly characterId: CanonicalCharacterId
  readonly source: SourceIdentity<'character'>
  readonly preferredName: string
  readonly featured: FeaturedCharacterMetadata | null
  readonly knownActors: readonly string[]
  readonly searchTerms: {
    readonly en: readonly string[]
    readonly es: readonly string[]
  }
  readonly searchPriority: number
}

export interface CanonicalCharacter {
  id: CanonicalCharacterId
  source: SourceRef<'character'>
  editorial: CharacterEditorialMetadata | null
  name: string | null
  gender: string | null
  culture: string | null
  born: string | null
  died: string | null
  titles: string[]
  aliases: string[]
  fatherId: CanonicalCharacterId | null
  motherId: CanonicalCharacterId | null
  spouseId: CanonicalCharacterId | null
  allegianceIds: CanonicalHouseId[]
  bookIds: CanonicalBookId[]
  povBookIds: CanonicalBookId[]
  tvSeries: string[]
  playedBy: string[]
}

export interface CanonicalHouse {
  id: CanonicalHouseId
  source: SourceRef<'house'>
  name: string
  region: string | null
  coatOfArms: string | null
  words: string | null
  titles: string[]
  seats: string[]
  currentLordId: CanonicalCharacterId | null
  heirId: CanonicalCharacterId | null
  overlordId: CanonicalHouseId | null
  founded: string | null
  founderId: CanonicalCharacterId | null
  diedOut: string | null
  ancestralWeapons: string[]
  cadetBranchIds: CanonicalHouseId[]
  swornMemberIds: CanonicalCharacterId[]
}

export type LocalizationMethod = 'dictionary' | 'original' | 'pattern'

export interface LocalizedValue<T> {
  original: T
  value: T
  locale: 'es'
  method: LocalizationMethod
}

export interface CharacterViewModel {
  id: CanonicalCharacterId
  source: SourceRef<'character'>
  name: string
  gender: LocalizedValue<string> | null
  culture: LocalizedValue<string> | null
  born: LocalizedValue<string> | null
  died: LocalizedValue<string> | null
  titles: LocalizedValue<string>[]
  aliases: LocalizedValue<string>[]
  tvSeries: LocalizedValue<string>[]
  playedBy: string[]
  featuredTitle: LocalizedValue<string> | null
  houseLabel: string | null
  houseTheme: EditorialHouseKey | null
  summary: string
  disambiguation: string
}

export type CharacterSearchField =
  | 'actor'
  | 'alias'
  | 'chronology'
  | 'culture'
  | 'editorial'
  | 'name'
  | 'season'
  | 'title'

export interface CharacterSearchDocument {
  characterId: CanonicalCharacterId
  sourceId: string
  names: readonly string[]
  aliases: readonly string[]
  titles: readonly string[]
  actors: readonly string[]
  cultures: readonly string[]
  chronology: readonly string[]
  seasons: readonly string[]
  editorialTerms: readonly string[]
  editorialPriority: number
}

export interface CharacterSearchHit {
  character: CanonicalCharacter
  view: CharacterViewModel
  document: CharacterSearchDocument
  score: number
  matchedFields: CharacterSearchField[]
  disambiguation: string | null
}

export interface CharacterSearchPlan {
  query: string
  normalizedQuery: string
  requestNames: readonly string[]
  preferredCharacterIds: readonly CanonicalCharacterId[]
}

export function normalizeIceAndFireExternalId(
  externalId: string | undefined,
): string | null {
  const normalizedId = externalId?.trim() ?? ''
  return /^[1-9]\d*$/.test(normalizedId) ? normalizedId : null
}

export function createCanonicalId<Resource extends CanonicalResource>(
  resource: Resource,
  externalId: string,
): CanonicalId<Resource> {
  const normalizedId = normalizeIceAndFireExternalId(externalId)

  if (!normalizedId) {
    throw new TypeError(`No se puede crear un ID canónico de ${resource} con "${externalId}".`)
  }

  return `${ICE_AND_FIRE_SOURCE}:${resource}:${normalizedId}`
}

export function createSourceIdentity<Resource extends CanonicalResource>(
  resource: Resource,
  externalId: string,
): SourceIdentity<Resource> {
  const normalizedId = normalizeIceAndFireExternalId(externalId)

  if (!normalizedId) {
    throw new TypeError(`No se puede crear una referencia de ${resource} con "${externalId}".`)
  }

  return {
    source: ICE_AND_FIRE_SOURCE,
    resource,
    externalId: normalizedId,
  }
}

export function parseCanonicalId<Resource extends CanonicalResource>(
  canonicalId: string,
  expectedResource: Resource,
): SourceIdentity<Resource> | null {
  const prefix = `${ICE_AND_FIRE_SOURCE}:${expectedResource}:`

  if (!canonicalId.startsWith(prefix)) {
    return null
  }

  const externalId = normalizeIceAndFireExternalId(canonicalId.slice(prefix.length))
  if (!externalId || canonicalId !== `${prefix}${externalId}`) {
    return null
  }

  return createSourceIdentity(expectedResource, externalId)
}
