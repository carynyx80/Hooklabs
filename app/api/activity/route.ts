import { NextResponse } from 'next/server';

// Real indexed activity when Supabase/BscScan configured; else empty
// (UI renders explicitly labeled demo fallback — never fake volume).
export async function GET(req: Request) {
  const u = new URL(req.url);
  const agent = u.searchParams.get('agent')?.toLowerCase();
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    try {
      let q = `${url}/rest/v1/executions?select=*&order=created_at.desc&limit=100`;
      if (agent) q += `&vault_address=eq.${agent}`;
      const r = await fetch(q, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: 'no-store',
      });
      if (r.ok) {
        const rows = await r.json();
        return NextResponse.json({
          items: rows.map((x: any) => ({
            id: String(x.id),
            agent: x.vault_address,
            agentName: x.agent_name || 'Agent',
            tokenSymbol: x.token_symbol || '',
            action: x.action,
            amount: x.amount_display || `${x.amount_bnb || 0} BNB`,
            status: x.status,
            txHash: x.tx_hash,
            timestamp: x.created_at,
            source: 'onchain',
          })),
          source: 'supabase',
        });
      }
    } catch {}
  }
  return NextResponse.json({ items: [], source: 'empty', note: 'No indexed executions. UI shows labeled demo state.' });
}
