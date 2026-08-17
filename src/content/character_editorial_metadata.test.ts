import { describe, expect, test } from 'vitest'
import {
  DAENERYS_HISTORICAL_RESPONSE,
  DAENERYS_MAIN_RESPONSE,
} from '../test/fixtures/ice_and_fire_characters'
import { normalizeCharacter } from '../lib/api/ice-and-fire/character_normalizer'
import {
  enrichCanonicalCharacter,
  mergeCanonicalCharacters,
} from './character_editorial_metadata'

describe('metadata editorial de personajes', () => {
  test('enriquece la entidad 1303 sin cambiar su identidad ni sus valores de fuente', () => {
    const sourceCharacter = normalizeCharacter(DAENERYS_MAIN_RESPONSE)
    const canonicalCharacter = enrichCanonicalCharacter(sourceCharacter)

    expect(canonicalCharacter).not.toBe(sourceCharacter)
    expect(canonicalCharacter.id).toBe('ice-and-fire:character:1303')
    expect(canonicalCharacter.source.externalId).toBe('1303')
    expect(canonicalCharacter.name).toBe('Daenerys Targaryen')
    expect(canonicalCharacter.born).toBe('In 284 AC, at Dragonstone')
    expect(canonicalCharacter.editorial?.ref).toEqual({
      source: 'realms-got',
      resource: 'character',
      key: 'daenerys-targaryen',
    })
    expect(sourceCharacter.editorial).toBeNull()
  })

  test('conserva homónimos con IDs canónicos distintos y solo une el mismo ID', () => {
    const historical = normalizeCharacter(DAENERYS_HISTORICAL_RESPONSE)
    const main = normalizeCharacter(DAENERYS_MAIN_RESPONSE)
    const merged = mergeCanonicalCharacters([historical, main, main])

    expect(merged).toHaveLength(2)
    expect(merged.map((character) => character.id)).toEqual([
      'ice-and-fire:character:271',
      'ice-and-fire:character:1303',
    ])
    expect(merged.map((character) => character.name)).toEqual([
      'Daenerys Targaryen',
      'Daenerys Targaryen',
    ])
    expect(merged[0].editorial).toBeNull()
    expect(merged[1].editorial?.characterId).toBe(main.id)
  })
})
