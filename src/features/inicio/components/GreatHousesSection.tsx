import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HousePiece } from '../../../components/ui/HousePiece'
import { GREAT_HOUSES, type GreatHouseConfig } from '../config/home-content'

function HousePieceLink({ house, size }: { house: GreatHouseConfig; size: 'compact' | 'standard' }) {
  return (
    <Link
      aria-label={`Abrir la ficha de la casa ${house.name}`}
      className="great-house-link"
      data-house={house.theme}
      to={`/casas/${house.id}`}
    >
      <HousePiece
        house={house.theme}
        motto={size === 'standard' ? `“${house.motto}”` : undefined}
        name={house.name}
        region={house.region}
        size={size}
      />
    </Link>
  )
}

export function GreatHousesSection() {
  const leadingHouses = GREAT_HOUSES.slice(0, 4)
  const supportingHouses = GREAT_HOUSES.slice(4)

  return (
    <section aria-labelledby="great-houses-title" className="great-houses-section">
      <header className="great-houses-header">
        <p className="home-eyebrow">Mesa de guerra</p>
        <h2 id="great-houses-title">Las Grandes Casas</h2>
        <p>
          Cada pieza es un linaje. Pesan siglos de sangre, juramentos y alianzas.
          Elige una y entra en su archivo.
        </p>
      </header>

      <div className="great-houses-board" role="list">
        <div className="great-houses-board__back">
          {supportingHouses.map((house) => (
            <div key={house.id} role="listitem">
              <HousePieceLink house={house} size="compact" />
            </div>
          ))}
        </div>
        <div className="great-houses-board__front">
          {leadingHouses.map((house) => (
            <div key={house.id} role="listitem">
              <HousePieceLink house={house} size="standard" />
            </div>
          ))}
        </div>
      </div>

      <div className="great-houses-mobile" role="list">
        {GREAT_HOUSES.map((house) => (
          <div key={house.id} role="listitem">
            <HousePieceLink house={house} size="compact" />
          </div>
        ))}
      </div>

      <footer className="great-houses-footer">
        <p>Siete casas mayores. El resto espera en el archivo.</p>
        <Link className="home-outline-link" to="/casas">
          Ver todas las casas
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      </footer>
    </section>
  )
}
