'use client';
export function Logo({ size = 30 }: { size?: number }) {
  const w = Math.round(size * 1.39);
  return (
    <span className="flex items-center gap-2.5">
      <svg
        width={w}
        height={size}
        viewBox="28 12 189 136"
        fill="none"
        aria-label="Hook Labs logo"
      >
        <defs>
          <linearGradient id="hl-stem-nav" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#931828" />
            <stop offset="0.22" stopColor="#CF3040" />
            <stop offset="0.5" stopColor="#701020" />
            <stop offset="1" stopColor="#3C0710" />
          </linearGradient>
          <linearGradient id="hl-ribbon-nav" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#DA4A5A" />
            <stop offset="0.45" stopColor="#A51C2E" />
            <stop offset="1" stopColor="#520B15" />
          </linearGradient>
        </defs>
        <path
          fill="url(#hl-stem-nav)"
          d="M34 18 C46 18 60 18 72 18 L65 27 L65 133 L72 142 C60 142 46 142 34 142 L41 133 L41 27 Z"
        />
        <path
          fill="url(#hl-stem-nav)"
          d="M140 18 C152 18 166 18 176 18 L169 27 L169 113 L201 113 L211 142 C184 142 158 142 133 142 L140 133 L140 27 Z"
        />
        <path
          fill="url(#hl-ribbon-nav)"
          d="M41 66 C80 66 100 74 140 96 C150 101 160 106 169 110 L165 124 C150 117 140 112 128 106 C95 89 75 80 43 80 Z"
        />
        <g
          fill="none"
          stroke="#FF8F9A"
          strokeOpacity="0.45"
          strokeWidth="1.6"
          strokeLinecap="round"
        >
          <path d="M39 21.5 H67" />
          <path d="M145 21.5 H171" />
          <path d="M172 116.5 H197" />
          <path d="M46 69.5 C82 69.5 102 77 138 98" />
        </g>
      </svg>
      <span className="font-display text-lg font-semibold tracking-[0.3em] text-bone">
        HOOK <span className="text-crimson-700">LABS</span>
      </span>
    </span>
  );
}
