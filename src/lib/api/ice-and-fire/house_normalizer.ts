import type { IceAndFireHouseResponse } from './api_types'
import {
  createCanonicalId,
  type CanonicalHouse,
} from '../../domain/canonical_entities'
import {
  compactStrings,
  emptyToNull,
  extractCanonicalResourceId,
  extractCanonicalResourceIds,
  extractSourceRef,
} from './normalizer_utils'

export function normalizeHouse(house: IceAndFireHouseResponse): CanonicalHouse {
  const source = extractSourceRef(house.url, 'house')

  if (!source) {
    throw new TypeError(`La URL de fuente de la casa no es válida: ${house.url}`)
  }

  return {
    id: createCanonicalId('house', source.externalId),
    source,
    name: house.name.trim(),
    region: emptyToNull(house.region),
    coatOfArms: emptyToNull(house.coatOfArms),
    words: emptyToNull(house.words),
    titles: compactStrings(house.titles),
    seats: compactStrings(house.seats),
    currentLordId: extractCanonicalResourceId(house.currentLord, 'character'),
    heirId: extractCanonicalResourceId(house.heir, 'character'),
    overlordId: extractCanonicalResourceId(house.overlord, 'house'),
    founded: emptyToNull(house.founded),
    founderId: extractCanonicalResourceId(house.founder, 'character'),
    diedOut: emptyToNull(house.diedOut),
    ancestralWeapons: compactStrings(house.ancestralWeapons),
    cadetBranchIds: extractCanonicalResourceIds(house.cadetBranches, 'house'),
    swornMemberIds: extractCanonicalResourceIds(house.swornMembers, 'character'),
  }
}
