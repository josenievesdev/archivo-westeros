import type {
  CanonicalCharacter,
  CanonicalCharacterId,
  CanonicalHouse,
  CanonicalHouseId,
} from '../lib/domain/canonical_entities'
import type { CanonicalEntityReader } from './canonical_entity_reader'

export const DEFAULT_REFERENCE_LIMIT = 25
export const DEFAULT_REFERENCE_CONCURRENCY = 4
export const MAX_REFERENCE_CONCURRENCY = 10

export interface ReferenceResolutionOptions {
  limit?: number
  concurrency?: number
  signal?: AbortSignal
}

export interface ReferenceFailure<Id extends string> {
  canonicalId: Id
  reason: unknown
}

export interface ReferenceResolution<T, Id extends string> {
  values: T[]
  byId: ReadonlyMap<Id, T>
  failures: ReferenceFailure<Id>[]
  requestedIds: Id[]
  omittedIds: Id[]
  totalCount: number
}

function validateLimit(limit: number) {
  if (!Number.isInteger(limit) || limit < 0) {
    throw new RangeError('El límite de referencias debe ser un entero no negativo.')
  }
}

function validateConcurrency(concurrency: number) {
  if (
    !Number.isInteger(concurrency) ||
    concurrency < 1 ||
    concurrency > MAX_REFERENCE_CONCURRENCY
  ) {
    throw new RangeError(
      `La concurrencia debe ser un entero entre 1 y ${MAX_REFERENCE_CONCURRENCY}.`,
    )
  }
}

function throwIfAborted(signal: AbortSignal | undefined) {
  if (signal?.aborted) {
    throw signal.reason ?? new DOMException('La resolución fue cancelada.', 'AbortError')
  }
}

async function settleWithConcurrency<T, Id extends string>(
  ids: readonly Id[],
  load: (id: Id, signal?: AbortSignal) => Promise<T>,
  concurrency: number,
  signal?: AbortSignal,
) {
  const settled: PromiseSettledResult<T>[] = new Array(ids.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < ids.length) {
      throwIfAborted(signal)
      const index = nextIndex
      nextIndex += 1

      try {
        settled[index] = {
          status: 'fulfilled',
          value: await load(ids[index], signal),
        }
      } catch (reason) {
        throwIfAborted(signal)
        settled[index] = { status: 'rejected', reason }
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, ids.length) }, worker),
  )
  throwIfAborted(signal)
  return settled
}

async function resolveReferences<T, Id extends string>(
  ids: readonly Id[],
  load: (id: Id, signal?: AbortSignal) => Promise<T>,
  options: ReferenceResolutionOptions,
): Promise<ReferenceResolution<T, Id>> {
  const limit = options.limit ?? DEFAULT_REFERENCE_LIMIT
  const concurrency = options.concurrency ?? DEFAULT_REFERENCE_CONCURRENCY
  validateLimit(limit)
  validateConcurrency(concurrency)

  const selectedIds = ids.slice(0, limit)
  const omittedIds = ids.slice(limit)
  const requestedIds = [...new Set(selectedIds)]
  const settled = await settleWithConcurrency(
    requestedIds,
    load,
    concurrency,
    options.signal,
  )
  const byId = new Map<Id, T>()
  const failures: ReferenceFailure<Id>[] = []

  settled.forEach((result, index) => {
    const canonicalId = requestedIds[index]

    if (result.status === 'fulfilled') {
      byId.set(canonicalId, result.value)
    } else {
      failures.push({ canonicalId, reason: result.reason })
    }
  })

  return {
    values: selectedIds.flatMap((id) => {
      const value = byId.get(id)
      return value ? [value] : []
    }),
    byId,
    failures,
    requestedIds,
    omittedIds,
    totalCount: ids.length,
  }
}

export function resolveCharacterReferences(
  ids: readonly CanonicalCharacterId[],
  reader: CanonicalEntityReader,
  options: ReferenceResolutionOptions = {},
): Promise<ReferenceResolution<CanonicalCharacter, CanonicalCharacterId>> {
  return resolveReferences(
    ids,
    async (id, signal) => {
      const character = await reader.getCharacter(id, signal)
      if (character.id !== id) {
        throw new TypeError(
          `Se resolvió ${character.id} para la referencia ${id}.`,
        )
      }

      return character
    },
    options,
  )
}

export function resolveHouseReferences(
  ids: readonly CanonicalHouseId[],
  reader: CanonicalEntityReader,
  options: ReferenceResolutionOptions = {},
): Promise<ReferenceResolution<CanonicalHouse, CanonicalHouseId>> {
  return resolveReferences(
    ids,
    async (id, signal) => {
      const house = await reader.getHouse(id, signal)
      if (house.id !== id) {
        throw new TypeError(`Se resolvió ${house.id} para la referencia ${id}.`)
      }

      return house
    },
    options,
  )
}
