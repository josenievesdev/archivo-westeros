import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getHouse,
  getHouses,
  normalizeIceAndFireExternalId,
  type ResourceListParams,
} from '../../../lib/api/ice-and-fire'
import {
  houseBundleQueryKey,
  houseDetailQueryKey,
  houseListQueryKey,
} from '../../../lib/query/ice_and_fire_query_keys'
import { createQueryClientEntityReader } from '../../../services/canonical_entity_reader'
import { getHouseDataBundle } from '../../../services/house_data_service'

export const HOUSE_DETAIL_SWORN_MEMBER_LIMIT = 4

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

export function useHouseDataBundle(id: string | undefined) {
  const queryClient = useQueryClient()
  const sourceId = normalizeIceAndFireExternalId(id)

  return useQuery({
    queryKey: sourceId
      ? houseBundleQueryKey(sourceId, HOUSE_DETAIL_SWORN_MEMBER_LIMIT)
      : ['houses', 'bundle', null],
    queryFn: ({ signal }) => {
      if (!sourceId) {
        throw new Error('Se necesita un identificador de casa.')
      }

      return getHouseDataBundle(
        sourceId,
        createQueryClientEntityReader(queryClient),
        {
          signal,
          swornMemberLimit: HOUSE_DETAIL_SWORN_MEMBER_LIMIT,
        },
      )
    },
    enabled: Boolean(sourceId),
    retry: false,
  })
}
