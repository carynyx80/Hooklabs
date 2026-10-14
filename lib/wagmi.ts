import { createConfig, http } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
// NOTE: import injected directly from @wagmi/core — never from the
// 'wagmi/connectors' barrel. The barrel forces bundlers to resolve every
// connector (coinbaseWallet, baseAccount, gemini, porto, …), which drags
// @coinbase/cdp-sdk, @x402/evm and viem/experimental into the module graph
// and breaks production builds. Hook Labs only needs the injected connector.
import { injected } from '@wagmi/core';

export const wagmiConfig = createConfig({
  chains: [bscTestnet, bsc],
  connectors: [injected()],
  transports: {
    [bscTestnet.id]: http(
      process.env.NEXT_PUBLIC_BSC_RPC || 'https://data-seed-prebsc-1-s1.binance.org:8545/'
    ),
    [bsc.id]: http(
      process.env.NEXT_PUBLIC_BSC_MAINNET_RPC || 'https://bsc-dataseed.binance.org/'
    ),
  },
});

export const SUPPORTED_CHAINS = [97, 56];
