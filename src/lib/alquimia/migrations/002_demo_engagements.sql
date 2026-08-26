-- Seed do space: apenas o engagement Café Orfeu.
-- Remove leftovers de Aurora/Nexo se uma versão anterior desta migration já rodou.

delete from alquimia_engagements
where id in ('aurora-industrial', 'nexo-servicos');
