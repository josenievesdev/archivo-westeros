const defaultApiUrl = 'https://anapioficeandfire.com/api'
const defaultThronesApiUrl = 'https://thronesapi.com/api/v2'

export const iceAndFireApiUrl = (
  import.meta.env.VITE_ICE_AND_FIRE_API_URL || defaultApiUrl
).replace(/\/$/, '')

export const thronesApiUrl = (
  import.meta.env.VITE_THRONES_API_URL || defaultThronesApiUrl
).replace(/\/$/, '')
