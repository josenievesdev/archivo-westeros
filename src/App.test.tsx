import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import App from './App'

const characterResponse = [
  {
    url: 'https://anapioficeandfire.com/api/characters/583',
    name: 'Jon Snow',
    gender: 'Male',
    culture: 'Northmen',
    born: 'In 283 AC',
    died: '',
    titles: ['Lord Commander of the Night\'s Watch'],
    aliases: ['Lord Snow'],
    father: '',
    mother: '',
    spouse: '',
    allegiances: ['https://anapioficeandfire.com/api/houses/362'],
    books: [],
    povBooks: [],
    tvSeries: ['Season 1'],
    playedBy: ['Kit Harington'],
  },
]

const houseResponse = [
  {
    url: 'https://anapioficeandfire.com/api/houses/362',
    name: 'House Stark of Winterfell',
    region: 'The North',
    coatOfArms: 'A grey direwolf on a white field',
    words: 'Winter is Coming',
    titles: ['King in the North'],
    seats: ['Winterfell'],
    currentLord: '',
    heir: '',
    overlord: '',
    founded: 'Age of Heroes',
    founder: '',
    diedOut: '',
    ancestralWeapons: ['Ice'],
    cadetBranches: [],
    swornMembers: [],
  },
]

test('renderiza la aplicación y confirma la conexión de datos', async () => {
  window.history.pushState({}, '', '/')
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const payload = String(input).includes('/houses')
        ? houseResponse
        : characterResponse

      return {
        ok: true,
        status: 200,
        json: async () => payload,
      } as Response
    }),
  )

  render(<App />)

  expect(
    screen.getByRole('heading', { level: 1, name: 'Nadie recuerda todos los nombres' }),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: 'Archivo de Westeros, inicio' }),
  ).toBeInTheDocument()
  expect(screen.getByRole('navigation', { name: 'Navegación móvil' })).toBeInTheDocument()
  expect(await screen.findByText('Conexión disponible')).toBeInTheDocument()
  expect(screen.getByText('Jon Snow')).toBeInTheDocument()
  expect(screen.getByText('House Stark of Winterfell')).toBeInTheDocument()
})

test('la ruta más activa el destino correspondiente de la navegación móvil', () => {
  window.history.pushState({}, '', '/mas')
  render(<App />)

  expect(screen.getByRole('heading', { level: 1, name: 'Más secciones' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Más' })).toHaveAttribute('aria-current', 'page')
})

test('una ruta 404 con prefijo parecido no marca un destino como activo', () => {
  window.history.pushState({}, '', '/personajes-no-existe')
  render(<App />)

  expect(
    screen.getByRole('heading', { level: 1, name: 'Ruta no encontrada' }),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Buscar' })).not.toHaveAttribute('aria-current')
})
