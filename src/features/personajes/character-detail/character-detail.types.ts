import type { HouseTheme } from '../../../components/ui/house-theme'

/**
 * Contrato presentacional de `02 · Ficha de personaje`.
 *
 * La vista no sabe de dónde salen estos datos: no consulta An API of Ice and
 * Fire, no conoce ThronesAPI, no llama a `useCharacterMedia` y no decide qué es
 * spoiler. Recibe un `CharacterDetailViewModel` ya resuelto, ya traducido y ya
 * filtrado, y lo pinta.
 *
 * Quien construya este ViewModel (`CanonicalCharacter` + `CharacterMedia`, más
 * adelante el Spoiler Shield) es responsable de decidir qué campos llegan.
 * Omitir un campo es la forma de ocultar un bloque: la vista no lo inventa.
 */

/** Iconos que la banda de datos sabe pintar, sin atarla a conceptos concretos. */
export type CharacterFactIcon =
  | 'actor'
  | 'birth'
  | 'house'
  | 'region'
  | 'role'
  | 'status'
  | 'title'

/** Iconos disponibles para las acciones del Hero. */
export type CharacterActionIcon = 'compare' | 'house' | 'lineage'

/** Tono de una chapa del Hero. */
export type CharacterBadgeTone = 'alive' | 'default' | 'muted' | 'warning'

/**
 * Tono del hito de la línea de vida y del filete de una relación.
 *
 * Es un tono *editorial*, no un estado vital: la vista no traduce `ember` por
 * «muerto». Quien arma el ViewModel decide qué merece brasa y qué merece hielo.
 */
export type CharacterAccentTone = 'ember' | 'gold' | 'ice' | 'muted'

/** Señal del punto que acompaña a un vínculo. */
export type CharacterRelationSignal = 'known' | 'unknown' | 'watched'

export interface CharacterFact {
  icon?: CharacterFactIcon
  label: string
  value: string
}

export interface CharacterBadge {
  id: string
  label: string
  tone?: CharacterBadgeTone
}

export interface CharacterAction {
  href?: string
  icon?: CharacterActionIcon
  id: string
  label: string
  onClick?: () => void
  /** Ruta interna. Tiene prioridad sobre `href`. */
  to?: string
  /** `primary` es el botón dorado del frame; el resto son de piedra. */
  tone?: 'primary' | 'secondary'
}

export interface CharacterMediaViewModel {
  altText: string
  /** Pie de la imagen, p. ej. `RETRATO · ARCHIVO VISUAL`. */
  caption?: string
  portraitUrl: string
}

export interface CharacterTimelineItem {
  description?: string
  id: string
  /** Marca temporal ya formateada, p. ej. `283 AC`. Puede no existir. */
  label?: string
  title: string
  tone?: CharacterAccentTone
}

export interface CharacterRelation {
  id: string
  /** Iniciales del disco. Sin valor las deriva la vista del nombre. */
  initials?: string
  /** Parentesco o vínculo, p. ej. `Hermano juramentado`. */
  kind?: string
  name: string
  signal?: CharacterRelationSignal
  to?: string
  tone?: CharacterAccentTone
}

/** Fila del panel de familia: una clave y un valor, sin jerarquía implícita. */
export interface CharacterFamilyEntry {
  id: string
  label: string
  tone?: CharacterAccentTone
  value: string
}

export interface CharacterLoyalty {
  id: string
  name: string
  /** Nota al pie, en cursiva bajo la barra. */
  note?: string
  /** Periodo ya formateado, p. ej. `283 – 298 AC`. */
  period?: string
  /** Peso relativo de la lealtad, de 0 a 1. Dibuja el relleno de la barra. */
  strength?: number
  tone?: CharacterAccentTone
}

export interface CharacterSeasonViewModel {
  /** `false` pinta la casilla apagada: la temporada existe pero no está abierta. */
  available?: boolean
  /** Resalta la casilla en oro. */
  current?: boolean
  id: string
  label: string
}

export interface CharacterAmbientViewModel {
  /** Sin `available` el control queda deshabilitado: aquí no suena nada todavía. */
  available?: boolean
  subtitle?: string
  title: string
}

export interface CharacterSectionCopy {
  /** Bajada bajo el título de sección. */
  caption?: string
  title?: string
}

export interface CharacterDetailViewModel {
  ambient?: CharacterAmbientViewModel
  badges?: CharacterBadge[]
  description?: string
  displayName: string
  facts?: CharacterFact[]
  family?: CharacterFamilyEntry[]
  /** Acciones del Hero. Presentacionales: la vista solo enlaza o avisa. */
  actions?: CharacterAction[]
  house?: {
    label: string
    theme?: HouseTheme
    to?: string
  }
  id: string
  loyalties?: CharacterLoyalty[]
  media?: CharacterMediaViewModel
  /** Procedencia impresa junto al rótulo de casa, p. ej. `criado en Winterfell`. */
  origin?: string
  relationships?: CharacterRelation[]
  relationshipsCopy?: CharacterSectionCopy
  /** Lista ya filtrada. El futuro Spoiler Shield decide qué llega hasta aquí. */
  seasons?: CharacterSeasonViewModel[]
  seasonsNote?: string
  /** Alias o segundo nombre, en cursiva bajo el titular. */
  secondaryName?: string
  timeline?: CharacterTimelineItem[]
  timelineCopy?: CharacterSectionCopy
}
