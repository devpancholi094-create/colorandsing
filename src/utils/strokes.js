// Freehand painting helpers shared by the coloring canvas, thumbnails and the stage.
// Strokes are stored as plain data: { tool, color, size, points: [[x, y], ...] } in
// 400 x 400 drawing units, so they can be replayed (undo/redo), saved, and scaled.
import { VIEW } from '../config.js';

const pathCache = new WeakMap();

/** One Path2D per region, cached per artwork object. */
export function getRegionPaths(art) {
  let paths = pathCache.get(art);
  if (!paths) {
    paths = art.regions.map((r) => new Path2D(r.d));
    pathCache.set(art, paths);
  }
  return paths;
}

let hitContext = null;
function getHitContext() {
  if (!hitContext) hitContext = document.createElement('canvas').getContext('2d');
  return hitContext;
}

/** Topmost region containing the point (x, y in drawing units), or null. */
export function findRegionAt(art, x, y) {
  const ctx = getHitContext();
  const paths = getRegionPaths(art);
  for (let i = paths.length - 1; i >= 0; i -= 1) {
    if (ctx.isPointInPath(paths[i], x, y)) return art.regions[i].id;
  }
  return null;
}

function applyStyle(ctx, stroke) {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = stroke.size;
  if (stroke.tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = '#000';
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = stroke.color;
  }
}

function tracePoints(ctx, points) {
  ctx.beginPath();
  if (points.length === 1) {
    ctx.moveTo(points[0][0], points[0][1]);
    ctx.lineTo(points[0][0] + 0.01, points[0][1]); // round cap makes a dot
    return;
  }
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length - 1; i += 1) {
    const [x, y] = points[i];
    const [nx, ny] = points[i + 1];
    ctx.quadraticCurveTo(x, y, (x + nx) / 2, (y + ny) / 2);
  }
  const last = points[points.length - 1];
  ctx.lineTo(last[0], last[1]);
}

// Paint is clipped to each region in turn, so brush strokes stay inside the picture.
function paintClipped(ctx, regionPaths, stroke, trace) {
  for (const path of regionPaths) {
    ctx.save();
    ctx.clip(path);
    applyStyle(ctx, stroke);
    trace();
    ctx.stroke();
    ctx.restore();
  }
}

function setUnits(ctx, canvas) {
  const scale = canvas.width / VIEW;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

export function drawStroke(canvas, regionPaths, stroke) {
  const ctx = canvas.getContext('2d');
  setUnits(ctx, canvas);
  paintClipped(ctx, regionPaths, stroke, () => tracePoints(ctx, stroke.points));
}

export function drawSegment(canvas, regionPaths, stroke, from, to) {
  const ctx = canvas.getContext('2d');
  setUnits(ctx, canvas);
  paintClipped(ctx, regionPaths, stroke, () => {
    ctx.beginPath();
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
  });
}

export function redrawAll(canvas, regionPaths, strokes) {
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const stroke of strokes) drawStroke(canvas, regionPaths, stroke);
}

/** Paint all strokes to an offscreen canvas and return a PNG data URL (or null). */
export function renderStrokesToDataURL(art, strokes, size = 800) {
  if (!strokes.length) return null;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    redrawAll(canvas, getRegionPaths(art), strokes);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

// ---- Compacting strokes so saved artwork stays small ----------------------
function distanceToSegment(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / lengthSq));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

/** Ramer-Douglas-Peucker simplification + rounding to 1 decimal. */
export function compactPoints(points, tolerance = 0.7) {
  let kept = points;
  if (points.length > 2) {
    const keep = new Uint8Array(points.length);
    keep[0] = 1;
    keep[points.length - 1] = 1;
    const stack = [[0, points.length - 1]];
    while (stack.length) {
      const [a, b] = stack.pop();
      let maxDistance = 0;
      let index = -1;
      for (let i = a + 1; i < b; i += 1) {
        const d = distanceToSegment(points[i], points[a], points[b]);
        if (d > maxDistance) {
          maxDistance = d;
          index = i;
        }
      }
      if (maxDistance > tolerance && index > -1) {
        keep[index] = 1;
        stack.push([a, index], [index, b]);
      }
    }
    kept = points.filter((_, i) => keep[i]);
  }
  return kept.map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
}
