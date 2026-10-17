import { circle, ellipse, mirror, INK } from './shapes.js';

const upperLeft = 'M190 205 C165 130 100 50 48 78 C12 100 20 182 88 218 C125 238 168 234 190 205 Z';
const lowerLeft = 'M190 232 C150 226 110 240 84 282 C58 326 96 370 138 346 C172 326 188 282 190 232 Z';

/**
 * Butterfly (front view, symmetric). Left/right wings are separate regions so they
 * can flap independently; the right side is the mirror image of the left.
 */
export const butterflyArt = {
  regions: [
    { id: 'wing-low-left', label: 'Lower wing', group: 'wingL', fill: '#ffd166', d: lowerLeft },
    { id: 'wing-low-right', label: 'Lower wing', group: 'wingR', fill: '#ffd166', d: mirror(lowerLeft) },
    { id: 'wing-top-left', label: 'Top wing', group: 'wingL', fill: '#ff9ec2', d: upperLeft },
    { id: 'wing-top-right', label: 'Top wing', group: 'wingR', fill: '#ff9ec2', d: mirror(upperLeft) },
    { id: 'spot-top-left', label: 'Big spot', group: 'wingL', fill: '#a78bfa', d: circle(98, 140, 24) },
    { id: 'spot-top-right', label: 'Big spot', group: 'wingR', fill: '#a78bfa', d: circle(302, 140, 24) },
    { id: 'spot-low-left', label: 'Spot', group: 'wingL', fill: '#7dd3fc', d: circle(122, 300, 17) },
    { id: 'spot-low-right', label: 'Spot', group: 'wingR', fill: '#7dd3fc', d: circle(278, 300, 17) },
    { id: 'tip-left', label: 'Tiny spot', group: 'wingL', fill: '#fff0a8', d: circle(68, 106, 11) },
    { id: 'tip-right', label: 'Tiny spot', group: 'wingR', fill: '#fff0a8', d: circle(332, 106, 11) },
    { id: 'body', label: 'Body', group: 'body', fill: '#6b5b95', d: ellipse(200, 240, 16, 96) },
    { id: 'head', label: 'Head', group: 'body', fill: '#8c7bb8', d: circle(200, 138, 26) },
  ],
  details: [
    { after: 'body', kind: 'line', d: 'M189 200 H211 M188 232 H212 M189 264 H211' },
    { after: 'head', kind: 'line', d: 'M190 116 Q176 80 150 64 M210 116 Q224 80 250 64' },
    { after: 'head', kind: 'fill', fill: INK, d: circle(148, 62, 7) },
    { after: 'head', kind: 'fill', fill: INK, d: circle(252, 62, 7) },
    { after: 'head', kind: 'fill', fill: INK, d: circle(190, 136, 4) },
    { after: 'head', kind: 'fill', fill: INK, d: circle(210, 136, 4) },
    { after: 'head', kind: 'line', width: 3, d: 'M191 148 Q200 156 209 148' },
  ],
};
