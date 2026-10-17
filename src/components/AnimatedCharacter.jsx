import { useId } from 'react';
import { INK } from '../artwork/shapes.js';
import { VIEW } from '../config.js';
import { DetailShape } from './SVGColoringArtwork.jsx';

/**
 * The dancing character.
 *
 * COLOR MAPPING: the animated character is built from the very same `regions` as the
 * coloring page (same ids, same shapes). `fills[regionId]` is the child's chosen color;
 * if that region was never colored we use the region's default `fill`, so every part of
 * the character shows the child's color exactly where they painted it.
 * Freehand brush strokes are carried over too: `snapshot` is a PNG of the strokes,
 * clipped separately to each region so the paint moves with that body part.
 * (Limitation: the paint is a picture, so it moves with its part but does not re-shape.)
 *
 * Motion is plain CSS (animations/characters.css) keyed by each region's `group`.
 */
export default function AnimatedCharacter({ character, fills = {}, snapshot = null, dancing = false, special = false, paused = false, label }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const { art, animation } = character;

  const renderRegion = (region) => (
    <g key={region.id} className={`part g-${region.group}`}>
      <path d={region.d} fill={fills[region.id] || region.fill} />
      {snapshot && (
        <g clipPath={`url(#${uid}-clip-${region.id})`}>
          <use href={`#${uid}-paint`} />
        </g>
      )}
      <path d={region.d} fill="none" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      {art.details
        .filter((d) => d.after === region.id)
        .map((detail, i) => (
          <DetailShape key={i} detail={detail} />
        ))}
    </g>
  );

  return (
    <svg
      className={`char char-${animation.type} ${dancing ? 'is-dancing' : ''} ${special ? 'is-special' : ''} ${paused ? 'is-paused' : ''}`}
      style={{ '--beat': animation.beat }}
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      role="img"
      aria-label={label || `${character.name} character`}
    >
      <defs>
        {snapshot && <image id={`${uid}-paint`} href={snapshot} x="0" y="0" width={VIEW} height={VIEW} />}
        {snapshot &&
          art.regions.map((region) => (
            <clipPath key={region.id} id={`${uid}-clip-${region.id}`}>
              <path d={region.d} />
            </clipPath>
          ))}
      </defs>
      <ellipse className="char-shadow" cx="200" cy="392" rx="120" ry="9" fill="rgba(55,49,92,0.14)" />
      {/* Regions marked `overlay` (e.g. the boat's water) sit in front of the moving body and
          do not rock with it. They are drawn last, so z-order still matches the coloring page. */}
      <g className="char-root">{art.regions.filter((r) => !r.overlay).map(renderRegion)}</g>
      {art.regions.filter((r) => r.overlay).map(renderRegion)}
    </svg>
  );
}
