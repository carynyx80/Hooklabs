import fs from 'fs';
import path from 'path';

export default function DocsPage() {
  const p = path.join(process.cwd(), 'DOCS.md');
  let md = '# Documentation\nSee repository DOCS.md';
  try { md = fs.readFileSync(p, 'utf8'); } catch {}
  // Minimal markdown render (headings, code, lists) — no extra deps
  const html = md
    .replace(/^### (.*)$/gm, '<h3 class="mt-6 font-bold text-bone">$1</h3>')
    .replace(/^## (.*)$/gm, '<h2 class="mt-8 font-display text-2xl font-bold text-bone">$1</h2>')
    .replace(/^# (.*)$/gm, '<h1 class="font-display text-4xl font-bold text-bone">$1</h1>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-charcoal border border-line px-1 font-mono text-[13px] text-bone">$1</code>')
    .replace(/^\- (.*)$/gm, '<li class="ml-5 list-disc text-ash">$1</li>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-bone">$1</strong>')
    .split('\n').map(l=>l.trim()===''?'<div class="h-3"/>':`<p class="text-ash leading-relaxed">${l}</p>`).join('\n');
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <div className="mt-8 rounded-xl border border-line bg-charcoal p-4 text-sm text-ash">
        Contracts: <span className="font-mono">contracts/</span> · Deploy: <span className="font-mono">script/Deploy.s.sol</span> · Worker: <span className="font-mono">worker/executor.ts</span>
      </div>
    </div>
  );
}
