import { Camera } from 'lucide-react'
import { HouseSigil } from '../../../components/ui/HouseSigil'
import type { HouseTheme } from '../../../components/ui/house-theme'
import type { CharacterMediaViewModel } from './character-detail.types'

interface CharacterPortraitProps {
  media?: CharacterMediaViewModel
  theme: HouseTheme
}

/**
 * El bloque derecho del Hero de Pen.
 *
 * Pen dibuja ahí una placa de piedra con el sigilo grabado. Ahora que el
 * archivo tiene retratos, la placa pasa a ser el fondo sobre el que se apoya la
 * imagen: mismas proporciones (620×600 sobre 1440), misma penumbra.
 *
 * El retrato llega por props y nada más. Esta vista no conoce ThronesAPI, no
 * llama a `useCharacterMedia` y no tiene ninguna URL escrita dentro: sin
 * `media` cae en la placa grabada, que es un fallback con intención, no un
 * icono roto.
 */
export function CharacterPortrait({ media, theme }: CharacterPortraitProps) {
  return (
    <div className="character-detail__portrait">
      <div aria-hidden="true" className="character-detail__plate" />

      {media ? (
        <img
          alt={media.altText}
          className="character-detail__portrait-image"
          decoding="async"
          loading="lazy"
          src={media.portraitUrl}
        />
      ) : (
        <div aria-hidden="true" className="character-detail__engraving">
          <HouseSigil decorative house={theme} size={260} />
        </div>
      )}

      {/* Integración, no filtro: la cara no se toca. Solo se apoya la imagen en
          la penumbra de la escena para que no parezca pegada encima. */}
      <div aria-hidden="true" className="character-detail__tint" />
      <div aria-hidden="true" className="character-detail__veil" />
      <div aria-hidden="true" className="character-detail__edge" />

      {media?.caption && (
        <p className="character-detail__portrait-caption">
          <Camera aria-hidden="true" className="size-3" />
          {media.caption}
        </p>
      )}
    </div>
  )
}
