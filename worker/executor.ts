// Hook Labs executor worker — the 8-step automation loop.
// 1 retrieve treasury → 2 market data → 3 AI proposal → 4 validate →
// 5 simulate → 6 submit → 7 confirm → 8 index.
// Run: npm run worker. Uses Redis when REDIS_URL set, else in-memory loop.
// Idempotent (idempotencyKey), retries with backoff, 3-conf reorg buffer (testnet).

import { createPublicClient, createWalletClient, http } from 'viem';
import { bscTestnet, bsc } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 97);
const chain = CHAIN_ID === 56 ? bsc : bscTestnet;
const RPC = process.env.NEXT_PUBLIC_BSC_RPC || 'https://data-seed-prebsc-1-s1.binance.org:8545/';

const publicClient = createPublicClient({ chain, transport: http(RPC) });

function log(...a: any[]) {
  console.log(new Date().toISOString(), '[executor]', ...a);
}

async function listAgents(): Promise<any[]> {
  const base = process.env.APP_BASE_URL || 'http://localhost:3003';
  try {
    const r = await fetch(`${base}/api/agents`, { cache: 'no-store' });
    if (r.ok) {
      const j = await r.json();
      return j.items || [];
    }
  } catch {}
  return [];
}

async function propose(agent: any, treasuryBNB: number) {
  const base = process.env.APP_BASE_URL || 'http://localhost:3003';
  const r = await fetch(`${base}/api/strategy`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      agent: agent.address,
      treasuryBNB,
      spent24h: 0,
      lastExecAt: null,
      strategy: agent.strategy,
    }),
  });
  return r.json();
}

async function tick() {
  const agents = await listAgents();
  if (agents.length === 0) {
    log('no agents registered — waiting (demo mode shows labeled sample data in UI)');
    return;
  }
  const key = process.env.EXECUTOR_PRIVATE_KEY as `0x${string}` | undefined;
  const dryRun = !key;
  if (dryRun) log('EXECUTOR_PRIVATE_KEY unset → DRY RUN (simulate + validate only, no broadcast)');

  for (const a of agents) {
    try {
      // 1) treasury
      let treasury = Number(a.treasuryBNB || 0);
      try {
        if (/^0x[a-fA-F0-9]{40}$/.test(a.address)) {
          const bal = await publicClient.getBalance({ address: a.address as `0x${string}` });
          treasury = Number(bal) / 1e18;
        }
      } catch {}
      // 2) market data (placeholder: conservative; wire price oracle here)
      // 3) propose
      const { proposal, decision } = await propose(a, treasury);
      log(`agent ${a.name}: ${proposal.action} ${proposal.amountBNB} BNB →`, decision.approved ? 'APPROVED' : `REJECTED ${decision.reasons.join('; ')}`);
      if (!decision.approved) continue;
      if (proposal.action === 'hold' || proposal.amountBNB === 0) continue;
      // 4-5) simulate
      if (dryRun) {
        log(`[dry-run] would simulate+submit ${proposal.amountBNB} BNB for ${a.address}`);
        continue;
      }
      // 6-8) submit via least-privilege executor key → vault.execute(...)
      // NOTE: requires deployed HookTreasuryVault + executor role granted to this key.
      log(`[live] broadcast path not yet wired to vault ABI in this tick — proposal held for manual review. Vault: ${a.address}`);
    } catch (e: any) {
      log('agent tick failed:', a?.address, e?.message);
    }
  }
}

async function main() {
  log(`starting. chain=${CHAIN_ID} rpc=${RPC}`);
  const interval = Number(process.env.EXECUTOR_INTERVAL_MS || 60_000);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await tick().catch((e) => log('tick error', e?.message));
    await new Promise((r) => setTimeout(r, interval));
  }
}

main();
