import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), '.data-agents.json');

function readLocal() {
  try {
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return [];
  }
}
function writeLocal(items: any[]) {
  try {
    fs.writeFileSync(FILE, JSON.stringify(items, null, 2));
  } catch {}
}

function isAddr(s: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(s) || /^0xH00k/i.test(s);
}

export async function GET() {
  // Prefer Supabase when configured (server-side only)
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    try {
      const r = await fetch(`${url}/rest/v1/agents?select=*&order=created_at.desc&limit=100`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: 'no-store',
      });
      if (r.ok) {
        const rows = await r.json();
        return NextResponse.json({
          items: rows.map((x: any) => ({
            address: x.vault_address,
            token: x.token_address,
            tokenSymbol: x.token_symbol,
            name: x.name,
            owner: x.owner,
            strategy: x.strategy,
            chainId: x.chain_id,
            createdAt: x.created_at,
            treasuryBNB: x.treasury_bnb || '0.00',
            txHash: x.deploy_tx,
            status: x.status || 'active',
            source: 'onchain',
          })),
          source: 'supabase',
        });
      }
    } catch {}
  }
  return NextResponse.json({ items: readLocal(), source: 'local' });
}

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const { name, token, tokenSymbol, owner, strategy, chainId } = b;
    if (!name || String(name).length < 3) return NextResponse.json({ error: 'Agent name too short' }, { status: 400 });
    if (!tokenSymbol || String(tokenSymbol).length < 2) return NextResponse.json({ error: 'Token symbol required' }, { status: 400 });
    if (!isAddr(String(token))) return NextResponse.json({ error: 'Invalid token address' }, { status: 400 });
    if (!isAddr(String(owner))) return NextResponse.json({ error: 'Invalid owner address' }, { status: 400 });

    // Pseudo-deterministic vault address for demo/testnet intent (real address after forge deploy)
    const seed = `${token}${owner}${Date.now()}`.toLowerCase();
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const pseudo = `0xH00k${h.toString(16).padStart(32, '0').slice(0, 32)}`.slice(0, 42);

    const agent = {
      address: pseudo,
      token,
      tokenSymbol: String(tokenSymbol).toUpperCase(),
      name: String(name),
      owner,
      strategy: strategy || 'balanced',
      chainId: Number(chainId) || 97,
      createdAt: new Date().toISOString(),
      treasuryBNB: '0.00',
      status: 'active',
    };
    const all = readLocal();
    all.unshift(agent);
    writeLocal(all.slice(0, 200));
    return NextResponse.json({ agent, source: 'local', note: 'Demo/testnet intent. Fund vault + deploy contracts for on-chain custody.' });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 });
  }
}
