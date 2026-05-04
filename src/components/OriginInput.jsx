import styles from './OriginInput.module.css'

export default function OriginInput({ cx, cy, onChange }) {
  const handle = (axis, raw) => {
    const v = parseFloat(raw)
    if (isNaN(v)) return
    const clamped = Math.max(-8, Math.min(8, v))
    onChange(axis === 'x' ? clamped : cx, axis === 'y' ? clamped : cy)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.hint}>Drag shape on canvas or set origin:</div>
      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.axis}>X</span>
          <input
            type="number"
            className={styles.input}
            value={cx}
            min={-8} max={8} step={0.25}
            onChange={e => handle('x', e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.axis}>Y</span>
          <input
            type="number"
            className={styles.input}
            value={cy}
            min={-8} max={8} step={0.25}
            onChange={e => handle('y', e.target.value)}
          />
        </label>
        <button className={styles.reset} onClick={() => onChange(0, 0)}>Reset</button>
      </div>
    </div>
  )
}
