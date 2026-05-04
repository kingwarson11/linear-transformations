import { useEffect, useRef, useCallback } from 'react'

const RANGE = 10

export default function Canvas2D({
  originalPoints,
  transformedPoints,
  controlPoints = [],
  pivotPoint = null,
  showPivotLabel = false
}) {
  const canvasRef = useRef(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    if (W === 0 || H === 0) return

    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const toPixel = (mx, my) => [
      W / 2 + (mx / RANGE) * (W / 2),
      H / 2 - (my / RANGE) * (H / 2)
    ]

    ctx.fillStyle = '#0f1117'
    ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = '#1c2d4a'
    ctx.lineWidth = 0.5
    for (let i = -RANGE; i <= RANGE; i++) {
      const [px] = toPixel(i, 0)
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke()
      const [, py] = toPixel(0, i)
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke()
    }

    ctx.strokeStyle = '#243b60'
    ctx.lineWidth = 1
    for (let i = -RANGE; i <= RANGE; i += 2) {
      const [px] = toPixel(i, 0)
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke()
      const [, py] = toPixel(0, i)
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke()
    }

    const [cx, cy] = toPixel(0, 0)
    ctx.strokeStyle = '#3a6aaa'
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke()

    ctx.fillStyle = '#5a7aaa'
    ctx.font = `${Math.max(10, W * 0.013)}px JetBrains Mono, monospace`
    for (let i = -RANGE + 2; i <= RANGE - 2; i += 2) {
      if (i === 0) continue
      const [px] = toPixel(i, 0)
      ctx.textAlign = 'center'
      ctx.fillText(i, px, cy + 16)
      const [, py] = toPixel(0, i)
      ctx.textAlign = 'right'
      ctx.fillText(i, cx - 8, py + 4)
    }

    const drawPoly = (points, fillColor, strokeColor, lineWidth, dashed) => {
      if (!points || points.length < 2) return
      ctx.beginPath()
      const [sx, sy] = toPixel(...points[0])
      ctx.moveTo(sx, sy)
      for (let i = 1; i < points.length; i++) {
        const [px, py] = toPixel(...points[i])
        ctx.lineTo(px, py)
      }
      ctx.closePath()
      if (fillColor) { ctx.fillStyle = fillColor; ctx.fill() }
      ctx.setLineDash(dashed ? [6, 4] : [])
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = lineWidth
      ctx.stroke()
      ctx.setLineDash([])
    }

    drawPoly(originalPoints, 'rgba(130,145,175,0.2)', 'rgba(170,185,220,0.7)', 1.5, true)
    drawPoly(transformedPoints, 'rgba(55,120,240,0.3)', '#5599ff', 2.5, false)

    controlPoints.forEach(([mx, my]) => {
      const [px, py] = toPixel(mx, my)
      ctx.beginPath()
      ctx.arc(px, py, 5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(180,195,230,0.8)'
      ctx.fill()
    })

    if (pivotPoint) {
      const [px, py] = toPixel(...pivotPoint)
      ctx.beginPath()
      ctx.arc(px, py, 6, 0, Math.PI * 2)
      ctx.fillStyle = '#ff4444'
      ctx.fill()
      if (showPivotLabel) {
        ctx.fillStyle = '#ff7777'
        ctx.font = '11px JetBrains Mono, monospace'
        ctx.textAlign = 'left'
        ctx.fillText('pivot', px + 9, py - 4)
      }
    }

    if (transformedPoints) {
      transformedPoints.forEach(([mx, my]) => {
        const [px, py] = toPixel(mx, my)
        ctx.beginPath()
        ctx.arc(px, py, 4.5, 0, Math.PI * 2)
        ctx.fillStyle = '#5599ff'
        ctx.fill()
      })
    }
  }, [originalPoints, transformedPoints, controlPoints, pivotPoint, showPivotLabel])

  useEffect(() => {
    draw()
    const ro = new ResizeObserver(() => draw())
    if (canvasRef.current) ro.observe(canvasRef.current)
    return () => ro.disconnect()
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
