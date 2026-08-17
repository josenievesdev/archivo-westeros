import { useQuery } from '@tanstack/react-query'
import {
  createCanonicalId,
  getHouse,
  getHouses,
  normalizeIceAndFireExternalId,
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
  const sourceId = normalizeIceAndFireExternalId(id)

  return useQuery({
    queryKey: [
      'houses',
      'detail',
      sourceId ? createCanonicalId('house', sourceId) : null,
    ],
    queryFn: ({ signal }) => {
      if (!sourceId) {
        throw new Error('Se necesita un identificador de casa.')
      }

      return getHouse(sourceId, signal)
    },
    enabled: Boolean(sourceId),
  })
}
