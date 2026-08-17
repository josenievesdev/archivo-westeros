import type { StatusBadgeState } from '../../../components/ui/Badge'
import type { HouseTheme } from '../../../components/ui/house-theme'

/**
 * Contrato presentacional de `03 · Ficha de casa`.
 *
 * La vista no sabe de dónde vienen estos datos: los recibe ya normalizados y
 * traducidos. La capa de datos (API + entidades canónicas) construirá este
 * ViewModel y lo pasará por props.
 */

/** Cargas heráldicas disponibles para las casas juramentadas. */
export type SwornHouseSigil =
  | 'anchor'
  | 'crown'
  | 'flame'
  | 'shield'
  | 'snowflake'
  | 'sun'
  | 'swords'
  | 'waves'

/** Tono del filete que abre cada registro de liderazgo. */
export type HouseLeaderTone = 'gold' | 'ember' | 'bronze'

export interface HouseMemberViewModel {
  alias?: string
  /** Rótulo de casa impreso sobre el nombre, p. ej. `HOUSE TARGARYEN`. */
  houseLabel?: string
  id: string
  name: string
  status?: {
    label?: string
    state: StatusBadgeState
  }
  /** Ruta interna a la ficha del personaje. Sin ruta la tarjeta no enlaza. */
  to?: string
}

export interface HouseLeaderViewModel {
  description?: string
  /** Apodo con el que se le recuerda, p. ej. `el Conquistador`. */
  epithet?: string
  id: string
  name: string
  /** Periodo ya formateado, p. ej. `1 – 37 AC`. */
  period?: string
  tone?: HouseLeaderTone
}

export interface SwornHouseViewModel {
  /** Tinte de la carga heráldica. Sin valor cae al acento de la casa. */
  accent?: string
  id: string
  name: string
  /** Sede o asentamiento principal. */
  seat?: string
  sigil?: SwornHouseSigil
  to?: string
}

export interface HeraldryColorViewModel {
  /** Nombre heráldico de la tinta, p. ej. `Sangre`. */
  name: string
  /** Color CSS resuelto. */
  value: string
}

export interface HouseHeraldryViewModel {
  colors: HeraldryColorViewModel[]
  /** Blasón en lenguaje heráldico. */
  description?: string
}

export interface HouseRelationViewModel {
  id: string
  name: string
  to?: string
}

export interface HouseDetailViewModel {
  /** Ramas cadete resueltas. No equivalen a casas juramentadas. */
  cadetBranches?: HouseRelationViewModel[]
  /** Descripción larga bajo el lema. */
  description?: string
  /** Nombre completo para migas y rótulos, p. ej. `House Targaryen`. */
  displayName: string
  /** Año o era de fundación, ya formateado. */
  founded?: string
  heraldry?: HouseHeraldryViewModel
  id: string
  leadership: HouseLeaderViewModel[]
  members: HouseMemberViewModel[]
  /** Número de miembros registrados en el archivo. */
  membersCount?: number
  /** Lema mostrado en el Hero, ya entrecomillado por la vista. */
  motto?: string
  /** Nombre corto para el titular, p. ej. `Targaryen`. */
  name: string
  /** Región histórica de la casa. */
  region?: string
  /** Pie de la pieza del Hero, p. ej. `Dragonstone · King's Landing`. */
  regionCaption?: string
  /** Asentamiento principal. */
  seat?: string
  /** Etiqueta de estado del linaje, p. ej. `Linaje extinto`. */
  statusLabel?: string
  /** `extinct` pinta el punto y el marco en tono sangre. */
  statusTone?: 'active' | 'extinct'
  swornHouses: SwornHouseViewModel[]
  swornHousesCount?: number
  theme: HouseTheme
  /** Palabras de la casa para la banda de datos. */
  words?: string
  /** Última cabeza conocida de la casa. */
  currentHead?: string
  currentLord?: HouseRelationViewModel
  heir?: HouseRelationViewModel
  founder?: HouseRelationViewModel
  overlord?: HouseRelationViewModel
}
