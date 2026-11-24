-- Resultado tabular da resposta do agente: grade (até 12 linhas) ou CSV.
alter table cadence_agent_interactions
  add column if not exists artifact jsonb;
