import { Users } from 'lucide-react'
import { CharacterPanel } from './CharacterPanel'
import type { CharacterFamilyEntry } from './character-detail.types'

interface CharacterFamilyPanelProps {
  family?: CharacterFamilyEntry[]
}

/**
 * Familia.
 *
 * Filas de clave y valor sin jerarquía implícita: la vista no sabe qué es un
 * padre y qué es una casa de crianza, solo imprime lo que le den. Sin entradas
 * el panel desaparece en lugar de dejar un marco vacío.
 */
export function CharacterFamilyPanel({ family }: CharacterFamilyPanelProps) {
  if (!family || family.length === 0) {
    return null
  }

  return (
    <CharacterPanel dense icon={Users} id="panel-familia" title="Familia">
      <dl className="character-detail__rows">
        {family.map((entry) => (
          <div className="character-detail__row" key={entry.id}>
            <dt className="character-detail__row-key">{entry.label}</dt>
            <dd className="character-detail__row-value" data-tone={entry.tone ?? 'ember'}>
              <span aria-hidden="true" className="character-detail__row-mark" />
              {entry.value}
            </dd>
          </div>
        ))}
      </dl>
    </CharacterPanel>
  )
}
