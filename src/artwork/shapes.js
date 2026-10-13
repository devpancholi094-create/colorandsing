// Tiny helpers for authoring SVG path data. All artwork is original and drawn here.
import { VIEW } from '../config.js';

export const INK = '#2d2a4a';

const round = (n) => Math.round(n * 100) / 100;

/** Ellipse as one closed path (so it works for SVG, Path2D clipping and hit-testing). */
export const ellipse = (cx, cy, rx, ry) =>
  `M${round(cx - rx)} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;

export const circle = (cx, cy, r) => ellipse(cx, cy, r, r);

export function roundRect(x, y, w, h, radius) {
  const r = Math.min(radius, w / 2, h / 2);
  return (
    `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}` +
    `V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}` +
    `H${x + r}Q${x} ${y + h} ${x} ${y + h - r}` +
    `V${y + r}Q${x} ${y} ${x + r} ${y}Z`
  );
}

/**
 * Mirror an absolute-command path (M L C Q H V Z only) left <-> right.
 * Used to build symmetric artwork (butterfly wings, rocket fins) from one half.
 */
export function mirror(d, axis = VIEW) {
  const tokens = d.match(/[MLCQZHV]|-?\d*\.?\d+/g) || [];
  let out = '';
  let cmd = '';
  let index = 0;
  for (const token of tokens) {
    if (/[A-Z]/.test(token)) {
      cmd = token;
      index = 0;
      out += token;
      continue;
    }
    let value = parseFloat(token);
    if ('MLCQ'.includes(cmd) && index % 2 === 0) value = axis - value;
    if (cmd === 'H') value = axis - value;
    index += 1;
    out += ` ${round(value)}`;
  }
  return out;
}
