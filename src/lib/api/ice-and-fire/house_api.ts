import { apiGet, apiGetWithHeaders } from './api_client'
import { apiEndpoints } from './api_endpoints'
import type { IceAndFireHouseResponse } from './api_types'
import { normalizeHouse } from './house_normalizer'
import type { CanonicalHouse } from '../../domain/canonical_entities'
import type { ResourceListParams, ResourcePage } from './internal_types'
import { parsePaginationLinkHeader } from './pagination'

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

export async function getHouseArchivePage(
  params: ResourceListParams = {},
  signal?: AbortSignal,
): Promise<ResourcePage<CanonicalHouse>> {
  const response = await apiGetWithHeaders<IceAndFireHouseResponse[]>(
    apiEndpoints.houses,
    {
      name: params.name,
      page: params.page,
      pageSize: params.pageSize,
    },
    signal,
  )

  return {
    items: response.data.map(normalizeHouse),
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
    pagination: parsePaginationLinkHeader(response.headers.get('Link')),
  }
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
