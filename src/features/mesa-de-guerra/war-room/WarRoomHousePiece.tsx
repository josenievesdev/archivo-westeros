import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { HousePiece } from '../../../components/ui/HousePiece'
import type { WarRoomHouseViewModel } from './war-room.types'

/**
 * `Cifras`: la línea de datos que Pen imprime bajo el rótulo de cada pieza.
 * Los puntos separadores son decorativos y no se anuncian.
 */
function WarRoomFigures({ house }: { house: WarRoomHouseViewModel }) {
  const { alive, members, standing } = house.figures ?? {}
  const entries = [
    members ? { key: 'members', node: members as ReactNode } : null,
    alive ? { key: 'alive', node: alive as ReactNode } : null,
    standing
      ? {
          key: 'standing',
          node: (
            <span className="war-room-cell__standing" data-standing={standing.state}>
              {standing.label}
            </span>
          ) as ReactNode,
        }
      : null,
  ].filter((entry) => entry !== null)

  if (entries.length === 0) return null

  return (
    <span className="war-room-cell__figures">
      {entries.map((entry, index) => (
        <span className="war-room-cell__figure" key={entry.key}>
          {index > 0 && <span aria-hidden="true" className="war-room-cell__dot" />}
          <span className="war-room-cell__figure-text">{entry.node}</span>
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
