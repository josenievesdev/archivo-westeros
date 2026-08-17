import { QueryClient } from '@tanstack/react-query'
import { describe, expect, test, vi } from 'vitest'
import { JON_SNOW_RESPONSE } from '../test/fixtures/ice_and_fire_characters'
import { STARK_HOUSE_FIXTURE } from '../test/fixtures/ice_and_fire_houses'
import { normalizeCharacter } from '../lib/api/ice-and-fire/character_normalizer'
import { normalizeHouse } from '../lib/api/ice-and-fire/house_normalizer'
import { createCanonicalId } from '../lib/domain/canonical_entities'
import { houseDetailQueryKey } from '../lib/query/ice_and_fire_query_keys'
import { createQueryClientEntityReader } from './canonical_entity_reader'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Number.POSITIVE_INFINITY },
    },
  })
}

describe('lector canónico respaldado por QueryClient', () => {
  test('reutiliza la cache de detalle para evitar requests duplicados', async () => {
    const queryClient = createTestQueryClient()
    const houseLoader = vi.fn(async () => normalizeHouse(STARK_HOUSE_FIXTURE))
    const reader = createQueryClientEntityReader(queryClient, {
      getCharacter: vi.fn(async () => normalizeCharacter(JON_SNOW_RESPONSE)),
      getHouse: houseLoader,
    })
    const houseId = createCanonicalId('house', '362')

    const first = await reader.getHouse(houseId)
    const second = await reader.getHouse(houseId)

    expect(first).toBe(second)
    expect(houseLoader).toHaveBeenCalledTimes(1)
    expect(houseLoader).toHaveBeenCalledWith('362', expect.any(AbortSignal))
    expect(queryClient.getQueryData(houseDetailQueryKey('362'))).toBe(first)
  })

  test('deduplica solicitudes concurrentes de la misma referencia', async () => {
    const queryClient = createTestQueryClient()
    const houseLoader = vi.fn(async () => normalizeHouse(STARK_HOUSE_FIXTURE))
    const reader = createQueryClientEntityReader(queryClient, {
      getCharacter: vi.fn(async () => normalizeCharacter(JON_SNOW_RESPONSE)),
      getHouse: houseLoader,
    })
    const houseId = createCanonicalId('house', '362')

    await Promise.all([reader.getHouse(houseId), reader.getHouse(houseId)])

    expect(houseLoader).toHaveBeenCalledTimes(1)
  })

  test('no cachea una entidad devuelta bajo otra identidad', async () => {
    const queryClient = createTestQueryClient()
    const reader = createQueryClientEntityReader(queryClient, {
      getCharacter: vi.fn(async () => normalizeCharacter(JON_SNOW_RESPONSE)),
      getHouse: vi.fn(async () => normalizeHouse(STARK_HOUSE_FIXTURE)),
    })
    const requestedId = createCanonicalId('house', '229')

    await expect(reader.getHouse(requestedId)).rejects.toThrowError(
      'La fuente devolvió ice-and-fire:house:362',
    )
    expect(queryClient.getQueryData(houseDetailQueryKey('229'))).toBeUndefined()
  })

  test('expulsa una entrada fresca cacheada bajo otra identidad', async () => {
    const queryClient = createTestQueryClient()
    const houseLoader = vi.fn(async () => normalizeHouse(STARK_HOUSE_FIXTURE))
    const reader = createQueryClientEntityReader(queryClient, {
      getCharacter: vi.fn(async () => normalizeCharacter(JON_SNOW_RESPONSE)),
      getHouse: houseLoader,
    })
    const requestedId = createCanonicalId('house', '229')
    queryClient.setQueryData(
      houseDetailQueryKey('229'),
      normalizeHouse(STARK_HOUSE_FIXTURE),
    )

    await expect(reader.getHouse(requestedId)).rejects.toThrowError(
      'La cache devolvió ice-and-fire:house:362',
    )
    expect(houseLoader).not.toHaveBeenCalled()
    expect(queryClient.getQueryData(houseDetailQueryKey('229'))).toBeUndefined()
  })

  test('aísla la cancelación de un consumidor de la petición compartida', async () => {
    const queryClient = createTestQueryClient()
    const controller = new AbortController()
    let finishRequest:
      | ((house: ReturnType<typeof normalizeHouse>) => void)
      | undefined
    const houseLoader = vi.fn(async () =>
      new Promise<ReturnType<typeof normalizeHouse>>((resolve) => {
        finishRequest = resolve
      }),
    )
    const reader = createQueryClientEntityReader(queryClient, {
      getCharacter: vi.fn(async () => normalizeCharacter(JON_SNOW_RESPONSE)),
      getHouse: houseLoader,
    })
    const houseId = createCanonicalId('house', '362')
    const firstConsumer = reader.getHouse(houseId)

    await vi.waitFor(() => expect(houseLoader).toHaveBeenCalledTimes(1))
    const cancelledConsumer = reader.getHouse(houseId, controller.signal)
    controller.abort(new DOMException('Cancelado', 'AbortError'))

    await expect(cancelledConsumer).rejects.toMatchObject({ name: 'AbortError' })
    finishRequest?.(normalizeHouse(STARK_HOUSE_FIXTURE))
    await expect(firstConsumer).resolves.toMatchObject({ id: houseId })
    expect(houseLoader).toHaveBeenCalledTimes(1)
  })
})
