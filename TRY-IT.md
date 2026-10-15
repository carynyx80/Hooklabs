# Try it yourself — Step 1: Agent registry + launch flow

What this step added: an on-site registry (API + local file store) and a
`/create` form that registers a token with spending rules. No funds move.

## Workflow

1. **Install and start**
   ```powershell
   cd hook-labs
   npm install
   npm run dev
   # open http://localhost:3003
   ```

2. **Connect a wallet**
   - Click **Connect** (top-right). Use any browser wallet (MetaMask etc.).
   - If you're on the wrong network, click **Switch to BNB Chain**.

3. **Register an agent**
   - Click **Launch Agent** in the navbar (goes to `/create`).
   - Fill in: agent name, token contract address (`0x…`, 40 hex chars),
     token symbol, strategy preset, per-tx max and daily cap.
   - Click **Register Agent**.

4. **Verify it saved**
   - You should see `Agent registered ✓` with an ID.
   - Check the raw registry any time:
     - Browser: http://localhost:3003/api/agents
     - File: `hook-labs/data/agents.json`

5. **Try the validation**
   - Submit with a bad address or daily cap lower than per-tx max —
     the form shows the exact error instead of saving.

## Notes

- Registry data lives in `data/agents.json` (local dev only, git-ignored).
  A shared database (Supabase/Postgres) comes in a later step.
- Next step: public explorer page to browse registered agents.
