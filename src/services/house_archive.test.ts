import { describe, expect, test } from 'vitest'
import {
  ALGOOD_HOUSE_FIXTURE,
  AMBER_HOUSE_FIXTURE,
  STARK_HOUSE_FIXTURE,
  TARGARYEN_HOUSE_FIXTURE,
  VERIFIED_MAJOR_HOUSE_FIXTURES,
} from '../test/fixtures/ice_and_fire_houses'
import { normalizeHouse } from '../lib/api/ice-and-fire/house_normalizer'
import {
  buildHouseArchiveEntries,
  createHouseSearchDocument,
  filterHouseArchiveEntriesByRegion,
  getHouseArchiveRegions,
  searchHouseArchiveEntries,
  sortHouseArchiveEntries,
} from './house_archive'

describe('archivo y búsqueda de casas', () => {
  const houses = [
    normalizeHouse(ALGOOD_HOUSE_FIXTURE),
    normalizeHouse(AMBER_HOUSE_FIXTURE),
    ...VERIFIED_MAJOR_HOUSE_FIXTURES.map(normalizeHouse),
  ]
  const entries = buildHouseArchiveEntries(houses)

  test('construye un modelo sin mezclar identidad canónica y source ID', () => {
    const stark = entries.find((entry) => entry.shortName === 'Stark')

    expect(stark).toMatchObject({
      canonicalId: 'ice-and-fire:house:362',
      sourceId: '362',
      displayName: 'House Stark of Winterfell',
      isMajor: true,
      majorOrder: 1,
      themeKey: 'stark',
    })
  })

  test('ordena las siete majors y después las menores alfabéticamente', () => {
    expect(sortHouseArchiveEntries(entries).map((entry) => entry.sourceId)).toEqual([
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

  test.each([
    ['nombre', 'House Stark of Winterfell'],
    ['shortName', 'Stark'],
    ['región', 'The North'],
    ['lema', 'Winter is Coming'],
    ['asiento', 'Winterfell'],
  ])('encuentra Stark por %s', (_field, query) => {
    const results = searchHouseArchiveEntries(entries, query)

    expect(results[0]?.canonicalId).toBe('ice-and-fire:house:362')
  })

  test('no elimina casas menores al buscar y ordenar una consulta vacía', () => {
    const results = searchHouseArchiveEntries(entries, '')

    expect(results).toHaveLength(entries.length)
    expect(results.map((entry) => entry.sourceId)).toEqual(
      expect.arrayContaining(['1', '3']),
    )
  })

  test('usa searchBoost para ordenar una major antes que otra coincidencia regional', () => {
    const results = searchHouseArchiveEntries(entries, 'The North')

    expect(results.map((entry) => entry.sourceId)).toEqual(['362', '3'])
  })

  test('deriva regiones de los registros cargados y filtra por valor de fuente', () => {
    const regions = getHouseArchiveRegions(entries)
    const northernHouses = filterHouseArchiveEntriesByRegion(entries, 'The North')

    expect(regions).toEqual([
      'Dorne',
      'Iron Islands',
      'The Crownlands',
      'The North',
      'The Reach',
      'The Stormlands',
      'The Westerlands',
    ])
    expect(northernHouses.map((entry) => entry.sourceId)).toEqual(['3', '362'])
  })

  test('crea un documento solo con campos semánticos de búsqueda', () => {
    const targaryen = buildHouseArchiveEntries([
      normalizeHouse(TARGARYEN_HOUSE_FIXTURE),
    ])[0]

    expect(createHouseSearchDocument(targaryen)).toEqual({
      canonicalId: 'ice-and-fire:house:378',
      sourceId: '378',
      names: ["House Targaryen of King's Landing"],
      shortNames: ['Targaryen'],
      regions: ['The Crownlands'],
      words: ['Fire and Blood'],
      seats: ['Red Keep (formerly)', 'Summerhall (formerly)'],
      searchBoost: 100,
    })
  })

  test('los fixtures de API no contienen metadata de tema', () => {
    expect(STARK_HOUSE_FIXTURE).not.toHaveProperty('themeKey')
    expect(TARGARYEN_HOUSE_FIXTURE).not.toHaveProperty('themeKey')
  })
})
