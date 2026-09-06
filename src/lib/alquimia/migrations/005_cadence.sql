-- Cadence workspace: cards, entregas, reuniões e índice de documentos.
-- Escopo sempre por client_id. Consultas NL só leem estas tabelas.

create table if not exists cadence_cards (
  client_id text not null,
  card_id text not null,
  board_id text not null,
  project_id text,
  column_id text not null,
  title text not null,
  level text not null,
  persona text,
  want text,
  so_that text,
  acceptance jsonb not null default '[]'::jsonb,
  context text,
  priority text,
  source_kind text,
  source_ref text,
  created_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (client_id, card_id)
);

create index if not exists cadence_cards_client_column_idx
  on cadence_cards (client_id, column_id);

create index if not exists cadence_cards_client_board_idx
  on cadence_cards (client_id, board_id);

create table if not exists cadence_delivery_prs (
  client_id text not null,
  repo text not null,
  number integer not null,
  title text not null,
  branch text,
  type text,
  fix_kind text,
  product text,
  merged_at timestamptz,
  additions integer,
  deletions integer,
  changed_files integer,
  commit_count integer,
  primary key (client_id, repo, number)
);

create index if not exists cadence_delivery_prs_client_merged_idx
  on cadence_delivery_prs (client_id, merged_at desc);

create table if not exists cadence_delivery_commits (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  committed_at date not null,
  type text not null,
  fix_kind text
);

create index if not exists cadence_delivery_commits_client_date_idx
  on cadence_delivery_commits (client_id, committed_at desc);

create table if not exists cadence_meetings (
  client_id text not null,
  meeting_id text not null,
  title text not null,
  occurred_at timestamptz,
  duration text,
  status text,
  attendees jsonb not null default '[]'::jsonb,
  owner text,
  summary text,
  primary key (client_id, meeting_id)
);

create table if not exists cadence_documents (
  client_id text not null,
  document_id text not null,
  title text not null,
  kind text,
  file_name text,
  status text,
  board_id text,
  source_url text,
  updated_at timestamptz,
  created_at timestamptz,
  primary key (client_id, document_id)
);

create index if not exists cadence_documents_client_updated_idx
  on cadence_documents (client_id, updated_at desc);
