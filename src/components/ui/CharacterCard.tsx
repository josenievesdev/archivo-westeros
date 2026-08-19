import { Link } from 'react-router-dom'
import { cx } from '../../lib/utils/cx'
import { HouseBadge, StatusBadge, type StatusBadgeState } from './Badge'
import { HouseSigil } from './HouseSigil'
import type { HouseTheme } from './house-theme'

/**
 * `house-member` reutiliza el retrato vertical de `featured` (la Tarjeta
 * Personaje de Pen) y solo añade un gancho de clase para que la ficha de casa
 * la lleve al ancho de su rejilla.
 */
type CharacterCardVariant = 'default' | 'featured' | 'house-member'

interface CharacterCardProps {
  actor?: string | null
  alias?: string | null
  description?: string | null
  house?: string | null
  houseTheme?: HouseTheme
  image?: {
    alt: string
    src: string
  }
  name: string
  status?: {
    label?: string
    state: StatusBadgeState
  }
  to?: string
  variant?: CharacterCardVariant
}

export function CharacterCard({
  actor,
  alias,
  description,
  house,
  houseTheme,
  image,
  name,
  status,
  to,
  variant = 'default',
}: CharacterCardProps) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toLocaleUpperCase('es')

  // El retrato vertical lo comparten `featured` y `house-member`.
  const isPortrait = variant === 'featured' || variant === 'house-member'

  const card = (
    <article
      className={cx(
        'character-card',
        isPortrait && 'character-card--featured',
        variant === 'house-member' && 'character-card--house-member',
      )}
      data-house={houseTheme}
    >
      <div className="character-card__media">
        {image ? (
          <img
            alt={image.alt}
            className="character-card__image"
            loading="lazy"
            src={image.src}
          />
        ) : houseTheme ? (
          <HouseSigil className="relative z-10 opacity-25" decorative house={houseTheme} size={88} />
        ) : (
          <span className="character-card__initials relative z-10 font-display">
            {initials}
          </span>
        )}
        {isPortrait && houseTheme && (
          <HouseSigil className="character-card__corner-sigil" decorative house={houseTheme} size={32} />
        )}
        {status && (
          <StatusBadge
            className="absolute top-3 right-3 z-20"
            label={status.label}
            state={status.state}
          />
        )}
      </div>
      <div className="character-card__body min-w-0 flex-1 p-4 sm:p-5">
        {house && houseTheme && !isPortrait ? (
          <HouseBadge house={houseTheme} label={house} />
        ) : house ? (
          <p className={isPortrait ? 'character-card__house-label' : 'font-sans text-[0.625rem] uppercase tracking-[0.16em] text-parchment'}>
            {house}
          </p>
        ) : null}
        <h2 className="character-card__name mt-2 font-display text-lg font-semibold leading-6 text-bone sm:text-xl">
          {name}
        </h2>
        {alias && (
          <p className="character-card__alias mt-1 font-serif text-base italic text-parchment">
            {alias}
          </p>
        )}
        {description && (
          <p className="character-card__description mt-3 font-serif text-base leading-6 text-parchment">
            {description}
          </p>
        )}
        {actor && (
          <p className="character-card__actor mt-3 font-sans text-xs leading-5 text-parchment">
            <span className="text-parchment">Interpretado por </span>
            <span className="text-bone">{actor}</span>
          </p>
        )}
      </div>
    </article>
  )

  return to ? (
    <Link className="character-card-link" to={to}>
      {card}
    </Link>
  ) : (
    card
  )
}
