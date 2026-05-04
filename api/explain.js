const EXPLANATIONS = {
  translation: `A shift in space — the shape and size remain perfectly unchanged. Translation uses homogeneous coordinates so it can fit inside a single matrix multiplication rather than an additive operation. The 3×3 matrix in 2D (or 4×4 in 3D) encodes the displacement in the last column. Every point (x, y) moves by the same vector (dx, dy), which means parallel lines stay parallel and all distances are preserved. Translation is an isometry — it belongs to the group of rigid-body motions alongside rotation and reflection.`,

  rotation: `Rigid rotation around a pivot point. The standard rotation matrix encodes cos(θ) and sin(θ) in a 2×2 orthogonal structure, preserving lengths and angles. When the pivot is not the origin, the transformation is: translate the pivot to the origin, rotate, then translate back — producing a 3×3 homogeneous matrix. Positive θ rotates counter-clockwise in standard math orientation. The determinant of the rotation matrix is always 1, confirming it is orientation-preserving and area-preserving.`,

  scaling: `Scaling stretches or shrinks the shape relative to a center of scaling. With sx = sy (uniform scaling), the shape grows or shrinks isotropically. With different sx and sy (non-uniform), the shape is distorted. Negative scale values cause reflection across an axis. The center of scaling works the same way as a rotation pivot: translate, scale, translate back. When |sx·sy| ≠ 1, areas change by that factor. A negative determinant indicates a reflection has occurred.`,

  combined: `When multiple transformations are applied in sequence, their matrices multiply together into a single combined matrix. The order is critical: T·S·R means rotate first, then scale, then translate — and T·S·R ≠ R·S·T in general because matrix multiplication is not commutative. The combined matrix is column-major: to transform a point, multiply on the left. This composition is the foundation of every graphics pipeline — model, view, and projection matrices are all composed this way to efficiently transform millions of vertices at once.`,

  '3d': `In 3D, transformations are encoded in 4×4 homogeneous matrices, following the same logic as 2D but extended with a Z axis. Rotations around X, Y, and Z axes are combined with Euler angles — be aware of gimbal lock when two rotation axes align. The TRS decomposition (Translation × Rotation × Scale) is the standard approach in game engines and 3D software. The rotation matrix is a 3×3 orthogonal block in the top-left; scale factors appear along the diagonal before rotation is applied; translation fills the last column. WebGL and Three.js both use column-major 4×4 matrices internally.`
}

export default function handler(req, res) {
  const { type } = req.query

  if (!type) {
    return res.status(400).json({ error: 'Missing type parameter' })
  }

  const explanation = EXPLANATIONS[type]

  if (!explanation) {
    return res.status(404).json({ error: `No explanation found for type: ${type}` })
  }

  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
  return res.status(200).json({ type, explanation })
}
