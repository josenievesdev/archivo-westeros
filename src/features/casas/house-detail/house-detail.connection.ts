import { getHouseThemeFromName } from '../../../components/ui/house-theme'
import type { CanonicalHouse } from '../../../lib/domain/canonical_entities'
import type { HouseDetailViewModel } from './house-detail.types'

/**
 * COSTURA ENTRE LA CAPA DE DATOS Y LA FICHA.
 *
 * Traduce la entidad canónica a lo que la vista sabe pintar. `HouseDetailView`
 * no conoce `CanonicalHouse`, ni la API, ni TanStack Query: solo este módulo
 * sabe de ambos lados.
 */

/** `House Targaryen of King's Landing` → `House Targaryen`. */
function toDisplayName(name: string): string {
  return name.replace(/\s+of\s+.+$/i, '').trim() || name
}

/** `House Targaryen` → `Targaryen`, que es lo que titula el Hero. */
function toShortName(displayName: string): string {
  return displayName.replace(/^house\s+/i, '').trim() || displayName
}

export function toHouseDetailViewModel(house: CanonicalHouse): HouseDetailViewModel {
  const displayName = toDisplayName(house.name)

  return {
    // `currentLordId` es un ID canónico, no un nombre: resolverlo exige otra
    // consulta y es trabajo de la capa de datos, no de la vista.
    currentHead: undefined,
    displayName,
    founded: house.founded ?? undefined,
    heraldry: house.coatOfArms
      ? { colors: [], description: house.coatOfArms }
      : undefined,
    id: house.id,
    // Liderazgo, miembros y juramentadas llegan como IDs canónicos. Hasta que
    // la capa de datos los resuelva a entidades, la vista muestra sus estados
    // vacíos, que ya están diseñados para esto.
    leadership: [],
    members: [],
    membersCount: house.swornMemberIds.length || undefined,
    motto: house.words ?? undefined,
    name: toShortName(displayName),
    region: house.region ?? undefined,
    regionCaption: house.seats.join(' · ') || house.region || undefined,
    seat: house.seats[0],
    statusLabel: house.diedOut ? 'Linaje extinto' : undefined,
    statusTone: house.diedOut ? 'extinct' : undefined,
    swornHouses: [],
    swornHousesCount: house.cadetBranchIds.length || undefined,
    // Fuera de las siete grandes casas no hay tema: cae a la piedra fría de
    // Stark, el más neutro de la paleta, en vez de teñir con un color ajeno.
    theme: getHouseThemeFromName(house.name) ?? 'stark',
    words: house.words ?? undefined,
  }
}
