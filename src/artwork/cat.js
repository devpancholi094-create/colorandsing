import { ellipse, circle, mirror, INK } from './shapes.js';

const earLeft = 'M108 145 Q98 72 124 52 Q152 62 174 102 Z';
const innerLeft = 'M124 122 Q120 84 130 70 Q146 78 160 102 Z';

/** Cat (front view, sitting) with a collar and bell. */
export const catArt = {
  regions: [
    { id: 'tail', label: 'Tail', group: 'tail', fill: '#ffc27a', d: 'M285 335 C342 335 372 292 356 232 C350 214 328 220 334 238 C346 272 326 296 280 302 Z' },
    { id: 'body', label: 'Body', group: 'body', fill: '#ffc27a', d: ellipse(200, 305, 95, 78) },
    { id: 'belly', label: 'Tummy', group: 'body', fill: '#fff0d9', d: ellipse(200, 318, 46, 52) },
    { id: 'paw-left', label: 'Paw', group: 'pawL', fill: '#fff0d9', d: ellipse(158, 372, 32, 20) },
    { id: 'paw-right', label: 'Paw', group: 'pawR', fill: '#fff0d9', d: ellipse(242, 372, 32, 20) },
    { id: 'collar', label: 'Collar', group: 'body', fill: '#ff8fa3', d: 'M148 246 Q200 272 252 246 L248 264 Q200 292 152 264 Z' },
    { id: 'bell', label: 'Bell', group: 'body', fill: '#ffd93d', d: circle(200, 284, 12) },
    { id: 'ear-left', label: 'Ear', group: 'earL', fill: '#ffc27a', d: earLeft },
    { id: 'ear-right', label: 'Ear', group: 'earR', fill: '#ffc27a', d: mirror(earLeft) },
    { id: 'inner-ear-left', label: 'Inside ear', group: 'earL', fill: '#ffb3c7', d: innerLeft },
    { id: 'inner-ear-right', label: 'Inside ear', group: 'earR', fill: '#ffb3c7', d: mirror(innerLeft) },
    { id: 'head', label: 'Head', group: 'head', fill: '#ffc27a', d: ellipse(200, 170, 100, 84) },
  ],
  details: [
    { after: 'bell', kind: 'line', width: 3, d: 'M194 284 H206' },
    { after: 'head', kind: 'line', width: 4, d: 'M200 90 V114 M178 94 L183 114 M222 94 L217 114' },
    { after: 'head', kind: 'fill', fill: INK, d: ellipse(160, 166, 11, 15) },
    { after: 'head', kind: 'fill', fill: INK, d: ellipse(240, 166, 11, 15) },
    { after: 'head', kind: 'fill', fill: '#ffffff', d: circle(164, 160, 4) },
    { after: 'head', kind: 'fill', fill: '#ffffff', d: circle(244, 160, 4) },
    { after: 'head', kind: 'fill', fill: '#ff8fa3', d: 'M191 188 L209 188 L200 200 Z' },
    { after: 'head', kind: 'line', width: 3.5, d: 'M200 200 Q191 214 177 207 M200 200 Q209 214 223 207' },
    { after: 'head', kind: 'line', width: 3, d: 'M118 186 L72 176 M118 198 L70 204 M282 186 L328 176 M282 198 L330 204' },
    { after: 'head', kind: 'fill', fill: '#ff9db1', opacity: 0.55, animatedOnly: true, d: circle(130, 196, 13) },
    { after: 'head', kind: 'fill', fill: '#ff9db1', opacity: 0.55, animatedOnly: true, d: circle(270, 196, 13) },
  ],
};
