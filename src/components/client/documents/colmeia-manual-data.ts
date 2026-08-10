// Manual do Produto (web) — Colmeia · Be180 OOH
// Fonte: Manual do Produto no Notion (jun/2026) + guias de fluxos, personas e Banco de Ativos.

export const MANUAL_META = {
  id: 'colmeia-manual',
  title: 'Manual do Produto · Colmeia',
  client: 'Be180 OOH',
  updatedAt: '10/06/2026',
  path: '/manual',
  notionHref: 'https://app.notion.com/p/37b5615ab27481d48154e1b27f250e01',
  lead:
    'Colmeia · Meus Roteiros é a plataforma da Be180 para planejar, simular, analisar e operar campanhas OOH. Este manual explica o que o sistema faz, como cada módulo funciona e como o Banco de Ativos sustenta o ecossistema.',
}

export const MANUAL_NAV = [
  { id: 'visao', label: 'O que é' },
  { id: 'stack', label: 'Arquitetura' },
  { id: 'personas', label: 'Personas & acesso' },
  { id: 'fluxos', label: 'Fluxos' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'banco', label: 'Banco de Ativos' },
  { id: 'modulos', label: 'Módulos' },
  { id: 'metricas', label: 'Métricas OOH' },
  { id: 'rotas', label: 'Rotas & APIs' },
]

export const MANUAL_HIGHLIGHTS = [
  { value: 'SaaS', label: 'Multi-tenant — Be, agências e exibidores' },
  { value: '9', label: 'Módulos de produto em operação' },
  { value: '2', label: 'Camadas de dados no Banco de Ativos' },
  { value: 'OOH', label: 'Cobertura, frequência, TRP, CPM e IPV' },
]

/** Stack em camadas — do usuário ao dado. */
export const STACK_LAYERS = [
  {
    id: 'frontend',
    label: 'Frontend',
    tech: 'React 18 · TypeScript · Vite · Tailwind · Leaflet',
    detail: 'SPA com wizard de roteiro, mapa geográfico e dashboards.',
    tone: 'accent' as const,
  },
  {
    id: 'backend',
    label: 'Backend',
    tech: 'Node.js serverless (Vercel) · 13 routers · ~70 handlers',
    detail: 'APIs REST por domínio: roteiros, inventário, banco de ativos, admin.',
    tone: 'dark' as const,
  },
  {
    id: 'dados',
    label: 'Dados core',
    tech: 'SQL Server',
    detail: 'Roteiros, usuários e inventário operacional.',
    tone: 'teal' as const,
  },
  {
    id: 'busca',
    label: 'Banco de Ativos (busca)',
    tech: 'PostgreSQL · media_points',
    detail: 'Pontos georreferenciados e passantes geoespaciais.',
    tone: 'teal' as const,
  },
  {
    id: 'processamento',
    label: 'Processamento',
    tech: 'Databricks',
    detail: 'sampleMaxAll → sampleFromMax → product_model.',
    tone: 'light' as const,
  },
  {
    id: 'auth',
    label: 'Autenticação',
    tech: 'Auth0 · JWT + usuario_dm',
    detail: 'Login federado e cadastro de usuários.',
    tone: 'light' as const,
  },
]

export interface Persona {
  id: string
  name: string
  identity: string
  screens: string[]
  restriction: string
  tone: 'be' | 'agencia' | 'exibidor' | 'admin'
}

export const PERSONAS: Persona[] = [
  {
    id: 'be',
    name: 'Be interno',
    identity: 'E-mail @be180.com.br ou empresa_pk nula',
    screens: ['Criar Roteiro', 'Banco de Ativos', 'Mapa', 'Resultados', 'Admin'],
    restriction: 'Acesso total à plataforma',
    tone: 'be',
  },
  {
    id: 'agencia',
    name: 'Agência parceira',
    identity: 'empresa_pk = agência vinculada',
    screens: ['Home', 'Meus Roteiros', 'Mapa', 'Resultados', 'Relatório P1A'],
    restriction: 'Só roteiros liberados da própria agência',
    tone: 'agencia',
  },
  {
    id: 'exibidor',
    name: 'Exibidor',
    identity: 'Perfil Exibidor + exibidor_fk',
    screens: ['Portal do Exibidor', 'Importar inventário', 'Solicitações'],
    restriction: 'Redirecionado do Home; sem acesso ao restante',
    tone: 'exibidor',
  },
  {
    id: 'admin',
    name: 'Admin Be',
    identity: 'Perfil Admin + isAdmin',
    screens: ['Usuários', 'Perfis', 'Inventários de exibidor'],
    restriction: 'Só usuários internos',
    tone: 'admin',
  },
]

export const AUTH_STEPS = [
  { step: '1', title: 'Login Auth0', detail: 'loginWithRedirect retorna token JWT.' },
  { step: '2', title: 'Identidade', detail: 'API resolve usuario_pk, empresa_pk e perfil em usuario_dm.' },
  { step: '3', title: 'Roteamento', detail: '@be180.com.br → Be; outro domínio → busca cadastro.' },
  { step: '4', title: 'Contexto de acesso', detail: 'AuthContext define telas e permissões (ler/escrever).' },
]

export interface ManualFlow {
  id: string
  code: string
  title: string
  persona: string
  steps: string[]
  note?: string
}

export const MANUAL_FLOWS: ManualFlow[] = [
  {
    id: 'flow-a',
    code: 'Fluxo A',
    title: 'Criar roteiro simulado ou completo',
    persona: 'Be interno',
    steps: [
      'Configuração — nome, agência, marca, categoria',
      'Target — gênero, classe, idade',
      'Praças — seleção de cidades',
      'Vias públicas / inventário — manual ou import Excel OOH',
      'Envio para processamento (Databricks)',
      'Resultados — cobertura, frequência, impactos',
    ],
    note: 'Dois caminhos de import: direto (sp_planoMidiaOohInsert) ou manual por cidade (roteiro-simulado).',
  },
  {
    id: 'flow-b',
    code: 'Fluxo B',
    title: 'Agência consulta roteiro liberado',
    persona: 'Agência parceira',
    steps: [
      'Login Auth0 com empresa_pk',
      'Meus Roteiros — lista filtrada por agência + liberado',
      'Mapa — visualização geográfica',
      'Visualizar Resultados — indicadores pós-Databricks',
      'Relatório P1A — análise comparativa (opcional)',
    ],
    note: 'Não acessa Criar Roteiro, Banco de Ativos, Consulta Endereço nem Admin.',
  },
  {
    id: 'flow-c',
    code: 'Fluxo C',
    title: 'Exibidor atualiza inventário',
    persona: 'Exibidor',
    steps: [
      'Login → redirect para /exibidor/dashboard',
      'Importar nova base — upload Excel vira lote',
      'Itens gravados com status EM_ANALISE',
      'Solicitações — acompanhamento dos lotes',
      'Admin Be analisa em /admin/inventarios-exibidor',
    ],
    note: 'Roadmap: fila Google Places para enriquecimento (foundation pronta, worker pendente).',
  },
]

/** Pipeline do roteiro: do upload aos resultados. */
export const ROTEIRO_PIPELINE = [
  { id: 'upload', label: 'Upload Excel OOH', detail: 'Plano de mídia importado ou montado por cidade', kind: 'input' as const },
  { id: 'parse', label: 'parsePlanoOohExcel', detail: 'Parsing e validação da planilha', kind: 'process' as const },
  { id: 'sp', label: 'Stored Procedure', detail: 'SQL Server grava plano e roteiro', kind: 'process' as const },
  { id: 'dbx', label: 'Databricks Jobs', detail: 'sampleMaxAll → sampleFromMax → product_model', kind: 'compute' as const },
  { id: 'result', label: 'Visualizar Resultados', detail: 'Cobertura, frequência, hexágonos H3 e mapas', kind: 'output' as const },
]

export const DATABRICKS_STEPS = [
  { id: 'max', label: 'sampleMaxAll', detail: 'Amostragem estatística e espacial da base.' },
  { id: 'from', label: 'sampleFromMax', detail: 'Filtro por planoMidia_pk do roteiro.' },
  { id: 'model', label: 'product_model', detail: 'Clustering, hexágonos H3 e geração de mapas.' },
]

/** Banco de Ativos — arquitetura dual DB. */
export const BANCO_ATIVOS = {
  roles: [
    { id: 'consulta', label: 'Consulta', detail: 'Dashboard, mapa e busca de pontos' },
    { id: 'relatorios', label: 'Relatórios', detail: 'Agregações por praça e por exibidor' },
    { id: 'enriquecimento', label: 'Enriquecimento', detail: 'Lookup de passantes no Criar Roteiro' },
    { id: 'atualizacao', label: 'Atualização', detail: 'Portal exibidor + análise admin' },
  ],
  layers: [
    {
      id: 'sql',
      label: 'SQL Server · bancoAtivosJoin_ft',
      use: 'Operacional e relatórios',
      detail: 'Dashboard, mapa, relatório praça/exibidor, gestão de exibidores.',
      handlers: ['banco-ativos-dashboard.js', 'banco-ativos-mapa.js', 'exibidor-gestao.js'],
    },
    {
      id: 'pg',
      label: 'PostgreSQL · media_points',
      use: 'Busca geoespacial',
      detail: 'Filtros encadeados e passantes por coordenada.',
      handlers: ['busca-pontos-midia.js', 'banco-ativos-passantes.js'],
    },
  ],
  filters: ['Praça', 'Exibidor', 'Bairro', 'Rating', 'Ambiente', 'Grupo de mídia', 'Vias públicas / Indoor', 'Formato'],
  kpis: ['Total de pontos, praças e exibidores', '% Vias Públicas vs Indoor', 'Passantes médios', 'Impactos IPV'],
}

export interface ManualModule {
  id: string
  name: string
  route: string
  desc: string
  status: 'Produção' | 'Em desenvolvimento'
}

export const MANUAL_MODULES: ManualModule[] = [
  { id: 'meus-roteiros', name: 'Meus Roteiros', route: '/meus-roteiros', desc: 'Lista e status dos roteiros por agência.', status: 'Produção' },
  { id: 'criar-roteiro', name: 'Criar Roteiro', route: '/criar-roteiro', desc: 'Wizard em abas para simular ou importar plano OOH.', status: 'Produção' },
  { id: 'mapa', name: 'Mapa', route: '/mapa', desc: 'Visualização geográfica de pontos e roteiro.', status: 'Produção' },
  { id: 'resultados', name: 'Visualizar Resultados', route: '/resultados', desc: 'Indicadores pós-Databricks e comparação de planos.', status: 'Produção' },
  { id: 'p1a', name: 'Relatório P1A', route: '/relatorio-p1a', desc: 'Análise comparativa avançada de planos.', status: 'Produção' },
  { id: 'banco', name: 'Banco de Ativos', route: '/banco-de-ativos', desc: 'Inventário OOH: dashboard, mapa, busca e relatórios.', status: 'Produção' },
  { id: 'exibidor', name: 'Portal do Exibidor', route: '/exibidor/dashboard', desc: 'Upload e acompanhamento de inventário.', status: 'Produção' },
  { id: 'endereco', name: 'Consulta Endereço', route: '/consulta-endereco', desc: 'Geocoding em lote para enriquecer coordenadas.', status: 'Produção' },
  { id: 'admin', name: 'Administração', route: '/admin', desc: 'Usuários, perfis e análise de inventários.', status: 'Produção' },
]

export interface OohMetric {
  id: string
  term: string
  definition: string
}

export const OOH_METRICS: OohMetric[] = [
  { id: 'cobertura', term: 'Cobertura', definition: 'Percentual do público-alvo exposto ao menos uma vez à campanha.' },
  { id: 'frequencia', term: 'Frequência', definition: 'Número médio de vezes que o público impactado vê a campanha.' },
  { id: 'impactos', term: 'Impactos', definition: 'Total de exposições geradas pelo conjunto de pontos.' },
  { id: 'trp', term: 'TRP', definition: 'Target Rating Point — audiência sobre o público-alvo específico.' },
  { id: 'cpm', term: 'CPM', definition: 'Custo por mil impactos — eficiência de investimento.' },
  { id: 'ipv', term: 'IPV', definition: 'Índice de passantes/visibilidade que qualifica cada ponto de mídia.' },
]

export const ROUTE_REFERENCE = [
  { area: 'Roteiros', route: '/criar-roteiro · /meus-roteiros', api: 'sp_planoColmeiaSimuladoInsert · roteiro-simulado' },
  { area: 'Import OOH', route: 'Aba 4 do wizard', api: 'POST /sp-plano-midia-ooh-insert' },
  { area: 'Inventário por cidade', route: 'Aba 3/4', api: 'GET /inventario-cidade' },
  { area: 'Enriquecimento', route: 'Criar Roteiro (Aba 4)', api: 'upload-pontos-unicos → uploadInventario_ft' },
  { area: 'Banco de Ativos', route: '/banco-de-ativos', api: 'banco-ativos-dashboard · busca-pontos-midia' },
  { area: 'Exibidor', route: '/exibidor/dashboard', api: 'exibidor_inventario_upload_lote_dm' },
  { area: 'Autenticação', route: 'Auth0', api: 'GET /usuarios · usuario_completo_vw' },
]
