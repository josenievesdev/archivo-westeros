import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  enrichCanonicalCharacter,
  mergeCanonicalCharacters,
} from '../../../content/character_editorial_metadata'
import {
  createCanonicalId,
  getCharacter,
  getCharacters,
  normalizeIceAndFireExternalId,
  type CanonicalCharacterId,
  type ResourceListParams,
} from '../../../lib/api/ice-and-fire'
import {
  createCharacterSearchPlan,
  rankCharacterSearchResults,
} from '../../../services/character_search'

interface ResourceListQueryOptions {
  enabled?: boolean
}

interface CharacterSearchQueryOptions extends ResourceListQueryOptions {
  preferredCharacterId?: CanonicalCharacterId
}

function characterDetailQueryKey(sourceId: string) {
  return ['characters', 'detail', createCanonicalId('character', sourceId)] as const
}

async function getSearchCandidate(name: string, signal: AbortSignal) {
  try {
    return await getCharacters({ name, page: 1, pageSize: 8 }, signal)
  } catch (error) {
    if (signal.aborted) {
      throw error
    }

    return getCharacters({ name, page: 1, pageSize: 8 }, signal)
  }
}

export function useCharacters(
  params: ResourceListParams = {},
  options: ResourceListQueryOptions = {},
) {
  return useQuery({
    queryKey: ['characters', 'list', params],
    queryFn: async ({ signal }) =>
      (await getCharacters(params, signal)).map(enrichCanonicalCharacter),
    enabled: options.enabled,
  })
}

export function useCharacter(id: string | undefined) {
  const sourceId = normalizeIceAndFireExternalId(id)

  return useQuery({
    queryKey: sourceId
      ? characterDetailQueryKey(sourceId)
      : ['characters', 'detail', null],
    queryFn: async ({ signal }) => {
      if (!sourceId) {
        throw new Error('Se necesita un identificador de personaje.')
      }

      return enrichCanonicalCharacter(await getCharacter(sourceId, signal))
    },
    enabled: Boolean(sourceId),
  })
}

export function useCharacterSearch(
  query: string,
  options: CharacterSearchQueryOptions = {},
) {
  const queryClient = useQueryClient()
  const plan = createCharacterSearchPlan(query, options.preferredCharacterId)

  return useQuery({
    queryKey: [
      'characters',
      'search',
      plan.normalizedQuery,
      plan.requestNames,
      plan.preferredCharacterIds,
    ],
    queryFn: async ({ signal }) => {
      const responses = await Promise.allSettled(
        plan.requestNames.map((name) => getSearchCandidate(name, signal)),
      )
      const successfulResponses = responses.filter(
        (response): response is PromiseFulfilledResult<Awaited<ReturnType<typeof getCharacters>>> =>
          response.status === 'fulfilled',
      )

      const fulfilledResponses = successfulResponses.flatMap(
        (response) => response.value,
      )
      const failedResponses = responses.filter(
        (response): response is PromiseRejectedResult =>
          response.status === 'rejected',
      )

      if (
        successfulResponses.length === 0 ||
        (failedResponses.length > 0 && fulfilledResponses.length === 0)
      ) {
        const failure = responses.find(
          (response): response is PromiseRejectedResult =>
            response.status === 'rejected',
        )
        throw failure?.reason ?? new Error('La búsqueda no devolvió personajes.')
      }

      const characters = mergeCanonicalCharacters(fulfilledResponses)

      characters.forEach((character) => {
        queryClient.setQueryData(
          characterDetailQueryKey(character.source.externalId),
          character,
        )
      })

      return rankCharacterSearchResults(
        characters,
        plan.query,
        plan.preferredCharacterIds,
      )
    },
    enabled: (options.enabled ?? true) && plan.requestNames.length > 0,
    retry: false,
  })
}
