import type { QueryClient } from '@tanstack/react-query'
import { enrichCanonicalCharacter } from '../content/character_editorial_metadata'
import {
  getCharacter,
  getHouse,
  type CanonicalCharacter,
  type CanonicalCharacterId,
  type CanonicalHouse,
  type CanonicalHouseId,
} from '../lib/api/ice-and-fire'
import { parseCanonicalId } from '../lib/domain/canonical_entities'
import {
  characterDetailQueryKey,
  houseDetailQueryKey,
} from '../lib/query/ice_and_fire_query_keys'

export interface CanonicalEntityReader {
  getCharacter(
    id: CanonicalCharacterId,
    signal?: AbortSignal,
  ): Promise<CanonicalCharacter>
  getHouse(id: CanonicalHouseId, signal?: AbortSignal): Promise<CanonicalHouse>
}

export interface CanonicalEntityLoaders {
  getCharacter(
    sourceId: string,
    signal?: AbortSignal,
  ): Promise<CanonicalCharacter>
  getHouse(sourceId: string, signal?: AbortSignal): Promise<CanonicalHouse>
}

const defaultLoaders: CanonicalEntityLoaders = {
  getCharacter,
  getHouse,
}

function throwIfAborted(signal: AbortSignal | undefined) {
  if (signal?.aborted) {
    throw signal.reason ?? new DOMException('La lectura fue cancelada.', 'AbortError')
  }
}

function waitForCaller<T>(promise: Promise<T>, signal?: AbortSignal) {
  if (!signal) {
    return promise
  }

  const callerSignal = signal
  throwIfAborted(callerSignal)

  return new Promise<T>((resolve, reject) => {
    function stopWaiting() {
      reject(
        callerSignal.reason ??
          new DOMException('La lectura fue cancelada.', 'AbortError'),
      )
    }

    callerSignal.addEventListener('abort', stopWaiting, { once: true })
    promise.then(
      (value) => {
        callerSignal.removeEventListener('abort', stopWaiting)
        resolve(value)
      },
      (reason) => {
        callerSignal.removeEventListener('abort', stopWaiting)
        reject(reason)
      },
    )
  })
}

export function createQueryClientEntityReader(
  queryClient: QueryClient,
  loaders: CanonicalEntityLoaders = defaultLoaders,
): CanonicalEntityReader {
  return {
    async getCharacter(id, signal) {
      const source = parseCanonicalId(id, 'character')
      if (!source) {
        throw new TypeError(`La referencia de personaje no es válida: ${id}`)
      }

      throwIfAborted(signal)

      const queryKey = characterDetailQueryKey(source.externalId)
      const character = await waitForCaller(
        queryClient.fetchQuery({
          queryKey,
          queryFn: async ({ signal: querySignal }) => {
            const loadedCharacter = enrichCanonicalCharacter(
              await loaders.getCharacter(source.externalId, querySignal),
            )

            if (loadedCharacter.id !== id) {
              throw new TypeError(
                `La fuente devolvió ${loadedCharacter.id} para la referencia ${id}.`,
              )
            }

            return loadedCharacter
          },
        }),
        signal,
      )

      throwIfAborted(signal)
      if (character.id !== id) {
        queryClient.removeQueries({ queryKey, exact: true })
        throw new TypeError(
          `La cache devolvió ${character.id} para la referencia ${id}.`,
        )
      }

      return character
    },

    async getHouse(id, signal) {
      const source = parseCanonicalId(id, 'house')
      if (!source) {
        throw new TypeError(`La referencia de casa no es válida: ${id}`)
      }

      throwIfAborted(signal)

      const queryKey = houseDetailQueryKey(source.externalId)
      const house = await waitForCaller(
        queryClient.fetchQuery({
          queryKey,
          queryFn: async ({ signal: querySignal }) => {
            const loadedHouse = await loaders.getHouse(
              source.externalId,
              querySignal,
            )

            if (loadedHouse.id !== id) {
              throw new TypeError(
                `La fuente devolvió ${loadedHouse.id} para la referencia ${id}.`,
              )
            }

            return loadedHouse
          },
        }),
        signal,
      )

      throwIfAborted(signal)
      if (house.id !== id) {
        queryClient.removeQueries({ queryKey, exact: true })
        throw new TypeError(
          `La cache devolvió ${house.id} para la referencia ${id}.`,
        )
      }

      return house
    },
  }
}
