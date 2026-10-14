'use client';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { shortAddress } from '@/lib/format';

export function WalletButton({ compact = false }: { compact?: boolean }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  if (!isConnected) {
    return (
      <button
        onClick={() => {
          const c = connectors[0];
          if (c) connect({ connector: c });
        }}
        disabled={isPending}
        className="hl-btn rounded-lg px-4 py-2 text-sm font-semibold text-bone disabled:opacity-50"
      >
        {isPending ? 'Connecting…' : compact ? 'Connect' : 'Connect Wallet'}
      </button>
    );
  }
  const wrongNet = chainId !== 97 && chainId !== 56;
  return (
    <div className="flex items-center gap-2">
      {!compact && (
        <span className="hidden rounded-md border border-line px-2 py-1 text-xs text-ash sm:inline">
          {chainId === 97 ? 'BSC Testnet' : chainId === 56 ? 'BNB Chain' : `Chain ${chainId}`}
        </span>
      )}
      {wrongNet && (
        <button
          onClick={() => switchChain({ chainId: bscTestnet.id })}
          className="rounded-lg border border-crimson-700 px-3 py-2 text-xs text-bone"
        >
          Switch to BSC Testnet
        </button>
      )}
      <button
        onClick={() => disconnect()}
        title={address}
        className="hl-ghost rounded-lg px-3 py-2 text-sm text-bone"
      >
        {shortAddress(address)} ✕
      </button>
    </div>
  );
}
