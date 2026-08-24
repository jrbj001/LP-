-- Alquemia transformation space
-- Execute em uma transação no banco configurado em DATABASE_URL.

create extension if not exists pgcrypto;

create table if not exists alquimia_engagements (
  id text primary key,
  name text not null,
  sector text not null default '',
  challenge text not null default '',
  stage text not null check (stage in ('diagnostic', 'focus', 'design', 'execution', 'sustain')),
  status text not null check (status in ('active', 'attention', 'paused', 'complete')),
  sponsor_name text,
  lead_name text,
  started_at date not null,
  next_milestone_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists alquimia_memberships (
  id uuid primary key default gen_random_uuid(),
  engagement_id text not null references alquimia_engagements(id) on delete cascade,
  subject text not null,
  role text not null check (role in ('alquimia-admin', 'consultant', 'client')),
  created_at timestamptz not null default now(),
  unique (engagement_id, subject)
);

create table if not exists alquimia_maturity_scores (
  id uuid primary key default gen_random_uuid(),
  engagement_id text not null references alquimia_engagements(id) on delete cascade,
  pillar_id text not null,
  score numeric(4,2) not null check (score >= 0 and score <= 5),
  note text not null default '',
  assessed_at timestamptz not null default now(),
  assessed_by text not null,
  unique (engagement_id, pillar_id, assessed_at)
);

create table if not exists alquimia_initiatives (
  id uuid primary key default gen_random_uuid(),
  engagement_id text not null references alquimia_engagements(id) on delete cascade,
  title text not null,
  outcome text not null default '',
  owner text not null,
  pillar_id text not null,
  practice_ids text[] not null default '{}',
  status text not null check (status in ('backlog', 'active', 'blocked', 'done')),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  target_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists alquimia_cycles (
  id uuid primary key default gen_random_uuid(),
  engagement_id text not null references alquimia_engagements(id) on delete cascade,
  initiative_id uuid references alquimia_initiatives(id) on delete set null,
  title text not null,
  method text not null check (method in ('PDCA', 'SDCA', 'DMAIC')),
  hypothesis text not null default '',
  learning text not null default '',
  status text not null check (status in ('planned', 'running', 'review', 'complete')),
  starts_at date,
  ends_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists alquimia_rituals (
  id uuid primary key default gen_random_uuid(),
  engagement_id text not null references alquimia_engagements(id) on delete cascade,
  name text not null,
  cadence text not null,
  owner text not null,
  next_at timestamptz,
  status text not null check (status in ('scheduled', 'attention', 'complete')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists alquimia_metrics (
  id uuid primary key default gen_random_uuid(),
  engagement_id text not null references alquimia_engagements(id) on delete cascade,
  key text not null,
  label text not null,
  unit text not null default '',
  baseline numeric,
  target numeric,
  current numeric,
  direction text not null default 'up' check (direction in ('up', 'down', 'stable')),
  measured_at timestamptz not null default now()
);

create table if not exists alquimia_evidence (
  id uuid primary key default gen_random_uuid(),
  engagement_id text not null references alquimia_engagements(id) on delete cascade,
  title text not null,
  kind text not null,
  blob_url text,
  notes text not null default '',
  initiative_id uuid references alquimia_initiatives(id) on delete set null,
  created_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists alquimia_audit_log (
  id bigserial primary key,
  engagement_id text references alquimia_engagements(id) on delete set null,
  subject text not null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists alquimia_memberships_subject_idx
  on alquimia_memberships(subject);
create index if not exists alquimia_initiatives_engagement_idx
  on alquimia_initiatives(engagement_id, status);
create index if not exists alquimia_rituals_engagement_idx
  on alquimia_rituals(engagement_id, next_at);
create index if not exists alquimia_metrics_engagement_idx
  on alquimia_metrics(engagement_id, key, measured_at desc);
create index if not exists alquimia_evidence_engagement_idx
  on alquimia_evidence(engagement_id, created_at desc);
