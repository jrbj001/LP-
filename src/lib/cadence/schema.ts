export const CADENCE_SCHEMA = `Tabelas (sempre filtrar client_id = $1):

cadence_cards(
  client_id text, card_id text, board_id text, project_id text, column_id text,
  title text, level text, persona text, want text, so_that text, acceptance jsonb,
  context text, priority text, source_kind text, source_ref text,
  created_at timestamptz, updated_at timestamptz
)
column_id ∈ requirement | story | ready | dev | done
board_id exemplos: likeme-landing, likeme-app, likeme-backend, colmeia, banco-ativos, agentes, visibilidade

cadence_delivery_prs(
  client_id text, repo text, number int, title text, branch text, type text,
  fix_kind text, product text, merged_at timestamptz, additions int, deletions int,
  changed_files int, commit_count int
)
type ∈ feature | fix | improvement | maintenance
fix_kind ∈ bug | evolution

cadence_delivery_commits(
  id uuid, client_id text, committed_at date, type text, fix_kind text
)

cadence_meetings(
  client_id text, meeting_id text, title text, occurred_at timestamptz,
  duration text, status text, attendees jsonb, owner text, summary text
)

cadence_documents(
  client_id text, document_id text, title text, kind text, file_name text,
  status text, board_id text, source_url text, updated_at timestamptz, created_at timestamptz
)`

export const CADENCE_TABLES = [
  'cadence_cards',
  'cadence_delivery_prs',
  'cadence_delivery_commits',
  'cadence_meetings',
  'cadence_documents',
] as const
