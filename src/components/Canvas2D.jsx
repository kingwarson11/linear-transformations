import { useEffect, useRef, useCallback } from 'react'
import { distance } from '../utils/math'

const RANGE = 10
const HIT_SHAPE = 1.2
const HIT_PIVOT = 0.8

export default function Canvas2D({
  originalPoints,
  transformedPoints,
  controlPoints = [],
  pivotPoint = null,
  showPivotLabel = false,
  onShapeDrag,
  onPivotDrag,
}) {
  const canvasRef = useRef(null)
  const dragRef = useRef(null)

  const toPixel = useCallback((mx, my, W, H) => [
    W / 2 + (mx / RANGE) * (W / 2),
    H / 2 - (my / RANGE) * (H / 2),
  ], [])

  const toMath = useCallback((px, py, W, H) => [
    ((px - W / 2) / (W / 2)) * RANGE,
    -((py - H / 2) / (H / 2)) * RANGE,
  ], [])

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const src = e.touches ? e.touches[0] : e
    return [src.clientX - rect.left, src.clientY - rect.top]
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    if (!W || !H) return

    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const tp = (mx, my) => toPixel(mx, my, W, H)

    ctx.fillStyle = '#0f1117'
    ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = '#1c2d4a'
    ctx.lineWidth = 0.5
    for (let i = -RANGE; i <= RANGE; i++) {
      const [px] = tp(i, 0); ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke()
      const [, py] = tp(0, i); ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke()
    }

    ctx.strokeStyle = '#243b60'
    ctx.lineWidth = 1
    for (let i = -RANGE; i <= RANGE; i += 2) {
      const [px] = tp(i, 0); ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke()
      const [, py] = tp(0, i); ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke()
    }

    const [axX, axY] = tp(0, 0)
    ctx.strokeStyle = '#3a6aaa'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(0, axY); ctx.lineTo(W, axY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(axX, 0); ctx.lineTo(axX, H); ctx.stroke()

    ctx.fillStyle = '#5a7aaa'
    ctx.font = `${Math.max(10, W * 0.013)}px JetBrains Mono, monospace`
    for (let i = -RANGE + 2; i <= RANGE - 2; i += 2) {
      if (i === 0) continue
      const [px] = tp(i, 0); ctx.textAlign = 'center'; ctx.fillText(i, px, axY + 16)
      const [, py] = tp(0, i); ctx.textAlign = 'right';  ctx.fillText(i, axX - 8, py + 4)
    }

    const drawPoly = (pts, fill, stroke, lw, dashed) => {
      if (!pts || pts.length < 2) return
      ctx.beginPath()
      ctx.moveTo(...tp(...pts[0]))
      for (let i = 1; i < pts.length; i++) ctx.lineTo(...tp(...pts[i]))
      ctx.closePath()
      if (fill) { ctx.fillStyle = fill; ctx.fill() }
      ctx.setLineDash(dashed ? [6, 4] : [])
      ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke()
      ctx.setLineDash([])
    }

    drawPoly(originalPoints, 'rgba(130,145,175,0.15)', 'rgba(170,185,220,0.65)', 1.5, true)
    drawPoly(transformedPoints, 'rgba(55,120,240,0.28)', '#5599ff', 2.5, false)

    controlPoints.forEach(([mx, my]) => {
      const [px, py] = tp(mx, my)
      ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(180,195,230,0.8)'; ctx.fill()
    })

    transformedPoints?.forEach(([mx, my]) => {
      const [px, py] = tp(mx, my)
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#5599ff'; ctx.fill()
    })

    if (originalPoints && onShapeDrag) {
      const n = originalPoints.length
      const ocx = originalPoints.reduce((s, [x]) => s + x, 0) / n
      const ocy = originalPoints.reduce((s, [, y]) => s + y, 0) / n
      const [px, py] = tp(ocx, ocy)
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(210,225,255,0.55)'; ctx.fill()
      ctx.strokeStyle = 'rgba(210,225,255,0.3)'; ctx.lineWidth = 1.5; ctx.stroke()
    }

    if (pivotPoint) {
      const [px, py] = tp(...pivotPoint)
      ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2)
      ctx.fillStyle = '#ff4444'; ctx.fill()
      ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,80,80,0.3)'; ctx.lineWidth = 2; ctx.stroke()
      if (showPivotLabel) {
        ctx.fillStyle = '#ff8888'; ctx.font = '11px JetBrains Mono, monospace'
        ctx.textAlign = 'left'; ctx.fillText('pivot', px + 12, py - 4)
      }
    }
  }, [originalPoints, transformedPoints, controlPoints, pivotPoint, showPivotLabel, toPixel, onShapeDrag])

  useEffect(() => {
    draw()
    const ro = new ResizeObserver(() => draw())
    if (canvasRef.current) ro.observe(canvasRef.current)
    return () => ro.disconnect()
  }, [draw])

  const getShapeCentroid = useCallback(() => {
    if (!originalPoints) return null
    const n = originalPoints.length
    return [
      originalPoints.reduce((s, [x]) => s + x, 0) / n,
      originalPoints.reduce((s, [, y]) => s + y, 0) / n,
    ]
  }, [originalPoints])

  const hitTest = useCallback((mx, my) => {
    if (pivotPoint && onPivotDrag) {
      if (distance(mx, my, pivotPoint[0], pivotPoint[1]) < HIT_PIVOT * 2) return 'pivot'
    }
    const c = getShapeCentroid()
    if (c && onShapeDrag && distance(mx, my, c[0], c[1]) < HIT_SHAPE * 3) return 'shape'
    return null
  }, [pivotPoint, onPivotDrag, getShapeCentroid, onShapeDrag])

  const onDown = useCallback((e) => {
    e.preventDefault()
    const canvas = canvasRef.current
    const W = canvas.offsetWidth; const H = canvas.offsetHeight
    const [px, py] = getPos(e)
    const [mx, my] = toMath(px, py, W, H)
    const hit = hitTest(mx, my)
    if (!hit) return
    const c = getShapeCentroid()
    dragRef.current = { type: hit, startMx: mx, startMy: my, baseCx: c?.[0] ?? 0, baseCy: c?.[1] ?? 0 }
  }, [hitTest, getShapeCentroid, toMath])

  const onMove = useCallback((e) => {
    const canvas = canvasRef.current
    const W = canvas.offsetWidth; const H = canvas.offsetHeight
    const [px, py] = getPos(e)
    const [mx, my] = toMath(px, py, W, H)
    const hit = hitTest(mx, my)
    canvas.style.cursor = dragRef.current ? 'grabbing' : hit ? 'grab' : 'default'
    if (!dragRef.current) return
    e.preventDefault()
    const snap = v => Math.round(v * 4) / 4
    if (dragRef.current.type === 'pivot' && onPivotDrag) {
      onPivotDrag(snap(mx), snap(my))
    }
    if (dragRef.current.type === 'shape' && onShapeDrag) {
      const dx = mx - dragRef.current.startMx
      const dy = my - dragRef.current.startMy
      onShapeDrag(snap(dragRef.current.baseCx + dx), snap(dragRef.current.baseCy + dy))
    }
  }, [hitTest, onPivotDrag, onShapeDrag, toMath])

  const onUp = useCallback(() => { dragRef.current = null }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
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
