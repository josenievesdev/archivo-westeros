export const apiEndpoints = {
  characters: '/characters',
  character: (id: string) => `/characters/${encodeURIComponent(id)}`,
  houses: '/houses',
  house: (id: string) => `/houses/${encodeURIComponent(id)}`,
} as const
