import { useState, useEffect } from 'react'
import Translation from './tabs/Translation'
import Rotation from './tabs/Rotation'
import Scaling from './tabs/Scaling'
import Combined from './tabs/Combined'
import Transformations3D from './tabs/Transformations3D'
import styles from './App.module.css'

const TABS = [
  { id: 'translation', label: 'Translation' },
  { id: 'rotation', label: 'Rotation' },
  { id: 'scaling', label: 'Scaling' },
  { id: 'combined', label: 'Combined' },
  { id: '3d', label: '3D Transformations' }
]

export default function App() {
  const [active, setActive] = useState('translation')
  const [explanations, setExplanations] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (explanations[active]) return
    setLoading(true)
    fetch(`/api/explain?type=${active}`)
      .then(r => r.json())
      .then(data => {
        setExplanations(prev => ({ ...prev, [active]: data.explanation }))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [active])

  const renderTab = () => {
    const exp = explanations[active]
    switch (active) {
      case 'translation': return <Translation explanation={exp} />
      case 'rotation':    return <Rotation explanation={exp} />
      case 'scaling':     return <Scaling explanation={exp} />
      case 'combined':    return <Combined explanation={exp} />
      case '3d':          return <Transformations3D explanation={exp} />
      default:            return null
    }
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <nav className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${active === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <button className={styles.menuBtn} aria-label="Options">
          <span />
          <span />
          <span />
        </button>
      </header>

      <main className={styles.main}>
        {renderTab()}
      </main>
    </div>
  )
}
