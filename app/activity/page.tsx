'use client';
import { useEffect, useState } from 'react';
import { ActivityTable } from '@/components/ActivityTable';
import { fetchActivity, type ActivityItem } from '@/lib/store';

export default function ActivityPage() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  useEffect(() => {
    fetchActivity().then((a) => { setItems(a); setLoading(false); });
  }, []);
  const shown = filter==='all'?items:items.filter(i=>i.action===filter);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-bone">Activity feed</h1>
      <p className="mt-2 text-ash">Chronological strategy evaluations, approvals, failures, and confirmations. Only real indexed activity or explicitly labeled demo rows.</p>
      <div className="mt-4 flex gap-2 text-sm">
        {['all','buyback','burn','hold','rebalance'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className={`rounded-lg border px-3 py-1.5 capitalize ${filter===f?'border-crimson-700 bg-card text-bone':'border-line text-ash'}`}>{f}</button>
        ))}
      </div>
      <div className="mt-6">{loading ? <div className="h-40 animate-pulse rounded-xl border border-line bg-charcoal" /> : <ActivityTable items={shown} />}</div>
    </div>
  );
}
