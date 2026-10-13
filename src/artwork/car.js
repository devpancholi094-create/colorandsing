import { circle, roundRect, INK } from './shapes.js';

/**
 * Car (side view, facing right). Each wheel is a tire + hub region sharing a group,
 * so the wheels can spin while the body bounces.
 */
export const carArt = {
  regions: [
    { id: 'cabin', label: 'Roof', group: 'body', fill: '#ff8fa3', d: 'M104 214 L134 142 Q140 128 156 128 L254 128 Q270 128 280 142 L316 214 Z' },
    { id: 'body', label: 'Car body', group: 'body', fill: '#ff8fa3', d: roundRect(28, 204, 344, 100, 38) },
    { id: 'window-back', label: 'Back window', group: 'body', fill: '#bfe9ff', d: 'M128 204 L150 148 L192 148 L192 204 Z' },
    { id: 'window-front', label: 'Front window', group: 'body', fill: '#bfe9ff', d: 'M208 204 L208 148 L250 148 L284 204 Z' },
    { id: 'taillight', label: 'Back light', group: 'body', fill: '#ff6b6b', d: roundRect(30, 228, 18, 26, 8) },
    { id: 'headlight', label: 'Headlight', group: 'body', fill: '#ffe08a', d: circle(352, 236, 14) },
    { id: 'tire-back', label: 'Back wheel', group: 'wheelB', fill: '#4b4a67', d: circle(112, 306, 44) },
    { id: 'hub-back', label: 'Back wheel center', group: 'wheelB', fill: '#d9dcef', d: circle(112, 306, 20) },
    { id: 'tire-front', label: 'Front wheel', group: 'wheelF', fill: '#4b4a67', d: circle(288, 306, 44) },
    { id: 'hub-front', label: 'Front wheel center', group: 'wheelF', fill: '#d9dcef', d: circle(288, 306, 20) },
  ],
  details: [
    { after: 'body', kind: 'line', width: 3.5, d: 'M200 210 V298 M180 232 H192' },
    { after: 'body', kind: 'line', width: 3.5, d: 'M338 280 Q354 290 368 276' },
    { after: 'window-back', kind: 'line', width: 4, stroke: '#ffffff', opacity: 0.85, animatedOnly: true, d: 'M138 190 L152 160' },
    { after: 'window-front', kind: 'line', width: 4, stroke: '#ffffff', opacity: 0.85, animatedOnly: true, d: 'M222 190 L222 162' },
    { after: 'headlight', kind: 'line', width: 3, stroke: '#ffffff', opacity: 0.9, animatedOnly: true, d: 'M345 231 Q348 227 354 227' },
    { after: 'hub-back', kind: 'line', width: 4, d: 'M112 292 V320 M98 306 H126' },
    { after: 'hub-front', kind: 'line', width: 4, d: 'M288 292 V320 M274 306 H302' },
  ],
};
