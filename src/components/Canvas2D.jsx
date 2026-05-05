import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react'
import { distance } from '../utils/math'

const RANGE = 10
const HIT_VERTEX = 0.6
const HIT_SHAPE  = 1.4
const HIT_PIVOT  = 0.8

const Canvas2D = forwardRef(function Canvas2D({
  originalPoints,
  transformedPoints,
  controlPoints = [],
  pivotPoint = null,
  showPivotLabel = false,
  onShapeDrag,
  onPivotDrag,
  onVertexDrag,
}, ref) {
  const canvasRef = useRef(null)
  const dragRef   = useRef(null)

  useImperativeHandle(ref, () => ({ canvas: canvasRef.current }), [])

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
    const src  = e.touches ? e.touches[0] : e
    return [src.clientX - rect.left, src.clientY - rect.top]
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const W   = canvas.offsetWidth
    const H   = canvas.offsetHeight
    if (!W || !H) return

    canvas.width  = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const tp = (mx, my) => toPixel(mx, my, W, H)

    ctx.fillStyle = '#07090d'
    ctx.fillRect(0, 0, W, H)

    ctx.fillStyle = 'rgba(30,48,80,0.35)'
    for (let x = 0; x < W; x += 20)
      for (let y = 0; y < H; y += 20)
        ctx.fillRect(x, y, 1, 1)

    ctx.strokeStyle = 'rgba(26,42,70,0.8)'; ctx.lineWidth = 0.5
    for (let i = -RANGE; i <= RANGE; i++) {
      const [px] = tp(i, 0); ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke()
      const [,py] = tp(0, i); ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke()
    }

    ctx.strokeStyle = 'rgba(30,52,90,0.9)'; ctx.lineWidth = 1
    for (let i = -RANGE; i <= RANGE; i += 2) {
      const [px] = tp(i, 0); ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke()
      const [,py] = tp(0, i); ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke()
    }

    const [axX, axY] = tp(0, 0)
    ctx.shadowColor = 'rgba(0,180,255,0.2)'; ctx.shadowBlur = 8
    ctx.strokeStyle = 'rgba(40,100,180,0.8)'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(0, axY); ctx.lineTo(W, axY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(axX, 0); ctx.lineTo(axX, H); ctx.stroke()
    ctx.shadowBlur = 0

    ctx.beginPath(); ctx.arc(axX, axY, 3, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,180,255,0.5)'; ctx.fill()

    ctx.fillStyle = 'rgba(90,120,170,0.8)'
    ctx.font = `${Math.max(9, W * 0.012)}px JetBrains Mono, monospace`
    for (let i = -RANGE + 2; i <= RANGE - 2; i += 2) {
      if (i === 0) continue
      const [px] = tp(i, 0); ctx.textAlign = 'center'; ctx.fillText(i, px, axY + 16)
      const [,py] = tp(0, i); ctx.textAlign = 'right';  ctx.fillText(i, axX - 8, py + 4)
    }

    const drawPoly = (pts, fill, stroke, lw, dashed, glowColor) => {
      if (!pts || pts.length < 2) return
      ctx.beginPath()
      ctx.moveTo(...tp(...pts[0]))
      for (let i = 1; i < pts.length; i++) ctx.lineTo(...tp(...pts[i]))
      ctx.closePath()
      if (fill) { ctx.fillStyle = fill; ctx.fill() }
      ctx.setLineDash(dashed ? [5, 4] : [])
      if (glowColor) { ctx.shadowColor = glowColor; ctx.shadowBlur = 12 }
      ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke()
      ctx.shadowBlur = 0; ctx.setLineDash([])
    }

    drawPoly(originalPoints, 'rgba(100,120,160,0.1)', 'rgba(150,170,210,0.5)', 1.5, true, null)
    drawPoly(transformedPoints, 'rgba(0,229,255,0.08)', '#00e5ff', 2, false, 'rgba(0,229,255,0.4)')

    controlPoints.forEach(([mx, my]) => {
      const [px, py] = tp(mx, my)
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(180,200,240,0.6)'; ctx.fill()
    })

    transformedPoints?.forEach(([mx, my]) => {
      const [px, py] = tp(mx, my)
      ctx.shadowColor = 'rgba(0,229,255,0.6)'; ctx.shadowBlur = 8
      ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#00e5ff'; ctx.fill()
      ctx.shadowBlur = 0
    })

    if (originalPoints && onVertexDrag) {
      originalPoints.forEach(([mx, my]) => {
        const [px, py] = tp(mx, my)
        ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(180,200,255,0.25)'; ctx.fill()
        ctx.strokeStyle = 'rgba(180,200,255,0.5)'; ctx.lineWidth = 1; ctx.stroke()
      })
    }

    if (originalPoints && onShapeDrag) {
      const n   = originalPoints.length
      const ocx = originalPoints.reduce((s, [x]) => s + x, 0) / n
      const ocy = originalPoints.reduce((s, [,y]) => s + y, 0) / n
      const [px, py] = tp(ocx, ocy)
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(200,220,255,0.15)'; ctx.fill()
      ctx.strokeStyle = 'rgba(200,220,255,0.3)'; ctx.lineWidth = 1; ctx.stroke()
    }

    if (pivotPoint) {
      const [px, py] = tp(...pivotPoint)
      ctx.shadowColor = 'rgba(255,51,102,0.5)'; ctx.shadowBlur = 12
      ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2)
      ctx.fillStyle = '#ff3366'; ctx.fill()
      ctx.shadowBlur = 0
      ctx.beginPath(); ctx.arc(px, py, 11, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,51,102,0.2)'; ctx.lineWidth = 2; ctx.stroke()
      if (showPivotLabel) {
        ctx.fillStyle = '#ff6688'; ctx.font = '10px JetBrains Mono, monospace'
        ctx.textAlign = 'left'; ctx.fillText('pivot', px + 13, py - 4)
      }
    }
  }, [originalPoints, transformedPoints, controlPoints, pivotPoint, showPivotLabel, toPixel, onShapeDrag, onVertexDrag])

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
      originalPoints.reduce((s, [,y]) => s + y, 0) / n,
    ]
  }, [originalPoints])

  const hitTest = useCallback((mx, my) => {
    if (pivotPoint && onPivotDrag) {
      if (distance(mx, my, pivotPoint[0], pivotPoint[1]) < HIT_PIVOT * 2)
        return { type: 'pivot' }
    }
    if (originalPoints && onVertexDrag) {
      for (let i = 0; i < originalPoints.length; i++) {
        if (distance(mx, my, originalPoints[i][0], originalPoints[i][1]) < HIT_VERTEX * 2)
          return { type: 'vertex', index: i }
      }
    }
    const c = getShapeCentroid()
    if (c && onShapeDrag && distance(mx, my, c[0], c[1]) < HIT_SHAPE * 2)
      return { type: 'shape' }
    return null
  }, [pivotPoint, onPivotDrag, originalPoints, onVertexDrag, getShapeCentroid, onShapeDrag])

  const onDown = useCallback((e) => {
    const canvas = canvasRef.current
    const [px, py] = getPos(e)
    const [mx, my] = toMath(px, py, canvas.offsetWidth, canvas.offsetHeight)
    const hit = hitTest(mx, my)
    if (!hit) return
    e.preventDefault()
    const c = getShapeCentroid()
    dragRef.current = {
      ...hit,
      startMx: mx, startMy: my,
      baseCx: c?.[0] ?? 0, baseCy: c?.[1] ?? 0,
    }
  }, [hitTest, getShapeCentroid, toMath])

  const onMove = useCallback((e) => {
    const canvas = canvasRef.current
    const [px, py] = getPos(e)
    const [mx, my] = toMath(px, py, canvas.offsetWidth, canvas.offsetHeight)
    const hit = hitTest(mx, my)
    canvas.style.cursor = dragRef.current ? 'grabbing' : hit ? 'grab' : 'crosshair'
    if (!dragRef.current) return
    e.preventDefault()
    const snap = v => Math.round(v * 4) / 4

    if (dragRef.current.type === 'pivot' && onPivotDrag)
      onPivotDrag(snap(mx), snap(my))

    if (dragRef.current.type === 'vertex' && onVertexDrag)
      onVertexDrag(dragRef.current.index, snap(mx), snap(my))

    if (dragRef.current.type === 'shape' && onShapeDrag) {
      const dx = mx - dragRef.current.startMx
      const dy = my - dragRef.current.startMy
      onShapeDrag(snap(dragRef.current.baseCx + dx), snap(dragRef.current.baseCy + dy))
    }
  }, [hitTest, onPivotDrag, onVertexDrag, onShapeDrag, toMath])

  const onUp = useCallback(() => { dragRef.current = null }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair' }}
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={onDown}
      onTouchMove={onMove}
      onTouchEnd={onUp}
    />
  )
})

export default Canvas2D
