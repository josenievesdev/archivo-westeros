/**
 * Las siete grandes casas con identidad heráldica propia.
 *
 * Esta lista es además el diccionario con el que se detecta la casa a partir de
 * su nombre, así que solo debe contener casas cuyo nombre aparezca literalmente
 * en los datos de origen.
 */
export const HOUSE_THEMES = [
  'stark',
  'lannister',
  'targaryen',
  'baratheon',
  'greyjoy',
  'tyrell',
  'martell',
] as const

export type GreatHouseTheme = (typeof HOUSE_THEMES)[number]

/**
 * Tema de las casas menores o desconocidas: piedra oscura y oro viejo muy
 * contenido. No toma prestada la heráldica de ninguna gran casa.
 */
export const NEUTRAL_HOUSE_THEME = 'neutral'

/** Cualquier tema que un componente sepa pintar. */
export type HouseTheme = GreatHouseTheme | typeof NEUTRAL_HOUSE_THEME

/**
 * Detecta una de las siete grandes casas por su nombre.
 *
 * Devuelve `undefined` cuando no hay coincidencia: quien llama decide si eso
 * significa «no pintes sigilo» o «pinta el tema neutro». No lo cambies para que
 * devuelva `neutral`, porque hay vistas que distinguen ambos casos.
 */
export function getHouseThemeFromName(name: string): GreatHouseTheme | undefined {
  const normalizedName = name.toLocaleLowerCase('en')
  return HOUSE_THEMES.find((house) => normalizedName.includes(house))
}

/**
 * Resuelve el tema con el que se pinta una ficha de casa completa.
 *
 * A diferencia de `getHouseThemeFromName`, aquí siempre hay respuesta: una casa
 * menor cae en `neutral` en lugar de heredar la identidad de otra casa.
 */
export function resolveHouseTheme(name: string): HouseTheme {
  return getHouseThemeFromName(name) ?? NEUTRAL_HOUSE_THEME
}
