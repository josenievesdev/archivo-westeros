import { Castle, Crown, Map, Quote, Scroll, Shield, type LucideIcon } from 'lucide-react'
import type { HouseDetailViewModel } from './house-detail.types'

interface Fact {
  icon: LucideIcon
  label: string
  value: string
}

/**
 * La banda solo imprime los datos presentes: qué se muestra lo decide el
 * ViewModel, el orden y la tipografía los decide Pen.
 */
function buildFacts(house: HouseDetailViewModel): Fact[] {
  const facts: Array<Fact | undefined> = [
    house.region ? { icon: Map, label: 'Región', value: house.region } : undefined,
    house.seat ? { icon: Castle, label: 'Asentamiento', value: house.seat } : undefined,
    house.founded ? { icon: Scroll, label: 'Fundación', value: house.founded } : undefined,
    house.words ? { icon: Quote, label: 'Palabras', value: house.words } : undefined,
    house.currentHead
      ? { icon: Crown, label: 'Última cabeza', value: house.currentHead }
      : undefined,
    house.swornHousesCount === undefined
      ? undefined
      : {
          icon: Shield,
          label: 'Juramentadas',
          value: house.swornHousesCount === 1 ? '1 casa' : `${house.swornHousesCount} casas`,
        },
  ]

  return facts.filter((fact): fact is Fact => fact !== undefined)
}

interface HouseFactsProps {
  house: HouseDetailViewModel
}

export function HouseFacts({ house }: HouseFactsProps) {
  const facts = buildFacts(house)

  if (facts.length === 0) {
    return null
  }

  return (
    <div className="house-detail__facts">
      <dl className="house-detail-width house-detail__facts-row">
        {facts.map(({ icon: Icon, label, value }) => (
          <div className="house-detail__fact" key={label}>
            <dt className="house-detail__fact-key">
              <Icon aria-hidden="true" className="size-3" />
              {label}
            </dt>
            <dd className="house-detail__fact-value">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
