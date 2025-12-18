import React from 'react'
import { cn } from '@/shared/lib/cn'
import styles from './Input.module.scss'

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(styles.input, className)} {...props} />
}
