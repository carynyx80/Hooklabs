'use client';
import { useState } from 'react';
import { Logo } from './Logo';
import { WalletButton } from './WalletButton';

const LINKS = [
  { href: '#how', label: 'How It Works' },
  { href: '#strategies', label: 'Strategies' },
  { href: '#security', label: 'Security' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-void/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" aria-label="Hook Labs home">
          <Logo />
        </a>
        <nav className="hidden items-center gap-7 text-sm text-ash lg:flex">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-bone">
              {l.label}
            </a>
          ))}
          <a href="/create" className="hl-btn rounded-lg px-4 py-2 font-semibold text-bone">
            Launch Agent
          </a>
          <WalletButton />
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <WalletButton compact />
          <button
            onClick={() => setOpen(!open)}
            className="hl-ghost rounded-lg px-3 py-2 text-sm text-bone"
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line bg-void px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3 text-sm">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-ash hover:text-bone"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/create"
              onClick={() => setOpen(false)}
              className="hl-btn rounded-lg px-4 py-2 text-center font-semibold text-bone"
            >
              Launch Agent
            </a>
            <a
              href="https://x.com/Hooklabsworld"
              target="_blank"
              rel="noreferrer"
              className="hl-ghost rounded-lg px-4 py-2 text-center text-bone"
            >
              Follow on X
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
