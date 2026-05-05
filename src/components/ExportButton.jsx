import styles from './ExportButton.module.css'

export default function ExportButton({ canvasRef, filename = 'transform' }) {
  const handleExport = () => {
    const canvas = canvasRef?.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <button className={styles.btn} onClick={handleExport} title="Export as PNG">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 1v7M3 5l3 3 3-3"/>
        <path d="M1 9v1.5a.5.5 0 00.5.5h9a.5.5 0 00.5-.5V9"/>
      </svg>
      <span>PNG</span>
    </button>
  )
}
