import { Link } from 'react-router-dom'
import { HousePiece } from '../../../components/ui/HousePiece'
import type { WarRoomHouseViewModel } from './war-room.types'

/**
 * `Cifras`: la línea de datos que Pen imprime bajo el rótulo de cada pieza.
 *
 * Pinta lo que reciba, sin saber qué dimensión es cada cifra ni si es sensible:
 * decidir qué se puede enseñar es trabajo de quien construya el ViewModel
 * cuando exista Spoiler Shield. Los puntos separadores son decorativos.
 */
function WarRoomFigures({ house }: { house: WarRoomHouseViewModel }) {
  const figures = house.figures ?? []

  if (figures.length === 0) return null

  return (
    <span className="war-room-cell__figures">
      {figures.map((figure, index) => (
        <span className="war-room-cell__figure" data-figure={figure.label} key={figure.label}>
          {index > 0 && <span aria-hidden="true" className="war-room-cell__dot" />}
          <span className="war-room-cell__figure-text" data-tone={figure.tone ?? 'default'}>
            {figure.value}
          </span>
        </span>
      ))}
    </span>
  )
}

interface WarRoomHousePieceProps {
  house: WarRoomHouseViewModel
  onSelect?: (house: WarRoomHouseViewModel) => void
}

/**
 * `Celda` del tablero: la pieza compartida más su línea de cifras.
 *
 * Reutiliza `HousePiece` tal cual — sus medidas ya son las del frame 04 — y solo
 * añade envoltorio, cifras e interacción. Así la Home y la ficha de casa no se
 * ven afectadas por nada de lo que ocurra aquí.
 */
export function WarRoomHousePiece({ house, onSelect }: WarRoomHousePieceProps) {
  const piece = (
    <>
      <HousePiece
        house={house.theme}
        motto={house.words}
        name={house.displayName}
        region={house.region}
      />
      <WarRoomFigures house={house} />
    </>
  )

  if (house.to) {
    return (
      <Link
        aria-label={`Abrir la ficha de la casa ${house.displayName}`}
        className="war-room-cell"
        data-house={house.theme}
        onClick={() => onSelect?.(house)}
        to={house.to}
      >
        {piece}
      </Link>
    )
  }

  if (onSelect) {
    return (
      <button
        aria-label={`Abrir la ficha de la casa ${house.displayName}`}
        className="war-room-cell"
        data-house={house.theme}
        onClick={() => onSelect(house)}
        type="button"
      >
        {piece}
      </button>
    )
  }

  return (
    <div className="war-room-cell" data-house={house.theme}>
      {piece}
    </div>
  )
}
