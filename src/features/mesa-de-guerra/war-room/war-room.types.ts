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

/** Peso visual de una cifra dentro de la fila. */
export type WarRoomFigureTone = 'default' | 'accent' | 'muted'

/**
 * Una cifra genérica de la fila que Pen imprime bajo cada pieza.
 *
 * A propósito no modela estado de casa, supervivientes ni resultado de guerras:
 * mientras no exista Spoiler Shield, el contrato no debe obligar a nadie a
 * suministrar métricas que revelan acontecimientos futuros. Quien construya el
 * ViewModel decide qué dimensiones puede mostrar según los datos reales, el
 * criterio activo y el nivel de protección de spoilers.
 */
export interface WarRoomFigureViewModel {
  /**
   * Dimensión que representa la cifra, p. ej. `Miembros`. No se imprime: sirve
   * para identificarla y para que quien conecte datos sepa qué está mapeando.
   */
  label: string
  /** Texto ya redactado que se imprime, p. ej. `48 miembros`. */
  value: string | number
  tone?: WarRoomFigureTone
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
  /** Cifras impresas bajo el rótulo, en el orden en que deben leerse. */
  figures?: WarRoomFigureViewModel[]
  /** Ruta interna a la ficha. Sin ruta la pieza no enlaza. */
  to?: string
}

export interface WarRoomViewModel {
  eyebrow: string
  title: string
  description: string
  houses: WarRoomHouseViewModel[]
}
