-- Dados de demonstração do MVP. Idempotente e claramente identificados.

insert into alquimia_engagements (
  id, name, sector, challenge, stage, status, sponsor_name, lead_name,
  started_at, next_milestone_at
) values
  (
    'aurora-industrial',
    'Aurora Industrial',
    'Bens de consumo',
    'Transformar disciplina operacional em um sistema de gestão que escala.',
    'execution',
    'active',
    'Helena Duarte',
    'Marina Costa',
    current_date - 92,
    current_date + 3
  ),
  (
    'nexo-servicos',
    'Nexo Serviços',
    'Serviços B2B',
    'Conectar estratégia, accountability e cadência comercial.',
    'diagnostic',
    'attention',
    'Eduardo Nunes',
    'Rafael Lima',
    current_date - 28,
    current_date + 5
  )
on conflict (id) do update set
  name = excluded.name,
  sector = excluded.sector,
  challenge = excluded.challenge,
  stage = excluded.stage,
  status = excluded.status,
  sponsor_name = excluded.sponsor_name,
  lead_name = excluded.lead_name,
  next_milestone_at = excluded.next_milestone_at,
  updated_at = now();

insert into alquimia_memberships (engagement_id, subject, role)
values
  ('aurora-industrial', 'client-demo', 'client'),
  ('aurora-industrial', 'alquimia-team', 'alquimia-admin'),
  ('nexo-servicos', 'alquimia-team', 'alquimia-admin')
on conflict (engagement_id, subject) do update set role = excluded.role;
