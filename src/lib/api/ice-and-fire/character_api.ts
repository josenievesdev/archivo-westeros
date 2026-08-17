import { apiGet } from './api_client'
import { apiEndpoints } from './api_endpoints'
import type { IceAndFireCharacterResponse } from './api_types'
import { normalizeCharacter } from './character_normalizer'
import type { Character, ResourceListParams } from './internal_types'

export async function getCharacters(
  params: ResourceListParams = {},
  signal?: AbortSignal,
): Promise<Character[]> {
  const response = await apiGet<IceAndFireCharacterResponse[]>(
    apiEndpoints.characters,
    {
      name: params.name,
      page: params.page,
      pageSize: params.pageSize,
    },
    signal,
  )

  return response.map(normalizeCharacter)
}

export async function getCharacter(
  id: string,
  signal?: AbortSignal,
): Promise<Character> {
  const response = await apiGet<IceAndFireCharacterResponse>(
    apiEndpoints.character(id),
    {},
    signal,
  )

  return normalizeCharacter(response)
}
