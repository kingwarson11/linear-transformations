import { useState, useRef, useCallback } from 'react'
import Canvas2D from '../components/Canvas2D'
import Slider from '../components/Slider'
import MatrixDisplay from '../components/MatrixDisplay'
import ShapeSelector from '../components/ShapeSelector'
import OriginInput from '../components/OriginInput'
import ExportButton from '../components/ExportButton'
import { useUrlState, getUrlParam } from '../hooks/useUrlState'
import { getShape, applyScalingAboutCenter, scalingMatrix2x2, round } from '../utils/math'
import styles from './Tab.module.css'

const DEFAULTS = { sx: 1, sy: 1, scx: 0, scy: 0, tcx: 0, tcy: 0, shape: 'triangle' }

export default function Scaling({ explanation }) {
  const canvasRef = useRef(null)
  const [shape,  setShape]  = useState(() => getUrlParam('shape', DEFAULTS.shape))
  const [tcx,    setTcx]    = useState(() => getUrlParam('tcx', DEFAULTS.tcx))
  const [tcy,    setTcy]    = useState(() => getUrlParam('tcy', DEFAULTS.tcy))
  const [sx,     setSx]     = useState(() => getUrlParam('sx', DEFAULTS.sx))
  const [sy,     setSy]     = useState(() => getUrlParam('sy', DEFAULTS.sy))
  const [scx,    setScx]    = useState(() => getUrlParam('scx', DEFAULTS.scx))
  const [scy,    setScy]    = useState(() => getUrlParam('scy', DEFAULTS.scy))
  const [custom, setCustom] = useState(null)

  const base        = custom ?? getShape(shape, tcx, tcy)
  const transformed = applyScalingAboutCenter(base, sx, sy, scx, scy)
  const matrix      = scalingMatrix2x2(sx, sy)

  useUrlState('scaling', { shape, tcx, tcy, sx, sy, scx, scy })

  const handleShapeChange = (s) => { setShape(s); setCustom(null) }

  const handleShapeDrag = useCallback((nx, ny) => {
    const pts = custom ?? getShape(shape, tcx, tcy)
    const n   = pts.length
    const cx  = pts.reduce((s, [x]) => s + x, 0) / n
    const cy  = pts.reduce((s, [,y]) => s + y, 0) / n
    const ddx = nx - cx, ddy = ny - cy
    setCustom(pts.map(([x, y]) => [round(x + ddx, 2), round(y + ddy, 2)]))
    setTcx(round(nx, 2)); setTcy(round(ny, 2))
  }, [custom, shape, tcx, tcy])

  const handleVertexDrag = useCallback((i, nx, ny) => {
    const pts = [...(custom ?? getShape(shape, tcx, tcy))]
    pts[i] = [round(nx, 2), round(ny, 2)]
    setCustom(pts)
  }, [custom, shape, tcx, tcy])

  const reset = () => {
    setSx(DEFAULTS.sx); setSy(DEFAULTS.sy)
    setScx(DEFAULTS.scx); setScy(DEFAULTS.scy)
    setTcx(DEFAULTS.tcx); setTcy(DEFAULTS.tcy); setCustom(null)
  }

  return (
    <div className={styles.layout}>
      <div className={styles.canvas}>
        <Canvas2D
          ref={canvasRef}
          originalPoints={base}
          transformedPoints={transformed}
          pivotPoint={[scx, scy]}
          controlPoints={[[scx, scy]]}
          onShapeDrag={handleShapeDrag}
          onPivotDrag={(nx, ny) => { setScx(round(nx, 2)); setScy(round(ny, 2)) }}
          onVertexDrag={handleVertexDrag}
        />
        <div className={styles.legend}>
          <span><span className={styles.dotGray} /> Original</span>
          <span><span className={styles.dotBlue} /> Transformed</span>
          <span><span className={styles.dotRed} /> Scale center — drag</span>
        </div>
      </div>

      <div className={styles.panel}>
        <ShapeSelector value={shape} onChange={handleShapeChange} />
        <OriginInput cx={tcx} cy={tcy} onChange={(nx, ny) => { setTcx(nx); setTcy(ny); setCustom(null) }} />

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

      <div className={styles.toolbar}>
        <div className={styles.toolbarSpacer} />
        <ExportButton canvasRef={{ current: canvasRef.current?.canvas }} filename="scaling" />
        <button className={styles.resetBtn} onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
