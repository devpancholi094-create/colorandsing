import { APP_NAME } from '../config.js';

const LETTER_COLORS = ['#ff6f91', '#ff9f45', '#f2b705', '#2fc88a', '#4dabf7', '#9775fa'];

/** Wordmark: every letter in its own crayon color. Change the name in src/config.js. */
export default function Logo({ size = 'md' }) {
  let colorIndex = 0;
  return (
    <span className={`logo logo-${size}`} aria-label={APP_NAME} role="img">
      {[...APP_NAME].map((char, i) => {
        if (char === ' ') return <span key={i} className="logo-space" aria-hidden="true" />;
        const color = LETTER_COLORS[colorIndex % LETTER_COLORS.length];
        colorIndex += 1;
        return (
          <span key={i} aria-hidden="true" style={{ color, '--i': i }}>
            {char}
          </span>
        );
      })}
    </span>
  );
}
