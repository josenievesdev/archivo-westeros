import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import { HousePiece } from './HousePiece'
import { SearchField } from './SearchField'
import { SpoilerLock } from './SpoilerLock'
import { HOUSE_THEMES } from './house-theme'

function SearchHarness({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState('')

  return (
    <SearchField
      label="Buscar en el archivo"
      onSubmit={onSubmit}
      onValueChange={setValue}
      placeholder="Nombre, casa, título o lema"
      value={value}
    />
  )
}

test('el buscador permite escribir, limpiar y enviar con teclado', async () => {
  const user = userEvent.setup()
  const onSubmit = vi.fn()
  render(<SearchHarness onSubmit={onSubmit} />)

  const input = screen.getByRole('searchbox', { name: 'Buscar en el archivo' })
  await user.type(input, 'Arya Stark')
  await user.click(screen.getByRole('button', { name: 'Limpiar búsqueda' }))
  expect(input).toHaveValue('')
  expect(input).toHaveFocus()

  await user.type(input, 'Jon Snow{Enter}')
  expect(onSubmit).toHaveBeenCalledWith('Jon Snow')
})

test('la pieza de casa expone las siete variantes aprobadas', () => {
  const { container } = render(
    <div>
      {HOUSE_THEMES.map((house) => (
        <HousePiece house={house} key={house} name={house} size="compact" />
      ))}
    </div>,
  )

  for (const house of HOUSE_THEMES) {
    expect(container.querySelector(`figure[data-house="${house}"]`)).toBeInTheDocument()
  }
})

test('la información protegida solo se revela mediante una acción explícita', async () => {
  const user = userEvent.setup()
  const onReveal = vi.fn()
  render(<SpoilerLock onReveal={onReveal} />)

  expect(
    screen.getByRole('heading', { name: 'Información protegida' }),
  ).toBeInTheDocument()
  expect(
    screen.getByText('Este dato ocurre después de tu progreso actual.'),
  ).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: 'Revelar de todos modos' }))
  expect(onReveal).toHaveBeenCalledOnce()
})
