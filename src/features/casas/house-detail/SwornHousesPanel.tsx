import {
  Anchor,
  ChevronRight,
  Crown,
  Flame,
  Shield,
  Snowflake,
  Sun,
  Swords,
  Waves,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { SwornHouseSigil, SwornHouseViewModel } from './house-detail.types'

/** El repertorio de cargas es presentación; la clave la elige el ViewModel. */
const sigils: Record<SwornHouseSigil, LucideIcon> = {
  anchor: Anchor,
  crown: Crown,
  flame: Flame,
  shield: Shield,
  snowflake: Snowflake,
  sun: Sun,
  swords: Swords,
  waves: Waves,
}

interface SwornHousesPanelProps {
  houses: SwornHouseViewModel[]
}

export function SwornHousesPanel({ houses }: SwornHousesPanelProps) {
  return (
    <section aria-labelledby="casas-juramentadas" className="house-detail__panel">
      <header className="house-detail__panel-head">
        <Shield aria-hidden="true" className="size-3.5" />
        <h2 id="casas-juramentadas">Casas juramentadas</h2>
      </header>

      {houses.length === 0 ? (
        <div className="house-detail__panel-empty">
          <p className="house-detail__empty">
            Ninguna casa consta jurada a este linaje.
          </p>
        </div>
      ) : (
        <ul className="house-detail__sworn">
          {houses.map((house) => {
            const Sigil = sigils[house.sigil ?? 'shield']
            const content = (
              <>
                <span
                  aria-hidden="true"
                  className="house-detail__sworn-sigil"
                  style={house.accent ? { color: house.accent } : undefined}
                >
                  <Sigil className="size-4" />
                </span>
                <span className="house-detail__sworn-text">
                  <strong>{house.name}</strong>
                  {house.seat && <span>{house.seat}</span>}
                </span>
                <ChevronRight aria-hidden="true" className="size-[0.8125rem]" />
              </>
            )

            return (
              <li key={house.id}>
                {house.to ? (
                  <Link className="house-detail__sworn-item" to={house.to}>
                    {content}
                  </Link>
                ) : (
                  <span className="house-detail__sworn-item">{content}</span>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
