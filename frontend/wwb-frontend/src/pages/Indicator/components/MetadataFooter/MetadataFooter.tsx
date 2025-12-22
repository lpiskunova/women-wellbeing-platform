import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

import styles from './MetadataFooter.module.scss'

type Props = {
  source: string
  updated: string
}

export function MetadataFooter({ source, updated }: Props) {
  return (
    <div className={styles.metaFooter}>
      <div className={styles.metaLeft}>
        <span>
          <strong>Source:</strong> {source}
        </span>
        <span>
          <strong>Updated:</strong> {updated}
        </span>
      </div>
      <div className={styles.metaLinks}>
        <Link to="/docs#methodology" className={styles.metaLink}>
          Methodology <ExternalLink size={14} />
        </Link>
        <Link to="/docs#limitations" className={styles.metaLink}>
          Limitations <ExternalLink size={14} />
        </Link>
        <Link to="/docs#how-to-read" className={styles.metaLink}>
          How to read <ExternalLink size={14} />
        </Link>
      </div>
    </div>
  )
}
