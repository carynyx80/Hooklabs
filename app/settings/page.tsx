'use client';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [rpc, setRpc] = useState('');
  const [llm, setLlm] = useState('');
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setRpc(localStorage.getItem('hooklabs:rpc') || '');
    setLlm(localStorage.getItem('hooklabs:llm') || '');
  }, []);
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-bold text-bone">Settings</h1>
      <p className="mt-2 text-ash">Local preferences only. Secrets belong in server env, never here.</p>
      <div className="hl-card mt-6 rounded-2xl p-6 space-y-4">
        <label className="block text-sm">
          <div className="mb-1 text-ash">Custom RPC (optional, BSC testnet default)</div>
          <input value={rpc} onChange={e=>setRpc(e.target.value)} placeholder="https://…"
            className="hl-ghost w-full rounded-xl px-4 py-3 font-mono text-bone" />
        </label>
        <label className="block text-sm">
          <div className="mb-1 text-ash">Preferred LLM label (informational)</div>
          <input value={llm} onChange={e=>setLlm(e.target.value)} placeholder="e.g. local deterministic fallback"
            className="hl-ghost w-full rounded-xl px-4 py-3 text-bone" />
        </label>
        <button onClick={()=>{localStorage.setItem('hooklabs:rpc',rpc);localStorage.setItem('hooklabs:llm',llm);setSaved(true);setTimeout(()=>setSaved(false),2000);}}
          className="hl-btn rounded-xl px-5 py-2.5 text-sm font-semibold text-bone">Save preferences</button>
        {saved && <span className="ml-3 text-sm text-ash">Saved ✓</span>}
      </div>
    </div>
  );
}
