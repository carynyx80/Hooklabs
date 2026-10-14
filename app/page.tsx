import { HeroViz } from '@/components/HeroViz';

export default function Home() {
  return (
    <div id="top">
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
              Hook Labs is building autonomous AI agents that manage on-chain
              token treasuries, execute intelligent strategies, and automate
              token operations through transparent, programmable smart contracts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#how" className="hl-btn rounded-xl px-6 py-3 font-semibold text-bone">
                How It Works
              </a>
              <a
                href="https://x.com/Hooklabsworld"
                target="_blank"
                rel="noreferrer"
                className="hl-ghost rounded-xl px-6 py-3 font-semibold text-bone"
              >
                Follow on X
              </a>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-charcoal px-3 py-1 text-xs text-ash">
              Now live on BNB Chain mainnet — follow along on X.
            </div>
          </div>
          <HeroViz />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-bone">How Hook Labs Works</h2>
        <p className="mt-2 max-w-2xl text-ash">
          Programmable autonomy with enforceable safeguards. AI proposes — contracts dispose.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            ['01 · Connect', 'Connect a compatible BNB Chain wallet and register a token.'],
            ['02 · Configure', 'Choose a treasury strategy and establish spending permissions.'],
            ['03 · Deploy', 'Create an autonomous treasury agent backed by smart contracts.'],
            ['04 · Automate', 'The agent evaluates on schedule, simulates, executes, and reports.'],
          ].map(([t, d]) => (
            <div key={t} className="hl-card rounded-2xl p-5">
              <div className="font-display font-bold text-bone">{t}</div>
              <p className="mt-2 text-sm text-ash">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STRATEGIES */}
      <section id="strategies" className="scroll-mt-20 border-y border-line bg-charcoal/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-bone">Strategies with hard limits</h2>
          <p className="mt-2 max-w-2xl text-ash">
            Every strategy ships with on-chain spending caps the executor cannot bypass.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              ['Conservative', '0.25 BNB/tx · 1 BNB/day', 'Capital preservation'],
              ['Balanced', '0.5 BNB/tx · 2.5 BNB/day', 'Steady buybacks'],
              ['Aggressive', '1 BNB/tx · 5 BNB/day', 'High-tempo operations'],
              ['Buyback & Burn', '0.75 BNB/tx · 3 BNB/day', 'Deflationary flow'],
            ].map(([t, l, d]) => (
              <div key={t} className="rounded-2xl border border-line bg-void p-5">
                <div className="font-semibold text-bone">{t}</div>
                <div className="mt-1 font-mono text-xs text-crimson-700">{l}</div>
                <div className="mt-2 text-sm text-ash">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY */}
      <section id="security" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl font-bold text-bone">Security-first design</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['Least privilege', 'The executor can only spend within caps to pre-approved targets.'],
            ['Timelocked changes', 'Sensitive configuration updates wait out a transparent delay.'],
            ['Mainnet ready', 'Deployed on BNB Chain mainnet with testnet-validated safeguards.'],
          ].map(([t, d]) => (
            <div key={t} className="hl-card rounded-2xl p-5">
              <div className="font-semibold text-bone">{t}</div>
              <p className="mt-2 text-sm text-ash">{d}</p>
            </div>
          ))}
        </div>

        <div className="hl-card mt-12 rounded-3xl p-10 text-center">
          <h2 className="font-display text-3xl font-bold text-bone">
            The autonomous intelligence layer for on-chain treasuries.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-ash">
            Follow the build as Hook Labs grows on mainnet.
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href="https://x.com/Hooklabsworld"
              target="_blank"
              rel="noreferrer"
              className="hl-btn rounded-xl px-6 py-3 font-semibold text-bone"
            >
              Follow on X
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
