import { describe, expect, test, vi } from 'vitest'
import { createCharacterResponse } from '../test/fixtures/ice_and_fire_characters'
import {
  BARATHEON_DRAGONSTONE_FIXTURE,
  BARATHEON_HOUSE_FIXTURE,
  BARATHEON_KINGS_LANDING_FIXTURE,
  VERIFIED_MAJOR_HOUSE_FIXTURES,
} from '../test/fixtures/ice_and_fire_houses'
import { normalizeCharacter } from '../lib/api/ice-and-fire/character_normalizer'
import { normalizeHouse } from '../lib/api/ice-and-fire/house_normalizer'
import {
  createCanonicalId,
  parseCanonicalId,
  type CanonicalCharacter,
  type CanonicalCharacterId,
  type CanonicalHouse,
  type CanonicalHouseId,
} from '../lib/domain/canonical_entities'
import type { CanonicalEntityReader } from './canonical_entity_reader'
import {
  buildHouseDataBundle,
  getHouseDataBundle,
  loadMajorHouses,
} from './house_data_service'

const characterNames: Readonly<Record<string, string>> = {
  '1029': 'Tommen Baratheon',
  '775': 'Myrcella Baratheon',
  '797': 'Orys Baratheon',
  '110': 'Alyssa Velaryon',
  '128': 'Argella Durrandon',
  '216': 'Character 216',
  '230': 'Character 230',
  '249': 'Character 249',
  '315': 'Character 315',
  '435': 'Character 435',
}

function createCharacter(id: string): CanonicalCharacter {
  return normalizeCharacter(
    createCharacterResponse({
      url: `https://anapioficeandfire.com/api/characters/${id}`,
      name: characterNames[id] ?? `Character ${id}`,
    }),
  )
}

function createBundleReader(options: {
  failedCharacterId?: CanonicalCharacterId
  failedHouseId?: CanonicalHouseId
} = {}) {
  const houses = new Map<CanonicalHouseId, CanonicalHouse>([
    [createCanonicalId('house', '17'), normalizeHouse(BARATHEON_HOUSE_FIXTURE)],
    [
      createCanonicalId('house', '15'),
      normalizeHouse(BARATHEON_DRAGONSTONE_FIXTURE),
    ],
    [
      createCanonicalId('house', '16'),
      normalizeHouse(BARATHEON_KINGS_LANDING_FIXTURE),
    ],
  ])
  const reader: CanonicalEntityReader = {
    getCharacter: vi.fn(async (id) => {
      if (id === options.failedCharacterId) {
        throw new Error(`No se pudo resolver ${id}`)
      }

      const source = parseCanonicalId(id, 'character')
      if (!source) {
        throw new Error(`ID inválido: ${id}`)
      }

      return createCharacter(source.externalId)
    }),
    getHouse: vi.fn(async (id) => {
      if (id === options.failedHouseId) {
        throw new Error(`No se pudo resolver ${id}`)
      }

      const house = houses.get(id)
      if (!house) {
        throw new Error(`Casa desconocida: ${id}`)
      }

      return house
    }),
  }

  return reader
}

describe('HouseDataBundle', () => {
  const house = normalizeHouse(BARATHEON_HOUSE_FIXTURE)

  test('resuelve relaciones por su semántica y limita swornMembers', async () => {
    const reader = createBundleReader()
    const bundle = await buildHouseDataBundle(house, reader, {
      swornMemberLimit: 4,
    })

    expect(bundle.house).toBe(house)
    expect(bundle.metadata?.shortName).toBe('Baratheon')
    expect(bundle.currentLord?.id).toBe('ice-and-fire:character:1029')
    expect(bundle.heir?.id).toBe('ice-and-fire:character:775')
    expect(bundle.founder?.id).toBe('ice-and-fire:character:797')
    expect(bundle.overlord?.id).toBe('ice-and-fire:house:16')
    expect(bundle.cadetBranches.map((branch) => branch.id)).toEqual([
      'ice-and-fire:house:15',
      'ice-and-fire:house:16',
    ])
    expect(bundle.swornMembers.map((member) => member.id)).toEqual([
      'ice-and-fire:character:110',
      'ice-and-fire:character:128',
      'ice-and-fire:character:216',
      'ice-and-fire:character:230',
    ])
    expect(bundle.counts).toEqual({
      cadetBranchesTotal: 2,
      cadetBranchesResolved: 2,
      cadetBranchesOmitted: 0,
      swornMembersTotal: 19,
      swornMembersRequested: 4,
      swornMembersResolved: 4,
      swornMembersOmitted: 15,
    })
    expect(reader.getHouse).toHaveBeenCalledTimes(2)
    expect(reader.getCharacter).toHaveBeenCalledTimes(7)
  })

  test('conserva la casa y resultados parciales cuando fallan relaciones', async () => {
    const failedMemberId = createCanonicalId('character', '128')
    const failedOverlordId = createCanonicalId('house', '16')
    const reader = createBundleReader({
      failedCharacterId: failedMemberId,
      failedHouseId: failedOverlordId,
    })
    const bundle = await buildHouseDataBundle(house, reader, {
      swornMemberLimit: 4,
    })

    expect(bundle.house.id).toBe('ice-and-fire:house:17')
    expect(bundle.currentLord?.id).toBe('ice-and-fire:character:1029')
    expect(bundle.overlord).toBeNull()
    expect(bundle.cadetBranches.map((branch) => branch.id)).toEqual([
      'ice-and-fire:house:15',
    ])
    expect(bundle.swornMembers.map((member) => member.id)).toEqual([
      'ice-and-fire:character:110',
      'ice-and-fire:character:216',
      'ice-and-fire:character:230',
    ])
    expect(bundle.relationFailures).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          relation: 'overlord',
          canonicalId: failedOverlordId,
        }),
        expect.objectContaining({
          relation: 'cadetBranches',
          canonicalId: failedOverlordId,
        }),
        expect.objectContaining({
          relation: 'swornMembers',
          canonicalId: failedMemberId,
        }),
      ]),
    )
    expect(bundle.counts.swornMembersResolved).toBe(3)
  })

  test('usa seis swornMembers por defecto', async () => {
    const bundle = await buildHouseDataBundle(house, createBundleReader())

    expect(bundle.swornMembers).toHaveLength(6)
    expect(bundle.counts.swornMembersRequested).toBe(6)
    expect(bundle.counts.swornMembersOmitted).toBe(13)
  })

  test('carga la casa principal por source ID antes de construir el bundle', async () => {
    const reader = createBundleReader()
    const bundle = await getHouseDataBundle('17', reader, {
      swornMemberLimit: 0,
    })

    expect(bundle.house.id).toBe('ice-and-fire:house:17')
    expect(reader.getHouse).toHaveBeenNthCalledWith(
      1,
      'ice-and-fire:house:17',
      undefined,
    )
  })

  test('carga las siete casas major en orden editorial', async () => {
    const houses = new Map(
      VERIFIED_MAJOR_HOUSE_FIXTURES.map((fixture) => {
        const house = normalizeHouse(fixture)
        return [house.id, house] as const
      }),
    )
    const reader: CanonicalEntityReader = {
      getCharacter: vi.fn(),
      getHouse: vi.fn(async (id) => {
        const majorHouse = houses.get(id)
        if (!majorHouse) {
          throw new Error(`Casa major desconocida: ${id}`)
        }

        return majorHouse
      }),
    }
    const result = await loadMajorHouses(reader)

    expect(result.failures).toEqual([])
    expect(result.houses.map((majorHouse) => majorHouse.source.externalId)).toEqual([
      '362',
      '229',
      '378',
      '17',
      '169',
      '398',
      '285',
    ])
  })
})
