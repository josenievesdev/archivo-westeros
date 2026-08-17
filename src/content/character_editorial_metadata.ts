import {
  createCanonicalId,
  createSourceIdentity,
  type CanonicalCharacter,
  type CanonicalCharacterId,
  type CharacterEditorialMetadata,
  type FeaturedCharacterMetadata,
} from '../lib/domain/canonical_entities'

interface CharacterMetadataInput {
  sourceId: string
  key: string
  preferredName: string
  featured: FeaturedCharacterMetadata | null
  knownActors: readonly string[]
  searchTerms: CharacterEditorialMetadata['searchTerms']
  searchPriority: number
}

export type FeaturedCharacterEditorialMetadata = CharacterEditorialMetadata & {
  readonly featured: FeaturedCharacterMetadata
}

function defineCharacterMetadata(
  input: CharacterMetadataInput,
): CharacterEditorialMetadata {
  return {
    ref: {
      source: 'realms-got',
      resource: 'character',
      key: input.key,
    },
    characterId: createCanonicalId('character', input.sourceId),
    source: createSourceIdentity('character', input.sourceId),
    preferredName: input.preferredName,
    featured: input.featured,
    knownActors: input.knownActors,
    searchTerms: input.searchTerms,
    searchPriority: input.searchPriority,
  }
}

export const CHARACTER_EDITORIAL_METADATA: readonly CharacterEditorialMetadata[] = [
  defineCharacterMetadata({
    sourceId: '583',
    key: 'jon-snow',
    preferredName: 'Jon Snow',
    featured: {
      order: 1,
      title: "Lord Commander of the Night's Watch",
      houseLabel: 'House Stark',
      houseTheme: 'stark',
    },
    knownActors: ['Kit Harington'],
    searchTerms: {
      en: [
        'Lord Snow',
        'Lord Crow',
        'The Bastard of Winterfell',
        "Lord Commander of the Night's Watch",
      ],
      es: [
        'Lord Cuervo',
        'El Bastardo de Winterfell',
        'Lord Comandante de la Guardia de la Noche',
      ],
    },
    searchPriority: 50,
  }),
  defineCharacterMetadata({
    sourceId: '1303',
    key: 'daenerys-targaryen',
    preferredName: 'Daenerys Targaryen',
    featured: {
      order: 2,
      title: 'Mother of Dragons',
      houseLabel: 'House Targaryen',
      houseTheme: 'targaryen',
    },
    knownActors: ['Emilia Clarke'],
    searchTerms: {
      en: [
        'Dany',
        'Daenerys Stormborn',
        'Mother of Dragons',
        'Dragon Queen',
        'The Dragon Queen',
        'Khaleesi',
      ],
      es: [
        'Daenerys de la Tormenta',
        'Madre de Dragones',
        'Reina Dragón',
        'La que no arde',
        'Rompedora de Cadenas',
      ],
    },
    searchPriority: 100,
  }),
  defineCharacterMetadata({
    sourceId: '1052',
    key: 'tyrion-lannister',
    preferredName: 'Tyrion Lannister',
    featured: {
      order: 3,
      title: 'The Imp',
      houseLabel: 'House Lannister',
      houseTheme: 'lannister',
    },
    knownActors: ['Peter Dinklage'],
    searchTerms: {
      en: ['The Imp', 'Halfman', 'Acting Hand of the King'],
      es: ['El Gnomo', 'Mediohombre', 'Mano del Rey en funciones'],
    },
    searchPriority: 50,
  }),
  defineCharacterMetadata({
    sourceId: '148',
    key: 'arya-stark',
    preferredName: 'Arya Stark',
    featured: {
      order: 4,
      title: 'Arya Underfoot',
      houseLabel: 'House Stark',
      houseTheme: 'stark',
    },
    knownActors: ['Maisie Williams'],
    searchTerms: {
      en: ['Arry', 'Arya Underfoot'],
      es: ['Arya Entremetida'],
    },
    searchPriority: 50,
  }),
  defineCharacterMetadata({
    sourceId: '238',
    key: 'cersei-lannister',
    preferredName: 'Cersei Lannister',
    featured: {
      order: 5,
      title: 'Queen Regent',
      houseLabel: 'House Lannister',
      houseTheme: 'lannister',
    },
    knownActors: ['Lena Headey'],
    searchTerms: {
      en: ['Queen Regent', 'Light of the West'],
      es: ['Reina Regente', 'Luz del Oeste'],
    },
    searchPriority: 50,
  }),
]

const metadataByCharacterId = new Map(
  CHARACTER_EDITORIAL_METADATA.map((metadata) => [metadata.characterId, metadata]),
)

function isFeaturedCharacter(
  metadata: CharacterEditorialMetadata,
): metadata is FeaturedCharacterEditorialMetadata {
  return metadata.featured !== null
}

export const FEATURED_CHARACTER_METADATA: readonly FeaturedCharacterEditorialMetadata[] =
  CHARACTER_EDITORIAL_METADATA.filter(isFeaturedCharacter).sort(
    (left, right) => left.featured.order - right.featured.order,
  )

export function getCharacterEditorialMetadata(
  characterId: CanonicalCharacterId,
): CharacterEditorialMetadata | null {
  return metadataByCharacterId.get(characterId) ?? null
}

export function enrichCanonicalCharacter(
  character: CanonicalCharacter,
): CanonicalCharacter {
  const editorial = getCharacterEditorialMetadata(character.id) ?? character.editorial

  return editorial === character.editorial ? character : { ...character, editorial }
}

export function mergeCanonicalCharacters(
  characters: readonly CanonicalCharacter[],
): CanonicalCharacter[] {
  const uniqueCharacters = new Map<CanonicalCharacterId, CanonicalCharacter>()

  characters.forEach((character) => {
    if (!uniqueCharacters.has(character.id)) {
      uniqueCharacters.set(character.id, enrichCanonicalCharacter(character))
    }
  })

  return [...uniqueCharacters.values()]
}
