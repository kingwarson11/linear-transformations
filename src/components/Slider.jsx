import styles from './Slider.module.css'

export default function Slider({ label, value, min, max, step = 0.1, onChange, formatValue }) {
  const display = formatValue ? formatValue(value) : value
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <div className={styles.trackWrap}>
        <div className={styles.fill} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className={styles.input}
        />
      </div>
      <span className={styles.value}>{display}</span>
    </div>
  )
}
