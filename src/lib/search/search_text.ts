export function normalizeSearchText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function getSearchMatchQuality(
  candidate: string,
  normalizedQuery: string,
) {
  if (normalizedQuery === '') {
    return 0
  }

  const normalizedCandidate = normalizeSearchText(candidate)

  if (normalizedCandidate === normalizedQuery) {
    return 100
  }

  if (normalizedCandidate.startsWith(normalizedQuery)) {
    return 75
  }

  if (normalizedCandidate.includes(normalizedQuery)) {
    return 45
  }

  const queryTokens = normalizedQuery.split(' ').filter(Boolean)
  if (
    queryTokens.length > 1 &&
    queryTokens.every((token) => normalizedCandidate.includes(token))
  ) {
    return 35
  }

  return 0
}
