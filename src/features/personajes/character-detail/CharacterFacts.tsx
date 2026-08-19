import {
  Baby,
  Clapperboard,
  Crown,
  HeartPulse,
  MapPin,
  Scroll,
  Shield,
  type LucideIcon,
} from 'lucide-react'
import type { CharacterFact, CharacterFactIcon } from './character-detail.types'

const factIcons: Record<CharacterFactIcon, LucideIcon> = {
  actor: Clapperboard,
  birth: Baby,
  house: Shield,
  region: MapPin,
  role: Crown,
  status: HeartPulse,
  title: Scroll,
}

interface CharacterFactsProps {
  facts?: CharacterFact[]
}

/**
 * La banda no conoce ningún concepto: imprime los `facts` que reciba, en el
 * orden que reciba. Que el frame de Pen muestre seis (casa, estado, nacimiento,
 * región, cargo, actor) es una decisión del ViewModel, no de la arquitectura.
 */
export function CharacterFacts({ facts }: CharacterFactsProps) {
  if (!facts || facts.length === 0) {
    return null
  }

  return (
    <div className="character-detail__facts">
      <dl className="character-detail-width character-detail__facts-row">
        {facts.map((fact) => {
          const Icon = fact.icon ? factIcons[fact.icon] : Scroll

          return (
            <div className="character-detail__fact" key={`${fact.label}-${fact.value}`}>
              <dt className="character-detail__fact-key">
                <Icon aria-hidden="true" className="size-3" />
                {fact.label}
              </dt>
              <dd className="character-detail__fact-value">{fact.value}</dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}
