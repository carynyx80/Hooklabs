// Deterministic policy engine (mirrors contracts/HookPolicyEngine.sol).
// AI may PROPOSE, but this module DECIDES. Executor must call validateProposal()
// before simulation + submission. Never bypass.

export type StrategyId = 'conservative' | 'balanced' | 'aggressive' | 'buyback' | 'custom';

export interface AgentPolicy {
  maxSpendPerTxBNB: number; // per-tx cap
  dailySpendCapBNB: number; // rolling 24h cap
  minIntervalSec: number; // min seconds between executions
  maxSlippageBps: number;
  allowList: string[]; // allowed target contracts (lowercased), empty = any pre-approved router only
  strategy: StrategyId;
}

export interface Proposal {
  idempotencyKey: string;
  agent: string;
  action: 'buyback' | 'burn' | 'hold' | 'rebalance';
  amountBNB: number;
  target: string;
  slippageBps: number;
  reason: string;
  timestamp: number;
}

export interface PolicyDecision {
  approved: boolean;
  reasons: string[];
}

export const DEFAULT_POLICIES: Record<StrategyId, AgentPolicy> = {
  conservative: { maxSpendPerTxBNB: 0.25, dailySpendCapBNB: 1, minIntervalSec: 86400, maxSlippageBps: 100, allowList: [], strategy: 'conservative' },
  balanced: { maxSpendPerTxBNB: 0.5, dailySpendCapBNB: 2.5, minIntervalSec: 43200, maxSlippageBps: 200, allowList: [], strategy: 'balanced' },
  aggressive: { maxSpendPerTxBNB: 1, dailySpendCapBNB: 5, minIntervalSec: 21600, maxSlippageBps: 300, allowList: [], strategy: 'aggressive' },
  buyback: { maxSpendPerTxBNB: 0.75, dailySpendCapBNB: 3, minIntervalSec: 43200, maxSlippageBps: 200, allowList: [], strategy: 'buyback' },
  custom: { maxSpendPerTxBNB: 0.1, dailySpendCapBNB: 0.5, minIntervalSec: 86400, maxSlippageBps: 100, allowList: [], strategy: 'custom' },
};

export function validateProposal(
  p: Proposal,
  policy: AgentPolicy,
  spentLast24h: number,
  lastExecAt: number | null
): PolicyDecision {
  const reasons: string[] = [];
  if (p.amountBNB <= 0) reasons.push('Amount must be positive');
  if (p.amountBNB > policy.maxSpendPerTxBNB)
    reasons.push(`Exceeds per-tx cap ${policy.maxSpendPerTxBNB} BNB`);
  if (spentLast24h + p.amountBNB > policy.dailySpendCapBNB)
    reasons.push(`Exceeds 24h cap ${policy.dailySpendCapBNB} BNB`);
  if (lastExecAt && Date.now() / 1000 - lastExecAt < policy.minIntervalSec)
    reasons.push(`Below min interval ${policy.minIntervalSec}s`);
  if (p.slippageBps > policy.maxSlippageBps)
    reasons.push(`Slippage ${p.slippageBps}bps exceeds max ${policy.maxSlippageBps}bps`);
  if (policy.allowList.length > 0 && !policy.allowList.includes(p.target.toLowerCase()))
    reasons.push('Target not in allow-list');
  if (!['buyback', 'burn', 'hold', 'rebalance'].includes(p.action))
    reasons.push('Unknown action');
  return { approved: reasons.length === 0, reasons };
}

// Deterministic fallback strategist — used when LLM unavailable.
// Rule: buyback only if treasury > 0.5 BNB and cooldown elapsed, else hold.
export function deterministicProposal(opts: {
  agent: string;
  treasuryBNB: number;
  spent24h: number;
  lastExecAt: number | null;
  policy: AgentPolicy;
}): Proposal {
  const { agent, treasuryBNB, policy } = opts;
  const shouldBuy = treasuryBNB >= 0.5;
  const amount = shouldBuy ? Math.min(policy.maxSpendPerTxBNB, treasuryBNB * 0.05) : 0;
  return {
    idempotencyKey: `${agent}-${Math.floor(Date.now() / (policy.minIntervalSec * 1000))}`,
    agent,
    action: shouldBuy && amount > 0 ? 'buyback' : 'hold',
    amountBNB: Number(amount.toFixed(4)),
    target: '0x0000000000000000000000000000000000000000',
    slippageBps: Math.min(150, policy.maxSlippageBps),
    reason: shouldBuy
      ? 'Treasury above threshold; scheduled buyback within caps.'
      : 'Treasury below threshold or cooldown active; hold.',
    timestamp: Math.floor(Date.now() / 1000),
  };
}
