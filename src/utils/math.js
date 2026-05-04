export const DEFAULT_TRIANGLE = [
  [-2, -1.5],
  [0, 2.5],
  [2, -1.5]
]

export function toRad(deg) {
  return (deg * Math.PI) / 180
}

export function toDeg(rad) {
  return (rad * 180) / Math.PI
}

export function round(v, decimals = 2) {
  return Math.round(v * 10 ** decimals) / 10 ** decimals
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
    return [
      round(c * tx - s * ty + px),
      round(s * tx + c * ty + py)
    ]
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
    const scx = sx * rx
    const scy = sy * ry
    return [round(scx + dx), round(scy + dy)]
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
  const c = round(Math.cos(r))
  const s = round(Math.sin(r))
  return [
    [c, -s],
    [s, c]
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
  // T * S * R
  const m00 = round(sx * c)
  const m01 = round(-sx * s)
  const m10 = round(sy * s)
  const m11 = round(sy * c)
  return [
    [m00, m01, round(dx)],
    [m10, m11, round(dy)],
    [0, 0, 1]
  ]
}

export function build4x4Matrix(rotX, rotY, rotZ, sx, sy, sz, tx, ty, tz) {
  const rx = toRad(rotX)
  const ry = toRad(rotY)
  const rz = toRad(rotZ)

  const cx = Math.cos(rx), sx2 = Math.sin(rx)
  const cy = Math.cos(ry), sy2 = Math.sin(ry)
  const cz = Math.cos(rz), sz2 = Math.sin(rz)

  // Rotation matrix Rz * Ry * Rx
  const r00 = cy * cz
  const r01 = cz * sx2 * sy2 - cx * sz2
  const r02 = cx * cz * sy2 + sx2 * sz2
  const r10 = cy * sz2
  const r11 = cx * cz + sx2 * sy2 * sz2
  const r12 = -cz * sx2 + cx * sy2 * sz2
  const r20 = -sy2
  const r21 = cy * sx2
  const r22 = cx * cy

  return [
    [round(sx * r00), round(sy * r01), round(sz * r02), round(tx)],
    [round(sx * r10), round(sy * r11), round(sz * r12), round(ty)],
    [round(sx * r20), round(sy * r21), round(sz * r22), round(tz)],
    [0, 0, 0, 1]
  ]
}

export function centroid(points) {
  const n = points.length
  return [
    points.reduce((s, [x]) => s + x, 0) / n,
    points.reduce((s, [, y]) => s + y, 0) / n
  ]
}
