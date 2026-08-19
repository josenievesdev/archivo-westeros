import { describe, expect, test, vi, beforeEach } from 'vitest'
import { getCharacterMediaFromList } from './character_media_service'
import type { ThronesCharacterDto } from '../lib/api/thronesapi/api_types'
import type { CanonicalCharacter } from '../lib/domain/canonical_entities'
import { normalizeThronesCharacter } from '../lib/domain/character_media'

vi.mock('../lib/domain/character_media')

describe('getCharacterMediaFromList', () => {
  const mockThronesCharacters: ThronesCharacterDto[] = [
    {
      id: 2,
      firstName: 'Jon',
      lastName: 'Snow',
      fullName: 'Jon Snow',
      title: 'King of the North',
      family: 'House Stark',
      image: 'jon-snow.jpg',
      imageUrl: 'https://thronesapi.com/assets/images/jon-snow.jpg',
    },
    {
      id: 0,
      firstName: 'Daenerys',
      lastName: 'Targaryen',
      fullName: 'Daenerys Targaryen',
      title: 'Mother of Dragons',
      family: 'House Targaryen',
      image: 'daenerys.jpg',
      imageUrl: 'https://thronesapi.com/assets/images/daenerys.jpg',
    },
  ]

  const mockCanonicalCharacter: CanonicalCharacter = {
    id: 'ice-and-fire:character:583' as const,
    source: {
      source: 'ice-and-fire',
      resource: 'character',
      externalId: '583',
      url: 'https://anapioficeandfire.com/api/characters/583',
    },
    editorial: {
      ref: {
        source: 'realms-got',
        resource: 'character',
        key: 'jon-snow',
      },
      characterId: 'ice-and-fire:character:583',
      source: {
        source: 'ice-and-fire',
        resource: 'character',
        externalId: '583',
      },
      preferredName: 'Jon Snow',
      featured: {
        order: 1,
        title: "Lord Commander of the Night's Watch",
        houseLabel: 'House Stark',
        houseTheme: 'stark',
      },
      knownActors: ['Kit Harington'],
      searchTerms: {
        en: ['Lord Snow', 'Lord Crow', 'The Bastard of Winterfell', "Lord Commander of the Night's Watch"],
        es: ['Lord Cuervo', 'El Bastardo de Winterfell', 'Lord Comandante de la Guardia de la Noche'],
      },
      searchPriority: 50,
    },
    name: 'Jon Snow',
    gender: 'Male',
    culture: null,
    born: null,
    died: null,
    titles: [],
    aliases: [],
    fatherId: null,
    motherId: null,
    spouseId: null,
    allegianceIds: [],
    bookIds: [],
    povBookIds: [],
    tvSeries: [],
    playedBy: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns undefined when there is no mapping for the canonical character', () => {
    const unmappedCharacter: CanonicalCharacter = {
      ...mockCanonicalCharacter,
      id: 'ice-and-fire:character:999' as const, // not in mapping
    }

    const result = getCharacterMediaFromList(mockThronesCharacters, unmappedCharacter)

    expect(result).toBeUndefined()
    expect(normalizeThronesCharacter).not.toHaveBeenCalled()
  })

  test('returns undefined when mapping exists but ThronesAPI record not found', () => {
    // Use the Tyrion mapping (providerId 14) which is not in our mock list
    const tyrionCharacter: CanonicalCharacter = {
      id: 'ice-and-fire:character:1052' as const,
      source: {
        source: 'ice-and-fire',
        resource: 'character',
        externalId: '1052',
        url: 'https://anapioficeandfire.com/api/characters/1052',
      },
      editorial: {
        ref: {
          source: 'realms-got',
          resource: 'character',
          key: 'tyrion-lannister',
        },
        characterId: 'ice-and-fire:character:1052',
        source: {
          source: 'ice-and-fire',
          resource: 'character',
          externalId: '1052',
        },
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
      },
      name: 'Tyrion Lannister',
      gender: 'Male',
      culture: null,
      born: null,
      died: null,
      titles: [],
      aliases: [],
      fatherId: null,
      motherId: null,
      spouseId: null,
      allegianceIds: [],
      bookIds: [],
      povBookIds: [],
      tvSeries: [],
      playedBy: [],
    }

    const result = getCharacterMediaFromList(mockThronesCharacters, tyrionCharacter)

    expect(result).toBeUndefined()
    expect(normalizeThronesCharacter).not.toHaveBeenCalled()
  })

  test('returns CharacterMedia when mapping exists and ThronesAPI record found', () => {
    // Use Jon Snow (providerId 2) which is in our mock list
    const result = getCharacterMediaFromList(mockThronesCharacters, mockCanonicalCharacter)

    expect(normalizeThronesCharacter).toHaveBeenCalledWith(
      mockThronesCharacters[0], // the Jon Snow dto
      mockCanonicalCharacter
    )
    expect(result).toEqual(
      normalizeThronesCharacter(mockThronesCharacters[0], mockCanonicalCharacter)
    )
  })

  test('returns undefined when normalization fails', () => {
    // Make normalizeThronesCharacter throw
    vi.mocked(normalizeThronesCharacter).mockImplementationOnce(() => {
      throw new Error('Invalid imageUrl')
    })

    const result = getCharacterMediaFromList(mockThronesCharacters, mockCanonicalCharacter)

    expect(result).toBeUndefined()
    expect(normalizeThronesCharacter).toHaveBeenCalledWith(
      mockThronesCharacters[0],
      mockCanonicalCharacter
    )
  })

  test('does not map the second Daenerys (book) to the ThronesAPI Daenerys', () => {
    // Historical Daenerys from the books (sourceId: 271)
    const secondDaenerysCharacter: CanonicalCharacter = {
      id: 'ice-and-fire:character:271' as const,
      source: {
        source: 'ice-and-fire',
        resource: 'character',
        externalId: '271',
        url: 'https://anapioficeandfire.com/api/characters/271',
      },
      editorial: null, // assume no editorial metadata for this one
      name: 'Daenerys Targaryen',
      gender: 'Female',
      culture: null,
      born: null,
      died: null,
      titles: [],
      aliases: [],
fatherId: null,
    motherId: null,
    spouseId: null,
    allegianceIds: [],
    bookIds: [],
    povBookIds: [],
    tvSeries: [],
    playedBy: [],
    }

    const result = getCharacterMediaFromList(mockThronesCharacters, secondDaenerysCharacter)

    // Since there's no mapping for ice-and-fire:character:271, it should return undefined
    expect(result).toBeUndefined()
    expect(normalizeThronesCharacter).not.toHaveBeenCalled()
  })
})