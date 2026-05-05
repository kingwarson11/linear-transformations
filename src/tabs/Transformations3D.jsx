import { useState } from 'react'
import Canvas3D from '../components/Canvas3D'
import Slider from '../components/Slider'
import MatrixDisplay from '../components/MatrixDisplay'
import { useUrlState, getUrlParam } from '../hooks/useUrlState'
import { build4x4Matrix, round } from '../utils/math'
import styles from './Tab.module.css'

const DEFAULTS = { rotX: 20, rotY: -30, rotZ: 0, scaleX: 1, scaleY: 1, scaleZ: 1, tx: 0, ty: 0, tz: 0 }

export default function Transformations3D({ explanation }) {
  const [rotX,   setRotX]   = useState(() => getUrlParam('rotX', DEFAULTS.rotX))
  const [rotY,   setRotY]   = useState(() => getUrlParam('rotY', DEFAULTS.rotY))
  const [rotZ,   setRotZ]   = useState(() => getUrlParam('rotZ', DEFAULTS.rotZ))
  const [scaleX, setScaleX] = useState(() => getUrlParam('scaleX', DEFAULTS.scaleX))
  const [scaleY, setScaleY] = useState(() => getUrlParam('scaleY', DEFAULTS.scaleY))
  const [scaleZ, setScaleZ] = useState(() => getUrlParam('scaleZ', DEFAULTS.scaleZ))
  const [tx,     setTx]     = useState(() => getUrlParam('tx', DEFAULTS.tx))
  const [ty,     setTy]     = useState(() => getUrlParam('ty', DEFAULTS.ty))
  const [tz,     setTz]     = useState(() => getUrlParam('tz', DEFAULTS.tz))

  useUrlState('3d', { rotX, rotY, rotZ, scaleX, scaleY, scaleZ, tx, ty, tz })

  const matrix = build4x4Matrix(rotX, rotY, rotZ, scaleX, scaleY, scaleZ, tx, ty, tz)

  const reset = () => {
    setRotX(DEFAULTS.rotX); setRotY(DEFAULTS.rotY); setRotZ(DEFAULTS.rotZ)
    setScaleX(DEFAULTS.scaleX); setScaleY(DEFAULTS.scaleY); setScaleZ(DEFAULTS.scaleZ)
    setTx(DEFAULTS.tx); setTy(DEFAULTS.ty); setTz(DEFAULTS.tz)
  }

  return (
    <div className={styles.layout}>
      <div className={styles.canvas}>
        <Canvas3D
          rotX={rotX} rotY={rotY} rotZ={rotZ}
          scaleX={scaleX} scaleY={scaleY} scaleZ={scaleZ}
          tx={tx} ty={ty} tz={tz}
          onOrbitChange={(nx, ny) => { setRotX(nx); setRotY(ny) }}
        />
        <div className={styles.orbitHint}>Drag to orbit</div>
      </div>

      <div className={styles.panel}>
        <div className={styles.section}>
          <div className={styles.sectionLabel}>3D ROTATION — drag canvas to orbit</div>
          <Slider label="X°" value={rotX} min={-180} max={180} step={1} onChange={setRotX} formatValue={v => `${v}°`} />
          <Slider label="Y°" value={rotY} min={-180} max={180} step={1} onChange={setRotY} formatValue={v => `${v}°`} />
          <Slider label="Z°" value={rotZ} min={-180} max={180} step={1} onChange={setRotZ} formatValue={v => `${v}°`} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>3D SCALE</div>
          <Slider label="Sx" value={scaleX} min={0.1} max={3} step={0.05} onChange={setScaleX} formatValue={v => round(v, 2)} />
          <Slider label="Sy" value={scaleY} min={0.1} max={3} step={0.05} onChange={setScaleY} formatValue={v => round(v, 2)} />
          <Slider label="Sz" value={scaleZ} min={0.1} max={3} step={0.05} onChange={setScaleZ} formatValue={v => round(v, 2)} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>3D TRANSLATION</div>
          <Slider label="Tx" value={tx} min={-50} max={50} step={1} onChange={setTx} formatValue={v => round(v, 0)} />
          <Slider label="Ty" value={ty} min={-50} max={50} step={1} onChange={setTy} formatValue={v => round(v, 0)} />
          <Slider label="Tz" value={tz} min={-50} max={50} step={1} onChange={setTz} formatValue={v => round(v, 0)} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLabel}>4×4 MATRIX (COLUMN-MAJOR)</div>
          <MatrixDisplay title="T · R · S" matrix={matrix} />
        </div>

        {explanation && <div className={styles.description}><p>{explanation}</p></div>}
      </div>

      <div className={styles.toolbar}>
        <div className={styles.toolbarSpacer} />
        <button className={styles.resetBtn} onClick={reset}>Reset</button>
      </div>
    </div>
  )
}
