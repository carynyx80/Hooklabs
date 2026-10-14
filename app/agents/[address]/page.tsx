import { addressUrl, txUrl } from '@/lib/config';

async function getData(addr: string) {
  const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3003';
  try {
    const [a, act] = await Promise.all([
      fetch(`${base}/api/agents`, { cache: 'no-store' }).then((r) => r.json()).catch(() => null),
      fetch(`${base}/api/activity?agent=${addr}`, { cache: 'no-store' }).then((r) => r.json()).catch(() => null),
    ]);
    const agent = a?.items?.find((x: any) => x.address.toLowerCase() === addr.toLowerCase()) || null;
    return { agent, activity: act?.items || [] };
  } catch {
    return { agent: null, activity: [] };
  }
}

export default async function PublicAgentPage({ params }: { params: { address: string } }) {
  const addr = decodeURIComponent(params.address);
  const { agent, activity } = await getData(addr);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <a href="/explore" className="text-sm text-ash hover:text-bone">← Explorer</a>
      <h1 className="mt-2 font-display text-3xl font-bold text-bone">Agent profile</h1>
      <p className="font-mono text-sm text-ash">{addr}</p>
      <div className="mt-3 flex gap-2">
        <a href={addressUrl(addr)} target="_blank" rel="noreferrer" className="hl-btn rounded-lg px-4 py-2 text-sm text-bone">BscScan ↗</a>
      </div>
      {!agent ? (
        <div className="mt-6 rounded-2xl border border-line bg-charcoal p-8 text-sm text-ash">
          No indexed record for this address yet. If this is a freshly deployed vault, fund it and run the executor —
          history appears here with transaction proof. Nothing below is fabricated.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="hl-card rounded-2xl p-5">
            <div className="text-xs text-ash">Token</div>
            <div className="font-bold text-bone">${agent.tokenSymbol} · {agent.name}</div>
            <div className="mt-3 text-xs text-ash">Treasury</div>
            <div className="font-display text-2xl font-bold text-bone">{agent.treasuryBNB} BNB</div>
            <div className="mt-3 text-xs text-ash">Strategy / Status</div>
            <div className="text-sm capitalize text-bone">{agent.strategy} · {agent.status}</div>
          </div>
          <div className="rounded-2xl border border-line bg-charcoal p-5 lg:col-span-2">
            <h3 className="font-semibold text-bone">Historical actions</h3>
            {activity.length === 0 ? (
              <p className="mt-2 text-sm text-ash">No executions indexed for this agent yet.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {activity.map((a: any) => (
                  <li key={a.id} className="flex items-center justify-between border-b border-line py-2">
                    <span className="capitalize text-bone">{a.action} · {a.amount}</span>
                    {a.txHash ? <a href={txUrl(a.txHash)} target="_blank" rel="noreferrer" className="text-crimson-700 hover:underline">tx ↗</a> : <span className="text-ash">{a.status}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
