import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import styles from './NotFoundPage.module.scss'
import { NOT_FOUND_COPY, NOT_FOUND_LINKS } from './entities/notFound.constants'

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <div className={styles.center}>
        <div className={styles.card}>
          <div className={styles.iconWrap} aria-hidden="true">
            <AlertTriangle size={20} />
          </div>

          <h1 className={styles.title}>{NOT_FOUND_COPY.title}</h1>
          <p className={styles.desc}>{NOT_FOUND_COPY.description}</p>

          <div className={styles.actions}>
            <Link className={`${styles.btn} ${styles.primary}`} to={NOT_FOUND_LINKS.dataDictionary}>
              <ArrowLeft size={16} />
              {NOT_FOUND_COPY.backCta}
            </Link>

            <Link className={`${styles.btn} ${styles.secondary}`} to={NOT_FOUND_LINKS.home}>
              {NOT_FOUND_COPY.homeCta}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
