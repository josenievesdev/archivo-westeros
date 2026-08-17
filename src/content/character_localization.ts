import type {
  CanonicalCharacter,
  CharacterViewModel,
  LocalizedValue,
} from '../lib/domain/canonical_entities'

const CULTURE_TRANSLATIONS: Readonly<Record<string, string>> = {
  andal: 'Ándala',
  andals: 'Ándalos',
  dornish: 'Dorniense',
  'free folk': 'Pueblo Libre',
  ironborn: 'Hijos del Hierro',
  northmen: 'Norteños',
  valyrian: 'Valyria',
}

const TITLE_TRANSLATIONS: Readonly<Record<string, string>> = {
  'acting hand of the king': 'Mano del Rey en funciones',
  'arya underfoot': 'Arya Entremetida',
  "lord commander of the night's watch": 'Lord Comandante de la Guardia de la Noche',
  'breaker of shackles/chains': 'Rompedora de Cadenas',
  'khaleesi of the great grass sea': 'Khaleesi del Gran Mar de Hierba',
  'mother of dragons': 'Madre de Dragones',
  princess: 'Princesa',
  'princess of dragonstone': 'Princesa de Dragonstone',
  'queen of meereen': 'Reina de Meereen',
  'queen regent': 'Reina Regente',
  'queen of the andals and the rhoynar and the first men, lord of the seven kingdoms':
    'Reina de los Ándalos, los Rhoynar y los Primeros Hombres, Señora de los Siete Reinos',
  'the imp': 'El Gnomo',
}

const ALIAS_TRANSLATIONS: Readonly<Record<string, string>> = {
  'arya underfoot': 'Arya Entremetida',
  dragonmother: 'Madre de Dragones',
  halfman: 'Mediohombre',
  'light of the west': 'Luz del Oeste',
  'lord crow': 'Lord Cuervo',
  'mother of dragons': 'Madre de Dragones',
  "ned stark's bastard": 'Bastardo de Ned Stark',
  'silver lady': 'Dama de Plata',
  'the bastard of winterfell': 'El Bastardo de Winterfell',
  'the black bastard of the wall': 'El Bastardo Negro del Muro',
  'the dragon queen': 'Reina Dragón',
  'the imp': 'El Gnomo',
  "the mad king's daughter": 'Hija del Rey Loco',
  'the silver queen': 'Reina de Plata',
  'the unburnt': 'La que no arde',
}

function normalizeDictionaryKey(value: string) {
  return value.trim().toLocaleLowerCase('en')
}

function uniqueLocalizedValues(values: LocalizedValue<string>[]) {
  const seen = new Set<string>()

  return values.filter((value) => {
    const normalized = normalizeDictionaryKey(value.value)
    if (seen.has(normalized)) {
      return false
    }

    seen.add(normalized)
    return true
  })
}

function originalValue(value: string): LocalizedValue<string> {
  return {
    original: value,
    value,
    locale: 'es',
    method: 'original',
  }
}

function localizeFromDictionary(
  value: string,
  translations: Readonly<Record<string, string>>,
): LocalizedValue<string> {
  const translated = translations[normalizeDictionaryKey(value)]

  return translated
    ? { original: value, value: translated, locale: 'es', method: 'dictionary' }
    : originalValue(value)
}

export function localizeCharacterCulture(value: string): LocalizedValue<string> {
  return localizeFromDictionary(value, CULTURE_TRANSLATIONS)
}

export function localizeCharacterTitle(value: string): LocalizedValue<string> {
  return localizeFromDictionary(value, TITLE_TRANSLATIONS)
}

export function localizeCharacterAlias(value: string): LocalizedValue<string> {
  return localizeFromDictionary(value, ALIAS_TRANSLATIONS)
}

export function localizeCharacterGender(value: string): LocalizedValue<string> {
  const translations: Readonly<Record<string, string>> = {
    female: 'Femenino',
    male: 'Masculino',
  }

  return localizeFromDictionary(value, translations)
}

export function localizeChronology(value: string): LocalizedValue<string> {
  const patterns: ReadonlyArray<{
    expression: RegExp
    format: (match: RegExpMatchArray) => string
  }> = [
    {
      expression: /^In (\d+) AC(?:, at (.+))?$/i,
      format: (match) => `En ${match[1]} d. C.${match[2] ? `, en ${match[2]}` : ''}`,
    },
    {
      expression: /^In or around (\d+) AC(?:, at (.+))?$/i,
      format: (match) =>
        `Alrededor de ${match[1]} d. C.${match[2] ? `, en ${match[2]}` : ''}`,
    },
    {
      expression: /^In or before (\d+) AC$/i,
      format: (match) => `En ${match[1]} d. C. o antes`,
    },
    {
      expression: /^In or after (\d+) AC$/i,
      format: (match) => `En ${match[1]} d. C. o después`,
    },
    {
      expression: /^Between (\d+) AC and (\d+) AC$/i,
      format: (match) => `Entre ${match[1]} y ${match[2]} d. C.`,
    },
    {
      expression: /^At some point between (\d+) AC and (\d+) AC$/i,
      format: (match) => `En algún momento entre ${match[1]} y ${match[2]} d. C.`,
    },
  ]

  for (const pattern of patterns) {
    const match = value.match(pattern.expression)
    if (match) {
      return {
        original: value,
        value: pattern.format(match),
        locale: 'es',
        method: 'pattern',
      }
    }
  }

  return originalValue(value)
}

export function localizeSeason(value: string): LocalizedValue<string> {
  const match = value.match(/^Season (\d+)$/i)

  return match
    ? {
        original: value,
        value: `Temporada ${match[1]}`,
        locale: 'es',
        method: 'pattern',
      }
    : originalValue(value)
}

export function createCharacterViewModel(
  character: CanonicalCharacter,
): CharacterViewModel {
  const aliases = uniqueLocalizedValues(character.aliases.map(localizeCharacterAlias))
  const titles = uniqueLocalizedValues(character.titles.map(localizeCharacterTitle))
  const culture = character.culture
    ? localizeCharacterCulture(character.culture)
    : null
  const born = character.born ? localizeChronology(character.born) : null
  const died = character.died ? localizeChronology(character.died) : null
  const featured = character.editorial?.featured ?? null
  const featuredTitle = featured ? localizeCharacterTitle(featured.title) : null
  const name =
    character.name || character.editorial?.preferredName || aliases[0]?.value || 'Sin nombre conocido'
  const summary = aliases[0]?.value || culture?.value || 'Personaje registrado'
  const disambiguationParts = [
    character.playedBy[0],
    born?.value,
    titles[0]?.value,
    aliases[0]?.value,
    character.tvSeries.at(-1) ? localizeSeason(character.tvSeries.at(-1)!).value : null,
  ].filter((value): value is string => Boolean(value))

  return {
    id: character.id,
    source: character.source,
    name,
    gender: character.gender ? localizeCharacterGender(character.gender) : null,
    culture,
    born,
    died,
    titles,
    aliases,
    tvSeries: character.tvSeries.map(localizeSeason),
    playedBy: [...character.playedBy],
    featuredTitle,
    houseLabel: featured?.houseLabel ?? null,
    houseTheme: featured?.houseTheme ?? null,
    summary,
    disambiguation: disambiguationParts.slice(0, 2).join(' · ') || summary,
  }
}
