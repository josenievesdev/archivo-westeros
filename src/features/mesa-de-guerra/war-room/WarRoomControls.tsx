import { Grid3x3, List } from 'lucide-react'
import { cx } from '../../../lib/utils/cx'
import { WAR_ROOM_CRITERIA, type WarRoomCriterion, type WarRoomLayout } from './war-room.types'

const criterionLabels: Record<WarRoomCriterion, string> = {
  poder: 'Poder',
  miembros: 'Miembros',
  antiguedad: 'Antigüedad',
  territorio: 'Territorio',
}

const layoutOptions: Array<{
  icon: typeof Grid3x3
  label: string
  value: WarRoomLayout
}> = [
  { icon: Grid3x3, label: 'Ver como tablero', value: 'board' },
  { icon: List, label: 'Ver como lista', value: 'list' },
]

interface WarRoomControlsProps {
  activeCriterion: WarRoomCriterion
  layout: WarRoomLayout
  onCriterionChange?: (criterion: WarRoomCriterion) => void
  onLayoutChange?: (layout: WarRoomLayout) => void
}

/**
 * `Controles`: la banda que separa el encabezado de la primera mesa.
 *
 * Los botones son botones reales y anuncian su estado con `aria-pressed`. Aquí
 * no vive ninguna regla de negocio: el orden lo decide quien pase las props.
 */
export function WarRoomControls({
  activeCriterion,
  layout,
  onCriterionChange,
  onLayoutChange,
}: WarRoomControlsProps) {
  return (
    <div className="war-room__controls">
      <div className="war-room__controls-inner">
        <div aria-labelledby="war-room-sort-label" className="war-room__sort" role="group">
          <span className="war-room__sort-label" id="war-room-sort-label">
            Ordenar por
          </span>
          {WAR_ROOM_CRITERIA.map((criterion) => (
            <button
              aria-pressed={criterion === activeCriterion}
              className={cx(
                'war-room__chip',
                criterion === activeCriterion && 'war-room__chip--active',
              )}
              key={criterion}
              onClick={() => onCriterionChange?.(criterion)}
              type="button"
            >
              {criterionLabels[criterion]}
            </button>
          ))}
        </div>

        <div aria-label="Disposición del tablero" className="war-room__view" role="group">
          {layoutOptions.map(({ icon: Icon, label, value }) => (
            <button
              aria-label={label}
              aria-pressed={value === layout}
              className={cx('war-room__view-button', value === layout && 'war-room__view-button--active')}
              key={value}
              onClick={() => onLayoutChange?.(value)}
              type="button"
            >
              <Icon aria-hidden="true" className="size-[0.9375rem]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
