import type {
  CanonicalCharacter,
  CanonicalHouse,
  CanonicalHouseId,
  EditorialHouseKey,
  EditorialRef,
  SourceIdentity,
} from './canonical_entities'

export interface MajorHouseMetadata {
  readonly ref: EditorialRef<'house'>
  readonly canonicalId: CanonicalHouseId
  readonly source: SourceIdentity<'house'>
  readonly order: number
  readonly shortName: string
  readonly themeKey: EditorialHouseKey
  readonly featured: boolean
  readonly searchBoost: number
}

export interface HouseArchiveEntry {
  canonicalId: CanonicalHouseId
  sourceId: string
  displayName: string
  shortName: string | null
  region: string | null
  words: string | null
  seats: string[]
  isMajor: boolean
  majorOrder: number | null
  themeKey: EditorialHouseKey | null
}

export type HouseSearchField =
  | 'name'
  | 'shortName'
  | 'region'
  | 'words'
  | 'seat'

export interface HouseSearchDocument {
  canonicalId: CanonicalHouseId
  sourceId: string
  names: readonly string[]
  shortNames: readonly string[]
  regions: readonly string[]
  words: readonly string[]
  seats: readonly string[]
  searchBoost: number
}

export type HouseRelationName =
  | 'currentLord'
  | 'heir'
  | 'founder'
  | 'overlord'
  | 'cadetBranches'
  | 'swornMembers'

export interface HouseRelationFailure {
  relation: HouseRelationName
  canonicalId: string
  reason: unknown
}

export interface HouseDataBundleCounts {
  cadetBranchesTotal: number
  cadetBranchesResolved: number
  cadetBranchesOmitted: number
  swornMembersTotal: number
  swornMembersRequested: number
  swornMembersResolved: number
  swornMembersOmitted: number
}

export interface HouseDataBundle {
  house: CanonicalHouse
  metadata: MajorHouseMetadata | null
  currentLord: CanonicalCharacter | null
  heir: CanonicalCharacter | null
  founder: CanonicalCharacter | null
  overlord: CanonicalHouse | null
  cadetBranches: CanonicalHouse[]
  swornMembers: CanonicalCharacter[]
  counts: HouseDataBundleCounts
  relationFailures: HouseRelationFailure[]
}
