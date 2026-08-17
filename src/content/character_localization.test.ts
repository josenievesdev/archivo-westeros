import { describe, expect, test } from 'vitest'
import { DAENERYS_MAIN_RESPONSE } from '../test/fixtures/ice_and_fire_characters'
import { normalizeCharacter } from '../lib/api/ice-and-fire/character_normalizer'
import { enrichCanonicalCharacter } from './character_editorial_metadata'
import {
  createCharacterViewModel,
  localizeCharacterAlias,
  localizeCharacterCulture,
  localizeCharacterTitle,
  localizeChronology,
} from './character_localization'

describe('localización editorial de personajes', () => {
  test('conserva el original junto a la traducción determinista', () => {
    const view = createCharacterViewModel(
      enrichCanonicalCharacter(normalizeCharacter(DAENERYS_MAIN_RESPONSE)),
    )

    expect(view.name).toBe('Daenerys Targaryen')
    expect(view.culture).toEqual({
      original: 'Valyrian',
      value: 'Valyria',
      locale: 'es',
      method: 'dictionary',
    })
    expect(view.aliases.find((alias) => alias.original === 'Mother of Dragons')?.value).toBe(
      'Madre de Dragones',
    )
    expect(view.aliases.filter((alias) => alias.value === 'Madre de Dragones')).toHaveLength(1)
    expect(view.titles.at(-1)?.value).toBe('Princesa de Dragonstone')
    expect(view.born?.value).toBe('En 284 d. C., en Dragonstone')
    expect(view.tvSeries.at(-1)?.value).toBe('Temporada 6')
  })

  test('aplica diccionarios a cultura, alias y título', () => {
    expect(localizeCharacterCulture('Northmen').value).toBe('Norteños')
    expect(localizeCharacterAlias('The Imp').value).toBe('El Gnomo')
    expect(localizeCharacterTitle('Queen Regent').value).toBe('Reina Regente')
  })

  test('traduce patrones cronológicos conocidos y respeta el fallback original', () => {
    expect(localizeChronology('Between 230 AC and 260 AC').value).toBe(
      'Entre 230 y 260 d. C.',
    )
    expect(localizeChronology('Long before the Conquest')).toEqual({
      original: 'Long before the Conquest',
      value: 'Long before the Conquest',
      locale: 'es',
      method: 'original',
    })
    expect(localizeCharacterAlias('Nymeria').value).toBe('Nymeria')
  })
})
