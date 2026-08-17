import { createCanonicalId } from '../domain/canonical_entities'
import type { ResourceListParams } from '../api/ice-and-fire/internal_types'

export function characterDetailQueryKey(sourceId: string) {
  return ['characters', 'detail', createCanonicalId('character', sourceId)] as const
}

export function houseDetailQueryKey(sourceId: string) {
  return ['houses', 'detail', createCanonicalId('house', sourceId)] as const
}

export function houseBundleQueryKey(
  sourceId: string,
  swornMemberLimit: number,
) {
  return [
    'houses',
    'bundle',
    createCanonicalId('house', sourceId),
    { swornMemberLimit },
  ] as const
}

export function houseListQueryKey(params: ResourceListParams) {
  return ['houses', 'list', params] as const
}

export function houseArchivePageQueryKey(params: ResourceListParams) {
  return ['houses', 'archive', 'page', params] as const
}

export function majorHousesQueryKey() {
  return ['houses', 'major'] as const
}
