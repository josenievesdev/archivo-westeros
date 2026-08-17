import { resolveHouseTheme } from '../../../components/ui/house-theme'
import type {
  CanonicalCharacter,
  CanonicalHouse,
} from '../../../lib/domain/canonical_entities'
import type { HouseDataBundle } from '../../../lib/domain/house_types'
import type {
  HouseDetailViewModel,
  HouseMemberViewModel,
  HouseRelationViewModel,
} from './house-detail.types'

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

function getCharacterName(character: CanonicalCharacter) {
  return character.name || character.aliases[0] || 'Sin nombre conocido'
}

function toCharacterRelation(
  character: CanonicalCharacter | null,
): HouseRelationViewModel | undefined {
  return character
    ? {
        id: character.id,
        name: getCharacterName(character),
        to: `/personajes/${character.source.externalId}`,
      }
    : undefined
}

function toHouseRelation(
  house: CanonicalHouse | null,
): HouseRelationViewModel | undefined {
  return house
    ? {
        id: house.id,
        name: house.name,
        to: `/casas/${house.source.externalId}`,
      }
    : undefined
}

function toMember(character: CanonicalCharacter): HouseMemberViewModel {
  return {
    alias: character.name ? character.aliases[0] : undefined,
    id: character.id,
    name: getCharacterName(character),
    to: `/personajes/${character.source.externalId}`,
  }
}

export function toHouseDetailViewModel(
  bundle: HouseDataBundle,
): HouseDetailViewModel {
  const { house } = bundle
  const displayName = toDisplayName(house.name)
  const currentLord = toCharacterRelation(bundle.currentLord)

  return {
    cadetBranches: bundle.cadetBranches.map((branch) =>
      toHouseRelation(branch),
    ).filter((branch): branch is HouseRelationViewModel => branch !== undefined),
    currentHead: currentLord?.name,
    currentLord,
    displayName,
    founder: toCharacterRelation(bundle.founder),
    founded: house.founded ?? undefined,
    heraldry: house.coatOfArms
      ? { colors: [], description: house.coatOfArms }
      : undefined,
    heir: toCharacterRelation(bundle.heir),
    id: house.id,
    // La vista presenta una cronología; founder/currentLord/heir no forman una.
    leadership: [],
    members: bundle.swornMembers.slice(0, 4).map(toMember),
    membersCount: bundle.counts.swornMembersTotal || undefined,
    motto: house.words ?? undefined,
    name: toShortName(displayName),
    overlord: toHouseRelation(bundle.overlord),
    region: house.region ?? undefined,
    regionCaption: house.seats.join(' · ') || house.region || undefined,
    seat: house.seats[0],
    statusLabel: house.diedOut ? 'Linaje extinto' : undefined,
    statusTone: house.diedOut ? 'extinct' : undefined,
    // `cadetBranches` y `overlord` no son casas juramentadas.
    swornHouses: [],
    // Fuera de las siete grandes casas la ficha se pinta en piedra: una casa
    // menor no hereda la identidad visual de otra.
    theme: bundle.metadata?.themeKey ?? resolveHouseTheme(house.name),
    words: house.words ?? undefined,
  }
}
