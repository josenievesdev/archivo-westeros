import { Palette } from 'lucide-react'
import type { CSSProperties } from 'react'
import { HouseSigil } from '../../../components/ui/HouseSigil'
import type { HouseTheme } from '../../../components/ui/house-theme'
import type { HouseHeraldryViewModel } from './house-detail.types'

interface HouseHeraldryPanelProps {
  heraldry: HouseHeraldryViewModel
  theme: HouseTheme
}

export function HouseHeraldryPanel({ heraldry, theme }: HouseHeraldryPanelProps) {
  return (
    <section aria-labelledby="armas-y-colores" className="house-detail__panel">
      <header className="house-detail__panel-head">
        <Palette aria-hidden="true" className="size-3.5" />
        <h2 id="armas-y-colores">Armas y colores</h2>
      </header>

      <div className="house-detail__heraldry">
        <div className="house-detail__crest">
          <HouseSigil decorative house={theme} size={76} />
        </div>

        {heraldry.description && (
          <p className="house-detail__blazon">{heraldry.description}</p>
        )}

        {heraldry.colors.length > 0 && (
          <ul className="house-detail__swatches">
            {heraldry.colors.map((color) => (
              <li
                className="house-detail__swatch"
                key={color.name}
                style={{ '--swatch': color.value } as CSSProperties}
              >
                <i aria-hidden="true" />
                <span>{color.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
