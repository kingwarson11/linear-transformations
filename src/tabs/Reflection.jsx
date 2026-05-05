import { useState, useRef, useCallback } from 'react'
import Canvas2D from '../components/Canvas2D'
import Slider from '../components/Slider'
import MatrixDisplay from '../components/MatrixDisplay'
import ShapeSelector from '../components/ShapeSelector'
import OriginInput from '../components/OriginInput'
import ExportButton from '../components/ExportButton'
import { useUrlState, getUrlParam } from '../hooks/useUrlState'
import { getShape, applyReflection, reflectionMatrix, round } from '../utils/math'
import styles from './Tab.module.css'

const AXES = [
  { id: 'x',      label: 'X axis' },
  { id: 'y',      label: 'Y axis' },
  { id: 'origin', label: 'Origin' },
  { id: 'line',   label: 'Custom line' },
]

const DEFAULTS = { axis: 'x', theta: 45, tcx: 0, tcy: 0, shape: 'triangle' }

export default function Reflection({ explanation }) {
  const canvasRef = useRef(null)
  const [shape,  setShape]  = useState(() => getUrlParam('shape', DEFAULTS.shape))
  const [tcx,    setTcx]    = useState(() => getUrlParam('tcx', DEFAULTS.tcx))
  const [tcy,    setTcy]    = useState(() => getUrlParam('tcy', DEFAULTS.tcy))
  const [axis,   setAxis]   = useState(() => getUrlParam('axis', DEFAULTS.axis))
  const [theta,  setTheta]  = useState(() => getUrlParam('theta', DEFAULTS.theta))
  const [custom, setCustom] = useState(null)

  const base        = custom ?? getShape(shape, tcx, tcy)
  const transformed = applyReflection(base, axis, theta)
  const matrix      = reflectionMatrix(axis, theta)

  useUrlState('reflection', { shape, tcx, tcy, axis, theta })

  const handleShapeChange = (s) => { setShape(s); setCustom(null) }

  const handleShapeDrag = useCallback((nx, ny) => {
    const pts = custom ?? getShape(shape, tcx, tcy)
    const n   = pts.length
    const cx  = pts.reduce((s, [x]) => s + x, 0) / n
    const cy  = pts.reduce((s, [,y]) => s + y, 0) / n
    setCustom(pts.map(([x, y]) => [round(x + nx - cx, 2), round(y + ny - cy, 2)]))
    setTcx(round(nx, 2)); setTcy(round(ny, 2))
  }, [custom, shape, tcx, tcy])

  const handleVertexDrag = useCallback((i, nx, ny) => {
    const pts = [...(custom ?? getShape(shape, tcx, tcy))]
    pts[i] = [round(nx, 2), round(ny, 2)]
    setCustom(pts)
  }, [custom, shape, tcx, tcy])

  const reset = () => {
    setAxis(DEFAULTS.axis); setTheta(DEFAULTS.theta)
    setTcx(DEFAULTS.tcx); setTcy(DEFAULTS.tcy); setCustom(null)
  }

  const axisDescription = {
    x:      "x\u2032 = x,  y\u2032 = \u2212y",
    y:      "x\u2032 = \u2212x,  y\u2032 = y",
    origin: "x\u2032 = \u2212x,  y\u2032 = \u2212y",
    line:   "x\u2032 = cos(2\u03B8)\u00B7x + sin(2\u03B8)\u00B7y",
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
          <span><span className={styles.dotBlue} /> Reflected</span>
        </div>
      </div>

      <div className={styles.panel}>
        <ShapeSelector value={shape} onChange={handleShapeChange} />
        <OriginInput cx={tcx} cy={tcy} onChange={(nx, ny) => { setTcx(nx); setTcy(ny); setCustom(null) }} />

        <div className={styles.section}>
          <div className={styles.sectionLabel}>REFLECTION AXIS</div>
          <div className={styles.axisButtons}>
            {AXES.map(a => (
              <button
                key={a.id}
                className={`${styles.axisBtn} ${axis === a.id ? styles.axisBtnActive : ''}`}
                onClick={() => setAxis(a.id)}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {axis === 'line' && (
          <div className={styles.section}>
            <div className={styles.sectionLabel}>LINE ANGLE</div>
            <Slider label="θ" value={theta} min={0} max={180} step={1} onChange={setTheta} formatValue={v => `${v}°`} />
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.sectionLabel}>MATRIX</div>
          <MatrixDisplay title={`Ref(${axis}${axis === 'line' ? ` ${theta}°` : ''})`} matrix={matrix} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>FORMULA</div>
          <div className={styles.formula}>
            <div>{axisDescription[axis]}</div>
            {axis === 'line' && <div>y&prime; = sin(2θ)·x − cos(2θ)·y</div>}
          </div>
        </div>

        {explanation && <div className={styles.description}><p>{explanation}</p></div>}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.toolbarSpacer} />
        <ExportButton canvasRef={{ current: canvasRef.current?.canvas }} filename="reflection" />
        <button className={styles.resetBtn} onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
