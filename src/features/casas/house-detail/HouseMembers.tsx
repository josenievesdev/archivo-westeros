import { CharacterCard } from '../../../components/ui/CharacterCard'
import type { HouseTheme } from '../../../components/ui/house-theme'
import type { HouseMemberViewModel } from './house-detail.types'

interface HouseMembersProps {
  members: HouseMemberViewModel[]
  theme: HouseTheme
}

export function HouseMembers({ members, theme }: HouseMembersProps) {
  return (
    <section aria-labelledby="miembros-relevantes" className="house-detail__members">
      <header className="house-detail__section-head">
        <div>
          <h2 id="miembros-relevantes">Miembros relevantes</h2>
          <i aria-hidden="true" />
        </div>
        <p>Los que llevaron el nombre cuando importaba.</p>
      </header>

      {members.length === 0 ? (
        <p className="house-detail__empty">
          Todavía no hay miembros registrados para esta casa en el archivo.
        </p>
      ) : (
        <div className="house-detail__members-grid">
          {members.map((member) => (
            <CharacterCard
              alias={member.alias}
              house={member.houseLabel}
              houseTheme={theme}
              key={member.id}
              name={member.name}
              status={member.status}
              to={member.to}
              variant="house-member"
            />
          ))}
        </div>
      )}
    </section>
  )
}
