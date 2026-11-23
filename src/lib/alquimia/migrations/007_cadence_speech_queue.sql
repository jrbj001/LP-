-- Cadence falado: respostas aguardando a página do avatar tocar em voz.
-- Uma linha por fala; claimed_at marca quando um worker já a entregou.

create table if not exists cadence_speech_queue (
  id bigserial primary key,
  bot_id uuid not null references cadence_meeting_bots (id) on delete cascade,
  client_id text not null,
  text text not null,
  created_at timestamptz not null default now(),
  claimed_at timestamptz
);

create index if not exists cadence_speech_queue_pending_idx
  on cadence_speech_queue (bot_id, id)
  where claimed_at is null;
