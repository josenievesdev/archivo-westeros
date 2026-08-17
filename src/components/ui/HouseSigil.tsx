import {
  Anchor,
  Crown,
  Flame,
  Flower2,
  Snowflake,
  Sun,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { HTMLAttributes } from 'react'
import { cx } from '../../lib/utils/cx'
import type { HouseTheme } from './house-theme'

const houseNames: Record<HouseTheme, string> = {
  stark: 'Stark',
  lannister: 'Lannister',
  targaryen: 'Targaryen',
  baratheon: 'Baratheon',
  greyjoy: 'Greyjoy',
  tyrell: 'Tyrell',
  martell: 'Martell',
}

const houseIcons: Record<HouseTheme, LucideIcon> = {
  stark: Snowflake,
  lannister: Crown,
  targaryen: Flame,
  baratheon: Zap,
  greyjoy: Anchor,
  tyrell: Flower2,
  martell: Sun,
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
      aria-label={decorative ? undefined : (label ?? `Símbolo de la casa ${houseNames[house]}`)}
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
