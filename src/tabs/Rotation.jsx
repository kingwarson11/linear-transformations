import { useState } from 'react'
import Canvas2D from '../components/Canvas2D'
import Slider from '../components/Slider'
import MatrixDisplay from '../components/MatrixDisplay'
import {
  DEFAULT_TRIANGLE,
  applyRotationAboutPivot,
  rotationMatrix2x2,
  round
} from '../utils/math'
import styles from './Tab.module.css'

export default function Rotation({ explanation }) {
  const [theta, setTheta] = useState(0)
  const [px, setPx] = useState(0)
  const [py, setPy] = useState(0)

  const transformed = applyRotationAboutPivot(DEFAULT_TRIANGLE, theta, px, py)
  const matrix = rotationMatrix2x2(theta)

  return (
    <div className={styles.layout}>
      <div className={styles.canvas}>
        <Canvas2D
          originalPoints={DEFAULT_TRIANGLE}
          transformedPoints={transformed}
          pivotPoint={[px, py]}
          showPivotLabel
        />
        <div className={styles.legend}>
          <span><span className={styles.dotGray} /> Original</span>
          <span><span className={styles.dotBlue} /> Transformed</span>
          <span><span className={styles.dotRed} /> Control point</span>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>ROTATE</div>
          <Slider label="θ" value={theta} min={-180} max={180} step={1} onChange={setTheta}
            formatValue={v => `${v}°`} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>PIVOT POINT</div>
          <Slider label="px" value={px} min={-8} max={8} step={0.5} onChange={setPx}
            formatValue={v => round(v, 1)} />
          <Slider label="py" value={py} min={-8} max={8} step={0.5} onChange={setPy}
            formatValue={v => round(v, 1)} />
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

        {explanation && (
          <div className={styles.description}>
            <p>{explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}
