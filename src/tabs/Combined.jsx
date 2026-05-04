import { useState } from 'react'
import Canvas2D from '../components/Canvas2D'
import Slider from '../components/Slider'
import MatrixDisplay from '../components/MatrixDisplay'
import ShapeSelector from '../components/ShapeSelector'
import OriginInput from '../components/OriginInput'
import { getShape, applyCombined, combinedMatrix3x3, round } from '../utils/math'
import styles from './Tab.module.css'

export default function Combined({ explanation }) {
  const [shape, setShape] = useState('triangle')
  const [tcx, setTcx] = useState(0)
  const [tcy, setTcy] = useState(0)
  const [theta, setTheta] = useState(0)
  const [sx, setSx] = useState(1)
  const [sy, setSy] = useState(1)
  const [dx, setDx] = useState(0)
  const [dy, setDy] = useState(0)

  const base = getShape(shape, tcx, tcy)
  const transformed = applyCombined(base, theta, sx, sy, dx, dy)
  const matrix = combinedMatrix3x3(theta, sx, sy, dx, dy)

  return (
    <div className={styles.layout}>
      <div className={styles.canvas}>
        <Canvas2D
          originalPoints={base}
          transformedPoints={transformed}
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
          <div className={styles.sectionLabel}>ROTATION → SCALE → TRANSLATE</div>
          <Slider label="θ"  value={theta} min={-180} max={180} step={1}   onChange={setTheta} formatValue={v => `${v}°`} />
          <Slider label="sx" value={sx}    min={-3}   max={3}   step={0.1} onChange={setSx}    formatValue={v => round(v, 1)} />
          <Slider label="sy" value={sy}    min={-3}   max={3}   step={0.1} onChange={setSy}    formatValue={v => round(v, 1)} />
          <Slider label="dx" value={dx}    min={-8}   max={8}   step={0.5} onChange={setDx}    formatValue={v => round(v, 1)} />
          <Slider label="dy" value={dy}    min={-8}   max={8}   step={0.5} onChange={setDy}    formatValue={v => round(v, 1)} />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>MATRIX</div>
          <MatrixDisplay title="T · S · R (column-major)" matrix={matrix} />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>FORMULA</div>
          <div className={styles.formula}>
            <div>Order matters! T·S·R ≠ R·S·T</div>
            <div>Rotate first → scale → translate</div>
          </div>
        </div>
        {explanation && <div className={styles.description}><p>{explanation}</p></div>}
      </div>
    </div>
  )
}
