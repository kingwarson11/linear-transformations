# Linear Transformations Visualizer

An interactive tool for exploring how 2D and 3D linear transformations work — built for students, developers, and anyone learning linear algebra or computer graphics.

## What it does

You manipulate sliders and watch a shape transform in real time on a coordinate grid. Every change instantly updates the transformation matrix and formula, so you can see the math behind the movement.

## The 5 transformation modes

**Translation** — Move a shape along the X and Y axes. See how the homogeneous 3×3 matrix encodes displacement, and why translation cannot be represented as a simple 2×2 matrix multiplication without homogeneous coordinates.

**Rotation** — Rotate a shape around any pivot point you choose. Drag the angle slider from −180° to 180° and watch the 2×2 rotation matrix update with live cos(θ) and sin(θ) values.

**Scaling** — Stretch or shrink a shape from a configurable center point. Use negative scale values to reflect across an axis. The 2×2 scaling matrix updates in real time.

**Combined** — Chain rotation → scaling → translation into one operation. This tab demonstrates why order matters: T·S·R ≠ R·S·T. The resulting 3×3 homogeneous matrix is the product of all three.

**3D Transformations** — Apply rotation (X, Y, Z axes), scale, and translation to a 3D cube rendered with Three.js. The full 4×4 column-major matrix updates live as you move the sliders.

## Stack

- React 18 + Vite
- Three.js for 3D rendering
- HTML5 Canvas API for 2D rendering
- Express.js server (serves both the app and the `/api/explain` endpoint)
- Deployed on Render
