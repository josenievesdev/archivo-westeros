import { useQuery } from '@tanstack/react-query'
import {
  getCharacter,
  getCharacters,
  type ResourceListParams,
} from '../../../lib/api/ice-and-fire'

export function useCharacters(params: ResourceListParams = {}) {
  return useQuery({
    queryKey: ['characters', 'list', params],
    queryFn: ({ signal }) => getCharacters(params, signal),
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
