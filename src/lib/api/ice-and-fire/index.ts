export { IceAndFireApiError } from './api_client'
export { getCharacter, getCharacters } from './character_api'
export { normalizeCharacter } from './character_normalizer'
export { getHouse, getHouseArchivePage, getHouses } from './house_api'
export { normalizeHouse } from './house_normalizer'
export type {
  ResourceListParams,
  ResourcePage,
  ResourcePagination,
} from './internal_types'
export {
  createCanonicalId,
  createSourceIdentity,
  ICE_AND_FIRE_SOURCE,
  normalizeIceAndFireExternalId,
  parseCanonicalId,
} from '../../domain/canonical_entities'
export type {
  CanonicalBookId,
  CanonicalCharacter,
  CanonicalCharacterId,
  CanonicalHouse,
  CanonicalHouseId,
  CanonicalId,
  CanonicalResource,
  CharacterEditorialMetadata,
  CharacterSearchDocument,
  CharacterSearchHit,
  CharacterSearchPlan,
  CharacterViewModel,
  EditorialRef,
  EditorialHouseKey,
  LocalizedValue,
  SourceIdentity,
  SourceRef,
} from '../../domain/canonical_entities'
export type {
  HouseArchiveEntry,
  HouseDataBundle,
  HouseDataBundleCounts,
  HouseRelationFailure,
  HouseRelationName,
  HouseSearchDocument,
  HouseSearchField,
  MajorHouseMetadata,
} from '../../domain/house_types'
