import { useState } from 'react'
import './war-room.css'
import '../../inicio/styles/home.css'
import { HomeFooter } from '../../inicio/components/HomeFooter'
import { WarRoomBoard } from './WarRoomBoard'
import { WarRoomControls } from './WarRoomControls'
import { WarRoomHeader } from './WarRoomHeader'
import type {
  WarRoomCriterion,
  WarRoomHouseViewModel,
  WarRoomLayout,
  WarRoomViewModel,
} from './war-room.types'

interface WarRoomViewProps {
  /** Criterio marcado. Sin él la vista lleva su propio estado local. */
  activeCriterion?: WarRoomCriterion
  layout?: WarRoomLayout
  onCriterionChange?: (criterion: WarRoomCriterion) => void
  onLayoutChange?: (layout: WarRoomLayout) => void
  onSelectHouse?: (house: WarRoomHouseViewModel) => void
  warRoom: WarRoomViewModel
}

/**
 * `04 · Sala de estrategia`, puramente presentacional.
 *
 * No consulta la API, no conoce TanStack Query y no normaliza nada: recibe un
 * `WarRoomViewModel` ya resuelto y lo pinta. Los controles son controlables
 * desde fuera (`activeCriterion` / `onCriterionChange`) y, mientras nadie los
 * gobierne, mantienen estado local para que la pantalla siga siendo usable.
 *
 * El orden de `warRoom.houses` se respeta tal cual: ordenar es trabajo de quien
 * construye el ViewModel, no de la vista.
 */
export function WarRoomView({
  activeCriterion,
  layout,
  onCriterionChange,
  onLayoutChange,
  onSelectHouse,
  warRoom,
}: WarRoomViewProps) {
  const [localCriterion, setLocalCriterion] = useState<WarRoomCriterion>('poder')
  const [localLayout, setLocalLayout] = useState<WarRoomLayout>('board')

  const criterion = activeCriterion ?? localCriterion
  const boardLayout = layout ?? localLayout

  function handleCriterionChange(next: WarRoomCriterion) {
    setLocalCriterion(next)
    onCriterionChange?.(next)
  }

  function handleLayoutChange(next: WarRoomLayout) {
    setLocalLayout(next)
    onLayoutChange?.(next)
  }

  return (
    <div className="war-room">
      <WarRoomHeader
        description={warRoom.description}
        eyebrow={warRoom.eyebrow}
        title={warRoom.title}
      />

      <WarRoomControls
        activeCriterion={criterion}
        layout={boardLayout}
        onCriterionChange={handleCriterionChange}
        onLayoutChange={handleLayoutChange}
      />

      <section aria-labelledby="war-room-title" className="war-room__stage">
        <WarRoomBoard
          houses={warRoom.houses}
          layout={boardLayout}
          onSelect={onSelectHouse}
        />
      </section>

      <HomeFooter />
    </div>
  )
}
