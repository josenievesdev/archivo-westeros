import { describe, expect, test, vi } from 'vitest'
import { createCharacterResponse } from '../test/fixtures/ice_and_fire_characters'
import { normalizeCharacter } from '../lib/api/ice-and-fire/character_normalizer'
import {
  createCanonicalId,
  parseCanonicalId,
} from '../lib/domain/canonical_entities'
import type { CanonicalEntityReader } from './canonical_entity_reader'
import { resolveCharacterReferences } from './reference_resolution'

async function loadCharacter(id: `ice-and-fire:character:${string}`) {
  const source = parseCanonicalId(id, 'character')
  if (!source) {
    throw new Error('ID inválido')
  }

  return normalizeCharacter(
    createCharacterResponse({
      url: `https://anapioficeandfire.com/api/characters/${source.externalId}`,
      name: `Character ${id}`,
    }),
  )
}

function createReader(): CanonicalEntityReader {
  return {
    getCharacter: vi.fn(loadCharacter),
    getHouse: vi.fn(),
  }
}

describe('resolución de referencias canónicas', () => {
  test('deduplica requests y restaura el orden original, incluidos duplicados', async () => {
    const reader = createReader()
    const first = createCanonicalId('character', '110')
    const second = createCanonicalId('character', '128')
    const result = await resolveCharacterReferences(
      [first, second, first],
      reader,
    )

    expect(reader.getCharacter).toHaveBeenCalledTimes(2)
    expect(result.requestedIds).toEqual([first, second])
    expect(result.values.map((character) => character.id)).toEqual([
      first,
      second,
      first,
    ])
  })

  test('mantiene resultados válidos cuando falla una referencia intermedia', async () => {
    const reader = createReader()
    const first = createCanonicalId('character', '110')
    const failed = createCanonicalId('character', '128')
    const third = createCanonicalId('character', '216')
    vi.mocked(reader.getCharacter).mockImplementation(async (id) => {
      if (id === failed) {
        throw new Error('No disponible')
      }

      const source = parseCanonicalId(id, 'character')
      if (!source) {
        throw new Error('ID inválido')
      }

      return normalizeCharacter(
        createCharacterResponse({
          url: `https://anapioficeandfire.com/api/characters/${source.externalId}`,
          name: `Character ${id}`,
        }),
      )
    })

    const result = await resolveCharacterReferences(
      [first, failed, third],
      reader,
    )

    expect(result.values.map((character) => character.id)).toEqual([first, third])
    expect(result.failures).toEqual([
      { canonicalId: failed, reason: expect.any(Error) },
    ])
  })

  test('aplica el límite antes de programar requests', async () => {
    const reader = createReader()
    const ids = ['110', '128', '216', '230'].map((id) =>
      createCanonicalId('character', id),
    )
    const result = await resolveCharacterReferences(ids, reader, { limit: 2 })

    expect(reader.getCharacter).toHaveBeenCalledTimes(2)
    expect(result.values).toHaveLength(2)
    expect(result.omittedIds).toEqual(ids.slice(2))
    expect(result.totalCount).toBe(4)
  })

  test('limita la concurrencia de requests relacionados', async () => {
    const reader = createReader()
    let activeRequests = 0
    let maximumActiveRequests = 0
    vi.mocked(reader.getCharacter).mockImplementation(async (id) => {
      activeRequests += 1
      maximumActiveRequests = Math.max(maximumActiveRequests, activeRequests)

      try {
        await new Promise((resolve) => setTimeout(resolve, 5))
        return await loadCharacter(id)
      } finally {
        activeRequests -= 1
      }
    })
    const ids = ['110', '128', '216', '230', '249', '315'].map((id) =>
      createCanonicalId('character', id),
    )

    await resolveCharacterReferences(ids, reader, { concurrency: 2 })

    expect(maximumActiveRequests).toBe(2)
  })

  test('rechaza una entidad resuelta con otra identidad', async () => {
    const reader = createReader()
    const requested = createCanonicalId('character', '110')
    vi.mocked(reader.getCharacter).mockResolvedValue(
      await loadCharacter(createCanonicalId('character', '128')),
    )

    const result = await resolveCharacterReferences([requested], reader)

    expect(result.values).toEqual([])
    expect(result.failures).toEqual([
      { canonicalId: requested, reason: expect.any(TypeError) },
    ])
  })

  test('cancela antes de programar referencias cuando la señal está abortada', async () => {
    const reader = createReader()
    const controller = new AbortController()
    controller.abort(new DOMException('Cancelado', 'AbortError'))

    await expect(
      resolveCharacterReferences(
        [createCanonicalId('character', '110')],
        reader,
        { signal: controller.signal },
      ),
    ).rejects.toMatchObject({ name: 'AbortError' })
    expect(reader.getCharacter).not.toHaveBeenCalled()
  })

  test('parseCanonicalId rechaza fuente, recurso y formato incorrectos', () => {
    expect(
      parseCanonicalId('ice-and-fire:house:362', 'character'),
    ).toBeNull()
    expect(parseCanonicalId('other:character:110', 'character')).toBeNull()
    expect(parseCanonicalId('ice-and-fire:character:0110', 'character')).toBeNull()
  })
})
