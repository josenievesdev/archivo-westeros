import { apiGet } from './api_client'
import { apiEndpoints } from './api_endpoints'
import type { ThronesCharacterDto } from './api_types'

export async function getThronesCharacters(
  signal?: AbortSignal,
): Promise<ThronesCharacterDto[]> {
  const response = await apiGet<ThronesCharacterDto[]>(
    apiEndpoints.characters,
    {},
    signal,
  )
  return response
}