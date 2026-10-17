// Pastel scenery behind the dancing character. Pure SVG + CSS gradients; each character theme
// picks a `scenery` name.
function Cloud({ x, y, scale = 1, className = '' }) {
  return (
    <g className={`cloud ${className}`} transform={`translate(${x} ${y}) scale(${scale})`} fill="#fff" opacity="0.85">
      <ellipse cx="0" cy="0" rx="34" ry="14" />
      <ellipse cx="-16" cy="-10" rx="18" ry="14" />
      <ellipse cx="12" cy="-12" rx="22" ry="16" />
    </g>
  );
}

const SCENES = {
  hills: (
    <>
      <circle cx="320" cy="90" r="38" fill="#ffe08a" />
      <Cloud x={90} y={110} />
      <Cloud x={250} y={200} scale={0.8} className="slow" />
      <path d="M0 470 Q100 410 200 460 T400 440 V600 H0Z" fill="#a8e6c3" />
      <path d="M0 520 Q120 480 230 520 T400 505 V600 H0Z" fill="#8dd9ae" />
    </>
  ),
  meadow: (
    <>
      <circle cx="80" cy="90" r="34" fill="#fff0a8" />
      <Cloud x={280} y={120} />
      <path d="M0 480 Q100 430 210 475 T400 450 V600 H0Z" fill="#e5d3ff" />
      <path d="M0 530 Q140 490 260 530 T400 520 V600 H0Z" fill="#cfe9c8" />
      {[40, 110, 190, 270, 340].map((x, i) => (
        <g key={x} transform={`translate(${x} ${548 + (i % 2) * 16})`}>
          <path d="M0 0 V30" stroke="#7fc79a" strokeWidth="4" strokeLinecap="round" />
          <circle cx="0" cy="-2" r="9" fill={['#ff9ec2', '#ffd166', '#a78bfa', '#7dd3fc', '#ff9ec2'][i]} />
          <circle cx="0" cy="-2" r="3.5" fill="#fff6c9" />
        </g>
      ))}
    </>
  ),
  savanna: (
    <>
      <circle cx="200" cy="400" r="110" fill="#ffd27d" opacity="0.8" />
      <Cloud x={90} y={100} />
      <Cloud x={300} y={160} scale={0.8} className="slow" />
      <path d="M0 470 Q120 440 240 470 T400 460 V600 H0Z" fill="#f7c58f" />
      <path d="M0 530 Q140 500 280 530 T400 520 V600 H0Z" fill="#f0b87b" />
      <g transform="translate(335 440)">
        <path d="M0 40 V0" stroke="#b9855a" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="0" cy="-8" rx="36" ry="13" fill="#8fd3a4" />
      </g>
    </>
  ),
  space: (
    <>
      {[[40, 60], [120, 140], [310, 70], [350, 180], [70, 260], [250, 250], [180, 40], [380, 300], [30, 380], [330, 400]].map(([x, y], i) => (
        <circle key={i} className="twinkle" style={{ '--d': `${i * 0.35}s` }} cx={x} cy={y} r={i % 3 === 0 ? 3 : 2} fill="#fff" />
      ))}
      <circle cx="82" cy="130" r="36" fill="#ffd1e8" />
      <ellipse cx="82" cy="130" rx="58" ry="12" fill="none" stroke="#fff3b0" strokeWidth="5" transform="rotate(-18 82 130)" />
      <circle cx="330" cy="120" r="22" fill="#fff3b0" />
      <path d="M0 540 Q120 500 220 540 T400 525 V600 H0Z" fill="#a99bf0" />
      <path d="M0 575 Q100 550 200 575 T400 570 V600 H0Z" fill="#9285e6" />
    </>
  ),
  road: (
    <>
      <circle cx="320" cy="90" r="36" fill="#ffe08a" />
      <Cloud x={90} y={100} />
      <Cloud x={230} y={190} scale={0.8} className="slow" />
      <path d="M0 430 Q110 380 220 425 T400 405 V600 H0Z" fill="#a8e6c3" />
      <rect x="0" y="470" width="400" height="130" fill="#9aa0c4" />
      <path d="M0 470 H400" stroke="#fff" strokeWidth="6" opacity="0.7" />
      <path d="M10 545 H390" stroke="#fff" strokeWidth="7" strokeDasharray="34 26" strokeLinecap="round" />
    </>
  ),
  underwater: (
    <>
      <path d="M120 0 L170 0 L90 420 L20 420Z M260 0 L310 0 L330 420 L250 420Z" fill="#fff" opacity="0.18" />
      {[[60, 120], [320, 90], [90, 300], [340, 260], [200, 60]].map(([x, y], i) => (
        <circle key={i} className="twinkle" style={{ '--d': `${i * 0.5}s` }} cx={x} cy={y} r={6 + (i % 3) * 3} fill="none" stroke="#fff" strokeWidth="2.5" opacity="0.7" />
      ))}
      <path d="M0 520 Q100 480 200 520 T400 505 V600 H0Z" fill="#ffe3a8" />
      {[40, 120, 330, 370].map((x, i) => (
        <path key={x} d={`M${x} 540 q-14 -40 0 -70 q14 -30 0 -60`} fill="none" stroke="#5fc48d" strokeWidth="9" strokeLinecap="round" />
      ))}
      <circle cx="250" cy="545" r="16" fill="#ffb3c7" />
      <circle cx="285" cy="560" r="10" fill="#ff9ec2" />
    </>
  ),
  sea: (
    <>
      <circle cx="320" cy="110" r="44" fill="#ffe08a" />
      <Cloud x={90} y={100} />
      <Cloud x={230} y={190} scale={0.8} className="slow" />
      <path d="M40 150 q12 -14 24 0 q12 -14 24 0" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M0 440 H400 V600 H0Z" fill="#8fd3f5" />
      <path d="M0 440 Q50 425 100 440 T200 440 T300 440 T400 440" fill="none" stroke="#fff" strokeWidth="5" opacity="0.8" />
      <path d="M0 500 Q60 485 120 500 T240 500 T360 500 T480 500 V600 H0Z" fill="#6fbfe8" />
    </>
  ),
  garden: (
    <>
      <circle cx="320" cy="90" r="40" fill="#ffe08a" />
      <Cloud x={100} y={110} />
      <path d="M0 450 Q120 410 240 450 T400 430 V600 H0Z" fill="#b9ecc3" />
      <path d="M0 520 Q140 490 270 525 T400 510 V600 H0Z" fill="#8fe0a8" />
      {[20, 80, 140, 200, 260, 320, 380].map((x) => (
        <g key={x}>
          <rect x={x - 6} y="470" width="12" height="60" rx="4" fill="#fff" opacity="0.85" />
          <path d={`M${x - 6} 470 l6 -12 l6 12z`} fill="#fff" opacity="0.85" />
        </g>
      ))}
    </>
  ),
  pond: (
    <>
      <circle cx="80" cy="90" r="36" fill="#fff0a8" />
      <Cloud x={280} y={110} />
      <path d="M0 440 Q120 410 240 440 T400 430 V600 H0Z" fill="#c5eec2" />
      <ellipse cx="200" cy="520" rx="260" ry="90" fill="#8fd3f5" />
      <ellipse cx="200" cy="520" rx="200" ry="60" fill="none" stroke="#fff" strokeWidth="3" opacity="0.6" />
      <ellipse cx="70" cy="545" rx="26" ry="9" fill="#6fcf97" />
      <ellipse cx="340" cy="500" rx="22" ry="8" fill="#6fcf97" />
      {[20, 372].map((x) => (
        <g key={x}>
          <path d={`M${x} 520 V440`} stroke="#6fcf97" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx={x} cy="435" rx="7" ry="16" fill="#b98055" />
        </g>
      ))}
    </>
  ),
  room: (
    <>
      <rect x="70" y="60" width="260" height="230" rx="18" fill="#bfe3ff" stroke="#fff" strokeWidth="10" />
      <path d="M200 60 V290 M70 175 H330" stroke="#fff" strokeWidth="8" />
      <circle cx="270" cy="110" r="26" fill="#ffe08a" />
      <rect x="0" y="470" width="400" height="130" fill="#f3c999" />
      <path d="M0 470 H400" stroke="#e0ad78" strokeWidth="5" />
      <ellipse cx="200" cy="540" rx="170" ry="34" fill="#ffb3c7" />
      <ellipse cx="200" cy="540" rx="120" ry="22" fill="none" stroke="#fff" strokeWidth="4" opacity="0.7" />
      <circle cx="340" cy="520" r="22" fill="#a78bfa" />
      <path d="M322 510 q18 10 36 0 M320 524 q20 10 40 0" fill="none" stroke="#fff" strokeWidth="3" />
    </>
  ),
};

export default function Backdrop({ theme }) {
  return (
    <div className="backdrop" style={{ background: `linear-gradient(180deg, ${theme.sky[0]}, ${theme.sky[1]})` }} aria-hidden="true">
      <svg viewBox="0 0 400 600" preserveAspectRatio="xMidYMax slice" width="100%" height="100%">
        {SCENES[theme.scenery]}
      </svg>
    </div>
  );
}
