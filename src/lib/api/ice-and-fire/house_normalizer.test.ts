import { describe, expect, test } from 'vitest'
import type { IceAndFireHouseResponse } from './api_types'
import { normalizeHouse } from './house_normalizer'

describe('normalizeHouse', () => {
  test('prepara identidad y relaciones canónicas sin traducir la fuente', () => {
    const response: IceAndFireHouseResponse = {
      url: 'https://anapioficeandfire.com/api/houses/362',
      name: ' House Stark of Winterfell ',
      region: 'The North',
      coatOfArms: 'A grey direwolf on a white field',
      words: 'Winter is Coming',
      titles: ['King in the North'],
      seats: ['Winterfell'],
      currentLord: 'https://anapioficeandfire.com/api/characters/583',
      heir: '',
      overlord: 'https://anapioficeandfire.com/api/houses/16',
      founded: 'Age of Heroes',
      founder: 'https://anapioficeandfire.com/api/characters/209',
      diedOut: '',
      ancestralWeapons: ['Ice'],
      cadetBranches: ['https://anapioficeandfire.com/api/houses/215'],
      swornMembers: ['https://anapioficeandfire.com/api/characters/583'],
    }

    expect(normalizeHouse(response)).toMatchObject({
      id: 'ice-and-fire:house:362',
      source: {
        source: 'ice-and-fire',
        resource: 'house',
        externalId: '362',
        url: response.url,
      },
      name: 'House Stark of Winterfell',
      region: 'The North',
      currentLordId: 'ice-and-fire:character:583',
      overlordId: 'ice-and-fire:house:16',
      founderId: 'ice-and-fire:character:209',
      cadetBranchIds: ['ice-and-fire:house:215'],
      swornMemberIds: ['ice-and-fire:character:583'],
    })
  })
})
