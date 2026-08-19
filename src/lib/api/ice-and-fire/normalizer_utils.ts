import {
  createCanonicalId,
  ICE_AND_FIRE_SOURCE,
  normalizeIceAndFireExternalId,
  type CanonicalId,
  type CanonicalResource,
  type SourceRef,
} from '../../domain/canonical_entities'
import { iceAndFireApiUrl } from '../../../config/environment'

export function emptyToNull(value: string): string | null {
  const normalized = value.trim()
  return normalized === '' ? null : normalized
}

export function compactStrings(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean)
}

const RESOURCE_PATHS: Record<CanonicalResource, string> = {
  book: 'books',
  character: 'characters',
  house: 'houses',
}

const SOURCE_BASE_URLS = [
  'https://anapioficeandfire.com/api',
  'https://www.anapioficeandfire.com/api',
  iceAndFireApiUrl,
].map((value) => new URL(value))

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, '')
}

export function extractResourceId(
  resourceUrl: string,
  resource?: CanonicalResource,
): string | null {
  const normalized = resourceUrl.trim()
  if (normalized === '') {
    return null
  }

  try {
    const url = new URL(normalized)
    const pathname = trimTrailingSlash(url.pathname)
    const segments = pathname.split('/').filter(Boolean)
    const encodedId = segments.at(-1)
    const collection = segments.at(-2)
    const expectedCollection = resource ? RESOURCE_PATHS[resource] : collection
    const hasKnownCollection = Object.values(RESOURCE_PATHS).includes(
      collection ?? '',
    )
    const hasKnownBase = SOURCE_BASE_URLS.some((baseUrl) => {
      const basePath = trimTrailingSlash(baseUrl.pathname)
      return (
        url.origin === baseUrl.origin &&
        pathname.startsWith(`${basePath}/${expectedCollection}/`) &&
        pathname.split('/').filter(Boolean).length ===
          basePath.split('/').filter(Boolean).length + 2
      )
    })

    if (
      !encodedId ||
      !expectedCollection ||
      !hasKnownCollection ||
      !hasKnownBase ||
      (resource && collection !== expectedCollection) ||
      url.search !== '' ||
      url.hash !== ''
    ) {
      return null
    }

    return normalizeIceAndFireExternalId(decodeURIComponent(encodedId))
  } catch {
    return null
  }
}

export function extractSourceRef<Resource extends CanonicalResource>(
  resourceUrl: string,
  resource: Resource,
): SourceRef<Resource> | null {
  const externalId = extractResourceId(resourceUrl, resource)

  if (!externalId) {
    return null
  }

  return {
    source: ICE_AND_FIRE_SOURCE,
    resource,
    externalId,
    url: resourceUrl.trim(),
  }
}

export function extractCanonicalResourceId<Resource extends CanonicalResource>(
  resourceUrl: string,
  resource: Resource,
): CanonicalId<Resource> | null {
  const externalId = extractResourceId(resourceUrl, resource)
  return externalId ? createCanonicalId(resource, externalId) : null
}

export function extractCanonicalResourceIds<Resource extends CanonicalResource>(
  resourceUrls: string[],
  resource: Resource,
): CanonicalId<Resource>[] {
  return resourceUrls
    .map((resourceUrl) => extractCanonicalResourceId(resourceUrl, resource))
    .filter((id): id is CanonicalId<Resource> => id !== null)
}
