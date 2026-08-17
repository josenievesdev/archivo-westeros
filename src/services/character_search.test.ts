import { describe, expect, test } from 'vitest'
import {
  DAENERYS_HISTORICAL_RESPONSE,
  DAENERYS_MAIN_RESPONSE,
  JON_SNOW_RESPONSE,
} from '../test/fixtures/ice_and_fire_characters'
import { enrichCanonicalCharacter } from '../content/character_editorial_metadata'
import { normalizeCharacter } from '../lib/api/ice-and-fire/character_normalizer'
import {
  createApiCharacterName,
  createCharacterSearchDocument,
  createCharacterSearchPlan,
  normalizeSearchText,
  rankCharacterSearchResults,
} from './character_search'

describe('búsqueda canónica de personajes', () => {
  const historicalDaenerys = enrichCanonicalCharacter(
    normalizeCharacter(DAENERYS_HISTORICAL_RESPONSE),
  )
  const mainDaenerys = enrichCanonicalCharacter(
    normalizeCharacter(DAENERYS_MAIN_RESPONSE),
  )
  const jonSnow = enrichCanonicalCharacter(normalizeCharacter(JON_SNOW_RESPONSE))

  test('resuelve aliases y títulos en español o inglés al nombre consultable', () => {
    expect(createCharacterSearchPlan('Madre de Dragones').requestNames).toEqual([
      'Daenerys Targaryen',
    ])
    expect(createCharacterSearchPlan("Lord Commander of the Night's Watch").requestNames).toEqual([
      'Jon Snow',
    ])
    expect(createCharacterSearchPlan('reina dragon').preferredCharacterIds).toEqual([
      'ice-and-fire:character:1303',
    ])
  })

  test('normaliza mayúsculas, espacios y tildes para coincidencias parciales', () => {
    expect(normalizeSearchText('  REINA Dragón  ')).toBe('reina dragon')
    expect(createCharacterSearchPlan('  REINA Dragón  ').normalizedQuery).toBe(
      'reina dragon',
    )
    expect(createCharacterSearchPlan('daene').requestNames).toEqual([
      'Daenerys Targaryen',
    ])
    expect(createCharacterSearchPlan('Emilia Clarke').requestNames).toEqual([
      'Daenerys Targaryen',
    ])
    expect(createApiCharacterName('  AEGÓN V TARGARYEN  ')).toBe(
      'Aegon V Targaryen',
    )
    expect(createCharacterSearchPlan('aegón targaryen').requestNames).toEqual([
      'Aegon Targaryen',
    ])
  })

  test.each([
    'Garth XII Gardener',
    'All-for-Joffrey',
    'Bethany Fair-Fingers',
    'Chella daughter of Cheyk',
    'Conn son of Coratt',
    'Crawn son of Calor',
    'Dolf son of Holger',
    'Gunthor son of Gurn',
    'Harren Half-Hoare',
    'Hop-Robin',
    "Illyrio's first wife",
    'Kojja Mo',
    'Quhuru Mo',
    'Rowan Gold-Tree',
    'Shagga son of Dolf',
    'Symeon Star-Eyes',
    'Three-Tooth',
    'Timett son of Timett',
    'TomToo',
    'Ulf son of Umar',
  ])('conserva la ortografía especial de la API para %s', (name) => {
    expect(createApiCharacterName(name)).toBe(name)
  })

  test('recupera ortografías especiales desde minúsculas', () => {
    expect(createApiCharacterName('garth xii gardener')).toBe('Garth XII Gardener')
    expect(createApiCharacterName('all-for-joffrey')).toBe('All-for-Joffrey')
    expect(createApiCharacterName('tomtoo')).toBe('TomToo')
  })

  test('indexa valores originales, localizados y editoriales', () => {
    const document = createCharacterSearchDocument(mainDaenerys)

    expect(document.aliases).toContain('Mother of Dragons')
    expect(document.aliases).toContain('Madre de Dragones')
    expect(document.titles).toContain('Princesa de Dragonstone')
    expect(document.actors).toContain('Emilia Clarke')
    expect(document.chronology).toContain('En 284 d. C., en Dragonstone')
  })

  test('prioriza 1303 sobre 271 sin deduplicar por nombre', () => {
    const hits = rankCharacterSearchResults(
      [historicalDaenerys, mainDaenerys],
      'Daenerys Targaryen',
      ['ice-and-fire:character:1303'],
    )

    expect(hits).toHaveLength(2)
    expect(hits.map((hit) => hit.character.source.externalId)).toEqual([
      '1303',
      '271',
    ])
    expect(hits[0].disambiguation).toBe(
      'Emilia Clarke · En 284 d. C., en Dragonstone',
    )
    expect(hits[1].disambiguation).toBe('En 172 d. C. · Princesa')
    expect(hits[0].score).toBeGreaterThan(hits[1].score)
  })

  test('puntúa aliases localizados sin convertirlos en entidades nuevas', () => {
    const hits = rankCharacterSearchResults(
      [historicalDaenerys, jonSnow, mainDaenerys],
      'madre de dragones',
      ['ice-and-fire:character:1303'],
    )

    expect(hits[0].character.id).toBe('ice-and-fire:character:1303')
    expect(hits[0].matchedFields).toEqual(
      expect.arrayContaining(['alias', 'editorial']),
    )
    expect(hits.filter((hit) => hit.character.name === 'Daenerys Targaryen')).toHaveLength(2)
  })
})
