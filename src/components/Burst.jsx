import { useMemo } from 'react';

/** A quick radial burst of stars, used when a new scene of the show begins. */
export default function Burst() {
  const stars = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({ angle: (i / 14) * 360 + (i % 2) * 8, dist: 110 + (i % 3) * 40, size: 16 + (i % 3) * 8, color: ['#ffe08a', '#ff9ec2', '#9be3ff', '#c9b6ff'][i % 4] })),
    [],
  );
  return (
    <div className="burst" aria-hidden="true">
      {stars.map((s, i) => (
        <svg key={i} viewBox="0 0 24 24" style={{ '--ang': `${s.angle}deg`, '--dist': `${s.dist}px`, width: s.size, height: s.size }}>
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17l-6.1 3.6 1.4-6.8L2.2 9.1l6.9-.8z" fill={s.color} stroke="#fff" strokeWidth="1" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}
