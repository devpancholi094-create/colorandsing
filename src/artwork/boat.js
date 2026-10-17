import { circle, roundRect, INK } from './shapes.js';

/** Sailboat with a smiling sail. The wave is its own region so the water can bob. */
export const boatArt = {
  regions: [
    { id: 'mast', label: 'Mast', group: 'mast', fill: '#b98055', d: roundRect(196, 70, 10, 222, 4) },
    { id: 'sail-small', label: 'Small sail', group: 'sailS', fill: '#ffd6e0', d: 'M192 120 L192 272 L100 272 C130 220 165 165 192 120 Z' },
    { id: 'sail-big', label: 'Big sail', group: 'sailB', fill: '#fff7d6', d: 'M212 82 C262 150 300 215 330 272 L212 272 Z' },
    { id: 'flag', label: 'Flag', group: 'flag', fill: '#ff6b6b', d: 'M206 70 L252 84 L206 100 Z' },
    { id: 'hull', label: 'Boat', group: 'hull', fill: '#ff8fa3', d: 'M60 290 L340 290 L300 350 Q290 360 270 360 L130 360 Q110 360 100 350 Z' },
    { id: 'porthole-1', label: 'Window', group: 'hull', fill: '#bfe9ff', d: circle(150, 318, 9) },
    { id: 'porthole-2', label: 'Window', group: 'hull', fill: '#bfe9ff', d: circle(200, 318, 9) },
    { id: 'porthole-3', label: 'Window', group: 'hull', fill: '#bfe9ff', d: circle(250, 318, 9) },
    { id: 'wave', label: 'Water', group: 'wave', overlay: true, fill: '#7dd3fc', d: 'M0 345 Q50 322 100 345 T200 345 T300 345 T400 345 V400 H0 Z' },
  ],
  details: [
    { after: 'sail-big', kind: 'fill', fill: INK, d: circle(244, 226, 6) },
    { after: 'sail-big', kind: 'fill', fill: INK, d: circle(274, 226, 6) },
    { after: 'sail-big', kind: 'line', width: 4, d: 'M242 244 Q259 258 276 244' },
    { after: 'sail-big', kind: 'fill', fill: '#ff9db1', opacity: 0.55, animatedOnly: true, d: circle(232, 240, 8) },
    { after: 'sail-big', kind: 'fill', fill: '#ff9db1', opacity: 0.55, animatedOnly: true, d: circle(286, 240, 8) },
  ],
};
