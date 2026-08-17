import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { HouseDetailView } from './HouseDetailView'
import { targaryenHouseDetailFixture } from './house_detail.fixture'
import type { HouseDetailViewModel } from './house-detail.types'

function renderView(house: HouseDetailViewModel) {
  return render(
    <MemoryRouter>
      <HouseDetailView house={house} />
    </MemoryRouter>,
  )
}

const emptyHouse: HouseDetailViewModel = {
  displayName: 'House Stark',
  id: 'stark',
  leadership: [],
  members: [],
  name: 'Stark',
  swornHouses: [],
  theme: 'stark',
}

describe('HouseDetailView', () => {
  it('imprime el nombre y el lema de la casa', () => {
    renderView(targaryenHouseDetailFixture)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Targaryen' }),
    ).toBeInTheDocument()
    expect(screen.getAllByText('“Fire and Blood”').length).toBeGreaterThan(0)
    expect(
      screen.getByText(/La última casa dragón de Valyria/),
    ).toBeInTheDocument()
  })

  it('aplica el tema de la casa mediante data-house', () => {
    const { container } = renderView(targaryenHouseDetailFixture)

    expect(container.querySelector('.house-detail')).toHaveAttribute(
      'data-house',
      'targaryen',
    )
  })

  it('cambia de atmósfera sin cambiar de estructura al cambiar de casa', () => {
    const { container } = renderView({ ...targaryenHouseDetailFixture, theme: 'stark' })

    expect(container.querySelector('.house-detail')).toHaveAttribute(
      'data-house',
      'stark',
    )
    // La misma vista sigue mostrando las mismas secciones.
    expect(screen.getByRole('heading', { name: 'Miembros relevantes' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Quién tuvo el mando' })).toBeInTheDocument()
  })

  it('renderiza los miembros recibidos por props', () => {
    renderView(targaryenHouseDetailFixture)

    for (const member of targaryenHouseDetailFixture.members) {
      expect(screen.getByRole('heading', { name: member.name })).toBeInTheDocument()
    }
    expect(screen.getByText('Mother of Dragons')).toBeInTheDocument()
  })

  it('renderiza las casas juramentadas recibidas por props', () => {
    renderView(targaryenHouseDetailFixture)

    const panel = screen.getByRole('region', { name: 'Casas juramentadas' })
    expect(within(panel).getByText('House Velaryon')).toBeInTheDocument()
    expect(within(panel).getByText('Driftmark')).toBeInTheDocument()
    expect(within(panel).getAllByRole('listitem')).toHaveLength(
      targaryenHouseDetailFixture.swornHouses.length,
    )
  })

  it('imprime la banda de datos solo con los campos presentes', () => {
    renderView(targaryenHouseDetailFixture)

    expect(screen.getByText('Región')).toBeInTheDocument()
    expect(screen.getByText('Dragonstone · Crownlands')).toBeInTheDocument()
    expect(screen.getByText('Juramentadas')).toBeInTheDocument()
    expect(screen.getByText('9 casas')).toBeInTheDocument()
  })

  it('muestra el liderazgo con su periodo y apodo', () => {
    renderView(targaryenHouseDetailFixture)

    expect(screen.getByText('Aegon I')).toBeInTheDocument()
    expect(screen.getByText('· el Conquistador')).toBeInTheDocument()
    expect(screen.getByText('1 – 37 AC')).toBeInTheDocument()
  })

  it('muestra la heráldica con sus tintas', () => {
    renderView(targaryenHouseDetailFixture)

    const panel = screen.getByRole('region', { name: 'Armas y colores' })
    expect(within(panel).getByText('Dragón tricéfalo, gules, sobre sable.')).toBeInTheDocument()
    expect(within(panel).getByText('Sangre')).toBeInTheDocument()
    expect(within(panel).getByText('Hueso')).toBeInTheDocument()
  })

  it('muestra estados vacíos cuando las listas llegan vacías', () => {
    renderView(emptyHouse)

    expect(screen.getByText(/Todavía no hay miembros registrados/)).toBeInTheDocument()
    expect(screen.getByText(/No consta quién estuvo al mando/)).toBeInTheDocument()
    expect(screen.getByText(/Ninguna casa consta jurada/)).toBeInTheDocument()
    // Sin heráldica el panel entero desaparece, no queda un hueco vacío.
    expect(screen.queryByRole('region', { name: 'Armas y colores' })).not.toBeInTheDocument()
  })

  it('omite la banda de datos cuando no hay ningún dato', () => {
    const { container } = renderView(emptyHouse)

    expect(container.querySelector('.house-detail__facts')).toBeNull()
  })

  it('renderiza el tema neutral sin romperse', () => {
    const { container } = renderView({
      ...targaryenHouseDetailFixture,
      displayName: 'House Blackfyre',
      heraldry: undefined,
      name: 'Blackfyre',
      theme: 'neutral',
    })

    expect(container.querySelector('.house-detail')).toHaveAttribute(
      'data-house',
      'neutral',
    )
    expect(
      screen.getByRole('heading', { level: 1, name: 'Blackfyre' }),
    ).toBeInTheDocument()
    // La estructura no cambia: sigue habiendo secciones, no heráldica prestada.
    expect(screen.getByRole('heading', { name: 'Miembros relevantes' })).toBeInTheDocument()
    expect(
      screen.queryByRole('region', { name: 'Armas y colores' }),
    ).not.toBeInTheDocument()
  })

  it('no depende de llamadas de red', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    renderView(targaryenHouseDetailFixture)

    expect(fetchSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
  })
})
