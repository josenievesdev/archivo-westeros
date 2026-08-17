import { useQuery } from '@tanstack/react-query'
import {
  getHouse,
  getHouses,
  type ResourceListParams,
} from '../../../lib/api/ice-and-fire'

interface ResourceListQueryOptions {
  enabled?: boolean
}

export function useHouses(
  params: ResourceListParams = {},
  options: ResourceListQueryOptions = {},
) {
  return useQuery({
    queryKey: ['houses', 'list', params],
    queryFn: ({ signal }) => getHouses(params, signal),
    enabled: options.enabled,
  })
}

export function useHouse(id: string | undefined) {
  return useQuery({
    queryKey: ['houses', 'detail', id],
    queryFn: ({ signal }) => {
      if (!id) {
        throw new Error('Se necesita un identificador de casa.')
      }

      return getHouse(id, signal)
    },
    enabled: Boolean(id),
  })
}
