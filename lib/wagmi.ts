import { createConfig, http } from 'wagmi';
import { bsc, bscTestnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

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
