import { useCharacter } from '../features/personajes/api/use_characters'
import { useQuery } from '@tanstack/react-query'
import { getThronesCharacters } from '../lib/api/thronesapi/character_api'
import { thronesapiCharactersListQueryKey } from '../lib/query/thronesapi_query_keys'
import { getCharacterMediaFromList } from '../services/character_media_service'
import { parseCanonicalId } from '../lib/domain/canonical_entities'
import type { CanonicalCharacterId } from '../lib/domain/canonical_entities'

/**
 * Hook that returns the CharacterMedia for a given canonicalCharacterId.
 * Returns undefined if the character has no mapping or if the ThronesAPI data is not available.
 */
export function useCharacterMedia(canonicalCharacterId: CanonicalCharacterId | undefined) {
  if (!canonicalCharacterId) {
    return undefined
  }

  // Extract the sourceId from the canonicalCharacterId to use with useCharacter
  const sourceId = parseCanonicalId(canonicalCharacterId, 'character')?.externalId

  const { data: character } = useCharacter(sourceId)

  const { data: thronesCharacters } = useQuery({
    queryKey: thronesapiCharactersListQueryKey(),
    queryFn: async ({ signal }) => await getThronesCharacters(signal),
    // We want to keep the data for a reasonable time because it changes rarely.
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  if (!character || !thronesCharacters) {
    return undefined
  }

  return getCharacterMediaFromList(thronesCharacters, character)
}