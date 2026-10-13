import { ellipse, circle, roundRect, INK } from './shapes.js';

/** Elephant (front view): round head, big flappy ears, swaying trunk. */
export const elephantArt = {
  regions: [
    { id: 'body', label: 'Body', group: 'body', fill: '#b4bfe6', d: ellipse(200, 315, 110, 58) },
    { id: 'foot-left', label: 'Foot', group: 'footL', fill: '#a7b3df', d: roundRect(112, 336, 58, 50, 22) },
    { id: 'foot-right', label: 'Foot', group: 'footR', fill: '#a7b3df', d: roundRect(230, 336, 58, 50, 22) },
    { id: 'ear-left', label: 'Ear', group: 'earL', fill: '#b4bfe6', d: circle(88, 180, 72) },
    { id: 'ear-right', label: 'Ear', group: 'earR', fill: '#b4bfe6', d: circle(312, 180, 72) },
    { id: 'inner-ear-left', label: 'Inside ear', group: 'earL', fill: '#ffc2d4', d: circle(84, 182, 42) },
    { id: 'inner-ear-right', label: 'Inside ear', group: 'earR', fill: '#ffc2d4', d: circle(316, 182, 42) },
    { id: 'head', label: 'Head', group: 'head', fill: '#b4bfe6', d: ellipse(200, 186, 92, 100) },
    {
      id: 'trunk', label: 'Trunk', group: 'trunk', fill: '#a7b3df',
      d: 'M166 206 Q200 224 234 206 C238 268 240 318 266 338 C280 352 266 380 238 374 C204 366 188 332 176 292 C170 268 166 240 166 208 Z',
    },
  ],
  details: [
    { after: 'foot-left', kind: 'line', d: 'M131 368 V378 M151 368 V378' },
    { after: 'foot-right', kind: 'line', d: 'M249 368 V378 M269 368 V378' },
    { after: 'head', kind: 'fill', fill: INK, d: circle(156, 176, 10) },
    { after: 'head', kind: 'fill', fill: INK, d: circle(244, 176, 10) },
    { after: 'head', kind: 'fill', fill: '#ffffff', d: circle(160, 172, 3.5) },
    { after: 'head', kind: 'fill', fill: '#ffffff', d: circle(248, 172, 3.5) },
    { after: 'head', kind: 'fill', fill: '#ff9db1', opacity: 0.55, animatedOnly: true, d: circle(138, 224, 14) },
    { after: 'head', kind: 'fill', fill: '#ff9db1', opacity: 0.55, animatedOnly: true, d: circle(262, 224, 14) },
    { after: 'trunk', kind: 'line', width: 3, d: 'M180 250 Q200 258 224 250 M182 284 Q202 292 224 284' },
  ],
};
