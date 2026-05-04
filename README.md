# Linear Transformations Visualizer

Interactive visualizer for 2D and 3D linear transformations. Built with React + Vite + Three.js + Express.

## Deploy to Render

### Option 1 — render.yaml (auto)
1. Push to GitHub
2. Go to [dashboard.render.com](https://dashboard.render.com) → **New > Web Service**
3. Connect your repo — Render detects `render.yaml` automatically
4. Click **Deploy**

### Option 2 — Manual settings
| Setting | Value |
|---|---|
| Runtime | Node |
| Build command | `npm install && npm run build` |
| Start command | `npm start` |
| Environment | `NODE_ENV=production` |

## Local development

```bash
npm install
npm run dev        # React dev server (Vite)
npm run build && npm start  # Full production mode
```

## Project structure

```
├── server.js             # Express server (static + /api/explain)
├── render.yaml           # Render deploy config
├── api/
│   └── explain.js        # (kept for reference — not used in Render mode)
├── src/
│   ├── components/       # Canvas2D, Canvas3D, Slider, MatrixDisplay
│   ├── tabs/             # Translation, Rotation, Scaling, Combined, 3D
│   ├── utils/math.js     # Pure transformation math
│   ├── App.jsx
│   └── main.jsx
├── index.html
└── vite.config.js
```
