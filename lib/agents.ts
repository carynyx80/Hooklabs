import fs from 'fs';
import path from 'path';
import type { StrategyId } from './strategies';

export type { StrategyId };
export { STRATEGIES, isAddress } from './strategies';

export interface Agent {
  id: string;
  name: string;
  tokenAddress: string;
  tokenSymbol: string;
  strategy: StrategyId;
  maxPerTxBNB: number;
  dailyCapBNB: number;
  owner: string;
  chainId: number;
  createdAt: string;
}

const FILE = path.join(process.cwd(), 'data', 'agents.json');

function readAll(): Agent[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, 'utf8')) as Agent[];
  } catch {
    return [];
  }
}

function writeAll(agents: Agent[]) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(agents, null, 2));
}

export function listAgents(): Agent[] {
  return readAll().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function saveAgent(a: Omit<Agent, 'id' | 'createdAt'>): Agent {
  const agent: Agent = {
    ...a,
    id: `agent_${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`,
    createdAt: new Date().toISOString(),
  };
  const all = readAll();
  all.push(agent);
  writeAll(all);
  return agent;
}
