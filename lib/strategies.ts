// Client-safe: no Node imports. Shared strategy presets + types.
export type StrategyId = 'conservative' | 'balanced' | 'aggressive' | 'buyback';

export const STRATEGIES: Record<
  StrategyId,
  { maxPerTxBNB: number; dailyCapBNB: number; blurb: string }
> = {
  conservative: { maxPerTxBNB: 0.25, dailyCapBNB: 1, blurb: 'Capital preservation' },
  balanced: { maxPerTxBNB: 0.5, dailyCapBNB: 2.5, blurb: 'Steady buybacks' },
  aggressive: { maxPerTxBNB: 1, dailyCapBNB: 5, blurb: 'High-tempo operations' },
  buyback: { maxPerTxBNB: 0.75, dailyCapBNB: 3, blurb: 'Deflationary flow' },
};

export function isAddress(v: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(v);
}
