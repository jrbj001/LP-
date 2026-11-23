-- Cadence Product Engineer: bots de reunião (Recall.ai), transcrição ao vivo e interações do agente.
-- Escopo sempre por client_id.

create table if not exists cadence_meeting_bots (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  recall_bot_id text unique,
  meeting_url text not null,
  title text,
  status text not null default 'created',
  pending_wake_speaker text,
  pending_wake_at timestamptz,
  report jsonb,
  report_status text not null default 'none',
  report_error text,
  created_by text,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  ended_at timestamptz
);

create index if not exists cadence_meeting_bots_client_created_idx
  on cadence_meeting_bots (client_id, created_at desc);

create table if not exists cadence_transcript_segments (
  id bigserial primary key,
  bot_id uuid not null references cadence_meeting_bots (id) on delete cascade,
  client_id text not null,
  speaker text,
  text text not null,
  ts_start double precision,
  ts_end double precision,
  source text not null default 'speech',
  created_at timestamptz not null default now()
);

create index if not exists cadence_transcript_segments_bot_idx
  on cadence_transcript_segments (bot_id, id);

create table if not exists cadence_agent_interactions (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid not null references cadence_meeting_bots (id) on delete cascade,
  client_id text not null,
  speaker text,
  question text not null,
  answer text,
  tools jsonb not null default '[]'::jsonb,
  sources jsonb not null default '[]'::jsonb,
  latency_ms integer,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists cadence_agent_interactions_bot_idx
  on cadence_agent_interactions (bot_id, created_at);
