import { useEffect, useRef } from 'react'

const RANGE = 10
const GRID_MINOR = '#1a2540'
const GRID_MAJOR = '#1e3060'
const AXIS_COLOR = '#2a4880'
const TICK_COLOR = '#3a5888'
const ORIGINAL_FILL = 'rgba(100, 110, 135, 0.25)'
const ORIGINAL_STROKE = 'rgba(130, 145, 175, 0.55)'
const TRANSFORMED_FILL = 'rgba(40, 100, 210, 0.35)'
const TRANSFORMED_STROKE = '#4287f5'
const CONTROL_COLOR = '#ff4444'
const PIVOT_LABEL_COLOR = '#ff6666'

export default function Canvas2D({
  originalPoints,
  transformedPoints,
  controlPoints = [],
  pivotPoint = null,
  showPivotLabel = false
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height

    const scaleX = W / (RANGE * 2)
    const scaleY = H / (RANGE * 2)

    const toPixel = (mx, my) => [
      W / 2 + mx * scaleX,
      H / 2 - my * scaleY
    ]

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#0f1117'
    ctx.fillRect(0, 0, W, H)

    // Minor grid
    ctx.strokeStyle = GRID_MINOR
    ctx.lineWidth = 0.5
    for (let i = -RANGE; i <= RANGE; i++) {
      const [px] = toPixel(i, 0)
      ctx.beginPath()
      ctx.moveTo(px, 0)
      ctx.lineTo(px, H)
      ctx.stroke()

      const [, py] = toPixel(0, i)
      ctx.beginPath()
      ctx.moveTo(0, py)
      ctx.lineTo(W, py)
      ctx.stroke()
    }

    // Major grid (every 2 units)
    ctx.strokeStyle = GRID_MAJOR
    ctx.lineWidth = 0.8
    for (let i = -RANGE; i <= RANGE; i += 2) {
      const [px] = toPixel(i, 0)
      ctx.beginPath()
      ctx.moveTo(px, 0)
      ctx.lineTo(px, H)
      ctx.stroke()

      const [, py] = toPixel(0, i)
      ctx.beginPath()
      ctx.moveTo(0, py)
      ctx.lineTo(W, py)
      ctx.stroke()
    }

    // Axes
    ctx.strokeStyle = AXIS_COLOR
    ctx.lineWidth = 1.2
    const [cx, cy] = toPixel(0, 0)
    ctx.beginPath()
    ctx.moveTo(0, cy)
    ctx.lineTo(W, cy)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx, H)
    ctx.stroke()

    // Axis tick labels
    ctx.fillStyle = TICK_COLOR
    ctx.font = '11px JetBrains Mono, monospace'
    ctx.textAlign = 'center'
    for (let i = -RANGE; i <= RANGE; i += 2) {
      if (i === 0) continue
      const [px] = toPixel(i, 0)
      ctx.fillText(i, px, cy + 15)

      const [, py] = toPixel(0, i)
      ctx.textAlign = 'right'
      ctx.fillText(i, cx - 6, py + 4)
      ctx.textAlign = 'center'
    }

    const drawPoly = (points, fillColor, strokeColor, dashed = false) => {
      if (!points || points.length < 2) return
      ctx.beginPath()
      const [sx, sy] = toPixel(...points[0])
      ctx.moveTo(sx, sy)
      for (let i = 1; i < points.length; i++) {
        const [px, py] = toPixel(...points[i])
        ctx.lineTo(px, py)
      }
      ctx.closePath()

      if (fillColor) {
        ctx.fillStyle = fillColor
        ctx.fill()
      }

      if (dashed) {
        ctx.setLineDash([5, 4])
      } else {
        ctx.setLineDash([])
      }
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = dashed ? 1.5 : 2
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Original (dashed ghost)
    drawPoly(originalPoints, ORIGINAL_FILL, ORIGINAL_STROKE, true)

    // Transformed (solid)
    drawPoly(transformedPoints, TRANSFORMED_FILL, TRANSFORMED_STROKE, false)

    // Centroid control point dot (gray center)
    if (controlPoints) {
      controlPoints.forEach(([mx, my]) => {
        const [px, py] = toPixel(mx, my)
        ctx.beginPath()
        ctx.arc(px, py, 5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(140,160,200,0.7)'
        ctx.fill()
      })
    }

    // Pivot point
    if (pivotPoint) {
      const [px, py] = toPixel(...pivotPoint)
      ctx.beginPath()
      ctx.arc(px, py, 6, 0, Math.PI * 2)
      ctx.fillStyle = CONTROL_COLOR
      ctx.fill()

      if (showPivotLabel) {
        ctx.fillStyle = PIVOT_LABEL_COLOR
        ctx.font = '10px JetBrains Mono, monospace'
        ctx.textAlign = 'left'
        ctx.fillText('pivot', px + 8, py - 4)
      }
    }

    // Transformed vertex dots
    if (transformedPoints) {
      transformedPoints.forEach(([mx, my]) => {
        const [px, py] = toPixel(mx, my)
        ctx.beginPath()
        ctx.arc(px, py, 4, 0, Math.PI * 2)
        ctx.fillStyle = TRANSFORMED_STROKE
        ctx.fill()
      })
    }

  }, [originalPoints, transformedPoints, controlPoints, pivotPoint, showPivotLabel])

  return (
    <canvas
      ref={canvasRef}
      width={900}
      height={680}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
