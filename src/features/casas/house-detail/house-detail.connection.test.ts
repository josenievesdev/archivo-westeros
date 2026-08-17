import { describe, expect, it } from 'vitest'
import {
  getHouseThemeFromName,
  resolveHouseTheme,
} from '../../../components/ui/house-theme'
import { getMajorHouseMetadata } from '../../../content/house_editorial_metadata'
import { createCharacterResponse } from '../../../test/fixtures/ice_and_fire_characters'
import { normalizeCharacter } from '../../../lib/api/ice-and-fire/character_normalizer'
import type {
  CanonicalCharacter,
  CanonicalHouse,
} from '../../../lib/domain/canonical_entities'
import type { HouseDataBundle } from '../../../lib/domain/house_types'
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

function makeBundle(
  house: CanonicalHouse,
  overrides: Partial<HouseDataBundle> = {},
): HouseDataBundle {
  return {
    house,
    metadata: getMajorHouseMetadata(house),
    currentLord: null,
    heir: null,
    founder: null,
    overlord: null,
    cadetBranches: [],
    swornMembers: [],
    counts: {
      cadetBranchesTotal: house.cadetBranchIds.length,
      cadetBranchesResolved: 0,
      cadetBranchesOmitted: 0,
      swornMembersTotal: house.swornMemberIds.length,
      swornMembersRequested: 0,
      swornMembersResolved: 0,
      swornMembersOmitted: house.swornMemberIds.length,
    },
    relationFailures: [],
    ...overrides,
  }
}

function toView(name: string, overrides: Partial<CanonicalHouse> = {}) {
  const house = makeHouse(name, overrides)
  return toHouseDetailViewModel(makeBundle(house))
}

function makeCharacter(
  sourceId: string,
  name: string,
  aliases: string[] = [],
): CanonicalCharacter {
  return normalizeCharacter(
    createCharacterResponse({
      url: `https://anapioficeandfire.com/api/characters/${sourceId}`,
      name,
      aliases,
    }),
  )
}

describe('tema de la casa', () => {
  it('una casa menor resuelve el tema neutral', () => {
    expect(toView('House Blackfyre').theme).toBe('neutral')
    expect(toView('House Frey of the Crossing').theme).toBe('neutral')
  })

  it('Stark sigue siendo stark', () => {
    expect(toView('House Stark of Winterfell').theme).toBe('stark')
  })

  it('Targaryen sigue siendo targaryen', () => {
    expect(toView("House Targaryen of King's Landing").theme).toBe('targaryen')
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
    expect(toView('House Blackfyre').heraldry).toBeUndefined()
  })

  it('deriva el nombre corto y el nombre completo', () => {
    const view = toView("House Targaryen of King's Landing")

    expect(view.name).toBe('Targaryen')
    expect(view.displayName).toBe('House Targaryen')
  })

  it('marca como extinta la casa que consta desaparecida', () => {
    const view = toView('House Blackfyre', { diedOut: 'In 260 AC' })

    expect(view.statusLabel).toBe('Linaje extinto')
    expect(view.statusTone).toBe('extinct')
  })
})

describe('mapper de HouseDataBundle', () => {
  const house = makeHouse("House Baratheon of Storm's End", {
    id: 'ice-and-fire:house:17',
    source: {
      externalId: '17',
      resource: 'house',
      source: 'ice-and-fire',
      url: 'https://anapioficeandfire.com/api/houses/17',
    },
  })

  it('expone currentLord y currentHead con el nombre resuelto', () => {
    const currentLord = makeCharacter('1029', 'Tommen Baratheon')
    const view = toHouseDetailViewModel(makeBundle(house, { currentLord }))

    expect(view.currentHead).toBe('Tommen Baratheon')
    expect(view.currentLord).toEqual({
      id: 'ice-and-fire:character:1029',
      name: 'Tommen Baratheon',
      to: '/personajes/1029',
    })
  })

  it('expone heir sin inventar campos visuales', () => {
    const heir = makeCharacter('775', 'Myrcella Baratheon')
    const view = toHouseDetailViewModel(makeBundle(house, { heir }))

    expect(view.heir?.name).toBe('Myrcella Baratheon')
    expect(view.heir?.to).toBe('/personajes/775')
  })

  it('mantiene founder fuera de una cronología falsa', () => {
    const founder = makeCharacter('797', 'Orys Baratheon')
    const view = toHouseDetailViewModel(makeBundle(house, { founder }))

    expect(view.founder?.name).toBe('Orys Baratheon')
    expect(view.leadership).toEqual([])
  })

  it('mapea como máximo cuatro swornMembers con datos reales', () => {
    const swornMembers = [
      makeCharacter('110', 'Alyssa Velaryon'),
      makeCharacter('128', 'Argella Durrandon'),
      makeCharacter('216', 'Brienne of Tarth'),
      makeCharacter('230', 'Cassana Estermont'),
      makeCharacter('249', 'Colen of Greenpools'),
    ]
    const view = toHouseDetailViewModel(
      makeBundle(house, {
        swornMembers,
        counts: {
          cadetBranchesTotal: 0,
          cadetBranchesResolved: 0,
          cadetBranchesOmitted: 0,
          swornMembersTotal: 19,
          swornMembersRequested: 5,
          swornMembersResolved: 5,
          swornMembersOmitted: 14,
        },
      }),
    )

    expect(view.members).toHaveLength(4)
    expect(view.members.map((member) => member.name)).toEqual([
      'Alyssa Velaryon',
      'Argella Durrandon',
      'Brienne of Tarth',
      'Cassana Estermont',
    ])
    expect(view.members.every((member) => member.status === undefined)).toBe(true)
  })

  it('no convierte overlord ni cadetBranches en swornHouses', () => {
    const overlord = makeHouse("House Baratheon of King's Landing", {
      id: 'ice-and-fire:house:16',
      source: {
        externalId: '16',
        resource: 'house',
        source: 'ice-and-fire',
        url: 'https://anapioficeandfire.com/api/houses/16',
      },
    })
    const cadetBranch = makeHouse('House Baratheon of Dragonstone', {
      id: 'ice-and-fire:house:15',
      source: {
        externalId: '15',
        resource: 'house',
        source: 'ice-and-fire',
        url: 'https://anapioficeandfire.com/api/houses/15',
      },
    })
    const view = toHouseDetailViewModel(
      makeBundle(house, { overlord, cadetBranches: [cadetBranch] }),
    )

    expect(view.overlord?.name).toBe("House Baratheon of King's Landing")
    expect(view.cadetBranches?.[0]?.name).toBe('House Baratheon of Dragonstone')
    expect(view.swornHouses).toEqual([])
    expect(view.swornHousesCount).toBeUndefined()
  })
})
