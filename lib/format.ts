export function shortAddress(a?: string, chars = 4) {
  if (!a) return '—';
  if (a.length < 10) return a;
  return `${a.slice(0, 2 + chars)}…${a.slice(-chars)}`;
}

export function formatNum(n: number | string, digits = 2) {
  const v = typeof n === 'string' ? Number(n) : n;
  if (!Number.isFinite(v)) return '—';
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(digits)}M`;
  if (Math.abs(v) >= 1_000) return `${(v / 1_000).toFixed(digits)}K`;
  return v.toLocaleString(undefined, { maximumFractionDigits: digits });
}

export function timeAgo(iso: string) {
  const t = new Date(iso).getTime();
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function isAddr(s: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(s);
}
