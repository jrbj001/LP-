-- Engagement real Orfeu × Alquemia, com arquivo de conteúdos finais.

insert into alquimia_engagements (
  id, name, sector, challenge, stage, status, sponsor_name, lead_name,
  started_at, next_milestone_at
) values (
  'orfeu',
  'Café Orfeu',
  'Café especial',
  'Construir sistema comercial, expansão EUA, flagship e a camada de IA com a PixelPulseLab.',
  'execution',
  'active',
  'Ricardo Madureira',
  'Felipe · Alquemia',
  date '2026-04-16',
  date '2026-08-27'
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
  ('orfeu', 'alquimia-team', 'alquimia-admin')
on conflict (engagement_id, subject) do update set role = excluded.role;
