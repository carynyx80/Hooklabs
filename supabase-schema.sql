-- Hook Labs Supabase schema (Postgres). Run in Supabase SQL editor.
create table if not exists agents (
  vault_address text primary key,
  token_address text not null,
  token_symbol text not null,
  name text not null,
  owner text not null,
  strategy text not null default 'balanced',
  chain_id int not null default 97,
  deploy_tx text,
  status text not null default 'active',
  treasury_bnb numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists executions (
  id uuid primary key default gen_random_uuid(),
  vault_address text not null references agents(vault_address) on delete cascade,
  agent_name text,
  token_symbol text,
  action text not null,
  amount_bnb numeric not null default 0,
  amount_display text,
  target text,
  slippage_bps int not null default 0,
  status text not null,
  tx_hash text,
  reason text,
  idempotency_key text unique not null,
  confirmations int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_exec_vault_time on executions(vault_address, created_at desc);
create index if not exists idx_agents_owner on agents(owner);

alter table agents enable row level security;
alter table executions enable row level security;

-- Public read (explorer), server writes via service_role
drop policy if exists "public read agents" on agents;
create policy "public read agents" on agents for select using (true);
drop policy if exists "public read executions" on executions;
create policy "public read executions" on executions for select using (true);
