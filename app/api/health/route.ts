import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: 'hook-labs',
    mode: process.env.NEXT_PUBLIC_MODE || 'demo',
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 97),
    registry: process.env.NEXT_PUBLIC_REGISTRY_ADDRESS || null,
    redis: Boolean(process.env.REDIS_URL),
    db: Boolean(process.env.DATABASE_URL || process.env.SUPABASE_URL),
    llm: Boolean(process.env.LLM_API_URL && process.env.LLM_API_KEY),
    time: new Date().toISOString(),
    note:
      (process.env.NEXT_PUBLIC_MODE || 'demo') === 'mainnet'
        ? 'Mainnet requires audit + explicit authorization.'
        : 'Non-mainnet mode: do not present demo/testnet data as live mainnet.',
  });
}
