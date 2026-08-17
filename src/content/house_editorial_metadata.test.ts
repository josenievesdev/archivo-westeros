import { describe, expect, test } from 'vitest'
import {
  ALGOOD_HOUSE_FIXTURE,
  AMBER_HOUSE_FIXTURE,
  TARGARYEN_HOUSE_FIXTURE,
  VERIFIED_MAJOR_HOUSE_FIXTURES,
} from '../test/fixtures/ice_and_fire_houses'
import { normalizeHouse } from '../lib/api/ice-and-fire/house_normalizer'
import {
  MAJOR_HOUSE_METADATA,
  getMajorHouseMetadata,
  isMajorHouse,
  sortHousesForArchive,
} from './house_editorial_metadata'

describe('metadata editorial de casas principales', () => {
  const majorHouses = VERIFIED_MAJOR_HOUSE_FIXTURES.map(normalizeHouse)
  const algood = normalizeHouse(ALGOOD_HOUSE_FIXTURE)

  test('identifica Stark y Targaryen como major mediante su ID real', () => {
    expect(isMajorHouse(majorHouses[0])).toBe(true)
    expect(isMajorHouse(majorHouses[2])).toBe(true)
    expect(getMajorHouseMetadata(majorHouses[0])?.shortName).toBe('Stark')
    expect(getMajorHouseMetadata(majorHouses[2])?.shortName).toBe('Targaryen')
  })

  test('no clasifica House Algood como major', () => {
    expect(isMajorHouse(algood)).toBe(false)
    expect(getMajorHouseMetadata(algood)).toBeNull()
  })

  test('centraliza IDs y orden verificados de las siete casas', () => {
    expect(
      MAJOR_HOUSE_METADATA.map((metadata) => ({
        sourceId: metadata.source.externalId,
        canonicalId: metadata.canonicalId,
        shortName: metadata.shortName,
      })),
    ).toEqual([
      { sourceId: '362', canonicalId: 'ice-and-fire:house:362', shortName: 'Stark' },
      { sourceId: '229', canonicalId: 'ice-and-fire:house:229', shortName: 'Lannister' },
      { sourceId: '378', canonicalId: 'ice-and-fire:house:378', shortName: 'Targaryen' },
      { sourceId: '17', canonicalId: 'ice-and-fire:house:17', shortName: 'Baratheon' },
      { sourceId: '169', canonicalId: 'ice-and-fire:house:169', shortName: 'Greyjoy' },
      { sourceId: '398', canonicalId: 'ice-and-fire:house:398', shortName: 'Tyrell' },
      { sourceId: '285', canonicalId: 'ice-and-fire:house:285', shortName: 'Martell' },
    ])
  })

  test('ordena majors primero y conserva las casas menores', () => {
    const amber = normalizeHouse(AMBER_HOUSE_FIXTURE)
    const sorted = sortHousesForArchive([
      amber,
      majorHouses[5],
      algood,
      majorHouses[2],
      majorHouses[0],
      majorHouses[6],
      majorHouses[1],
      majorHouses[4],
      majorHouses[3],
    ])

    expect(sorted.map((house) => house.source.externalId)).toEqual([
      '362',
      '229',
      '378',
      '17',
      '169',
      '398',
      '285',
      '1',
      '3',
    ])
  })

  test('el fixture Targaryen contiene solo datos de API, no visuales', () => {
    expect(TARGARYEN_HOUSE_FIXTURE).not.toHaveProperty('theme')
    expect(TARGARYEN_HOUSE_FIXTURE).not.toHaveProperty('themeKey')
    expect(getMajorHouseMetadata(majorHouses[2])?.themeKey).toBe('targaryen')
  })
})
