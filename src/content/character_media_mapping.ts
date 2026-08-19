import type { CanonicalCharacterId } from '../lib/domain/canonical_entities'

// Mapping from canonicalCharacterId to ThronesAPI providerId.
// Only include characters we are confident about.
// Source: ThronesAPI /Characters endpoint (as of the time of writing).
export const CHARACTER_MEDIA_MAPPING: Record<CanonicalCharacterId, { providerId: number }> = {
  // Jon Snow
  'ice-and-fire:character:583': { providerId: 2 },
  // Daenerys Targaryen (TV series)
  'ice-and-fire:character:1303': { providerId: 0 },
  // Tyrion Lannister
  'ice-and-fire:character:1052': { providerId: 14 },
  // Arya Stark
  'ice-and-fire:character:148': { providerId: 3 },
  // Cersei Lannister
  'ice-and-fire:character:238': { providerId: 9 },
}