'use client';
// Sophisticated AI-agent → vault → chain visualization. No cartoon robots.
// Deep-red connecting lines, soft motion, terminal aesthetic.
export function HeroViz() {
  return (
    <div className="hl-card drift relative overflow-hidden rounded-2xl p-6 shadow-card">
      <div className="grid-bg absolute inset-0" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between text-xs text-ash">
          <span className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-crimson-800 flow-line" />
            LIVE POLICY ENGINE
          </span>
          <span className="rounded border border-line px-2 py-0.5">BNB CHAIN · MAINNET</span>
        </div>
        <svg viewBox="0 0 520 300" className="w-full" role="img" aria-label="Agent connected to vault and execution modules">
          {/* nodes */}
          <g fontFamily="monospace" fontSize="10" fill="#989292">
            <rect x="190" y="20" width="140" height="58" rx="10" fill="#101010" stroke="#A31930" />
            <circle cx="260" cy="42" r="7" fill="#850F22" className="flow-line" />
            <text x="260" y="62" textAnchor="middle" fill="#F4F2F2">AI AGENT</text>
            <text x="260" y="72" textAnchor="middle">policy-checked</text>

            <rect x="30" y="180" width="140" height="70" rx="10" fill="#14090B" stroke="#292022" />
            <text x="100" y="205" textAnchor="middle" fill="#F4F2F2">TREASURY VAULT</text>
            <text x="100" y="220" textAnchor="middle">4.82 BNB locked</text>
            <text x="100" y="233" textAnchor="middle">caps enforced</text>

            <rect x="190" y="180" width="140" height="70" rx="10" fill="#14090B" stroke="#292022" />
            <text x="260" y="205" textAnchor="middle" fill="#F4F2F2">EXECUTION</text>
            <text x="260" y="220" textAnchor="middle">simulate → submit</text>
            <text x="260" y="233" textAnchor="middle">idempotent queue</text>

            <rect x="350" y="180" width="140" height="70" rx="10" fill="#14090B" stroke="#292022" />
            <text x="420" y="205" textAnchor="middle" fill="#F4F2F2">BNB CHAIN</text>
            <text x="420" y="220" textAnchor="middle">confirm + index</text>
            <text x="420" y="233" textAnchor="middle">BscScan verified</text>

            {/* connectors */}
            <path d="M260 78 C 260 130, 100 130, 100 180" fill="none" stroke="#850F22" strokeWidth="1.6" className="flow-line" />
            <path d="M260 78 C 260 130, 260 130, 260 180" fill="none" stroke="#A31930" strokeWidth="1.6" className="flow-line" />
            <path d="M260 78 C 260 130, 420 130, 420 180" fill="none" stroke="#650B18" strokeWidth="1.6" className="flow-line" />
            <path d="M100 215 H190" fill="none" stroke="#292022" strokeWidth="1.2" strokeDasharray="4 4" />
            <path d="M330 215 H350" fill="none" stroke="#292022" strokeWidth="1.2" strokeDasharray="4 4" />
          </g>
        </svg>
        <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[11px] text-ash">
          <div className="rounded-lg border border-line bg-void/60 p-2">evaluate · 43,200s cadence</div>
          <div className="rounded-lg border border-line bg-void/60 p-2">validate · caps + allow-list</div>
          <div className="rounded-lg border border-line bg-void/60 p-2">execute · least-privilege</div>
        </div>
      </div>
    </div>
  );
}
