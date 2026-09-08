export type EvidenceLevel = 'confirmado' | 'observado' | 'proposto'
export type FeatureStatus = 'Em produção' | 'Em evolução' | 'Gap' | 'Proposta'

export const BE180_PRODUCT_ARCHITECTURE_META = {
  id: 'be180-produto-engenharia-arquitetura',
  title: 'Produto, Engenharia & Arquitetura · Ecossistema Be180',
  client: 'Be180 OOH',
  updatedAt: '07/09/2026',
  path: '/produto-engenharia-arquitetura',
  lead:
    'Um desenho único do Colmeia, Banco de Ativos e Teste de Visibilidade: produto, funcionalidades, arquitetura de engenharia e roadmap por dependência.',
  sources: [
    'Código e documentação dos repositórios Colmeia frontend e backend',
    'Código e backlog do Teste de Visibilidade / Image Brand Processing',
    'Manual do Produto · Colmeia (10/06/2026)',
    'Relatório de Uso do Produto (05/08/2026)',
    'Promoção de inventários ao Banco de Ativos (11/08/2026)',
    'Arquitetura de Agentes · Colmeia & Banco de Ativos (10/08/2026)',
    'Reuniões de roadmap e inventário · 04–06/08/2026',
  ],
}

export const DOCUMENT_NAV = [
  { id: 'resumo', label: 'Resumo' },
  { id: 'portfolio', label: 'Portfólio' },
  { id: 'features', label: 'Features' },
  { id: 'jornadas', label: 'Jornadas' },
  { id: 'arquitetura', label: 'Arquitetura' },
  { id: 'blueprint', label: 'Desenho único' },
  { id: 'alvo', label: 'Arquitetura-alvo' },
  { id: 'agentes', label: 'Agentes' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'riscos', label: 'Riscos' },
]

export const EVIDENCE_LEGEND: Array<{
  level: EvidenceLevel
  label: string
  description: string
}> = [
  {
    level: 'confirmado',
    label: 'Confirmado',
    description: 'Presente no código, na documentação técnica ou em entrega validada.',
  },
  {
    level: 'observado',
    label: 'Observado',
    description: 'Derivado de dados de produção, uso ou comportamento operacional.',
  },
  {
    level: 'proposto',
    label: 'Proposto',
    description: 'Arquitetura ou capacidade-alvo; depende de decisão e implementação.',
  },
]

export const EXECUTIVE_SUMMARY = {
  thesis:
    'A Be180 já possui os componentes de um sistema operacional de planejamento OOH, mas eles ainda funcionam como produtos e fluxos parcialmente separados. O próximo salto não é adicionar telas isoladas: é fechar contratos entre inventário, planejamento e evidência de campanha.',
  principles: [
    {
      title: 'Colmeia é a experiência central',
      detail:
        'O planner concentra briefing, roteiro, simulação, resultados e operação. Banco de Ativos e Visibilidade devem ampliar essa jornada — não criar jornadas paralelas.',
    },
    {
      title: 'Banco de Ativos é a fundação',
      detail:
        'Qualidade, identidade e ciclo de vida do ativo determinam a confiabilidade de cobertura, frequência, disponibilidade, preço e pós-venda.',
    },
    {
      title: 'Visibilidade fecha o loop',
      detail:
        'O Teste de Visibilidade avalia a peça criativa em contexto OOH. Integrado ao Colmeia, pode devolver critérios e recomendações ao briefing e ao planejamento.',
    },
    {
      title: 'Roadmap segue dependências',
      detail:
        'Identidade, qualidade de dados, APIs, eventos, segurança e observabilidade vêm antes de agentes autônomos e otimização ponta a ponta.',
    },
  ],
  signals: [
    { value: '3.541', label: 'roteiros acumulados', evidence: 'observado' as const },
    { value: '9', label: 'módulos de produto em operação', evidence: 'confirmado' as const },
    { value: '4.881', label: 'pontos promovidos em 19 lotes', evidence: 'confirmado' as const },
    { value: '13%', label: 'lotes aprovados no funil medido', evidence: 'observado' as const },
    { value: '32%', label: 'adoção de exibidores', evidence: 'observado' as const },
    { value: '3', label: 'repositórios no mapa de engenharia', evidence: 'confirmado' as const },
  ],
}

export interface PortfolioProduct {
  id: string
  name: string
  role: string
  state: string
  outcome: string
  repositories: string[]
  evidence: EvidenceLevel
  capabilities: string[]
}

export const PORTFOLIO: PortfolioProduct[] = [
  {
    id: 'colmeia',
    name: 'Colmeia · Meus Roteiros',
    role: 'Produto principal',
    state: 'Em produção',
    outcome:
      'Planejar, simular, analisar e operar campanhas OOH a partir de briefing, inventário, metodologia e resultados.',
    repositories: ['jrbj001/colmeia---meusroteirosdefault'],
    evidence: 'confirmado',
    capabilities: [
      'Meus Roteiros e wizard de criação',
      'Mapa e seleção geográfica',
      'Resultados, cobertura e frequência',
      'Relatório P1A',
      'Gestão multi-tenant e perfis',
    ],
  },
  {
    id: 'banco-ativos',
    name: 'Banco de Ativos',
    role: 'Fundação de inventário',
    state: 'Em produção · evolução prioritária',
    outcome:
      'Manter a identidade, localização, classificação e ciclo de aprovação dos ativos usados pelo planejamento.',
    repositories: ['jrbj001/colmeia---meusroteirosdefault'],
    evidence: 'confirmado',
    capabilities: [
      'Dashboard, mapa e busca geoespacial',
      'Portal do Exibidor e upload Excel',
      'Análise e aprovação administrativa',
      'Promoção transacional ao banco',
      'Relatórios por praça e exibidor',
    ],
  },
  {
    id: 'visibilidade',
    name: 'Teste de Visibilidade',
    role: 'Inteligência de imagem',
    state: 'Produto satélite · integração pendente',
    outcome:
      'Avaliar peças criativas contra critérios de visibilidade OOH — cor, contraste, tipografia, branding e CTA — com score, recomendações e mockups.',
    repositories: [
      'Mavimarmara/digital-branding',
      'jrbj001/image_brand_processing',
    ],
    evidence: 'confirmado',
    capabilities: [
      'Experiência dedicada ao teste',
      'API FastAPI com autenticação Auth0',
      'OpenAI/Gemini para análise multimodal',
      'Mockups de leitura em 3m, 15m e 30m',
      'Contrato com Colmeia ainda a formalizar',
    ],
  },
]

export interface FeatureItem {
  name: string
  description: string
  status: FeatureStatus
  evidence: EvidenceLevel
  phase: 'Agora' | 'M0' | 'M1' | 'M2' | 'M3' | 'M4'
}

export interface FeatureDomain {
  id: string
  product: 'Colmeia' | 'Banco de Ativos' | 'Visibilidade' | 'Plataforma'
  title: string
  goal: string
  features: FeatureItem[]
}

export const FEATURE_MAP: FeatureDomain[] = [
  {
    id: 'planejamento',
    product: 'Colmeia',
    title: 'Planejamento de mídia',
    goal: 'Transformar briefing e inventário em roteiro defensável e operável.',
    features: [
      {
        name: 'Meus Roteiros',
        description: 'Lista, status e acesso aos roteiros por agência.',
        status: 'Em produção',
        evidence: 'confirmado',
        phase: 'Agora',
      },
      {
        name: 'Wizard Criar Roteiro',
        description: 'Configuração, target, praças, inventário e processamento.',
        status: 'Em produção',
        evidence: 'confirmado',
        phase: 'Agora',
      },
      {
        name: 'Mapa e resultados',
        description: 'Visualização geográfica, cobertura, frequência, impactos, TRP e CPM.',
        status: 'Em produção',
        evidence: 'confirmado',
        phase: 'Agora',
      },
      {
        name: 'Indoor',
        description: 'Configuração, simulação e resultados para inventário indoor; cálculos ainda exigem evolução.',
        status: 'Em evolução',
        evidence: 'confirmado',
        phase: 'Agora',
      },
      {
        name: 'Relatório P1A',
        description: 'Análise comparativa avançada de planos.',
        status: 'Em produção',
        evidence: 'confirmado',
        phase: 'Agora',
      },
      {
        name: 'Consulta Endereço',
        description: 'Geocoding em lote para enriquecer coordenadas.',
        status: 'Em produção',
        evidence: 'confirmado',
        phase: 'Agora',
      },
      {
        name: 'Metodologia auditável',
        description: 'Memória de cálculo, sazonalidade, deflator, indoor e frequência por período.',
        status: 'Gap',
        evidence: 'confirmado',
        phase: 'M2',
      },
      {
        name: 'Planos acima de 12 semanas',
        description: 'Suportar e validar cenários longos, como planos de 21 semanas.',
        status: 'Em evolução',
        evidence: 'observado',
        phase: 'M2',
      },
      {
        name: 'CPE nos resultados',
        description: 'Comparar eficiência das opções do roteiro por custo por inserção.',
        status: 'Proposta',
        evidence: 'proposto',
        phase: 'M2',
      },
    ],
  },
  {
    id: 'inventario',
    product: 'Banco de Ativos',
    title: 'Inventário & exibidores',
    goal: 'Criar uma fonte canônica, atualizada e utilizável de ativos OOH.',
    features: [
      {
        name: 'Dashboard e busca geoespacial',
        description: 'Filtros por praça, exibidor, ambiente, formato, rating e passantes.',
        status: 'Em produção',
        evidence: 'confirmado',
        phase: 'Agora',
      },
      {
        name: 'Upload de inventário',
        description: 'Excel por exibidor, lote e status EM_ANALISE.',
        status: 'Em produção',
        evidence: 'confirmado',
        phase: 'Agora',
      },
      {
        name: 'Promoção ao banco',
        description: 'Preview, confirmação, transação, soft-delete e auditoria.',
        status: 'Em produção',
        evidence: 'confirmado',
        phase: 'Agora',
      },
      {
        name: 'Validação assistida',
        description: 'Erro campo a campo, template guiado e revalidação antes do envio.',
        status: 'Gap',
        evidence: 'observado',
        phase: 'M1',
      },
      {
        name: 'Media kit e PM',
        description: 'Materiais, especificações e preço de mídia associados ao ativo.',
        status: 'Gap',
        evidence: 'confirmado',
        phase: 'M1',
      },
      {
        name: 'Enriquecimento Google Places',
        description: 'Fila preparada; worker Places ainda não implementado.',
        status: 'Gap',
        evidence: 'confirmado',
        phase: 'M1',
      },
      {
        name: 'Enriquecimento pós-promoção',
        description: 'Cron com legado, PostgreSQL, reverse geocode e IBGE.',
        status: 'Em evolução',
        evidence: 'confirmado',
        phase: 'Agora',
      },
      {
        name: 'Identidade canônica do ativo',
        description: 'Reduzir códigos LINHA_* e preservar o vínculo com passantes/IPV e histórico.',
        status: 'Gap',
        evidence: 'observado',
        phase: 'M0',
      },
    ],
  },
  {
    id: 'visibilidade',
    product: 'Visibilidade',
    title: 'Peça criativa & visibilidade OOH',
    goal: 'Avaliar se a peça comunica com clareza em condições de exposição OOH.',
    features: [
      {
        name: 'Experiência de teste',
        description: 'Frontend dedicado para enviar a peça e consultar uma análise.',
        status: 'Em evolução',
        evidence: 'observado',
        phase: 'Agora',
      },
      {
        name: 'Processamento de imagem/marca',
        description: 'FastAPI em Cloud Run, Supabase/Storage e análise multimodal OpenAI/Gemini.',
        status: 'Em produção',
        evidence: 'confirmado',
        phase: 'Agora',
      },
      {
        name: 'API do produto',
        description: 'OpenAPI/Swagger, campanhas, Auth0 e edit token documentados no backend; cobertura a validar com o frontend.',
        status: 'Em evolução',
        evidence: 'confirmado',
        phase: 'Agora',
      },
      {
        name: 'Contrato Colmeia ↔ Visibilidade',
        description: 'Definir IDs, payloads, estados, erros, versionamento e autenticação entre os produtos.',
        status: 'Gap',
        evidence: 'confirmado',
        phase: 'M0',
      },
      {
        name: 'Vínculo com briefing e campanha',
        description: 'Toda análise aponta para briefing, campanha, roteiro e versão da peça criativa.',
        status: 'Proposta',
        evidence: 'proposto',
        phase: 'M1',
      },
      {
        name: 'Resultado no Colmeia',
        description: 'Exibir score, critérios, mockups e recomendações dentro da jornada do roteiro.',
        status: 'Proposta',
        evidence: 'proposto',
        phase: 'M2',
      },
      {
        name: 'Loop de aprendizado',
        description: 'Devolver recomendações ao briefing e comparar versões da peça ao longo da campanha.',
        status: 'Proposta',
        evidence: 'proposto',
        phase: 'M4',
      },
    ],
  },
  {
    id: 'plataforma',
    product: 'Plataforma',
    title: 'Plataforma, dados & IA',
    goal: 'Dar contratos, segurança e observabilidade comuns aos três produtos.',
    features: [
      {
        name: 'Auth0 e contexto de acesso',
        description: 'JWT, usuario_dm, empresa, perfil e roteamento por persona.',
        status: 'Em produção',
        evidence: 'confirmado',
        phase: 'Agora',
      },
      {
        name: 'Tenant isolation',
        description: 'Isolamento verificável em dados, ferramentas e respostas do copiloto.',
        status: 'Proposta',
        evidence: 'proposto',
        phase: 'M3',
      },
      {
        name: 'Contrato de eventos',
        description: 'Ativo, lote, roteiro, processamento, evidência e feedback versionados.',
        status: 'Proposta',
        evidence: 'proposto',
        phase: 'M0',
      },
      {
        name: 'Observabilidade ponta a ponta',
        description: 'Correlation ID, logs por usuário, métricas, custo e trilha de auditoria.',
        status: 'Gap',
        evidence: 'confirmado',
        phase: 'M3',
      },
      {
        name: 'Copiloto com fontes',
        description: 'Perguntas sobre inventário e roteiro, respeitando tenant e permissões.',
        status: 'Proposta',
        evidence: 'proposto',
        phase: 'M3',
      },
      {
        name: 'Agentes da jornada',
        description: 'Briefing, planejamento, disponibilidade, preço, validação e pós-venda.',
        status: 'Proposta',
        evidence: 'proposto',
        phase: 'M1',
      },
    ],
  },
]

export const PRODUCT_JOURNEYS = [
  {
    id: 'roteiro',
    title: 'Planejar uma campanha',
    persona: 'Planejador de mídia',
    evidence: 'confirmado' as const,
    steps: [
      { product: 'Colmeia', label: 'Estruturar briefing e target' },
      { product: 'Banco de Ativos', label: 'Selecionar inventário confiável' },
      { product: 'Colmeia', label: 'Processar cobertura e frequência' },
      { product: 'Colmeia', label: 'Comparar e publicar resultados' },
    ],
  },
  {
    id: 'inventario',
    title: 'Atualizar o inventário',
    persona: 'Exibidor + Admin Be180',
    evidence: 'confirmado' as const,
    steps: [
      { product: 'Banco de Ativos', label: 'Enviar planilha e abrir lote' },
      { product: 'Banco de Ativos', label: 'Analisar, corrigir e aprovar' },
      { product: 'Banco de Ativos', label: 'Promover com preview e auditoria' },
      { product: 'Colmeia', label: 'Usar o ativo em busca, roteiro e relatório' },
    ],
  },
  {
    id: 'evidencia',
    title: 'Avaliar uma peça criativa',
    persona: 'Agência / marca + planejador',
    evidence: 'proposto' as const,
    steps: [
      { product: 'Colmeia', label: 'Selecionar briefing e campanha' },
      { product: 'Visibilidade', label: 'Processar a peça em contexto OOH' },
      { product: 'Visibilidade', label: 'Gerar score, mockups e recomendações' },
      { product: 'Colmeia', label: 'Comparar versões e ajustar o planejamento' },
    ],
  },
]

export const AS_IS_ARCHITECTURE = {
  title: 'Arquitetura atual',
  subtitle: 'Componentes existentes e pontos de acoplamento conhecidos.',
  layers: [
    {
      id: 'experience',
      label: 'Experiências',
      evidence: 'confirmado' as const,
      components: [
        'Colmeia SPA · React 18 + TypeScript + Vite',
        'Portal do Exibidor e Admin',
        'Digital Branding · frontend dedicado (observado, repo a validar)',
      ],
    },
    {
      id: 'services',
      label: 'Serviços',
      evidence: 'confirmado' as const,
      components: [
        'Colmeia · Node.js serverless no mesmo repo da SPA',
        '15 entrypoints e aproximadamente 124 handlers no clone auditado',
        'Visibilidade · FastAPI em Cloud Run / GCP',
      ],
    },
    {
      id: 'processing',
      label: 'Processamento',
      evidence: 'confirmado' as const,
      components: [
        'Databricks · sampleMaxAll → sampleFromMax → product_model',
        'Enriquecimento geoespacial · reverse geocode e base IBGE',
        'Parsing e validação de planilhas OOH',
        'OpenAI/Gemini · análise multimodal e mockups de visibilidade',
      ],
    },
    {
      id: 'data',
      label: 'Dados',
      evidence: 'confirmado' as const,
      components: [
        'SQL Server · roteiros, usuários e inventário operacional',
        'PostgreSQL · media_points e busca geoespacial',
        'Supabase/Storage · dados e artefatos do Teste de Visibilidade',
        'Auth0 + usuario_dm · identidade, empresa e perfil de acesso',
      ],
    },
  ],
  constraints: [
    'Banco de Ativos opera em duas camadas de dados; identidade e sincronização precisam ser explícitas.',
    'O contrato interno do Teste tem documentação parcial; a integração Colmeia ↔ Visibilidade ainda não está formalizada.',
    'O processamento geoespacial vive junto do backend do Colmeia; escala e isolamento dessa carga ainda precisam ser endereçados.',
    'Metodologia e taxonomia de status não estão suficientemente versionadas para medir o funil real.',
    'Dados incompletos e códigos de ativo auto-gerados quebram enriquecimento e histórico.',
  ],
}

export const REPOSITORY_MAP = [
  {
    name: 'jrbj001/colmeia---meusroteirosdefault',
    domain: 'Colmeia + Banco de Ativos',
    responsibility: 'SPA e backend Node serverless de planejamento, mapas, resultados, exibidor e administração.',
    evidence: 'confirmado' as const,
  },
  {
    name: 'Mavimarmara/digital-branding',
    domain: 'Teste de Visibilidade · frontend',
    responsibility: 'Experiência de entrada e visualização do teste de marca.',
    evidence: 'observado' as const,
  },
  {
    name: 'jrbj001/image_brand_processing',
    domain: 'Teste de Visibilidade · backend',
    responsibility: 'Pipeline e serviços de processamento de imagem e marca.',
    evidence: 'confirmado' as const,
  },
]

export const TARGET_ARCHITECTURE = {
  title: 'Arquitetura-alvo',
  subtitle: 'Um ecossistema integrado por contratos — sem reescrever produtos que já funcionam.',
  layers: [
    {
      id: 'channels',
      label: 'Canais & experiências',
      detail: 'Colmeia · Portal do Exibidor · Admin · Visibilidade embutida · Copiloto',
      responsibilities: ['Jornada por persona', 'Human-in-the-loop', 'Resultados e evidências'],
    },
    {
      id: 'domain',
      label: 'APIs de domínio',
      detail: 'Planejamento · Inventário · Campanha · Visibilidade · Disponibilidade · Preço',
      responsibilities: ['Contratos versionados', 'Idempotência', 'Autorização por ação'],
    },
    {
      id: 'layer',
      label: 'Adaptive Layer™',
      detail: 'Identidade canônica · eventos · contexto · ferramentas · auditoria',
      responsibilities: ['Linha do tempo do ativo/roteiro', 'Contexto para agentes', 'Integração desacoplada'],
    },
    {
      id: 'data',
      label: 'Dados & processamento',
      detail: 'SQL Server · PostgreSQL · Databricks · FastAPI/Cloud Run · Supabase · modelos multimodais',
      responsibilities: ['Fonte da verdade por domínio', 'Qualidade e lineage', 'Processamento assíncrono'],
    },
    {
      id: 'platform',
      label: 'Plataforma',
      detail: 'Auth0 · tenant isolation · filas · observabilidade · secrets · LGPD',
      responsibilities: ['Segurança', 'Resiliência', 'Custos e SLOs'],
    },
  ],
}

export const UNIFIED_ARCHITECTURE_BLUEPRINT = {
  title: 'Desenho único do ecossistema',
  subtitle:
    'Uma prancha de produto e engenharia: o que existe hoje, as pontes que precisam ser construídas e como o ecossistema opera no estado futuro.',
  current: {
    label: 'Hoje · produtos conectados parcialmente',
    groups: [
      {
        label: 'Experiências',
        items: ['Colmeia · Meus Roteiros', 'Banco de Ativos', 'Portal do Exibidor', 'Teste de Visibilidade'],
      },
      {
        label: 'Serviços',
        items: ['Node.js serverless', 'Image Brand Processing', 'Databricks', 'Enriquecimento geo'],
      },
      {
        label: 'Dados & identidade',
        items: ['SQL Server', 'PostgreSQL', 'Supabase / Storage', 'Auth0 + usuario_dm'],
      },
    ],
  },
  transition: {
    label: 'Pontes · M0–M2',
    items: [
      'IDs canônicos',
      'APIs de domínio',
      'Eventos versionados',
      'Contrato Colmeia ↔ Visibilidade',
      'Qualidade & lineage',
      'Metodologia auditável',
    ],
  },
  future: {
    label: 'Futuro · ecossistema operado por IA',
    groups: [
      {
        label: 'Canais',
        items: ['Colmeia unificado', 'Portal do Exibidor', 'Admin & Controle', 'Copiloto'],
      },
      {
        label: 'Squad de agentes',
        items: ['Briefing', 'Planejamento', 'Disponibilidade', 'Preço & PI/PM', 'Validação', 'Pós-venda'],
      },
      {
        label: 'Adaptive Layer™',
        items: ['Contexto & memória', 'Orquestração', 'Tool registry', 'Guardrails & audit'],
      },
      {
        label: 'Domínios & processamento',
        items: ['Inventário', 'Planejamento', 'Campanha', 'Visibilidade', 'Preço', 'Disponibilidade'],
      },
      {
        label: 'Fundação',
        items: ['SQL Server + PostgreSQL', 'Databricks + FastAPI', 'Modelos multimodais', 'Auth0 · filas · observabilidade'],
      },
    ],
  },
  outcomes: ['Uma identidade por ativo', 'Uma jornada por campanha', 'Agentes sem bases paralelas', 'Toda ação rastreável'],
}

export const AGENT_OPERATING_MODEL = {
  title: 'Novo desenho de agentes',
  subtitle:
    'Seis agentes especializados percorrem a jornada OOH sobre a mesma Adaptive Layer™. Eles não acessam bancos diretamente: observam eventos, recebem contexto autorizado e agem por ferramentas de domínio.',
  agents: [
    {
      id: 'a1',
      stage: '01 · Entrada',
      name: 'Briefing',
      role: 'Estrutura demanda, objetivos, praças, período, budget e KPIs.',
      phase: 'M1',
    },
    {
      id: 'a2',
      stage: '02 · Planejamento',
      name: 'Planejamento',
      role: 'Monta shortlist explicado com inventário e metodologia.',
      phase: 'M2',
    },
    {
      id: 'a3',
      stage: '03 · Compra',
      name: 'Disponibilidade',
      role: 'Consulta disponibilidade e recomenda substituições.',
      phase: 'M3',
    },
    {
      id: 'a4',
      stage: '03 · Compra',
      name: 'Preço & PI/PM',
      role: 'Valida budget, preço e prepara a formalização da compra.',
      phase: 'M3',
    },
    {
      id: 'a5',
      stage: '04 · Validação',
      name: 'Validação',
      role: 'Executa QA do roteiro e prepara o aceite humano.',
      phase: 'M4',
    },
    {
      id: 'a6',
      stage: '05 · Pós-venda',
      name: 'Pós-venda',
      role: 'Monitora comprovação, exceções e feedback do ativo.',
      phase: 'M4',
    },
  ],
  layer: [
    'Eventos da jornada',
    'Contexto & memória operacional',
    'Orquestração e handoffs',
    'Ferramentas / APIs autorizadas',
    'Guardrails e aprovação humana',
    'Audit trail e avaliações',
  ],
  tools: [
    'Briefing & campanha',
    'Inventário & geoespacial',
    'Cobertura & frequência',
    'Disponibilidade',
    'Preço & PI/PM',
    'Visibilidade & comprovação',
  ],
  control: [
    'Autonomia configurável por agente',
    'Tenant isolation herdado do usuário',
    'Limites financeiros e operacionais',
    'Fallback e rollback por ferramenta',
    'Dataset e score de qualidade',
    'Custo, falha e intervenção humana',
  ],
  loop: ['Observa', 'Contextualiza', 'Decide', 'Aprova quando necessário', 'Executa', 'Registra & aprende'],
}

export const TARGET_FLOWS = [
  {
    id: 'asset',
    trigger: 'Inventário aprovado',
    flow: ['Portal do Exibidor', 'API Inventário', 'Evento asset.promoted', 'Identidade do ativo', 'Planner'],
    result: 'O Colmeia usa o mesmo ativo que foi validado e auditado.',
  },
  {
    id: 'visibility',
    trigger: 'Peça criativa enviada',
    flow: ['Colmeia', 'API Visibilidade', 'FastAPI / Cloud Run', 'OpenAI ou Gemini', 'Evento visibility.completed'],
    result: 'Score, mockups e recomendações voltam ao briefing e à campanha.',
  },
  {
    id: 'agent',
    trigger: 'Pergunta ou tarefa',
    flow: ['Pessoa / agente', 'Adaptive Layer™', 'Contexto autorizado', 'Ferramenta de domínio', 'Audit trail'],
    result: 'Resposta ou ação com fonte, permissão e resultado rastreável.',
  },
]

export interface RoadmapMilestone {
  id: 'M0' | 'M1' | 'M2' | 'M3' | 'M4'
  title: string
  window: string
  outcome: string
  dependencies: string[]
  deliverables: string[]
  acceptance: string[]
  owners: string[]
}

export const ROADMAP: RoadmapMilestone[] = [
  {
    id: 'M0',
    title: 'Baseline, contratos & decisões',
    window: '2–3 semanas',
    outcome: 'Um mapa técnico aprovado e um backlog executável, sem ambiguidade entre existente e proposto.',
    dependencies: ['Acesso aos quatro repositórios', 'Owners de produto e engenharia disponíveis'],
    deliverables: [
      'Arquitetura as-is validada por repo e ambiente',
      'Prancha única atual → futuro aprovada por produto e engenharia',
      'Contrato Colmeia ↔ Visibilidade v0',
      'Identidade canônica de ativo, roteiro, campanha e peça',
      'Taxonomia de status do roteiro e eventos de ciclo de vida',
      'Definição do runtime do processamento geoespacial (escala, fila e segurança)',
      'Blueprint dos 6 agentes: contexto, ferramentas, guardrails, handoff e métricas',
      'Baseline de adoção, qualidade, tempo e erros',
    ],
    acceptance: [
      'Contratos e decisões publicados com owner',
      'Gaps priorizados por impacto × dependência',
      'Métricas de saída das fases acordadas',
    ],
    owners: ['Be180 Produto', 'Be180 Tecnologia', 'PixelPulseLab'],
  },
  {
    id: 'M1',
    title: 'Fundação do ativo & integração inicial',
    window: '6–10 semanas',
    outcome: 'Inventário confiável alimenta o planner e cada análise de visibilidade nasce ligada ao briefing e à campanha.',
    dependencies: ['M0 · identidade e contratos', 'Cadastros e de-para priorizados'],
    deliverables: [
      'Validação assistida no upload de inventário',
      'Media kit, PM e cadastros administrativos essenciais',
      'Redução dos códigos LINHA_* e plano de migração',
      'Visibilidade vinculada a briefing, campanha e versão da peça',
      'Agente de briefing em piloto supervisionado',
    ],
    acceptance: [
      'Exibidor corrige o arquivo antes do envio',
      'Ativo promovido mantém identidade e histórico',
      'Teste de visibilidade recebe IDs canônicos da campanha e da peça',
    ],
    owners: ['Banco de Ativos', 'Engenharia', 'Produto'],
  },
  {
    id: 'M2',
    title: 'Planner integrado & resultado visível',
    window: 'Após contratos estáveis de M1',
    outcome: 'Planejamento e visibilidade operam na mesma jornada, com metodologia explicável.',
    dependencies: ['M1 · inventário confiável', 'Metodologia validada por líderes de mídia'],
    deliverables: [
      'Metodologia de cobertura/frequência documentada e versionada',
      'CPE, indoor e planos longos na experiência de resultados',
      'Resultado do Teste de Visibilidade dentro do Colmeia',
      'UX e onboarding por perfil',
      'Agente de planejamento com shortlist explicado',
    ],
    acceptance: [
      'Memória de cálculo auditável',
      'Resultado de visibilidade acessível sem sistema paralelo',
      'Shortlist comparado ao planejamento humano',
    ],
    owners: ['Produto & Metodologia', 'UX', 'Engenharia'],
  },
  {
    id: 'M3',
    title: 'Operação, segurança & IA grounded',
    window: 'Paralelo à consolidação de M1/M2',
    outcome: 'Copiloto e agentes consultam e executam ferramentas com isolamento, logs e fontes.',
    dependencies: ['Eventos estáveis', 'Permissões por domínio', 'Observabilidade mínima'],
    deliverables: [
      'Tenant isolation e logs por usuário',
      'Filas, retries, idempotência e correlation IDs',
      'MVP Colmeia AI com respostas grounded',
      'Agentes de disponibilidade e preço/PI',
      'SLOs e métricas do pipeline de visibilidade',
    ],
    acceptance: [
      'Teste de isolamento em staging aprovado',
      'Toda resposta cita fonte e toda ação deixa trilha',
      'Falhas do processamento são recuperáveis e observáveis',
    ],
    owners: ['Plataforma', 'Dados & IA', 'Be180 TI'],
  },
  {
    id: 'M4',
    title: 'Loop ponta a ponta',
    window: 'Após pilotos M1–M3',
    outcome: 'Briefing e planejamento aprendem com a análise criativa; a operação melhora a cada ciclo.',
    dependencies: ['Métricas de qualidade dos pilotos', 'Handoffs humanos definidos'],
    deliverables: [
      'Agentes de validação e pós-venda',
      'Histórico de versões, scores e recomendações da peça',
      'Orquestração entre briefing, planejamento, compra e pós-venda',
      'Painel de custos, qualidade, falhas e intervenção humana',
    ],
    acceptance: [
      'Jornada piloto mensurada ponta a ponta',
      'Feedback da análise atualiza briefing e decisão criativa',
      'Autonomia aumenta apenas quando metas de qualidade são cumpridas',
    ],
    owners: ['Operação', 'Produto', 'Engenharia & IA'],
  },
]

export const RISKS_AND_DECISIONS = {
  risks: [
    {
      title: 'Qualidade antes de inteligência',
      evidence: '82% dos lotes medidos estavam rejeitados ou para corrigir.',
      mitigation: 'Validação assistida, de-para versionado e identidade canônica no M0/M1.',
    },
    {
      title: 'Adoção menor que provisionamento',
      evidence: '67% da base nunca acessou, embora a maior parte já tenha conta Auth0.',
      mitigation: 'Onboarding hands-on, UX por perfil e métricas de ativação/coorte.',
    },
    {
      title: 'Métricas de roteiro pouco confiáveis',
      evidence: '99,6% dos roteiros estavam no status “Teste” no recorte analisado.',
      mitigation: 'Taxonomia de status e eventos de ciclo de vida antes de dashboards executivos.',
    },
    {
      title: 'Integração de visibilidade sem contrato',
      evidence: 'A API interna possui documentação parcial; contrato e fluxo com Colmeia estão no backlog.',
      mitigation: 'OpenAPI/payloads versionados, IDs canônicos e testes de contrato no M0.',
    },
    {
      title: 'Autonomia antes de governança',
      evidence: 'Agentes exigem contexto, ferramentas, guardrails e audit ainda em evolução.',
      mitigation: 'Pilotos supervisionados e critérios de saída por fase.',
    },
    {
      title: 'Processamento pesado sem isolamento',
      evidence:
        'Enriquecimento e cálculo geoespacial rodam acoplados ao backend do Colmeia, sem fila durável dedicada.',
      mitigation:
        'Mover a carga para fila com retry, idempotência e observabilidade, definindo o runtime responsável no M0.',
    },
  ],
  decisions: [
    'Colmeia permanece a experiência principal da jornada.',
    'Banco de Ativos é a fonte canônica do ativo; o planner não cria uma cópia paralela.',
    'Teste de Visibilidade entra como capacidade de domínio, ligado ao briefing, à campanha e à versão da peça.',
    'Integração acontece por APIs e eventos versionados, não por leitura direta entre bancos.',
    'SQL Server e PostgreSQL coexistem enquanto a responsabilidade de cada fonte estiver explícita.',
    'O processamento geoespacial só recebe tráfego crítico após definição do runtime, hardening e testes de integração.',
    'Agentes usam ferramentas de domínio e herdam permissões; não acessam bancos diretamente.',
  ],
}

export const SUCCESS_METRICS = [
  { domain: 'Adoção', metric: 'Exibidores ativados e ativos em 30 dias', baseline: '32% adotaram', target: 'Meta a pactuar no M0' },
  { domain: 'Qualidade', metric: 'Lotes que chegaram ao status Aprovado', baseline: '13% no recorte (20/160)', target: 'Meta a pactuar no M0' },
  { domain: 'Planejamento', metric: 'Tempo briefing → roteiro revisável', baseline: 'Não instrumentado', target: 'Baseline no M0' },
  { domain: 'Visibilidade', metric: 'Análises ligadas a campanha e versão da peça', baseline: 'Não instrumentado', target: '100% a partir de M1' },
  { domain: 'Plataforma', metric: 'Ações com correlation ID e audit trail', baseline: 'Parcial', target: '100% a partir de M3' },
  { domain: 'IA', metric: 'Qualidade e intervenção humana por agente', baseline: 'Não instrumentado', target: 'Dataset e meta por agente' },
]
