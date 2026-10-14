export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Hook Labs';

export const MODE = (process.env.NEXT_PUBLIC_MODE || 'demo') as 'demo' | 'testnet' | 'mainnet';

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 97);

export const BSC_RPC =
  process.env.NEXT_PUBLIC_BSC_RPC || 'https://data-seed-prebsc-1-s1.binance.org:8545/';

export const REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_REGISTRY_ADDRESS || '') as `0x${string}` | '';

export const BSCSCAN_BASE =
  CHAIN_ID === 56 ? 'https://bscscan.com' : 'https://testnet.bscscan.com';

export function txUrl(hash: string) {
  return `${BSCSCAN_BASE}/tx/${hash}`;
}
export function addressUrl(addr: string) {
  return `${BSCSCAN_BASE}/address/${addr}`;
}

export const MODE_LABEL: Record<string, string> = {
  demo: 'Demonstration mode — labeled sample data. Connect a wallet on BSC testnet for live state.',
  testnet: 'Testnet mode — live BSC testnet data. Not mainnet funds.',
  mainnet: 'Mainnet — audited deployment required before production use.',
};
