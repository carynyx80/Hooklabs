'use client';
import Link from 'next/link';
import type { StoredAgent } from '@/lib/store';
import { shortAddress, timeAgo } from '@/lib/format';

export function AgentCard({ a }: { a: StoredAgent }) {
  return (
    <Link
      href={`/agents/${a.address}`}
      className="hl-card block rounded-2xl p-5 shadow-card transition hover:border-crimson-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-bone">{a.name}</h3>
          <p className="text-sm text-ash">
            ${a.tokenSymbol} · {shortAddress(a.address)}
          </p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-xs ${
            a.status === 'active' ? 'border-crimson-700 text-bone' : 'border-line text-ash'
          }`}
        >
          {a.status}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div>
          <div className="text-xs text-ash">Treasury</div>
          <div className="font-semibold text-bone">{a.treasuryBNB} BNB</div>
        </div>
        <div>
          <div className="text-xs text-ash">Strategy</div>
          <div className="font-semibold capitalize text-bone">{a.strategy}</div>
        </div>
        <div>
          <div className="text-xs text-ash">Created</div>
          <div className="text-bone">{timeAgo(a.createdAt)}</div>
        </div>
      </div>
      {a.source === 'demo' && (
        <div className="mt-3 inline-block rounded border border-line px-2 py-0.5 text-[11px] text-ash">
          demonstration data
        </div>
      )}
    </Link>
  );
}
