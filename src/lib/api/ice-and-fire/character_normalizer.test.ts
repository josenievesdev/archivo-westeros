import { describe, expect, test } from 'vitest'
import { createCharacterResponse } from '../../../test/fixtures/ice_and_fire_characters'
import { normalizeCharacter } from './character_normalizer'

describe('normalizeCharacter', () => {
  test('convierte la respuesta externa en el modelo interno', () => {
    const response = createCharacterResponse({
      url: 'https://anapioficeandfire.com/api/characters/583',
      name: ' Jon Snow ',
      gender: 'Male',
      culture: 'Northmen',
      born: 'In 283 AC',
      died: '',
      titles: ['', 'Lord Commander of the Night\'s Watch'],
      aliases: [' Lord Snow '],
      father: 'https://anapioficeandfire.com/api/characters/999',
      allegiances: ['https://anapioficeandfire.com/api/houses/362'],
      books: ['https://anapioficeandfire.com/api/books/1'],
      tvSeries: ['Season 1', ''],
      playedBy: ['Kit Harington'],
    })

    expect(normalizeCharacter(response)).toEqual({
      id: 'ice-and-fire:character:583',
      source: {
        source: 'ice-and-fire',
        resource: 'character',
        externalId: '583',
        url: response.url,
      },
      editorial: null,
      name: 'Jon Snow',
      gender: 'Male',
      culture: 'Northmen',
      born: 'In 283 AC',
      died: null,
      titles: ['Lord Commander of the Night\'s Watch'],
      aliases: ['Lord Snow'],
      fatherId: 'ice-and-fire:character:999',
      motherId: null,
      spouseId: null,
      allegianceIds: ['ice-and-fire:house:362'],
      bookIds: ['ice-and-fire:book:1'],
      povBookIds: [],
      tvSeries: ['Season 1'],
      playedBy: ['Kit Harington'],
    })
  })

  test('rechaza una URL que no identifica un personaje de la fuente', () => {
    const response = createCharacterResponse({
      url: 'https://anapioficeandfire.com/api/houses/583',
      name: 'Jon Snow',
    })

    expect(() => normalizeCharacter(response)).toThrowError(
      'La URL de fuente del personaje no es válida',
    )
  })
})
