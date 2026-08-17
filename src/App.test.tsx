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
    screen.getByRole('heading', { level: 1, name: 'Realms of Westeros' }),
  ).toBeInTheDocument()
  expect(await screen.findByText('Conexión disponible')).toBeInTheDocument()
  expect(screen.getByText('Jon Snow')).toBeInTheDocument()
  expect(screen.getByText('House Stark of Winterfell')).toBeInTheDocument()
})
