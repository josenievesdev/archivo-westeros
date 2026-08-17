import { useQuery } from '@tanstack/react-query'
import {
  getCharacter,
  getCharacters,
  type ResourceListParams,
} from '../../../lib/api/ice-and-fire'

interface ResourceListQueryOptions {
  enabled?: boolean
}

export function useCharacters(
  params: ResourceListParams = {},
  options: ResourceListQueryOptions = {},
) {
  return useQuery({
    queryKey: ['characters', 'list', params],
    queryFn: ({ signal }) => getCharacters(params, signal),
    enabled: options.enabled,
  })
}

export function useCharacter(id: string | undefined) {
  return useQuery({
    queryKey: ['characters', 'detail', id],
    queryFn: ({ signal }) => {
      if (!id) {
        throw new Error('Se necesita un identificador de personaje.')
      }

      return getCharacter(id, signal)
    },
    enabled: Boolean(id),
  })
}
