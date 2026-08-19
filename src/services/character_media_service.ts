import { CHARACTER_MEDIA_MAPPING } from '../content/character_media_mapping'
import { normalizeThronesCharacter } from '../lib/domain/character_media'
import type { CharacterMedia } from '../lib/domain/character_media'
import type { ThronesCharacterDto } from '../lib/api/thronesapi/api_types'
import type { CanonicalCharacter } from '../lib/domain/canonical_entities'

/**
 * Get CharacterMedia for a canonical character from a list of ThronesAPI characters.
 * Returns undefined if there is no mapping or if the ThronesAPI record is not found.
 */
export function getCharacterMediaFromList(
  thronesCharacters: ThronesCharacterDto[],
  canonicalCharacter: CanonicalCharacter,
): CharacterMedia | undefined {
  const mapping = CHARACTER_MEDIA_MAPPING[canonicalCharacter.id]
  if (!mapping) {
    return undefined
  }

  const thronesCharacter = thronesCharacters.find(
    (c) => c.id === mapping.providerId,
  )
  if (!thronesCharacter) {
    return undefined
  }

  try {
    return normalizeThronesCharacter(thronesCharacter, canonicalCharacter)
  } catch {
    // If normalization fails (e.g., invalid imageUrl), we return undefined
    // to avoid breaking the character.
    return undefined
  }
}