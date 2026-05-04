import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

const FACE_COLORS = [0xc060e0, 0x9030c0, 0xe060a0, 0x8020a0, 0xd050d0, 0xb040b0]

export default function Canvas3D({ rotX, rotY, rotZ, scaleX, scaleY, scaleZ, tx, ty, tz, onOrbitChange }) {
  const mountRef = useRef(null)
  const stateRef = useRef(null)
  const dragRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    const W = el.clientWidth || 800
    const H = el.clientHeight || 600
    const dpr = window.devicePixelRatio || 1

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(dpr)
    renderer.setSize(W, H)
    renderer.setClearColor(0x0f1117, 1)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000)
    camera.position.set(0, 0, 12)
    camera.lookAt(0, 0, 0)

    const geo = new THREE.BoxGeometry(3, 3, 3)
    const cube = new THREE.Mesh(geo, FACE_COLORS.map(c =>
      new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.72, side: THREE.DoubleSide })
    ))
    scene.add(cube)
    cube.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
    ))

    stateRef.current = { renderer, scene, camera, cube }
    renderer.render(scene, camera)

    const ro = new ResizeObserver(() => {
      const w = el.clientWidth; const h = el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    })
    ro.observe(el)

    return () => {
      ro.disconnect()
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
      stateRef.current = null
    }
  }, [])

  useEffect(() => {
    const s = stateRef.current
    if (!s) return
    s.cube.rotation.set((rotX * Math.PI) / 180, (rotY * Math.PI) / 180, (rotZ * Math.PI) / 180)
    s.cube.scale.set(scaleX, scaleY, scaleZ)
    s.cube.position.set(tx / 10, ty / 10, tz / 10)
    s.renderer.render(s.scene, s.camera)
  }, [rotX, rotY, rotZ, scaleX, scaleY, scaleZ, tx, ty, tz])

  const onDown = useCallback((e) => {
    const src = e.touches ? e.touches[0] : e
    dragRef.current = { x: src.clientX, y: src.clientY, rx: rotX, ry: rotY }
  }, [rotX, rotY])

  const onMove = useCallback((e) => {
    if (!dragRef.current || !onOrbitChange) return
    e.preventDefault()
    const src = e.touches ? e.touches[0] : e
    const dx = src.clientX - dragRef.current.x
    const dy = src.clientY - dragRef.current.y
    onOrbitChange(
      Math.max(-180, Math.min(180, Math.round(dragRef.current.rx + dy * 0.5))),
      Math.max(-180, Math.min(180, Math.round(dragRef.current.ry + dx * 0.5)))
    )
  }, [onOrbitChange])

  const onUp = useCallback(() => { dragRef.current = null }, [])

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', cursor: 'grab' }}
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={onDown}
      onTouchMove={onMove}
      onTouchEnd={onUp}
    />
  )
}
