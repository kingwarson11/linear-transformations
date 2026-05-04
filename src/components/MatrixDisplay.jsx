import styles from './MatrixDisplay.module.css'

function MatrixCell({ value }) {
  const isZero = value === 0 || value === '0'
  const num = typeof value === 'number' ? value : parseFloat(value)
  const isNeg = !isNaN(num) && num < 0

  return (
    <td
      className={
        isZero
          ? styles.cellZero
          : isNeg
          ? styles.cellNeg
          : styles.cellPos
      }
    >
      {typeof value === 'number' ? value.toFixed ? value : value : value}
    </td>
  )
}

export default function MatrixDisplay({ title, matrix }) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{title}</div>
      <table className={styles.table}>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <MatrixCell key={j} value={cell} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
