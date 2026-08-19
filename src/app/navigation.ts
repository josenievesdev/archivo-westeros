export const desktopNavigation = [
  { label: 'Personajes', to: '/personajes' },
  { label: 'Casas', to: '/casas' },
  { label: 'Linajes', to: '/linajes' },
  { label: 'Mesa de guerra', to: '/mesa-de-guerra' },
  { label: 'Mapa', to: '/mapa' },
  { label: 'Cronología', to: '/cronologia' },
] as const

export const moreNavigation = [
  {
    description: 'Explora los vínculos familiares cuando la experiencia esté disponible.',
    label: 'Linajes',
    to: '/linajes',
  },
  {
    description: 'Consulta regiones y recorridos en una fase posterior.',
    label: 'Mapa',
    to: '/mapa',
  },
  {
    description: 'Ordena hechos y periodos sin perder el contexto narrativo.',
    label: 'Cronología',
    to: '/cronologia',
  },
  {
    description: 'Accede al espacio estratégico reservado para las grandes casas.',
    label: 'Mesa de guerra',
    to: '/mesa-de-guerra',
  },
] as const
