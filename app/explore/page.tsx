'use client';
import { useEffect, useMemo, useState } from 'react';
import { AgentCard } from '@/components/AgentCard';
import { ensureDemoSeed, listAgents, type StoredAgent } from '@/lib/store';

export default function ExplorePage() {
  const [agents, setAgents] = useState<StoredAgent[]>([]);
  const [q, setQ] = useState('');
  const [strategy, setStrategy] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ensureDemoSeed();
    fetch('/api/agents', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.items?.length) setAgents(j.items);
        else setAgents(listAgents());
      })
      .catch(() => setAgents(listAgents()))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return agents.filter((a) => {
      if (strategy !== 'all' && a.strategy !== strategy) return false;
      if (!q) return true;
      const s = q.toLowerCase();
      return (
        a.name.toLowerCase().includes(s) ||
        a.tokenSymbol.toLowerCase().includes(s) ||
        a.address.toLowerCase().includes(s)
      );
    });
  }, [agents, q, strategy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-bone">Explore Agents</h1>
      <p className="mt-2 text-ash">
        Public directory. Inspect treasury activity without connecting a wallet. BscScan links on every profile.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, symbol, or address…"
          className="hl-ghost w-full rounded-xl px-4 py-3 text-sm text-bone placeholder:text-ash"
        />
        <select
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          className="hl-ghost rounded-xl px-4 py-3 text-sm text-bone bg-void"
        >
          <option value="all">All strategies</option>
          <option value="conservative">Conservative</option>
          <option value="balanced">Balanced</option>
          <option value="aggressive">Aggressive</option>
          <option value="buyback">Buyback &amp; Burn</option>
        </select>
      </div>
      {loading ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl border border-line bg-charcoal" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-charcoal p-10 text-center text-ash">
          No agents match. Deploy the first one from <a className="text-bone underline" href="/create">Launch Agent</a>.
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {filtered.map((a) => (
            <AgentCard key={a.address} a={a} />
          ))}
        </div>
      )}
    </div>
  );
}
