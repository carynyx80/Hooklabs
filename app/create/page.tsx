'use client';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { STRATEGIES, type StrategyId } from '@/lib/strategies';

const ORDER: StrategyId[] = ['conservative', 'balanced', 'aggressive', 'buyback'];

export default function CreatePage() {
  const { address, isConnected } = useAccount();
  const [name, setName] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [strategy, setStrategy] = useState<StrategyId>('balanced');
  const [maxPerTx, setMaxPerTx] = useState(String(STRATEGIES.balanced.maxPerTxBNB));
  const [dailyCap, setDailyCap] = useState(String(STRATEGIES.balanced.dailyCapBNB));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<string | null>(null);

  function pick(s: StrategyId) {
    setStrategy(s);
    setMaxPerTx(String(STRATEGIES[s].maxPerTxBNB));
    setDailyCap(String(STRATEGIES[s].dailyCapBNB));
  }

  async function submit() {
    setError(null);
    setAgentId(null);
    if (!isConnected || !address) {
      setError('Connect your wallet first (top-right button).');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          tokenAddress: tokenAddress.trim(),
          tokenSymbol,
          strategy,
          maxPerTxBNB: Number(maxPerTx),
          dailyCapBNB: Number(dailyCap),
          owner: address,
          chainId: 56,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'Registration failed.');
      setAgentId(j.agent.id);
    } catch (e: any) {
      setError(e?.message || 'Registration failed.');
    } finally {
      setBusy(false);
    }
  }

  const input =
    'hl-ghost w-full rounded-xl px-4 py-3 text-sm text-bone placeholder:text-ash';

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-bone">Launch an Agent</h1>
      <p className="mt-2 text-ash">
        Step 1: register your token and set spending rules. This saves to the
        on-site registry — no funds move.
      </p>

      <div className="hl-card mt-8 space-y-4 rounded-2xl p-6">
        <label className="block text-sm">
          <div className="mb-1 text-ash">Agent name</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Crimson Vault Alpha"
            className={input}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <div className="mb-1 text-ash">Token contract (0x…)</div>
            <input
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x…"
              spellCheck={false}
              className={`${input} font-mono`}
            />
          </label>
          <label className="block text-sm">
            <div className="mb-1 text-ash">Token symbol</div>
            <input
              value={tokenSymbol}
              onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
              placeholder="HOOK"
              className={input}
            />
          </label>
        </div>

        <div className="text-sm text-ash">Strategy presets</div>
        <div className="grid gap-2 sm:grid-cols-4">
          {ORDER.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => pick(s)}
              className={`rounded-xl border p-3 text-left capitalize ${
                strategy === s
                  ? 'border-crimson-700 bg-card text-bone'
                  : 'border-line bg-void text-ash'
              }`}
            >
              <div className="text-sm font-semibold">{s}</div>
              <div className="mt-1 text-[11px]">
                {STRATEGIES[s].maxPerTxBNB} BNB/tx · {STRATEGIES[s].dailyCapBNB}/day
              </div>
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <div className="mb-1 text-ash">Max per transaction (BNB)</div>
            <input
              value={maxPerTx}
              onChange={(e) => setMaxPerTx(e.target.value)}
              inputMode="decimal"
              className={input}
            />
          </label>
          <label className="block text-sm">
            <div className="mb-1 text-ash">Daily cap (BNB)</div>
            <input
              value={dailyCap}
              onChange={(e) => setDailyCap(e.target.value)}
              inputMode="decimal"
              className={input}
            />
          </label>
        </div>

        {error && (
          <div className="rounded-xl border border-crimson-700 bg-card p-3 text-sm text-bone">
            ⚠ {error}
          </div>
        )}
        {agentId && (
          <div className="rounded-xl border border-crimson-700 bg-card p-4 text-sm">
            <div className="font-semibold text-bone">Agent registered ✓</div>
            <div className="mt-1 font-mono text-xs text-ash">ID: {agentId}</div>
            <p className="mt-2 text-xs text-ash">
              Saved to the registry. A public explorer to browse agents comes in the next step.
            </p>
          </div>
        )}

        <button
          onClick={submit}
          disabled={busy}
          className="hl-btn w-full rounded-xl px-6 py-3 font-semibold text-bone disabled:opacity-40"
        >
          {busy ? 'Saving…' : isConnected ? 'Register Agent' : 'Connect wallet to register'}
        </button>
      </div>
    </div>
  );
}
