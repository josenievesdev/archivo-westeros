import { Play, Volume2 } from 'lucide-react'
import { CharacterPanel } from './CharacterPanel'
import type { CharacterAmbientViewModel } from './character-detail.types'

interface CharacterAmbientPanelProps {
  ambient?: CharacterAmbientViewModel
}

/**
 * Ambiente.
 *
 * Solo el bloque visual del frame. Aquí no hay audio, ni reproducción, ni
 * autoplay: el control queda deshabilitado mientras `available` no sea cierto,
 * y aun entonces la vista no reproduce nada por su cuenta.
 */
export function CharacterAmbientPanel({ ambient }: CharacterAmbientPanelProps) {
  if (!ambient) {
    return null
  }

  const available = ambient.available === true

  return (
    <CharacterPanel icon={Volume2} id="panel-ambiente" title="Ambiente">
      <div className="character-detail__ambient">
        <button
          aria-label={`Reproducir ${ambient.title}`}
          className="character-detail__ambient-button"
          disabled={!available}
          type="button"
        >
          <Play aria-hidden="true" className="size-[0.875rem]" />
        </button>
        <span className="character-detail__ambient-text">
          <span className="character-detail__ambient-title">{ambient.title}</span>
          {ambient.subtitle && (
            <em className="character-detail__ambient-subtitle">{ambient.subtitle}</em>
          )}
        </span>
      </div>
    </CharacterPanel>
  )
}
