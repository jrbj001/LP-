import { STAGES } from './types'

/** Ícones resolvidos na camada de componentes (lib permanece sem dependência de UI). */
export type AgentIconKey =
  | 'orchestrator'
  | 'commercial'
  | 'order'
  | 'finance'
  | 'logistics'
  | 'repurchase'

export interface OtdAiOpportunity {
  id: string
  /** Etapas do processo B2B (ver STAGES) que esta oportunidade cobre */
  stageIds: string[]
  area: string
  opportunity: string
  stakeholder: string
  /** Quick wins OTD que preparam o terreno para esta oportunidade */
  enabledBy?: string[]
}

/**
 * Oportunidades de IA ancoradas na jornada order-to-delivery.
 * Cada uma ataca exceções/intervenções manuais de etapas específicas.
 */
export const OTD_AI_OPPORTUNITIES: OtdAiOpportunity[] = [
  {
    id: 'ai-lead-proposta',
    stageIds: ['s1', 's2'],
    area: 'Comercial · Lead → proposta',
    opportunity: 'Copiloto para qualificar leads, recomendar pricing e gerar proposta B2B sem Word/e-mail.',
    stakeholder: 'Cristiane · Selton',
    enabledBy: ['QW-OTD-01', 'QW-OTD-02'],
  },
  {
    id: 'ai-cadastro-credito',
    stageIds: ['s3', 's4'],
    area: 'Cadastro · Contrato',
    opportunity: 'Leitura de documentos, pré-análise de crédito e montagem de contrato a partir do cadastro.',
    stakeholder: 'Comercial · Jurídico · Financeiro',
    enabledBy: ['QW-OTD-03', 'QW-OTD-04'],
  },
  {
    id: 'ai-pedido-ruptura',
    stageIds: ['s5'],
    area: 'Pedido · Estoque',
    opportunity: 'Detectar ruptura antes da liberação, propor substituição e manter o pedido complementar visível.',
    stakeholder: 'Cristiane · Backoffice · Logística',
    enabledBy: ['QW-OTD-05'],
  },
  {
    id: 'ai-credito-faturamento',
    stageIds: ['s5', 's7'],
    area: 'Crédito · Faturamento',
    opportunity: 'Priorizar bloqueios, explicar pendências e orquestrar crédito, NF-e e boletos sem fila manual.',
    stakeholder: 'André · Financeiro',
    enabledBy: ['QW-OTD-06', 'QW-OTD-07'],
  },
  {
    id: 'ai-separacao-expedicao',
    stageIds: ['s6'],
    area: 'Separação · Expedição',
    opportunity: 'Prever desvios de separação, conferência e volumetria com dados Protheus + WMS.',
    stakeholder: 'Gustavo · Ricardo Silva',
    enabledBy: ['QW-OTD-08'],
  },
  {
    id: 'ai-tracking',
    stageIds: ['s8'],
    area: 'Tracking · Exceções',
    opportunity: 'Monitorar EDI, prever atraso e acionar o responsável antes de o cliente cobrar status.',
    stakeholder: 'Cristiane · Ricardo Silva',
    enabledBy: ['QW-OTD-09'],
  },
  {
    id: 'ai-recompra',
    stageIds: ['s9'],
    area: 'Pós-venda · Recompra',
    opportunity: 'Identificar clientes fora do ciclo esperado e gerar a próxima melhor ação para o vendedor.',
    stakeholder: 'Cristiane · Selton',
    enabledBy: ['QW-OTD-10'],
  },
  {
    id: 'ai-command-center',
    stageIds: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9'],
    area: 'Command Center OTD',
    opportunity: 'LLM sobre a Adaptive Layer™: consultar pedido, risco, margem e causa da exceção em linguagem natural.',
    stakeholder: 'Ricardo CEO · Cristiane · Selton · André',
  },
]

export interface OtdAgent {
  id: string
  name: string
  icon: AgentIconKey
  role: string
  owner: string
  example: string
  /** Etapas em que o agente é o dono da exceção */
  primaryStages: string[]
  /** Etapas em que apenas apoia/observa */
  supportStages?: string[]
  /** O que o agente entrega em cada etapa que atua */
  actions: Record<string, string>
}

export const OTD_AGENTS: OtdAgent[] = [
  {
    id: 'orchestrator',
    name: 'Orquestrador Order-to-delivery',
    icon: 'orchestrator',
    role: 'Acompanha o pedido ponta a ponta, detecta a etapa parada e aciona o responsável certo.',
    owner: 'Cristiane · Selton · André',
    example: '“Quais pedidos B2B estão parados e por qual causa?”',
    primaryStages: ['s5', 's6', 's7', 's8'],
    supportStages: ['s1', 's2', 's3', 's4', 's9'],
    actions: {
      s1: 'Observa entrada de demanda por canal',
      s2: 'Sinaliza propostas travadas em aprovação',
      s3: 'Cobra cadastro incompleto',
      s4: 'Alerta contrato pendente antes do pedido',
      s5: 'Detecta pedido parado e a causa raiz',
      s6: 'Cruza NF, separação e expedição',
      s7: 'Escala bloqueio de crédito/faturamento',
      s8: 'Consolida SLA e status por cliente',
      s9: 'Fecha o ciclo e devolve histórico ao vendedor',
    },
  },
  {
    id: 'commercial',
    name: 'Copiloto Comercial B2B',
    icon: 'commercial',
    role: 'Qualifica lead, recomenda pricing e gera proposta dentro da Jornada do Vendedor.',
    owner: 'Cristiane · Selton',
    example: '“Monte a proposta HORECA com preço, volume e condição aprováveis.”',
    primaryStages: ['s1', 's2'],
    supportStages: ['s3', 's4', 's9'],
    actions: {
      s1: 'Qualifica e prioriza o lead na JV',
      s2: 'Sugere pricing e monta a proposta',
      s3: 'Pré-preenche cadastro a partir da proposta',
      s4: 'Indica modalidade de contrato e comodato',
      s9: 'Prepara abordagem de recompra',
    },
  },
  {
    id: 'order',
    name: 'Agente de Pedido & Ruptura',
    icon: 'order',
    role: 'Valida estoque, detecta ruptura e mantém o pedido complementar visível até a entrega.',
    owner: 'Comercial · Backoffice · Logística',
    example: '“Quais pedidos têm ruptura e qual substituição preserva a margem?”',
    primaryStages: ['s5'],
    supportStages: ['s6', 's8'],
    actions: {
      s5: 'Antecipa ruptura e propõe substituição',
      s6: 'Confirma disponibilidade para separação',
      s8: 'Explica pedido parcial ao comercial',
    },
  },
  {
    id: 'finance',
    name: 'Agente de Crédito & Faturamento',
    icon: 'finance',
    role: 'Explica bloqueios e orquestra liberação, NF-e, boletos e retorno ao Protheus.',
    owner: 'André · Financeiro',
    example: '“O que falta para faturar os pedidos bloqueados de hoje?”',
    primaryStages: ['s7'],
    supportStages: ['s5', 's3'],
    actions: {
      s3: 'Pré-analisa crédito no cadastro',
      s5: 'Prioriza liberação antes do faturamento',
      s7: 'Orquestra NF-e, boletos e conciliação',
    },
  },
  {
    id: 'logistics',
    name: 'Agente de Expedição & Tracking',
    icon: 'logistics',
    role: 'Monitora separação, conferência e EDI; prevê atraso antes de o cliente cobrar.',
    owner: 'Gustavo · Ricardo Silva',
    example: '“Quais entregas estão em risco e em que etapa surgiu o desvio?”',
    primaryStages: ['s6', 's8'],
    actions: {
      s6: 'Prevê desvio de separação e volumetria',
      s8: 'Monitora EDI e antecipa atraso',
    },
  },
  {
    id: 'repurchase',
    name: 'Agente de Recompra',
    icon: 'repurchase',
    role: 'Detecta clientes fora do ciclo e sugere a próxima melhor ação ao vendedor.',
    owner: 'Cristiane · Selton · Pós-venda',
    example: '“Quem deveria recomprar esta semana e qual abordagem usar?”',
    primaryStages: ['s9'],
    supportStages: ['s1'],
    actions: {
      s1: 'Devolve cliente inativo ao funil',
      s9: 'Aciona recompra fora do ciclo esperado',
    },
  },
]

/** Ciclo de atuação de qualquer agente sobre a Adaptive Layer™ */
export const AGENT_LOOP = [
  { id: 'sense', title: 'Observa', detail: 'Eventos do pedido chegam pela Adaptive Layer™ (Protheus, WMS, portal, EDI, JV).' },
  { id: 'detect', title: 'Detecta', detail: 'Compara com o fluxo esperado e identifica a exceção ou o atraso.' },
  { id: 'decide', title: 'Decide', detail: 'Avalia impacto (margem, SLA, crédito) e escolhe a próxima melhor ação.' },
  { id: 'act', title: 'Age', detail: 'Executa ou encaminha ao responsável — com contexto, não com "veja o relatório".' },
  { id: 'learn', title: 'Registra', detail: 'Devolve o resultado à camada: histórico auditável que treina a próxima decisão.' },
]

/** Exemplo ponta a ponta: um pedido com ruptura e bloqueio de crédito */
export const AGENT_WALKTHROUGH = {
  title: 'Um pedido, cinco handoffs',
  subtitle: 'Como os agentes se passam o bastão sem back-office no meio',
  steps: [
    { stageId: 's2', agentId: 'commercial', event: 'Cliente HORECA aceita proposta', action: 'Copiloto monta pricing e proposta aprovável na JV' },
    { stageId: 's5', agentId: 'order', event: 'Item sem saldo no lançamento', action: 'Agente de Pedido propõe substituição e marca o complementar' },
    { stageId: 's7', agentId: 'finance', event: 'Cliente entra bloqueado por crédito', action: 'Agente de Crédito explica pendência e prioriza liberação' },
    { stageId: 's6', agentId: 'logistics', event: 'Volumetria divergente na conferência', action: 'Agente de Expedição sinaliza desvio antes da coleta' },
    { stageId: 's8', agentId: 'orchestrator', event: 'Transportadora atrasa o EDI', action: 'Orquestrador avisa o comercial com novo prazo estimado' },
    { stageId: 's9', agentId: 'repurchase', event: 'Ciclo de recompra vencido', action: 'Agente de Recompra entrega a próxima ação ao vendedor' },
  ],
}

export function stageLabel(stageId: string): string {
  const stage = STAGES.find(s => s.id === stageId)
  return stage ? `${stage.number}. ${stage.title}` : stageId
}

export function agentById(id: string): OtdAgent | undefined {
  return OTD_AGENTS.find(a => a.id === id)
}

export function agentsForStage(stageId: string): OtdAgent[] {
  return OTD_AGENTS.filter(
    a => a.primaryStages.includes(stageId) || a.supportStages?.includes(stageId)
  )
}

export function opportunitiesForStage(stageId: string): OtdAiOpportunity[] {
  return OTD_AI_OPPORTUNITIES.filter(o => o.stageIds.includes(stageId))
}
