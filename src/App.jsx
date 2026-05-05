import { useState, useEffect, lazy, Suspense } from 'react'
import Translation from './tabs/Translation'
import Rotation from './tabs/Rotation'
import Scaling from './tabs/Scaling'
import Combined from './tabs/Combined'
import Reflection from './tabs/Reflection'
import Shear from './tabs/Shear'
import { getUrlTab } from './hooks/useUrlState'
import styles from './App.module.css'

const Transformations3D = lazy(() => import('./tabs/Transformations3D'))

const TABS = [
  { id: 'translation', label: 'Translation',        short: 'T'   },
  { id: 'rotation',    label: 'Rotation',           short: 'R'   },
  { id: 'scaling',     label: 'Scaling',            short: 'S'   },
  { id: 'combined',    label: 'Combined',           short: 'C'   },
  { id: 'reflection',  label: 'Reflection',         short: 'Ref' },
  { id: 'shear',       label: 'Shear',              short: 'H'   },
  { id: '3d',          label: '3D Transformations', short: '3D'  },
]

const VALID = new Set(TABS.map(t => t.id))

export default function App() {
  const [active, setActive] = useState(() => {
    const url = getUrlTab()
    return url && VALID.has(url) ? url : 'translation'
  })
  const [explanations, setExplanations] = useState({})

  useEffect(() => {
    if (explanations[active]) return
    fetch(`/api/explain?type=${active}`)
      .then(r => r.json())
      .then(data => setExplanations(prev => ({ ...prev, [active]: data.explanation })))
      .catch(() => {})
  }, [active])

  const renderTab = () => {
    const exp = explanations[active]
    switch (active) {
      case 'translation': return <Translation explanation={exp} />
      case 'rotation':    return <Rotation explanation={exp} />
      case 'scaling':     return <Scaling explanation={exp} />
      case 'combined':    return <Combined explanation={exp} />
      case 'reflection':  return <Reflection explanation={exp} />
      case 'shear':       return <Shear explanation={exp} />
      case '3d':
        return (
          <Suspense fallback={<div className={styles.loading}>Loading 3D engine…</div>}>
            <Transformations3D explanation={exp} />
          </Suspense>
        )
      default: return null
    }
  }

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="1" y="1" width="7" height="7" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
              <rect x="12" y="12" width="7" height="7" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <line x1="8" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
            </svg>
          </div>
          <span className={styles.brandName}>LinearViz</span>
        </div>

        <nav className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${active === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActive(tab.id)}
            >
              <span className={styles.tabLabel}>{tab.label}</span>
              <span className={styles.tabShort}>{tab.short}</span>
            </button>
          ))}
        </nav>

        <div className={styles.status}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>live</span>
        </div>
      </header>

      <main className={styles.main}>
        {renderTab()}
      </main>
    </div>
  )
}
