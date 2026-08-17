import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import App from './App'

function createCharacterResponse(id: string, name: string, title: string, alias: string) {
  return {
    url: `https://anapioficeandfire.com/api/characters/${id}`,
    name,
    gender: 'Male',
    culture: 'Northmen',
    born: 'In 283 AC',
    died: '',
    titles: [title],
    aliases: [alias],
    father: '',
    mother: '',
    spouse: '',
    allegiances: ['https://anapioficeandfire.com/api/houses/362'],
    books: [],
    povBooks: [],
    tvSeries: ['Season 1'],
    playedBy: ['Kit Harington'],
  }
}

const charactersById: Record<string, ReturnType<typeof createCharacterResponse>> = {
  '148': createCharacterResponse('148', 'Arya Stark', 'Princess', 'Arya Underfoot'),
  '238': createCharacterResponse('238', 'Cersei Lannister', 'Queen Regent', 'Light of the West'),
  '583': createCharacterResponse(
    '583',
    'Jon Snow',
    "Lord Commander of the Night's Watch",
    'Lord Snow',
  ),
  '1052': createCharacterResponse('1052', 'Tyrion Lannister', 'Acting Hand of the King', 'The Imp'),
  '1303': createCharacterResponse('1303', 'Daenerys Targaryen', 'Princess of Dragonstone', 'Mother of Dragons'),
}

test('renderiza la Home inmersiva con casas, personajes y navegación', async () => {
  window.history.pushState({}, '', '/')
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const characterId = String(input).match(/\/characters\/(\d+)/)?.[1]
      const payload = characterId ? charactersById[characterId] : []

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
  expect(screen.getByRole('searchbox', { name: 'Buscar personajes y casas' })).toBeInTheDocument()
  expect(
    screen.getAllByRole('link', { name: 'Abrir la ficha de la casa Stark' }),
  ).toHaveLength(2)
  expect(
    screen.getAllByRole('link', { name: 'Abrir la ficha de la casa Martell' }),
  ).toHaveLength(2)
  expect(await screen.findByRole('heading', { name: 'Jon Snow' })).toBeInTheDocument()
  expect(await screen.findByRole('heading', { name: 'Daenerys Targaryen' })).toBeInTheDocument()
  expect(await screen.findByRole('heading', { name: 'Tyrion Lannister' })).toBeInTheDocument()
  expect(await screen.findByRole('heading', { name: 'Arya Stark' })).toBeInTheDocument()
  expect(await screen.findByRole('heading', { name: 'Cersei Lannister' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Explorar los linajes/i })).toHaveAttribute(
    'href',
    '/linajes',
  )
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
