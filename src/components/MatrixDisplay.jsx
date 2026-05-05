import styles from './MatrixDisplay.module.css'

function fmt(v) {
  if (v === 0 || v === '0') return '0'
  if (typeof v === 'number') return String(v)
  return String(v)
}

function Cell({ value }) {
  const num = parseFloat(value)
  const isZero = num === 0 || value === 0
  const isOne  = Math.abs(num) === 1
  const isNeg  = !isNaN(num) && num < 0 && !isZero

  return (
    <td className={`${styles.cell} ${isZero ? styles.zero : isNeg ? styles.neg : isOne ? styles.one : styles.pos}`}>
      {fmt(value)}
    </td>
  )
}

export default function MatrixDisplay({ title, matrix }) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.bracket}>
        <div className={styles.bracketLeft} />
        <table className={styles.table}>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => <Cell key={j} value={cell} />)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.bracketRight} />
      </div>
    </div>
  )
}
