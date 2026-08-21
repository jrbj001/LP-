// Estudo técnico-executivo — arquitetura atual e evolução com Adaptive Layer™.
// O conteúdo separa evidência observável neste workspace de hipóteses que ainda
// precisam ser validadas nos repositórios privados do produto Like:Me.

export const LIKEME_ARCHITECTURE_META = {
  id: 'likeme-arquitetura-adaptive-layer',
  title: 'Arquitetura do Produto · Adaptive Layer™ & Agentes',
  client: 'Like:Me',
  date: '21/08/2026',
  path: '/arquitetura-de-agentes',
  sources: [
    'Workspace Like:Me · projetos, documentos e reuniões (jun–ago/2026)',
    'Piloto Tabia Health · arquitetura de integração',
    'Migração Social Plus in-house · arquitetura',
    'Repos referenciados · LP-LikeMe, likeme-front-end e likeme-back-end',
  ],
}

export const LIKEME_INTRO = {
  eyebrow: 'Estudo técnico-executivo',
  title: 'Do produto integrado por APIs a uma plataforma operada por contexto, eventos e agentes',
  lead:
    'A proposta preserva o app, o backend e os parceiros atuais. A Adaptive Layer™ entra entre esses sistemas e os agentes para unificar contexto, controlar ações e tornar cada decisão observável.',
  notes: [
    'Este workspace confirma a separação em Landing, App Frontend e Backend/API, além das integrações registradas nas reuniões e documentos.',
    'O código dos três produtos vive em repositórios externos. Como o conteúdo privado não estava acessível durante este levantamento, detalhes internos de runtime, banco e contratos são tratados como pontos de validação — não como fatos.',
    'Estado real da IA: o copiloto de PM e o pipeline documentos → arquitetura/backlog são executáveis neste workspace. A Adaptive Layer operacional e os agentes de domínio descritos abaixo ainda são arquitetura-alvo, não runtime em produção neste repositório.',
  ],
}

export const EVIDENCE_LEVELS = [
  {
    id: 'confirmed',
    label: 'Confirmado',
    detail: 'Observável no código deste workspace ou no cadastro oficial do cliente.',
  },
  {
    id: 'documented',
    label: 'Documentado',
    detail: 'Registrado em atas e estudos do Like:Me; precisa ser conferido no produto.',
  },
  {
    id: 'proposed',
    label: 'Proposto',
    detail: 'Arquitetura-alvo recomendada para a Adaptive Layer™ e os agentes.',
  },
] as const

export const CURRENT_ARCHITECTURE = {
  title: 'Arquitetura atual · visão consolidada',
  subtitle: 'O que já existe ou está documentado hoje',
  layers: [
    {
      id: 'channels',
      label: 'Canais & experiência',
      status: 'confirmed' as const,
      items: [
        'Landing pública · aquisição e newsletter',
        'App autenticado · marketplace, comunidade e jornadas de saúde',
        'WhatsApp, push e e-mail como canais de relacionamento',
      ],
    },
    {
      id: 'product',
      label: 'Produto Like:Me',
      status: 'documented' as const,
      items: [
        'Backend/API como núcleo de autenticação, domínio e integrações',
        'Assinatura, pagamentos, afiliados, vouchers e perfis',
        'Conteúdo, eventos, comunidade e programas de saúde',
      ],
    },
    {
      id: 'partners',
      label: 'Plataformas conectadas',
      status: 'documented' as const,
      items: [
        'Auth0 · identidade',
        'Pagar.me · cobrança e recorrência',
        'Social Plus / Amity · comunidade em migração',
        'Tabia Health · care pathways',
        'Panda · vídeo e conteúdo',
        'SendGrid, WhatsApp/Twilio e push · comunicação',
      ],
    },
    {
      id: 'delivery',
      label: 'Engenharia & operação',
      status: 'confirmed' as const,
      items: [
        'Três repositórios: landing, frontend e backend',
        'Backlog, documentos e reuniões no workspace PixelPulseLab',
        'Entregas e grounding técnico via GitHub',
      ],
    },
  ],
  strengths: [
    'Separação explícita entre experiência, API e landing',
    'Ecossistema de parceiros cobre identidade, pagamento, cuidado, comunidade e comunicação',
    'Produto já opera múltiplas jornadas e canais',
  ],
  gaps: [
    'Contexto do usuário fragmentado entre produto e parceiros',
    'Exceções de cobrança e integrações ainda exigem acompanhamento manual',
    'Eventos, contratos e ownership entre sistemas precisam de catálogo único',
    'Migração da comunidade e integração Tabia aumentam a superfície operacional',
    'Não há evidência, neste workspace, de trilha unificada de decisão, avaliação de agentes ou guardrails',
    'Adaptive Layer e agentes operacionais ainda não possuem runtime implementado neste repositório',
  ],
}

export const TARGET_ARCHITECTURE = {
  title: 'Arquitetura-alvo · Like:Me com Adaptive Layer™',
  subtitle: 'Uma camada de operação entre canais, agentes e sistemas existentes',
  layers: [
    {
      id: 'experience',
      label: 'Experiências',
      detail: 'App · web · WhatsApp · push · e-mail · operação interna',
    },
    {
      id: 'agents',
      label: 'Squad de agentes',
      detail: 'Jornada de cuidado · engajamento · assinatura · comunidade · operações',
    },
    {
      id: 'adaptive',
      label: 'Adaptive Layer™',
      detail:
        'Contexto 360 · eventos · políticas e consentimento · ferramentas · orquestração · memória auditável · avaliações',
    },
    {
      id: 'systems',
      label: 'Produto & parceiros',
      detail: 'Backend Like:Me · Auth0 · Pagar.me · Tabia · comunidade · Panda · comunicação',
    },
    {
      id: 'foundation',
      label: 'Fundação confiável',
      detail: 'Identidade · dados · filas · observabilidade · segurança · LGPD · versionamento',
    },
  ],
  capabilities: [
    {
      title: 'Event Gateway',
      detail: 'Normaliza eventos como assinatura ativa, falha de cobrança, entrada em programa, conteúdo concluído e risco de churn.',
    },
    {
      title: 'Contexto 360',
      detail: 'Monta uma visão autorizada da jornada sem transformar o LLM em nova fonte da verdade.',
    },
    {
      title: 'Tool Registry',
      detail: 'Expõe ações permitidas como consultar assinatura, enviar mensagem, criar tarefa ou acionar atendimento.',
    },
    {
      title: 'Policy Engine',
      detail: 'Aplica consentimento, escopo, limites financeiros, aprovação humana e regras de saúde antes de agir.',
    },
    {
      title: 'Orquestração',
      detail: 'Coordena agentes, retries, filas, idempotência e handoffs para pessoas ou sistemas.',
    },
    {
      title: 'Memória & auditoria',
      detail: 'Registra contexto, decisão, ferramenta, resultado, custo e feedback para investigação e melhoria.',
    },
  ],
}

export const LIKEME_AGENTS = [
  {
    id: 'journey',
    code: 'A1',
    short: 'Jornada de Cuidado',
    name: 'Agente de Jornada de Cuidado',
    role: 'Acompanha a entrada e a progressão em programas, orienta próximos passos e identifica gaps de adesão.',
    triggers: ['Assinatura ativa', 'Entrada no programa', 'Etapa não concluída'],
    actions: ['Explicar próximo passo', 'Lembrar atividade', 'Encaminhar para atendimento'],
    guardrail: 'Não diagnostica nem altera conduta clínica; escalona sinais sensíveis.',
    primaryStages: ['onboarding', 'cuidado'],
    supportStages: ['retencao'],
  },
  {
    id: 'engagement',
    code: 'A2',
    short: 'Engajamento',
    name: 'Agente de Engajamento',
    role: 'Seleciona conteúdo, evento e canal adequados ao contexto e à preferência do usuário.',
    triggers: ['Baixa atividade', 'Novo conteúdo', 'Evento relevante'],
    actions: ['Recomendar conteúdo', 'Programar comunicação', 'Testar próxima melhor ação'],
    guardrail: 'Respeita consentimento, frequência e opt-out por canal.',
    primaryStages: ['conteudo', 'retencao'],
    supportStages: ['descoberta', 'cuidado'],
  },
  {
    id: 'subscription',
    code: 'A3',
    short: 'Assinatura & Pagamentos',
    name: 'Agente de Assinatura & Pagamentos',
    role: 'Detecta falhas de cobrança, explica pendências e conduz recuperação sem decisões financeiras opacas.',
    triggers: ['Pagamento recusado', 'Recorrência interrompida', 'Cancelamento solicitado'],
    actions: ['Consultar status', 'Abrir régua de recuperação', 'Acionar atendimento'],
    guardrail: 'Cobrança, estorno e mudança contratual exigem política explícita e, quando necessário, aprovação humana.',
    primaryStages: ['assinatura'],
    supportStages: ['retencao'],
  },
  {
    id: 'community',
    code: 'A4',
    short: 'Comunidade',
    name: 'Agente de Comunidade',
    role: 'Apoia onboarding, descoberta e moderação durante e depois da migração Social Plus/Amity.',
    triggers: ['Primeiro acesso', 'Post sinalizado', 'Comunidade sem atividade'],
    actions: ['Guiar onboarding', 'Recomendar comunidade', 'Priorizar moderação'],
    guardrail: 'Não publica nem pune autonomamente em casos ambíguos; preserva histórico e recurso.',
    primaryStages: ['conteudo'],
    supportStages: ['onboarding', 'retencao'],
  },
  {
    id: 'orchestrator',
    code: 'A5',
    short: 'Orquestrador',
    name: 'Orquestrador Like:Me',
    role: 'Mantém a jornada ponta a ponta, identifica handoffs quebrados e direciona cada exceção ao agente ou time correto.',
    triggers: ['SLA vencido', 'Evento sem consumidor', 'Conflito entre jornadas'],
    actions: ['Correlacionar eventos', 'Abrir tarefa', 'Escalar exceção', 'Consolidar status'],
    guardrail: 'Coordena; não contorna políticas dos agentes especializados.',
    primaryStages: ['descoberta', 'assinatura', 'onboarding', 'cuidado', 'conteudo', 'retencao'],
  },
]

/** Board da jornada: etapas no topo, agentes por etapa, Layer e sistemas embaixo. */
export const AGENT_MAP = {
  title: 'Mapa de agentes na jornada Like:Me',
  subtitle: 'Quem atua em cada etapa, sobre a mesma camada e as mesmas fontes',
  caption:
    'O orquestrador cobre a jornada inteira. Cada agente especializado é dono das exceções da sua etapa e apoia as vizinhas, sempre consumindo eventos e ferramentas da Adaptive Layer™ — nunca bases paralelas.',
  layerLabel: 'Adaptive Layer™',
  layerDetail: 'Eventos · contexto autorizado · políticas · ferramentas · orquestração · auditoria',
  foundationLabel: 'Fundação confiável',
  foundationDetail: 'Identidade · dados · filas · observabilidade · segurança · LGPD',
  stages: [
    {
      id: 'descoberta',
      number: '01',
      title: 'Descoberta & cadastro',
      goal: 'Transformar interesse em conta ativa com dados mínimos e consentimento claro.',
    },
    {
      id: 'assinatura',
      number: '02',
      title: 'Assinatura & pagamento',
      goal: 'Converter e manter a cobrança saudável, com pendência explicada.',
    },
    {
      id: 'onboarding',
      number: '03',
      title: 'Onboarding & programa',
      goal: 'Levar o usuário ao primeiro valor do programa escolhido.',
    },
    {
      id: 'cuidado',
      number: '04',
      title: 'Jornada de cuidado',
      goal: 'Sustentar adesão e sinalizar desvios com apoio humano no ciclo.',
    },
    {
      id: 'conteudo',
      number: '05',
      title: 'Comunidade & conteúdo',
      goal: 'Gerar pertencimento com curadoria, eventos e moderação.',
    },
    {
      id: 'retencao',
      number: '06',
      title: 'Retenção & recompra',
      goal: 'Antecipar churn e devolver a próxima melhor ação ao time.',
    },
  ],
  systems: [
    { id: 'backend', label: 'Backend Like:Me', kind: 'product' as const },
    { id: 'app', label: 'App & Landing', kind: 'product' as const },
    { id: 'auth0', label: 'Auth0', kind: 'partner' as const },
    { id: 'pagarme', label: 'Pagar.me', kind: 'partner' as const },
    { id: 'tabia', label: 'Tabia Health', kind: 'partner' as const },
    { id: 'community', label: 'Social Plus / Amity', kind: 'partner' as const },
    { id: 'panda', label: 'Panda', kind: 'partner' as const },
    { id: 'messaging', label: 'SendGrid · WhatsApp · Push', kind: 'channel' as const },
  ],
}

export const AGENT_LOOP = [
  { title: 'Observa', detail: 'Recebe um evento confiável da Adaptive Layer™.' },
  { title: 'Contextualiza', detail: 'Busca apenas os dados autorizados para aquela tarefa.' },
  { title: 'Decide', detail: 'Avalia política, risco e próxima melhor ação.' },
  { title: 'Age', detail: 'Usa ferramenta limitada ou solicita aprovação humana.' },
  { title: 'Registra', detail: 'Grava decisão, resultado e feedback na trilha auditável.' },
]

export const GUARDRAILS = [
  {
    title: 'Saúde',
    items: ['Sem diagnóstico ou prescrição', 'Conteúdo clínico versionado', 'Escalonamento humano para risco'],
  },
  {
    title: 'LGPD & identidade',
    items: ['Consentimento por finalidade', 'Minimização de contexto', 'Isolamento e trilha por usuário'],
  },
  {
    title: 'Ações',
    items: ['Ferramentas allowlisted', 'Idempotência e limites', 'Aprovação para ações irreversíveis'],
  },
  {
    title: 'Qualidade',
    items: ['Dataset de avaliação', 'Versão de prompt/modelo', 'Métricas de erro, custo e intervenção'],
  },
]

export const ROADMAP = [
  {
    id: 'm0',
    label: 'M0',
    title: 'Descoberta & contratos',
    window: '2–3 semanas',
    deliverables: [
      'Validar os diagramas com os repos privados e donos de domínio',
      'Catálogo de eventos, APIs, dados sensíveis e owners',
      'Baseline de cobrança, engajamento, comunidade e atendimento',
      'Blueprint dos agentes e matriz de risco',
    ],
    exit: 'Arquitetura as-is assinada e primeiro caso de uso escolhido por impacto e risco.',
  },
  {
    id: 'm1',
    label: 'M1',
    title: 'Fundação da Adaptive Layer™',
    window: '4–6 semanas',
    deliverables: [
      'Event Gateway e contratos versionados',
      'Identidade, consentimento e contexto mínimo',
      'Tool Registry com leitura e ações reversíveis',
      'Logs, tracing, custos e replay de eventos',
    ],
    exit: 'Um fluxo real é observável ponta a ponta sem planilha ou consulta manual.',
  },
  {
    id: 'm2',
    label: 'M2',
    title: 'Primeiro agente supervisionado',
    window: '4–8 semanas',
    deliverables: [
      'Piloto de Engajamento ou Pagamentos em modo recomendar',
      'Fila de aprovação e handoff humano',
      'Avaliações offline e shadow mode',
      'Dashboard operacional do piloto',
    ],
    exit: 'Qualidade, segurança e ganho operacional superam o baseline acordado.',
  },
  {
    id: 'm3',
    label: 'M3',
    title: 'Squad & orquestração',
    window: 'evolução contínua',
    deliverables: [
      'Jornada, comunidade e assinatura sobre a mesma Layer',
      'Orquestrador e tratamento de exceções',
      'Autonomia progressiva por ferramenta',
      'Governança de versões, avaliações e incidentes',
    ],
    exit: 'Agentes compartilham eventos e políticas sem criar bases ou automações paralelas.',
  },
]

export const VALIDATION_QUESTIONS = [
  'Qual é o runtime, banco e modelo de deploy atuais do frontend e backend?',
  'Quais domínios são fonte da verdade para perfil, assinatura, jornada, conteúdo e comunidade?',
  'Quais webhooks/eventos já existem em Auth0, Pagar.me, Tabia e Social Plus/Amity?',
  'Onde consentimentos e preferências de comunicação são armazenados e auditados?',
  'Quais ações podem ser automatizadas, quais exigem aprovação e quais são proibidas?',
  'Qual caso de uso oferece maior impacto mensurável com menor risco para o primeiro piloto?',
]
