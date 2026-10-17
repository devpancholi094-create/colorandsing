import { useMemo } from 'react';

const COLORS = ['#ff6f91', '#ff9f45', '#ffd93d', '#6fd9a3', '#4dabf7', '#b197fc', '#ffb3c7'];

/** Colorful confetti burst. Pure CSS; hidden automatically in reduced-motion mode (see CSS). */
export default function Confetti({ count = 44 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.4 + Math.random() * 1.6,
        drift: (Math.random() - 0.5) * 160,
        spin: 360 + Math.random() * 540,
        color: COLORS[i % COLORS.length],
        round: i % 3 === 0,
      })),
    [count],
  );
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <i
          key={i}
          className={p.round ? 'round' : undefined}
          style={{ left: `${p.left}%`, background: p.color, '--delay': `${p.delay}s`, '--dur': `${p.duration}s`, '--drift': `${p.drift}px`, '--spin': `${p.spin}deg` }}
        />
      ))}
    </div>
  );
}
