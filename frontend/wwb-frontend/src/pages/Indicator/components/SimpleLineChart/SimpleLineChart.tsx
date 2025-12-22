import { fmt } from '@/entities/indicator/indicator.utils'
import styles from './SimpleLineChart.module.scss'

type Point = { year: number; value: number | null }

type Props = {
  data: Point[]
  unitLabel: string
}

export function SimpleLineChart({ data, unitLabel }: Props) {
  const w = 900
  const h = 360
  const padL = 52
  const padR = 20
  const padT = 18
  const padB = 36

  const vals = data.map((d) => d.value).filter((v): v is number => typeof v === 'number')
  const minV = vals.length ? Math.min(...vals) : 0
  const maxV = vals.length ? Math.max(...vals) : 1

  const minY = data[0]?.year ?? 0
  const maxY = data[data.length - 1]?.year ?? 1

  const plotW = w - padL - padR
  const plotH = h - padT - padB

  const x = (year: number) => padL + ((year - minY) / (maxY - minY || 1)) * plotW
  const y = (value: number) => padT + (1 - (value - minV) / (maxV - minV || 1)) * plotH

  const paths: string[] = []
  let current = ''

  data.forEach((d, i) => {
    if (d.value == null) {
      if (current) paths.push(current)
      current = ''
      return
    }
    const px = x(d.year)
    const py = y(d.value)
    if (!current) current = `M ${px} ${py}`
    else current += ` L ${px} ${py}`
    if (i === data.length - 1 && current) paths.push(current)
  })

  return (
    <div className={styles.svgWrap}>
      <svg viewBox={`0 0 ${w} ${h}`} className={styles.svg}>
        <line x1={padL} y1={padT} x2={padL} y2={h - padB} className={styles.axis} />
        <line x1={padL} y1={h - padB} x2={w - padR} y2={h - padB} className={styles.axis} />

        {[0, 0.5, 1].map((t) => {
          const vv = minV + (maxV - minV) * t
          const yy = y(vv)
          return (
            <g key={t}>
              <line x1={padL} y1={yy} x2={w - padR} y2={yy} className={styles.grid} />
              <text x={padL - 10} y={yy + 4} textAnchor="end" className={styles.tick}>
                {fmt(vv)}
              </text>
            </g>
          )
        })}

        {data.map((d, idx) => {
          if (idx % 2 !== 0) return null
          const xx = x(d.year)
          return (
            <text key={d.year} x={xx} y={h - 12} textAnchor="middle" className={styles.tick}>
              {d.year}
            </text>
          )
        })}

        {paths.map((p, i) => (
          <path key={i} d={p} className={styles.line} />
        ))}

        {data.map((d) => {
          if (d.value == null) return null
          return <circle key={d.year} cx={x(d.year)} cy={y(d.value)} r={4} className={styles.dot} />
        })}

        <text x={18} y={h / 2} transform={`rotate(-90 18 ${h / 2})`} className={styles.yLabel}>
          {unitLabel}
        </text>
      </svg>

      <div className={styles.note}>
        <strong>Note:</strong> gaps indicate missing data.
      </div>
    </div>
  )
}
