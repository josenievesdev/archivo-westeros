import { describe, expect, test } from 'vitest'
import { createCanonicalId } from '../../domain/canonical_entities'
import {
  extractCanonicalResourceId,
  extractResourceId,
  extractSourceRef,
} from './normalizer_utils'

describe('referencias de An API of Ice and Fire', () => {
  test('extrae una referencia tipada y un ID canónico de la fuente conocida', () => {
    const url = 'https://anapioficeandfire.com/api/characters/1303/'

    expect(extractResourceId(url, 'character')).toBe('1303')
    expect(extractSourceRef(url, 'character')).toEqual({
      source: 'ice-and-fire',
      resource: 'character',
      externalId: '1303',
      url,
    })
    expect(extractCanonicalResourceId(url, 'character')).toBe(
      'ice-and-fire:character:1303',
    )
  })

  test('rechaza otra procedencia, protocolo, colección o ID no numérico', () => {
    expect(
      extractSourceRef('https://example.com/api/characters/1303', 'character'),
    ).toBeNull()
    expect(
      extractSourceRef('ftp://anapioficeandfire.com/api/characters/1303', 'character'),
    ).toBeNull()
    expect(
      extractSourceRef('https://anapioficeandfire.com/api/houses/1303', 'character'),
    ).toBeNull()
    expect(
      extractSourceRef('https://anapioficeandfire.com/api/characters/dany', 'character'),
    ).toBeNull()
    expect(
      extractSourceRef('https://anapioficeandfire.com/api/characters/1303?copy=1', 'character'),
    ).toBeNull()
  })

  test('normaliza espacios y rechaza IDs externos inválidos al crear identidad', () => {
    expect(createCanonicalId('character', ' 1303 ')).toBe(
      'ice-and-fire:character:1303',
    )
    expect(() => createCanonicalId('character', 'Dany')).toThrowError(
      'No se puede crear un ID canónico',
    )
  })
})
