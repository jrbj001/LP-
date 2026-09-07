export const WIRE = {
  eyebrow: 'Wireframes',
  headline: 'Os dados da sua empresa, na sua mão.',
  lede:
    'A interface do Adaptive Layer™: um console onde pessoas e agentes perguntam em linguagem natural — e a resposta vem do grafo da operação, com fonte e permissão. Navegue pelas telas.',
  tenant: 'café orfeu',
  screens: [
    { id: 'console', label: 'Console' },
    { id: 'grafo', label: 'Grafo' },
    { id: 'agentes', label: 'Agentes' },
    { id: 'conectores', label: 'Conectores' },
    { id: 'auditoria', label: 'Auditoria' },
  ] as const,

  console: {
    history: [
      'Pedidos com risco de atraso',
      'SLA do cliente X — cláusulas',
      'Estoque do lote L-19',
      'OTD da semana por canal',
    ],
    question: 'Por que o pedido #4821 pode atrasar?',
    answer: {
      intro:
        'O #4821 (40 caixas, cliente X) tem entrega prevista para sexta, mas há um fator de risco na separação:',
      facts: [
        { label: 'Pedido #4821', value: 'entrega sexta · 40 caixas', source: 'ERP · agora' },
        { label: 'Lote L-19', value: 'separação pendente', source: 'WMS · há 12 min' },
        { label: 'Crédito', value: 'aprovado', source: 'ERP · ontem 16:40' },
      ],
      quote: {
        text: 'Em pedidos acima de 30 caixas, o prazo de separação é de 48h úteis contadas a partir da confirmação de crédito. Atrasos na separação devem ser comunicados ao cliente em até 4h.',
        doc: 'Política de SLA — cliente X · cláusula 4.2',
      },
      footer: 'GraphRAG: fato do grafo + trecho do documento · acesso gravado no audit',
    },
    models: ['claude', 'gpt', 'copilot'],
    placeholder: 'Pergunte sobre a operação — pedidos, estoque, políticas…',
    outputChips: [
      'Gerar relatório da semana',
      'Escrever user stories do atraso',
      'Forecast de demanda — 30 dias',
      'Rascunhar e-mail para o cliente X',
    ],
  },

  graph: {
    focus: 'Pedido #4821',
    nodes: [
      { id: 'pedido', label: 'Pedido #4821', hint: 'entrega sexta', x: 300, y: 90, main: true },
      { id: 'cliente', label: 'Cliente X', hint: 'varejo · SP', x: 120, y: 40 },
      { id: 'lote', label: 'Lote L-19', hint: 'separação pendente', x: 480, y: 40 },
      { id: 'politica', label: 'Política SLA', hint: 'cláusula 4.2', x: 120, y: 170 },
      { id: 'nf', label: 'NF 88.412', hint: 'emitida', x: 480, y: 170 },
    ],
    edges: [
      { from: 'cliente', to: 'pedido', label: 'possui' },
      { from: 'pedido', to: 'lote', label: 'reserva' },
      { from: 'cliente', to: 'politica', label: 'regido por' },
      { from: 'pedido', to: 'nf', label: 'fatura' },
    ],
    panel: {
      title: 'Pedido #4821',
      rows: [
        { k: 'status', v: 'confirmado · separação pendente' },
        { k: 'origem', v: 'ERP Protheus · evento pedido.criado' },
        { k: 'documentos', v: '2 trechos vetorizados apontam para este nó' },
        { k: 'última consulta', v: 'agente-comercial · há 4 min' },
      ],
    },
  },

  agents: [
    {
      name: 'agente-comercial',
      owner: 'Marina · Comercial',
      tools: ['pedidos', 'sla', 'crédito'],
      runs: '38 execuções hoje',
      status: 'ativo',
    },
    {
      name: 'agente-logistica',
      owner: 'Paulo · Operações',
      tools: ['wms', 'lotes', 'transportadoras'],
      runs: '21 execuções hoje',
      status: 'ativo',
    },
    {
      name: 'agente-financeiro',
      owner: 'Carla · Financeiro',
      tools: ['nf', 'crédito', 'inadimplência'],
      runs: '9 execuções hoje',
      status: 'ativo',
    },
    {
      name: 'agente-atendimento',
      owner: 'squad CX',
      tools: ['tickets', 'sla', 'pedidos'],
      runs: 'em homologação',
      status: 'staging',
    },
  ],

  connectors: [
    { name: 'ERP Protheus', kind: 'pedido · NF · crédito', status: 'ok', sync: 'há 2 min', events: '1.204 eventos hoje' },
    { name: 'WMS', kind: 'lote · estoque · separação', status: 'ok', sync: 'há 5 min', events: '862 eventos hoje' },
    { name: 'CRM / CX', kind: 'cliente · ticket', status: 'ok', sync: 'há 11 min', events: '214 eventos hoje' },
    { name: 'Docs / Drive', kind: 'política · contrato', status: 'reindex', sync: 'há 1 h', events: '3 documentos re-embedados' },
  ],

  audit: [
    { who: 'agente-comercial', what: 'leu Política SLA (cliente X) · cláusula 4.2', acl: 'ACL herdada do Drive', when: '14:32' },
    { who: 'marina@orfeu', what: 'consultou Pedido #4821 no console', acl: 'perfil comercial', when: '14:31' },
    { who: 'agente-logistica', what: 'listou lotes pendentes no WMS', acl: 'escopo operações', when: '14:18' },
    { who: 'copilot (MCP)', what: 'consultou OTD da semana', acl: 'token de serviço', when: '13:55' },
    { who: 'agente-financeiro', what: 'negado: contrato do fornecedor B', acl: 'sem permissão — bloqueado', when: '13:41', denied: true },
  ],
}
