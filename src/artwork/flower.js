import { circle, roundRect, rotEllipse, mirror, INK } from './shapes.js';

const leafLeft = 'M188 304 C150 316 112 296 98 256 C138 248 176 266 188 292 Z';

// Eight petals around the flower center (200, 150).
const petals = Array.from({ length: 8 }, (_, i) => {
  const deg = i * 45;
  const t = (deg * Math.PI) / 180;
  return {
    id: `petal-${i + 1}`,
    label: 'Petal',
    group: 'petals',
    fill: i % 2 ? '#ff9ec2' : '#ffb3d1',
    d: rotEllipse(200 + 62 * Math.cos(t), 150 + 62 * Math.sin(t), 44, 26, deg),
  };
});

/** Flower in a pot, with a smiling center. */
export const flowerArt = {
  regions: [
    { id: 'stem', label: 'Stem', group: 'stem', fill: '#6fcf97', d: roundRect(186, 200, 28, 150, 12) },
    { id: 'leaf-left', label: 'Leaf', group: 'leafL', fill: '#8fe0a8', d: leafLeft },
    { id: 'leaf-right', label: 'Leaf', group: 'leafR', fill: '#8fe0a8', d: mirror(leafLeft) },
    { id: 'pot', label: 'Pot', group: 'pot', fill: '#ff9f6b', d: 'M132 345 L268 345 L250 392 L150 392 Z' },
    { id: 'rim', label: 'Pot rim', group: 'pot', fill: '#ffb38a', d: roundRect(120, 326, 160, 28, 12) },
    ...petals,
    { id: 'center', label: 'Center', group: 'center', fill: '#ffd93d', d: circle(200, 150, 48) },
  ],
  details: [
    { after: 'pot', kind: 'line', width: 4, d: 'M146 374 H254' },
    { after: 'center', kind: 'fill', fill: INK, d: circle(184, 142, 6) },
    { after: 'center', kind: 'fill', fill: INK, d: circle(216, 142, 6) },
    { after: 'center', kind: 'line', width: 4, d: 'M182 162 Q200 178 218 162' },
    { after: 'center', kind: 'fill', fill: '#ff9db1', opacity: 0.6, animatedOnly: true, d: circle(170, 160, 8) },
    { after: 'center', kind: 'fill', fill: '#ff9db1', opacity: 0.6, animatedOnly: true, d: circle(230, 160, 8) },
  ],
};
