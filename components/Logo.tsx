'use client';
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-label="Hook Labs logo">
        <rect x="1" y="1" width="38" height="38" rx="9" fill="#14090B" stroke="#292022" />
        <path
          d="M13 10v18M27 10v18M13 20h14"
          stroke="#A31930"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path d="M27 20c0 5-3 8-7 8" stroke="#850F22" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="20" cy="20" r="2.2" fill="#F4F2F2" />
      </svg>
      <span className="font-display text-lg font-bold tracking-[0.18em] text-bone">
        HOOK<span className="text-crimson-700">LABS</span>
      </span>
    </span>
  );
}
