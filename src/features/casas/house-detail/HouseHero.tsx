import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { HousePiece } from '../../../components/ui/HousePiece'
import { HouseSigil } from '../../../components/ui/HouseSigil'
import type { HouseDetailViewModel } from './house-detail.types'

/** Posiciones de las cenizas del frame de Pen (`left-top` en el lienzo 1440). */
const ASHES = [
  '900-420',
  '1010-300',
  '1120-480',
  '840-540',
  '1220-380',
  '960-560',
  '1080-180',
  '1280-520',
] as const

interface HouseHeroProps {
  house: HouseDetailViewModel
}

export function HouseHero({ house }: HouseHeroProps) {
  const membersLabel =
    house.membersCount === undefined
      ? undefined
      : `${house.membersCount} miembros registrados`

  return (
    <section className="house-detail__hero">
      <div aria-hidden="true" className="house-detail__atmosphere">
        <div className="house-detail__fire" />
        <div className="house-detail__rescoldo" />
        <div className="house-detail__ghost">
          <HouseSigil decorative house={house.theme} size={420} />
        </div>
        {ASHES.map((ash) => (
          <span className="house-detail__ash" data-ash={ash} key={ash} />
        ))}
      </div>

      <div className="house-detail-width house-detail__hero-inner">
        <div className="house-detail__identity">
          <nav aria-label="Ruta de navegación">
            <ol className="house-detail__breadcrumb">
              <li>
                <Link to="/">Archivo</Link>
                <ChevronRight aria-hidden="true" className="size-[0.6875rem]" />
              </li>
              <li>
                <Link to="/casas">Casas</Link>
                <ChevronRight aria-hidden="true" className="size-[0.6875rem]" />
              </li>
              <li aria-current="page">{house.displayName}</li>
            </ol>
          </nav>

          <p className="house-detail__emblem">
            <HouseSigil decorative house={house.theme} size={34} />
            <span>House</span>
          </p>

          <h1 className="house-detail__name">{house.name}</h1>

          {house.motto && <p className="house-detail__motto">“{house.motto}”</p>}

          {house.description && (
            <p className="house-detail__description">{house.description}</p>
          )}

          {(house.statusLabel || membersLabel) && (
            <div className="house-detail__flags">
              {house.statusLabel && (
                <span
                  className={
                    house.statusTone === 'extinct'
                      ? 'house-detail__flag house-detail__flag--extinct'
                      : 'house-detail__flag'
                  }
                >
                  {house.statusTone === 'extinct' && <i aria-hidden="true" />}
                  {house.statusLabel}
                </span>
              )}
              {membersLabel && <span className="house-detail__flag">{membersLabel}</span>}
            </div>
          )}
        </div>

        <div className="house-detail__piece">
          <HousePiece
            house={house.theme}
            motto={house.motto ? `“${house.motto}”` : undefined}
            name={house.name}
            region={house.regionCaption}
          />
        </div>
      </div>
    </section>
  )
}
