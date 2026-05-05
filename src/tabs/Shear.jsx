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
import { getShape, applyShear, shearMatrix, round } from '../utils/math'
import styles from './Tab.module.css'

const DEFAULTS = { kx: 0, ky: 0, tcx: 0, tcy: 0, shape: 'triangle' }

export default function Shear({ explanation }) {
  const canvasRef = useRef(null)
  const [shape,  setShape]  = useState(() => getUrlParam('shape', DEFAULTS.shape))
  const [tcx,    setTcx]    = useState(() => getUrlParam('tcx', DEFAULTS.tcx))
  const [tcy,    setTcy]    = useState(() => getUrlParam('tcy', DEFAULTS.tcy))
  const [kx,     setKx]     = useState(() => getUrlParam('kx', DEFAULTS.kx))
  const [ky,     setKy]     = useState(() => getUrlParam('ky', DEFAULTS.ky))
  const [custom, setCustom] = useState(null)

  const base        = custom ?? getShape(shape, tcx, tcy)
  const transformed = applyShear(base, kx, ky)
  const matrix      = shearMatrix(kx, ky)

  useUrlState('shear', { shape, tcx, tcy, kx, ky })

  const animKx = useAnimation({ setValue: setKx, min: -2, max: 2, speed: 0.04 })
  const animKy = useAnimation({ setValue: setKy, min: -2, max: 2, speed: 0.04 })

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
    setKx(DEFAULTS.kx); setKy(DEFAULTS.ky)
    setTcx(DEFAULTS.tcx); setTcy(DEFAULTS.tcy); setCustom(null)
    animKx.stop(); animKy.stop()
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
          <span><span className={styles.dotBlue} /> Sheared</span>
        </div>
      </div>

      <div className={styles.panel}>
        <ShapeSelector value={shape} onChange={handleShapeChange} />
        <OriginInput cx={tcx} cy={tcy} onChange={(nx, ny) => { setTcx(nx); setTcy(ny); setCustom(null) }} />

        <div className={styles.section}>
          <div className={styles.sectionLabel}>SHEAR</div>
          <Slider label="kx" value={kx} min={-3} max={3} step={0.1} onChange={setKx} formatValue={v => round(v, 1)} />
          <Slider label="ky" value={ky} min={-3} max={3} step={0.1} onChange={setKy} formatValue={v => round(v, 1)} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>MATRIX</div>
          <MatrixDisplay title={`H(kx=${round(kx,1)}, ky=${round(ky,1)})`} matrix={matrix} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>FORMULA</div>
          <div className={styles.formula}>
            <div>x&prime; = x + kx·y = x + {round(kx,1)}·y</div>
            <div>y&prime; = ky·x + y = {round(ky,1)}·x + y</div>
          </div>
        </div>

        {explanation && <div className={styles.description}><p>{explanation}</p></div>}
      </div>

      <div className={styles.toolbar}>
        <PlayButton playing={animKx.playing} onToggle={() => animKx.toggle(kx)} label="kx" />
        <PlayButton playing={animKy.playing} onToggle={() => animKy.toggle(ky)} label="ky" />
        <div className={styles.toolbarSpacer} />
        <ExportButton canvasRef={{ current: canvasRef.current?.canvas }} filename="shear" />
        <button className={styles.resetBtn} onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
