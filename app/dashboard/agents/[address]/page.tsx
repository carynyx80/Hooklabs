'use client';
import { useEffect, useState } from 'react';
import { addressUrl, txUrl } from '@/lib/config';
import { getAgent, fetchActivity, type StoredAgent, type ActivityItem } from '@/lib/store';
import { shortAddress, timeAgo } from '@/lib/format';
import { TreasuryChart } from '@/components/Charts';

export default function AgentManagePage({ params }: { params: { address: string } }) {
  const addr = decodeURIComponent(params.address);
  const [agent, setAgent] = useState<StoredAgent | undefined>();
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [tab, setTab] = useState<'overview'|'policy'|'history'>('overview');
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setAgent(getAgent(addr));
    fetchActivity().then((all) =>
      setActivity(all.filter((a) => a.agent.toLowerCase() === addr.toLowerCase()))
    );
  }, [addr]);

  if (!agent) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-bone">Agent not found locally</h1>
        <p className="mt-2 text-ash">Try the public profile (on-chain lookup) or reconnect the wallet that created it.</p>
        <a href={`/agents/${addr}`} className="hl-btn mt-4 inline-block rounded-xl px-5 py-2.5 text-bone">Open public profile</a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <a href="/dashboard" className="text-sm text-ash hover:text-bone">← Dashboard</a>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-bone">{agent.name}</h1>
          <p className="font-mono text-sm text-ash">{shortAddress(agent.address, 6)} · ${agent.tokenSymbol}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setPaused(!paused)} className="hl-ghost rounded-xl px-4 py-2 text-sm text-bone">
            {paused ? 'Resume agent' : 'Pause agent'}
          </button>
          <a href={addressUrl(agent.address)} target="_blank" rel="noreferrer" className="hl-btn rounded-xl px-4 py-2 text-sm text-bone">BscScan ↗</a>
        </div>
      </div>

      <div className="mt-4 flex gap-2 text-sm">
        {(['overview','policy','history'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`rounded-lg border px-4 py-2 capitalize ${tab===t?'border-crimson-700 bg-card text-bone':'border-line text-ash'}`}>{t}</button>
        ))}
      </div>

      {tab==='overview' && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="hl-card rounded-2xl p-5">
            <h3 className="font-semibold text-bone">Performance</h3>
            <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-ash text-xs">Treasury</div><div className="text-bone font-bold">{agent.treasuryBNB} BNB</div></div>
              <div><div className="text-ash text-xs">Status</div><div className="text-bone font-bold">{paused?'paused':agent.status}</div></div>
              <div><div className="text-ash text-xs">Strategy</div><div className="text-bone font-bold capitalize">{agent.strategy}</div></div>
              <div><div className="text-ash text-xs">Created</div><div className="text-bone">{timeAgo(agent.createdAt)}</div></div>
            </div>
            <div className="mt-4"><TreasuryChart data={Array.from({length:10},(_,i)=>({t:`T-${9-i}`,value:Number(agent.treasuryBNB)*(0.9+i*0.012)}))} /></div>
          </div>
          <div className="rounded-2xl border border-line bg-charcoal p-5">
            <h3 className="font-semibold text-bone">Operational status</h3>
            <ul className="mt-2 space-y-2 font-mono text-xs text-ash">
              <li>● policy engine: enforcing caps</li>
              <li>● executor queue: {paused?'halted by owner':'listening (cadence-bound)'}</li>
              <li>● last evaluation: {activity[0]?timeAgo(activity[0].timestamp):'no evaluations yet'}</li>
              <li>● custody: manual deposits to vault address</li>
            </ul>
            {agent.txHash && <a href={txUrl(agent.txHash)} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-crimson-700 hover:underline">Deploy tx ↗</a>}
          </div>
        </div>
      )}
      {tab==='policy' && (
        <div className="mt-4 rounded-2xl border border-line bg-charcoal p-6 text-sm text-ash">
          <h3 className="font-semibold text-bone">Spending policies (on-chain enforced)</h3>
          <p className="mt-2">Strategy: <span className="text-bone capitalize">{agent.strategy}</span>. Sensitive changes are timelocked in HookTreasuryVault; executor role cannot raise caps or add arbitrary targets.</p>
          <div className="mt-3 grid gap-2 font-mono text-xs sm:grid-cols-2">
            <div className="rounded border border-line p-3">maxSpendPerTx · strategy-bound</div>
            <div className="rounded border border-line p-3">dailySpendCap · rolling 24h</div>
            <div className="rounded border border-line p-3">minInterval · anti-churn</div>
            <div className="rounded border border-line p-3">allow-list · target whitelist</div>
          </div>
        </div>
      )}
      {tab==='history' && (
        <div className="mt-4 rounded-2xl border border-line bg-charcoal p-5">
          <h3 className="font-semibold text-bone">Execution history</h3>
          {activity.length===0 ? <p className="mt-2 text-sm text-ash">No evaluations recorded yet. Run the worker to evaluate this agent.</p> :
            <ul className="mt-3 space-y-2 text-sm">
              {activity.map(a=><li key={a.id} className="flex justify-between border-b border-line py-2"><span className="text-bone capitalize">{a.action} · {a.amount}</span><span className="text-ash">{a.status} · {timeAgo(a.timestamp)}</span></li>)}
            </ul>}
        </div>
      )}
    </div>
  );
}
