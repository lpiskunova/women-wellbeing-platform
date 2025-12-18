import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import styles from './SensitiveContentBanner.module.scss'

export function SensitiveContentBanner({
  message,
  defaultHidden = false,
}: {
  message: string
  defaultHidden?: boolean
}) {
  const [hidden, setHidden] = useState(defaultHidden)
  if (hidden) return null

  return (
    <div className={styles.banner}>
      <AlertTriangle className={styles.icon} aria-hidden="true" />
      <p className={styles.text}>{message}</p>
      <button
        type="button"
        className={styles.close}
        aria-label="Dismiss sensitive content notice"
        onClick={() => setHidden(true)}
      >
        <X size={14} />
      </button>
    </div>
  )
}
