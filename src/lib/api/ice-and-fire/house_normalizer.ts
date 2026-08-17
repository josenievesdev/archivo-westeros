import type { IceAndFireHouseResponse } from './api_types'
import type { House } from './internal_types'
import {
  compactStrings,
  emptyToNull,
  extractResourceId,
  extractResourceIds,
} from './normalizer_utils'

export function normalizeHouse(house: IceAndFireHouseResponse): House {
  return {
    id: extractResourceId(house.url) ?? house.url,
    sourceUrl: house.url,
    name: house.name.trim(),
    region: emptyToNull(house.region),
    coatOfArms: emptyToNull(house.coatOfArms),
    words: emptyToNull(house.words),
    titles: compactStrings(house.titles),
    seats: compactStrings(house.seats),
    currentLordId: extractResourceId(house.currentLord),
    heirId: extractResourceId(house.heir),
    overlordId: extractResourceId(house.overlord),
    founded: emptyToNull(house.founded),
    founderId: extractResourceId(house.founder),
    diedOut: emptyToNull(house.diedOut),
    ancestralWeapons: compactStrings(house.ancestralWeapons),
    cadetBranchIds: extractResourceIds(house.cadetBranches),
    swornMemberIds: extractResourceIds(house.swornMembers),
  }
}
