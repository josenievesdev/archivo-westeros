import { Flag } from 'lucide-react'
import { CharacterPanel } from './CharacterPanel'
import type { CharacterLoyalty } from './character-detail.types'

interface CharacterLoyaltiesPanelProps {
  loyalties?: CharacterLoyalty[]
}

/** Convierte `strength` (0–1) en el ancho del relleno. Sin valor, la barra va llena. */
function fillWidth(strength: number | undefined): string {
  if (strength === undefined) {
    return '100%'
  }

  return `${Math.round(Math.min(Math.max(strength, 0), 1) * 100)}%`
}

/**
 * Lealtades.
 *
 * La barra es una lectura editorial del peso de cada lealtad, no un cálculo:
 * llega resuelta en el ViewModel. Aquí no hay lógica temporal ni lealtades
 * inventadas.
 */
export function CharacterLoyaltiesPanel({ loyalties }: CharacterLoyaltiesPanelProps) {
  if (!loyalties || loyalties.length === 0) {
    return null
  }

  return (
    <CharacterPanel icon={Flag} id="panel-lealtades" title="Lealtades">
      <ul className="character-detail__loyalties">
        {loyalties.map((loyalty) => (
          <li className="character-detail__loyalty" key={loyalty.id}>
            <p className="character-detail__loyalty-row">
              <span className="character-detail__loyalty-name">{loyalty.name}</span>
              {loyalty.period && (
                <span className="character-detail__loyalty-period">{loyalty.period}</span>
              )}
            </p>
            <span aria-hidden="true" className="character-detail__loyalty-bar">
              <span
                data-tone={loyalty.tone ?? 'ice'}
                style={{ width: fillWidth(loyalty.strength) }}
              />
            </span>
            {loyalty.note && <em className="character-detail__loyalty-note">{loyalty.note}</em>}
          </li>
        ))}
      </ul>
    </CharacterPanel>
  )
}
