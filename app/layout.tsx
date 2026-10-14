import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Hook Labs — Your Treasury. On Autopilot.',
  description:
    'Autonomous AI agents for on-chain token treasuries on BNB Chain. Currently in development.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-[80vh]">{children}</main>
        <footer className="mt-16 border-t border-line bg-void">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
            <div>
              <div className="font-display font-bold tracking-[0.18em]">
                HOOK<span className="text-crimson-700">LABS</span>
              </div>
              <p className="mt-2 text-sm text-ash">
                Autonomous Intelligence for On-Chain Treasuries.
              </p>
            </div>
            <div className="text-sm">
              <div className="mb-2 font-semibold text-bone">Explore</div>
              <div className="flex flex-col gap-1.5 text-ash">
                <a href="#how" className="hover:text-bone">How It Works</a>
                <a href="#strategies" className="hover:text-bone">Strategies</a>
                <a href="#security" className="hover:text-bone">Security</a>
              </div>
            </div>
            <div className="text-sm">
              <div className="mb-2 font-semibold text-bone">Project</div>
              <div className="flex flex-col gap-1.5 text-ash">
                <a
                  href="https://github.com/carynyx80/Hooklabs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-bone"
                >
                  GitHub ↗
                </a>
                <span>Testnet app in development</span>
              </div>
            </div>
          </div>
          <div className="border-t border-line py-4 text-center text-xs text-ash">
            © 2026 Hook Labs · BNB Chain
          </div>
        </footer>
        </Providers>
      </body>
    </html>
  );
}
