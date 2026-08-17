import type { IceAndFireCharacterResponse } from './api_types'
import type { Character } from './internal_types'
import {
  compactStrings,
  emptyToNull,
  extractResourceId,
  extractResourceIds,
} from './normalizer_utils'

export function normalizeCharacter(
  character: IceAndFireCharacterResponse,
): Character {
  return {
    id: extractResourceId(character.url) ?? character.url,
    sourceUrl: character.url,
    name: emptyToNull(character.name),
    gender: emptyToNull(character.gender),
    culture: emptyToNull(character.culture),
    born: emptyToNull(character.born),
    died: emptyToNull(character.died),
    titles: compactStrings(character.titles),
    aliases: compactStrings(character.aliases),
    fatherId: extractResourceId(character.father),
    motherId: extractResourceId(character.mother),
    spouseId: extractResourceId(character.spouse),
    allegianceIds: extractResourceIds(character.allegiances),
    bookIds: extractResourceIds(character.books),
    povBookIds: extractResourceIds(character.povBooks),
    tvSeries: compactStrings(character.tvSeries),
    playedBy: compactStrings(character.playedBy),
  }
}
