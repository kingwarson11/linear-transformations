# Linear Transformations Visualizer

An interactive tool for exploring how 2D and 3D linear transformations work — built for students, developers, and anyone learning linear algebra or computer graphics.

**Live demo:** https://linear-transformations.onrender.com

## What it does

You manipulate sliders and watch a shape transform in real time on a coordinate grid. Every change instantly updates the transformation matrix and formula, so you can see the math behind the movement.

You can also drag the shape directly on the canvas to reposition it, drag the pivot/center point, and choose from 7 different shapes. In the 3D tab, click and drag the canvas to orbit the cube freely.

## The 5 transformation modes

**Translation** — Move a shape along the X and Y axes. See how the homogeneous 3×3 matrix encodes displacement, and why translation cannot be represented as a simple 2×2 matrix multiplication without homogeneous coordinates.

**Rotation** — Rotate a shape around any pivot point you choose. Drag the angle slider from −180° to 180° and watch the 2×2 rotation matrix update with live cos(θ) and sin(θ) values. Drag the red pivot dot directly on the canvas.

**Scaling** — Stretch or shrink a shape from a configurable center point. Use negative scale values to reflect across an axis. The 2×2 scaling matrix updates in real time. Drag the red center dot to reposition the scaling origin.

**Combined** — Chain rotation → scaling → translation into one operation. This tab demonstrates why order matters: T·S·R ≠ R·S·T. The resulting 3×3 homogeneous matrix is the product of all three.

**3D Transformations** — Apply rotation (X, Y, Z axes), scale, and translation to a 3D cube rendered with Three.js. The full 4×4 column-major matrix updates live as you move the sliders. Drag the canvas to orbit.

## Features

- **7 shapes** — Triangle, Square, Rectangle, Pentagon, Hexagon, Star, Diamond
- **Mouse interaction** — Drag the shape to reposition its origin; drag the pivot/center point on Rotation and Scaling tabs
- **Origin inputs** — Type exact X/Y coordinates for the shape's starting position, or click Reset to center it
- **3D orbit** — Click and drag on the 3D canvas to rotate the cube freely with mouse or touch
- **Live matrices** — Every slider change instantly recomputes and displays the transformation matrix with color-coded values (cyan for positive, red for negative)
- **DPR-aware canvas** — Sharp rendering on Retina and HiDPI screens using `devicePixelRatio` scaling and `ResizeObserver`
- **Explanation panel** — Each tab loads a short explanation of the math from the `/api/explain` API route

## Stack

- React 18 + Vite
- Three.js for 3D rendering
- HTML5 Canvas API for 2D rendering
- Express.js server (serves both the app and the `/api/explain` endpoint)
- Deployed on Render

## Local development

```bash
npm install
npm run dev
```

## Deploy

The project includes a `render.yaml` blueprint. Push to GitHub and connect the repo on [dashboard.render.com](https://dashboard.render.com):

| Setting | Value |
|---|---|
| Build Command | `npm install && npm run build` |
| Start Command | `node server.js` |
| Environment | Node |

No environment variables required.

## Project structure

```
├── api/
│   └── explain.js              # Explanation text for each transformation type
├── src/
│   ├── components/
│   │   ├── Canvas2D.jsx        # DPR-aware 2D canvas with drag interaction
│   │   ├── Canvas3D.jsx        # Three.js 3D canvas with mouse orbit
│   │   ├── Slider.jsx          # Slider with filled track and cyan value
│   │   ├── MatrixDisplay.jsx   # Matrix with brackets and neon values
│   │   ├── ShapeSelector.jsx   # 7-shape grid selector
│   │   └── OriginInput.jsx     # X/Y number inputs with reset
│   ├── tabs/
│   │   ├── Translation.jsx
│   │   ├── Rotation.jsx
│   │   ├── Scaling.jsx
│   │   ├── Combined.jsx
│   │   └── Transformations3D.jsx
│   ├── utils/
│   │   └── math.js             # Pure transform functions + shape generators
│   ├── App.jsx
│   └── main.jsx
├── server.js                   # Express server
├── render.yaml                 # Render deploy config
└── vite.config.js
```
