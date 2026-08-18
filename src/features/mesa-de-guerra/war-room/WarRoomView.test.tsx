import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WarRoomView } from './WarRoomView'
import { warRoomFixture } from './war_room.fixture'
import type { WarRoomCriterion, WarRoomViewModel } from './war-room.types'

function renderView(
  warRoom: WarRoomViewModel = warRoomFixture,
  props: Partial<Parameters<typeof WarRoomView>[0]> = {},
) {
  return render(
    <MemoryRouter>
      <WarRoomView warRoom={warRoom} {...props} />
    </MemoryRouter>,
  )
}

function pieceNames(container: HTMLElement) {
  return Array.from(container.querySelectorAll('.house-piece__name')).map(
    (node) => node.textContent,
  )
}

describe('WarRoomView', () => {
  it('renderiza las siete casas recibidas', () => {
    const { container } = renderView()

    expect(container.querySelectorAll('.war-room-cell')).toHaveLength(7)
    for (const house of warRoomFixture.houses) {
      expect(screen.getByText(house.displayName)).toBeInTheDocument()
    }
  })

  it('respeta el orden recibido en las props', () => {
    const reversed: WarRoomViewModel = {
      ...warRoomFixture,
      houses: [...warRoomFixture.houses].reverse(),
    }

    const { container } = renderView(reversed)

    expect(pieceNames(container)).toEqual([
      'Martell',
      'Tyrell',
      'Greyjoy',
      'Baratheon',
      'Targaryen',
      'Lannister',
      'Stark',
    ])
  })

  it('reparte las piezas en la formación 4 + 3 de Pen', () => {
    const { container } = renderView()

    const formations = container.querySelectorAll('.war-room-board__formation')
    expect(formations).toHaveLength(2)
    expect(formations[0].querySelectorAll('.war-room-board__slot')).toHaveLength(4)
    expect(formations[1].querySelectorAll('.war-room-board__slot')).toHaveLength(3)
  })

  it('aplica a cada celda el data-house de su tema', () => {
    const { container } = renderView()

    const themes = Array.from(container.querySelectorAll('.war-room-cell')).map((cell) =>
      cell.getAttribute('data-house'),
    )
    expect(themes).toEqual(warRoomFixture.houses.map((house) => house.theme))
  })

  it('marca el criterio activo y deja el resto sin pulsar', () => {
    renderView(warRoomFixture, { activeCriterion: 'territorio' })

    expect(screen.getByRole('button', { name: 'Territorio' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Poder' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('avisa del cambio de criterio con el valor pulsado', async () => {
    const onCriterionChange = vi.fn<(criterion: WarRoomCriterion) => void>()
    renderView(warRoomFixture, { onCriterionChange })

    await userEvent.click(screen.getByRole('button', { name: 'Miembros' }))

    expect(onCriterionChange).toHaveBeenCalledWith('miembros')
  })

  it('mantiene estado propio cuando nadie gobierna el criterio', async () => {
    renderView()

    await userEvent.click(screen.getByRole('button', { name: 'Antigüedad' }))

    expect(screen.getByRole('button', { name: 'Antigüedad' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Poder' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('avisa del cambio de disposición del tablero', async () => {
    const onLayoutChange = vi.fn()
    renderView(warRoomFixture, { onLayoutChange })

    await userEvent.click(screen.getByRole('button', { name: 'Ver como lista' }))

    expect(onLayoutChange).toHaveBeenCalledWith('list')
    expect(screen.getByRole('button', { name: 'Ver como lista' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('enlaza cada pieza con la ruta recibida', () => {
    renderView()

    for (const house of warRoomFixture.houses) {
      const link = screen.getByRole('link', {
        name: `Abrir la ficha de la casa ${house.displayName}`,
      })
      expect(link).toHaveAttribute('href', house.to)
    }
  })

  it('no enlaza la pieza cuando el ViewModel no trae ruta', () => {
    const onSelectHouse = vi.fn()
    renderView(
      {
        ...warRoomFixture,
        houses: [{ ...warRoomFixture.houses[0], to: undefined }],
      },
      { onSelectHouse },
    )

    expect(screen.queryByRole('link', { name: /Abrir la ficha/ })).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Abrir la ficha de la casa Stark' }),
    ).toBeInTheDocument()
  })

  it('imprime las cifras recibidas en el orden del ViewModel', () => {
    const { container } = renderView()

    const stark = container.querySelector('.war-room-cell[data-house="stark"]') as HTMLElement
    expect(stark).not.toBeNull()
    expect(
      Array.from(stark.querySelectorAll('.war-room-cell__figure-text')).map(
        (node) => node.textContent,
      ),
    ).toEqual(['48 miembros', 'Casa mayor'])
    expect(within(stark).getByText('Casa mayor')).toHaveAttribute('data-tone', 'accent')
  })

  it('pinta cualquier dimensión que reciba, sin conocer su semántica', () => {
    const { container } = renderView({
      ...warRoomFixture,
      houses: [
        {
          ...warRoomFixture.houses[0],
          figures: [
            { label: 'Antigüedad', value: '8.000 años' },
            { label: 'Poder', value: 12, tone: 'accent' },
          ],
        },
      ],
    })

    const cell = container.querySelector('.war-room-cell') as HTMLElement
    expect(within(cell).getByText('8.000 años')).toBeInTheDocument()
    expect(within(cell).getByText('12')).toHaveAttribute('data-tone', 'accent')
  })

  it('omite la línea de cifras cuando el ViewModel no trae ninguna', () => {
    const { container } = renderView({
      ...warRoomFixture,
      houses: [{ ...warRoomFixture.houses[0], figures: undefined }],
    })

    expect(container.querySelector('.war-room-cell__figures')).toBeNull()
  })

  it('encabeza la pantalla con el título recibido', () => {
    renderView()

    expect(
      screen.getByRole('heading', { level: 1, name: 'El tablero completo' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Sala de estrategia')).toBeInTheDocument()
  })
})

describe('WarRoomView y la red', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('La vista no debe pedir datos'))))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('pinta el tablero completo sin tocar la red', () => {
    const { container } = renderView()

    expect(container.querySelectorAll('.war-room-cell')).toHaveLength(7)
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })
})

describe('fixture de diseño de la sala de estrategia', () => {
  it('trae las siete grandes casas con su tema y su ruta', () => {
    expect(warRoomFixture.houses).toHaveLength(7)
    expect(warRoomFixture.houses.map((house) => house.theme)).toEqual([
      'stark',
      'lannister',
      'targaryen',
      'baratheon',
      'greyjoy',
      'tyrell',
      'martell',
    ])
    for (const house of warRoomFixture.houses) {
      expect(house.to).toMatch(/^\/casas\/\d+$/)
    }
  })

  // Mientras no exista Spoiler Shield, esta pantalla no puede anticipar muertes
  // ni desenlaces de guerra a quien va por la temporada 3.
  it('no enseña supervivientes ni estado de casa', () => {
    const printed = warRoomFixture.houses
      .flatMap((house) => [
        house.displayName,
        house.words ?? '',
        house.region ?? '',
        ...(house.figures ?? []).map((figure) => String(figure.value)),
      ])
      .concat(warRoomFixture.description, warRoomFixture.title, warRoomFixture.eyebrow)
      .join(' ')
      .toLocaleLowerCase('es')

    for (const term of [
      'vivo',
      'viva',
      'superviviente',
      'extint',
      'diezmad',
      'caíd',
      'muert',
      'baja',
    ]) {
      expect(printed).not.toContain(term)
    }
  })

  it('solo reparte cifras estructurales del archivo', () => {
    for (const house of warRoomFixture.houses) {
      expect(house.figures?.map((figure) => figure.label)).toEqual([
        'Miembros',
        'Rango',
      ])
    }
  })

  /* Pen imprime la fila de cifras en una sola línea; si crece, empuja el tablero
     entero por el `align-items: flex-end` de la formación. */
  it('reparte cifras cortas para no partir la fila en dos líneas', () => {
    for (const house of warRoomFixture.houses) {
      const printed = (house.figures ?? []).map((figure) => String(figure.value)).join(' · ')
      expect(printed.length).toBeLessThanOrEqual(30)
    }
  })

  it('es un dato estático: leerlo no dispara ninguna petición', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    const { warRoomFixture: reloaded } = await import('./war_room.fixture')

    expect(reloaded.houses).toHaveLength(7)
    expect(fetchSpy).not.toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})
