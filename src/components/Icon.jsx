// Small inline icon set (no icon library, no network). Icons are always shown next to a text label.
const STROKES = {
  back: 'M15 5l-7 7 7 7',
  home: 'M4 11l8-7 8 7v9H4z M10 20v-6h4v6',
  brush: 'M18 3l3 3-9 9-4 1 1-4z M7 17c-1 2-2 3-4 3',
  bucket: 'M5 11l7-7 7 7-6 6a2 2 0 0 1-3 0z M20 15c1.5 2 2 3 2 4a2 2 0 0 1-4 0c0-1 .5-2 2-4z',
  eraser: 'M7 21h12 M4.5 14.5l9-9a2 2 0 0 1 3 0l3 3a2 2 0 0 1 0 3l-8 8H9z',
  undo: 'M9 14L4 9l5-5 M4 9h11a5 5 0 0 1 0 10h-4',
  redo: 'M15 14l5-5-5-5 M20 9H9a5 5 0 0 0 0 10h4',
  trash: 'M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13 M10 11v6 M14 11v6',
  save: 'M5 4h11l3 3v13H5z M8 4v5h7V4 M8 20v-6h8v6',
  check: 'M5 12l5 5 9-10',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z M6 11a6 6 0 0 0 12 0 M12 17v4 M9 21h6',
  replay: 'M4 12a8 8 0 1 1 3 6.2 M4 18v-5h5',
  speaker: 'M4 9v6h4l5 4V5L8 9z M16.5 9a4 4 0 0 1 0 6 M19 6.5a8 8 0 0 1 0 11',
  speakerOff: 'M4 9v6h4l5 4V5L8 9z M17 9l5 6 M22 9l-5 6',
  lock: 'M6 11h12v9H6z M8 11V8a4 4 0 0 1 8 0v3',
  plus: 'M12 5v14 M5 12h14',
  x: 'M6 6l12 12 M18 6L6 18',
  gallery: 'M4 5h16v14H4z M4 15l5-5 4 4 3-3 4 4',
  next: 'M5 12h14 M13 6l6 6-6 6',
  prev: 'M19 12H5 M11 6l-6 6 6 6',
  list: 'M4 7h16 M4 12h16 M4 17h10',
  info: 'M12 11v6 M12 7.5v.5 M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
};

const FILLED = {
  play: 'M7 4l13 8-13 8z',
  pause: 'M6 4h4v16H6z M14 4h4v16h-4z',
  stop: 'M6 6h12v12H6z',
  star: 'M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17l-6.1 3.6 1.4-6.8L2.2 9.1l6.9-.8z',
};

export default function Icon({ name, size = 24, className = '' }) {
  const filled = FILLED[name];
  const path = filled || STROKES[name];
  if (!path) return null;
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}
