import { useState } from 'react'
import Canvas2D from '../components/Canvas2D'
import Slider from '../components/Slider'
import MatrixDisplay from '../components/MatrixDisplay'
import ShapeSelector from '../components/ShapeSelector'
import OriginInput from '../components/OriginInput'
import { getShape, applyTranslation, translationMatrix3x3, centroid, round } from '../utils/math'
import styles from './Tab.module.css'

export default function Translation({ explanation }) {
  const [shape, setShape] = useState('triangle')
  const [tcx, setTcx] = useState(0)
  const [tcy, setTcy] = useState(0)
  const [dx, setDx] = useState(0)
  const [dy, setDy] = useState(0)

  const base = getShape(shape, tcx, tcy)
  const transformed = applyTranslation(base, dx, dy)
  const matrix = translationMatrix3x3(dx, dy)

  return (
    <div className={styles.layout}>
      <div className={styles.canvas}>
        <Canvas2D
          originalPoints={base}
          transformedPoints={transformed}
          controlPoints={[centroid(base)]}
          onShapeDrag={(nx, ny) => { setTcx(round(nx, 2)); setTcy(round(ny, 2)) }}
        />
        <div className={styles.legend}>
          <span><span className={styles.dotGray} /> Original</span>
          <span><span className={styles.dotBlue} /> Transformed</span>
        </div>
      </div>
      <div className={styles.panel}>
        <ShapeSelector value={shape} onChange={setShape} />
        <OriginInput cx={tcx} cy={tcy} onChange={(nx, ny) => { setTcx(nx); setTcy(ny) }} />
        <div className={styles.section}>
          <div className={styles.sectionLabel}>TRANSLATE</div>
          <Slider label="dx" value={dx} min={-8} max={8} step={0.5} onChange={setDx} formatValue={v => round(v, 1)} />
          <Slider label="dy" value={dy} min={-8} max={8} step={0.5} onChange={setDy} formatValue={v => round(v, 1)} />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>MATRIX</div>
          <MatrixDisplay title={`T(${round(dx,1)}, ${round(dy,1)})`} matrix={matrix} />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>FORMULA</div>
          <div className={styles.formula}>
            <div>x&prime; = x + {round(dx, 1)}</div>
            <div>y&prime; = y + {round(dy, 1)}</div>
          </div>
        </div>
        {explanation && <div className={styles.description}><p>{explanation}</p></div>}
      </div>
    </div>
  )
}
