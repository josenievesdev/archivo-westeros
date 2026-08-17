import type { ResourcePagination } from './internal_types'

const EMPTY_PAGINATION: ResourcePagination = {
  firstPage: null,
  previousPage: null,
  nextPage: null,
  lastPage: null,
}

function getPageNumber(url: string) {
  try {
    const page = Number(new URL(url).searchParams.get('page'))
    return Number.isInteger(page) && page > 0 ? page : null
  } catch {
    return null
  }
}

export function parsePaginationLinkHeader(
  header: string | null,
): ResourcePagination {
  if (!header) {
    return { ...EMPTY_PAGINATION }
  }

  const pagination = { ...EMPTY_PAGINATION }

  header.split(/,\s*(?=<)/).forEach((segment) => {
    const match = segment.match(/^<([^>]+)>\s*;\s*rel="?([^";]+)"?$/i)
    if (!match) {
      return
    }

    const page = getPageNumber(match[1])
    if (page === null) {
      return
    }

    match[2].split(/\s+/).forEach((relation) => {
      if (relation === 'first') pagination.firstPage = page
      if (relation === 'prev') pagination.previousPage = page
      if (relation === 'next') pagination.nextPage = page
      if (relation === 'last') pagination.lastPage = page
    })
  })

  return pagination
}
