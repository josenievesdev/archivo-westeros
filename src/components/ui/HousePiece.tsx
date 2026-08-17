import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/utils/cx'
import { HouseSigil } from './HouseSigil'
import type { HouseTheme } from './house-theme'

interface HousePieceProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  house: HouseTheme
  motto?: string
  name: string
  region?: string
  size?: 'compact' | 'standard'
  visual?: ReactNode
}

export function HousePiece({
  className,
  house,
  motto,
  name,
  region,
  size = 'standard',
  visual,
  ...props
}: HousePieceProps) {
  return (
    <figure
      className={cx('house-piece', size === 'compact' && 'house-piece--compact', className)}
      data-house={house}
      {...props}
    >
      <div aria-hidden="true" className="house-piece__stage">
        {visual ? (
          <div className="house-piece__visual-slot">{visual}</div>
        ) : (
          <>
            <div className="house-piece__halo" />
            <div className="house-piece__sigil">
              <HouseSigil decorative house={house} size={128} />
            </div>
            <div className="house-piece__pedestal">
              <div className="house-piece__capital" />
              <div className="house-piece__neck" />
              <div className="house-piece__inlay" />
              <div className="house-piece__shaft" />
              <div className="house-piece__base-high" />
              <div className="house-piece__base-low" />
            </div>
            <div className="house-piece__reflection" />
          </>
        )}
      </div>
      <figcaption className="house-piece__caption">
        <p className="house-piece__name">{name}</p>
        <span aria-hidden="true" className="house-piece__rule" />
        {motto && <p className="house-piece__motto">{motto}</p>}
        {region && <p className="house-piece__region">{region}</p>}
      </figcaption>
    </figure>
  )
}
