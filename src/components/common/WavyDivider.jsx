export default function WavyDivider({ rotated = false, style = {} }) {
  return (
    <svg
      viewBox="0 0 400 40"
      className={`wavy-divider ${rotated ? 'rotated' : ''}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      aria-hidden="true"
    >
      {/* Primary wavy line - enhanced stroke & opacity */}
      <path
        d="M0 20 Q50 5 100 20 Q150 35 200 20 Q250 5 300 20 Q350 35 400 20"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.8"
      />
      {/* Secondary accent wave */}
      <path
        d="M0 20 Q50 10 100 20 Q150 30 200 20 Q250 10 300 20 Q350 30 400 20"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.55"
      />
      {/* Ornamental gold dot accents */}
      <circle cx="50" cy="27.98" r="2.5" fill="currentColor" opacity="0.85" />
      <circle cx="100" cy="21.13" r="2.5" fill="currentColor" opacity="0.85" />
      <circle cx="150" cy="12.18" r="2.5" fill="currentColor" opacity="0.85" />
      <circle cx="200" cy="17.76" r="2.5" fill="currentColor" opacity="0.85" />
      <circle cx="250" cy="27.50" r="2.5" fill="currentColor" opacity="0.85" />
      <circle cx="300" cy="23.30" r="2.5" fill="currentColor" opacity="0.85" />
      <circle cx="350" cy="12.96" r="2.5" fill="currentColor" opacity="0.85" />
    </svg>
  );
}