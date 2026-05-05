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
import { getShape, applyRotationAboutPivot, rotationMatrix2x2, round } from '../utils/math'
import styles from './Tab.module.css'

const DEFAULTS = { theta: 0, px: 0, py: 0, tcx: 0, tcy: 0, shape: 'triangle' }

export default function Rotation({ explanation }) {
  const canvasRef = useRef(null)
  const [shape,  setShape]  = useState(() => getUrlParam('shape', DEFAULTS.shape))
  const [tcx,    setTcx]    = useState(() => getUrlParam('tcx', DEFAULTS.tcx))
  const [tcy,    setTcy]    = useState(() => getUrlParam('tcy', DEFAULTS.tcy))
  const [theta,  setTheta]  = useState(() => getUrlParam('theta', DEFAULTS.theta))
  const [px,     setPx]     = useState(() => getUrlParam('px', DEFAULTS.px))
  const [py,     setPy]     = useState(() => getUrlParam('py', DEFAULTS.py))
  const [custom, setCustom] = useState(null)

  const base        = custom ?? getShape(shape, tcx, tcy)
  const transformed = applyRotationAboutPivot(base, theta, px, py)
  const matrix      = rotationMatrix2x2(theta)

  useUrlState('rotation', { shape, tcx, tcy, theta, px, py })

  const anim = useAnimation({ setValue: setTheta, min: -180, max: 180, speed: 1.2 })

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
    setTheta(DEFAULTS.theta); setPx(DEFAULTS.px); setPy(DEFAULTS.py)
    setTcx(DEFAULTS.tcx); setTcy(DEFAULTS.tcy); setCustom(null); anim.stop()
  }

  return (
    <div className={styles.layout}>
      <div className={styles.canvas}>
        <Canvas2D
          ref={canvasRef}
          originalPoints={base}
          transformedPoints={transformed}
          pivotPoint={[px, py]}
          showPivotLabel
          onShapeDrag={handleShapeDrag}
          onPivotDrag={(nx, ny) => { setPx(round(nx, 2)); setPy(round(ny, 2)) }}
          onVertexDrag={handleVertexDrag}
        />
        <div className={styles.legend}>
          <span><span className={styles.dotGray} /> Original</span>
          <span><span className={styles.dotBlue} /> Transformed</span>
          <span><span className={styles.dotRed} /> Pivot — drag</span>
        </div>
      </div>

      <div className={styles.panel}>
        <ShapeSelector value={shape} onChange={handleShapeChange} />
        <OriginInput cx={tcx} cy={tcy} onChange={(nx, ny) => { setTcx(nx); setTcy(ny); setCustom(null) }} />

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

      <div className={styles.toolbar}>
        <PlayButton playing={anim.playing} onToggle={() => anim.toggle(theta)} label="θ" />
        <div className={styles.toolbarSpacer} />
        <ExportButton canvasRef={{ current: canvasRef.current?.canvas }} filename="rotation" />
        <button className={styles.resetBtn} onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
