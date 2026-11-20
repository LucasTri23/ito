// Logo da Jogatina: um dado com carinha. Mesmo desenho do public/favicon.svg.
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      className="logo-dice"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <g transform="rotate(-10 32 32)">
        <rect x="7" y="10" width="50" height="50" rx="14" fill="#E0951A" />
        <rect x="7" y="5" width="50" height="50" rx="14" fill="#FFC23D" />
        <rect x="13" y="9" width="22" height="7" rx="3.5" fill="#FFE29A" />
        <g className="logo-eyes">
          <circle cx="22" cy="26" r="4.6" fill="#0E1530" />
          <circle cx="42" cy="26" r="4.6" fill="#0E1530" />
          <circle cx="23.4" cy="24.6" r="1.4" fill="#FFFFFF" />
          <circle cx="43.4" cy="24.6" r="1.4" fill="#FFFFFF" />
        </g>
        <ellipse cx="15.5" cy="35" rx="4" ry="2.6" fill="#FF4F8B" opacity="0.85" />
        <ellipse cx="48.5" cy="35" rx="4" ry="2.6" fill="#FF4F8B" opacity="0.85" />
        <path
          d="M23 36 Q32 46 41 36"
          fill="none"
          stroke="#0E1530"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
