import styles from './PlayButton.module.css'

export default function PlayButton({ playing, onToggle, label = 'Animate' }) {
  return (
    <button
      className={`${styles.btn} ${playing ? styles.active : ''}`}
      onClick={onToggle}
      title={playing ? 'Stop animation' : `Animate ${label}`}
    >
      {playing ? (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <rect x="1" y="1" width="3" height="8" rx="1"/>
          <rect x="6" y="1" width="3" height="8" rx="1"/>
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <path d="M2 1.5l7 3.5-7 3.5V1.5z"/>
        </svg>
      )}
      <span>{playing ? 'Stop' : label}</span>
    </button>
  )
}
