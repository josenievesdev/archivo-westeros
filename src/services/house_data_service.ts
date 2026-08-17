import {
  MAJOR_HOUSE_METADATA,
  getMajorHouseMetadata,
} from '../content/house_editorial_metadata'
import {
  createCanonicalId,
  normalizeIceAndFireExternalId,
  type CanonicalCharacterId,
  type CanonicalHouse,
  type CanonicalHouseId,
} from '../lib/domain/canonical_entities'
import type {
  HouseDataBundle,
  HouseRelationFailure,
  HouseRelationName,
} from '../lib/domain/house_types'
import type { CanonicalEntityReader } from './canonical_entity_reader'
import {
  resolveCharacterReferences,
  resolveHouseReferences,
  type ReferenceFailure,
} from './reference_resolution'

export const DEFAULT_SWORN_MEMBER_LIMIT = 6
export const DEFAULT_CADET_BRANCH_LIMIT = 12
export const MAX_EAGER_RELATION_LIMIT = 25

export interface HouseDataBundleOptions {
  swornMemberLimit?: number
  cadetBranchLimit?: number
  referenceConcurrency?: number
  signal?: AbortSignal
}

export interface MajorHouseCollection {
  houses: CanonicalHouse[]
  failures: ReferenceFailure<CanonicalHouseId>[]
}

function normalizeEagerLimit(
  value: number | undefined,
  fallback: number,
  label: string,
) {
  const limit = value ?? fallback

  if (
    !Number.isInteger(limit) ||
    limit < 0 ||
    limit > MAX_EAGER_RELATION_LIMIT
  ) {
    throw new RangeError(
      `${label} debe ser un entero entre 0 y ${MAX_EAGER_RELATION_LIMIT}.`,
    )
  }

  return limit
}

function resolvedInOrder<Id extends string, Value>(
  ids: readonly Id[],
  byId: ReadonlyMap<Id, Value>,
) {
  return ids.flatMap((id) => {
    const value = byId.get(id)
    return value ? [value] : []
  })
}

function appendFailure<Id extends string>(
  failures: HouseRelationFailure[],
  relation: HouseRelationName,
  canonicalId: Id | null,
  failureById: ReadonlyMap<Id, unknown>,
) {
  if (!canonicalId || !failureById.has(canonicalId)) {
    return
  }

  failures.push({
    relation,
    canonicalId,
    reason: failureById.get(canonicalId),
  })
}

export async function buildHouseDataBundle(
  house: CanonicalHouse,
  reader: CanonicalEntityReader,
  options: HouseDataBundleOptions = {},
): Promise<HouseDataBundle> {
  const swornMemberLimit = normalizeEagerLimit(
    options.swornMemberLimit,
    DEFAULT_SWORN_MEMBER_LIMIT,
    'swornMemberLimit',
  )
  const cadetBranchLimit = normalizeEagerLimit(
    options.cadetBranchLimit,
    DEFAULT_CADET_BRANCH_LIMIT,
    'cadetBranchLimit',
  )
  const selectedSwornMemberIds = house.swornMemberIds.slice(0, swornMemberLimit)
  const selectedCadetBranchIds = house.cadetBranchIds.slice(0, cadetBranchLimit)
  const characterIds = [
    house.currentLordId,
    house.heirId,
    house.founderId,
    ...selectedSwornMemberIds,
  ].filter((id): id is CanonicalCharacterId => id !== null)
  const houseIds = [
    house.overlordId,
    ...selectedCadetBranchIds,
  ].filter((id): id is CanonicalHouseId => id !== null)
  const [characters, houses] = await Promise.all([
    resolveCharacterReferences(characterIds, reader, {
      limit: characterIds.length,
      concurrency: options.referenceConcurrency,
      signal: options.signal,
    }),
    resolveHouseReferences(houseIds, reader, {
      limit: houseIds.length,
      concurrency: options.referenceConcurrency,
      signal: options.signal,
    }),
  ])
  const characterFailureById = new Map(
    characters.failures.map((failure) => [failure.canonicalId, failure.reason]),
  )
  const houseFailureById = new Map(
    houses.failures.map((failure) => [failure.canonicalId, failure.reason]),
  )
  const relationFailures: HouseRelationFailure[] = []

  appendFailure(
    relationFailures,
    'currentLord',
    house.currentLordId,
    characterFailureById,
  )
  appendFailure(
    relationFailures,
    'heir',
    house.heirId,
    characterFailureById,
  )
  appendFailure(
    relationFailures,
    'founder',
    house.founderId,
    characterFailureById,
  )
  appendFailure(
    relationFailures,
    'overlord',
    house.overlordId,
    houseFailureById,
  )
  selectedCadetBranchIds.forEach((id) =>
    appendFailure(
      relationFailures,
      'cadetBranches',
      id,
      houseFailureById,
    ),
  )
  selectedSwornMemberIds.forEach((id) =>
    appendFailure(
      relationFailures,
      'swornMembers',
      id,
      characterFailureById,
    ),
  )

  const cadetBranches = resolvedInOrder(
    selectedCadetBranchIds,
    houses.byId,
  )
  const swornMembers = resolvedInOrder(
    selectedSwornMemberIds,
    characters.byId,
  )

  return {
    house,
    metadata: getMajorHouseMetadata(house),
    currentLord: house.currentLordId
      ? characters.byId.get(house.currentLordId) ?? null
      : null,
    heir: house.heirId ? characters.byId.get(house.heirId) ?? null : null,
    founder: house.founderId
      ? characters.byId.get(house.founderId) ?? null
      : null,
    overlord: house.overlordId
      ? houses.byId.get(house.overlordId) ?? null
      : null,
    cadetBranches,
    swornMembers,
    counts: {
      cadetBranchesTotal: house.cadetBranchIds.length,
      cadetBranchesResolved: cadetBranches.length,
      cadetBranchesOmitted:
        house.cadetBranchIds.length - selectedCadetBranchIds.length,
      swornMembersTotal: house.swornMemberIds.length,
      swornMembersRequested: selectedSwornMemberIds.length,
      swornMembersResolved: swornMembers.length,
      swornMembersOmitted:
        house.swornMemberIds.length - selectedSwornMemberIds.length,
    },
    relationFailures,
  }
}

export async function getHouseDataBundle(
  sourceId: string,
  reader: CanonicalEntityReader,
  options: HouseDataBundleOptions = {},
) {
  const normalizedSourceId = normalizeIceAndFireExternalId(sourceId)
  if (!normalizedSourceId) {
    throw new TypeError(`El ID externo de casa no es válido: ${sourceId}`)
  }

  const canonicalId = createCanonicalId('house', normalizedSourceId)
  const house = await reader.getHouse(canonicalId, options.signal)
  if (house.id !== canonicalId) {
    throw new TypeError(`Se resolvió ${house.id} para la casa ${canonicalId}.`)
  }

  return buildHouseDataBundle(house, reader, options)
}

export async function loadMajorHouses(
  reader: CanonicalEntityReader,
  options: Pick<HouseDataBundleOptions, 'referenceConcurrency' | 'signal'> = {},
): Promise<MajorHouseCollection> {
  const resolution = await resolveHouseReferences(
    MAJOR_HOUSE_METADATA.map((metadata) => metadata.canonicalId),
    reader,
    {
      limit: MAJOR_HOUSE_METADATA.length,
      concurrency: options.referenceConcurrency,
      signal: options.signal,
    },
  )

  return {
    houses: resolution.values,
    failures: resolution.failures,
  }
}
