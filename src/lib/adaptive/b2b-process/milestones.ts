import { OTD_AGENTS, OTD_AI_OPPORTUNITIES } from './agents'
import { OTD_QUICK_WINS } from './quick-wins'

export type MilestoneType = 'mobilization' | 'quick-win' | 'layer' | 'delivery'

export interface OtdMilestone {
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
}

const PILOT_QUICK_WINS = OTD_QUICK_WINS.filter(quickWin => quickWin.pilot)

/**
 * Fonte canônica do escopo comercial OTD.
 * Roadmap satélite e Indústria 4.0 permanecem fora deste compromisso.
 */
export const OTD_MILESTONES: OtdMilestone[] = [
  {
    id: 'ms-0',
    number: 'M0',
    window: 'Semanas 1–2',
    title: 'Mobilização e baseline OTD',
    type: 'mobilization',
    objective:
      'Transformar o mapa atual em backlog executável, fechar as regras críticas do Protheus e estabelecer a linha de base de prazo, qualidade e intervenção manual.',
    deliverables: [
      'Kick-off, governança, acessos e ambientes definidos',
      'Backlog dos 10 quick wins priorizado com Cristiane, Selton e André',
      'Ramp das regras Protheus no caminho pedido → crédito → faturamento',
      'Baseline de lead time, retrabalho, bloqueios, ruptura e SLA de entrega',
    ],
    acceptanceCriteria: [
      'Owners e responsáveis técnicos nomeados para as 9 macroetapas',
      'Acessos mínimos aos ambientes e documentação técnica disponibilizados',
      'Backlog, critérios de pronto e baseline aprovados no comitê',
    ],
    dependencies: [
      'Disponibilidade de Cristiane, Selton, André e donos de Financeiro/Logística',
      'Acesso ao Protheus, WMS, Portal, EDI e Jornada do Vendedor',
    ],
    orfeuOwners: ['Cristiane', 'Selton', 'André Martins'],
    pixelOwners: ['José Roberto', 'Tech Lead'],
    evidence: ['Backlog versionado', 'Mapa OTD validado', 'Ata do gate M0'],
    gate: 'Gate M0 — baseline e backlog aprovados; piloto liberado para execução.',
  },
  {
    id: 'ms-1',
    number: 'M1',
    window: 'Semanas 2–5',
    title: 'Piloto de Quick Wins OTD',
    type: 'quick-win',
    objective:
      'Validar o modelo de entrega em três intervenções de alto impacto: proposta, ruptura e faturamento.',
    deliverables: PILOT_QUICK_WINS.map(
      quickWin => `${quickWin.id} · ${quickWin.title}`,
    ),
    acceptanceCriteria: [
      'Proposta e pricing gerados no fluxo, sem Word/e-mail como etapa obrigatória',
      'Ruptura e pedido complementar visíveis para Comercial e Backoffice',
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
    gate: 'Gate M1 — três QWs homologados e piloto aprovado para expansão.',
  },
  {
    id: 'ms-2',
    number: 'M2',
    window: 'Semanas 3–8',
    title: 'Fundação do Adaptive Layer™',
    type: 'layer',
    objective:
      'Criar a fundação compartilhada de integração e observabilidade para que cada quick win componha o mesmo fluxo, sem novo silo.',
    deliverables: [
      'Modelo canônico do pedido e dos eventos OTD',
      'Conectores prioritários Protheus, Portal, WMS, EDI e Jornada do Vendedor',
      'Identidade, trilha de auditoria, logs, alertas e tratamento de falhas',
      'Padrões de segurança, LGPD, versionamento e operação',
    ],
    acceptanceCriteria: [
      'Pedido rastreável por identificador único entre os sistemas integrados',
      'Eventos críticos observáveis com logs e alertas acionáveis',
      'Falha de integração reprocessável sem redigitação manual',
      'Arquitetura e runbook aprovados por TI',
    ],
    dependencies: [
      'Gate M0 aprovado',
      'APIs, credenciais, conectividade e limites dos sistemas disponibilizados',
      'Decisões de arquitetura e segurança respondidas dentro do SLA do comitê',
    ],
    orfeuOwners: ['André Martins', 'Segurança/TI', 'Donos dos sistemas'],
    pixelOwners: ['Tech Lead', 'Dev back-end', 'QA'],
    evidence: ['Diagrama de arquitetura', 'Contratos de integração', 'Runbook', 'Ata do gate M2'],
    gate: 'Gate M2 — fundação operável e aprovada para receber todos os QWs.',
  },
  {
    id: 'ms-3',
    number: 'M3',
    window: 'Semanas 6–14',
    title: '10 Quick Wins OTD concluídos',
    type: 'quick-win',
    objective:
      'Resolver as 10 intervenções manuais mapeadas nas 9 etapas do order-to-delivery.',
    deliverables: OTD_QUICK_WINS.map(
      quickWin => `${quickWin.id} · ${quickWin.title}`,
    ),
    acceptanceCriteria: [
      'Os 10 QWs homologados pelos respectivos owners de negócio',
      'Cada intervenção possui evidência antes/depois e métrica operacional',
      'Exceções conhecidas possuem owner, SLA e tratamento no fluxo',
      'Nenhum QW depende de planilha ou e-mail como integração obrigatória',
    ],
    dependencies: [
      'Gates M1 e M2 aprovados',
      'Disponibilidade semanal de Comercial, Financeiro, Jurídico e Logística',
      'Dados e regras de cada intervenção validados no início do ciclo',
    ],
    orfeuOwners: ['Cristiane', 'Selton', 'André Martins', 'Financeiro', 'Logística', 'Jurídico'],
    pixelOwners: ['Tech Lead', 'Dev back-end', 'Dev full-stack', 'QA'],
    evidence: ['Checklist 10/10', 'Métricas antes/depois', 'Demos por etapa', 'Ata do gate M3'],
    gate: 'Gate M3 — cobertura 10/10 aprovada; estabilização ponta a ponta liberada.',
  },
  {
    id: 'ms-4',
    number: 'M4',
    window: 'Meses 3–5',
    title: 'OTD ponta a ponta em produção',
    type: 'layer',
    objective:
      'Operar pedido → crédito → faturamento → separação → EDI → recompra sobre a Adaptive Layer™, com observabilidade e suporte.',
    deliverables: [
      'Fluxo OTD produtivo integrado aos canais e sistemas definidos',
      'Painel operacional de pedidos, exceções, responsáveis e SLAs',
      'Monitoramento, suporte, contingência e transferência de conhecimento',
      'Estabilização assistida e plano de evolução',
    ],
    acceptanceCriteria: [
      'Fluxos críticos executados em produção por período acordado sem falha severa aberta',
      'Status e causa de exceção rastreáveis ponta a ponta',
      'SLA, alertas, contingência e suporte validados por TI e negócio',
      'Documentação e treinamento entregues aos responsáveis',
    ],
    dependencies: [
      'Gate M3 aprovado',
      'Janela de implantação e plano de rollback autorizados',
      'Operação Orfeu disponível para estabilização e aceite',
    ],
    orfeuOwners: ['Cristiane', 'Selton', 'André Martins', 'Operações'],
    pixelOwners: ['Tech Lead', 'Squad de engenharia', 'QA'],
    evidence: ['Dashboard OTD', 'Relatório de estabilização', 'Runbook produtivo', 'Ata do gate M4'],
    gate: 'Gate M4 — OTD estabilizado em produção; camada de IA liberada.',
  },
  {
    id: 'ms-5',
    number: 'M5',
    window: 'Meses 5–8',
    title: 'LLM, Command Center e agentes OTD',
    type: 'delivery',
    objective:
      'Usar os dados confiáveis do OTD para antecipar exceções, apoiar decisões e coordenar ações com rastreabilidade.',
    deliverables: [
      `Command Center com ${OTD_AI_OPPORTUNITIES.length} oportunidades de IA priorizadas`,
      `Squad de ${OTD_AGENTS.length} agentes: ${OTD_AGENTS.map(agent => agent.name).join(', ')}`,
      'Consultas em linguagem natural para status, risco, margem e causa de exceção',
      'Guardrails, aprovação humana, auditoria, avaliação e monitoramento de custo/qualidade',
    ],
    acceptanceCriteria: [
      'Casos prioritários respondem com fonte, contexto e nível de confiança',
      'Ações sensíveis exigem aprovação humana e ficam auditadas',
      'Agentes operam sobre a Adaptive Layer™, sem bases paralelas',
      'Precisão, latência, custo e taxa de resolução medidos contra baseline aprovado',
    ],
    dependencies: [
      'Gate M4 aprovado e dados OTD com qualidade suficiente',
      'Provedor/modelo de IA e orçamento de consumo aprovados pela Orfeu',
      'Políticas de segurança, retenção e acesso definidas',
    ],
    orfeuOwners: ['Ricardo Madureira', 'Cristiane', 'Selton', 'André Martins'],
    pixelOwners: ['Especialista IA', 'Tech Lead', 'Dev back-end', 'QA'],
    evidence: ['Avaliação dos casos de uso', 'Logs auditáveis', 'Painel de qualidade/custo', 'Ata do gate M5'],
    gate: 'Gate M5 — casos prioritários aprovados e operação assistida concluída.',
  },
]

export const OTD_MILESTONE_SUMMARY = {
  scope: 'Order-to-delivery completo → Adaptive Layer™ → LLM e agentes',
  outcome:
    '10 intervenções manuais resolvidas, OTD em produção e inteligência operando sobre uma única camada confiável.',
  milestoneCount: OTD_MILESTONES.length,
  quickWinCount: OTD_QUICK_WINS.length,
  agentCount: OTD_AGENTS.length,
  aiOpportunityCount: OTD_AI_OPPORTUNITIES.length,
}

export const OTD_FUTURE_OPTIONS = [
  'Quick wins satélites: Cropster, Suri, baristas e portal/chamados TI',
  'Indústria 4.0 & Agro: OpsFactor, qualidade, fazenda e manutenção',
  'Visão 360º, GTM/clusterização, forecast e elasticidade de preço',
]
