export function shortAddress(a?: string, chars = 4) {
  if (!a) return '—';
  if (a.length < 10) return a;
  return `${a.slice(0, 2 + chars)}…${a.slice(-chars)}`;
}
