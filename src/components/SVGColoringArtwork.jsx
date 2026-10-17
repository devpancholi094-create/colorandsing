import { useId } from 'react';
import { INK } from '../artwork/shapes.js';
import { VIEW } from '../config.js';

export function DetailShape({ detail }) {
  if (detail.kind === 'line') {
    return (
      <path
        d={detail.d}
        fill="none"
        stroke={detail.stroke || INK}
        strokeWidth={detail.width || 4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={detail.opacity}
      />
    );
  }
  return <path d={detail.d} fill={detail.fill} opacity={detail.opacity} />;
}

/**
 * The coloring page is three stacked layers so paint always sits UNDER the black lines:
 *   1. "fills"  - one <path> per region, each with its own independent fill color
 *   2. (the freehand canvas, rendered by ColoringCanvas)
 *   3. "lines"  - black outlines + fixed details
 * Outlines of a back region are masked wherever a region in front covers it, so no line
 * shows through (for example a leg hidden behind the body).
 */
export default function SVGColoringArtwork({ art, fills = {}, layer }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  if (layer === 'fills') {
    return (
      <svg className="art-layer" viewBox={`0 0 ${VIEW} ${VIEW}`} aria-hidden="true" focusable="false">
        {art.regions.map((region) => (
          <path
            key={`${region.id}-${fills[region.id] || 'none'}`}
            d={region.d}
            fill={fills[region.id] || '#ffffff'}
            className={fills[region.id] ? 'fill-pop' : undefined}
          />
        ))}
      </svg>
    );
  }

  return (
    <svg className="art-layer art-lines" viewBox={`0 0 ${VIEW} ${VIEW}`} aria-hidden="true" focusable="false">
      <defs>
        {art.regions.slice(0, -1).map((region, i) => (
          <mask key={region.id} id={`${uid}-m${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW} height={VIEW}>
            <rect width={VIEW} height={VIEW} fill="#fff" />
            {art.regions.slice(i + 1).map((above) => (
              <path key={above.id} d={above.d} fill="#000" />
            ))}
          </mask>
        ))}
      </defs>
      {art.regions.map((region, i) => (
        <g key={region.id} mask={i < art.regions.length - 1 ? `url(#${uid}-m${i})` : undefined}>
          <path d={region.d} fill="none" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
          {art.details
            .filter((d) => d.after === region.id && !d.animatedOnly)
            .map((detail, j) => (
              <DetailShape key={j} detail={detail} />
            ))}
        </g>
      ))}
    </svg>
  );
}
