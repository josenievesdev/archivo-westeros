import { useCharacter } from '../features/personajes/api/use_characters'
import { useQuery } from '@tanstack/react-query'
import { getThronesCharacters } from '../lib/api/thronesapi/character_api'
import { thronesapiCharactersListQueryKey } from '../lib/query/thronesapi_query_keys'
import { getCharacterMediaFromList } from '../services/character_media_service'
import { parseCanonicalId } from '../lib/domain/canonical_entities'
import { CHARACTER_MEDIA_MAPPING } from '../content/character_media_mapping'
import type { CanonicalCharacterId } from '../lib/domain/canonical_entities'

export function useCharacterMedia(canonicalCharacterId: CanonicalCharacterId | undefined) {
    // We must call hooks unconditionally to comply with React Rules of Hooks
    const sourceId = canonicalCharacterId ? parseCanonicalId(canonicalCharacterId, 'character')?.externalId : undefined
    const hasMapping = !!canonicalCharacterId && !!CHARACTER_MEDIA_MAPPING[canonicalCharacterId as CanonicalCharacterId];

    // Always fetch the canonical character (used for altText etc.)
    const { data: character } = useCharacter(sourceId ?? undefined)

    // Fetch ThronesAPI list only when we have a sourceId and there is a mapping
    const { data: thronesCharacters } = useQuery({
      queryKey: thronesapiCharactersListQueryKey(),
      queryFn: async ({ signal }) => await getThronesCharacters(signal),
      enabled: !!sourceId && hasMapping,
      staleTime: 1000 * 60 * 60, // 1 hour
      gcTime: 1000 * 60 * 60 * 24, // 24 hours,
    })

    // If we lack essential data, return undefined
    if (!character || !thronesCharacters) {
      return undefined
    }
    // If there is no mapping for this canonical character, return undefined
    if (!hasMapping) {
      return undefined
    }

    return getCharacterMediaFromList(thronesCharacters, character)
}