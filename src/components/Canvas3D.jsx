import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const FACE_COLORS = [
  0xc060e0, // right  — purple
  0x9030c0, // left   — dark purple
  0xe060a0, // top    — pink-purple
  0x8020a0, // bottom — deep purple
  0xd050d0, // front  — medium purple
  0xb040b0  // back   — muted purple
]

export default function Canvas3D({ rotX, rotY, rotZ, scaleX, scaleY, scaleZ, tx, ty, tz }) {
  const mountRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const cubeRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const W = el.clientWidth || 800
    const H = el.clientHeight || 600

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(W, H)
    renderer.setClearColor(0x0f1117, 1)
    el.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000)
    camera.position.set(0, 0, 12)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const materials = FACE_COLORS.map(color =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.72,
        side: THREE.DoubleSide
      })
    )

    const geometry = new THREE.BoxGeometry(3, 3, 3)
    const cube = new THREE.Mesh(geometry, materials)
    scene.add(cube)
    cubeRef.current = cube

    const edgesGeo = new THREE.EdgesGeometry(geometry)
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25
    })
    const edges = new THREE.LineSegments(edgesGeo, edgesMat)
    cube.add(edges)

    const render = () => {
      renderer.render(scene, camera)
    }
    render()

    const handleResize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      render()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameRef.current)
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    const cube = cubeRef.current
    const renderer = rendererRef.current
    const scene = sceneRef.current
    const camera = cameraRef.current
    if (!cube || !renderer) return

    cube.rotation.set(
      (rotX * Math.PI) / 180,
      (rotY * Math.PI) / 180,
      (rotZ * Math.PI) / 180
    )
    cube.scale.set(scaleX, scaleY, scaleZ)
    cube.position.set(tx / 10, ty / 10, tz / 10)

    renderer.render(scene, camera)
  }, [rotX, rotY, rotZ, scaleX, scaleY, scaleZ, tx, ty, tz])

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
