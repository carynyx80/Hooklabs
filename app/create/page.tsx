'use client';
import { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { isAddr } from '@/lib/format';
import { DEFAULT_POLICIES, type StrategyId } from '@/lib/policy';
import { saveAgent, ensureDemoSeed } from '@/lib/store';
import { useEffect } from 'react';

const STEPS = ['Connect', 'Configure', 'Deploy', 'Automate'];

export default function CreatePage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [strategy, setStrategy] = useState<StrategyId>('balanced');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { ensureDemoSeed(); }, []);

  const policy = DEFAULT_POLICIES[strategy];
  const valid = name.trim().length >= 3 && symbol.trim().length >= 2 && isAddr(token);

  async function deploy() {
    setError(null); setResult(null);
    if (!isConnected) { setError('Connect a BNB Chain wallet first.'); return; }
    if (chainId !== 97 && chainId !== 56) { setError('Switch to BSC Testnet (97) or BNB Chain (56).'); return; }
    if (!valid) { setError('Enter an agent name, token symbol, and a valid 0x token address.'); return; }
    setBusy(true);
    try {
      // 1) Persist intent via API (Supabase when configured, else demo store)
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(), tokenSymbol: symbol.trim().toUpperCase(),
          token, owner: address, strategy, chainId,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'Registration failed');
      // 2) Mirror locally for instant UX
      saveAgent({
        address: j.agent.address, token, tokenSymbol: symbol.trim().toUpperCase(),
        name: name.trim(), owner: address || '0x', strategy, chainId,
        createdAt: new Date().toISOString(), treasuryBNB: '0.00',
        txHash: j.agent.txHash, status: 'active',
        source: j.source === 'onchain' ? 'onchain' : 'local',
      });
      setResult(j.agent.address);
    } catch (e: any) {
      setError(e?.message || 'Deployment failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-bone">Launch an Agent</h1>
      <p className="mt-2 text-ash">Four stages. Caps are enforced on-chain — the executor can never bypass them.</p>

      <div className="mt-6 grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className={`rounded-xl border p-3 text-center text-sm ${i <= 1 ? 'border-crimson-700 bg-card text-bone' : 'border-line bg-charcoal text-ash'}`}>
            <div className="font-mono text-xs">0{i + 1}</div>
            <div className="font-semibold">{s}</div>
          </div>
        ))}
      </div>

      <div className="hl-card mt-6 rounded-2xl p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <div className="mb-1 text-ash">Agent name</div>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Crimson Vault Alpha"
              className="hl-ghost w-full rounded-xl px-4 py-3 text-bone placeholder:text-ash" />
          </label>
          <label className="text-sm">
            <div className="mb-1 text-ash">Token symbol</div>
            <input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} placeholder="HOOK"
              className="hl-ghost w-full rounded-xl px-4 py-3 text-bone placeholder:text-ash" />
          </label>
        </div>
        <label className="mt-4 block text-sm">
          <div className="mb-1 text-ash">Token contract (BNB Chain, 0x…)</div>
          <input value={token} onChange={(e) => setToken(e.target.value.trim())} placeholder="0x…"
            className="hl-ghost w-full rounded-xl px-4 py-3 font-mono text-bone placeholder:text-ash" />
        </label>

        <div className="mt-4 text-sm text-ash">Strategy → deterministic caps</div>
        <div className="mt-2 grid gap-2 sm:grid-cols-4">
          {(Object.keys(DEFAULT_POLICIES) as StrategyId[]).filter(s=>s!=='custom').map((s) => (
            <button key={s} onClick={() => setStrategy(s)}
              className={`rounded-xl border p-3 text-left capitalize ${strategy===s?'border-crimson-700 bg-card text-bone':'border-line bg-void text-ash'}`}>
              <div className="font-semibold">{s}</div>
              <div className="mt-1 font-mono text-[11px]">
                {DEFAULT_POLICIES[s].maxSpendPerTxBNB} BNB/tx · {DEFAULT_POLICIES[s].dailySpendCapBNB}/day
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-line bg-void p-4 font-mono text-xs text-ash">
          policy: max {policy.maxSpendPerTxBNB} BNB/tx · {policy.dailySpendCapBNB} BNB/24h ·
          interval {policy.minIntervalSec}s · slippage ≤ {policy.maxSlippageBps}bps
        </div>

        {error && <div className="mt-4 rounded-xl border border-crimson-700 bg-card p-3 text-sm text-bone">⚠ {error}</div>}
        {result && (
          <div className="mt-4 rounded-xl border border-crimson-700 bg-card p-4 text-sm">
            <div className="font-semibold text-bone">Agent registered: <span className="font-mono">{result}</span></div>
            <div className="mt-2 flex gap-2">
              <a href={`/agents/${result}`} className="hl-btn rounded-lg px-4 py-2 text-bone">View profile</a>
              <a href="/dashboard" className="hl-ghost rounded-lg px-4 py-2 text-bone">Open dashboard</a>
            </div>
            <p className="mt-2 text-xs text-ash">Treasury custody: fund the vault address directly (manual deposits). Tax routing only if the token contract supports it.</p>
          </div>
        )}

        <button onClick={deploy} disabled={busy || !valid}
          className="hl-btn mt-6 w-full rounded-xl px-6 py-3 font-semibold text-bone disabled:opacity-40">
          {busy ? 'Registering on-chain intent…' : isConnected ? 'Deploy Treasury Agent' : 'Connect wallet to deploy'}
        </button>
        <p className="mt-2 text-center text-xs text-ash">
          {chainId === 97 ? 'BSC Testnet ready.' : chainId === 56 ? 'BNB Chain mainnet — audit + explicit authorization required.' : 'Switch network in your wallet.'}
          {' '}No fabricated balances: new vaults start at 0 until funded.
        </p>
      </div>
    </div>
  );
}
