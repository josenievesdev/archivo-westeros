const defaultApiUrl = 'https://anapioficeandfire.com/api'

export const iceAndFireApiUrl = (
  import.meta.env.VITE_ICE_AND_FIRE_API_URL || defaultApiUrl
).replace(/\/$/, '')
