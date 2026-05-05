import { describe, it, expect } from 'vitest'
import {
  applyTranslation,
  applyRotationAboutPivot,
  applyScalingAboutCenter,
  applyCombined,
  applyReflection,
  applyShear,
  translationMatrix3x3,
  rotationMatrix2x2,
  scalingMatrix2x2,
  shearMatrix,
  reflectionMatrix,
  getShape,
  round,
  centroid,
} from './math.js'

const TRI = [[-2, -1.5], [0, 2.5], [2, -1.5]]

describe('round', () => {
  it('rounds to 2 decimals by default', () => {
    expect(round(1.2345)).toBe(1.23)
  })
  it('rounds to 0 decimals', () => {
    expect(round(1.6, 0)).toBe(2)
  })
})

describe('centroid', () => {
  it('computes triangle centroid', () => {
    const [cx, cy] = centroid(TRI)
    expect(cx).toBeCloseTo(0)
    expect(cy).toBeCloseTo(-0.17, 1)
  })
})

describe('getShape', () => {
  it('returns 3 points for triangle', () => {
    expect(getShape('triangle', 0, 0)).toHaveLength(3)
  })
  it('returns 4 points for square', () => {
    expect(getShape('square', 0, 0)).toHaveLength(4)
  })
  it('returns 4 points for rectangle', () => {
    expect(getShape('rectangle', 0, 0)).toHaveLength(4)
  })
  it('returns 5 points for pentagon', () => {
    expect(getShape('pentagon', 0, 0)).toHaveLength(5)
  })
  it('returns 6 points for hexagon', () => {
    expect(getShape('hexagon', 0, 0)).toHaveLength(6)
  })
  it('returns 10 points for star', () => {
    expect(getShape('star', 0, 0)).toHaveLength(10)
  })
  it('offsets shape by cx/cy', () => {
    const pts = getShape('square', 3, 4)
    const [cx, cy] = centroid(pts)
    expect(cx).toBeCloseTo(3)
    expect(cy).toBeCloseTo(4)
  })
})

describe('applyTranslation', () => {
  it('translates all points', () => {
    const result = applyTranslation([[0, 0], [1, 1]], 2, 3)
    expect(result).toEqual([[2, 3], [3, 4]])
  })
  it('identity when dx=dy=0', () => {
    expect(applyTranslation(TRI, 0, 0)).toEqual(TRI)
  })
})

describe('translationMatrix3x3', () => {
  it('has dx/dy in last column', () => {
    const m = translationMatrix3x3(3, -2)
    expect(m[0][2]).toBe(3)
    expect(m[1][2]).toBe(-2)
    expect(m[2]).toEqual([0, 0, 1])
  })
})

describe('applyRotationAboutPivot', () => {
  it('0 degrees = identity', () => {
    const result = applyRotationAboutPivot([[1, 0]], 0, 0, 0)
    expect(result[0][0]).toBeCloseTo(1)
    expect(result[0][1]).toBeCloseTo(0)
  })
  it('90 degrees rotates (1,0) to (0,1)', () => {
    const [[x, y]] = applyRotationAboutPivot([[1, 0]], 90, 0, 0)
    expect(x).toBeCloseTo(0)
    expect(y).toBeCloseTo(1)
  })
  it('180 degrees rotates (1,0) to (-1,0)', () => {
    const [[x, y]] = applyRotationAboutPivot([[1, 0]], 180, 0, 0)
    expect(x).toBeCloseTo(-1)
    expect(y).toBeCloseTo(0)
  })
  it('rotates about pivot', () => {
    const [[x, y]] = applyRotationAboutPivot([[2, 0]], 90, 1, 0)
    expect(x).toBeCloseTo(1)
    expect(y).toBeCloseTo(1)
  })
})

describe('rotationMatrix2x2', () => {
  it('at 0 degrees is identity', () => {
    const m = rotationMatrix2x2(0)
    expect(m[0][0]).toBeCloseTo(1)
    expect(m[1][1]).toBeCloseTo(1)
    expect(m[0][1]).toBeCloseTo(0)
  })
  it('at 90 degrees has cos=0 sin=1', () => {
    const m = rotationMatrix2x2(90)
    expect(m[0][0]).toBeCloseTo(0)
    expect(m[1][0]).toBeCloseTo(1)
  })
})

describe('applyScalingAboutCenter', () => {
  it('uniform scale doubles distances from center', () => {
    const result = applyScalingAboutCenter([[1, 0]], 2, 2, 0, 0)
    expect(result[0]).toEqual([2, 0])
  })
  it('identity when sx=sy=1', () => {
    const result = applyScalingAboutCenter(TRI, 1, 1, 0, 0)
    result.forEach(([x, y], i) => {
      expect(x).toBeCloseTo(TRI[i][0])
      expect(y).toBeCloseTo(TRI[i][1])
    })
  })
  it('negative sx reflects across Y axis', () => {
    const [[x]] = applyScalingAboutCenter([[2, 0]], -1, 1, 0, 0)
    expect(x).toBe(-2)
  })
})

describe('scalingMatrix2x2', () => {
  it('has sx/sy on diagonal', () => {
    const m = scalingMatrix2x2(3, -2)
    expect(m[0][0]).toBe(3)
    expect(m[1][1]).toBe(-2)
    expect(m[0][1]).toBe(0)
    expect(m[1][0]).toBe(0)
  })
})

describe('applyCombined', () => {
  it('no transform = identity at theta=0, sx=sy=1, dx=dy=0', () => {
    const result = applyCombined([[1, 0]], 0, 1, 1, 0, 0)
    expect(result[0][0]).toBeCloseTo(1)
    expect(result[0][1]).toBeCloseTo(0)
  })
  it('pure translation works', () => {
    const result = applyCombined([[0, 0]], 0, 1, 1, 3, 4)
    expect(result[0]).toEqual([3, 4])
  })
})

describe('applyReflection', () => {
  it('reflects over X axis: y flips', () => {
    const [[x, y]] = applyReflection([[2, 3]], 'x')
    expect(x).toBe(2)
    expect(y).toBe(-3)
  })
  it('reflects over Y axis: x flips', () => {
    const [[x, y]] = applyReflection([[2, 3]], 'y')
    expect(x).toBe(-2)
    expect(y).toBe(3)
  })
  it('reflects over origin: both flip', () => {
    const [[x, y]] = applyReflection([[2, 3]], 'origin')
    expect(x).toBe(-2)
    expect(y).toBe(-3)
  })
  it('reflects over 45° line swaps x and y', () => {
    const [[x, y]] = applyReflection([[3, 1]], 'line', 45)
    expect(x).toBeCloseTo(1)
    expect(y).toBeCloseTo(3)
  })
})

describe('reflectionMatrix', () => {
  it('X axis matrix has [1,0],[0,-1]', () => {
    expect(reflectionMatrix('x')).toEqual([[1, 0], [0, -1]])
  })
  it('Y axis matrix has [-1,0],[0,1]', () => {
    expect(reflectionMatrix('y')).toEqual([[-1, 0], [0, 1]])
  })
})

describe('applyShear', () => {
  it('horizontal shear kx: x += kx*y', () => {
    const [[x, y]] = applyShear([[1, 2]], 0.5, 0)
    expect(x).toBeCloseTo(2)
    expect(y).toBe(2)
  })
  it('vertical shear ky: y += ky*x', () => {
    const [[x, y]] = applyShear([[3, 1]], 0, 2)
    expect(x).toBe(3)
    expect(y).toBeCloseTo(7)
  })
  it('identity when kx=ky=0', () => {
    const result = applyShear([[1, 2]], 0, 0)
    expect(result[0]).toEqual([1, 2])
  })
})

describe('shearMatrix', () => {
  it('has kx and ky in off-diagonal', () => {
    const m = shearMatrix(2, 3)
    expect(m[0]).toEqual([1, 2])
    expect(m[1]).toEqual([3, 1])
  })
})
