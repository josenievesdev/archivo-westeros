import {
  Anchor,
  Crown,
  Flame,
  Flower2,
  Shield,
  Snowflake,
  Sun,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { HTMLAttributes } from 'react'
import { cx } from '../../lib/utils/cx'
import type { HouseTheme } from './house-theme'

const houseLabels: Record<HouseTheme, string> = {
  stark: 'Símbolo de la casa Stark',
  lannister: 'Símbolo de la casa Lannister',
  targaryen: 'Símbolo de la casa Targaryen',
  baratheon: 'Símbolo de la casa Baratheon',
  greyjoy: 'Símbolo de la casa Greyjoy',
  tyrell: 'Símbolo de la casa Tyrell',
  martell: 'Símbolo de la casa Martell',
  // Ni el nombre ni el dibujo prestan identidad: es un escudo vacío.
  neutral: 'Emblema genérico de casa',
}

const houseIcons: Record<HouseTheme, LucideIcon> = {
  stark: Snowflake,
  lannister: Crown,
  targaryen: Flame,
  baratheon: Zap,
  greyjoy: Anchor,
  tyrell: Flower2,
  martell: Sun,
  // Escudo sin carga: marca que la casa existe sin inventarle armas.
  neutral: Shield,
}

interface HouseSigilProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  decorative?: boolean
  house: HouseTheme
  label?: string
  size?: number
}

export function HouseSigil({
  className,
  decorative = false,
  house,
  label,
  size = 24,
  style,
  ...props
}: HouseSigilProps) {
  const Icon = houseIcons[house]

  return (
    <span
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : (label ?? houseLabels[house])}
      className={cx('house-sigil', className)}
      data-house={house}
      role={decorative ? undefined : 'img'}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <Icon aria-hidden="true" size={size} />
    </span>
  )
}
