import type { ProcessArea } from './types'

export interface OtdQuickWin {
  id: string
  title: string
  /** Intervenção manual que este QW elimina */
  intervention: string
  interventionDetail: string
  businessRisk: string
  expectedGain: string
  kpis: string[]
  stageId: string
  stageLabel: string
  area: ProcessArea
  source: string
  effort: 'Baixo' | 'Baixo-Médio' | 'Médio'
  impact: 'Médio' | 'Alto'
  pilot?: boolean
  layer?: boolean
  llm?: boolean
  nodeIds: string[]
}

/**
 * Quick wins do drive = resolução de TODAS as intervenções manuais
 * do Order-to-delivery (financeiro + logística no caminho do pedido).
 */
export const OTD_QUICK_WINS: OtdQuickWin[] = [
  {
    id: 'QW-OTD-01',
    title: 'Lead na Jornada do Vendedor sem e-mail/retrabalho',
    intervention: 'Gerência envia lead por e-mail; executivo reinsere na JV',
    interventionDetail:
      'O lead nasce fora da Jornada do Vendedor, perde contexto no e-mail e depende de uma segunda digitação para entrar no funil. Não há SLA, confirmação de recebimento nem rastreabilidade entre origem, responsável e próxima ação.',
    businessRisk:
      'Lead sem dono, abordagem tardia, duplicidade de cadastro e perda de conversão antes mesmo da primeira visita.',
    expectedGain:
      'Entrada única do lead, distribuição automática, histórico preservado e vendedor iniciando a abordagem com contexto e prazo definidos.',
    kpis: ['% leads inseridos automaticamente', 'Tempo lead → primeiro contato', 'Taxa de leads sem owner', 'Conversão lead → oportunidade'],
    stageId: 's1',
    stageLabel: '1. Encontrar o Lead',
    area: 'Comercial',
    source: 'Cristiane + Selton · discovery 03/08',
    effort: 'Baixo-Médio',
    impact: 'Alto',
    layer: true,
    nodeIds: ['l5', 'l6'],
  },
  {
    id: 'QW-OTD-02',
    title: 'Proposta e pricing no fluxo (sair de Word/e-mail)',
    intervention: 'Proposta B2B em Word + aprovação da gerência por e-mail + PDF manual',
    interventionDetail:
      'O vendedor monta a proposta em Word, consulta pricing fora do fluxo, envia para aprovação por e-mail e converte o arquivo em PDF. Versões, descontos e justificativas ficam dispersos.',
    businessRisk:
      'Tempo de resposta alto, condição comercial inconsistente, margem não protegida e baixa visibilidade do estágio real da negociação.',
    expectedGain:
      'Proposta gerada na Jornada do Vendedor com preço, margem, alçadas e versão controlados; aprovação ocorre no próprio fluxo.',
    kpis: ['Tempo oportunidade → proposta', '% propostas sem retrabalho', 'Tempo de aprovação', 'Margem por proposta', 'Conversão proposta → pedido'],
    stageId: 's2',
    stageLabel: '2. Negociação',
    area: 'Comercial',
    source: 'Cristiane + Selton · app Caio / JV',
    effort: 'Médio',
    impact: 'Alto',
    pilot: true,
    layer: true,
    nodeIds: ['n3', 'n4', 'n5'],
  },
  {
    id: 'QW-OTD-03',
    title: 'Cadastro e análise de crédito no portal',
    intervention: 'Cadastro via Forms paralelo + Score Serasa/Orfeu fora do fluxo único',
    interventionDetail:
      'Dados e documentos trafegam por Forms e consultas paralelas; Comercial e Financeiro repetem validações e não compartilham uma visão única da pendência.',
    businessRisk:
      'Cadastro incompleto, análise duplicada, cliente esperando sem status e pedido bloqueado por informação que poderia ter sido validada antes.',
    expectedGain:
      'Cadastro único com checklist, documentos e score integrados, pendências visíveis e passagem automática para crédito quando o dossiê estiver completo.',
    kpis: ['Tempo cadastro → aprovação', '% cadastros completos na 1ª submissão', 'Retrabalhos por cadastro', 'Pedidos bloqueados por cadastro'],
    stageId: 's3',
    stageLabel: '3. Cadastro',
    area: 'Comercial',
    source: 'Cristiane · Protheus',
    effort: 'Médio',
    impact: 'Alto',
    layer: true,
    nodeIds: ['c1', 'n6', 'n7'],
  },
  {
    id: 'QW-OTD-04',
    title: 'Contrato digital no Protheus / Jurídico',
    intervention: 'Contrato tratado manualmente; documentos dispersos',
    interventionDetail:
      'Minutas, anexos, comodatos e aprovações circulam fora de um fluxo comum. O status contratual não acompanha o cliente e o pedido no Protheus.',
    businessRisk:
      'Venda parada, uso de versão incorreta, obrigações sem rastreabilidade e operação iniciada antes da formalização adequada.',
    expectedGain:
      'Contrato montado a partir do cadastro, com modelo correto, assinatura e status integrados ao cliente e ao pedido.',
    kpis: ['Tempo cadastro → contrato assinado', '% contratos no template correto', 'Pendências por contrato', 'Pedidos aguardando contrato'],
    stageId: 's4',
    stageLabel: '4. Contrato',
    area: 'Jurídico',
    source: 'Discovery comercial + André',
    effort: 'Médio',
    impact: 'Alto',
    layer: true,
    nodeIds: ['ct1', 'ct2'],
  },
  {
    id: 'QW-OTD-05',
    title: 'Input pedido com estoque e ruptura visíveis',
    intervention: 'Ruptura processada no backoffice; pedido complementar invisível no sistema',
    interventionDetail:
      'A ruptura só fica clara depois do lançamento. O backoffice separa o que pode faturar e mantém o complementar por controles paralelos, sem visão confiável para vendedor e cliente.',
    businessRisk:
      'Promessa de entrega incorreta, item complementar esquecido, aumento de contatos de status e perda de receita/margem por substituição tardia.',
    expectedGain:
      'Estoque e risco de ruptura visíveis antes da confirmação, com substituição orientada, pedido parcial ligado ao original e complementar acompanhado até a entrega.',
    kpis: ['% pedidos com ruptura', 'Valor de pedidos complementares em aberto', 'Tempo ruptura → decisão', 'Receita recuperada por substituição'],
    stageId: 's5',
    stageLabel: '5. Input Pedido',
    area: 'Backoffice',
    source: 'Cristiane + Selton · order-to-delivery',
    effort: 'Médio',
    impact: 'Alto',
    pilot: true,
    layer: true,
    nodeIds: ['i5', 'i6', 'i7', 'd3'],
  },
  {
    id: 'QW-OTD-06',
    title: 'Liberação de crédito no fluxo pré-faturamento',
    intervention: 'Bloqueio/liberação de crédito avaliados manualmente antes do faturamento',
    interventionDetail:
      'Financeiro recebe o pedido já bloqueado, consulta informações em fontes diferentes e devolve a decisão manualmente, sem fila priorizada por valor, SLA ou risco.',
    businessRisk:
      'Pedido aprovado comercialmente fica parado, faturamento perde janela e áreas gastam tempo cobrando status sem conhecer a causa.',
    expectedGain:
      'Pré-validação de crédito, fila única de exceções, causa do bloqueio explícita e liberação orientada por regra, risco e impacto do pedido.',
    kpis: ['Tempo bloqueio → liberação', '% pedidos bloqueados', 'Valor parado em crédito', '% liberações dentro do SLA'],
    stageId: 's5',
    stageLabel: '5. Input Pedido',
    area: 'Financeiro',
    source: 'Cristiane + Financeiro',
    effort: 'Médio',
    impact: 'Alto',
    layer: true,
    nodeIds: ['i8'],
  },
  {
    id: 'QW-OTD-07',
    title: 'Faturamento B2B automático (NF-e + boletos)',
    intervention: 'Emissão NF-e, boletos Itaú e retorno ao Protheus com intervenção financeira',
    interventionDetail:
      'NF-e, boleto e retorno bancário exigem passos manuais e conferências entre Protheus e Itaú. Uma falha interrompe o pedido e precisa ser encontrada por uma pessoa.',
    businessRisk:
      'Erro fiscal/financeiro, atraso de expedição, divergência entre documento e pedido e concentração operacional em poucas pessoas.',
    expectedGain:
      'Faturamento orquestrado com validações, emissão de NF-e e boleto, retorno ao Protheus e tratamento por exceção — intervenção humana apenas quando houver desvio.',
    kpis: ['% pedidos faturados sem intervenção', 'Tempo liberação → faturamento', 'Erros de NF-e/boleto', 'Custo operacional por pedido faturado'],
    stageId: 's7',
    stageLabel: '7. Contas a Receber',
    area: 'Financeiro',
    source: 'André #1 · Ricardo CEO',
    effort: 'Médio',
    impact: 'Alto',
    pilot: true,
    layer: true,
    nodeIds: ['p1', 'f1', 'f3', 'f4', 'f5', 'f6'],
  },
  {
    id: 'QW-OTD-08',
    title: 'Separação/WMS sem papel (coletor + conferência)',
    intervention: 'Guias de separação, conferência física e volumetria manuais',
    interventionDetail:
      'A operação depende de guias impressas, leitura visual e conferência física. Divergências de item, quantidade e volume são descobertas tarde e têm pouca rastreabilidade.',
    businessRisk:
      'Erro de picking, reabertura de volumes, atraso na coleta, custo de reentrega e baixa capacidade de identificar a origem do desvio.',
    expectedGain:
      'Separação orientada por coletor, conferência digital e volumetria registrada no WMS, com divergência bloqueada antes da expedição.',
    kpis: ['Acuracidade de picking', 'Tempo de separação por pedido', '% divergências na conferência', 'Reentregas por erro operacional'],
    stageId: 's6',
    stageLabel: '6. Processamento',
    area: 'Logística',
    source: 'Gustavo + Ricardo Silva · OTD logística',
    effort: 'Médio',
    impact: 'Alto',
    layer: true,
    nodeIds: ['p2', 'p3', 'p4'],
  },
  {
    id: 'QW-OTD-09',
    title: 'Expedição e EDI no fluxo de tracking',
    intervention: 'Documentos de transporte e EDI parciais; status por telefone/comercial',
    interventionDetail:
      'Documentos e eventos de transporte não formam uma linha do tempo única. Quando o EDI falha, Comercial consulta Logística ou transportadora por telefone para responder ao cliente.',
    businessRisk:
      'Atraso percebido somente após cobrança, comunicação reativa, SLA sem causa raiz e alto volume de contatos internos de acompanhamento.',
    expectedGain:
      'Eventos de expedição e EDI consolidados, ETA e desvios visíveis, alerta proativo para o owner e comunicação de status baseada na mesma verdade.',
    kpis: ['OTIF', '% pedidos com tracking atualizado', 'Tempo para detectar atraso', 'Contatos manuais de status por pedido'],
    stageId: 's8',
    stageLabel: '8. Tracking',
    area: 'Logística',
    source: 'Cristiane + Selton · fechamento de mês',
    effort: 'Médio',
    impact: 'Alto',
    layer: true,
    llm: true,
    nodeIds: ['p5', 'p6', 'p7', 't2', 't3'],
  },
  {
    id: 'QW-OTD-10',
    title: 'Alerta de recompra automático (sem relatório semanal manual)',
    intervention: 'Backoffice monta relatório semanal; vendedor liga para quem não recomprou',
    interventionDetail:
      'O backoffice consolida manualmente clientes sem recompra e distribui uma fotografia semanal. O vendedor recebe a lista sem prioridade, contexto ou próxima melhor ação.',
    businessRisk:
      'Cliente fora do ciclo é percebido tarde, carteira é abordada de forma uniforme e oportunidade de recorrência se perde entre relatórios.',
    expectedGain:
      'Ciclo esperado por cliente, alerta diário priorizado e próxima ação sugerida ao vendedor, com retorno ao funil e resultado da abordagem registrado.',
    kpis: ['Taxa de recompra no ciclo', 'Clientes vencidos sem ação', 'Tempo alerta → contato', 'Receita/margem recuperada por recompra'],
    stageId: 's9',
    stageLabel: '9. Recompra',
    area: 'Pós-venda',
    source: 'Cristiane + Selton · pós-venda',
    effort: 'Baixo-Médio',
    impact: 'Alto',
    layer: true,
    llm: true,
    nodeIds: ['r1', 'r2'],
  },
]

export const SATELLITE_WINS = [
  {
    id: 'SAT-01',
    title: 'Resumo IA de checklists baristas',
    source: 'Joyce · onboarding',
    effort: 'Baixo' as const,
    impact: 'Médio' as const,
  },
  {
    id: 'SAT-02',
    title: 'Automação relatórios Cropster',
    source: 'Milena · qualidade',
    effort: 'Baixo-Médio' as const,
    impact: 'Médio' as const,
  },
  {
    id: 'SAT-03',
    title: 'Integração e-mail → Suri',
    source: 'Cibele · CX',
    effort: 'Médio' as const,
    impact: 'Alto' as const,
  },
  {
    id: 'SAT-04',
    title: 'Portal de entregas Pixel + chamados TI com SLA',
    source: 'André + Ricardo Silva',
    effort: 'Baixo' as const,
    impact: 'Alto' as const,
  },
]

export function quickWinById(id: string): OtdQuickWin | undefined {
  return OTD_QUICK_WINS.find(q => q.id === id)
}

export function quickWinsForNode(nodeId: string): OtdQuickWin[] {
  return OTD_QUICK_WINS.filter(q => q.nodeIds.includes(nodeId))
}

export const OTD_PLAN_SUMMARY = {
  keyword: 'Order-to-delivery',
  headline: 'Eliminar todas as intervenções manuais do pedido (financeiro + logística)',
  formula:
    'Cada intervenção manual no order-to-delivery vira um quick win. Os quick wins, juntos, constroem o Adaptive Layer™. O LLM opera sobre o fluxo já limpo.',
  interventions: OTD_QUICK_WINS.length,
  layerTagline: 'Adaptive Layer™ — conecta Protheus, WMS, portal, EDI e JV sem novo silo',
  llmTagline: 'LLM — status, risco de cliente e consultas NL depois que as intervenções caíram',
  owners: 'Cristiane · Selton · André · Ricardo CEO',
}

export const OTD_AI_PLAN_INTRO = {
  eyebrow: 'Leitura do plano por IA',
  title: 'O plano não automatiza tarefas isoladas — ele remove a integração humana entre as etapas.',
  narrative:
    'A leitura combinada das entrevistas e do mapa OTD mostra um padrão: o problema central não é a falta de sistemas, mas as passagens manuais entre eles. Cada quick win elimina uma passagem, registra um evento confiável na Adaptive Layer™ e prepara a etapa seguinte. Primeiro reduzimos intervenção e exceção; depois usamos IA para antecipar risco, explicar causa e coordenar ação.',
  conclusions: [
    'Priorizar o fluxo ponta a ponta, não automações locais desconectadas.',
    'Medir ganho por tempo, toque manual, qualidade, SLA e margem protegida.',
    'Liberar LLM e agentes somente quando o OTD estiver rastreável e com baseline.',
  ],
  caveat:
    'Síntese orientativa: metas financeiras e operacionais serão confirmadas no M0 com dados reais da Orfeu.',
}

export interface OtdKpi {
  id: string
  label: string
  purpose: string
  formula: string
  direction: 'reduzir' | 'aumentar'
  owner: string
  cadence: string
}

export const OTD_KPIS: OtdKpi[] = [
  {
    id: 'manual-touch-rate',
    label: 'Toques manuais por pedido',
    purpose: 'Mede quantas intervenções humanas mantêm o pedido andando entre sistemas.',
    formula: 'Total de intervenções registradas ÷ pedidos concluídos',
    direction: 'reduzir',
    owner: 'TI + donos do processo',
    cadence: 'Semanal',
  },
  {
    id: 'otd-cycle-time',
    label: 'Lead time Order-to-delivery',
    purpose: 'Tempo entre confirmação do pedido e entrega ao cliente.',
    formula: 'Data/hora da entrega − data/hora da confirmação',
    direction: 'reduzir',
    owner: 'Comercial + Logística',
    cadence: 'Semanal',
  },
  {
    id: 'straight-through',
    label: 'Pedidos sem intervenção',
    purpose: 'Percentual que atravessa crédito, faturamento e expedição sem tratamento manual.',
    formula: 'Pedidos sem toque manual ÷ pedidos concluídos × 100',
    direction: 'aumentar',
    owner: 'Financeiro + TI',
    cadence: 'Semanal',
  },
  {
    id: 'perfect-order',
    label: 'Perfect Order Rate',
    purpose: 'Pedido entregue completo, correto, no prazo e com documentação válida.',
    formula: 'Pedidos perfeitos ÷ pedidos entregues × 100',
    direction: 'aumentar',
    owner: 'Logística + Financeiro',
    cadence: 'Mensal',
  },
  {
    id: 'exception-resolution',
    label: 'Tempo de resolução de exceção',
    purpose: 'Velocidade para resolver ruptura, crédito, fiscal ou transporte.',
    formula: 'Média de hora da solução − hora da detecção',
    direction: 'reduzir',
    owner: 'Owner da etapa',
    cadence: 'Semanal',
  },
  {
    id: 'otif',
    label: 'OTIF',
    purpose: 'Entregas completas e dentro da data prometida.',
    formula: 'Entregas on-time e in-full ÷ entregas totais × 100',
    direction: 'aumentar',
    owner: 'Logística',
    cadence: 'Semanal',
  },
  {
    id: 'repurchase',
    label: 'Recompra no ciclo',
    purpose: 'Clientes que recompram dentro da janela esperada para seu perfil.',
    formula: 'Clientes que recompraram no ciclo ÷ clientes elegíveis × 100',
    direction: 'aumentar',
    owner: 'Cristiane + Selton',
    cadence: 'Mensal',
  },
  {
    id: 'cost-to-serve',
    label: 'Custo operacional por pedido',
    purpose: 'Esforço interno e custos de erro/retrabalho para processar cada pedido.',
    formula: '(Custo de pessoas no processo + erros + reentregas) ÷ pedidos',
    direction: 'reduzir',
    owner: 'Financeiro + Operações',
    cadence: 'Mensal',
  },
]

export const OTD_ROI_MODEL = {
  title: 'ROI verificável — do baseline ao benefício anual',
  principle:
    'O ROI será calculado com dados da Orfeu, comparando o baseline M0 com a operação estabilizada após M4. Não usamos percentual de economia sem evidência.',
  valueLevers: [
    {
      label: 'Produtividade recuperada',
      formula: 'Horas manuais evitadas × custo-hora carregado',
      examples: 'Redigitação, consultas de status, conciliação, relatórios e retrabalho',
    },
    {
      label: 'Margem protegida',
      formula: 'Pedidos/itens recuperados × margem de contribuição',
      examples: 'Ruptura antecipada, substituição, pedido complementar e recompra',
    },
    {
      label: 'Custos de falha evitados',
      formula: 'Erros evitados × custo médio por ocorrência',
      examples: 'NF-e/boleto, picking, reentrega, devolução e atraso',
    },
    {
      label: 'Receita acelerada',
      formula: 'Incremento de conversão/recompra × margem de contribuição',
      examples: 'Proposta mais rápida, menor bloqueio e alerta de recompra',
    },
  ],
  formulas: [
    'Benefício anual = produtividade + margem protegida + custos evitados + receita incremental',
    'ROI = (benefício anual − investimento) ÷ investimento × 100',
    'Payback (meses) = investimento ÷ benefício mensal validado',
  ],
  baselineInputs: [
    'Volume mensal de pedidos e faturamento B2B',
    'Tempo e pessoas por intervenção manual',
    'Margem de contribuição por canal/categoria',
    'Rupturas, bloqueios, erros, devoluções e reentregas',
    'Conversão de propostas, OTIF e recompra atual',
  ],
}
