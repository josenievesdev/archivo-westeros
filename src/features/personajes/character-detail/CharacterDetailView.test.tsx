import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { CharacterDetailView } from './CharacterDetailView'
import { characterDetailDesignFixture } from './character_detail.fixture'
// El propio código del fixture es lo que se audita: importarlo en crudo evita
// depender de `node:fs` y de la forma exacta del objeto.
import fixtureSource from './character_detail.fixture.ts?raw'
import type { CharacterDetailViewModel } from './character-detail.types'

function renderView(character: CharacterDetailViewModel) {
  return render(
    <MemoryRouter>
      <CharacterDetailView character={character} />
    </MemoryRouter>,
  )
}

/** Lo mínimo que exige el contrato: sin secciones, la vista no debe romperse. */
const bareCharacter: CharacterDetailViewModel = {
  displayName: 'Nombre sin datos',
  id: 'vacio',
}

describe('CharacterDetailView', () => {
  it('imprime el nombre recibido como titular de la ficha', () => {
    renderView(characterDetailDesignFixture)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Jon Snow' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Lord Snow')).toBeInTheDocument()
  })

  it('pinta el retrato con la URL recibida por props', () => {
    renderView({
      ...characterDetailDesignFixture,
      media: { altText: 'Retrato de prueba', portraitUrl: 'https://example.test/retrato.jpg' },
    })

    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://example.test/retrato.jpg',
    )
  })

  it('aplica el altText recibido al retrato', () => {
    renderView({
      ...characterDetailDesignFixture,
      media: { altText: 'Retrato de Arya Stark', portraitUrl: 'https://example.test/a.jpg' },
    })

    expect(screen.getByAltText('Retrato de Arya Stark')).toBeInTheDocument()
  })

  it('cae en el sigilo grabado cuando no hay media, sin imagen rota', () => {
    const { container } = renderView({ ...characterDetailDesignFixture, media: undefined })

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('.character-detail__engraving')).toBeInTheDocument()
  })

  it('propaga el tema de la casa mediante data-house', () => {
    const { container, rerender } = renderView(characterDetailDesignFixture)

    expect(container.querySelector('.character-detail')).toHaveAttribute(
      'data-house',
      'stark',
    )

    rerender(
      <MemoryRouter>
        <CharacterDetailView
          character={{
            ...characterDetailDesignFixture,
            house: { label: 'House Martell', theme: 'martell' },
          }}
        />
      </MemoryRouter>,
    )

    expect(container.querySelector('.character-detail')).toHaveAttribute(
      'data-house',
      'martell',
    )
  })

  it('cae en el tema neutro cuando el ViewModel no trae casa', () => {
    const { container } = renderView(bareCharacter)

    expect(container.querySelector('.character-detail')).toHaveAttribute(
      'data-house',
      'neutral',
    )
  })

  it('imprime la banda de datos desde props, sin conceptos fijos', () => {
    const { container } = renderView({
      ...characterDetailDesignFixture,
      facts: [
        { label: 'Guarnición', value: 'La Guardia' },
        { label: 'Puesto', value: 'Castle Black' },
      ],
    })

    const band = container.querySelector('.character-detail__facts') as HTMLElement
    expect(within(band).getByText('Guarnición')).toBeInTheDocument()
    expect(within(band).getByText('La Guardia')).toBeInTheDocument()
    // Los seis campos del frame de Pen no están cableados dentro de la vista.
    expect(within(band).queryByText('Actor')).not.toBeInTheDocument()
    expect(within(band).queryByText('Casa')).not.toBeInTheDocument()
  })

  it('renderiza la línea de vida recibida por props', () => {
    renderView(characterDetailDesignFixture)

    const timeline = screen.getByRole('region', { name: 'Línea de vida' })
    expect(within(timeline).getAllByRole('listitem')).toHaveLength(
      characterDetailDesignFixture.timeline?.length ?? 0,
    )
    expect(within(timeline).getByText('Se une a una orden')).toBeInTheDocument()
  })

  it('omite la línea de vida cuando llega vacía', () => {
    renderView({ ...characterDetailDesignFixture, timeline: [] })

    expect(screen.queryByRole('heading', { name: 'Línea de vida' })).not.toBeInTheDocument()
  })

  it('renderiza los vínculos recibidos por props', () => {
    renderView(characterDetailDesignFixture)

    const relations = screen.getByRole('region', { name: 'Vínculos' })
    expect(within(relations).getAllByRole('listitem')).toHaveLength(
      characterDetailDesignFixture.relationships?.length ?? 0,
    )
    expect(within(relations).getByText('Samwell Tarly')).toBeInTheDocument()
  })

  it('omite el panel de familia cuando no llegan entradas', () => {
    renderView({ ...characterDetailDesignFixture, family: [] })

    expect(screen.queryByRole('region', { name: 'Familia' })).not.toBeInTheDocument()
    // Los demás paneles siguen en pie.
    expect(screen.getByRole('region', { name: 'Lealtades' })).toBeInTheDocument()
  })

  it('renderiza las temporadas ya filtradas que recibe', () => {
    renderView(characterDetailDesignFixture)

    const seasons = screen.getByRole('region', { name: 'Aparece en' })
    expect(within(seasons).getAllByRole('listitem')).toHaveLength(3)
    expect(within(seasons).queryByText('8')).not.toBeInTheDocument()
  })

  it('usa la ruta recibida en cada acción del Hero', () => {
    renderView({
      ...characterDetailDesignFixture,
      actions: [
        { id: 'lineage', label: 'Ver su linaje', to: '/linajes/jon', tone: 'primary' },
        { href: 'https://example.test/ficha', id: 'externo', label: 'Fuente' },
      ],
    })

    expect(screen.getByRole('link', { name: 'Ver su linaje' })).toHaveAttribute(
      'href',
      '/linajes/jon',
    )
    expect(screen.getByRole('link', { name: 'Fuente' })).toHaveAttribute(
      'href',
      'https://example.test/ficha',
    )
  })

  it('deja el control de ambiente deshabilitado: aquí no suena nada', () => {
    renderView(characterDetailDesignFixture)

    expect(
      screen.getByRole('button', { name: /Reproducir Viento en el Muro/ }),
    ).toBeDisabled()
  })

  it('no consulta la red al pintarse', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    renderView(characterDetailDesignFixture)

    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('fixture de diseño de la ficha de personaje', () => {
  it('no importa ThronesAPI ni ninguna otra fuente de datos', () => {
    expect(fixtureSource).not.toMatch(/from ['"].*thronesapi/i)
    expect(fixtureSource).not.toMatch(/from ['"].*ice-and-fire/i)
    expect(fixtureSource).not.toMatch(/useCharacterMedia/)
  })

  /**
   * El usuario va por la temporada 3 y el Spoiler Shield todavía no existe: el
   * fixture no puede colar el contenido tardío del frame de Pen.
   */
  it('no contiene el vocabulario spoiler del frame de Pen', () => {
    const banned = [
      'Aegon Targaryen',
      'King in the North',
      'Lord Commander',
      'Rhaegar',
      'Lyanna',
      'Daenerys',
      'Dracarys',
      'Iron Throne',
      'resucita',
      'Melisandre',
      'Battle of the Bastards',
      'Temporada VIII',
    ]

    for (const term of banned) {
      expect(fixtureSource).not.toMatch(new RegExp(term, 'i'))
    }
  })
})
