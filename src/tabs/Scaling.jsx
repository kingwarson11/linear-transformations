import { useState } from 'react'
import Canvas2D from '../components/Canvas2D'
import Slider from '../components/Slider'
import MatrixDisplay from '../components/MatrixDisplay'
import ShapeSelector from '../components/ShapeSelector'
import OriginInput from '../components/OriginInput'
import { getShape, applyScalingAboutCenter, scalingMatrix2x2, round } from '../utils/math'
import styles from './Tab.module.css'

export default function Scaling({ explanation }) {
  const [shape, setShape] = useState('triangle')
  const [tcx, setTcx] = useState(0)
  const [tcy, setTcy] = useState(0)
  const [sx, setSx] = useState(1)
  const [sy, setSy] = useState(1)
  const [scx, setScx] = useState(0)
  const [scy, setScy] = useState(0)

  const base = getShape(shape, tcx, tcy)
  const transformed = applyScalingAboutCenter(base, sx, sy, scx, scy)
  const matrix = scalingMatrix2x2(sx, sy)

  return (
    <div className={styles.layout}>
      <div className={styles.canvas}>
        <Canvas2D
          originalPoints={base}
          transformedPoints={transformed}
          pivotPoint={[scx, scy]}
          controlPoints={[[scx, scy]]}
          onShapeDrag={(nx, ny) => { setTcx(round(nx, 2)); setTcy(round(ny, 2)) }}
          onPivotDrag={(nx, ny) => { setScx(round(nx, 2)); setScy(round(ny, 2)) }}
        />
        <div className={styles.legend}>
          <span><span className={styles.dotGray} /> Original</span>
          <span><span className={styles.dotBlue} /> Transformed</span>
          <span><span className={styles.dotRed} /> Scale center — drag</span>
        </div>
      </div>
      <div className={styles.panel}>
        <ShapeSelector value={shape} onChange={setShape} />
        <OriginInput cx={tcx} cy={tcy} onChange={(nx, ny) => { setTcx(nx); setTcy(ny) }} />
        <div className={styles.section}>
          <div className={styles.sectionLabel}>SCALE</div>
          <Slider label="sx" value={sx} min={-3} max={3} step={0.1} onChange={setSx} formatValue={v => round(v, 1)} />
          <Slider label="sy" value={sy} min={-3} max={3} step={0.1} onChange={setSy} formatValue={v => round(v, 1)} />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>CENTER OF SCALING — drag red dot</div>
          <Slider label="px" value={scx} min={-6} max={6} step={0.5} onChange={setScx} formatValue={v => round(v, 1)} />
          <Slider label="py" value={scy} min={-6} max={6} step={0.5} onChange={setScy} formatValue={v => round(v, 1)} />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>MATRIX</div>
          <MatrixDisplay title="S(sx, sy)" matrix={matrix} />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>FORMULA</div>
          <div className={styles.formula}>
            <div>x&prime; = sx · x = {round(sx, 1)}·x</div>
            <div>y&prime; = sy · y = {round(sy, 1)}·y</div>
          </div>
        </div>
        {explanation && <div className={styles.description}><p>{explanation}</p></div>}
      </div>
    </div>
  )
}
