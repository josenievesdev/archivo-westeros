import { Clapperboard } from 'lucide-react'
import { CharacterPanel } from './CharacterPanel'
import type { CharacterSeasonViewModel } from './character-detail.types'

interface CharacterSeasonsPanelProps {
  note?: string
  seasons?: CharacterSeasonViewModel[]
}

/**
 * Aparece en.
 *
 * La lista llega ya filtrada: la vista no asume que existan ocho temporadas ni
 * que todas sean visibles. Cuando exista el Spoiler Shield será él quien decida
 * qué temporadas entran en `seasons`.
 */
export function CharacterSeasonsPanel({ note, seasons }: CharacterSeasonsPanelProps) {
  if (!seasons || seasons.length === 0) {
    return null
  }

  return (
    <CharacterPanel icon={Clapperboard} id="panel-temporadas" title="Aparece en">
      <ul className="character-detail__seasons">
        {seasons.map((season) => (
          <li
            className="character-detail__season"
            data-current={season.current ? 'true' : undefined}
            data-muted={season.available === false ? 'true' : undefined}
            key={season.id}
          >
            {season.label}
          </li>
        ))}
      </ul>
      {note && <p className="character-detail__seasons-note">{note}</p>}
    </CharacterPanel>
  )
}
