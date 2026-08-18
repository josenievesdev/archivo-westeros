import type { HouseTheme } from '../../../components/ui/house-theme'

/**
 * Contrato presentacional de `04 · Sala de estrategia`.
 *
 * La vista no sabe de dónde salen estos datos: los recibe resueltos, traducidos
 * y ordenados. Quien conecte la capa real (entidades canónicas + API) construirá
 * este ViewModel y lo pasará por props.
 */

/** Criterios con los que se pesa el tablero. Son los cuatro rótulos de Pen. */
export const WAR_ROOM_CRITERIA = ['poder', 'miembros', 'antiguedad', 'territorio'] as const

export type WarRoomCriterion = (typeof WAR_ROOM_CRITERIA)[number]

/**
 * Disposición de las piezas.
 *
 * `board` es la formación de Pen (4 + 3 sobre dos mesas). `list` alinea las
 * siete en una sola columna, que es la lectura que ya usa el móvil.
 */
export type WarRoomLayout = 'board' | 'list'

/** Estado de la casa en el tablero: en pie, diezmada o extinta. */
export type WarRoomStanding = 'standing' | 'decimated' | 'extinct'

/**
 * La fila de cifras que Pen imprime bajo cada pieza.
 *
 * Son textos ya formateados porque la vista no decide plurales ni idioma. El
 * criterio activo ordena las piezas fuera de aquí; estas cifras no cambian.
 */
export interface WarRoomFiguresViewModel {
  /** p. ej. `48 miembros`. */
  members?: string
  /** p. ej. `11 vivos`. */
  alive?: string
  standing?: {
    label: string
    state: WarRoomStanding
  }
}

export interface WarRoomHouseViewModel {
  /** Identidad estable de la pieza dentro de la vista. */
  id: string
  /** Nombre corto grabado en el pedestal, p. ej. `Stark`. */
  displayName: string
  /** Tema heráldico con el que se pinta la pieza. */
  theme: HouseTheme
  /** Lema, ya entrecomillado por quien construye el ViewModel si procede. */
  words?: string
  /** Región y sede, p. ej. `The North · Winterfell`. */
  region?: string
  figures?: WarRoomFiguresViewModel
  /** Ruta interna a la ficha. Sin ruta la pieza no enlaza. */
  to?: string
}

export interface WarRoomViewModel {
  eyebrow: string
  title: string
  description: string
  houses: WarRoomHouseViewModel[]
}
