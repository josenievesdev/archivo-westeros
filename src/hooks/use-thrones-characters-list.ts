import { useQuery } from '@tanstack/react-query'
import { getThronesCharacters } from '../lib/api/thronesapi/character_api'
import { thronesapiCharactersListQueryKey } from '../lib/query/thronesapi_query_keys'

/**
 * Hook that returns the list of ThronesAPI characters.
 * The data is cached and shared across components.
 */
export function useThronesCharactersList() {
  return useQuery({
    queryKey: thronesapiCharactersListQueryKey(),
    queryFn: async ({ signal }) => await getThronesCharacters(signal),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}