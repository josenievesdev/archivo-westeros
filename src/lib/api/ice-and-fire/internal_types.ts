export interface Character {
  id: string
  sourceUrl: string
  name: string | null
  gender: string | null
  culture: string | null
  born: string | null
  died: string | null
  titles: string[]
  aliases: string[]
  fatherId: string | null
  motherId: string | null
  spouseId: string | null
  allegianceIds: string[]
  bookIds: string[]
  povBookIds: string[]
  tvSeries: string[]
  playedBy: string[]
}

export interface House {
  id: string
  sourceUrl: string
  name: string
  region: string | null
  coatOfArms: string | null
  words: string | null
  titles: string[]
  seats: string[]
  currentLordId: string | null
  heirId: string | null
  overlordId: string | null
  founded: string | null
  founderId: string | null
  diedOut: string | null
  ancestralWeapons: string[]
  cadetBranchIds: string[]
  swornMemberIds: string[]
}

export interface ResourceListParams {
  page?: number
  pageSize?: number
  name?: string
}
