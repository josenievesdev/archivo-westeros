import type { IceAndFireCharacterResponse } from './api_types'
import {
  createCanonicalId,
  type CanonicalCharacter,
} from '../../domain/canonical_entities'
import {
  compactStrings,
  emptyToNull,
  extractCanonicalResourceId,
  extractCanonicalResourceIds,
  extractSourceRef,
} from './normalizer_utils'

export function normalizeCharacter(
  character: IceAndFireCharacterResponse,
): CanonicalCharacter {
  const source = extractSourceRef(character.url, 'character')

  if (!source) {
    throw new TypeError(`La URL de fuente del personaje no es válida: ${character.url}`)
  }

  return {
    id: createCanonicalId('character', source.externalId),
    source,
    editorial: null,
    name: emptyToNull(character.name),
    gender: emptyToNull(character.gender),
    culture: emptyToNull(character.culture),
    born: emptyToNull(character.born),
    died: emptyToNull(character.died),
    titles: compactStrings(character.titles),
    aliases: compactStrings(character.aliases),
    fatherId: extractCanonicalResourceId(character.father, 'character'),
    motherId: extractCanonicalResourceId(character.mother, 'character'),
    spouseId: extractCanonicalResourceId(character.spouse, 'character'),
    allegianceIds: extractCanonicalResourceIds(character.allegiances, 'house'),
    bookIds: extractCanonicalResourceIds(character.books, 'book'),
    povBookIds: extractCanonicalResourceIds(character.povBooks, 'book'),
    tvSeries: compactStrings(character.tvSeries),
    playedBy: compactStrings(character.playedBy),
  }
}
