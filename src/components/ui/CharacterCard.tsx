import { Link } from 'react-router-dom'
import { HouseBadge, StatusBadge, type StatusBadgeState } from './Badge'
import { HouseSigil } from './HouseSigil'
import type { HouseTheme } from './house-theme'

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
}: CharacterCardProps) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toLocaleUpperCase('es')

  const card = (
    <article className="character-card" data-house={houseTheme}>
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
          <span className="relative z-10 font-display text-2xl text-parchment/35">
            {initials}
          </span>
        )}
        {status && (
          <StatusBadge
            className="absolute top-3 right-3 z-20"
            label={status.label}
            state={status.state}
          />
        )}
      </div>
      <div className="min-w-0 flex-1 p-4 sm:p-5">
        {house && houseTheme ? (
          <HouseBadge house={houseTheme} label={house} />
        ) : house ? (
          <p className="font-sans text-[0.625rem] uppercase tracking-[0.16em] text-parchment">
            {house}
          </p>
        ) : null}
        <h2 className="mt-2 font-display text-lg font-semibold leading-6 text-bone sm:text-xl">
          {name}
        </h2>
        {alias && <p className="mt-1 font-serif text-base italic text-parchment">{alias}</p>}
        {description && (
          <p className="mt-3 font-serif text-base leading-6 text-parchment">{description}</p>
        )}
        {actor && (
          <p className="mt-3 font-sans text-xs leading-5 text-parchment">
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
