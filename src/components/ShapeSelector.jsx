import { SHAPES } from '../utils/math'
import styles from './ShapeSelector.module.css'

export default function ShapeSelector({ value, onChange }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.label}>SHAPE</div>
      <div className={styles.buttons}>
        {SHAPES.map(s => (
          <button
            key={s.id}
            className={`${styles.btn} ${value === s.id ? styles.active : ''}`}
            onClick={() => onChange(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
