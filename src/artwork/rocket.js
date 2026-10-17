import { circle, mirror, INK } from './shapes.js';

// The nose cone is cut from the body outline with the exact same curve (split at t=0.4),
// so the two regions line up perfectly.
const bodyPath =
  'M200 28 C175.2 48 156.16 73.12 142.62 103.23 C122.32 148.4 114.4 204.8 118 272 L282 272 ' +
  'C285.6 204.8 277.68 148.4 257.38 103.23 C243.84 73.12 224.8 48 200 28 Z';
const nosePath =
  'M200 28 C175.2 48 156.16 73.12 142.62 103.23 Q200 118 257.38 103.23 C243.84 73.12 224.8 48 200 28 Z';
const finLeft = 'M126 196 C96 220 72 266 62 330 C98 326 126 308 134 284 Z';

/** Rocket (upright). The flame is its own group so it can flicker while the body shakes. */
export const rocketArt = {
  regions: [
    { id: 'flame', label: 'Flame', group: 'flame', fill: '#ffb347', d: 'M170 304 C164 346 188 372 200 392 C212 372 236 346 230 304 Z' },
    { id: 'flame-inner', label: 'Inner flame', group: 'flame', fill: '#ffe08a', d: 'M184 304 C182 332 194 350 200 362 C206 350 218 332 216 304 Z' },
    { id: 'fin-left', label: 'Fin', group: 'finL', fill: '#a78bfa', d: finLeft },
    { id: 'fin-right', label: 'Fin', group: 'finR', fill: '#a78bfa', d: mirror(finLeft) },
    { id: 'nozzle', label: 'Engine', group: 'body', fill: '#9aa5b1', d: 'M156 272 L244 272 L232 304 L168 304 Z' },
    { id: 'body', label: 'Body', group: 'body', fill: '#ff8fa3', d: bodyPath },
    { id: 'nose', label: 'Nose cone', group: 'body', fill: '#ffd166', d: nosePath },
    { id: 'band', label: 'Stripe', group: 'body', fill: '#ffd166', d: 'M118 232 L282 232 L282 272 L118 272 Z' },
    { id: 'ring', label: 'Window ring', group: 'body', fill: '#cfd8ff', d: circle(200, 176, 50) },
    { id: 'window', label: 'Window', group: 'body', fill: '#8fd3ff', d: circle(200, 176, 36) },
  ],
  details: [
    { after: 'band', kind: 'fill', fill: INK, d: circle(140, 252, 3.5) },
    { after: 'band', kind: 'fill', fill: INK, d: circle(170, 252, 3.5) },
    { after: 'band', kind: 'fill', fill: INK, d: circle(200, 252, 3.5) },
    { after: 'band', kind: 'fill', fill: INK, d: circle(230, 252, 3.5) },
    { after: 'band', kind: 'fill', fill: INK, d: circle(260, 252, 3.5) },
    { after: 'window', kind: 'fill', fill: INK, d: circle(188, 174, 5) },
    { after: 'window', kind: 'fill', fill: INK, d: circle(212, 174, 5) },
    { after: 'window', kind: 'line', width: 3.5, d: 'M186 188 Q200 200 214 188' },
    { after: 'window', kind: 'line', width: 4, stroke: '#ffffff', opacity: 0.85, animatedOnly: true, d: 'M178 160 Q182 150 194 146' },
  ],
};
