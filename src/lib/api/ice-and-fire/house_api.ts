import { apiGet } from './api_client'
import { apiEndpoints } from './api_endpoints'
import type { IceAndFireHouseResponse } from './api_types'
import { normalizeHouse } from './house_normalizer'
import type { CanonicalHouse } from '../../domain/canonical_entities'
import type { ResourceListParams } from './internal_types'

export async function getHouses(
  params: ResourceListParams = {},
  signal?: AbortSignal,
): Promise<CanonicalHouse[]> {
  const response = await apiGet<IceAndFireHouseResponse[]>(
    apiEndpoints.houses,
    {
      name: params.name,
      page: params.page,
      pageSize: params.pageSize,
    },
    signal,
  )

  return response.map(normalizeHouse)
}

export async function getHouse(
  id: string,
  signal?: AbortSignal,
): Promise<CanonicalHouse> {
  const response = await apiGet<IceAndFireHouseResponse>(
    apiEndpoints.house(id),
    {},
    signal,
  )

  return normalizeHouse(response)
}
