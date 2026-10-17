import { useMemo } from 'react';

const NOTE_COLORS = ['#ff6f91', '#ff9f45', '#4dabf7', '#9775fa', '#2fc88a'];

function Note({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <g fill={color}>
        <ellipse cx="7" cy="18" rx="4" ry="3" />
        <ellipse cx="17" cy="15.5" rx="4" ry="3" />
        <path d="M10.2 18V5l9.6-2.4v12.9h-2V6.2L12.2 7.4V18z" />
      </g>
    </svg>
  );
}

function Star({ color }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17l-6.1 3.6 1.4-6.8L2.2 9.1l6.9-.8z" fill={color} stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

/** Floating notes and twinkling stars around the stage. `trail` adds extra stars for the rocket. */
export default function StageEffects({ active, paused, extra = null }) {
  const items = useMemo(() => {
    const notes = Array.from({ length: 7 }, (_, i) => ({
      kind: 'note', left: 6 + ((i * 14) % 88), delay: -i * 1.1, size: 28 + (i % 3) * 8, drift: (i % 2 ? 1 : -1) * (14 + i * 3), color: NOTE_COLORS[i % NOTE_COLORS.length],
    }));
    const stars = Array.from({ length: 9 }, (_, i) => ({
      kind: 'star', left: 4 + ((i * 11) % 92), top: 6 + ((i * 23) % 60), delay: -i * 0.4, size: 16 + (i % 3) * 7, color: i % 2 ? '#ffe08a' : '#fff3b0',
    }));
    const trailStars = Array.from({ length: 8 }, (_, i) => ({
      kind: 'trail', left: 44 + (i % 4) * 4 + (i > 3 ? 2 : 0), delay: -i * 0.35, size: 14 + (i % 3) * 5, drift: (i % 2 ? 1 : -1) * (18 + i * 6),
    }));
    const bubbles = Array.from({ length: 9 }, (_, i) => ({
      left: 6 + ((i * 11) % 88), delay: -i * 0.9, size: 14 + (i % 4) * 8, drift: (i % 2 ? 1 : -1) * (10 + i * 2),
    }));
    const petals = Array.from({ length: 9 }, (_, i) => ({
      left: 4 + ((i * 12) % 90), delay: -i * 0.8, size: 14 + (i % 3) * 5, drift: (i % 2 ? 1 : -1) * (30 + i * 6),
    }));
    return { notes, stars, trailStars, bubbles, petals };
  }, []);

  return (
    <div className={`effects ${active ? 'on' : ''} ${paused ? 'is-paused' : ''}`} aria-hidden="true">
      {items.stars.map((s, i) => (
        <span key={`s${i}`} className="fx fx-star" style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, '--delay': `${s.delay}s` }}>
          <Star color={s.color} />
        </span>
      ))}
      {items.notes.map((n, i) => (
        <span key={`n${i}`} className="fx fx-note" style={{ left: `${n.left}%`, width: n.size, height: n.size, '--delay': `${n.delay}s`, '--drift': `${n.drift}px` }}>
          <Note color={n.color} />
        </span>
      ))}
      {extra === 'bubbles' &&
        items.bubbles.map((b, i) => (
          <span key={`b${i}`} className="fx fx-bubble" style={{ left: `${b.left}%`, width: b.size, height: b.size, '--delay': `${b.delay}s`, '--drift': `${b.drift}px` }} />
        ))}
      {extra === 'petals' &&
        items.petals.map((p, i) => (
          <span key={`p${i}`} className="fx fx-petal" style={{ left: `${p.left}%`, width: p.size, height: p.size * 0.6, '--delay': `${p.delay}s`, '--drift': `${p.drift}px` }} />
        ))}
      {extra === 'trail' &&
        items.trailStars.map((t, i) => (
          <span key={`t${i}`} className="fx fx-trail" style={{ left: `${t.left}%`, width: t.size, height: t.size, '--delay': `${t.delay}s`, '--drift': `${t.drift}px` }}>
            <Star color="#ffe08a" />
          </span>
        ))}
    </div>
  );
}
