import { useQuery } from '@tanstack/react-query'
import {
  getHouse,
  getHouses,
  normalizeIceAndFireExternalId,
  type ResourceListParams,
} from '../../../lib/api/ice-and-fire'
import {
  houseDetailQueryKey,
  houseListQueryKey,
} from '../../../lib/query/ice_and_fire_query_keys'

interface ResourceListQueryOptions {
  enabled?: boolean
}

export function useHouses(
  params: ResourceListParams = {},
  options: ResourceListQueryOptions = {},
) {
  return useQuery({
    queryKey: houseListQueryKey(params),
    queryFn: ({ signal }) => getHouses(params, signal),
    enabled: options.enabled,
  })
}

export function useHouse(id: string | undefined) {
  const sourceId = normalizeIceAndFireExternalId(id)

  return useQuery({
    queryKey: sourceId
      ? houseDetailQueryKey(sourceId)
      : ['houses', 'detail', null],
    queryFn: ({ signal }) => {
      if (!sourceId) {
        throw new Error('Se necesita un identificador de casa.')
      }

      return getHouse(sourceId, signal)
    },
    enabled: Boolean(sourceId),
  })
}
