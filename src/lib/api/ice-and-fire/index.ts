export { IceAndFireApiError } from './api_client'
export { getCharacter, getCharacters } from './character_api'
export { normalizeCharacter } from './character_normalizer'
export { getHouse, getHouses } from './house_api'
export { normalizeHouse } from './house_normalizer'
export type { ResourceListParams } from './internal_types'
export {
  createCanonicalId,
  createSourceIdentity,
  ICE_AND_FIRE_SOURCE,
  normalizeIceAndFireExternalId,
} from '../../domain/canonical_entities'
export type {
  CanonicalBookId,
  CanonicalCharacter,
  CanonicalCharacterId,
  CanonicalHouse,
  CanonicalHouseId,
  CanonicalId,
  CharacterEditorialMetadata,
  CharacterSearchDocument,
  CharacterSearchHit,
  CharacterSearchPlan,
  CharacterViewModel,
  EditorialRef,
  LocalizedValue,
  SourceIdentity,
  SourceRef,
} from '../../domain/canonical_entities'
