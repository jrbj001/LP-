// Proposta de trabalho — Grupo Orfeu · recorte Order-to-Cash (O2C)
// Escopo enxuto do eixo financeiro (pedido → crédito → faturamento → contas a
// receber → caixa), com MVP real da Adaptive Layer™ + agentes core, ROI
// preditivo e modelo comercial com parcela em risco + bônus de sucesso.
// O escopo OTD completo permanece no Executive Review e no Processo B2B.

import type { MilestoneType } from '@/lib/adaptive/b2b-process/milestones'
import {
  O2C_MVP_AGENTS,
  O2C_MVP_QUICK_WINS,
  O2C_PHASE2_QUICK_WINS,
  O2C_ROI_DEFAULTS,
} from './proposal-o2c'

export function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export const PROPOSAL_META = {
  password: 'orfeu2026',
  title: 'Proposta de Trabalho · Order-to-Cash',
  client: 'Grupo Orfeu',
  date: '17/08/2026',
  validity: 'Válida por 30 dias · valores indicativos até o aceite do escopo',
  guideHref: '/guides/valor-hora',
}

// ─── Referência de preço (Guia de Valores 2026) ────────────────────────────────

export const RATE_BASIS = {
  blended: { min: 260, max: 285 },
  note: 'Blended efetivo do squad (R$ 260–285/h), dentro da faixa de referência do Guia de Valores PixelPulseLab 2026 (R$ 250–300/h). É a média ponderada dos perfis alocados — usada para dimensionar a mensalidade, não como unidade de cobrança linha a linha.',
  references: [
    { category: 'Desenvolvimento convencional', range: 'R$ 220–280/h' },
    { category: 'Engenharia sênior e arquitetura', range: 'R$ 300–450/h' },
    { category: 'IA, agentes e visão computacional', range: 'R$ 350–600/h' },
    { category: 'Sustentação com volume contratado', range: 'R$ 180–240/h' },
  ],
}

// ─── Squad sugerido (enxuto para o O2C) ─────────────────────────────────────────

export interface SquadRole {
  role: string
  dedication: string
  hoursMonth: number
  rate: string
  focus: string
}

export const SQUAD: SquadRole[] = [
  {
    role: 'Tech Lead / Arquiteto de integrações',
    dedication: 'Parcial',
    hoursMonth: 50,
    rate: 'R$ 300–450/h',
    focus: 'Desenho da Adaptive Layer™ do ciclo financeiro e decisões sobre Protheus, crédito e faturamento.',
  },
  {
    role: 'Dev sênior back-end / integrações',
    dedication: 'Dedicado (full-time)',
    hoursMonth: 160,
    rate: 'R$ 220–380/h',
    focus: 'Conectores Protheus/Portal/EDI/Itaú · crédito, NF-e, boletos e retorno bancário do order-to-cash.',
  },
  {
    role: 'Dev pleno full-stack',
    dedication: 'Dedicado',
    hoursMonth: 90,
    rate: 'R$ 150–240/h',
    focus: 'Proposta/pricing no fluxo, cadastro + crédito e telas de exceção do ciclo financeiro.',
  },
  {
    role: 'Especialista IA / agentes',
    dedication: 'Parcial',
    hoursMonth: 30,
    rate: 'R$ 350–600/h',
    focus: 'Agentes core O2C (orquestrador, crédito & faturamento, comercial) sobre o fluxo já limpo.',
  },
  {
    role: 'QA / automação de testes',
    dedication: 'Parcial',
    hoursMonth: 40,
    rate: 'R$ 160–300/h',
    focus: 'Validação das integrações fiscais e de faturamento, regressão e critérios de aceite.',
  },
]

const MONTHS = 10

export const SQUAD_SUMMARY = {
  totalHoursMonth: 370,
  monthlyInvestment: { min: 92000, max: 100000 },
  guidePackage: 'Compatível com o formato "Squad dedicado multi-perfil" do Guia de Valores 2026, dimensionado pelo blended efetivo (R$ 260–285/h)',
  management: 'Gestão, discovery contínuo, reuniões e governança conduzidos por José Roberto (partner) — inclusos no engagement, não cobrados à parte.',
  capacityLabel: 'Capacidade planejada',
}

// ─── Modelo comercial: base fixa + risco + bônus ────────────────────────────────

export const COMMERCIAL_PRICING = {
  months: MONTHS,
  atRiskShare: 0.15,
  monthlyFull: { min: 92000, max: 100000 },
  monthlyBase: { min: 78200, max: 85000 },
  monthlyAtRisk: { min: 13800, max: 15000 },
  totalFull: { min: 92000 * MONTHS, max: 100000 * MONTHS },
  totalBase: { min: 78200 * MONTHS, max: 85000 * MONTHS },
  totalAtRisk: { min: 13800 * MONTHS, max: 15000 * MONTHS },
  successFee: {
    pctOfBenefit: 0.12,
    capBRL: 300000,
    label: 'Bônus de sucesso: 12% do benefício líquido verificado acima da meta, com teto de R$ 300 mil.',
  },
}

// ─── Milestones contratados (locais ao O2C) ─────────────────────────────────────

export interface CommercialMilestone {
  id: string
  number: string
  window: string
  title: string
  type: MilestoneType
  objective: string
  deliverables: string[]
  acceptanceCriteria: string[]
  dependencies: string[]
  orfeuOwners: string[]
  pixelOwners: string[]
  evidence: string[]
  gate: string
  capacityHours: number
  capacityShare: number
  investment: { min: number; max: number }
  squadRoles: string[]
}

const pilotDeliverables = ['QW-OTD-02', 'QW-OTD-03', 'QW-OTD-06', 'QW-OTD-07']
  .map(id => O2C_MVP_QUICK_WINS.find(q => q.id === id))
  .filter(Boolean)
  .map(q => `${q!.id} · ${q!.title}`)

export const COMMERCIAL_MILESTONES: CommercialMilestone[] = [
  {
    id: 'ms-0',
    number: 'M0',
    window: 'Semanas 1–2',
    title: 'Mobilização e baseline Order-to-Cash',
    type: 'mobilization',
    objective:
      'Transformar o mapa do ciclo financeiro em backlog executável, fechar as regras críticas de crédito e faturamento no Protheus e estabelecer o baseline dos KPIs que sustentam o ROI e a parcela em risco.',
    deliverables: [
      'Kick-off, governança, acessos e ambientes definidos',
      'Backlog dos 5 quick wins O2C priorizado com Cristiane, Selton e André',
      'Ramp das regras Protheus no caminho pedido → crédito → faturamento',
      'Baseline de lead time, retrabalho, bloqueios de crédito, custo por pedido e QLPs',
    ],
    acceptanceCriteria: [
      'Owners nomeados para as etapas de crédito, faturamento e contas a receber',
      'Acessos a Protheus, Portal, EDI e Itaú/NF-e disponibilizados',
      'Baseline dos KPIs e metas de risco/ROI aprovados no comitê',
    ],
    dependencies: [
      'Disponibilidade de Cristiane, Selton, André e donos de Financeiro',
      'Acesso ao Protheus, Portal, EDI e integração bancária/fiscal',
    ],
    orfeuOwners: ['Cristiane', 'Selton', 'André Martins'],
    pixelOwners: ['José Roberto', 'Tech Lead'],
    evidence: ['Backlog versionado', 'Baseline de KPIs assinado', 'Ata do gate M0'],
    gate: 'Gate M0 — baseline e metas aprovados; pilotos O2C liberados. Ativa a régua da parcela em risco.',
    capacityHours: 296,
    capacityShare: 8,
    investment: { min: 73600, max: 80000 },
    squadRoles: ['Tech Lead', 'Dev back-end', 'Gestão'],
  },
  {
    id: 'ms-1',
    number: 'M1',
    window: 'Semanas 2–6',
    title: 'Pilotos O2C: proposta, crédito e faturamento',
    type: 'quick-win',
    objective:
      'Validar o modelo de entrega nas intervenções de maior impacto financeiro: proposta/pricing no fluxo, cadastro + crédito e faturamento B2B automático.',
    deliverables: pilotDeliverables,
    acceptanceCriteria: [
      'Proposta e pricing gerados no fluxo, sem Word/e-mail como etapa obrigatória',
      'Cadastro e análise de crédito unificados, com pendências visíveis',
      'NF-e e boletos processados no fluxo homologado, com retorno ao Protheus',
      'Testes, logs e procedimento de rollback registrados',
    ],
    dependencies: [
      'Gate M0 aprovado',
      'Ambiente de homologação e massa de testes fiscal/comercial',
      'Regras de preço, crédito e faturamento validadas pelos donos de negócio',
    ],
    orfeuOwners: ['Cristiane', 'Selton', 'André Martins', 'Financeiro'],
    pixelOwners: ['Tech Lead', 'Dev back-end', 'Dev full-stack', 'QA'],
    evidence: ['Demonstração em homologação', 'Casos de teste aprovados', 'Ata do gate M1'],
    gate: 'Gate M1 — pilotos homologados e aprovados para expansão sobre a Layer.',
    capacityHours: 814,
    capacityShare: 22,
    investment: { min: 202400, max: 220000 },
    squadRoles: ['Tech Lead', 'Dev back-end', 'Dev full-stack', 'QA'],
  },
  {
    id: 'ms-2',
    number: 'M2',
    window: 'Semanas 4–12',
    title: 'Adaptive Layer™ do ciclo financeiro',
    type: 'layer',
    objective:
      'Criar a verdade operacional única do order-to-cash: modelo canônico do pedido e dos eventos financeiros, conectores prioritários e observabilidade — sem novo silo.',
    deliverables: [
      'Modelo canônico do pedido e dos eventos de crédito/faturamento',
      'Conectores Protheus, Portal, EDI e Itaú/NF-e',
      'Identidade, trilha de auditoria, logs, alertas e reprocessamento de falhas',
      'Padrões de segurança, LGPD, versionamento e operação',
    ],
    acceptanceCriteria: [
      'Pedido rastreável por identificador único entre os sistemas do ciclo financeiro',
      'Eventos críticos observáveis com logs e alertas acionáveis',
      'Falha de faturamento reprocessável sem redigitação manual',
      'Arquitetura e runbook aprovados por TI',
    ],
    dependencies: [
      'Gate M0 aprovado',
      'APIs, credenciais e conectividade dos sistemas do ciclo disponibilizadas',
      'Decisões de arquitetura e segurança respondidas no SLA do comitê',
    ],
    orfeuOwners: ['André Martins', 'Segurança/TI', 'Donos dos sistemas'],
    pixelOwners: ['Tech Lead', 'Dev back-end', 'QA'],
    evidence: ['Diagrama de arquitetura', 'Contratos de integração', 'Runbook', 'Ata do gate M2'],
    gate: 'Gate M2 — fundação operável e aprovada para sustentar o O2C ponta a ponta.',
    capacityHours: 925,
    capacityShare: 25,
    investment: { min: 230000, max: 250000 },
    squadRoles: ['Tech Lead', 'Dev back-end', 'QA'],
  },
  {
    id: 'ms-3',
    number: 'M3',
    window: 'Meses 3–7',
    title: 'Order-to-Cash em produção',
    type: 'layer',
    objective:
      'Operar pedido → crédito → faturamento → contas a receber sobre a Adaptive Layer™, com ruptura visível, observabilidade e estabilização assistida.',
    deliverables: [
      'Fluxo O2C produtivo, incluindo QW-OTD-05 (ruptura e receita recuperada)',
      'Painel operacional de pedidos, bloqueios, exceções e SLAs',
      'Monitoramento, suporte, contingência e transferência de conhecimento',
      'Estabilização assistida e verificação parcial dos KPIs de risco',
    ],
    acceptanceCriteria: [
      'Fluxos críticos executados em produção sem falha severa aberta',
      'Status e causa de exceção rastreáveis ponta a ponta',
      'KPIs de straight-through e custo por pedido medidos contra o baseline',
      'Documentação e treinamento entregues aos responsáveis',
    ],
    dependencies: [
      'Gates M1 e M2 aprovados',
      'Janela de implantação e plano de rollback autorizados',
      'Operação Orfeu disponível para estabilização e aceite',
    ],
    orfeuOwners: ['Cristiane', 'Selton', 'André Martins', 'Financeiro'],
    pixelOwners: ['Tech Lead', 'Squad de engenharia', 'QA'],
    evidence: ['Dashboard O2C', 'Relatório de estabilização', 'Métricas antes/depois', 'Ata do gate M3'],
    gate: 'Gate M3 — O2C estabilizado em produção; camada de agentes liberada e 1ª medição do ROI.',
    capacityHours: 925,
    capacityShare: 25,
    investment: { min: 230000, max: 250000 },
    squadRoles: ['Tech Lead', 'Dev back-end', 'Dev full-stack', 'QA'],
  },
  {
    id: 'ms-4',
    number: 'M4',
    window: 'Meses 6–10',
    title: 'Agentes core Order-to-Cash',
    type: 'delivery',
    objective:
      'Usar os dados confiáveis do O2C para antecipar bloqueios, explicar causa e coordenar ação — com os agentes core operando sobre a Layer.',
    deliverables: [
      `Squad de ${O2C_MVP_AGENTS.length} agentes core: ${O2C_MVP_AGENTS.map(a => a.name).join(', ')}`,
      'Consultas em linguagem natural para status, risco de crédito e margem',
      'Guardrails, aprovação humana, auditoria e avaliação de custo/qualidade',
      'Verificação final dos KPIs de risco e apuração do bônus de sucesso',
    ],
    acceptanceCriteria: [
      'Casos prioritários respondem com fonte, contexto e nível de confiança',
      'Ações sensíveis exigem aprovação humana e ficam auditadas',
      'Agentes operam sobre a Adaptive Layer™, sem bases paralelas',
      'KPIs de risco apurados e conciliados com o baseline M0',
    ],
    dependencies: [
      'Gate M3 aprovado e dados O2C com qualidade suficiente',
      'Provedor/modelo de IA e orçamento de consumo aprovados pela Orfeu',
      'Políticas de segurança, retenção e acesso definidas',
    ],
    orfeuOwners: ['Ricardo Madureira', 'Cristiane', 'André Martins'],
    pixelOwners: ['Especialista IA', 'Tech Lead', 'Dev back-end', 'QA'],
    evidence: ['Avaliação dos casos de uso', 'Logs auditáveis', 'Apuração de KPIs/ROI', 'Ata do gate M4'],
    gate: 'Gate M4 — agentes core aprovados, KPIs de risco apurados e bônus de sucesso conciliado.',
    capacityHours: 740,
    capacityShare: 20,
    investment: { min: 184000, max: 200000 },
    squadRoles: ['Especialista IA', 'Tech Lead', 'Dev back-end', 'QA'],
  },
]

/** Alias mantido para consumidores existentes da proposta. */
export const PROPOSAL_PHASES = COMMERCIAL_MILESTONES

const contractedHours = SQUAD_SUMMARY.totalHoursMonth * MONTHS

export const PROPOSAL_TOTALS = {
  hours: { min: contractedHours, max: contractedHours },
  investment: {
    min: COMMERCIAL_PRICING.totalFull.min,
    max: COMMERCIAL_PRICING.totalFull.max,
  },
  horizon: `${MONTHS} meses`,
  note:
    'Engagement mensal do squad orientado aos resultados dos gates. O fee cheio combina uma base fixa garantida e uma parcela em risco liberada por gate; a distribuição por milestone mostra onde a capacidade é aplicada, não é cobrança adicional.',
}

export const PROPOSAL_OUTCOME = {
  scope: 'Order-to-Cash: pedido → crédito → faturamento → contas a receber → caixa, sobre a Adaptive Layer™ com agentes core',
  outcome:
    'As intervenções manuais do ciclo financeiro eliminadas, faturamento B2B automático e agentes operando sobre uma verdade única — com ROI verificável e parcela do nosso fee em risco.',
  milestoneCount: COMMERCIAL_MILESTONES.length,
  quickWinCount: O2C_MVP_QUICK_WINS.length,
  agentCount: O2C_MVP_AGENTS.length,
  aiOpportunityCount: 4,
}

// ─── Decisão comercial (introdução + porquê) ─────────────────────────────────────

export const COMMERCIAL_DECISION = {
  eyebrow: 'Como estruturamos o investimento',
  title: 'Um engagement mensal com pele em jogo — base fixa menor, parcela em risco e bônus por resultado',
  narrative:
    'Enxugamos o escopo para o eixo Order-to-Cash e reorganizamos o investimento em 10 meses. A mensalidade cai para uma base fixa garantida — menor que a proposta anterior — somada a uma parcela nossa em risco, que só é paga quando os KPIs de baseline são batidos no gate. Acima da meta, um bônus de sucesso remunera o resultado. A Orfeu contrata capacidade + entrega + resultado, com parte do nosso fee dependente do ROI.',
  why: [
    {
      title: 'Pele em jogo',
      detail: '~15% do fee fica em risco, liberado por gate apenas com os KPIs de baseline atingidos.',
    },
    {
      title: 'Menos agressivo no fluxo de caixa',
      detail: 'Base fixa menor diluída em 10 meses, começando mais baixa que a proposta anterior.',
    },
    {
      title: 'Foco no resultado',
      detail: 'O bônus de sucesso remunera o benefício verificado acima da meta, com teto.',
    },
    {
      title: 'Transparência',
      detail: 'Baseline, metas, capacidade e evidências ficam visíveis no portal, gate a gate.',
    },
  ],
}

// ─── Modelo comercial (único) ────────────────────────────────────────────────────

export interface CommercialModel {
  id: 'A' | 'B'
  title: string
  badge: string
  recommended?: boolean
  headline: string
  summary: string
  points: string[]
  monthly: string
  total: string
  footing: string
}

export const COMMERCIAL_MODELS: CommercialModel[] = [
  {
    id: 'A',
    title: 'Engagement O2C com risco compartilhado',
    badge: 'Recomendado',
    recommended: true,
    headline: 'Base fixa garantida + parcela em risco + bônus de sucesso',
    summary:
      'A Orfeu contrata um engagement mensal de 10 meses focado no ciclo financeiro. A base fixa garante o squad; a parcela em risco só é paga quando os KPIs de baseline são batidos no gate; e um bônus de sucesso remunera o resultado acima da meta.',
    points: [
      'Base fixa garantida menor, diluída em 10 meses',
      `Parcela em risco (~${Math.round(COMMERCIAL_PRICING.atRiskShare * 100)}%) liberada por gate mediante KPIs`,
      'Bônus de sucesso sobre o benefício verificado acima da meta, com teto',
      'Inclui governança, alinhamentos e execução técnica',
    ],
    monthly: `${formatBRL(COMMERCIAL_PRICING.monthlyBase.min)}–${formatBRL(COMMERCIAL_PRICING.monthlyBase.max)}/mês fixos + ${formatBRL(COMMERCIAL_PRICING.monthlyAtRisk.min)}–${formatBRL(COMMERCIAL_PRICING.monthlyAtRisk.max)}/mês em risco`,
    total: `${formatBRL(COMMERCIAL_PRICING.totalFull.min)}–${formatBRL(COMMERCIAL_PRICING.totalFull.max)} · ${MONTHS} meses (fee cheio)`,
    footing: `Base de dimensionamento: ~${SQUAD_SUMMARY.totalHoursMonth}h/mês × blended efetivo R$ ${RATE_BASIS.blended.min}–${RATE_BASIS.blended.max}/h (${contractedHours.toLocaleString('pt-BR')}h planejadas no horizonte). ${COMMERCIAL_PRICING.successFee.label}`,
  },
]

// ─── Modelo comercial ───────────────────────────────────────────────────────────

export const COMMERCIAL_TERMS = [
  {
    label: 'Contrato',
    value: 'Engagement mensal do squad em 10 meses, orientado a resultado — base fixa garantida + parcela em risco por gate',
  },
  {
    label: 'Produto',
    value: 'Squad dedicado ao Order-to-Cash, orientado a 5 gates de aceite e aos KPIs de baseline — não venda de horas isoladas',
  },
  {
    label: 'Parcela em risco',
    value: `~${Math.round(COMMERCIAL_PRICING.atRiskShare * 100)}% do fee mensal só é faturado quando os KPIs do gate são atingidos; caso contrário, plano corretivo antes da liberação`,
  },
  {
    label: 'Bônus de sucesso',
    value: COMMERCIAL_PRICING.successFee.label,
  },
  {
    label: 'Faturamento',
    value: 'Base fixa mensal + parcela em risco liberada após aceite das evidências e KPIs do ciclo',
  },
  {
    label: 'Cadência',
    value: 'Planejamento quinzenal · demos semanais · comitê executivo quinzenal · gate mensal com leitura de KPIs',
  },
  {
    label: 'Aceite',
    value: 'Até 5 dias úteis para validar evidências e KPIs; pendência recebe plano corretivo e nova data acordada',
  },
  {
    label: 'Propriedade',
    value: 'Código, dados e infraestrutura em contas do Grupo Orfeu desde o dia 1',
  },
  {
    label: 'Mudança de escopo',
    value: 'Repriorização dentro do milestone sem alterar o gate; Fase 2 (logística, contrato, recompra) entra via change request',
  },
]

export const OPERATING_MODEL = [
  {
    cadence: 'Semanal',
    ritual: 'Demo + revisão operacional',
    output: 'Incremento demonstrável, impedimentos e evidências atualizadas',
  },
  {
    cadence: 'Quinzenal',
    ritual: 'Planejamento + comitê executivo',
    output: 'Prioridades do ciclo, riscos, decisões e dependências com owner',
  },
  {
    cadence: 'Mensal',
    ritual: 'Gate de aceite + leitura de KPIs',
    output: 'Checklist do milestone, KPIs vs baseline, ata de aceite e liberação da parcela em risco',
  },
  {
    cadence: 'Por release',
    ritual: 'Go-live + estabilização',
    output: 'Plano de rollback, runbook, métricas e transferência de conhecimento',
  },
]

export const SCOPE = {
  included: [
    'Mobilização, baseline e ramp das regras Protheus do ciclo financeiro (crédito e faturamento)',
    'Os 5 quick wins Order-to-Cash: proposta/pricing, cadastro+crédito, ruptura, liberação de crédito e faturamento B2B',
    'Adaptive Layer™ para Protheus, Portal, EDI e Itaú/NF-e como verdade única do O2C',
    'O2C em produção, observabilidade, documentação e estabilização',
    `Agentes core O2C (${O2C_MVP_AGENTS.length}) com guardrails, aprovação humana e avaliação`,
  ],
  excluded: [
    'Licenças, cloud, consumo de APIs/LLMs e serviços de terceiros',
    'Substituição integral do Protheus, WMS, Portal ou EDI',
    'Conciliação PagBrasil — executada por outro fornecedor; apenas ponto futuro de integração',
    'Operação 24×7 e sustentação após a janela de estabilização',
  ],
  future: [
    `Fase 2 · logística e pós-venda: ${O2C_PHASE2_QUICK_WINS.map(q => q.title).join('; ')}`,
    'Agentes de expedição/tracking e recompra sobre a mesma Layer',
    'Quick wins satélites, Indústria 4.0 & Agro e visão 360º / forecast',
  ],
}

export const DELIVERY_RISKS = [
  {
    risk: 'Acesso tardio ou documentação incompleta dos sistemas',
    mitigation: 'Checklist no M0, owner por sistema e escalonamento no comitê em até 48h',
    owner: 'André Martins',
  },
  {
    risk: 'Regras Protheus e fiscais descobertas durante a implementação',
    mitigation: 'Ramp antecipado, homologação com massa realista e decisões versionadas',
    owner: 'Orfeu + Tech Lead',
  },
  {
    risk: 'Baseline de KPIs indisponível ou pouco confiável para a régua de risco',
    mitigation: 'M0 dedica esforço ao baseline; metas de risco só valem após dados aprovados no comitê',
    owner: 'Financeiro + Tech Lead',
  },
  {
    risk: 'Baixa disponibilidade dos owners para homologação',
    mitigation: 'Agenda fixa semanal, delegados nomeados e prazo de aceite de 5 dias úteis',
    owner: 'Cristiane · Selton · André',
  },
  {
    risk: 'Dados insuficientes para os agentes core',
    mitigation: 'Gate M3 condiciona os agentes à qualidade, cobertura e rastreabilidade mínimas',
    owner: 'TI + Especialista IA',
  },
]

export const ASSUMPTIONS = [
  'Escopo-base: Order-to-Cash (pedido → crédito → faturamento → contas a receber → caixa) → Adaptive Layer™ → agentes core; logística, contrato e recompra são Fase 2.',
  'O produto comercial é o engagement do squad + outcomes nos gates; horas/blended são apenas base de planejamento e transparência.',
  'A base fixa é garantida; ~15% do fee é parcela em risco liberada por gate mediante KPIs, e o bônus de sucesso tem teto.',
  'As premissas de ROI (faturamento, margem, uplift de vendas e QLPs) são preditivas e serão substituídas por dados reais no baseline M0.',
  'A Orfeu disponibiliza acessos, ambientes, massas de teste e decisões de negócio nos prazos do ciclo.',
  'Custos de cloud, licenças e APIs de terceiros, incluindo consumo de LLM, não estão inclusos.',
  'Valores alinhados às faixas públicas do Guia de Valores PixelPulseLab 2026 (blended efetivo R$ 260–285/h dentro da faixa R$ 250–300/h).',
  `Capacidade planejada de ~${SQUAD_SUMMARY.totalHoursMonth}h/mês por ${MONTHS} meses; mudanças materiais usam change request aprovado.`,
]

// Investimento default do simulador espelha o fee cheio médio do horizonte.
export const ROI_INVESTMENT_DEFAULT = Math.round(
  (COMMERCIAL_PRICING.totalFull.min + COMMERCIAL_PRICING.totalFull.max) / 2,
)

export function validateProposalData() {
  const milestoneIds = COMMERCIAL_MILESTONES.map(milestone => milestone.id)
  const uniqueMilestones = new Set(milestoneIds).size === milestoneIds.length
  const allocatedHours = COMMERCIAL_MILESTONES.reduce(
    (total, milestone) => total + milestone.capacityHours,
    0,
  )
  const allocatedShare = COMMERCIAL_MILESTONES.reduce(
    (total, milestone) => total + milestone.capacityShare,
    0,
  )
  const allocatedInvestment = COMMERCIAL_MILESTONES.reduce(
    (total, milestone) => ({
      min: total.min + milestone.investment.min,
      max: total.max + milestone.investment.max,
    }),
    { min: 0, max: 0 },
  )

  return {
    valid:
      uniqueMilestones &&
      allocatedHours === PROPOSAL_TOTALS.hours.max &&
      allocatedShare === 100 &&
      allocatedInvestment.min === PROPOSAL_TOTALS.investment.min &&
      allocatedInvestment.max === PROPOSAL_TOTALS.investment.max,
    milestoneCount: milestoneIds.length,
    allocatedHours,
    allocatedShare,
    allocatedInvestment,
  }
}

export const PROPOSAL_VALIDATION = validateProposalData()

if (!PROPOSAL_VALIDATION.valid) {
  throw new Error(
    `Proposta inconsistente: ${JSON.stringify(PROPOSAL_VALIDATION)}`,
  )
}
