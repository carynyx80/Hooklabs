'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { WalletButton } from './WalletButton';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/#how', label: 'How It Works' },
  { href: '/docs', label: 'Documentation' },
  { href: '/activity', label: 'Activity' },
];

export function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <header
      className={`sticky top-0 z-50 border-b border-line backdrop-blur-md ${
        scrolled ? 'bg-void/90' : 'bg-void/70'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Hook Labs home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-ash lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={`hover:text-bone ${path === l.href ? 'text-bone' : ''}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/create" className="hl-btn rounded-lg px-4 py-2 font-semibold text-bone">
            Launch Agent
          </Link>
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
              <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="text-ash hover:text-bone">
                {l.label}
              </Link>
            ))}
            <Link href="/create" onClick={() => setOpen(false)} className="hl-btn rounded-lg px-4 py-2 text-center font-semibold text-bone">
              Launch Agent
            </Link>
            <Link href="/dashboard" onClick={() => setOpen(false)} className="hl-ghost rounded-lg px-4 py-2 text-center text-bone">
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
