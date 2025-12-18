import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import styles from './Checkbox.module.scss'

type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  disabled?: boolean
}

export function Checkbox({ checked, onChange, label, disabled }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    onChange(e.target.checked)
  }

  return (
    <label className={cn(styles.wrapper, disabled && styles.disabled)}>
      <input
        className={styles.input}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
      <span className={cn(styles.box, checked && styles.checked)} aria-hidden="true">
        {checked ? <Check size={12} /> : null}
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  )
}
