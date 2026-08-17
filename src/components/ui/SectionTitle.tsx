import type { HTMLAttributes } from 'react'
import { cx } from '../../lib/utils/cx'

type HeadingElement = 'h1' | 'h2' | 'h3'
type SectionTitleSize = 'page' | 'section'

interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center'
  description?: string
  eyebrow?: string
  headingAs?: HeadingElement
  headingId?: string
  size?: SectionTitleSize
  title: string
}

const titleSizes: Record<SectionTitleSize, string> = {
  page: 'text-[clamp(2.25rem,10vw,4.5rem)] leading-[1.05] tracking-[-0.02em]',
  section: 'text-[clamp(1.75rem,6vw,2.375rem)] leading-[1.15]',
}

export function SectionTitle({
  align = 'left',
  className,
  description,
  eyebrow,
  headingAs: Heading = 'h2',
  headingId,
  size = 'section',
  title,
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cx(
        'space-y-3',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
      {...props}
    >
      {eyebrow && (
        <p className="font-sans text-[0.6875rem] uppercase tracking-[0.24em] text-gold">
          {eyebrow}
        </p>
      )}
      <Heading
        className={cx('font-display font-semibold text-bone', titleSizes[size])}
        id={headingId}
      >
        {title}
      </Heading>
      {description && (
        <p className="max-w-2xl font-serif text-lg leading-7 text-parchment sm:text-xl sm:leading-8">
          {description}
        </p>
      )}
    </div>
  )
}
