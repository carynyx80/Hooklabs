'use client';

export interface StoredAgent {
  address: string; // vault address (or pseudo in demo)
  token: string;
  tokenSymbol: string;
  name: string;
  owner: string;
  strategy: string;
  chainId: number;
  createdAt: string;
  treasuryBNB: string;
  txHash?: string;
  status: 'active' | 'paused';
  source: 'onchain' | 'local' | 'demo';
}

export interface ActivityItem {
  id: string;
  agent: string;
  agentName: string;
  tokenSymbol: string;
  action: string;
  amount: string;
  status: 'confirmed' | 'pending' | 'failed' | 'simulated';
  txHash?: string;
  timestamp: string;
  source: 'onchain' | 'demo';
}

const AGENTS_KEY = 'hooklabs:agents:v1';
const DEMO_FLAG = 'hooklabs:demo-seeded:v1';

const DEMO_AGENTS: StoredAgent[] = [
  {
    address: '0xH00k000000000000000000000000000000000001',
    token: '0xToKeN000000000000000000000000000000000001',
    tokenSymbol: 'HOOK',
    name: 'Crimson Vault Alpha',
    owner: '0xDeployer0000000000000000000000000000000001',
    strategy: 'buyback',
    chainId: 97,
    createdAt: new Date(Date.now() - 86400_000 * 6).toISOString(),
    treasuryBNB: '4.82',
    txHash: '0xdemo000000000000000000000000000000000000000000000000000000000001',
    status: 'active',
    source: 'demo',
  },
  {
    address: '0xH00k000000000000000000000000000000000002',
    token: '0xToKeN000000000000000000000000000000000002',
    tokenSymbol: 'LABS',
    name: 'Obsidian Treasury Beta',
    owner: '0xDeployer0000000000000000000000000000000002',
    strategy: 'balanced',
    chainId: 97,
    createdAt: new Date(Date.now() - 86400_000 * 3).toISOString(),
    treasuryBNB: '2.14',
    status: 'active',
    source: 'demo',
  },
];

const DEMO_ACTIVITY: ActivityItem[] = [
  {
    id: 'demo-act-1',
    agent: DEMO_AGENTS[0].address,
    agentName: DEMO_AGENTS[0].name,
    tokenSymbol: 'HOOK',
    action: 'buyback',
    amount: '0.42 BNB',
    status: 'simulated',
    timestamp: new Date(Date.now() - 3600_000 * 5).toISOString(),
    source: 'demo',
  },
  {
    id: 'demo-act-2',
    agent: DEMO_AGENTS[1].address,
    agentName: DEMO_AGENTS[1].name,
    tokenSymbol: 'LABS',
    action: 'hold',
    amount: '—',
    status: 'simulated',
    timestamp: new Date(Date.now() - 3600_000 * 26).toISOString(),
    source: 'demo',
  },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* quota / ssr */
  }
}

export function ensureDemoSeed() {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(DEMO_FLAG)) return;
  const existing = read<StoredAgent[]>(AGENTS_KEY, []);
  if (existing.length === 0) write(AGENTS_KEY, DEMO_AGENTS);
  localStorage.setItem(DEMO_FLAG, '1');
}

export function listAgents(): StoredAgent[] {
  return read<StoredAgent[]>(AGENTS_KEY, []);
}

export function saveAgent(a: StoredAgent) {
  const all = listAgents();
  const i = all.findIndex((x) => x.address.toLowerCase() === a.address.toLowerCase());
  if (i >= 0) all[i] = a;
  else all.unshift(a);
  write(AGENTS_KEY, all);
}

export function getAgent(address: string): StoredAgent | undefined {
  return listAgents().find((a) => a.address.toLowerCase() === address.toLowerCase());
}

export async function fetchActivity(): Promise<ActivityItem[]> {
  try {
    const r = await fetch('/api/activity', { cache: 'no-store' });
    if (r.ok) {
      const j = await r.json();
      if (Array.isArray(j.items) && j.items.length > 0) return j.items as ActivityItem[];
    }
  } catch {
    /* offline -> demo */
  }
  return DEMO_ACTIVITY;
}

export function demoActivity(): ActivityItem[] {
  return DEMO_ACTIVITY;
}
