import './house-detail.css'
import '../../inicio/styles/home.css'
import { HomeFooter } from '../../inicio/components/HomeFooter'
import { HouseFacts } from './HouseFacts'
import { HouseHeraldryPanel } from './HouseHeraldryPanel'
import { HouseHero } from './HouseHero'
import { HouseLeadership } from './HouseLeadership'
import { HouseMembers } from './HouseMembers'
import { SwornHousesPanel } from './SwornHousesPanel'
import type { HouseDetailViewModel } from './house-detail.types'

interface HouseDetailViewProps {
  house: HouseDetailViewModel
}

/**
 * `03 · Ficha de casa`, puramente presentacional.
 *
 * No consulta la API, no conoce TanStack Query y no normaliza nada: recibe un
 * `HouseDetailViewModel` ya resuelto y lo pinta. `data-house` propaga el tema
 * de la casa a todos los descendientes, de modo que la misma estructura sirve
 * a las siete casas cambiando solo la atmósfera.
 */
export function HouseDetailView({ house }: HouseDetailViewProps) {
  return (
    <div className="house-detail" data-house={house.theme}>
      <HouseHero house={house} />
      <HouseFacts house={house} />

      <div className="house-detail-width house-detail__body">
        <div className="house-detail__main">
          <HouseMembers members={house.members} theme={house.theme} />
          <HouseLeadership leadership={house.leadership} />
        </div>

        <div className="house-detail__aside">
          <SwornHousesPanel houses={house.swornHouses} />
          {house.heraldry && (
            <HouseHeraldryPanel heraldry={house.heraldry} theme={house.theme} />
          )}
        </div>
      </div>

      <HomeFooter />
    </div>
  )
}
