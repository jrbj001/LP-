// Pixel SDK — Adaptive Layer™ productizado
// Narrativa e ROI derivados do Executive Review Café Orfeu.

export const PIXEL_META = {
  product: 'Pixel',
  trademark: 'Adaptive Layer™',
  company: 'PixelPulseLab',
  tagline: 'A camada que faz seus sistemas conversarem — e seus agentes trabalharem.',
  caseStudy: 'Grupo Orfeu · Café · Agroindústria',
}

/* ─── Problema ─────────────────────────────────────────────────────────────── */

export const PROBLEM = {
  eyebrow: 'O custo invisível',
  headline: 'Seus sistemas não conversam. As pessoas viraram a integração.',
  body: 'Em cada estação da operação alguém redigita, reconcilia e corre atrás do dado. Planilhas, e-mails e ERPs viram ponte humana. O sintoma parece local — faturamento, CX, logística — mas a causa é estrutural.',
  pains: [
    {
      title: 'Redigitação em cascata',
      detail: 'O mesmo pedido nasce no e-commerce, reaparece no ERP e volta a ser digitado no WMS.',
    },
    {
      title: 'Verdades paralelas',
      detail: 'Cada área tem a “sua” planilha. Ninguém sabe qual número é o oficial.',
    },
    {
      title: 'IA sem chão',
      detail: 'Sem camada unificada, agentes alucinam ou ficam presos a um sistema só.',
    },
    {
      title: 'Projetos que não se acumulam',
      detail: 'Cada integração é um silo. A próxima entrega começa do zero outra vez.',
    },
  ],
}

/* ─── O que é Pixel ────────────────────────────────────────────────────────── */

export const WHAT_IS = {
  eyebrow: 'O produto',
  headline: 'Pixel é o modelo e o SDK da Adaptive Layer™.',
  body: 'Não substituímos seu ERP, WMS ou CRM. Conectamos o que você já tem numa camada viva de dados, eventos e APIs — e empilhamos um squad de agentes sobre essa verdade única.',
  pillars: [
    {
      code: '01',
      title: 'Camada de integração',
      detail: 'Conectores, eventos e modelo unificado. Cada sistema continua no seu lugar — Pixel é o tecido entre eles.',
    },
    {
      code: '02',
      title: 'SDK & padrões',
      detail: 'Contratos, autenticação, LGPD e observabilidade embutidos. Novas entregas nascem plugadas, não reinventadas.',
    },
    {
      code: '03',
      title: 'Squad de agentes',
      detail: 'Um agente por área, todos consultando a mesma fonte. Linguagem natural sobre dados reais e auditáveis.',
    },
  ],
}

/* ─── Como funciona ────────────────────────────────────────────────────────── */

export const HOW_IT_WORKS = {
  eyebrow: 'Na prática',
  headline: 'Sistemas existentes → Pixel → o que destrava',
  steps: [
    {
      label: 'Conectar',
      title: 'Seus sistemas entram',
      detail: 'ERP, WMS, e-commerce, CRM, sensores, marketplace — cada um com conector dedicado.',
    },
    {
      label: 'Unificar',
      title: 'Uma verdade operacional',
      detail: 'Modelo de dados, eventos e trilha de segurança. Sem redigitação. Sem verdades paralelas.',
    },
    {
      label: 'Destravar',
      title: 'Automações + agentes',
      detail: 'Faturamento, order-to-delivery, visão 360º e um squad de agentes por área — tudo sobre a mesma camada.',
    },
  ],
}

export const SYSTEMS_GENERIC = [
  'ERP',
  'WMS',
  'E-commerce',
  'CRM / CX',
  'Qualidade',
  'Sensores',
  'Marketplace',
]

export const LAYER_CAPS = [
  { label: 'Integração & eventos', hint: 'conectores · filas · webhooks' },
  { label: 'Dados unificados', hint: 'modelo canônico · histórico' },
  { label: 'APIs & automação', hint: 'SDK · workflows · regras' },
  { label: 'Segurança & LGPD', hint: 'acesso · auditoria · retenção' },
]

export const UNLOCKS = [
  'Faturamento automático multicanal',
  'Order-to-delivery digital',
  'Visão 360º do cliente',
  'Consultas em linguagem natural',
  'Rastreabilidade ponta a ponta',
  'Integridade de dados por desenho',
]

/* ─── Squad de agentes (ênfase máxima) ─────────────────────────────────────── */

export const AGENTS_SECTION = {
  eyebrow: 'O diferencial',
  headline: 'Squad de agentes. Um por área. Uma única verdade.',
  body: 'Pixel não é só integração. É a base onde agentes de IA trabalham com dados reais — sem alucinar sobre planilhas, sem depender de um relatório de TI. Cada agente tem dono de negócio, prompt de domínio e acesso auditável à camada.',
  foundation: 'LLM + Pixel (Adaptive Layer™)',
  foundationNote: 'dados unificados, seguros e auditáveis — um agente por área, uma única verdade',
}

export interface AgentDef {
  id: string
  name: string
  domain: string
  role: string
  example: string
  accent: string
}

export const AGENTS: AgentDef[] = [
  {
    id: 'erp',
    name: 'Copiloto de ERP',
    domain: 'Operações / TI',
    role: 'Consultas ao ERP em linguagem natural — sem fila de relatório.',
    example: '“Quantos pedidos B2B faturamos ontem por região?”',
    accent: '#34d399',
  },
  {
    id: 'ops',
    name: 'Agente de Operações',
    domain: 'Ops / Lojas',
    role: 'Resume checklists diários e aponta anomalias antes do fechamento.',
    example: '“3 unidades com anomalia de temperatura. Detalhes?”',
    accent: '#6ee7b7',
  },
  {
    id: 'cx',
    name: 'Agente de CX',
    domain: 'Customer Experience',
    role: 'Classifica solicitações, lê sentimento e sugere a próxima ação.',
    example: '“Quais clientes B2B estão em risco este mês?”',
    accent: '#a7f3d0',
  },
  {
    id: 'sales',
    name: 'Agente Comercial',
    domain: 'Vendas / Pricing',
    role: 'Elasticidade de preço e jornada de vendas sobre dados vivos.',
    example: '“Simule o impacto de +4% no mix principal.”',
    accent: '#34d399',
  },
  {
    id: 'logistics',
    name: 'Agente de Logística',
    domain: 'Supply / Entrega',
    role: 'Previsibilidade de transporte, tracking e alertas de atraso.',
    example: '“Quais entregas de amanhã têm risco de atraso?”',
    accent: '#6ee7b7',
  },
  {
    id: 'quality',
    name: 'Agente de Qualidade',
    domain: 'Qualidade / Lab',
    role: 'Consolida sensores e automatiza relatórios sensoriais por lote.',
    example: '“Compare o cupping dos últimos 5 lotes.”',
    accent: '#a7f3d0',
  },
]

/* ─── Case Orfeu ───────────────────────────────────────────────────────────── */

export const ORFEU_CASE = {
  eyebrow: 'Prova viva',
  headline: 'Café Orfeu: da semente à xícara, o dado finalmente acompanha o grão.',
  body: 'No assessment do Grupo Orfeu, a dor convergente era clara: sistemas que não conversam. O Adaptive Layer™ nasceu como entrega-mãe do plano — e Pixel é a evolução desse modelo em produto e SDK.',
  journey: [
    { stage: 'Fazenda', pain: 'Dados de origem em papel e planilha' },
    { stage: 'Benefício', pain: 'Lotes sem trilha digital contínua' },
    { stage: 'Torra', pain: 'Cropster isolado do restante' },
    { stage: 'Logística', pain: 'Tracking manual entre sistemas' },
    { stage: 'Loja / CX', pain: 'Checklists e VoC desconectados' },
    { stage: 'Xícara', pain: 'Sem feedback automático ao lote' },
  ],
  systems: [
    'Protheus (400+ regras)',
    'WMS',
    'Shopify',
    'Suri',
    'Cropster',
    'OpsFactor',
    'Mercado Livre',
  ],
  quote:
    'O Adaptive Layer™ faz o dado percorrer a mesma jornada do grão: capturado uma vez na origem, fluindo íntegro até a xícara — e voltando como inteligência para cada decisão.',
  href: '/adaptive/executive-review',
}

/* ─── ROI ──────────────────────────────────────────────────────────────────── */

export const ROI = {
  eyebrow: 'Por que ter Pixel',
  headline: 'ROI que se acumula — cada integração amplia a próxima.',
  body: 'Diferente de projetos pontuais, Pixel cria ativo operacional. O que você integra hoje reduz o custo de tudo que vem depois — inclusive o squad de agentes.',
  reasons: [
    {
      title: 'Horas humanas deixam de ser middleware',
      detail: 'Redigitação, conciliação e “caça ao dado” voltam a ser trabalho de valor — não integração improvisada.',
      metric: '−26h',
      metricLabel: 'manuais/semana no piloto Orfeu*',
    },
    {
      title: 'Cada entrega nasce plugada',
      detail: 'Quick wins e automações já entram na camada. O próximo projeto não reinventa o conector.',
      metric: '1×',
      metricLabel: 'verdade operacional',
    },
    {
      title: 'Agentes com chão firme',
      detail: 'IA sobre dados unificados e auditáveis — não sobre dumps de planilha. Menos risco, mais confiança do negócio.',
      metric: '6',
      metricLabel: 'agentes por domínio',
    },
    {
      title: 'Prioridade do comitê, não só de TI',
      detail: 'Faturamento, order-to-delivery e visão 360º deixam de ser “projeto de integração” e viram capacidade da empresa.',
      metric: '6–8',
      metricLabel: 'meses até a entrega-mãe*',
    },
  ],
  footnote: '*Indicadores do plano de trabalho Café Orfeu (assessment 2026). Resultados variam por contexto e escopo.',
  compare: [
    {
      without: 'Integração pontual por demanda',
      with: 'Camada acumulativa com SDK',
    },
    {
      without: 'Agente isolado num único sistema',
      with: 'Squad de agentes sobre a mesma verdade',
    },
    {
      without: 'Valor que some quando o projeto acaba',
      with: 'Ativo que barateia cada próxima entrega',
    },
  ],
}

/* ─── Modelo SDK ───────────────────────────────────────────────────────────── */

export const SDK_MODEL = {
  eyebrow: 'O modelo Pixel',
  headline: 'De assessment a SDK. De camada a plataforma.',
  body: 'Pixel empacota o que provamos no campo: padrões de integração, governança de dados e runtime para agentes — prontos para o próximo cliente, sem recomeçar do zero.',
  layers: [
    { id: 'connectors', label: 'Connectors', detail: 'ERP · WMS · commerce · CX · IoT' },
    { id: 'core', label: 'Pixel Core', detail: 'eventos · modelo · políticas · audit' },
    { id: 'sdk', label: 'Pixel SDK', detail: 'APIs · auth · observability · LGPD' },
    { id: 'agents', label: 'Agent Runtime', detail: 'squad · tools · memory · guardrails' },
    { id: 'portal', label: 'Delivery Portal', detail: 'entregas · billing · comitê ao vivo' },
  ],
  principles: [
    'Código e dados na conta do cliente desde o dia 1',
    'Quick wins em paralelo à fundação da camada',
    'Squad mensal com billing por entrega em produção',
    'Agentes com dono de negócio e trilha auditável',
  ],
}

/* ─── CTA ──────────────────────────────────────────────────────────────────── */

export const PIXEL_CTA = {
  eyebrow: 'Próximo passo',
  headline: 'Quer Pixel na sua operação?',
  body: 'Começamos com um assessment curto, um piloto de quick wins e a fundação da camada — o mesmo caminho que abriu o plano do Café Orfeu.',
  primary: 'Falar com a PixelPulseLab',
  secondary: 'Ver o case Orfeu',
  email: 'mailto:ze@pixelpulselab.dev',
  whatsapp: 'https://wa.me/5511981058468',
}
