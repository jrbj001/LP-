import type { SemanticPack } from './types'

export const be180ColmeiaSemanticPack: SemanticPack = {
  id: 'be180-colmeia',
  matchSource: name => /colmeia|sql server/i.test(name),
  timeZone: 'America/Sao_Paulo',
  metrics: [
    {
      id: 'roteiros',
      label: 'Roteiros',
      match: /\broteiros?\b/i,
      canonical: [{ table: /roteiro/i, required: true }],
      forbid: [],
      defaultFilters: [
        'Se a pergunta não pedir status, conte todos os roteiros.',
        'A maior parte histórica pode estar em status “Teste”; só filtre se a pessoa pedir aprovados/publicados.',
      ],
      timeColumnHint: 'data de criação do roteiro',
      joins: ['roteiro.usuario → usuario_dm, se precisar de dono'],
      notes: [
        'Roteiro é entidade do Colmeia (SQL Server), não do Banco de Ativos.',
        'Não use inventário de exibidor como volume de roteiro.',
      ],
    },
    {
      id: 'campanhas',
      label: 'Campanhas / planejador',
      match: /\b(campanhas?|planejador|plano.?m[ií]dia)\b/i,
      canonical: [{ table: /(campanha|plano.?midia|planoMidia|planner)/i, required: true }],
      forbid: [],
      defaultFilters: [],
      timeColumnHint: 'data de criação ou publicação da campanha',
      joins: [],
      notes: ['Campanha/planejador vive no Colmeia.'],
    },
    {
      id: 'usuarios-colmeia',
      label: 'Usuários do Colmeia',
      match: /\b(usu[aá]rios?|logins?)\b/i,
      canonical: [{ table: /usuario/i, required: true }],
      forbid: [],
      defaultFilters: ['Não misture com usuários do Like:Me nem com exibidores do Banco de Ativos.'],
      timeColumnHint: 'data de cadastro em usuario_dm',
      joins: [],
      notes: ['Usuário operacional do Colmeia costuma estar em usuario_dm.'],
    },
  ],
}

export const be180AtivosSemanticPack: SemanticPack = {
  id: 'be180-ativos',
  matchSource: name => /ativos|postgres/i.test(name) && !/colmeia|sql server/i.test(name),
  timeZone: 'America/Sao_Paulo',
  metrics: [
    {
      id: 'exibidores',
      label: 'Exibidores',
      match: /\bexibidores?\b/i,
      canonical: [{ table: /exibidor/i, required: true }],
      forbid: [{ table: /roteiro/i }],
      defaultFilters: [],
      joins: [],
      notes: ['Exibidor pertence ao domínio de inventário/ativos.'],
    },
    {
      id: 'inventario',
      label: 'Inventário / pontos',
      match: /\b(invent[aá]rio|pontos?|media kit)\b/i,
      canonical: [
        { table: /(inventario|inventário|ponto|banco.?ativos|bancoAtivos)/i, required: true },
      ],
      forbid: [{ table: /roteiro/i }],
      defaultFilters: [
        'Se existir valid_bl, use valid_bl = 1 só quando a pergunta pedir pontos válidos/ativos.',
      ],
      timeColumnHint: 'data de promoção ou atualização do ponto',
      joins: ['ponto.exibidor_fk → cadastro de exibidor, quando precisar quebrar por exibidor'],
      notes: ['Inventário e pontos são do Banco de Ativos, não do Colmeia.'],
    },
  ],
}
