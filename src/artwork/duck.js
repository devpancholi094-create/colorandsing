import { ellipse, circle, INK } from './shapes.js';

/** Duck (side view, facing right). */
export const duckArt = {
  regions: [
    { id: 'tail', label: 'Tail', group: 'tail', fill: '#ffe066', d: 'M96 252 C64 244 42 220 30 196 C72 196 98 208 114 228 Z' },
    { id: 'foot-left', label: 'Foot', group: 'footL', fill: '#ff9f45', d: 'M140 335 Q120 372 112 385 Q150 392 180 385 Q172 360 168 335 Z' },
    { id: 'foot-right', label: 'Foot', group: 'footR', fill: '#ff9f45', d: 'M230 335 Q210 372 202 385 Q240 392 270 385 Q262 360 258 335 Z' },
    { id: 'body', label: 'Body', group: 'body', fill: '#ffe066', d: ellipse(190, 268, 125, 80) },
    { id: 'wing', label: 'Wing', group: 'wing', fill: '#ffd23f', d: 'M130 255 C150 218 215 218 245 255 C230 292 165 296 130 255 Z' },
    { id: 'head', label: 'Head', group: 'head', fill: '#ffe066', d: circle(285, 160, 62) },
    { id: 'beak', label: 'Beak', group: 'beak', fill: '#ff9f45', d: 'M332 152 C360 142 392 152 392 168 C390 184 360 188 332 180 Z' },
  ],
  details: [
    { after: 'wing', kind: 'line', width: 3.5, d: 'M160 262 Q185 274 212 262' },
    { after: 'head', kind: 'fill', fill: INK, d: circle(300, 142, 8) },
    { after: 'head', kind: 'fill', fill: '#ffffff', d: circle(303, 139, 3) },
    { after: 'head', kind: 'line', width: 4, d: 'M270 100 Q258 70 284 72 Q280 88 292 100' },
    { after: 'head', kind: 'fill', fill: '#ff9db1', opacity: 0.55, animatedOnly: true, d: circle(306, 172, 12) },
    { after: 'beak', kind: 'line', width: 3, d: 'M338 168 Q362 176 386 168' },
    { after: 'beak', kind: 'fill', fill: INK, d: circle(368, 157, 3) },
  ],
};
