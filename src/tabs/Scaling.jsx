import { useState } from 'react'
import Canvas2D from '../components/Canvas2D'
import Slider from '../components/Slider'
import MatrixDisplay from '../components/MatrixDisplay'
import {
  DEFAULT_TRIANGLE,
  applyScalingAboutCenter,
  scalingMatrix2x2,
  round
} from '../utils/math'
import styles from './Tab.module.css'

export default function Scaling({ explanation }) {
  const [sx, setSx] = useState(1)
  const [sy, setSy] = useState(1)
  const [cx, setCx] = useState(0)
  const [cy, setCy] = useState(0)

  const transformed = applyScalingAboutCenter(DEFAULT_TRIANGLE, sx, sy, cx, cy)
  const matrix = scalingMatrix2x2(sx, sy)

  return (
    <div className={styles.layout}>
      <div className={styles.canvas}>
        <Canvas2D
          originalPoints={DEFAULT_TRIANGLE}
          transformedPoints={transformed}
          pivotPoint={[cx, cy]}
          showPivotLabel={false}
          controlPoints={[[cx, cy]]}
        />
        <div className={styles.legend}>
          <span><span className={styles.dotGray} /> Original</span>
          <span><span className={styles.dotBlue} /> Transformed</span>
          <span><span className={styles.dotRed} /> Control point</span>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>SCALE</div>
          <Slider label="sx" value={sx} min={-3} max={3} step={0.1} onChange={setSx}
            formatValue={v => round(v, 1)} />
          <Slider label="sy" value={sy} min={-3} max={3} step={0.1} onChange={setSy}
            formatValue={v => round(v, 1)} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>CENTER OF SCALING</div>
          <Slider label="px" value={cx} min={-6} max={6} step={0.5} onChange={setCx}
            formatValue={v => round(v, 1)} />
          <Slider label="py" value={cy} min={-6} max={6} step={0.5} onChange={setCy}
            formatValue={v => round(v, 1)} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>MATRIX</div>
          <MatrixDisplay title={`S(sx, sy)`} matrix={matrix} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>FORMULA</div>
          <div className={styles.formula}>
            <div>x&prime; = sx · x = {round(sx, 1)}·x</div>
            <div>y&prime; = sy · y = {round(sy, 1)}·y</div>
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
