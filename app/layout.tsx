import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { MODE, MODE_LABEL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Hook Labs — Your Treasury. On Autopilot.',
  description:
    'Autonomous AI agents that manage on-chain token treasuries on BNB Chain with transparent, programmable safeguards.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {MODE !== 'mainnet' && (
            <div className="border-b border-line bg-card px-4 py-2 text-center text-xs text-ash">
              <span className="mr-2 rounded border border-crimson-700 px-1.5 py-0.5 uppercase text-bone">
                {MODE}
              </span>
              {MODE_LABEL[MODE]}
            </div>
          )}
          <main className="min-h-[80vh]">{children}</main>
          <footer className="mt-16 border-t border-line bg-void">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
              <div>
                <div className="font-display font-bold tracking-[0.18em]">HOOK<span className="text-crimson-700">LABS</span></div>
                <p className="mt-2 text-sm text-ash">Autonomous Intelligence for On-Chain Treasuries.</p>
                <p className="mt-2 text-xs text-ash">Original implementation. Not affiliated with fourhook.fun.</p>
              </div>
              <div className="text-sm">
                <div className="mb-2 font-semibold text-bone">Product</div>
                <div className="flex flex-col gap-1.5 text-ash">
                  <a href="/explore">Explore Agents</a>
                  <a href="/create">Launch Agent</a>
                  <a href="/dashboard">Dashboard</a>
                  <a href="/activity">Activity</a>
                </div>
              </div>
              <div className="text-sm">
                <div className="mb-2 font-semibold text-bone">Developers</div>
                <div className="flex flex-col gap-1.5 text-ash">
                  <a href="/docs">Documentation</a>
                  <a href="/admin">Admin</a>
                  <a href="/settings">Settings</a>
                </div>
              </div>
              <div className="text-sm">
                <div className="mb-2 font-semibold text-bone">Security</div>
                <p className="text-ash">Least-privilege executor. On-chain caps. Timelocked config. Testnet-first. Mainnet requires independent audit + explicit authorization.</p>
              </div>
            </div>
            <div className="border-t border-line py-4 text-center text-xs text-ash">
              © 2026 Hook Labs · BNB Chain · BscScan-verified contracts only
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
