import { WarRoomHousePiece } from './WarRoomHousePiece'
import type { WarRoomHouseViewModel, WarRoomLayout } from './war-room.types'

/**
 * `Tablero · Primera línea` / `Tablero · Segunda línea`.
 *
 * Cada mesa trae su propia atmósfera: superficie de piedra, horizonte dorado,
 * brasa cálida y niebla. Todas son capas decorativas; la formación va encima.
 */
function WarRoomRank({
  houses,
  onSelect,
}: {
  houses: WarRoomHouseViewModel[]
  onSelect?: (house: WarRoomHouseViewModel) => void
}) {
  return (
    <div className="war-room-board">
      <span aria-hidden="true" className="war-room-board__surface" />
      <span aria-hidden="true" className="war-room-board__horizon" />
      <span aria-hidden="true" className="war-room-board__ember" />
      <div className="war-room-board__rank">
        <ul className="war-room-board__formation">
          {houses.map((house) => (
            <li className="war-room-board__slot" key={house.id}>
              <WarRoomHousePiece house={house} onSelect={onSelect} />
            </li>
          ))}
        </ul>
      </div>
      <span aria-hidden="true" className="war-room-board__mist" />
    </div>
  )
}

interface WarRoomBoardProps {
  houses: WarRoomHouseViewModel[]
  layout: WarRoomLayout
  onSelect?: (house: WarRoomHouseViewModel) => void
}

/**
 * Pen parte las siete piezas en dos mesas: cuatro delante y tres detrás. La
 * formación 4 + 3 no es un grid uniforme, así que se conserva tal cual en
 * escritorio; el reparto solo se rompe cuando el ancho ya no admite la fila.
 */
export function WarRoomBoard({ houses, layout, onSelect }: WarRoomBoardProps) {
  const frontRank = houses.slice(0, 4)
  const backRank = houses.slice(4)

  return (
    <div className="war-room__boards" data-layout={layout}>
      {frontRank.length > 0 && <WarRoomRank houses={frontRank} onSelect={onSelect} />}
      {backRank.length > 0 && <WarRoomRank houses={backRank} onSelect={onSelect} />}
    </div>
  )
}
