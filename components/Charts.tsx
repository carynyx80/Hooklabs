'use client';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

export function TreasuryChart({ data }: { data: { t: string; value: number }[] }) {
  return (
    <div className="h-64 w-full rounded-xl border border-line bg-charcoal p-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis dataKey="t" tick={{ fill: '#989292', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#989292', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#101010', border: '1px solid #292022', color: '#F4F2F2' }} />
          <Area type="monotone" dataKey="value" stroke="#A31930" fill="rgba(133,15,34,0.25)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SpendChart({ data }: { data: { t: string; spent: number }[] }) {
  return (
    <div className="h-64 w-full rounded-xl border border-line bg-charcoal p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="t" tick={{ fill: '#989292', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#989292', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#101010', border: '1px solid #292022', color: '#F4F2F2' }} />
          <Bar dataKey="spent" fill="#650B18" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
