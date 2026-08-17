export function emptyToNull(value: string): string | null {
  const normalized = value.trim()
  return normalized === '' ? null : normalized
}

export function compactStrings(values: string[]): string[] {
  return values.map((value) => value.trim()).filter(Boolean)
}

export function extractResourceId(resourceUrl: string): string | null {
  const normalized = resourceUrl.replace(/\/$/, '')
  if (normalized === '') {
    return null
  }

  return normalized.split('/').at(-1) || null
}

export function extractResourceIds(resourceUrls: string[]): string[] {
  return resourceUrls
    .map(extractResourceId)
    .filter((id): id is string => id !== null)
}
