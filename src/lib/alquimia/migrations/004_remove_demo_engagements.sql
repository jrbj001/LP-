-- Remove engagements de demonstração, caso ainda existam.

delete from alquimia_engagements
where id in ('aurora-industrial', 'nexo-servicos', 'demo-orion', 'demo-aurora');
