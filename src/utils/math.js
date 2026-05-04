export function toRad(deg) {
  return (deg * Math.PI) / 180
}

export function round(v, decimals = 2) {
  return Math.round(v * 10 ** decimals) / 10 ** decimals
}

export function distance(ax, ay, bx, by) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2)
}

export function centroid(points) {
  const n = points.length
  return [
    points.reduce((s, [x]) => s + x, 0) / n,
    points.reduce((s, [, y]) => s + y, 0) / n
  ]
}

export const SHAPES = [
  { id: 'triangle',  label: 'Triangle' },
  { id: 'square',    label: 'Square' },
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'pentagon',  label: 'Pentagon' },
  { id: 'hexagon',   label: 'Hexagon' },
  { id: 'star',      label: 'Star' },
  { id: 'diamond',   label: 'Diamond' },
]

export function getShape(type, cx = 0, cy = 0) {
  switch (type) {
    case 'triangle':
      return [
        [cx - 2,   cy - 1.5],
        [cx,       cy + 2.5],
        [cx + 2,   cy - 1.5],
      ]
    case 'square':
      return [
        [cx - 2, cy - 2],
        [cx + 2, cy - 2],
        [cx + 2, cy + 2],
        [cx - 2, cy + 2],
      ]
    case 'rectangle':
      return [
        [cx - 3,   cy - 1.5],
        [cx + 3,   cy - 1.5],
        [cx + 3,   cy + 1.5],
        [cx - 3,   cy + 1.5],
      ]
    case 'pentagon': {
      const n = 5
      return Array.from({ length: n }, (_, i) => {
        const a = toRad(-90 + (360 / n) * i)
        return [round(cx + 2.5 * Math.cos(a)), round(cy + 2.5 * Math.sin(a))]
      })
    }
    case 'hexagon': {
      const n = 6
      return Array.from({ length: n }, (_, i) => {
        const a = toRad((360 / n) * i)
        return [round(cx + 2.5 * Math.cos(a)), round(cy + 2.5 * Math.sin(a))]
      })
    }
    case 'star': {
      const points = []
      for (let i = 0; i < 10; i++) {
        const a = toRad(-90 + 36 * i)
        const r = i % 2 === 0 ? 2.8 : 1.2
        points.push([round(cx + r * Math.cos(a)), round(cy + r * Math.sin(a))])
      }
      return points
    }
    case 'diamond':
      return [
        [cx,       cy + 3],
        [cx + 2,   cy],
        [cx,       cy - 3],
        [cx - 2,   cy],
      ]
    default:
      return getShape('triangle', cx, cy)
  }
}

export function applyTranslation(points, dx, dy) {
  return points.map(([x, y]) => [x + dx, y + dy])
}

export function applyRotationAboutPivot(points, deg, px, py) {
  const r = toRad(deg)
  const c = Math.cos(r)
  const s = Math.sin(r)
  return points.map(([x, y]) => {
    const tx = x - px
    const ty = y - py
    return [round(c * tx - s * ty + px), round(s * tx + c * ty + py)]
  })
}

export function applyScalingAboutCenter(points, sx, sy, cx, cy) {
  return points.map(([x, y]) => [
    round(sx * (x - cx) + cx),
    round(sy * (y - cy) + cy)
  ])
}

export function applyCombined(points, theta, sx, sy, dx, dy) {
  const r = toRad(theta)
  const c = Math.cos(r)
  const s = Math.sin(r)
  return points.map(([x, y]) => {
    const rx = c * x - s * y
    const ry = s * x + c * y
    return [round(sx * rx + dx), round(sy * ry + dy)]
  })
}

export function translationMatrix3x3(dx, dy) {
  return [
    [1, 0, round(dx)],
    [0, 1, round(dy)],
    [0, 0, 1]
  ]
}

export function rotationMatrix2x2(deg) {
  const r = toRad(deg)
  return [
    [round(Math.cos(r)), round(-Math.sin(r))],
    [round(Math.sin(r)), round(Math.cos(r))]
  ]
}

export function scalingMatrix2x2(sx, sy) {
  return [
    [round(sx), 0],
    [0, round(sy)]
  ]
}

export function combinedMatrix3x3(theta, sx, sy, dx, dy) {
  const r = toRad(theta)
  const c = Math.cos(r)
  const s = Math.sin(r)
  return [
    [round(sx * c),  round(-sx * s), round(dx)],
    [round(sy * s),  round(sy * c),  round(dy)],
    [0,              0,              1]
  ]
}

export function build4x4Matrix(rotX, rotY, rotZ, sx, sy, sz, tx, ty, tz) {
  const rx = toRad(rotX), ry = toRad(rotY), rz = toRad(rotZ)
  const cx = Math.cos(rx), sx2 = Math.sin(rx)
  const cy = Math.cos(ry), sy2 = Math.sin(ry)
  const cz = Math.cos(rz), sz2 = Math.sin(rz)
  return [
    [round(sx * cy * cz),  round(sy * (cz * sx2 * sy2 - cx * sz2)), round(sz * (cx * cz * sy2 + sx2 * sz2)), round(tx)],
    [round(sx * cy * sz2), round(sy * (cx * cz + sx2 * sy2 * sz2)), round(sz * (-cz * sx2 + cx * sy2 * sz2)), round(ty)],
    [round(sx * -sy2),     round(sy * cy * sx2),                    round(sz * cx * cy),                      round(tz)],
    [0, 0, 0, 1]
  ]
}
