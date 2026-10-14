import Link from 'next/link';
import { HeroViz } from '@/components/HeroViz';
import { ActivityTable } from '@/components/ActivityTable';
import { demoActivity } from '@/lib/store';

export default async function Home() {
  let activity = demoActivity();
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3003';
    const r = await fetch(`${base}/api/activity`, { cache: 'no-store' }).catch(() => null);
    if (r?.ok) {
      const j = await r.json();
      if (Array.isArray(j.items) && j.items.length) activity = j.items;
    }
  } catch {
    /* demo fallback */
  }

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-2 lg:pt-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-charcoal px-3 py-1 text-xs text-ash">
              <span className="h-1.5 w-1.5 rounded-full bg-crimson-700" />
              AUTONOMOUS INTELLIGENCE FOR ON-CHAIN TREASURIES · BNB CHAIN
            </div>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.02] text-bone sm:text-6xl">
              Your Treasury.
              <br />
              On Autopilot.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ash">
              Hook Labs introduces autonomous AI agents that manage on-chain token
              treasuries, execute intelligent strategies, and automate token
              operations through transparent, programmable smart contracts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/create" className="hl-btn rounded-xl px-6 py-3 font-semibold text-bone">
                Launch an Agent
              </Link>
              <Link href="/explore" className="hl-ghost rounded-xl px-6 py-3 font-semibold text-bone">
                Explore Agents
              </Link>
            </div>
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3 text-sm">
              {[
                ['On-chain caps', 'Enforced in vault'],
                ['Least privilege', 'Executor isolated'],
                ['BscScan verified', 'Every execution'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-line bg-charcoal/70 p-3">
                  <div className="font-semibold text-bone">{k}</div>
                  <div className="text-xs text-ash">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <HeroViz />
        </div>
      </section>

      {/* LIVE ACTIVITY */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-bone">Live agent activity</h2>
            <p className="text-sm text-ash">
              Real indexed executions only. Demonstration rows are explicitly labeled when no on-chain history exists.
            </p>
          </div>
          <Link href="/activity" className="text-sm text-ash hover:text-bone">
            View all →
          </Link>
        </div>
        <ActivityTable items={activity.slice(0, 6)} />
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-bone">How Hook Labs Works</h2>
        <p className="mt-2 max-w-2xl text-ash">
          Programmable autonomy with enforceable safeguards. AI proposes — contracts dispose.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            ['01 · Connect', 'Connect a compatible BNB Chain wallet and register a token.', 'Wallet + token registry'],
            ['02 · Configure', 'Choose a treasury strategy and establish spending permissions.', 'Caps, cadence, allow-list'],
            ['03 · Deploy', 'Create an autonomous treasury agent backed by smart contracts.', 'Vault + policy engine'],
            ['04 · Automate', 'Agent evaluates on schedule, simulates, executes, and indexes results.', 'Queue + BscScan proof'],
          ].map(([t, d, tag]) => (
            <div key={t} className="hl-card rounded-2xl p-5">
              <div className="font-display font-bold text-bone">{t}</div>
              <p className="mt-2 text-sm text-ash">{d}</p>
              <div className="mt-3 inline-block rounded border border-line px-2 py-0.5 font-mono text-[11px] text-ash">
                {tag}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STRATEGIES */}
      <section className="border-y border-line bg-charcoal/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-bone">Strategies with hard limits</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ['Conservative', '0.25 BNB/tx · 1 BNB/day · 24h cadence', 'Capital preservation'],
              ['Balanced', '0.5 BNB/tx · 2.5 BNB/day · 12h cadence', 'Steady buybacks'],
              ['Aggressive', '1 BNB/tx · 5 BNB/day · 6h cadence', 'High-tempo ops'],
              ['Buyback & Burn', '0.75 BNB/tx · 3 BNB/day · 12h cadence', 'Deflationary flow'],
            ].map(([t, l, d]) => (
              <div key={t} className="rounded-2xl border border-line bg-void p-5">
                <div className="font-semibold text-bone">{t}</div>
                <div className="mt-1 font-mono text-xs text-crimson-700">{l}</div>
                <div className="mt-2 text-sm text-ash">{d}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-line bg-void p-4 text-sm text-ash">
            <span className="font-semibold text-bone">Security model: </span>
            timelocked sensitive changes · reentrancy protection · full event emission ·
            executor can never bypass vault caps · manual deposits first · token-tax routing only
            where the token contract provides an authorized mechanism.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="hl-card rounded-3xl p-10 text-center">
          <h2 className="font-display text-3xl font-bold text-bone">Deploy programmable autonomy.</h2>
          <p className="mx-auto mt-2 max-w-xl text-ash">
            Start on BSC testnet. Validate caps, simulation, and indexing before even considering mainnet.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/create" className="hl-btn rounded-xl px-6 py-3 font-semibold text-bone">
              Launch an Agent
            </Link>
            <Link href="/docs" className="hl-ghost rounded-xl px-6 py-3 text-bone">
              Read Docs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
