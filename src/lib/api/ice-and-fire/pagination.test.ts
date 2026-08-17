import { describe, expect, test } from 'vitest'
import { parsePaginationLinkHeader } from './pagination'

describe('paginación de An API of Ice and Fire', () => {
  test('conserva las relaciones de página del header Link', () => {
    const pagination = parsePaginationLinkHeader(
      '<https://anapioficeandfire.com/api/houses?page=2&pageSize=12>; rel="next", <https://anapioficeandfire.com/api/houses?page=1&pageSize=12>; rel="first", <https://anapioficeandfire.com/api/houses?page=37&pageSize=12>; rel="last"',
    )

    expect(pagination).toEqual({
      firstPage: 1,
      previousPage: null,
      nextPage: 2,
      lastPage: 37,
    })
  })

  test('reconoce la página anterior sin inventar una siguiente', () => {
    const pagination = parsePaginationLinkHeader(
      '<https://anapioficeandfire.com/api/houses?page=36&pageSize=12>; rel="prev", <https://anapioficeandfire.com/api/houses?page=1&pageSize=12>; rel="first", <https://anapioficeandfire.com/api/houses?page=37&pageSize=12>; rel="last"',
    )

    expect(pagination.previousPage).toBe(36)
    expect(pagination.nextPage).toBeNull()
  })

  test('trata metadata ausente o inválida como alcance desconocido', () => {
    expect(parsePaginationLinkHeader(null)).toEqual({
      firstPage: null,
      previousPage: null,
      nextPage: null,
      lastPage: null,
    })
    expect(parsePaginationLinkHeader('<not-a-url>; rel="next"').nextPage).toBeNull()
  })
})
