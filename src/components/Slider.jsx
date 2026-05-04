import styles from './Slider.module.css'

export default function Slider({
  label,
  value,
  min,
  max,
  step = 0.1,
  onChange,
  formatValue
}) {
  const display = formatValue ? formatValue(value) : value

  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className={styles.track}
      />
      <span className={styles.value}>{display}</span>
    </div>
  )
}
