import React from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './Badge.module.scss'

type Variant = 'default' | 'subtle'

export function Badge({
  variant = 'default',
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return <span className={cn(styles.badge, styles[variant], className)} {...props} />
}
