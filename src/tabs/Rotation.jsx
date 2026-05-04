import { useState } from 'react'
import Canvas2D from '../components/Canvas2D'
import Slider from '../components/Slider'
import MatrixDisplay from '../components/MatrixDisplay'
import ShapeSelector from '../components/ShapeSelector'
import OriginInput from '../components/OriginInput'
import { getShape, applyRotationAboutPivot, rotationMatrix2x2, round } from '../utils/math'
import styles from './Tab.module.css'

export default function Rotation({ explanation }) {
  const [shape, setShape] = useState('triangle')
  const [tcx, setTcx] = useState(0)
  const [tcy, setTcy] = useState(0)
  const [theta, setTheta] = useState(0)
  const [px, setPx] = useState(0)
  const [py, setPy] = useState(0)

  const base = getShape(shape, tcx, tcy)
  const transformed = applyRotationAboutPivot(base, theta, px, py)
  const matrix = rotationMatrix2x2(theta)

  return (
    <div className={styles.layout}>
      <div className={styles.canvas}>
        <Canvas2D
          originalPoints={base}
          transformedPoints={transformed}
          pivotPoint={[px, py]}
          showPivotLabel
          onShapeDrag={(nx, ny) => { setTcx(round(nx, 2)); setTcy(round(ny, 2)) }}
          onPivotDrag={(nx, ny) => { setPx(round(nx, 2)); setPy(round(ny, 2)) }}
        />
        <div className={styles.legend}>
          <span><span className={styles.dotGray} /> Original</span>
          <span><span className={styles.dotBlue} /> Transformed</span>
          <span><span className={styles.dotRed} /> Pivot — drag</span>
        </div>
      </div>
      <div className={styles.panel}>
        <ShapeSelector value={shape} onChange={setShape} />
        <OriginInput cx={tcx} cy={tcy} onChange={(nx, ny) => { setTcx(nx); setTcy(ny) }} />
        <div className={styles.section}>
          <div className={styles.sectionLabel}>ROTATE</div>
          <Slider label="θ" value={theta} min={-180} max={180} step={1} onChange={setTheta} formatValue={v => `${v}°`} />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>PIVOT — drag red dot on canvas</div>
          <Slider label="px" value={px} min={-8} max={8} step={0.5} onChange={setPx} formatValue={v => round(v, 1)} />
          <Slider label="py" value={py} min={-8} max={8} step={0.5} onChange={setPy} formatValue={v => round(v, 1)} />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>MATRIX</div>
          <MatrixDisplay title={`R(${theta}°)`} matrix={matrix} />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>FORMULA</div>
          <div className={styles.formula}>
            <div>x&prime; = cos(θ)·x − sin(θ)·y</div>
            <div>y&prime; = sin(θ)·x + cos(θ)·y</div>
          </div>
        </div>
        {explanation && <div className={styles.description}><p>{explanation}</p></div>}
      </div>
    </div>
  )
}
