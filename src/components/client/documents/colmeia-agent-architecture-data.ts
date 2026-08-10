// Arquitetura de Agentes — Colmeia + Banco de Ativos · Be180 OOH
// Produto, Adaptive Layer™, arquitetura Miro, plano de trabalho e user stories.

export const COLMEIA_AGENT_ARCHITECTURE_META = {
  id: 'colmeia-arquitetura-agentes',
  title: 'Arquitetura de Agentes · Colmeia & Banco de Ativos',
  client: 'Be180 OOH',
  date: '10/08/2026',
  path: '/arquitetura-de-agentes',
  sources: [
    'Miro · Arquitetura Tech — Agentes & Colmeia',
    'Reunião 04/08/2026 · Planejamento do Roadmap do Colmeia',
    'Repos GitHub · jrbj001/colmeia---meusroteirosdefault (produto Banco de Ativos)',
    'Repos GitHub · jrbj001/image_brand_processing',
    'Adaptive Layer™ · PixelPulseLab',
  ],
}

export const COLMEIA_INTRO = {
  eyebrow: 'Documento técnico-executivo',
  title: 'Uma arquitetura para operar o Colmeia com agentes desde o primeiro ciclo',
  lead:
    'O próximo ciclo do Colmeia combina produto, infraestrutura e seis agentes especializados em um único roadmap. A Adaptive Layer™ é o núcleo que transforma dados e eventos da jornada OOH em ações seguras, rastreáveis e automatizáveis.',
  narrative: [
    'A jornada OOH tem seis etapas — briefing, planejamento, disponibilidade, preço/PI, validação e pós-venda. Para cada uma existe um agente correspondente, e o roadmap entrega esses agentes na mesma sequência em que a operação acontece.',
    'Um agente só automatiza de verdade quando tem do que precisa para agir: eventos confiáveis do que mudou, dados autorizados para consultar, ferramentas para executar via API, isolamento entre clientes e registro de cada decisão. É isso que separa uma automação operacional de um chat que apenas responde.',
    'A Adaptive Layer™ entrega exatamente essa base. Ela conecta Banco de Ativos, planner e serviços existentes; monta o contexto de cada tarefa; expõe as ferramentas de forma segura; e devolve o resultado à linha do tempo do ativo e do roteiro. Por isso infraestrutura e agentes avançam no mesmo roadmap, na ordem em que uma capacidade destrava a próxima.',
  ],
  principles: [
    {
      title: 'Planner no centro',
      detail: 'Meus Roteiros é o produto. A Layer entrega ao planner inventário, preço, disponibilidade e feedback confiáveis.',
    },
    {
      title: 'Ativo e roteiro como verdade',
      detail: 'Cada evento (upload, doação, PM, PI, comprovação) fica na linha do tempo — sem planilha paralela como fonte.',
    },
    {
      title: 'Agentes desde o M0',
      detail: 'Casos de uso, contratos, guardrails e métricas nascem no início; cada agente entra em produção quando suas dependências ficam prontas.',
    },
    {
      title: 'Uma jornada, vários agentes',
      detail: 'Agentes por etapa (demanda → pós-venda), todos sobre a mesma Layer — sem bases paralelas por time.',
    },
  ],
}

export const COLMEIA_PRODUCT = {
  title: 'Produto',
  subtitle: 'Três pilares — um ecossistema OOH',
  pillars: [
    {
      id: 'colmeia',
      name: 'Colmeia · Meus Roteiros',
      role: 'Produto principal · planejamento, simulação e operação de campanhas OOH',
      now: 'Em produção (3.500+ roteiros). Planner é o futuro da plataforma — evitar investir em features que ele substituirá.',
      future: 'Consome a Adaptive Layer™: inventário confiável, pricing, disponibilidade e status do roteiro ponta a ponta.',
    },
    {
      id: 'banco-ativos',
      name: 'Banco de Ativos',
      role: 'Camada fundacional · inventário, cadastro, media kit, doações e PM',
      now: 'Prioridade estratégica e incompleta: há inventário, faltam cadastrais, doações, PM e media kit unificado. Exibidores são o usuário mais frequente.',
      future: 'Fonte canônica do ativo OOH na Layer — alimenta planejamento, compra e pós-venda.',
    },
    {
      id: 'agentes',
      name: 'Agentes',
      role: 'Camada de decisão · 6 agentes especializados nas etapas da jornada',
      now: 'Parte do roadmap original: arquitetura, contratos e avaliações começam no M0; o primeiro piloto entra no M1.',
      future: 'Evoluem por etapa até operar a jornada completa sobre a Adaptive Layer™, com supervisão humana e rastreabilidade.',
    },
  ],
  personas: [
    { id: 'planejador', name: 'Planejador de mídia', need: 'Montar roteiro OOH com inventário confiável, cobertura/frequência e budget.' },
    { id: 'exibidor', name: 'Exibidor', need: 'Enviar e manter inventário/media kit sem fricção; ver status do funil.' },
    { id: 'admin', name: 'Admin Be180', need: 'Cadastrar agências, formatos, IPVs; governar qualidade do inventário.' },
    { id: 'agencia', name: 'Agência / marca', need: 'Briefing claro, proposta, PI/PM e comprovação pós-campanha.' },
  ],
  outcomes: [
    'Briefing estruturado na entrada (sem e-mail solto como verdade)',
    'Planejamento sobre inventário completo e metodologias validadas',
    'Compra PI/PM com disponibilidade e preço rastreáveis',
    'Roteiro validado com loop de ajuste com o cliente',
    'Pós-venda com comprovação e feedback de volta ao Banco de Ativos',
  ],
}

/** Adaptive Layer™ aplicada ao vertical Colmeia. */
export const COLMEIA_ADAPTIVE_LAYER = {
  title: 'Adaptive Layer™ · vertical Colmeia',
  tagline: 'A camada entre inventário, planner e agentes',
  description:
    'A Adaptive Layer™ é a infraestrutura operacional dos agentes. Ela liga Banco de Ativos, Colmeia, Image Brand Processing e APIs de exibidores; transforma mudanças em eventos; monta o contexto de cada tarefa; autoriza ferramentas; e registra decisões e resultados. Assim, os agentes deixam de apenas responder e passam a executar partes da jornada com controle.',
  connects: [
    'Colmeia · Meus Roteiros',
    'Banco de Ativos (inventário / media kit)',
    'Image Brand Processing',
    'APIs / funil de exibidores',
    'Dados de disponibilidade e preço',
    'Feedback e comprovação pós-venda',
  ],
  capabilities: [
    {
      id: 'integration',
      title: 'Integração & eventos',
      detail:
        'Publica o que importa: ativo criado/atualizado, media kit, doação, PM, PI, status de roteiro, comprovação e feedback.',
    },
    {
      id: 'data',
      title: 'Dados unificados',
      detail:
        'Linha do tempo do ativo e do roteiro — quem tocou, o que mudou, qual exceção. Sem planilha como fonte da verdade.',
    },
    {
      id: 'apis',
      title: 'APIs & automação',
      detail:
        'Planner, upload de inventário, calculadora e agentes consomem contratos comuns. Cada capacidade da Layer vira uma ferramenta segura para automação.',
    },
    {
      id: 'security',
      title: 'Segurança & isolamento',
      detail:
        'Logs por usuário, tenant isolation e guardrails — pré-condição para LLM/agentes (já no backlog de infraestrutura e no MVP RAG).',
    },
  ],
  unlocks: [
    'Inventário confiável para o planner (sem retrabalho de cadastro)',
    'Metodologia de cobertura/frequência sobre dados limpos',
    'PI/PM e preço com rastreabilidade',
    'Copiloto RAG com respostas grounded no inventário/roteiro',
    'Seis agentes OOH sem bases paralelas',
    'Feedback pós-venda enriquecendo o Banco de Ativos',
  ],
  formula: 'Roadmap único · infraestrutura + Adaptive Layer™ + agentes, evoluindo por dependência',
}

export const AGENT_ARCHITECTURE = {
  title: 'Por que a infraestrutura vem antes da autonomia',
  subtitle: 'Os agentes entram no roadmap desde o início; a autonomia aumenta conforme a base técnica fica pronta.',
  layers: [
    {
      id: 'agents',
      label: 'Agentes da jornada',
      detail: 'Briefing · planejamento · disponibilidade · preço/PI · validação · pós-venda',
      tone: 'violet',
    },
    {
      id: 'layer',
      label: 'Adaptive Layer™',
      detail: 'Contexto · eventos · memória operacional · ferramentas/APIs · orquestração · guardrails',
      tone: 'dark',
    },
    {
      id: 'infra',
      label: 'Infraestrutura confiável',
      detail: 'Identidade · tenant isolation · logs · observabilidade · filas · versionamento · segurança',
      tone: 'teal',
    },
    {
      id: 'systems',
      label: 'Sistemas e dados do Colmeia',
      detail: 'Banco de Ativos · planner · preços · disponibilidade · PI/PM · comprovação',
      tone: 'light',
    },
  ],
  reasons: [
    {
      title: 'Contexto correto',
      detail: 'O agente recebe a versão atual do ativo, roteiro, briefing e regras — não um recorte solto.',
    },
    {
      title: 'Ação controlada',
      detail: 'Cada ação usa uma ferramenta autorizada, com limites, validação humana e rollback quando necessário.',
    },
    {
      title: 'Rastreabilidade',
      detail: 'Entrada, decisão, ferramenta acionada e resultado ficam registrados para auditoria e melhoria.',
    },
  ],
  warning:
    'Sem essa base, agentes até geram respostas, mas não automatizam a operação com segurança: faltam contexto confiável, permissão para agir, controle de exceções e evidência do que foi feito.',
}

export interface JourneyStage {
  id: string
  number: string
  title: string
  goal: string
  activities: string[]
  outputs: string[]
  agentIds: string[]
  dataSources: string[]
}

/** Cinco etapas do Miro — jornada OOH. */
export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'entrada',
    number: '01',
    title: 'Entrada / Demanda',
    goal: 'Organizar a entrada de informações e estruturar o briefing da demanda.',
    activities: [
      'Receber demanda da agência (áudio, PDF, DOC, e-mail, reunião)',
      'Extrair e estruturar briefing (ID, agência, marca, objetivos, praças, período, budget, KPIs)',
      'Priorizar e abrir o ticket da demanda',
    ],
    outputs: ['Briefing estruturado', 'Perfil da demanda pronto para planejamento'],
    agentIds: ['a1'],
    dataSources: ['Banco de dados · Cliente / demanda', 'Banco de dados · Destinos / praças'],
  },
  {
    id: 'planejamento',
    number: '02',
    title: 'Planejamento',
    goal: 'Analisar e selecionar os melhores ativos do Banco de Ativos para compor o roteiro.',
    activities: [
      'Cruzar briefing com inventário OOH (painéis, mobiliário, transporte, indoor, digital)',
      'Aplicar cobertura, frequência, restrições e budget',
      'Gerar estrutura preliminar do roteiro no Colmeia',
    ],
    outputs: ['Estrutura preliminar do roteiro', 'Lista de ativos candidatos'],
    agentIds: ['a2'],
    dataSources: ['Banco de Ativos / Colmeia', 'Banco de dados · Destinos / praças'],
  },
  {
    id: 'compra',
    number: '03',
    title: 'Compra (PI = PM)',
    goal: 'Executar reservas e compras dos itens selecionados com disponibilidade e preço.',
    activities: [
      'Checar disponibilidade e preço (APIs / bases)',
      'Formalizar PI / PM e alinhar fornecedores',
      'Confirmar compras e refletir status no roteiro',
    ],
    outputs: ['Compras confirmadas', 'PI/PM rastreados no fluxo'],
    agentIds: ['a3', 'a4'],
    dataSources: ['Banco de dados · Disponibilidade', 'Banco de dados · Preços'],
  },
  {
    id: 'validacao',
    number: '04',
    title: 'Validação de Roteiro',
    goal: 'Consolidar e revisar o roteiro detalhado com loop de ajuste junto ao cliente.',
    activities: [
      'Consolidar itens planejados e comprados',
      'QA de coerência (praças, período, KPIs, budget)',
      'Feedback loop com agência/marca até aceite',
    ],
    outputs: ['Roteiro final pronto para operação', 'Aceite do cliente'],
    agentIds: ['a5'],
    dataSources: ['Colmeia / Banco de Ativos', 'Banco de dados · Cliente'],
  },
  {
    id: 'pos-venda',
    number: '05',
    title: 'Pós-venda',
    goal: 'Monitorar a campanha, comprovar entrega e devolver aprendizado ao inventário.',
    activities: [
      'Coletar comprovação (fotos, evidências)',
      'Acompanhar SLA e resolver exceções',
      'Registrar feedback e enriquecer o Banco de Ativos',
    ],
    outputs: ['Comprovação e ROI operacional', 'Feedback no Banco de Ativos'],
    agentIds: ['a6'],
    dataSources: ['Banco de dados · Feedback', 'Colmeia / Banco de Ativos'],
  },
]

/** Board redesenhado do Miro: jornada + agentes sobre Adaptive Layer™ e dados. */
export const JOURNEY_BOARD = {
  layerLabel: 'Adaptive Layer™',
  layerDetail: 'Contexto · eventos · ferramentas/APIs · orquestração · guardrails · memória',
  infraLabel: 'Infraestrutura confiável',
  infraDetail: 'Identidade · tenant isolation · logs · observabilidade · filas · versionamento',
  caption:
    'Releitura do board do Miro: a jornada no topo, cada etapa com seu agente, todos operando sobre a Adaptive Layer™ e a mesma base de dados e sistemas.',
  systems: [
    { id: 'colmeia', label: 'Colmeia · Meus Roteiros', kind: 'product' as const },
    { id: 'banco', label: 'Banco de Ativos', kind: 'product' as const },
    { id: 'image', label: 'Image Brand Processing', kind: 'product' as const },
    { id: 'cliente', label: 'BD · Cliente / Demanda', kind: 'data' as const },
    { id: 'destinos', label: 'BD · Destinos / Praças', kind: 'data' as const },
    { id: 'disponibilidade', label: 'BD · Disponibilidade', kind: 'data' as const },
    { id: 'precos', label: 'BD · Preços', kind: 'data' as const },
    { id: 'feedback', label: 'BD · Feedback', kind: 'data' as const },
  ],
}

export interface ColmeiaAgent {
  id: string
  name: string
  stageIds: string[]
  role: string
  example: string
  phase: 'M1' | 'M2' | 'M3' | 'M4'
}

export const COLMEIA_AGENTS: ColmeiaAgent[] = [
  {
    id: 'a1',
    name: 'Agente 1 · Demanda & Briefing',
    stageIds: ['entrada'],
    role: 'Estrutura a entrada (áudio/PDF/DOC), monta o briefing e prioriza a demanda.',
    example: '“Transforme este PDF da agência em briefing com praças, período, budget e KPIs.”',
    phase: 'M1',
  },
  {
    id: 'a2',
    name: 'Agente 2 · Planejamento de Inventário',
    stageIds: ['planejamento'],
    role: 'Seleciona ativos no Banco de Ativos/Colmeia alinhados ao briefing e à metodologia.',
    example: '“Monte um shortlist de mobiliário urbano em SP com cobertura X e budget Y.”',
    phase: 'M2',
  },
  {
    id: 'a3',
    name: 'Agente 3 · Disponibilidade',
    stageIds: ['compra'],
    role: 'Consulta disponibilidade em tempo (quase) real e sinaliza risco de ruptura de inventário.',
    example: '“Quais painéis do shortlist estão indisponíveis na janela da campanha?”',
    phase: 'M3',
  },
  {
    id: 'a4',
    name: 'Agente 4 · Preço & PI/PM',
    stageIds: ['compra'],
    role: 'Cruza preço, histórico e formalização PI/PM; alerta desvio de budget.',
    example: '“Gere o PI deste pacote e mostre o gap vs. budget do briefing.”',
    phase: 'M3',
  },
  {
    id: 'a5',
    name: 'Agente 5 · Validação de Roteiro',
    stageIds: ['validacao'],
    role: 'Consolida o roteiro, aponta inconsistências e prepara o pacote para aceite do cliente.',
    example: '“Liste inconsistências de praça/período antes do envio para a agência.”',
    phase: 'M4',
  },
  {
    id: 'a6',
    name: 'Agente 6 · Pós-venda & Feedback',
    stageIds: ['pos-venda'],
    role: 'Monitora comprovação, aciona exceções e devolve feedback ao Banco de Ativos.',
    example: '“Quais faces ainda sem foto de comprovação e qual exibidor acionar?”',
    phase: 'M4',
  },
]

export const AGENT_LOOP_COLMEIA = [
  { id: 'sense', title: 'Observa', detail: 'Eventos chegam pela Adaptive Layer™ (inventário, briefing, PI, comprovação).' },
  { id: 'detect', title: 'Detecta', detail: 'Compara com o fluxo esperado da etapa e identifica gap ou risco.' },
  { id: 'decide', title: 'Decide', detail: 'Avalia impacto (cobertura, budget, SLA) e escolhe a próxima ação.' },
  { id: 'act', title: 'Age', detail: 'Executa ou encaminha ao responsável — com contexto, não com “veja o relatório”.' },
  { id: 'learn', title: 'Registra', detail: 'Devolve o resultado à Layer: histórico que melhora o próximo planejamento.' },
]

/** Protótipos de UX das telas que operam os agentes. */
export const AGENT_SCREENS = {
  title: 'Telas de operação dos agentes',
  subtitle: 'Dois protótipos: o admin que configura cada agente e o dashboard que acompanha a operação.',
  intro:
    'Agente em produção precisa de duas superfícies: uma para definir o que ele pode fazer e outra para acompanhar o que ele fez. Sem essas telas, autonomia se torna caixa-preta — e a operação não tem como aprovar, corrigir ou auditar.',
}

export const AGENT_ADMIN_SCREEN = {
  label: 'Protótipo 1 · Admin de Agentes',
  path: 'colmeia.be180.com.br/admin/agentes',
  caption:
    'Configuração por agente: nível de autonomia, ferramentas liberadas, contexto autorizado e guardrails — com teste em sandbox antes de publicar a versão.',
  nav: ['Agentes', 'Ferramentas', 'Guardrails', 'Fontes de dados', 'Avaliações', 'Versões', 'Logs'],
  agents: [
    { id: 'a1', name: 'Agente 1 · Briefing', status: 'Ativo' as const, selected: false },
    { id: 'a2', name: 'Agente 2 · Planejamento', status: 'Piloto' as const, selected: true },
    { id: 'a3', name: 'Agente 3 · Disponibilidade', status: 'Piloto' as const, selected: false },
    { id: 'a4', name: 'Agente 4 · Preço & PI/PM', status: 'Rascunho' as const, selected: false },
    { id: 'a5', name: 'Agente 5 · Validação', status: 'Rascunho' as const, selected: false },
    { id: 'a6', name: 'Agente 6 · Pós-venda', status: 'Rascunho' as const, selected: false },
  ],
  detail: {
    title: 'Agente 2 · Planejamento de Inventário',
    subtitle: 'Etapa 02 · monta o shortlist de ativos a partir do briefing e da metodologia',
    version: 'v3 em produção · v4 em rascunho',
    autonomy: [
      { label: 'Sugerir', detail: 'Apenas recomenda', active: false },
      { label: 'Executar com aprovação', detail: 'Age após revisão humana', active: true },
      { label: 'Executar', detail: 'Autonomia total na etapa', active: false },
    ],
    tools: [
      { name: 'buscar_inventario', scope: 'Banco de Ativos · leitura', on: true },
      { name: 'calcular_cobertura', scope: 'Metodologia · cálculo', on: true },
      { name: 'consultar_preco', scope: 'BD Preços · leitura', on: true },
      { name: 'reservar_ativo', scope: 'Colmeia · escrita', on: false },
      { name: 'notificar_exibidor', scope: 'E-mail · envio', on: false },
    ],
    context: ['Banco de Ativos', 'Briefing estruturado', 'Metodologia de cobertura', 'Histórico de roteiros'],
    guardrails: [
      'Budget máximo por roteiro: R$ 250.000',
      'Somente praças homologadas',
      'Aprovação humana antes de reservar ativo',
      'Máximo de 40 ativos por shortlist',
    ],
    evaluation: {
      label: 'Avaliação da v4 em sandbox',
      value: '87% de aderência ao shortlist humano · 120 casos',
    },
    actions: ['Testar no sandbox', 'Salvar rascunho', 'Publicar v4'],
  },
}

export const AGENT_DASHBOARD_SCREEN = {
  label: 'Protótipo 2 · Dashboard de Controle',
  path: 'colmeia.be180.com.br/agentes/controle',
  caption:
    'Operação em tempo real: volume e sucesso por agente, fila de aprovações humanas, custo, alertas e trilha de auditoria de cada decisão.',
  kpis: [
    { label: 'Execuções · 24h', value: '1.284', trend: '+18%' },
    { label: 'Taxa de sucesso', value: '94%', trend: '+2pp' },
    { label: 'Aprovações pendentes', value: '7', trend: 'fila' },
    { label: 'Custo · 24h', value: 'R$ 412', trend: '-6%' },
    { label: 'Tempo médio', value: '38s', trend: '-9s' },
  ],
  columns: ['Agente', 'Etapa', 'Execuções', 'Sucesso', 'Intervenção', 'Status'],
  rows: [
    { agent: 'Agente 1 · Briefing', stage: 'Entrada', runs: '412', success: '96%', human: '4%', status: 'Ativo' as const },
    { agent: 'Agente 2 · Planejamento', stage: 'Planejamento', runs: '386', success: '92%', human: '11%', status: 'Piloto' as const },
    { agent: 'Agente 3 · Disponibilidade', stage: 'Compra', runs: '295', success: '89%', human: '14%', status: 'Piloto' as const },
    { agent: 'Agente 4 · Preço & PI/PM', stage: 'Compra', runs: '138', success: '95%', human: '22%', status: 'Piloto' as const },
    { agent: 'Agente 5 · Validação', stage: 'Validação', runs: '38', success: '91%', human: '30%', status: 'Sandbox' as const },
    { agent: 'Agente 6 · Pós-venda', stage: 'Pós-venda', runs: '15', success: '87%', human: '35%', status: 'Sandbox' as const },
  ],
  approvals: [
    { agent: 'Agente 4', action: 'Emitir PI de R$ 312.000 — acima do limite', wait: 'há 6 min' },
    { agent: 'Agente 2', action: 'Reservar 18 ativos em praça não homologada', wait: 'há 14 min' },
    { agent: 'Agente 3', action: 'Substituir 4 faces indisponíveis no roteiro #8421', wait: 'há 27 min' },
  ],
  audit: [
    { time: '14:32', text: 'Agente 2 gerou shortlist de 24 ativos · roteiro #8433 · aprovado por Marta' },
    { time: '14:19', text: 'Agente 3 detectou 4 faces indisponíveis · encaminhado para aprovação' },
    { time: '13:58', text: 'Agente 1 estruturou briefing do PDF da agência · revisado por Ana' },
    { time: '13:41', text: 'Agente 4 sinalizou desvio de budget de 8% · PI retido' },
  ],
  alerts: [
    { level: 'alto' as const, text: 'API do exibidor Zeta fora do ar: 12 consultas de disponibilidade falharam' },
    { level: 'médio' as const, text: 'Agente 5 acima da meta de intervenção humana (30%) — revisar prompts da v2' },
  ],
}

export const AS_IS = {
  title: 'Estado atual (as-is)',
  subtitle: 'O que os repos e a sessão 04/08 mostram antes da Layer',
  repos: [
    {
      name: 'jrbj001/colmeia---meusroteirosdefault',
      label: 'Colmeia · Meus Roteiros',
      note:
        'Repo principal de produto. Entregas de Banco de Ativos são classificadas no relatório por regex em branch/título (mesmo repositório, produto separado).',
    },
    {
      name: 'jrbj001/image_brand_processing',
      label: 'Image Brand Processing',
      note: 'Pipeline de imagem/marca conectado ao ecossistema — satélite do Colmeia, sem subproduto configurado.',
    },
  ],
  gaps: [
    'Banco de Ativos incompleto: faltam dados cadastrais, doações e PM',
    'Materiais e especificações dispersos — proposta de tela de upload de media kit',
    'Cadastro admin de agências, formatos e IPVs ainda necessário',
    'Funil de inventário e dashboard de veículos em análise precisam evoluir',
    'Metodologias de cobertura/frequência a documentar e validar com líderes de mídia',
    'UX/onboarding de exibidores: redesign e personalização por perfil',
    'Casos de uso dos seis agentes já mapeados; faltam contratos de dados, ferramentas, guardrails e métricas de avaliação',
    'Infra: segurança, logs por usuário, APIs com exibidores, copiloto LLM no backlog',
  ],
  evidence: [
    'Estatísticas do workspace: 3.541 roteiros · 60 ativos (30d) · 8 projetos',
    'Esforço manual recente: migração para novo backend (80h, jun–jul/2026)',
    'Relatório de desenvolvimento Jan–Mai/2026: 11 épicos / 47 histórias (Notion)',
    'Projeto Banco de Ativos marcado como prioridade Alta e fundacional',
  ],
}

export interface WorkMilestone {
  id: string
  number: string
  title: string
  window: string
  focus: string
  deliverables: string[]
  acceptance: string[]
  owners: string[]
  includesAgents: boolean
}

export const WORK_PLAN: WorkMilestone[] = [
  {
    id: 'm0',
    number: 'M0',
    title: 'Arquitetura, diagnóstico & baseline',
    window: '2–3 semanas',
    focus: 'Fechar a arquitetura conjunta de produto, Layer e agentes; inventariar gaps e medir o baseline operacional.',
    deliverables: [
      'Mapa as-is dos módulos no GitHub (Colmeia + filtro Banco de Ativos)',
      'Backlog priorizado de gaps (cadastro, doações, PM, media kit, funil)',
      'Definição dos contratos mínimos da Adaptive Layer™ (eventos do ativo/roteiro)',
      'Blueprint dos 6 agentes: objetivo, contexto, ferramentas, guardrails e handoff humano',
      'Dataset inicial e critérios de avaliação por agente',
    ],
    acceptance: [
      'Lista de gaps com owner e prioridade aprovada pela Be180',
      'Contrato de eventos v0 documentado (ativo, media kit, PI, comprovação)',
      'Cada agente possui caso de uso, dependências e métrica de sucesso aprovados',
    ],
    owners: ['José Roberto', 'Tchelo', 'Be180 produto'],
    includesAgents: true,
  },
  {
    id: 'm1',
    number: 'M1',
    title: 'Banco de Ativos + Agente de Briefing',
    window: '6–10 semanas',
    focus: 'Completar a base que alimenta o planner e colocar o Agente 1 em piloto supervisionado.',
    deliverables: [
      'Upload de media kit e consolidação de especificações/PM',
      'Cadastro administrativo (agências, formatos, IPVs)',
      'Melhorias do funil de inventário e dashboard de veículos em análise',
      'Onboarding prático com exibidores para acelerar uploads',
      'Agente 1 estruturando briefing de PDF/áudio com revisão humana',
    ],
    acceptance: [
      'Exibidor consegue publicar inventário/media kit sem canal paralelo',
      'Admin opera cadastros críticos sem planilha',
      'Eventos de inventário publicados na Adaptive Layer™',
      'Briefing gerado pelo Agente 1 validado contra dataset de avaliação',
    ],
    owners: ['Ana · Be180', 'Marta', 'Mai Fernandes', 'Pixel engenharia'],
    includesAgents: true,
  },
  {
    id: 'm2',
    number: 'M2',
    title: 'Planner, metodologia + Agente de Planejamento',
    window: 'paralelo a M1 / seguinte',
    focus: 'Evoluir o planner, fechar metodologia e conectar o Agente 2 ao inventário confiável.',
    deliverables: [
      'Pendências Via Pública encerradas (Tchelo + JR)',
      'Metodologia cobertura/frequência documentada e validada com líderes de mídia',
      'Tendências de transporte público (Camila) no backlog do planner',
      'UX redesign + personalização por perfil; CPE na tela de resultados',
      'Adaptive Layer™ consumida pelo planner (inventário confiável)',
      'Agente 2 gerando shortlist explicado e revisável pelo planejador',
    ],
    acceptance: [
      'Cerimônia de metodologia realizada e decisões versionadas',
      'Planner usa inventário da Layer sem redigitação',
      'Critérios de cobertura/frequência auditáveis na UI',
      'Shortlist do Agente 2 comparado ao planejamento humano com métricas de qualidade',
    ],
    owners: ['Simone', 'Camila', 'Ana', 'Tchelo', 'José Roberto'],
    includesAgents: true,
  },
  {
    id: 'm3',
    number: 'M3',
    title: 'Layer operacional + Agentes de Compra',
    window: 'paralelo à consolidação de M1/M2',
    focus: 'Fechar a infraestrutura operacional e ativar os Agentes 3 e 4 sobre disponibilidade, preço e PI/PM.',
    deliverables: [
      'Isolamento por tenant, logs por usuário e guardrails',
      'Roadmap de APIs com exibidores',
      'MVP Colmeia AI (RAG) grounded em inventário/roteiro',
      'Reset de senha de exibidores pelo admin',
      'Agentes 3 e 4 consultando disponibilidade, validando budget e preparando PI',
    ],
    acceptance: [
      'Copiloto responde com fontes do inventário/roteiro',
      'Logs e isolamento validados em ambiente de staging',
      'Toda ação dos agentes registra contexto, ferramenta, decisão e resultado',
    ],
    owners: ['João', 'Pedro', 'Pixel + Be180 TI'],
    includesAgents: true,
  },
  {
    id: 'm4',
    number: 'M4',
    title: 'Orquestração ponta a ponta',
    window: 'após pilotos M1–M3',
    focus: 'Ativar os Agentes 5 e 6 e orquestrar os seis agentes na jornada completa.',
    deliverables: [
      'Agentes 5–6 (validação + pós-venda/feedback)',
      'Orquestração e handoffs entre os seis agentes',
      'Painel de avaliação, custos, falhas e intervenções humanas',
      'Loop Observa→Registra auditável na Layer',
    ],
    acceptance: [
      'Cada agente opera só com eventos da Layer (sem base paralela)',
      'Jornada piloto com métricas de tempo, qualidade, custo e taxa de intervenção humana',
    ],
    owners: ['Pixel engenharia', 'Be180 produto', 'Be180 operação'],
    includesAgents: true,
  },
]

export interface UserStory {
  id: string
  stageId: string | 'foundation' | 'layer'
  persona: string
  want: string
  soThat: string
  acceptance: string[]
  phase: 'M1' | 'M2' | 'M3' | 'M4'
}

export const USER_STORIES: UserStory[] = [
  {
    id: 'us-f1',
    stageId: 'foundation',
    persona: 'Exibidor',
    want: 'enviar inventário e media kit por uma tela única',
    soThat: 'não dependo de e-mail e planilha para atualizar meus ativos',
    acceptance: ['Upload com status no funil', 'Especificações/PM anexáveis', 'Confirmação visível no admin'],
    phase: 'M1',
  },
  {
    id: 'us-f2',
    stageId: 'foundation',
    persona: 'Admin Be180',
    want: 'cadastrar agências, formatos e IPVs no sistema',
    soThat: 'o inventário e o planner usam cadastros oficiais',
    acceptance: ['CRUD admin', 'Validações mínimas', 'Evento publicado na Layer'],
    phase: 'M1',
  },
  {
    id: 'us-f3',
    stageId: 'foundation',
    persona: 'Admin Be180',
    want: 'ver veículos em análise no dashboard',
    soThat: 'acelero a liberação do inventário',
    acceptance: ['Fila visível', 'Filtros por status', 'Ação de aprovar/devolver'],
    phase: 'M1',
  },
  {
    id: 'us-p1',
    stageId: 'planejamento',
    persona: 'Planejador de mídia',
    want: 'que o Agente 2 monte um shortlist sobre o inventário confiável do Banco de Ativos',
    soThat: 'inicio o roteiro com opções explicadas sem revalidar cadastro manualmente',
    acceptance: ['Shortlist a partir da Layer', 'Critérios de seleção explicados', 'Revisão humana antes de aplicar'],
    phase: 'M2',
  },
  {
    id: 'us-p2',
    stageId: 'planejamento',
    persona: 'Planejador de mídia',
    want: 'ver cobertura e frequência com metodologia auditável',
    soThat: 'consigo defender o plano com líderes de mídia',
    acceptance: ['Memória de cálculo transparente', 'Deflator/sazonalidade documentados', 'Exportável'],
    phase: 'M2',
  },
  {
    id: 'us-p3',
    stageId: 'planejamento',
    persona: 'Planejador de mídia',
    want: 'ver CPE na tela de resultados',
    soThat: 'comparo eficiência entre opções do roteiro',
    acceptance: ['CPE calculado', 'Visível na UI de resultados'],
    phase: 'M2',
  },
  {
    id: 'us-l1',
    stageId: 'layer',
    persona: 'Planejador de mídia',
    want: 'perguntar ao copiloto sobre inventário e roteiro com fontes',
    soThat: 'reduzo tempo de busca em telas e planilhas',
    acceptance: ['Respostas grounded', 'Citação da fonte', 'Isolamento por tenant'],
    phase: 'M3',
  },
  {
    id: 'us-e1',
    stageId: 'entrada',
    persona: 'Planejador de mídia',
    want: 'que o Agente 1 estruture o briefing a partir de PDF/áudio',
    soThat: 'entro no planejamento com dados padronizados',
    acceptance: ['Campos obrigatórios preenchidos', 'Revisão humana antes de seguir', 'Evento na Layer'],
    phase: 'M1',
  },
  {
    id: 'us-c1',
    stageId: 'compra',
    persona: 'Planejador de mídia',
    want: 'que os Agentes 3 e 4 validem disponibilidade e preço antes do PI',
    soThat: 'evito proposta inviável para a agência',
    acceptance: ['Alertas de indisponibilidade', 'Gap de budget visível', 'PI rascunho gerado'],
    phase: 'M3',
  },
  {
    id: 'us-v1',
    stageId: 'validacao',
    persona: 'Agência / marca',
    want: 'receber um roteiro consolidado com inconsistências já filtradas',
    soThat: 'o ciclo de ajuste é curto e objetivo',
    acceptance: ['Checklist de QA', 'Histórico de versões', 'Aceite registrado'],
    phase: 'M4',
  },
  {
    id: 'us-s1',
    stageId: 'pos-venda',
    persona: 'Admin Be180',
    want: 'que o Agente 6 cobre comprovação e devolva feedback ao inventário',
    soThat: 'o Banco de Ativos melhora a cada campanha',
    acceptance: ['Pendências de foto listadas', 'Owner acionado', 'Feedback escrito no ativo'],
    phase: 'M4',
  },
]

export const WORKING_GROUPS = [
  {
    id: 'produto',
    title: 'Produto & metodologia',
    members: ['Simone', 'Camila', 'Ana · Be180'],
    focus: 'Metodologia, tendências Via Pública, UX/onboarding, manuais',
  },
  {
    id: 'ativos',
    title: 'Banco de Ativos & dados',
    members: ['Marta', 'Mai Fernandes', 'Exibidores (usuários-chave)'],
    focus: 'Inventário, PM, media kit, cadastros, qualidade de dados',
  },
  {
    id: 'engenharia',
    title: 'Engenharia & Adaptive Layer™',
    members: ['José Roberto', 'Tchelo', 'João', 'Pedro'],
    focus: 'Repos Colmeia, Layer, APIs, segurança, MVP RAG, Via Pública',
  },
  {
    id: 'negocios',
    title: 'Negócios & operação',
    members: ['Time Be180', 'Líderes de mídia'],
    focus: 'Priorização, cerimônia de metodologia, aceite de fases',
  },
]
