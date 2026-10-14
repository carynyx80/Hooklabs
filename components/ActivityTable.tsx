'use client';
import Link from 'next/link';
import { shortAddress, timeAgo } from '@/lib/format';
import { txUrl } from '@/lib/config';
import type { ActivityItem } from '@/lib/store';

export function ActivityTable({ items }: { items: ActivityItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-charcoal p-8 text-center">
        <p className="text-bone font-semibold">No on-chain activity indexed yet</p>
        <p className="mt-1 text-sm text-ash">
          Deploy an agent on BSC testnet, or run the executor worker to generate evaluations.
          Demonstration rows are explicitly labeled and never presented as live volume.
        </p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="bg-charcoal text-left text-xs uppercase tracking-wider text-ash">
          <tr>
            <th className="px-4 py-3">Agent</th>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Tx</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-void">
          {items.map((a) => (
            <tr key={a.id} className="hover:bg-card">
              <td className="px-4 py-3">
                <Link href={`/agents/${a.agent}`} className="text-bone hover:underline">
                  {a.agentName}
                </Link>
                <div className="text-xs text-ash">{a.tokenSymbol} · {shortAddress(a.agent)}</div>
              </td>
              <td className="px-4 py-3 capitalize text-bone">{a.action}</td>
              <td className="px-4 py-3 text-ash">{a.amount}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs ${
                    a.status === 'confirmed'
                      ? 'border-crimson-700 text-bone'
                      : a.status === 'failed'
                        ? 'border-line text-ash'
                        : 'border-line text-ash'
                  }`}
                >
                  {a.status}
                  {a.source === 'demo' ? ' · demo' : ''}
                </span>
              </td>
              <td className="px-4 py-3 text-ash">{timeAgo(a.timestamp)}</td>
              <td className="px-4 py-3">
                {a.txHash ? (
                  <a href={txUrl(a.txHash)} target="_blank" rel="noreferrer" className="text-crimson-700 hover:underline">
                    View ↗
                  </a>
                ) : (
                  <span className="text-ash">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
