import { describe, expect, test } from 'vitest'
import { normalizeThronesCharacter } from './character_media'
import type { ThronesCharacterDto } from '../api/thronesapi/api_types'
import type { CanonicalCharacter } from './canonical_entities'

// Mock a minimal CanonicalCharacter for testing
const createMockCanonicalCharacter = (overrides: Partial<CanonicalCharacter> = {}): CanonicalCharacter => ({
  id: 'ice-and-fire:character:1' as const,
  source: {
    source: 'ice-and-fire',
    resource: 'character',
    externalId: '1',
    url: 'https://anapioficeandfire.com/api/characters/1',
  },
  editorial: null,
  name: null,
  gender: null,
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
  ...overrides,
})

describe('normalizeThronesCharacter', () => {
  test('should create CharacterMedia with correct data from DTO and canonical character', () => {
    const dto: ThronesCharacterDto = {
      id: 2,
      firstName: 'Jon',
      lastName: 'Snow',
      fullName: 'Jon Snow',
      title: 'King of the North',
      family: 'House Stark',
      image: 'jon-snow.jpg',
      imageUrl: 'https://thronesapi.com/assets/images/jon-snow.jpg',
    }

    const canonicalCharacter = createMockCanonicalCharacter({
      id: 'ice-and-fire:character:583' as const,
      name: 'Jon Snow',
    })

    const result = normalizeThronesCharacter(dto, canonicalCharacter)

    expect(result).toEqual({
      canonicalCharacterId: 'ice-and-fire:character:583',
      provider: 'thronesapi',
      providerId: 2,
      portraitUrl: 'https://thronesapi.com/assets/images/jon-snow.jpg',
      altText: 'Retrato de Jon Snow',
      source: {
        provider: 'thronesapi',
        remoteUrl: 'https://thronesapi.com/assets/images/jon-snow.jpg',
      },
    })
  })

  test('should use editorial preferredName for altText when available', () => {
    const dto: ThronesCharacterDto = {
      id: 0,
      firstName: 'Daenerys',
      lastName: 'Targaryen',
      fullName: 'Daenerys Targaryen',
      title: 'Mother of Dragons',
      family: 'House Targaryen',
      image: 'daenerys.jpg',
      imageUrl: 'https://thronesapi.com/assets/images/daenerys.jpg',
    }

    const canonicalCharacter = createMockCanonicalCharacter({
      id: 'ice-and-fire:character:1303' as const,
      name: null, // name is null, but we have editorial
      editorial: {
        ref: {
          source: 'realms-got',
          resource: 'character',
          key: 'daenerys-targaryen',
        },
        characterId: 'ice-and-fire:character:1303',
        source: {
          source: 'ice-and-fire',
          resource: 'character',
          externalId: '1303',
        },
        preferredName: 'Daenerys Targaryen',
        featured: null,
        knownActors: ['Emilia Clarke'],
        searchTerms: {
          en: [],
          es: [],
        },
        searchPriority: 100,
      },
    })

    const result = normalizeThronesCharacter(dto, canonicalCharacter)

    expect(result.altText).toBe('Retrato de Daenerys Targaryen')
  })

  test('should fallback to dto.fullName when canonical character has no name and no editorial', () => {
    const dto: ThronesCharacterDto = {
      id: 14,
      firstName: 'Tyrion',
      lastName: 'Lannister',
      fullName: 'Tyrion Lannister',
      title: 'Hand of the Queen',
      family: 'House Lanister', // note: typo in the API
      image: 'tyrion-lannister.jpg',
      imageUrl: 'https://thronesapi.com/assets/images/tyrion-lannister.jpg',
    }

    const canonicalCharacter = createMockCanonicalCharacter({
      id: 'ice-and-fire:character:1052' as const,
      name: null,
      editorial: null,
    })

    const result = normalizeThronesCharacter(dto, canonicalCharacter)

    // Should use dto.fullName as fallback
    expect(result.altText).toBe('Retrato de Tyrion Lannister')
  })

  test('should not include title or family in CharacterMedia', () => {
    const dto: ThronesCharacterDto = {
      id: 9,
      firstName: 'Cersei',
      lastName: 'Lannister',
      fullName: 'Cersei Lannister',
      title: 'Lady of Casterly Rock',
      family: 'House Lannister',
      image: 'cersei.jpg',
      imageUrl: 'https://thronesapi.com/assets/images/cersei.jpg',
    }

    const canonicalCharacter = createMockCanonicalCharacter({
      id: 'ice-and-fire:character:238' as const,
      name: 'Cersei Lannister',
    })

    const result = normalizeThronesCharacter(dto, canonicalCharacter)

    // The result should not have title or family properties
    // @ts-expect-error We expect these properties to not exist
    expect(result.title).toBeUndefined()
    // @ts-expect-error We expect these properties to not exist
    expect(result.family).toBeUndefined()
  })

  test('should throw Error for invalid imageUrl', () => {
    const dto: ThronesCharacterDto = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      fullName: 'Test User',
      title: '',
      family: '',
      image: 'test.jpg',
      imageUrl: 'not-a-valid-url',
    }

    const canonicalCharacter = createMockCanonicalCharacter({
      id: 'ice-and-fire:character:1' as const,
      name: 'Test User',
    })

    expect(() => normalizeThronesCharacter(dto, canonicalCharacter)).toThrow(
      'Invalid imageUrl: not-a-valid-url'
    )
  })
})