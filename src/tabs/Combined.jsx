import { useState, useRef, useCallback } from 'react'
import Canvas2D from '../components/Canvas2D'
import Slider from '../components/Slider'
import MatrixDisplay from '../components/MatrixDisplay'
import ShapeSelector from '../components/ShapeSelector'
import OriginInput from '../components/OriginInput'
import PlayButton from '../components/PlayButton'
import ExportButton from '../components/ExportButton'
import { useUrlState, getUrlParam } from '../hooks/useUrlState'
import { useAnimation } from '../hooks/useAnimation'
import { getShape, applyCombined, combinedMatrix3x3, round } from '../utils/math'
import styles from './Tab.module.css'

const DEFAULTS = { theta: 0, sx: 1, sy: 1, dx: 0, dy: 0, tcx: 0, tcy: 0, shape: 'triangle' }

export default function Combined({ explanation }) {
  const canvasRef = useRef(null)
  const [shape,  setShape]  = useState(() => getUrlParam('shape', DEFAULTS.shape))
  const [tcx,    setTcx]    = useState(() => getUrlParam('tcx', DEFAULTS.tcx))
  const [tcy,    setTcy]    = useState(() => getUrlParam('tcy', DEFAULTS.tcy))
  const [theta,  setTheta]  = useState(() => getUrlParam('theta', DEFAULTS.theta))
  const [sx,     setSx]     = useState(() => getUrlParam('sx', DEFAULTS.sx))
  const [sy,     setSy]     = useState(() => getUrlParam('sy', DEFAULTS.sy))
  const [dx,     setDx]     = useState(() => getUrlParam('dx', DEFAULTS.dx))
  const [dy,     setDy]     = useState(() => getUrlParam('dy', DEFAULTS.dy))
  const [custom, setCustom] = useState(null)

  const base        = custom ?? getShape(shape, tcx, tcy)
  const transformed = applyCombined(base, theta, sx, sy, dx, dy)
  const matrix      = combinedMatrix3x3(theta, sx, sy, dx, dy)

  useUrlState('combined', { shape, tcx, tcy, theta, sx, sy, dx, dy })

  const anim = useAnimation({ setValue: setTheta, min: -180, max: 180, speed: 1 })

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
    setTheta(DEFAULTS.theta); setSx(DEFAULTS.sx); setSy(DEFAULTS.sy)
    setDx(DEFAULTS.dx); setDy(DEFAULTS.dy)
    setTcx(DEFAULTS.tcx); setTcy(DEFAULTS.tcy); setCustom(null); anim.stop()
  }

  return (
    <div className={styles.layout}>
      <div className={styles.canvas}>
        <Canvas2D
          ref={canvasRef}
          originalPoints={base}
          transformedPoints={transformed}
          onShapeDrag={handleShapeDrag}
          onVertexDrag={handleVertexDrag}
        />
        <div className={styles.legend}>
          <span><span className={styles.dotGray} /> Original</span>
          <span><span className={styles.dotBlue} /> Transformed</span>
        </div>
      </div>

      <div className={styles.panel}>
        <ShapeSelector value={shape} onChange={handleShapeChange} />
        <OriginInput cx={tcx} cy={tcy} onChange={(nx, ny) => { setTcx(nx); setTcy(ny); setCustom(null) }} />

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

      <div className={styles.toolbar}>
        <PlayButton playing={anim.playing} onToggle={() => anim.toggle(theta)} label="θ" />
        <div className={styles.toolbarSpacer} />
        <ExportButton canvasRef={{ current: canvasRef.current?.canvas }} filename="combined" />
        <button className={styles.resetBtn} onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
