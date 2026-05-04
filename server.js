import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

const EXPLANATIONS = {
  translation: `A shift in space — the shape and size remain perfectly unchanged. Translation uses homogeneous coordinates so it can fit inside a single matrix multiplication rather than an additive operation. The 3x3 matrix in 2D encodes the displacement in the last column. Every point (x, y) moves by the same vector (dx, dy), preserving all distances and angles.`,
  rotation: `Rigid rotation around a pivot point. The rotation matrix encodes cos and sin in a 2x2 orthogonal structure, preserving lengths and angles. When the pivot is not the origin, translate to origin, rotate, translate back. The determinant is always 1 — orientation-preserving and area-preserving.`,
  scaling: `Scaling stretches or shrinks the shape relative to a center. Negative scale values cause reflection. The center works like a rotation pivot: translate, scale, translate back. When |sx*sy| is not 1, areas change by that factor.`,
  combined: `Chaining transformations multiplies their matrices into one combined matrix. Order matters: T*S*R is not equal to R*S*T. The combined matrix is column-major: to transform a point, multiply on the left. This is the foundation of every graphics pipeline.`,
  '3d': `In 3D, transformations use 4x4 homogeneous matrices. The TRS decomposition (Translation x Rotation x Scale) is standard in game engines. Rotations combine Euler angles around X, Y, Z axes. Be aware of gimbal lock when two axes align. WebGL and Three.js both use column-major 4x4 matrices internally.`
}

app.get('/api/explain', (req, res) => {
  const { type } = req.query
  if (!type) return res.status(400).json({ error: 'Missing type parameter' })
  const explanation = EXPLANATIONS[type]
  if (!explanation) return res.status(404).json({ error: `No explanation for type: ${type}` })
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.json({ type, explanation })
})

app.use(express.static(join(__dirname, 'dist')))

app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
