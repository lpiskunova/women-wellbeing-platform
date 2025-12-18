import React from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './Button.module.scss'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  asChild?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  asChild = false,
  className,
  children,
  ...props
}: Props) {
  const cls = cn(styles.btn, styles[variant], styles[size], className)

  if (asChild && React.isValidElement(children)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const child = children as React.ReactElement<any>
    return React.cloneElement(child, {
      className: cn(cls, child.props.className),
    })
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}
