// Relatório de Uso do Produto — Colmeia · Be180 OOH
// Dados de produção (SQL Server: usuario_dm, roteiros, inventário de exibidores).

export const USAGE_META = {
  id: 'colmeia-usage',
  title: 'Relatório de Uso do Produto',
  client: 'Be180 OOH',
  generatedAt: '05/08/2026',
  source: 'Colmeia produção · SQL Server (usuario_dm, roteiros, inventário de exibidores)',
  path: '/relatorio-de-uso',
  notionHref: 'https://app.notion.com/p/3b35615ab27481159150e2ea3844ca21',
}

export const USAGE_KPIS = [
  { id: 'roteiros', label: 'Roteiros totais', value: '3.541', hint: '159 nos últimos 30 dias' },
  { id: 'ativos30', label: 'Usuários ativos · 30d', value: '60', hint: '28 nos últimos 7 dias' },
  { id: 'adocao', label: 'Adoção de exibidores', value: '32%', hint: '86 de 271 já acessaram' },
  { id: 'lotes', label: 'Aprovação de lotes', value: '13%', hint: '20 aprovados de 160 enviados' },
  { id: 'agencias', label: 'Agências ativas', value: '41', hint: 'cadastro na plataforma' },
]

/** Embudo de ativação: do cadastro ao uso recorrente. */
export const ACTIVATION_FUNNEL = [
  { id: 'cadastrados', label: 'Exibidores cadastrados', value: 278 },
  { id: 'auth0', label: 'Com conta Auth0 provisionada', value: 275 },
  { id: 'acessaram', label: 'Já acessaram a plataforma', value: 96 },
  { id: 'ativos90', label: 'Ativos nos últimos 90 dias', value: 96 },
  { id: 'ativos30', label: 'Ativos nos últimos 30 dias', value: 60 },
  { id: 'ativos7', label: 'Ativos nos últimos 7 dias', value: 28 },
]

export const ENGAGEMENT_BANDS = [
  { id: 'ativo7', label: 'Ativo (7 dias)', count: 29, pct: 10, tone: 'good' as const },
  { id: 'ativo30', label: 'Ativo (30 dias)', count: 31, pct: 11, tone: 'good' as const },
  { id: 'recente90', label: 'Recente (90 dias)', count: 36, pct: 13, tone: 'warn' as const },
  { id: 'nunca', label: 'Nunca acessou', count: 192, pct: 67, tone: 'bad' as const },
]

export const PROFILE_BREAKDOWN = [
  { profile: 'Exibidor', total: 271, accessed: 86, active30: 50 },
  { profile: 'Admin', total: 11, accessed: 10, active30: 10 },
  { profile: 'Editor', total: 3, accessed: 0, active30: 0 },
]

export const MONTHLY_ROTEIROS = [
  { month: 'ago/25', value: 293 },
  { month: 'set/25', value: 244 },
  { month: 'out/25', value: 310 },
  { month: 'nov/25', value: 205 },
  { month: 'dez/25', value: 151 },
  { month: 'jan/26', value: 156 },
  { month: 'fev/26', value: 112 },
  { month: 'mar/26', value: 138 },
  { month: 'abr/26', value: 126 },
  { month: 'mai/26', value: 243 },
  { month: 'jun/26', value: 160 },
  { month: 'jul/26', value: 175 },
  { month: 'ago/26', value: 14, partial: true },
]

export const ADOPTION_SERIES = [
  { month: 'mai/26', value: 9 },
  { month: 'jun/26', value: 53 },
  { month: 'jul/26', value: 30 },
  { month: 'ago/26', value: 4, partial: true },
]

export const ROTEIRO_TYPES = [
  { label: 'consulta', value: 2451 },
  { label: 'pendente', value: 876 },
  { label: 'não definido', value: 207 },
  { label: 'roteiro', value: 4 },
]

export const ROTEIRO_STATUS = [
  { label: 'Teste', value: 3526, tone: 'bad' as const },
  { label: 'Aprovado', value: 8, tone: 'good' as const },
  { label: 'Plano', value: 6, tone: 'good' as const },
  { label: 'Cenário', value: 1, tone: 'neutral' as const },
]

export const INVENTORY_BATCHES = [
  { label: 'Rejeitado', value: 99, tone: 'bad' as const },
  { label: 'Para corrigir', value: 32, tone: 'warn' as const },
  { label: 'Aprovado', value: 20, tone: 'good' as const },
  { label: 'Em análise', value: 9, tone: 'neutral' as const },
]

export const TOP_CREATORS = [
  { name: '(sem nome · base legada)', total: 753, last30: 0, lastAt: '11/12/2025', stale: true },
  { name: 'Lucas Robusti Alves Lima', total: 190, last30: 0, lastAt: '05/12/2025', stale: true },
  { name: 'Gabriel Gama', total: 151, last30: 0, lastAt: '09/12/2025', stale: true },
  { name: 'Bárbara Silva', total: 146, last30: 0, lastAt: '20/10/2025', stale: true },
  { name: 'sophia.lopes@be180.com.br', total: 130, last30: 18, lastAt: '04/08/2026', stale: false },
]

/** Camada de leitura assistida sobre os números do relatório. */
export const AI_SUMMARY = {
  eyebrow: 'AI Insights',
  headline: 'O produto está em produção, mas o funil de ativação e a qualidade do dado limitam a leitura de valor.',
  narrative:
    'O Colmeia sustenta 3.541 roteiros e uma base de 288 usuários, com operação recorrente concentrada em poucos perfis internos. Os dois gargalos que aparecem nos números são o atrito no upload de inventário (apenas 13% dos lotes aprovados) e a adoção de exibidores (67% da base nunca acessou). Somado a isso, 99,6% dos roteiros estão marcados como “Teste”, o que impede medir conversão real do planejamento. Os três pontos são endereçáveis pela fundação do Banco de Ativos e pelos contratos de evento da Adaptive Layer™.',
  confidence: 'Alta · derivado de dados de produção em 05/08/2026',
}

export interface UsageInsight {
  id: string
  level: 'crítico' | 'atenção' | 'positivo'
  title: string
  evidence: string
  reading: string
  action: string
  owner: string
  phase: string
}

export const AI_INSIGHTS: UsageInsight[] = [
  {
    id: 'ins-inventario',
    level: 'crítico',
    title: 'Atrito no upload de inventário derruba a fundação',
    evidence: '99 lotes rejeitados e 32 para corrigir, contra 20 aprovados — 82% do funil sem aprovação.',
    reading:
      'A maior parte das falhas é de formatação de arquivo, não de bug: o exibidor não recebe erro acionável e reenvia no escuro.',
    action:
      'Validação assistida no upload com erro campo a campo, template guiado e revalidação antes do envio.',
    owner: 'Gabriel · Pixel engenharia',
    phase: 'M1 · Banco de Ativos',
  },
  {
    id: 'ins-adocao',
    level: 'crítico',
    title: 'Dois terços da base nunca acessaram a plataforma',
    evidence: '192 de 288 usuários nunca acessaram; entre exibidores, 86 de 271 acessaram e 50 estão ativos em 30 dias.',
    reading:
      'O provisionamento deixou de ser o bloqueio (275 de 285 já têm Auth0). O gargalo agora é ativação assistida, não acesso.',
    action:
      'Manter as duas sessões semanais de onboarding hands-on e priorizar os exibidores com maior inventário potencial.',
    owner: 'Marta e Isra · Be180',
    phase: 'M1 · Onboarding',
  },
  {
    id: 'ins-status',
    level: 'crítico',
    title: 'Taxonomia de status impede medir conversão',
    evidence: '3.526 dos 3.541 roteiros estão em status “Teste”; apenas 8 aprovados, 6 planos e 1 cenário.',
    reading:
      'Sem status confiável não há funil: não se distingue exploração de planejamento real, nem se mede taxa de aprovação.',
    action:
      'Definir taxonomia de status e publicar eventos de ciclo de vida do roteiro nos contratos da Adaptive Layer™.',
    owner: 'Pixel + Be180 produto',
    phase: 'M0 · Contratos de evento',
  },
  {
    id: 'ins-concentracao',
    level: 'atenção',
    title: 'Volume histórico não reflete a operação atual',
    evidence: '753 roteiros sem usuário atribuído; 3 dos 5 maiores criadores estão sem atividade desde 2025.',
    reading:
      'O total acumulado infla a percepção de uso. Hoje há praticamente um operador recorrente (18 roteiros em 30 dias).',
    action:
      'Separar base legada de operação corrente nos indicadores e acompanhar usuários ativos como métrica principal.',
    owner: 'Pixel · dados',
    phase: 'M2 · Indicadores',
  },
  {
    id: 'ins-sazonalidade',
    level: 'atenção',
    title: 'Uso recuperou do vale, mas estabilizou abaixo do pico',
    evidence: 'Pico de 310 roteiros em out/25, vale de 112 em fev/26, retomada de 243 em mai/26 e patamar de 160–175.',
    reading:
      'A retomada coincide com o ciclo de onboarding de junho (53 primeiros acessos), sugerindo relação direta com ativação.',
    action:
      'Tratar onboarding como alavanca de volume e acompanhar a coorte de junho para medir retenção.',
    owner: 'Be180 produto',
    phase: 'M2 · Planner',
  },
  {
    id: 'ins-auth0',
    level: 'positivo',
    title: 'Provisionamento de contas deixou de ser bloqueio',
    evidence: '275 de 285 usuários ativos com conta Auth0 após o lote de 03/08; 188 e-mails faltantes pré-cadastrados.',
    reading:
      'A falha de recuperação de senha por domínio divergente foi resolvida na origem, liberando o caminho do onboarding.',
    action: 'Encerrar o tema e redirecionar o esforço para a qualidade do upload de inventário.',
    owner: 'Pixel engenharia',
    phase: 'Concluído',
  },
]

/** Perguntas que o copiloto responderá sobre esta base (MVP RAG). */
export const COPILOT_QUESTIONS = {
  label: 'Perguntas para o copiloto',
  note: 'Disponível com o MVP Colmeia AI (RAG) sobre a Adaptive Layer™ — M3 do roadmap.',
  questions: [
    'Quais exibidores têm inventário aprovado mas nunca acessaram a plataforma?',
    'Qual o motivo mais frequente de rejeição nos lotes de inventário deste mês?',
    'Quais usuários da coorte de junho seguem ativos em 30 dias?',
    'Quantos roteiros saíram de “Teste” para “Aprovado” desde a última semana?',
  ],
}
