import { ellipse, circle, INK } from './shapes.js';

/** Fish (side view, facing right). */
export const fishArt = {
  regions: [
    { id: 'tail', label: 'Tail', group: 'tail', fill: '#ffd166', d: 'M104 205 C74 175 44 145 20 118 C34 170 34 240 20 292 C46 262 76 234 104 205 Z' },
    { id: 'fin-top', label: 'Top fin', group: 'finTop', fill: '#ffd166', d: 'M150 135 C165 78 232 58 280 100 C248 104 218 114 198 128 Z' },
    { id: 'fin-bottom', label: 'Bottom fin', group: 'finBottom', fill: '#ffd166', d: 'M196 284 C206 332 248 348 278 336 C266 316 256 298 252 284 Z' },
    { id: 'body', label: 'Body', group: 'body', fill: '#ffa94d', d: ellipse(215, 205, 125, 90) },
    { id: 'spot-1', label: 'Spot', group: 'body', fill: '#ff8fa3', d: circle(180, 170, 11) },
    { id: 'spot-2', label: 'Spot', group: 'body', fill: '#ff8fa3', d: circle(222, 270, 9) },
    { id: 'spot-3', label: 'Spot', group: 'body', fill: '#ff8fa3', d: circle(140, 215, 9) },
    { id: 'side-fin', label: 'Side fin', group: 'finSide', fill: '#ffd166', d: 'M190 215 C165 215 150 240 160 262 C185 262 205 245 215 225 Z' },
    { id: 'eye', label: 'Eye', group: 'head', fill: '#ffffff', d: circle(285, 185, 26) },
  ],
  details: [
    { after: 'body', kind: 'line', width: 4, d: 'M268 140 Q248 200 268 262' },
    { after: 'eye', kind: 'fill', fill: INK, d: circle(292, 186, 12) },
    { after: 'eye', kind: 'fill', fill: '#ffffff', d: circle(296, 181, 4.5) },
    { after: 'eye', kind: 'line', width: 4, d: 'M322 214 Q333 226 320 238' },
    { after: 'eye', kind: 'fill', fill: '#ff9db1', opacity: 0.55, animatedOnly: true, d: circle(266, 228, 11) },
  ],
};
