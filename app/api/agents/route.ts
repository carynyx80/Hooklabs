import { NextResponse } from 'next/server';
import { listAgents, saveAgent, isAddress, STRATEGIES, type StrategyId } from '@/lib/agents';

export async function GET() {
  return NextResponse.json({ agents: listAgents() });
}

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const name = String(b.name || '').trim();
    const tokenAddress = String(b.tokenAddress || '').trim();
    const tokenSymbol = String(b.tokenSymbol || '').trim().toUpperCase();
    const strategy = String(b.strategy || '') as StrategyId;
    const maxPerTxBNB = Number(b.maxPerTxBNB);
    const dailyCapBNB = Number(b.dailyCapBNB);
    const owner = String(b.owner || '').trim();
    const chainId = Number(b.chainId) === 56 ? 56 : 97;

    if (name.length < 3) return NextResponse.json({ error: 'Agent name must be at least 3 characters.' }, { status: 400 });
    if (!isAddress(tokenAddress)) return NextResponse.json({ error: 'Token address must be a valid 0x address.' }, { status: 400 });
    if (!STRATEGIES[strategy]) return NextResponse.json({ error: 'Unknown strategy.' }, { status: 400 });
    if (!(maxPerTxBNB > 0)) return NextResponse.json({ error: 'Max per-tx must be positive.' }, { status: 400 });
    if (!(dailyCapBNB >= maxPerTxBNB)) return NextResponse.json({ error: 'Daily cap must be at least the per-tx max.' }, { status: 400 });
    if (!isAddress(owner)) return NextResponse.json({ error: 'Connect a wallet first (invalid owner address).' }, { status: 400 });

    const agent = saveAgent({
      name,
      tokenAddress,
      tokenSymbol: tokenSymbol || 'UNKNOWN',
      strategy,
      maxPerTxBNB,
      dailyCapBNB,
      owner,
      chainId,
    });
    return NextResponse.json({ agent }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Could not save agent.' }, { status: 500 });
  }
}
