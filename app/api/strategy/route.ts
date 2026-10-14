import { NextResponse } from 'next/server';

// POST /api/strategy — AI proposal + deterministic validation.
// Body: { agent, treasuryBNB, spent24h, lastExecAt, strategy }
// Uses LLM when configured; otherwise deterministic fallback.
// Validation is ALWAYS applied; unapproved proposals are never executable.
export async function POST(req: Request) {
  try {
    const b = await req.json();
    const agent = String(b.agent || '');
    const treasuryBNB = Number(b.treasuryBNB || 0);
    const spent24h = Number(b.spent24h || 0);
    const lastExecAt = b.lastExecAt ? Number(b.lastExecAt) : null;
    const strategy = String(b.strategy || 'balanced');

    const CAPS: Record<string, { maxTx: number; day: number; interval: number; slip: number }> = {
      conservative: { maxTx: 0.25, day: 1, interval: 86400, slip: 100 },
      balanced: { maxTx: 0.5, day: 2.5, interval: 43200, slip: 200 },
      aggressive: { maxTx: 1, day: 5, interval: 21600, slip: 300 },
      buyback: { maxTx: 0.75, day: 3, interval: 43200, slip: 200 },
    };
    const cap = CAPS[strategy] || CAPS.balanced;

    // Deterministic baseline
    const shouldBuy = treasuryBNB >= 0.5;
    let proposal = {
      idempotencyKey: `${agent}-${Math.floor(Date.now() / (cap.interval * 1000))}`,
      agent,
      action: (shouldBuy ? 'buyback' : 'hold') as string,
      amountBNB: shouldBuy ? Number(Math.min(cap.maxTx, treasuryBNB * 0.05).toFixed(4)) : 0,
      target: '0x0000000000000000000000000000000000000000',
      slippageBps: Math.min(150, cap.slip),
      reason: shouldBuy ? 'Treasury above threshold; scheduled buyback within caps.' : 'Hold: below threshold/cooldown.',
      timestamp: Math.floor(Date.now() / 1000),
      model: 'deterministic-fallback',
    };

    // Optional LLM enhancement (proposal only — still validated below)
    const LURL = process.env.LLM_API_URL;
    const LKEY = process.env.LLM_API_KEY;
    if (LURL && LKEY) {
      try {
        const r = await fetch(LURL, {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${LKEY}` },
          body: JSON.stringify({
            model: process.env.LLM_MODEL || 'default',
            messages: [
              { role: 'system', content: 'You propose treasury actions as JSON: {action, amountBNB, slippageBps, reason}. Caps enforced separately; be conservative.' },
              { role: 'user', content: `agent ${agent} treasury ${treasuryBNB} BNB spent24h ${spent24h} strategy ${strategy}` },
            ],
            temperature: 0.2,
          }),
        });
        if (r.ok) {
          const j: any = await r.json();
          const txt: string = j.choices?.[0]?.message?.content || j.output || '';
          const m = txt.match(/\{[\s\S]*\}/);
          if (m) {
            const p = JSON.parse(m[0]);
            if (p.action) proposal.action = String(p.action);
            if (Number.isFinite(Number(p.amountBNB))) proposal.amountBNB = Number(p.amountBNB);
            if (Number.isFinite(Number(p.slippageBps))) proposal.slippageBps = Number(p.slippageBps);
            if (p.reason) proposal.reason = String(p.reason).slice(0, 300);
            proposal.model = process.env.LLM_MODEL || 'llm';
          }
        }
      } catch {
        /* keep deterministic */
      }
    }

    // Deterministic validation (mirrors lib/policy.ts)
    const reasons: string[] = [];
    if (proposal.amountBNB < 0) reasons.push('Negative amount');
    if (proposal.action !== 'hold' && proposal.amountBNB > cap.maxTx) reasons.push(`Exceeds per-tx cap ${cap.maxTx} BNB`);
    if (spent24h + proposal.amountBNB > cap.day) reasons.push(`Exceeds 24h cap ${cap.day} BNB`);
    if (lastExecAt && Date.now() / 1000 - lastExecAt < cap.interval) reasons.push(`Cooldown ${cap.interval}s active`);
    if (proposal.slippageBps > cap.slip) reasons.push(`Slippage exceeds ${cap.slip}bps`);
    if (!['buyback', 'burn', 'hold', 'rebalance'].includes(proposal.action)) reasons.push('Unknown action');
    if (proposal.action === 'hold') proposal.amountBNB = 0;

    return NextResponse.json({
      proposal,
      decision: { approved: reasons.length === 0, reasons },
      enforced: true,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'strategy failed' }, { status: 500 });
  }
}
