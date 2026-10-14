# Hook Labs — Autonomous Intelligence for On-Chain Treasuries

Original Web3 implementation for BNB Chain. Behavioural reference: fourhook.fun (no copied branding, assets, or code).

## Quickstart (demo mode, no secrets)

```powershell
cd hook-labs
& "C:\Program Files\nodejs\npm.cmd" install
Copy-Item .env.example .env.local
& "C:\Program Files\nodejs\npm.cmd" run dev
# open http://localhost:3003
```

Demo mode seeds **explicitly labeled** sample agents/activity in the browser. No fake mainnet claims.

## Testnet (BSC 97)

1. `forge test -vvv` (contracts) — requires foundry
2. `forge script script/Deploy.s.sol --rpc-url bsc_testnet --broadcast` with `DEPLOYER_PRIVATE_KEY` set
3. Set `NEXT_PUBLIC_REGISTRY_ADDRESS`, `NEXT_PUBLIC_MODE=testnet` in `.env.local`
4. Fund a vault with tBNB (manual deposit), grant executor role to worker key
5. `npm run worker` — evaluates agents on cadence (dry-run until `EXECUTOR_PRIVATE_KEY` set)
6. Verify every tx on `testnet.bscscan.com`

## Routes

`/`, `/explore`, `/create`, `/dashboard`, `/dashboard/agents/[address]`, `/agents/[address]`, `/activity`, `/docs`, `/settings`, `/admin`

## Security

- AI proposes; `HookPolicyEngine` + `lib/policy.ts` dispose. Executor cannot bypass vault caps.
- `HookTreasuryVault`: `nonReentrant`, 24h timelock on cap changes, idempotency keys, full events.
- Frontend only uses `NEXT_PUBLIC_` env. Secrets stay server-side.
- Mainnet = independent audit + explicit `ADMIN_ADDRESSES` approval. Untested features are never described as live.

## Structure

- `app/` Next.js 14 routes + API (`health`, `agents`, `activity`, `strategy`)
- `components/` design system (#080808, #101010, #14090B, #430A12, #650B18, #850F22, #A31930)
- `contracts/` Solidity (Vault, Registry, PolicyEngine, Mock)
- `worker/` executor + queue (Redis-ready, in-memory fallback)
- `prisma/`, `supabase-schema.sql` persistence
- `test/` node policy + endpoint checks
