'use client';
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [health, setHealth] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/health').then(r=>r.json()).then(setHealth).catch(()=>{});
    fetch('/api/agents').then(r=>r.json()).then(j=>setAgents(j.items||[])).catch(()=>{});
  }, []);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-bone">Administration</h1>
      <p className="mt-2 text-ash">Operator view. Production actions require <span className="font-mono">ADMIN_ADDRESSES</span> + audited contracts. Demo mode never claims mainnet liveness.</p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-charcoal p-5">
          <h3 className="font-semibold text-bone">System health</h3>
          <pre className="mt-2 overflow-auto rounded-xl bg-void p-3 font-mono text-xs text-ash">{JSON.stringify(health, null, 2) || 'loading…'}</pre>
        </div>
        <div className="rounded-2xl border border-line bg-charcoal p-5">
          <h3 className="font-semibold text-bone">Queue / workers</h3>
          <ul className="mt-2 space-y-1 font-mono text-xs text-ash">
            <li>● executor: {health?.redis ? 'redis-backed' : 'in-memory fallback'}</li>
            <li>● indexer: bsc-testnet polling + BscScan links</li>
            <li>● idempotency: agent + time-window keys</li>
            <li>● reorg policy: 3-confirmation buffer (testnet)</li>
          </ul>
          <div className="mt-3 text-sm text-ash">Run locally: <code className="font-mono text-bone">npm run worker</code></div>
        </div>
      </div>
      <h2 className="mt-8 font-display text-xl font-bold text-bone">Registered agents ({agents.length})</h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-charcoal text-left text-xs uppercase text-ash"><tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Address</th><th className="px-4 py-2">Strategy</th><th className="px-4 py-2">Source</th></tr></thead>
          <tbody className="divide-y divide-line bg-void">
            {agents.map((a:any)=><tr key={a.address}><td className="px-4 py-2 text-bone">{a.name}</td><td className="px-4 py-2 font-mono text-ash">{a.address}</td><td className="px-4 py-2 text-ash">{a.strategy}</td><td className="px-4 py-2 text-ash">{a.source||'api'}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
