import { describe, expect, test } from 'vitest'
import { STARK_HOUSE_FIXTURE } from '../../../test/fixtures/ice_and_fire_houses'
import { normalizeHouse } from './house_normalizer'

describe('normalizeHouse', () => {
  test('prepara identidad y relaciones canónicas sin traducir la fuente', () => {
    expect(normalizeHouse(STARK_HOUSE_FIXTURE)).toEqual({
      id: 'ice-and-fire:house:362',
      source: {
        source: 'ice-and-fire',
        resource: 'house',
        externalId: '362',
        url: STARK_HOUSE_FIXTURE.url,
      },
      name: 'House Stark of Winterfell',
      region: 'The North',
      coatOfArms: 'A running grey direwolf, on an ice-white field',
      words: 'Winter is Coming',
      titles: [
        'King in the North',
        'Lord of Winterfell',
        'Warden of the North',
        'King of the Trident',
      ],
      seats: ['Scattered (formerly Winterfell)'],
      currentLordId: null,
      heirId: null,
      overlordId: 'ice-and-fire:house:16',
      founded: 'Age of Heroes',
      founderId: 'ice-and-fire:character:209',
      diedOut: null,
      ancestralWeapons: ['Ice'],
      cadetBranchIds: [
        'ice-and-fire:house:170',
        'ice-and-fire:house:215',
      ],
      swornMemberIds: [
        'ice-and-fire:character:2',
        'ice-and-fire:character:20',
        'ice-and-fire:character:97',
        'ice-and-fire:character:98',
        'ice-and-fire:character:136',
        'ice-and-fire:character:143',
        'ice-and-fire:character:148',
      ],
    })
  })
})
