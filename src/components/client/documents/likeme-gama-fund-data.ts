export const GAMA_META = {
  id: 'likeme-evolucao-gama-fund',
  title: 'Like:Me × Gama Fund',
  client: 'Like:Me',
  date: '29/08/2026',
  path: '/evolucao-gama-fund',
  sourceUrl: 'https://gamafund.com/',
  sources: [
    'Gama Fund · critérios e benefícios públicos do programa 2026',
    'Workspace Like:Me · projetos, documentos e reuniões',
    'Arquitetura do Produto · Adaptive Layer™ & Agentes',
    'Piloto Tabia Health · arquitetura de integração',
  ],
}

export const GAMA_INTRO = {
  eyebrow: 'Estratégia de produto · AI-native',
  title: 'Do wellness amplo a uma jornada GLP-1 coordenada por IA',
  lead:
    'Hoje, o Like:Me reúne canais, conteúdo, comunidade e serviços. A evolução proposta usa esses ativos para coordenar adesão a programas GLP-1: eventos autorizados formam o contexto, Gemini recomenda uma ação permitida e o profissional supervisiona o cuidado.',
  recommendation:
    'Começar com clínicas e operadores de programas supervisionados como compradores B2B2C, medindo adesão e carga operacional.',
  boundary:
    'A IA coordena adesão, educação e handoffs. Não diagnostica, não prescreve e não substitui o profissional de saúde.',
}

export const EVIDENCE_LEVELS = [
  {
    id: 'confirmed',
    label: 'Confirmado',
    detail: 'Observável neste workspace ou no material oficial do programa.',
  },
  {
    id: 'documented',
    label: 'Documentado',
    detail: 'Registrado em materiais do Like:Me; requer validação no produto.',
  },
  {
    id: 'proposed',
    label: 'Proposto',
    detail: 'Direção recomendada; ainda não deve ser apresentada como entregue.',
  },
] as const

export const PROGRAM = {
  title: 'O que o Gama Fund procura',
  subtitle: 'Leitura objetiva dos critérios públicos do programa',
  deadline: 'Inscrições prorrogadas até 28 de setembro de 2026',
  criteria: [
    {
      title: 'Founder brasileiro',
      detail: 'Empreendedores construindo do Brasil para o mundo.',
      fit: 'validate',
      fitLabel: 'Validar',
      evidence: 'documented',
    },
    {
      title: 'Pre-seed ou seed',
      detail: 'O programa declara elegibilidade para empresas em estágio pre-seed ou seed.',
      fit: 'validate',
      fitLabel: 'Validar',
      evidence: 'documented',
    },
    {
      title: 'IA estrutural ao produto',
      detail: 'O valor principal precisa depender de IA — não de um chatbot acessório.',
      fit: 'gap',
      fitLabel: 'Gap principal',
      evidence: 'confirmed',
    },
    {
      title: 'Google fit real',
      detail: 'A solução deve usar ao menos um modelo do ecossistema Google; outros provedores são permitidos.',
      fit: 'gap',
      fitLabel: 'Não evidenciado',
      evidence: 'confirmed',
    },
    {
      title: 'Ambição global',
      detail: 'A tese precisa mostrar expansão além de um serviço local de wellness.',
      fit: 'validate',
      fitLabel: 'Construir tese',
      evidence: 'proposed',
    },
  ],
  benefits: [
    'Coinvestimento anunciado de até US$ 2 milhões',
    'Até US$ 350 mil em créditos Google Cloud e Gemini',
    'Acesso ao time Google DeepMind e suporte técnico',
    'Mentoria de produto, fundraising, talento e expansão comercial',
  ],
}

export const CURRENT_STATE = {
  title: 'Ponto de partida do Like:Me',
  subtitle: 'Ativos reais para preservar — e gaps que a candidatura precisa fechar',
  assets: [
    {
      title: 'Produto e distribuição',
      detail: 'App, landing, comunidade, conteúdo, marketplace e canais de relacionamento.',
      evidence: 'confirmed',
    },
    {
      title: 'Backend e integrações',
      detail: 'Autenticação, pagamentos, assinatura, Tabia, vídeo, e-mail, push e WhatsApp.',
      evidence: 'documented',
    },
    {
      title: 'Jornadas de saúde',
      detail: 'Programas e integração com care pathways já aparecem no roadmap do produto.',
      evidence: 'documented',
    },
    {
      title: 'Arquitetura-alvo',
      detail: 'Adaptive Layer, contexto 360, eventos, políticas, agentes e avaliações já foram desenhados.',
      evidence: 'documented',
    },
  ],
  gaps: [
    'O produto ainda pode operar como marketplace/comunidade sem IA; portanto, a IA não está demonstrada como estrutural.',
    'Não há integração Google AI observável neste workspace.',
    'O posicionamento amplo de “tudo para o bem-estar” dilui usuário, dor e resultado prioritários.',
    'Não há métricas verificadas de retenção, receita, adesão clínica ou ganho operacional no material analisado.',
    'Adaptive Layer, agentes, guardrails e avaliações ainda aparecem como arquitetura-alvo, não como runtime comprovado.',
  ],
}

export const PIVOT = {
  title: 'A tese de evolução',
  from: {
    label: 'Hoje',
    title: 'Ecossistema amplo de bem-estar',
    detail: 'Conteúdo, comunidade, profissionais, shop e serviços reunidos numa mesma experiência.',
  },
  to: {
    label: 'Direção AI-native',
    title: 'Jornada GLP-1 coordenada por IA',
    detail:
      'Eventos autorizados e protocolos aprovados orientam lembretes, conteúdo, agendamento e escalonamento sob supervisão.',
  },
  whyGlp1: [
    'A adesão é longitudinal: check-ins, conteúdo, acompanhamento e suporte acontecem toda semana.',
    'Abandono, baixa persistência e efeitos reportados exigem detecção e handoff — não resposta clínica automática.',
    'Ativos próximos: conteúdo, profissionais, comunicação, comunidade e integração Tabia.',
    'Comprador inicial recomendado: clínicas e operadores de programas supervisionados.',
    'Valor sem invadir ato clínico: coordenação, educação, suporte e handoff humano.',
  ],
}

export const AI_LOOP = {
  title: 'O loop que torna a IA estrutural',
  subtitle: 'Sem esse ciclo, o Like:Me continua sendo um marketplace com IA acoplada',
  steps: [
    {
      n: '01',
      title: 'Observar',
      detail: 'Eventos autorizados do app, jornada, conteúdo, comunicação e parceiros.',
    },
    {
      n: '02',
      title: 'Contextualizar',
      detail: 'A Adaptive Layer monta o contexto permitido, com identidade, consentimento e histórico.',
    },
    {
      n: '03',
      title: 'Decidir',
      detail: 'Gemini recomenda uma ação da allowlist com base em protocolo aprovado e saída estruturada.',
    },
    {
      n: '04',
      title: 'Supervisionar',
      detail: 'Regras limitam ações; casos sensíveis ou incertos escalam para o profissional.',
    },
    {
      n: '05',
      title: 'Executar',
      detail: 'O produto lembra, entrega conteúdo, agenda ou escala; dado sensível não segue por canal inadequado.',
    },
    {
      n: '06',
      title: 'Aprender',
      detail: 'Resultado e feedback entram nas avaliações e na próxima decisão.',
    },
  ],
}

export const GOOGLE_ARCHITECTURE = {
  title: 'Arquitetura AI-native com Google',
  subtitle: 'Arquitetura-alvo: Google como integração principal real — não como logo de candidatura',
  layers: [
    {
      id: 'experience',
      title: 'Experiências',
      detail: 'App · web · WhatsApp · push · console do profissional',
    },
    {
      id: 'runtime',
      title: 'Runtime de jornada',
      detail: 'Cloud Run · APIs · agentes · tool registry · aprovação humana',
    },
    {
      id: 'intelligence',
      title: 'Gemini via Vertex AI',
      detail: 'Structured output · tools em allowlist · RAG em corpus aprovado · avaliações',
    },
    {
      id: 'context',
      title: 'Adaptive Layer™',
      detail: 'Contexto autorizado · eventos · identidade · políticas · audit trail',
    },
    {
      id: 'foundation',
      title: 'Fundação Google Cloud',
      detail: 'Pub/Sub · BigQuery · Cloud Storage · IAM · KMS · Sensitive Data Protection',
    },
  ],
  principles: [
    'Gemini é o modelo principal da jornada; outros LLMs podem existir para fallback e comparação.',
    'O backend transacional continua fonte da verdade. O modelo não vira banco nem prontuário.',
    'Conteúdo usado em grounding precisa ser aprovado, versionado e rastreável.',
    'Ações permitidas: lembrar, entregar conteúdo aprovado, agendar e escalar. Dose, diagnóstico, prescrição e manejo clínico ficam fora da allowlist.',
    'Toda decisão registra contexto, modelo, versão, ferramenta, resultado e intervenção humana.',
    'Autonomia cresce somente depois de avaliações e começa por ações reversíveis e de baixo risco.',
    'Antes de dados reais: base legal e finalidade, RIPD, contrato de operador, região de processamento e política de não uso para treino.',
  ],
}

export const ROADMAP = [
  {
    phase: '0–30 dias',
    title: 'Candidatura e fundação',
    objective: 'Até 28/09: validar a tese e entregar evidência técnica honesta para a inscrição.',
    items: [
      'Escolher adesão GLP-1 como única jornada inicial e definir o ICP comprador.',
      'Entrevistar usuários, profissionais e potenciais parceiros B2B2C.',
      'Mapear eventos, consentimentos, fontes da verdade e ações permitidas.',
      'Implementar Gemini via Vertex AI em ambiente não produtivo.',
      'Criar golden set sintético e rubricas de qualidade e segurança.',
      'Garantir um design partner para o piloto.',
      'Enviar candidatura com demo técnica, arquitetura-alvo e gaps explicitados.',
    ],
    exit:
      'Candidatura enviada até 28/09, comprador e baseline definidos, Gemini executando avaliações offline.',
  },
  {
    phase: '31–60 dias',
    title: 'MVP supervisionado · pós-inscrição',
    objective: 'Fechar o loop ponta a ponta com aprovação humana.',
    items: [
      'Implementar Event Gateway, Contexto 360 mínimo e Tool Registry.',
      'Conectar app, backend, Tabia, conteúdo e um canal de comunicação.',
      'Gerar plano semanal e próxima melhor ação com Gemini.',
      'Operar em modo recomendação ou shadow, com revisão profissional.',
      'Auditar contexto, decisão, ferramenta, resultado e intervenção.',
      'Concluir base legal, RIPD, contratos e configuração regional antes de usar dados reais.',
      'Rodar uma coorte controlada com um ou dois parceiros.',
    ],
    exit:
      'Fluxo ponta a ponta funcional, segurança medida e utilidade reconhecida pelos profissionais.',
  },
  {
    phase: '61–90 dias',
    title: 'Evidência · pós-inscrição',
    objective: 'Demonstrar IA estrutural, resultado inicial e viabilidade comercial para as entrevistas.',
    items: [
      'Liberar autonomia apenas para ações reversíveis e de baixo risco.',
      'Comparar resultado com regra estática, baseline histórico ou grupo controle.',
      'Converter ao menos um piloto em contrato ou LOI qualificada.',
      'Medir custo de inferência e operação por usuário ativo.',
      'Produzir demo curta: evento → Gemini → ação → resultado.',
      'Consolidar deck, data room e narrativa de candidatura.',
    ],
    exit:
      'Google fit comprovado, IA em produção controlada e evidência inicial de resultado.',
  },
]

export const METRICS = {
  title: 'Como provar que o pivot funciona',
  northStar:
    'Percentual de semanas em que o participante conclui as ações acordadas no protocolo aprovado.',
  applicationMinimum: [
    'Até 28/09: demo Gemini no fluxo principal',
    'Design partner identificado',
    'Baseline de adesão definido',
    'Rubrica de segurança executada',
  ],
  groups: [
    {
      title: 'Produto',
      items: ['Ativação em 7 dias', 'Adesão semanal', 'Retenção D30/D60/D90', 'Tempo até primeiro valor'],
    },
    {
      title: 'IA',
      items: ['Aceitação profissional', 'Precisão de tools', 'Respostas grounded', 'Escalonamento humano'],
    },
    {
      title: 'Negócio',
      items: ['Piloto → contrato', 'Receita por jornada', 'Custo por usuário', 'Redução de operação manual'],
    },
    {
      title: 'Segurança',
      items: ['Incidentes críticos', 'Violações de política', 'Revogação de consentimento', 'Latência p95'],
    },
  ],
}

export const RISKS = [
  {
    title: 'Risco clínico',
    detail: 'Limitar a IA a educação, adesão e coordenação; diagnóstico e prescrição ficam com o profissional.',
  },
  {
    title: 'LGPD e finalidade',
    detail: 'Base legal do art. 11, finalidade, RIPD, minimização, retenção, revogação e contratos de operador.',
  },
  {
    title: 'Qualidade do modelo',
    detail: 'Grounding não elimina erro. Usar golden set, regressão, red teaming e escalonamento.',
  },
  {
    title: 'Escopo e runway',
    detail: 'Não construir marketplace, comunidade e múltiplos agentes ao mesmo tempo; provar uma jornada.',
  },
  {
    title: 'Dependência de parceiros',
    detail: 'Manter contratos próprios de eventos e abstrações para Tabia, canais e provedores de modelo.',
  },
  {
    title: 'Narrativa sem evidência',
    detail: 'Não declarar IA estrutural ou resultado clínico antes do piloto e das métricas.',
  },
]

export const APPLICATION_NARRATIVE = {
  title: 'Narrativa sugerida para a candidatura',
  body:
    'O Like:Me está evoluindo do Brasil uma plataforma existente de wellness para coordenar jornadas de saúde com IA. O primeiro recorte proposto é a adesão a programas GLP-1, onde participantes, profissionais, conteúdo e suporte operam em sistemas desconectados. A arquitetura-alvo incorpora uma Adaptive Layer e Gemini no Vertex AI para interpretar eventos autorizados, aplicar protocolos aprovados e recomendar apenas ações permitidas, como conteúdo, lembretes, agendamento e handoff humano. A IA não diagnostica nem prescreve. O app, a comunidade, o conteúdo e as integrações existentes formam os canais de distribuição; o novo núcleo será validado em piloto supervisionado no Brasil e desenhado para expandir a outros programas e mercados.',
  proofNeeded: [
    'Demo funcional com Gemini como parte do fluxo principal',
    'Design partner e coorte de piloto definidos',
    'Baseline e resultado inicial de adesão ou retenção',
    'Métrica de segurança e aceitação profissional',
    'Tese comercial e expansão para novas jornadas',
  ],
}

export const IMMEDIATE_DECISIONS = [
  {
    title: 'ICP e comprador',
    detail: 'Clínica, programa corporativo ou parceiro de saúde: escolher um patrocinador do piloto.',
  },
  {
    title: 'Design partner',
    detail: 'Confirmar quem fornece coorte, protocolo, supervisão e critério de sucesso.',
  },
  {
    title: 'Baseline',
    detail: 'Medir adesão, retenção e carga operacional antes de introduzir IA.',
  },
  {
    title: 'Owner técnico',
    detail: 'Definir responsável pelo fluxo Gemini, dados, avaliações e segurança.',
  },
  {
    title: 'Plano até 28/09',
    detail: 'Priorizar demo, evidência inicial e candidatura antes de ampliar escopo.',
  },
]
