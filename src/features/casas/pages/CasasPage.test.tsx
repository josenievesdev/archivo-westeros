import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import {
  ALGOOD_HOUSE_FIXTURE,
  AMBER_HOUSE_FIXTURE,
  STARK_HOUSE_FIXTURE,
  VERIFIED_MAJOR_HOUSE_FIXTURES,
  createHouseResponse,
} from '../../../test/fixtures/ice_and_fire_houses'
import type { IceAndFireHouseResponse } from '../../../lib/api/ice-and-fire/api_types'
import { houseDetailQueryKey } from '../../../lib/query/ice_and_fire_query_keys'
import { CasasPage } from './CasasPage'

const ALLYRION_HOUSE_FIXTURE = createHouseResponse({
  url: 'https://anapioficeandfire.com/api/houses/2',
  name: 'House Allyrion of Godsgrace',
  region: 'Dorne',
  seats: ['Godsgrace'],
})

const archivePages = new Map<number, IceAndFireHouseResponse[]>([
  [1, [ALGOOD_HOUSE_FIXTURE, AMBER_HOUSE_FIXTURE, STARK_HOUSE_FIXTURE]],
  [2, [ALLYRION_HOUSE_FIXTURE]],
])

function apiResponse(payload: unknown, status = 200, link?: string) {
  return {
    headers: new Headers(link ? { Link: link } : undefined),
    json: async () => payload,
    ok: status >= 200 && status < 300,
    status,
  } as Response
}

function archiveLinkHeader(page: number) {
  const first =
    '<https://anapioficeandfire.com/api/houses?page=1&pageSize=12>; rel="first"'
  const last =
    '<https://anapioficeandfire.com/api/houses?page=2&pageSize=12>; rel="last"'

  return page === 1
    ? `<https://anapioficeandfire.com/api/houses?page=2&pageSize=12>; rel="next", ${first}, ${last}`
    : `<https://anapioficeandfire.com/api/houses?page=1&pageSize=12>; rel="prev", ${first}, ${last}`
}

interface FetchOptions {
  archiveError?: number
  failedMajorId?: string
}

function createFetchMock(options: FetchOptions = {}) {
  const majorHouses = new Map(
    VERIFIED_MAJOR_HOUSE_FIXTURES.map((fixture) => [
      new URL(fixture.url).pathname.split('/').at(-1),
      fixture,
    ]),
  )

  return vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input))
    const detailId = url.pathname.match(/\/houses\/(\d+)$/)?.[1]

    if (detailId) {
      if (detailId === options.failedMajorId) {
        return apiResponse({}, 503)
      }

      const fixture = majorHouses.get(detailId)
      return fixture ? apiResponse(fixture) : apiResponse({}, 404)
    }

    if (url.pathname.endsWith('/houses')) {
      if (options.archiveError) {
        return apiResponse({}, options.archiveError)
      }

      const page = Number(url.searchParams.get('page') ?? '1')
      return apiResponse(
        archivePages.get(page) ?? [],
        200,
        archiveLinkHeader(page),
      )
    }

    return apiResponse({}, 404)
  })
}

function renderPage(fetchMock = createFetchMock()) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Number.POSITIVE_INFINITY },
    },
  })
  vi.stubGlobal('fetch', fetchMock)

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/casas']}>
        <CasasPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )

  return { fetchMock, queryClient }
}

async function getLoadedSections() {
  const majorSection = screen.getByRole('region', { name: 'Las grandes casas' })
  const archiveSection = screen.getByRole('region', { name: 'Archivo de casas' })

  await waitFor(() => {
    expect(within(majorSection).getAllByRole('link')).toHaveLength(7)
  })
  await within(archiveSection).findByRole('heading', { name: 'House Algood' })

  return { archiveSection, majorSection }
}

describe('CasasPage', () => {
  test('separa las siete grandes casas del archivo y respeta su orden editorial', async () => {
    const { fetchMock, queryClient } = renderPage()
    const { archiveSection, majorSection } = await getLoadedSections()
    const majorLinks = within(majorSection).getAllByRole('link')

    expect(
      within(majorSection)
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual([
      'Stark',
      'Lannister',
      'Targaryen',
      'Baratheon',
      'Greyjoy',
      'Tyrell',
      'Martell',
    ])
    expect(majorLinks.map((link) => link.getAttribute('href'))).toEqual([
      '/casas/362',
      '/casas/229',
      '/casas/378',
      '/casas/17',
      '/casas/169',
      '/casas/398',
      '/casas/285',
    ])
    expect(within(majorSection).queryByText('House Algood')).not.toBeInTheDocument()
    expect(within(archiveSection).getByText('House Algood')).toBeInTheDocument()
    expect(within(archiveSection).getByText('House Amber')).toBeInTheDocument()

    const listRequests = fetchMock.mock.calls
      .map(([request]) => new URL(String(request)))
      .filter((url) => url.pathname.endsWith('/houses'))
    expect(listRequests).toHaveLength(1)
    expect(listRequests[0].searchParams.get('page')).toBe('1')
    expect(listRequests[0].searchParams.get('pageSize')).toBe('12')
    expect(queryClient.getQueryData(houseDetailQueryKey('1'))).toMatchObject({
      id: 'ice-and-fire:house:1',
    })

    const detailRequestIds = fetchMock.mock.calls
      .map(([request]) => new URL(String(request)).pathname.match(/\/houses\/(\d+)$/)?.[1])
      .filter((sourceId): sourceId is string => Boolean(sourceId))
      .sort((left, right) => Number(left) - Number(right))
    expect(detailRequestIds).toEqual(['17', '169', '229', '285', '362', '378', '398'])
  })

  test('busca por nombre solo dentro de la página cargada', async () => {
    const user = userEvent.setup()
    renderPage()
    const { archiveSection } = await getLoadedSections()
    const search = within(archiveSection).getByRole('searchbox', {
      name: 'Buscar en la página cargada del archivo de casas',
    })

    await user.type(search, 'Algood')

    expect(within(archiveSection).getByText('House Algood')).toBeInTheDocument()
    expect(within(archiveSection).queryByText('House Amber')).not.toBeInTheDocument()
    expect(within(archiveSection).getByText(/no en todo el archivo remoto/i)).toBeInTheDocument()
  })

  test('busca por shortName editorial sin duplicar metadata en la entidad', async () => {
    const user = userEvent.setup()
    renderPage()
    const { archiveSection } = await getLoadedSections()

    await user.type(
      within(archiveSection).getByRole('searchbox', {
        name: 'Buscar en la página cargada del archivo de casas',
      }),
      'Stark',
    )

    expect(
      within(archiveSection).getByRole('heading', {
        level: 3,
        name: 'House Stark of Winterfell',
      }),
    ).toBeInTheDocument()
    expect(within(archiveSection).queryByText('House Algood')).not.toBeInTheDocument()
  })

  test('deriva el filtro de región de la página cargada', async () => {
    const user = userEvent.setup()
    renderPage()
    const { archiveSection } = await getLoadedSections()
    const regionFilter = within(archiveSection).getByRole('combobox', {
      name: 'Región en esta página',
    })

    expect(within(regionFilter).getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Todas',
      'The North',
      'The Westerlands',
    ])
    await user.selectOptions(regionFilter, 'The North')

    expect(within(archiveSection).getByText('House Amber')).toBeInTheDocument()
    expect(within(archiveSection).getByText('House Stark of Winterfell')).toBeInTheDocument()
    expect(within(archiveSection).queryByText('House Algood')).not.toBeInTheDocument()
  })

  test('distingue una búsqueda sin resultados de un archivo vacío', async () => {
    const user = userEvent.setup()
    renderPage()
    const { archiveSection } = await getLoadedSections()

    await user.type(
      within(archiveSection).getByRole('searchbox', {
        name: 'Buscar en la página cargada del archivo de casas',
      }),
      'Casa que no existe',
    )

    expect(
      within(archiveSection).getByRole('heading', {
        name: 'Sin resultados en esta página',
      }),
    ).toBeInTheDocument()
  })

  test('conserva seis majors y el archivo cuando falla una entidad prioritaria', async () => {
    renderPage(createFetchMock({ failedMajorId: '378' }))
    const majorSection = screen.getByRole('region', { name: 'Las grandes casas' })
    const archiveSection = screen.getByRole('region', { name: 'Archivo de casas' })

    await waitFor(() => {
      expect(within(majorSection).getAllByRole('link')).toHaveLength(6)
    })
    expect(
      within(majorSection).getByText(
        'Una gran casa no pudo cargarse; se muestran las seis disponibles.',
      ),
    ).toBeInTheDocument()
    expect(within(majorSection).queryByText('Targaryen')).not.toBeInTheDocument()
    expect(await within(archiveSection).findByText('House Algood')).toBeInTheDocument()
  })

  test('mantiene la paginación remota sin descargar páginas automáticamente', async () => {
    const user = userEvent.setup()
    const { fetchMock } = renderPage()
    const { archiveSection } = await getLoadedSections()

    expect(within(archiveSection).getByText('Página 1 de 2')).toBeInTheDocument()
    await user.click(within(archiveSection).getByRole('button', { name: 'Siguiente' }))

    expect(
      await within(archiveSection).findByRole('heading', {
        level: 3,
        name: 'House Allyrion of Godsgrace',
      }),
    ).toBeInTheDocument()
    expect(within(archiveSection).getByText('Página 2 de 2')).toBeInTheDocument()
    expect(within(archiveSection).getByRole('button', { name: 'Anterior' })).toBeEnabled()

    const requestedPages = fetchMock.mock.calls
      .map(([request]) => new URL(String(request)))
      .filter((url) => url.pathname.endsWith('/houses'))
      .map((url) => url.searchParams.get('page'))
    expect(requestedPages).toEqual(['1', '2'])
  })

  test('un error del archivo no elimina las grandes casas', async () => {
    renderPage(createFetchMock({ archiveError: 503 }))
    const majorSection = screen.getByRole('region', { name: 'Las grandes casas' })

    expect(
      await screen.findByRole('heading', { name: 'No fue posible obtener el archivo' }),
    ).toBeInTheDocument()
    await waitFor(() => {
      expect(within(majorSection).getAllByRole('link')).toHaveLength(7)
    })
  })
})
