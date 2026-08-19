import { describe, expect, test } from 'vitest'
import { CHARACTER_MEDIA_MAPPING } from './character_media_mapping'
import type { CanonicalCharacterId } from '../lib/domain/canonical_entities'

describe('CHARACTER_MEDIA_MAPPING', () => {
  test('maps Jon Snow to providerId 2', () => {
    const id: CanonicalCharacterId = 'ice-and-fire:character:583'
    expect(CHARACTER_MEDIA_MAPPING[id]).toEqual({ providerId: 2 })
  })

  test('maps Daenerys Targaryen (TV) to providerId 0', () => {
    const id: CanonicalCharacterId = 'ice-and-fire:character:1303'
    expect(CHARACTER_MEDIA_MAPPING[id]).toEqual({ providerId: 0 })
  })

  test('maps Tyrion Lannister to providerId 14', () => {
    const id: CanonicalCharacterId = 'ice-and-fire:character:1052'
    expect(CHARACTER_MEDIA_MAPPING[id]).toEqual({ providerId: 14 })
  })

  test('maps Arya Stark to providerId 3', () => {
    const id: CanonicalCharacterId = 'ice-and-fire:character:148'
    expect(CHARACTER_MEDIA_MAPPING[id]).toEqual({ providerId: 3 })
  })

  test('maps Cersei Lannister to providerId 9', () => {
    const id: CanonicalCharacterId = 'ice-and-fire:character:238'
    expect(CHARACTER_MEDIA_MAPPING[id]).toEqual({ providerId: 9 })
  })

  test('returns undefined for unmapped characters', () => {
    const id: CanonicalCharacterId = 'ice-and-fire:character:999' // arbitrary unmapped id
    expect(CHARACTER_MEDIA_MAPPING[id]).toBeUndefined()
  })
})