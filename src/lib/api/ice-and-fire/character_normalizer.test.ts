import { describe, expect, test } from 'vitest'
import type { IceAndFireCharacterResponse } from './api_types'
import { normalizeCharacter } from './character_normalizer'

describe('normalizeCharacter', () => {
  test('convierte la respuesta externa en el modelo interno', () => {
    const response: IceAndFireCharacterResponse = {
      url: 'https://anapioficeandfire.com/api/characters/583',
      name: ' Jon Snow ',
      gender: 'Male',
      culture: 'Northmen',
      born: 'In 283 AC',
      died: '',
      titles: ['', 'Lord Commander of the Night\'s Watch'],
      aliases: [' Lord Snow '],
      father: 'https://anapioficeandfire.com/api/characters/999',
      mother: '',
      spouse: '',
      allegiances: ['https://anapioficeandfire.com/api/houses/362'],
      books: ['https://anapioficeandfire.com/api/books/1'],
      povBooks: [],
      tvSeries: ['Season 1', ''],
      playedBy: ['Kit Harington'],
    }

    expect(normalizeCharacter(response)).toEqual({
      id: '583',
      sourceUrl: response.url,
      name: 'Jon Snow',
      gender: 'Male',
      culture: 'Northmen',
      born: 'In 283 AC',
      died: null,
      titles: ['Lord Commander of the Night\'s Watch'],
      aliases: ['Lord Snow'],
      fatherId: '999',
      motherId: null,
      spouseId: null,
      allegianceIds: ['362'],
      bookIds: ['1'],
      povBookIds: [],
      tvSeries: ['Season 1'],
      playedBy: ['Kit Harington'],
    })
  })
})
