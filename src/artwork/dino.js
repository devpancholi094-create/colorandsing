import { ellipse, circle, roundRect, INK } from './shapes.js';

/**
 * Dino (side view, facing right).
 * `regions` are listed back-to-front. Each region is BOTH a fillable area on the
 * coloring page AND a part of the animated character (same id, same path), so the
 * child's colors map one-to-one onto the dancing dino.
 * `group` names the animated body part (see animations/characters.css).
 * `details` are fixed drawing lines/dots placed just after their `after` region.
 */
export const dinoArt = {
  regions: [
    { id: 'plate-back', label: 'Back plate', group: 'body', fill: '#ffb86b', d: 'M84 245 L96 168 L150 198 L130 240 Z' },
    { id: 'plate-top', label: 'Top plate', group: 'body', fill: '#ffc98b', d: 'M118 205 L148 134 L192 182 L170 215 Z' },
    { id: 'tail', label: 'Tail', group: 'tail', fill: '#86dba6', d: 'M112 238 C72 232 34 262 14 322 C58 326 104 314 128 296 Z' },
    { id: 'leg-back', label: 'Back foot', group: 'legL', fill: '#6fcf97', d: roundRect(128, 318, 54, 64, 22) },
    { id: 'leg-front', label: 'Front foot', group: 'legR', fill: '#6fcf97', d: roundRect(222, 318, 54, 64, 22) },
    { id: 'body', label: 'Body', group: 'body', fill: '#86dba6', d: ellipse(200, 262, 122, 88) },
    { id: 'spot-1', label: 'Spot', group: 'body', fill: '#5fc48d', d: circle(122, 246, 14) },
    { id: 'spot-2', label: 'Spot', group: 'body', fill: '#5fc48d', d: circle(160, 208, 11) },
    { id: 'spot-3', label: 'Spot', group: 'body', fill: '#5fc48d', d: circle(104, 290, 10) },
    { id: 'belly', label: 'Tummy', group: 'body', fill: '#fff0c2', d: ellipse(206, 292, 74, 50) },
    { id: 'head', label: 'Head', group: 'head', fill: '#86dba6', d: ellipse(275, 148, 82, 68) },
    { id: 'snout', label: 'Nose', group: 'head', fill: '#9be3b6', d: ellipse(338, 172, 36, 28) },
  ],
  details: [
    { after: 'leg-back', kind: 'line', d: 'M144 366 V378 M166 366 V378' },
    { after: 'leg-front', kind: 'line', d: 'M238 366 V378 M260 366 V378' },
    { after: 'head', kind: 'fill', fill: INK, d: circle(292, 128, 10) },
    { after: 'head', kind: 'fill', fill: '#ffffff', d: circle(296, 124, 3.5) },
    { after: 'snout', kind: 'line', d: 'M320 181 Q340 195 364 179' },
    { after: 'snout', kind: 'fill', fill: INK, d: circle(358, 166, 3.5) },
    { after: 'snout', kind: 'fill', fill: '#ff9db1', opacity: 0.6, animatedOnly: true, d: circle(302, 170, 12) },
  ],
};
