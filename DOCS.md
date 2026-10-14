# Hook Labs Documentation

Brand promise: **Autonomous Intelligence for On-Chain Treasuries** on BNB Chain.
Original design and code. Reference behaviour inspired by fourhook.fun; no copied assets.

## 1) Concepts
- **Treasury Vault (`HookTreasuryVault.sol`)** — holds BNB/token, enforces caps, timelocks sensitive changes, emits full events. Executor role is least-privilege: it can only call pre-approved spend functions within caps.
- **Policy Engine (`HookPolicyEngine.sol`)** — deterministic validation (per-tx cap, 24h cap, interval, slippage, allow-list). AI proposes; engine disposes.
- **Registry (`HookAgentRegistry.sol`)** — permissionless registration of agent metadata.

## 2) Strategy flow (8 steps)
1. Retrieve on-chain treasury info (viem `getBalance` + vault reads)
2. Gather market data (price feed / DEX quote; demo uses conservative placeholder)
3. Generate AI proposal (`POST /api/strategy`, configurable LLM, deterministic fallback)
4. Validate vs deterministic policies (`lib/policy.ts` + on-chain engine)
5. Simulate (`eth_call` / `simulateContract`)
6. Submit via authorized executor (server key, never browser)
7. Wait for confirmation (+ reorg buffer, 3 confirmations testnet)
8. Index + update dashboard (`/api/activity`, Supabase/local)

Idempotency: `idempotencyKey = agent + window`. Retries use exponential backoff; queue dedupes.

## 3) Testnet-first
- Default chain 97 (BSC testnet). Frontend labels `demo | testnet | mainnet` at all times.
- Deploy: `forge script script/Deploy.s.sol --rpc-url bsc_testnet --broadcast`
- Fund vault manually: send tBNB to vault address.
- Run worker: `npm run worker` (Redis if `REDIS_URL` set, else in-memory loop).
- Mainnet: requires independent audit + explicit `ADMIN_ADDRESSES` authorization. Never present testnet/demo data as mainnet volume.

## 4) API
- `GET /api/health` — mode, chain, deployment presence
- `GET/POST /api/agents` — list + register (validates 0x address, persists Supabase or demo file)
- `GET /api/activity?agent=` — indexed executions (Supabase or empty → UI shows demo-labeled fallback)
- `POST /api/strategy` — `{ agent, treasuryBNB, spent24h, lastExecAt, strategy }` → `{ proposal, decision }`. Uses LLM if `LLM_API_URL/KEY` set, else deterministic.

## 5) Security
- Never give LLMs keys. Server executor only.
- `nonReentrant`, `Ownable`, timelock `queueChange/executeChange`, caps checked before every spend.
- Input validation with zod-style manual checks; simulation required before broadcast.
- Env: frontend only `NEXT_PUBLIC_`; secrets server-only.

## 6) Deploy
- Frontend: Vercel (`npm run build`). Backend worker: persistent host (Railway/Render/Fly) with Redis + Postgres.
- DB: `prisma/schema.prisma` + `supabase-schema.sql` — run migrations before worker.
