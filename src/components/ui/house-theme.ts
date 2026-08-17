export const HOUSE_THEMES = [
  'stark',
  'lannister',
  'targaryen',
  'baratheon',
  'greyjoy',
  'tyrell',
  'martell',
] as const

export type HouseTheme = (typeof HOUSE_THEMES)[number]

export function getHouseThemeFromName(name: string): HouseTheme | undefined {
  const normalizedName = name.toLocaleLowerCase('en')
  return HOUSE_THEMES.find((house) => normalizedName.includes(house))
}
