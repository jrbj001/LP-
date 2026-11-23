-- Cadence ouvindo ao vivo pela página do avatar. Enquanto a página estiver ativa,
-- a transcrição atrasada do Recall só alimenta o relatório e não dispara respostas.

alter table cadence_meeting_bots
  add column if not exists live_listening_at timestamptz;
