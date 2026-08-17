import type { HTMLAttributes } from 'react'
import { cx } from '../../lib/utils/cx'

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('archive-container', className)} {...props} />
}
