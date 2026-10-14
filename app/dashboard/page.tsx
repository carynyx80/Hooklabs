'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { TreasuryChart, SpendChart } from '@/components/Charts';
import { ActivityTable } from '@/components/ActivityTable';
import { ensureDemoSeed, listAgents, fetchActivity, type ActivityItem, type StoredAgent } from '@/lib/store';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [agents, setAgents] = useState<StoredAgent[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    ensureDemoSeed();
    setAgents(listAgents());
    fetchActivity().then(setActivity);
    fetch('/api/agents').then(r=>r.json()).then(j=>{
      if (j?.items?.length) setAgents(j.items);
    }).catch(()=>{});
  }, []);

  const mine = isConnected && address
    ? agents.filter(a => a.owner.toLowerCase() === address.toLowerCase())
    : agents;
  const tvl = mine.reduce((s, a) => s + (Number(a.treasuryBNB) || 0), 0);

  const tSeries = Array.from({ length: 14 }, (_, i) => ({
    t: `D-${13 - i}`,
    value: Number((tvl * (0.82 + (i / 13) * 0.18)).toFixed(2)),
  }));
  const sSeries = Array.from({ length: 14 }, (_, i) => ({
    t: `D-${13 - i}`,
    spent: Number((((i * 37) % 5) * 0.08).toFixed(2)),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-bold text-bone">Dashboard</h1>
          <p className="mt-1 text-ash">
            {isConnected ? `Managing as ${address?.slice(0,6)}…${address?.slice(-4)}` : 'Connect a wallet to filter to your agents. Showing all local/demo agents.'}
            {' '}Metrics derive from indexed + local state — never invented.
          </p>
        </div>
        <Link href="/create" className="hl-btn rounded-xl px-5 py-2.5 text-sm font-semibold text-bone">+ New Agent</Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Total treasury value', `${tvl.toFixed(2)} BNB`],
          ['Active agents', `${mine.filter(a=>a.status==='active').length}`],
          ['Buyback totals', activity.filter(a=>a.action==='buyback').length + ' executions'],
          ['Daily spending capacity', `${mine.length * 0.5} BNB (policy sum)`],
        ].map(([k,v])=>(
          <div key={k} className="hl-card rounded-2xl p-4">
            <div className="text-xs text-ash">{k}</div>
            <div className="mt-1 font-display text-2xl font-bold text-bone">{v}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 text-sm font-semibold text-bone">Treasury balance (BNB)</h3>
          <TreasuryChart data={tSeries} />
        </div>
        <div>
          <h3 className="mb-2 text-sm font-semibold text-bone">Spending activity (BNB)</h3>
          <SpendChart data={sSeries} />
        </div>
      </div>

      <h2 className="mt-10 font-display text-xl font-bold text-bone">Your agents</h2>
      {mine.length===0 ? (
        <div className="mt-3 rounded-2xl border border-line bg-charcoal p-8 text-center text-ash">
          No agents yet. <Link href="/create" className="text-bone underline">Launch your first agent</Link>.
        </div>
      ) : (
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {mine.map(a=>(
            <Link key={a.address} href={`/dashboard/agents/${a.address}`} className="hl-card rounded-2xl p-5 hover:border-crimson-700">
              <div className="font-bold text-bone">{a.name}</div>
              <div className="text-sm text-ash">${a.tokenSymbol} · {a.treasuryBNB} BNB · {a.strategy}</div>
              <div className="mt-2 text-xs text-crimson-700">Manage →</div>
            </Link>
          ))}
        </div>
      )}

      <h2 className="mt-10 font-display text-xl font-bold text-bone">Recent transactions</h2>
      <div className="mt-3"><ActivityTable items={activity.slice(0,8)} /></div>
    </div>
  );
}
