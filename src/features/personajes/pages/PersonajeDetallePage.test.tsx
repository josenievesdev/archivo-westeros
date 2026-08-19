import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import { DAENERYS_MAIN_RESPONSE } from '../../../test/fixtures/ice_and_fire_characters'
import { PersonajeDetallePage } from './PersonajeDetallePage'

const apiResponse = (body: any) => {
  return {
    ok: true,
    status: 200,
    json: async () => body,
  }
}

/**
 * La ruta sigue consultando la fuente —los estados de carga y error son los de
 * siempre— pero la ficha que pinta todavía es el fixture de diseño de
 * `02 · Ficha de personaje`. Cuando el punto de conexión de la página devuelva
 * un ViewModel real construido desde `CanonicalCharacter` + `CharacterMedia`,
 * este test volverá a comprobar los datos del personaje consultado.
 */
test('consulta la fuente y sirve la ficha visual una vez resuelta', async () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
         const url = new URL(String(input))
         if (url.pathname.endsWith('/Characters')) {
           return apiResponse([{
             id: 0,
             firstName: 'Daenerys',
             lastName: 'Targaryen',
             fullName: 'Daenerys Targaryen',
             title: 'Queen',
             family: 'House Targaryen',
             image: 'daenerys.jpg',
             imageUrl: 'https://thronesapi.com/assets/images/daenerys.jpg',
           }])
         }
         if (url.pathname.endsWith('/characters/1303')) {
           return apiResponse(DAENERYS_MAIN_RESPONSE)
         }
         return apiResponse([])
       })
  vi.stubGlobal('fetch', fetchMock)

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/personajes/%201303%20']}>
        <Routes>
          <Route path="/personajes/:id" element={<PersonajeDetallePage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )

  expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Línea de vida' })).toBeInTheDocument()
  expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/characters\/1303$/)
})

test('rechaza un ID de ruta vacío tras normalizarlo sin llamar a la red', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/personajes/%20']}>
        <Routes>
          <Route path="/personajes/:id" element={<PersonajeDetallePage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )

  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'El identificador del personaje no es válido',
    }),
  ).toBeInTheDocument()
  expect(fetchMock).not.toHaveBeenCalled()
})
