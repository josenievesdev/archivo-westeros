import { describe, expect, it } from 'vitest'
import {
  getHouseThemeFromName,
  resolveHouseTheme,
} from '../../../components/ui/house-theme'
import type { CanonicalHouse } from '../../../lib/domain/canonical_entities'
import { toHouseDetailViewModel } from './house-detail.connection'

function makeHouse(name: string, overrides: Partial<CanonicalHouse> = {}): CanonicalHouse {
  return {
    ancestralWeapons: [],
    cadetBranchIds: [],
    coatOfArms: null,
    currentLordId: null,
    diedOut: null,
    founded: null,
    founderId: null,
    heirId: null,
    id: 'ice-and-fire:house:1',
    name,
    overlordId: null,
    region: null,
    seats: [],
    source: {
      externalId: '1',
      resource: 'house',
      source: 'ice-and-fire',
      url: 'https://anapioficeandfire.com/api/houses/1',
    },
    swornMemberIds: [],
    titles: [],
    words: null,
    ...overrides,
  }
}

describe('tema de la casa', () => {
  it('una casa menor resuelve el tema neutral', () => {
    expect(toHouseDetailViewModel(makeHouse('House Blackfyre')).theme).toBe('neutral')
    expect(
      toHouseDetailViewModel(makeHouse('House Frey of the Crossing')).theme,
    ).toBe('neutral')
  })

  it('Stark sigue siendo stark', () => {
    expect(toHouseDetailViewModel(makeHouse('House Stark of Winterfell')).theme).toBe(
      'stark',
    )
  })

  it('Targaryen sigue siendo targaryen', () => {
    expect(
      toHouseDetailViewModel(makeHouse("House Targaryen of King's Landing")).theme,
    ).toBe('targaryen')
  })

  it('mantiene el tema de las siete grandes casas', () => {
    const expected: Array<[string, string]> = [
      ['House Stark of Winterfell', 'stark'],
      ['House Lannister of Casterly Rock', 'lannister'],
      ["House Targaryen of King's Landing", 'targaryen'],
      ['House Baratheon of Storms End', 'baratheon'],
      ['House Greyjoy of Pyke', 'greyjoy'],
      ['House Tyrell of Highgarden', 'tyrell'],
      ['House Martell of Sunspear', 'martell'],
    ]

    for (const [name, theme] of expected) {
      expect(resolveHouseTheme(name)).toBe(theme)
    }
  })

  /**
   * La Home y el listado de casas distinguen «gran casa» de «sin coincidencia»
   * para decidir entre sigilo y icono genérico. Si `getHouseThemeFromName`
   * empezara a devolver `neutral`, esas vistas cambiarían solas.
   */
  it('no cambia la Home: sin coincidencia sigue siendo undefined', () => {
    expect(getHouseThemeFromName('House Blackfyre')).toBeUndefined()
    expect(getHouseThemeFromName('House Stark of Winterfell')).toBe('stark')
  })

  it('no inventa escudo para una casa menor sin blasón', () => {
    expect(toHouseDetailViewModel(makeHouse('House Blackfyre')).heraldry).toBeUndefined()
  })

  it('deriva el nombre corto y el nombre completo', () => {
    const view = toHouseDetailViewModel(makeHouse("House Targaryen of King's Landing"))

    expect(view.name).toBe('Targaryen')
    expect(view.displayName).toBe('House Targaryen')
  })

  it('marca como extinta la casa que consta desaparecida', () => {
    const view = toHouseDetailViewModel(
      makeHouse('House Blackfyre', { diedOut: 'In 260 AC' }),
    )

    expect(view.statusLabel).toBe('Linaje extinto')
    expect(view.statusTone).toBe('extinct')
  })
})
