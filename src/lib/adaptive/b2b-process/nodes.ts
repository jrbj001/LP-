import type { Node } from '@xyflow/react'
import type { ProcessNodeData } from './types'
import { quickWinsForNode } from './quick-wins'
import type { PlanBadge } from './types'

function badgesFor(nodeId: string, extra: PlanBadge[] = []): PlanBadge[] {
  const qws = quickWinsForNode(nodeId)
  const set = new Set<PlanBadge>(extra)
  if (qws.length) {
    set.add('intervention')
    set.add('quick-win')
    if (qws.some(q => q.layer)) set.add('layer')
    if (qws.some(q => q.llm)) set.add('llm')
  }
  return Array.from(set)
}

function n(
  id: string,
  label: string,
  kind: ProcessNodeData['kind'],
  opts: Partial<ProcessNodeData> & { parentId?: string; position?: { x: number; y: number } } = {}
): Node<ProcessNodeData> {
  const { parentId, position, ...data } = opts
  const qw = quickWinsForNode(id)[0]
  return {
    id,
    type: kind === 'decision' ? 'decision' : kind === 'group' ? 'group' : 'process',
    position: position ?? { x: 0, y: 0 },
    parentId,
    extent: parentId ? 'parent' : undefined,
    data: {
      label,
      kind,
      badges: badgesFor(id, data.badges),
      details: {
        description: data.details?.description ?? label,
        intervention: qw?.intervention ?? data.details?.intervention,
        quickWinId: qw?.id ?? data.details?.quickWinId,
        automation: qw ? `${qw.id}: ${qw.title}` : data.details?.automation,
        planPhase: qw ? 'Fase 1 — Quick Wins OTD' : data.details?.planPhase,
        owner: data.details?.owner ?? qw?.source,
        system: data.details?.system,
        input: data.details?.input,
        output: data.details?.output,
        risks: data.details?.risks,
      },
      ...data,
    },
  }
}

const COL_W = 300
const COL_GAP = 48
const colX = (i: number) => i * (COL_W + COL_GAP)

/** Nós do processo B2B — 9 macroetapas + detalhes. Layout refinado pelo Dagre na view. */
export const B2B_NODES: Node<ProcessNodeData>[] = [
  n('root', 'PROCESSOS DE VENDAS E PÓS-VENDAS', 'root', {
    details: {
      description:
        'Jornada B2B Orfeu (as-is). Palavra-chave: Order-to-delivery — cada intervenção manual (financeiro + logística) vira um quick win.',
      owner: 'Cristiane · Selton · Ricardo CEO',
    },
  }),

  // Stages
  n('lead', '1. Encontrar o Lead', 'stage', { stageId: 's1', area: 'Comercial' }),
  n('neg', '2. Negociação / Prova + visita', 'stage', { stageId: 's2', area: 'Comercial' }),
  n('cad', '3. Cadastro do Cliente', 'stage', { stageId: 's3', area: 'Comercial' }),
  n('contrato', '4. Contrato de fornecimento', 'stage', { stageId: 's4', area: 'Jurídico' }),
  n('input', '5. Input Pedido', 'stage', { stageId: 's5', area: 'Comercial' }),
  n('proc', '6. Processamento Pedido', 'stage', { stageId: 's6', area: 'Logística' }),
  n('fin', '7. Contas a Receber', 'stage', { stageId: 's7', area: 'Financeiro' }),
  n('track', '8. Tracking Pedidos', 'stage', { stageId: 's8', area: 'Logística' }),
  n('pos', '9. Recompra / Pós-Venda', 'stage', { stageId: 's9', area: 'Pós-venda' }),

  // 1 Lead
  n('l1', 'Georreferenciamento + agenda + funil + CRM (JV)', 'process', {
    stageId: 's1',
    area: 'Comercial',
    details: {
      description: 'Comerciais prospectam via Jornada do Vendedor.',
      system: 'App Jornada do Vendedor',
      owner: 'Executivo de Vendas',
      input: 'Perfil de prospecção',
      output: 'Lead na JV',
    },
  }),
  n('l2', 'Lead vindo de Marketing', 'process', { stageId: 's1', area: 'Comercial' }),
  n('l3', 'Lead vindo do canal de atendimento', 'process', { stageId: 's1', area: 'Comercial' }),
  n('l4', 'Prospecção por rota', 'process', { stageId: 's1', area: 'Comercial' }),
  n('l5', 'Gerência envia lead ao comercial (e-mail)', 'alert', {
    stageId: 's1',
    area: 'Comercial',
    details: {
      description: 'Intervenção manual: lead chega por e-mail e precisa ser reinserido.',
      risks: ['Retrabalho', 'Lead perdido entre caixas de entrada'],
      owner: 'Gerência Comercial',
    },
  }),
  n('l6', 'Executivo insere lead na Jornada do Vendedor', 'process', {
    stageId: 's1',
    area: 'Comercial',
    details: {
      description: 'Insert manual na JV após e-mail da gerência.',
      system: 'Jornada do Vendedor',
      owner: 'Executivo de Vendas',
    },
  }),

  // 2 Negociação
  n('n1', 'Registrar visita/agendamento no CRM da JV', 'process', {
    stageId: 's2',
    area: 'Comercial',
    details: { system: 'CRM · Jornada do Vendedor', owner: 'Executivo de Vendas' },
  }),
  n('n2', 'Contato inicial · volume, máquina, condições', 'process', {
    stageId: 's2',
    area: 'Comercial',
  }),
  n('d1', 'Cliente interessado?', 'decision', { stageId: 's2', area: 'Comercial' }),
  n('nneg', 'Negativo: on hold + alerta para nova abordagem', 'negative', {
    stageId: 's2',
    area: 'Comercial',
  }),
  n('npos', 'Positivo: pricing na Calculadora JV', 'positive', {
    stageId: 's2',
    area: 'Comercial',
    details: { system: 'Calculadora JV' },
  }),
  n('n3', 'Gerar proposta B2B em Word', 'alert', {
    stageId: 's2',
    area: 'Comercial',
    details: {
      description: 'Modelo B2B ainda em Word — fora do fluxo digital.',
      risks: ['Versões descontroladas', 'Retrabalho de formatação'],
      system: 'Word',
    },
  }),
  n('n4', 'Aprovação da gerência por e-mail', 'alert', {
    stageId: 's2',
    area: 'Comercial',
    details: {
      description: 'Aprovação fora do sistema.',
      risks: ['SLA lento', 'Sem rastreio'],
    },
  }),
  n('n5', 'Enviar proposta em PDF ao cliente', 'process', { stageId: 's2', area: 'Comercial' }),
  n('n6', 'Solicitar cadastro e análise de crédito', 'process', {
    stageId: 's2',
    area: 'Financeiro',
  }),
  n('n7', 'Score Serasa + Score Orfeu', 'process', {
    stageId: 's2',
    area: 'Financeiro',
    details: { system: 'Serasa + score interno' },
  }),

  // 3 Cadastro
  n('c1', 'Cliente preenche Google Forms ou Portal Protheus', 'alert', {
    stageId: 's3',
    area: 'Comercial',
    details: {
      description: 'Dois caminhos paralelos — Forms ainda fora do Protheus.',
      system: 'Google Forms / Portal Protheus',
      risks: ['Dados duplicados', 'Retrabalho de digitação'],
    },
  }),

  // 4 Contrato
  n('ct1', 'Contrato no Protheus / Jurídico', 'system', {
    stageId: 's4',
    area: 'Jurídico',
    details: {
      description: 'Confecção de contrato de fornecimento.',
      system: 'Protheus + Jurídico',
      owner: 'Jurídico',
    },
  }),
  n('d2', 'Há comodato ou investimento?', 'decision', { stageId: 's4', area: 'Jurídico' }),
  n('ct2', 'Contratos de máquina e/ou café', 'process', { stageId: 's4', area: 'Jurídico' }),
  n('ct3', 'Melhoria: relatório volume/pedidos por máquina', 'system', {
    stageId: 's4',
    area: 'Comercial',
    badges: ['llm'],
  }),

  // 5 Input
  n('i1', 'Receber pedido do cliente (vendedor ou PDV)', 'process', {
    stageId: 's5',
    area: 'Comercial',
    details: {
      description: 'Dois canais: pedido do vendedor ou direto do PDV/cliente (Shopify etc.).',
      owner: 'Executivo de Vendas / Cliente',
    },
  }),
  n('i2', 'Acessar Portal de Vendas Protheus', 'process', {
    stageId: 's5',
    area: 'Comercial',
    details: { system: 'Portal Protheus' },
  }),
  n('i3', 'Selecionar produto e quantidade', 'process', { stageId: 's5', area: 'Comercial' }),
  n('i4', 'Visualizar saldo de estoque', 'process', {
    stageId: 's5',
    area: 'Logística',
    details: { system: 'Protheus · estoque near-real-time' },
  }),
  n('i5', 'Lançar pedido completo', 'process', { stageId: 's5', area: 'Comercial' }),
  n('d3', 'Há ruptura de estoque?', 'decision', { stageId: 's5', area: 'Backoffice' }),
  n('i6', 'Faturamento parcial', 'alert', {
    stageId: 's5',
    area: 'Backoffice',
    details: {
      description: 'Ruptura tratada manualmente no backoffice.',
      risks: ['Pedido complementar invisível', 'Retrabalho logístico'],
    },
  }),
  n('i7', 'Pedido complementar em espera', 'alert', {
    stageId: 's5',
    area: 'Backoffice',
  }),
  n('i8', 'Análise / liberação de crédito', 'alert', {
    stageId: 's5',
    area: 'Financeiro',
    details: {
      description: 'Crédito avaliado/liberado manualmente antes do faturamento.',
      owner: 'Financeiro',
      risks: ['Atraso no faturamento', 'Bloqueio opaco para o comercial'],
    },
  }),

  // 6 Processamento
  n('p1', 'Emissão da NF-e', 'process', {
    stageId: 's6',
    area: 'Financeiro',
    details: { system: 'Protheus' },
  }),
  n('p2', 'Guias de separação', 'alert', {
    stageId: 's6',
    area: 'Logística',
    details: { intervention: 'Emissão e uso manual de guias' },
  }),
  n('p3', 'Separação física dos itens', 'process', { stageId: 's6', area: 'Logística' }),
  n('p4', 'Conferência física × NF-e', 'alert', {
    stageId: 's6',
    area: 'Logística',
  }),
  n('p5', 'Documentos de transporte', 'process', { stageId: 's6', area: 'Logística' }),
  n('p6', 'Expedição e transporte', 'process', { stageId: 's6', area: 'Logística' }),
  n('p7', 'EDI para tracking e retorno', 'process', {
    stageId: 's6',
    area: 'Logística',
    details: { system: 'EDI' },
  }),

  // 7 Financeiro
  n('f1', 'Pagamento antecipado (sem automação completa)', 'alert', {
    stageId: 's7',
    area: 'Financeiro',
  }),
  n('f2', 'Pagamento à vista', 'process', { stageId: 's7', area: 'Financeiro' }),
  n('f3', 'Pagamento a prazo', 'process', { stageId: 's7', area: 'Financeiro' }),
  n('f4', 'Recebimento / conciliação antes do faturamento', 'alert', {
    stageId: 's7',
    area: 'Financeiro',
  }),
  n('f5', 'Emitir e registrar boletos no Itaú', 'alert', {
    stageId: 's7',
    area: 'Financeiro',
    details: { system: 'Itaú + Protheus', owner: 'Financeiro' },
  }),
  n('f6', 'Retorno dos boletos ao Protheus', 'process', {
    stageId: 's7',
    area: 'Financeiro',
    details: { system: 'Protheus' },
  }),

  // 8 Tracking
  n('t1', 'Input via comercial ou site', 'process', { stageId: 's8', area: 'Comercial' }),
  n('t2', 'Processamento interno do pedido', 'process', { stageId: 's8', area: 'Backoffice' }),
  n('t3', 'EDI / status do pedido', 'process', {
    stageId: 's8',
    area: 'Logística',
    details: { system: 'EDI' },
  }),
  n('t4', 'Melhoria: chatbot status no site Orfeu', 'system', {
    stageId: 's8',
    area: 'Pós-venda',
    badges: ['llm'],
  }),

  // 9 Recompra
  n('r1', 'Relatório semanal backoffice → vendedor', 'alert', {
    stageId: 's9',
    area: 'Backoffice',
    details: {
      description: 'Relatório manual de status de compra por cliente.',
      owner: 'Backoffice',
      risks: ['Atraso na recompra', 'Dependência de planilha'],
    },
  }),
  n('r2', 'Contato com cliente sem recompra', 'process', {
    stageId: 's9',
    area: 'Comercial',
    details: { owner: 'Executivo de Vendas' },
  }),
  n('r3', 'Input de novo pedido', 'process', { stageId: 's9', area: 'Comercial' }),
  n('r4', 'Futuro: portal de compra', 'system', { stageId: 's9', area: 'Comercial', badges: ['layer'] }),
  n('r5', 'Futuro: QR Code na máquina', 'system', { stageId: 's9', area: 'Pós-venda', badges: ['llm'] }),
  n('r6', 'Futuro: aplicativo de recompra', 'system', { stageId: 's9', area: 'Pós-venda', badges: ['layer', 'llm'] }),
]

/** Largura estimada por coluna para layout manual inicial (Dagre sobrescreve). */
export const STAGE_COLUMN_X = {
  s1: colX(0),
  s2: colX(1),
  s3: colX(2),
  s4: colX(3),
  s5: colX(4),
  s6: colX(5),
  s7: colX(6),
  s8: colX(7),
  s9: colX(8),
}
