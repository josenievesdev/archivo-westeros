import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import { createCharacterResponse } from '../../../test/fixtures/ice_and_fire_characters'
import {
  ALGOOD_HOUSE_FIXTURE,
  BARATHEON_DRAGONSTONE_FIXTURE,
  BARATHEON_HOUSE_FIXTURE,
  BARATHEON_KINGS_LANDING_FIXTURE,
  LANNISTER_HOUSE_FIXTURE,
  MARTELL_HOUSE_FIXTURE,
  STARK_HOUSE_FIXTURE,
  TARGARYEN_HOUSE_FIXTURE,
  TYRELL_HOUSE_FIXTURE,
  GREYJOY_HOUSE_FIXTURE,
} from '../../../test/fixtures/ice_and_fire_houses'
import type {
  IceAndFireCharacterResponse,
  IceAndFireHouseResponse,
} from '../../../lib/api/ice-and-fire/api_types'
import { normalizeHouse } from '../../../lib/api/ice-and-fire/house_normalizer'
import { houseDetailQueryKey } from '../../../lib/query/ice_and_fire_query_keys'
import { CasaDetallePage } from './CasaDetallePage'

function apiResponse(payload: unknown, status = 200) {
  return {
    json: async () => payload,
    ok: status >= 200 && status < 300,
    status,
  } as Response
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Number.POSITIVE_INFINITY },
    },
  })
}

function renderHouseRoute(
  sourceId: string,
  fetchMock: ReturnType<typeof vi.fn>,
  queryClient = createTestQueryClient(),
) {
  vi.stubGlobal('fetch', fetchMock)

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/casas/${sourceId}`]}>
        <Routes>
          <Route path="/casas/:id" element={<CasaDetallePage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )

  return queryClient
}

function withoutRelations(house: IceAndFireHouseResponse): IceAndFireHouseResponse {
  return {
    ...house,
    currentLord: '',
    heir: '',
    founder: '',
    overlord: '',
    cadetBranches: [],
    swornMembers: [],
  }
}

const routeCases: ReadonlyArray<[
  string,
  IceAndFireHouseResponse,
  string,
  string,
]> = [
  ['362', STARK_HOUSE_FIXTURE, 'Stark', 'stark'],
  ['229', LANNISTER_HOUSE_FIXTURE, 'Lannister', 'lannister'],
  ['378', TARGARYEN_HOUSE_FIXTURE, 'Targaryen', 'targaryen'],
  ['17', BARATHEON_HOUSE_FIXTURE, 'Baratheon', 'baratheon'],
  ['169', GREYJOY_HOUSE_FIXTURE, 'Greyjoy', 'greyjoy'],
  ['398', TYRELL_HOUSE_FIXTURE, 'Tyrell', 'tyrell'],
  ['285', MARTELL_HOUSE_FIXTURE, 'Nymeros Martell', 'martell'],
  ['1', ALGOOD_HOUSE_FIXTURE, 'Algood', 'neutral'],
]

describe('CasaDetallePage conectada a HouseDataBundle', () => {
  test.each(routeCases)(
    'resuelve /casas/%s con su entidad y tema',
    async (sourceId, fixture, heading, theme) => {
      const house = withoutRelations(fixture)
      const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
        const url = new URL(String(input))
        return url.pathname.endsWith(`/houses/${sourceId}`)
          ? apiResponse(house)
          : apiResponse({}, 404)
      })

      renderHouseRoute(sourceId, fetchMock)

      expect(
        await screen.findByRole('heading', { level: 1, name: heading }),
      ).toBeInTheDocument()
      expect(document.querySelector('.house-detail')).toHaveAttribute(
        'data-house',
        theme,
      )
      expect(
        fetchMock.mock.calls.filter(([request]) =>
          new URL(String(request)).pathname.endsWith(`/houses/${sourceId}`),
        ),
      ).toHaveLength(1)
    },
  )

  test('mantiene la ficha con relaciones parciales y evita requests duplicados', async () => {
    const characters = new Map<string, IceAndFireCharacterResponse>([
      ['1029', createCharacterResponse({ url: 'https://anapioficeandfire.com/api/characters/1029', name: 'Tommen Baratheon' })],
      ['775', createCharacterResponse({ url: 'https://anapioficeandfire.com/api/characters/775', name: 'Myrcella Baratheon' })],
      ['797', createCharacterResponse({ url: 'https://anapioficeandfire.com/api/characters/797', name: 'Orys Baratheon' })],
      ['110', createCharacterResponse({ url: 'https://anapioficeandfire.com/api/characters/110', name: 'Alyssa Velaryon' })],
      ['216', createCharacterResponse({ url: 'https://anapioficeandfire.com/api/characters/216', name: 'Brienne of Tarth', aliases: ['The Maid of Tarth'] })],
      ['230', createCharacterResponse({ url: 'https://anapioficeandfire.com/api/characters/230', name: 'Cassana Estermont' })],
      ['249', createCharacterResponse({ url: 'https://anapioficeandfire.com/api/characters/249', name: 'Colen of Greenpools' })],
    ])
    const houses = new Map<string, IceAndFireHouseResponse>([
      ['17', BARATHEON_HOUSE_FIXTURE],
      ['16', BARATHEON_KINGS_LANDING_FIXTURE],
      ['15', BARATHEON_DRAGONSTONE_FIXTURE],
    ])
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input))
      const characterId = url.pathname.match(/\/characters\/(\d+)$/)?.[1]
      const houseId = url.pathname.match(/\/houses\/(\d+)$/)?.[1]

      if (characterId === '128') {
        return apiResponse({}, 503)
      }

      if (characterId && characters.has(characterId)) {
        return apiResponse(characters.get(characterId))
      }

      if (houseId && houses.has(houseId)) {
        return apiResponse(houses.get(houseId))
      }

      return apiResponse({}, 404)
    })
    const queryClient = renderHouseRoute('17', fetchMock)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Baratheon' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Tommen Baratheon')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Alyssa Velaryon' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Brienne of Tarth' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cassana Estermont' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Argella Durrandon' })).not.toBeInTheDocument()
    expect(screen.getByText(/No consta quién estuvo al mando/)).toBeInTheDocument()
    expect(screen.getByText(/Ninguna casa consta jurada/)).toBeInTheDocument()

    const requestPaths = fetchMock.mock.calls.map(([request]) =>
      new URL(String(request)).pathname,
    )
    expect(requestPaths.filter((path) => path.endsWith('/houses/17'))).toHaveLength(1)
    expect(requestPaths.filter((path) => path.endsWith('/houses/16'))).toHaveLength(1)
    expect(requestPaths.filter((path) => path.endsWith('/characters/128'))).toHaveLength(1)
    expect(requestPaths.some((path) => path.endsWith('/characters/249'))).toBe(false)
    expect(queryClient.getQueryData(houseDetailQueryKey('17'))).toMatchObject({
      id: 'ice-and-fire:house:17',
    })
  })

  test('reutiliza una casa ya almacenada en la cache de detalle', async () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData(
      houseDetailQueryKey('362'),
      normalizeHouse(withoutRelations(STARK_HOUSE_FIXTURE)),
    )
    const fetchMock = vi.fn(async () => apiResponse({}, 500))

    renderHouseRoute('362', fetchMock, queryClient)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Stark' }),
    ).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test('no usa el fixture visual Targaryen en runtime', async () => {
    const fetchMock = vi.fn(async () =>
      apiResponse(withoutRelations(TARGARYEN_HOUSE_FIXTURE)),
    )
    renderHouseRoute('378', fetchMock)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Targaryen' }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/La última casa dragón de Valyria/)).not.toBeInTheDocument()
  })

  test('conserva los estados de ID inválido y not found', async () => {
    const invalidFetch = vi.fn()
    renderHouseRoute('invalid', invalidFetch)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'El identificador de la casa no es válido',
      }),
    ).toBeInTheDocument()
    expect(invalidFetch).not.toHaveBeenCalled()
  })

  test('distingue una casa inexistente de otro error remoto', async () => {
    const fetchMock = vi.fn(async () => apiResponse({}, 404))
    renderHouseRoute('9999', fetchMock)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Casa no encontrada' }),
    ).toBeInTheDocument()
  })

  test('conserva el estado de error remoto general', async () => {
    const fetchMock = vi.fn(async () => apiResponse({}, 503))
    renderHouseRoute('9998', fetchMock)

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'No fue posible obtener esta casa',
      }),
    ).toBeInTheDocument()
  })
})
