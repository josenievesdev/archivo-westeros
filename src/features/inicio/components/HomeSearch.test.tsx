import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { PropsWithChildren } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import {
  createCharacterResponse,
  DAENERYS_HISTORICAL_RESPONSE,
  DAENERYS_MAIN_RESPONSE,
  JON_SNOW_RESPONSE,
} from '../../../test/fixtures/ice_and_fire_characters'
import { createCharacterSearchPlan } from '../../../services/character_search'
import { HomeSearch } from './HomeSearch'

function apiResponse(payload: unknown) {
  return {
    json: async () => payload,
    ok: true,
    status: 200,
  } as Response
}

function createSearchQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 0 } },
  })
}

function SearchProviders({ children }: PropsWithChildren) {
  const queryClient = createSearchQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

test('resuelve un alias, muestra el personaje y permite limpiar', async () => {
  const user = userEvent.setup()
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input))
    const isJonSearch =
      url.pathname.endsWith('/characters') && url.searchParams.get('name') === 'Jon Snow'
    return apiResponse(isJonSearch ? [JON_SNOW_RESPONSE] : [])
  })
  vi.stubGlobal('fetch', fetchMock)
  render(<HomeSearch />, { wrapper: SearchProviders })

  const input = screen.getByRole('searchbox', { name: 'Buscar personajes y casas' })
  await user.type(input, 'Lord Snow{Enter}')

  const results = await screen.findByRole('region', { name: 'Resultados para Lord Snow' })
  expect(await within(results).findByText('Jon Snow')).toBeInTheDocument()
  expect(within(results).getByText('Lord Snow')).toBeInTheDocument()
  expect(
    fetchMock.mock.calls.some(([request]) =>
      new URL(String(request)).searchParams.get('name') === 'Jon Snow',
    ),
  ).toBe(true)

  await user.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }))
  expect(input).toHaveValue('')
  expect(input).toHaveFocus()
  expect(screen.queryByRole('region', { name: 'Resultados para Lord Snow' })).not.toBeInTheDocument()
})

test('resuelve los títulos editoriales a nombres consultables', () => {
  expect(
    createCharacterSearchPlan("Lord Commander of the Night's Watch").requestNames,
  ).toEqual(['Jon Snow'])
})

test('el acceso rápido de Daenerys conserva ambos homónimos y prioriza 1303', async () => {
  const user = userEvent.setup()
  const queryClient = createSearchQueryClient()
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input))
    const isDaenerysSearch =
      url.pathname.endsWith('/characters') &&
      url.searchParams.get('name') === 'Daenerys Targaryen'

    return apiResponse(
      isDaenerysSearch
        ? [DAENERYS_HISTORICAL_RESPONSE, DAENERYS_MAIN_RESPONSE]
        : [],
    )
  })
  vi.stubGlobal('fetch', fetchMock)
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <HomeSearch />
      </MemoryRouter>
    </QueryClientProvider>,
  )

  await user.click(screen.getByRole('button', { name: 'Daenerys Targaryen' }))

  const results = await screen.findByRole('region', {
    name: 'Resultados para Daenerys Targaryen',
  })
  const links = within(results).getAllByRole('link', {
    name: /Daenerys Targaryen/,
  })
  expect(links).toHaveLength(2)
  expect(links[0]).toHaveAttribute('href', '/personajes/1303')
  expect(links[1]).toHaveAttribute('href', '/personajes/271')
  expect(within(links[0]).getByText('Emilia Clarke · En 284 d. C., en Dragonstone')).toBeInTheDocument()
  expect(within(links[1]).getByText('En 172 d. C. · Princesa')).toBeInTheDocument()

  const characterRequests = fetchMock.mock.calls.filter(([request]) =>
    new URL(String(request)).pathname.endsWith('/characters'),
  )
  expect(characterRequests).toHaveLength(1)
  expect(
    queryClient.getQueryData([
      'characters',
      'detail',
      'ice-and-fire:character:271',
    ]),
  ).toMatchObject({
    id: 'ice-and-fire:character:271',
    source: { externalId: '271' },
  })
})

test('conserva resultados parciales cuando falla uno de varios nombres candidatos', async () => {
  const user = userEvent.setup()
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input))

    if (
      url.pathname.endsWith('/characters') &&
      url.searchParams.get('name') === 'Cersei Lannister'
    ) {
      return {
        json: async () => ({}),
        ok: false,
        status: 503,
      } as Response
    }

    const isDaenerysSearch =
      url.pathname.endsWith('/characters') &&
      url.searchParams.get('name') === 'Daenerys Targaryen'

    return apiResponse(isDaenerysSearch ? [DAENERYS_MAIN_RESPONSE] : [])
  })
  vi.stubGlobal('fetch', fetchMock)
  render(<HomeSearch />, { wrapper: SearchProviders })

  await user.type(
    screen.getByRole('searchbox', { name: 'Buscar personajes y casas' }),
    'queen{Enter}',
  )

  const results = await screen.findByRole('region', { name: 'Resultados para queen' })
  expect(await within(results).findByText('Daenerys Targaryen')).toBeInTheDocument()
  expect(within(results).queryByRole('alert')).not.toBeInTheDocument()

  const characterRequests = fetchMock.mock.calls.filter(([request]) =>
    new URL(String(request)).pathname.endsWith('/characters'),
  )
  expect(characterRequests).toHaveLength(3)
  expect(
    characterRequests.filter(
      ([request]) =>
        new URL(String(request)).searchParams.get('name') === 'Cersei Lannister',
    ),
  ).toHaveLength(2)
  expect(
    characterRequests.filter(
      ([request]) =>
        new URL(String(request)).searchParams.get('name') === 'Daenerys Targaryen',
    ),
  ).toHaveLength(1)
})

test('normaliza el nombre no catalogado antes de consultar la API', async () => {
  const user = userEvent.setup()
  const aegonResponse = createCharacterResponse({
    url: 'https://anapioficeandfire.com/api/characters/12',
    name: 'Aegon Targaryen',
    born: 'In 135 AC',
    titles: ['King'],
  })
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = new URL(String(input))
    const isAegonSearch =
      url.pathname.endsWith('/characters') &&
      url.searchParams.get('name') === 'Aegon Targaryen'

    return apiResponse(isAegonSearch ? [aegonResponse] : [])
  })
  vi.stubGlobal('fetch', fetchMock)
  render(<HomeSearch />, { wrapper: SearchProviders })

  await user.type(
    screen.getByRole('searchbox', { name: 'Buscar personajes y casas' }),
    'AEGÓN TARGARYEN{Enter}',
  )

  const results = await screen.findByRole('region', {
    name: 'Resultados para AEGÓN TARGARYEN',
  })
  expect(await within(results).findByText('Aegon Targaryen')).toBeInTheDocument()
  expect(
    fetchMock.mock.calls.some(
      ([request]) =>
        new URL(String(request)).searchParams.get('name') === 'Aegon Targaryen',
    ),
  ).toBe(true)
})

test('comunica loading y estado sin resultados', async () => {
  const user = userEvent.setup()
  let resolveCharacters: ((response: Response) => void) | undefined
  const fetchMock = vi.fn((input: RequestInfo | URL) => {
    const url = new URL(String(input))
    if (url.pathname.endsWith('/characters')) {
      return new Promise<Response>((resolve) => {
        resolveCharacters = resolve
      })
    }
    return Promise.resolve(apiResponse([]))
  })
  vi.stubGlobal('fetch', fetchMock)
  render(<HomeSearch />, { wrapper: SearchProviders })

  await user.type(
    screen.getByRole('searchbox', { name: 'Buscar personajes y casas' }),
    'Nombre desconocido{Enter}',
  )

  await waitFor(() => expect(resolveCharacters).toBeTypeOf('function'))
  expect(screen.getByRole('status', { name: 'Buscando' })).toBeInTheDocument()

  await act(async () => resolveCharacters?.(apiResponse([])))
  expect(await screen.findByText('Sin resultados')).toBeInTheDocument()
})
