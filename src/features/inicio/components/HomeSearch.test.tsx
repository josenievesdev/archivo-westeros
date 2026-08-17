import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { PropsWithChildren } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import { resolveCharacterSearchTerm } from '../config/home-content'
import { HomeSearch } from './HomeSearch'

const jonSnowResponse = {
  url: 'https://anapioficeandfire.com/api/characters/583',
  name: 'Jon Snow',
  gender: 'Male',
  culture: 'Northmen',
  born: 'In 283 AC',
  died: '',
  titles: ["Lord Commander of the Night's Watch"],
  aliases: ['Lord Snow'],
  father: '',
  mother: '',
  spouse: '',
  allegiances: ['https://anapioficeandfire.com/api/houses/362'],
  books: [],
  povBooks: [],
  tvSeries: ['Season 1'],
  playedBy: ['Kit Harington'],
}

function apiResponse(payload: unknown) {
  return {
    json: async () => payload,
    ok: true,
    status: 200,
  } as Response
}

function SearchProviders({ children }: PropsWithChildren) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 0 } },
  })

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
    return apiResponse(isJonSearch ? [jonSnowResponse] : [])
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
  expect(resolveCharacterSearchTerm("Lord Commander of the Night's Watch")).toBe('Jon Snow')
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
