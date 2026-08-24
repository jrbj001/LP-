import type {
  Engine,
  EngineId,
  JourneyStage,
  MethodologyStats,
  Pillar,
  PillarId,
  Practice,
  PracticeSystem,
} from './types'

/**
 * Backbone provisório e editável da Alquemia. A biblioteca abaixo referencia
 * práticas atribuídas a Danaher/DBS e AB InBev/3G; não reivindica sua autoria
 * nem propriedade intelectual exclusiva.
 */
export const pillars: Pillar[] = [
  { id: 'purpose-direction', name: 'Propósito e direção', description: 'Traduz ambição em escolhas, prioridades e metas coerentes.', provisional: true },
  { id: 'people-culture', name: 'Pessoas e cultura', description: 'Desenvolve liderança, capacidades e comportamentos que sustentam a estratégia.', provisional: true },
  { id: 'management-system', name: 'Sistema de gestão', description: 'Cria governança, cadências, accountability e disciplina econômica.', provisional: true },
  { id: 'continuous-improvement', name: 'Melhoria contínua', description: 'Torna problemas visíveis e melhora processos com método e dados.', provisional: true },
  { id: 'innovation-growth', name: 'Inovação e crescimento', description: 'Converte necessidades externas em crescimento, inovação e renovação do portfólio.', provisional: true },
]

export const engines: Engine[] = [
  { id: 'management', name: 'Gestão', description: 'Alinha direção, pessoas, recursos, decisões e acompanhamento.' },
  { id: 'continuous-improvement', name: 'Melhoria contínua', description: 'Opera ciclos disciplinados de diagnóstico, solução, aprendizagem e sustentação.' },
]

export const journeyStages: JourneyStage[] = [
  { id: 'diagnostic', name: 'Diagnóstico', description: 'Estabelecer fatos, contexto, maturidade e oportunidades.', order: 1 },
  { id: 'focus', name: 'Foco', description: 'Escolher prioridades e resultados críticos.', order: 2 },
  { id: 'design', name: 'Desenho', description: 'Desenhar sistema, iniciativas, métricas e rituais.', order: 3 },
  { id: 'execution', name: 'Execução', description: 'Executar, medir, resolver desvios e aprender.', order: 4 },
  { id: 'sustain', name: 'Sustentação', description: 'Incorporar capacidades e manter os ganhos.', order: 5 },
]

const D = 'danaher' as const
const A = 'abi' as const
const M: EngineId[] = ['management']
const C: EngineId[] = ['continuous-improvement']
const MC: EngineId[] = ['management', 'continuous-improvement']

function practice(
  number: number,
  id: string,
  title: string,
  system: PracticeSystem,
  area: string,
  source: string,
  summary: string,
  pillarIds: PillarId[],
  engineIds: EngineId[]
): Practice {
  return { number, id, title, system, area, source, summary, pillarIds, engineIds }
}

export const practices: Practice[] = [
  practice(1, 'danaher-kaizen-events', 'Kaizen Events (Rapid Improvement Events / RIEs)', D, 'Operações / Lean', 'HBS; McKinsey; relatórios anuais Danaher', 'Equipes multifuncionais atacam um problema delimitado por três a cinco dias, implementando e medindo mudanças durante o próprio evento. A participação direta de líderes reforça o kaizen como prática de gestão, não recomendação externa.', ['continuous-improvement', 'people-culture'], C),
  practice(2, 'danaher-value-stream-mapping', 'Value Stream Mapping (VSM)', D, 'Operações / Lean', 'HBS; literatura lean; materiais DBS', 'Mapeia fluxos de material e informação, tempos e desperdícios do estado atual ao futuro. O gap gera um backlog de kaizens conectado ao planejamento, inclusive em processos transacionais.', ['continuous-improvement', 'management-system'], C),
  practice(3, 'danaher-5s', '5S — Workplace Organization', D, 'Operações / Lean', 'HBS; relatórios anuais Danaher', 'Organiza e sustenta o ambiente de trabalho para aumentar segurança, clareza e estabilidade. Em aquisições, sua implantação precoce também sinaliza a mudança cultural e prepara práticas lean mais profundas.', ['continuous-improvement', 'people-culture'], C),
  practice(4, 'danaher-standard-work', 'Standard Work', D, 'Operações / Lean', 'HBS; práticas DBS; literatura lean', 'Documenta sequência, tempo e qualidade do melhor método conhecido no momento, como base explícita para melhoria. A disciplina se aplica tanto ao trabalho operacional quanto a processos gerenciais.', ['continuous-improvement', 'management-system'], C),
  practice(5, 'danaher-visual-daily-management', 'Visual Management / Daily Management System (DMS)', D, 'Operações / Lean', 'HBS; apresentações a investidores; materiais DBS', 'Quadros SQDCM e reuniões curtas diárias tornam desvios visíveis, atribuem donos e escalam problemas entre níveis. A gestão visual cria transparência e resposta estruturada em alta frequência.', ['management-system', 'continuous-improvement'], MC),
  practice(6, 'danaher-a3-problem-solving', 'A3 Problem Solving / Root Cause Analysis', D, 'Operações / Lean', 'HBS; literatura lean; McKinsey', 'Estrutura em uma página problema, dados, alvo, causa raiz, contramedidas, plano e verificação. Gerentes usam o A3 também para desenvolver o raciocínio científico das equipes.', ['continuous-improvement', 'people-culture'], C),
  practice(7, 'danaher-transactional-process-improvement', 'Transactional Process Improvement (TPI)', D, 'Operações / Lean', 'Materiais DBS públicos; HBS', 'Aplica kaizen e lean a fluxos de informação, aprovações e esperas em finanças, RH, TI, vendas, atendimento e P&D. Equipes desenham e implementam rapidamente um estado futuro.', ['continuous-improvement', 'management-system'], C),
  practice(8, 'danaher-total-productive-maintenance', 'Total Productive Maintenance (TPM)', D, 'Operações / Lean', 'Literatura lean; referências de treinamento DBS', 'Troca manutenção reativa por prevenção compartilhada com operadores, acompanhada por OEE. Integra manutenção, qualidade, capacitação e segurança ao sistema diário de gestão.', ['continuous-improvement', 'management-system'], C),
  practice(9, 'danaher-poka-yoke', 'Mistake Proofing (Poka-Yoke)', D, 'Operações / Lean', 'Literatura lean; práticas DBS públicas', 'Redesenha processos para impedir erros ou detectá-los antes de se propagarem. Prioriza prevenção por controle sobre avisos e sobre dependência da vigilância humana.', ['continuous-improvement'], C),
  practice(10, 'danaher-inventory-turns', 'Inventory Turns Optimization', D, 'Operações / Lean', 'Relatórios anuais Danaher; HBS; apresentações a investidores', 'Melhora giro por pull, lotes menores, lead times comprimidos e sinais de demanda confiáveis. A redução de estoque libera caixa para o motor de aquisições e evidencia resultados do DBS.', ['continuous-improvement', 'management-system'], MC),
  practice(11, 'danaher-supplier-development', 'Supplier Management / Supplier Development', D, 'Operações / Lean', 'HBS; literatura de supply chain', 'Estende kaizen, Standard Work e gestão visual a fornecedores estratégicos por eventos conjuntos e métricas compartilhadas. Busca capacidade sustentável, qualidade e lead time, não apenas redução pontual de preço.', ['continuous-improvement', 'management-system'], MC),
  practice(12, 'danaher-policy-deployment', 'Policy Deployment (Hoshin Kanri)', D, 'Estratégia / Planejamento', 'HBS; estratégia lean; apresentações a investidores', 'Traduz direção de três a cinco anos em poucos objetivos anuais e prioridades desdobradas por catchball bidirecional. X-matrix ou A3 conecta objetivos, iniciativas, métricas e backlog de melhoria.', ['purpose-direction', 'management-system'], MC),
  practice(13, 'danaher-tollgate-reviews', 'Tollgate Reviews (Stage-Gate Process)', D, 'Estratégia / Planejamento', 'HBS; referências de desenvolvimento de produto DBS', 'Checkpoints avaliam entregas e critérios explícitos antes de avançar produtos, integrações ou projetos. Dados de cliente, recursos e decisões go/no-go reduzem o custo de insistir em projetos fracos.', ['management-system', 'innovation-growth'], M),
  practice(14, 'danaher-80-20-prioritization', '80/20 Prioritization', D, 'Estratégia / Planejamento', 'Referências de gestão Danaher; estratégia lean', 'Aplica Pareto a produtos, clientes, geografias e processos para concentrar recursos no que mais gera valor. A simplificação reduz complexidade e favorece poucas prioridades bem executadas.', ['purpose-direction', 'management-system'], MC),
  practice(15, 'danaher-voice-of-customer', 'Voice of the Customer (VoC)', D, 'Crescimento / Comercial', 'HBS 9-708-445 e sequências; McKinsey; relatórios anuais Danaher', 'Observação direta no contexto do cliente e entrevistas abertas revelam necessidades declaradas, reais e latentes. Esses dados orientam inovação e transformam excelência operacional em sistema de crescimento.', ['innovation-growth', 'purpose-direction'], M),
  practice(16, 'danaher-breakthrough-innovation-types', 'Breakthrough Innovation — Tipo I e Tipo II', D, 'Crescimento / Comercial', 'HBS; Danaher Investor Day', 'Distingue inovação em mercados atuais, gerida por stage-gate, daquela em novos mercados ou modelos, conduzida por hipóteses e ciclos rápidos. Cada tipo recebe métricas, recursos e tolerância a incerteza adequados.', ['innovation-growth'], M),
  practice(17, 'danaher-commercial-excellence', 'Commercial Excellence (ComEx)', D, 'Crescimento / Comercial', 'Relatórios anuais Danaher; apresentações a investidores; McKinsey', 'Aplica Standard Work, gestão visual e melhoria de processos a marketing, vendas, preço e retenção. Trata crescimento comercial como sistema operacional mensurável.', ['innovation-growth', 'management-system', 'continuous-improvement'], MC),
  practice(18, 'danaher-demand-generation', 'Demand Generation', D, 'Crescimento / Comercial', 'Materiais DBS públicos; apresentações a investidores', 'Gerencia geração e conversão de demanda como fluxo, medindo throughput, yield, cycle time e trabalho em progresso. Define handoffs entre marketing e vendas e usa VoC na comunicação.', ['innovation-growth', 'management-system'], MC),
  practice(19, 'danaher-sales-force-effectiveness', 'Sales Force Effectiveness (SFE)', D, 'Crescimento / Comercial', 'Materiais DBS; apresentações a investidores; literatura ComEx', 'Estrutura territórios, cotas, atividade, pipeline, dados de CRM e coaching de campo. Mede conversões e melhora gargalos comerciais como em um sistema de produção.', ['innovation-growth', 'management-system', 'continuous-improvement'], MC),
  practice(20, 'danaher-market-segmentation', 'Market Segmentation', D, 'Crescimento / Comercial', 'HBS; ferramentas de crescimento DBS', 'Segmenta clientes por necessidades e disposição a pagar, com base em dados e VoC. O ranking de segmentos e posição competitiva orienta recursos, produto e aquisições.', ['purpose-direction', 'innovation-growth'], M),
  practice(21, 'danaher-product-life-cycle-management', 'Product Life Cycle Management (PLCM)', D, 'Crescimento / Comercial', 'Referências DBS; literatura de gestão de produto', 'Classifica produtos por atratividade e posição competitiva para decidir investir, sustentar, colher ou retirar. Expõe subsídios cruzados, racionaliza SKUs e disciplina a entrada de novos produtos.', ['innovation-growth', 'management-system'], M),
  practice(22, 'danaher-leadership-assessment-process', 'Leadership Assessment Process (LAP)', D, 'Liderança / Talento / Pessoas', 'HBS; referências de talentos Danaher', 'Avalia separadamente performance e potencial por competências coerentes com a cultura kaizen. Entrevistas, 360 e calibração transformam alinhamento ao DBS em pauta formal de desenvolvimento.', ['people-culture', 'management-system'], M),
  practice(23, 'danaher-practitioner-certification', 'DBS Practitioner Certification', D, 'Liderança / Talento / Pessoas', 'HBS; referências de gestão Danaher', 'Certifica competências DBS em níveis, da formação gerencial a experiências prolongadas no DBS Office e domínio como Fellow. Distribui capacidade de melhoria entre negócios e futuros líderes.', ['people-culture', 'continuous-improvement'], MC),
  practice(24, 'danaher-dbs-office', 'DBS Office Structure', D, 'Liderança / Talento / Pessoas', 'HBS; referências organizacionais Danaher', 'Uma estrutura corporativa mantém padrões, currículo e qualidade, enquanto líderes DBS integram os times de P&L nas operações. O desenho mantém o sistema próximo da estratégia e da execução.', ['management-system', 'people-culture', 'continuous-improvement'], MC),
  practice(25, 'danaher-leaders-teaching-leaders', '"Leaders Teaching Leaders"', D, 'Liderança / Talento / Pessoas', 'HBS; filosofia de gestão Danaher', 'Líderes operacionais, inclusive executivos seniores, ensinam e praticam DBS pessoalmente. Isso conecta conteúdo à realidade, sinaliza expectativa cultural e desenvolve capacidade de coaching.', ['people-culture', 'continuous-improvement'], MC),
  practice(26, 'danaher-top-talent-review', 'Top Talent Review (TTR) / Succession Planning', D, 'Liderança / Talento / Pessoas', 'HBS; práticas de talentos Danaher', 'Revisa anualmente performance, potencial, risco e sucessão de líderes críticos. Ações de desenvolvimento e mobilidade entre negócios constroem capacidade e difundem a cultura DBS.', ['people-culture', 'management-system'], M),
  practice(27, 'danaher-360-feedback', '360-Degree Feedback', D, 'Liderança / Talento / Pessoas', 'Práticas de talentos Danaher; HBS', 'Coleta feedback de gestor, pares e liderados sobre competências DBS e o converte em coaching. Vinculá-lo ao desenvolvimento, não à remuneração, reduz distorções e revela padrões culturais.', ['people-culture'], M),
  practice(28, 'danaher-acquisition-integration-playbook', 'Acquisition Integration Playbook', D, 'M&A / Integração', 'HBS; McKinsey M&A; apresentações Danaher', 'Integra aquisições com velocidade, avaliação de maturidade e implantação DBS-first, preservando autonomia comercial e de produto. Ferramentas visíveis e avaliação de líderes estabelecem credibilidade e direção cultural.', ['management-system', 'people-culture', 'continuous-improvement'], MC),
  practice(29, 'danaher-acquisition-targeting', 'Acquisition Targeting Framework', D, 'M&A / Integração', 'HBS; The Outsiders; apresentações a investidores', 'Seleciona bons mercados e negócios com receita recorrente, posição defensável e espaço para melhoria via DBS. Avalia tanto fundamentos econômicos quanto capacidade de absorver o sistema.', ['purpose-direction', 'innovation-growth'], M),
  practice(30, 'danaher-fcf-conversion', 'Free Cash Flow Conversion Discipline', D, 'Finanças', 'Relatórios anuais Danaher; HBS; The Outsiders', 'Conecta giro, recebíveis, capex e kaizen à conversão consistente de lucro em caixa. O foco em FCF por ação sustenta aquisições e disciplina a alocação de capital.', ['management-system', 'continuous-improvement'], MC),
  practice(31, 'abi-dream-people-culture', 'Dream-People-Culture Framework', A, 'Cultura / Liderança', 'Dream Big; relatórios anuais AB InBev; HBS', 'Integra ambição de longo prazo, seleção e desenvolvimento de pessoas e normas culturais codificadas. Os três elementos organizam metas, talentos e comportamento em um sistema coerente.', ['purpose-direction', 'people-culture', 'management-system'], M),
  practice(32, 'abi-ten-principles', 'Os 10 Princípios', A, 'Cultura / Liderança', 'Dream Big; relatórios anuais AB InBev; literatura 3G Capital', 'Codificam expectativas sobre sonho, pessoas, melhoria, consumidor, custos, ownership, simplicidade, exemplo e comunidades. Funcionam como referência comportamental ligada a práticas concretas de gestão.', ['people-culture', 'purpose-direction'], M),
  practice(33, 'abi-ownership-mentality', 'Ownership Mentality', A, 'Cultura / Liderança', 'Dream Big; HBS; Bloomberg Businessweek', 'Espera que decisões, custos e resultados sejam tratados como por proprietários, no nível mais próximo da informação. Remuneração de longo prazo e frugalidade reforçam a norma.', ['people-culture', 'management-system'], M),
  practice(34, 'abi-meritocracy', 'Meritocracia / Cultura sem Política', A, 'Cultura / Liderança', 'Dream Big; HBS; relatórios anuais AB InBev', 'Baseia contratação, promoção e recompensa em capacidade e desempenho demonstrados, apoiados por calibração transparente. Escalada direta e avaliação de comportamento buscam reduzir política e proteção a baixo desempenho.', ['people-culture', 'management-system'], M),
  practice(35, 'abi-management-trainee', 'Management Trainee (MT) Program', A, 'Pessoas / Talento', 'Dream Big; HBS; documentação de talentos AB InBev', 'Seleciona jovens talentos em escala e os desenvolve por rotações, mentoria, responsabilidade real e avaliações culturais. O programa é um canal central de formação de líderes e transmissão do DPC.', ['people-culture'], M),
  practice(36, 'abi-people-review', 'People Review (Avaliação Anual de Talentos)', A, 'Pessoas / Talento', 'HBS; Dream Big; gestão de talentos AB InBev', 'Líderes de linha avaliam resultados e comportamentos de toda a população gerencial, com calibração de performance e potencial. Os resultados determinam desenvolvimento, promoção e decisões de saída.', ['people-culture', 'management-system'], M),
  practice(37, 'abi-stretch-goals', 'STRETCH Goals / Processo de Definição de Metas', A, 'Pessoas / Talento', 'Dream Big; HBS; relatórios anuais AB InBev', 'Define metas intencionalmente ambiciosas usando referências externas, para elevar direção e ritmo de melhoria além da capacidade atual. Incentivos reconhecem desempenho extraordinário diante dessa ambição.', ['purpose-direction', 'management-system', 'people-culture'], MC),
  practice(38, 'abi-copy-with-pride', 'Benchmarking Culture ("Copy with Pride")', A, 'Pessoas / Talento', 'Dream Big; HBS', 'Normaliza buscar, atribuir e adaptar práticas de referência externas ou internas. A transferência sistemática reduz curvas de aprendizagem e transforma compartilhamento em contribuição de liderança.', ['people-culture', 'continuous-improvement', 'innovation-growth'], C),
  practice(39, 'abi-internal-mobility', 'Internal Mobility / Job Posting System', A, 'Pessoas / Talento', 'Dream Big; referências de pessoas AB InBev', 'Prioriza vagas internas e movimenta talentos entre funções e geografias em ciclos relativamente curtos. A mobilidade desenvolve generalistas e transporta a cultura para novas operações.', ['people-culture', 'management-system'], M),
  practice(40, 'abi-academic-partnerships', 'Parcerias Acadêmicas (Stanford / Kellogg / INSEAD)', A, 'Pessoas / Talento', 'Documentação de talentos AB InBev; imprensa', 'Programas executivos competitivos conectam líderes de alto potencial a pensamento externo e desafios reais do negócio. O investimento é integrado ao People Review e ao desenvolvimento de sucessores.', ['people-culture', 'innovation-growth'], M),
  practice(41, 'abi-variable-compensation', 'Arquitetura de Remuneração Variável / Ownership Bonus', A, 'Pessoas / Talento', 'Relatórios anuais AB InBev; Dream Big', 'Combina alta alavancagem variável com metas objetivas e incentivos acionários de longo prazo. A arquitetura busca alinhar performance, ownership e criação de valor.', ['people-culture', 'management-system'], M),
  practice(42, 'abi-zero-based-budgeting', 'Zero-Based Budgeting (ZBB)', A, 'Finanças', 'Dream Big; HBS; McKinsey; relatórios anuais AB InBev; Bloomberg', 'Exige justificar cada linha de custo a partir de zero conforme sua contribuição atual à estratégia. Donos nomeados, ownership e meritocracia transformam a mecânica em disciplina recorrente de custos.', ['management-system', 'continuous-improvement'], MC),
  practice(43, 'abi-cash-culture', 'Cash Culture / Disciplina de Capital de Giro', A, 'Finanças', 'Relatórios anuais AB InBev; Bloomberg; FT', 'Acompanha caixa e capital de giro junto ao P&L, disciplinando estoques, recebíveis e pagamentos. A geração de FCF sustenta dívida, retorno a acionistas e novas aquisições.', ['management-system', 'continuous-improvement'], MC),
  practice(44, 'abi-budget-ownership', 'Budget Ownership Architecture', A, 'Finanças', 'Dream Big; práticas financeiras AB InBev', 'Atribui cada linha relevante de custo a uma pessoa, com KPI e revisão de variâncias específicos. Essa granularidade conecta accountability individual, ZBB e remuneração.', ['management-system', 'people-culture'], M),
  practice(45, 'abi-perfect-serve', 'Perfect Serve / Padrões de Execução de Outlet', A, 'Operações / Comercial', 'Documentação comercial AB InBev; trade press; apresentações a investidores', 'Padroniza apresentação e serviço da marca no ponto de consumo, cobrindo copo, temperatura, técnica, higiene e exposição. Auditorias e mystery shopping medem conformidade e consistência da experiência.', ['management-system', 'innovation-growth', 'continuous-improvement'], MC),
  practice(46, 'abi-revenue-management', 'Revenue Management', A, 'Operações / Comercial', 'Relatórios anuais AB InBev; apresentações a investidores; análises da indústria', 'Otimiza preço, embalagem, canal, mix e promoção para elevar receita líquida por hectolitro. Princípios globais são adaptados com dados às condições de cada mercado.', ['innovation-growth', 'management-system'], M),
  practice(47, 'abi-bees-platform', 'Plataforma BEES', A, 'Operações / Comercial', 'Relatórios anuais AB InBev; apresentações a investidores; tech press', 'Digitaliza pedidos B2B e cria relação direta e dados first-party sobre varejistas, produtos e promoções. A evolução para marketplace adiciona novos fluxos de receita e efeitos de rede.', ['innovation-growth', 'management-system'], M),
  practice(48, 'abi-channel-playbooks', 'Playbooks On-Trade vs. Off-Trade', A, 'Operações / Comercial', 'Apresentações a investidores; estratégia comercial AB InBev', 'Separa equipes, orçamentos, KPIs e modos de execução para consumo no local e varejo. Cada canal recebe ferramentas próprias, preservando sua interdependência na construção de marca e volume.', ['innovation-growth', 'management-system'], M),
  practice(49, 'abi-commercial-heartbeat', 'Market Share Tracking / Commercial Heartbeat', A, 'Operações / Comercial', 'Relatórios anuais AB InBev; apresentações a investidores', 'Monitora share de volume e valor em alta frequência, junto a indicadores operacionais e comerciais. Cadências estruturadas tornam desvios visíveis e acionam resposta rápida.', ['management-system', 'continuous-improvement', 'innovation-growth'], MC),
  practice(50, 'abi-key-account-management', 'Key Account Management (KAM)', A, 'Operações / Comercial', 'Estratégia comercial AB InBev; trade press', 'Estrutura contas globais, nacionais e locais com planejamento conjunto, gestão de categoria e termos ligados a desempenho. Usa escala e análise para aprofundar relações com grandes clientes.', ['innovation-growth', 'management-system'], M),
  practice(51, 'abi-dream-driven-planning', 'Dream-Driven Strategic Planning', A, 'Estratégia / M&A', 'Dream Big; relatórios anuais AB InBev; HBS', 'Começa por uma ambição de longo prazo incomumente alta e trabalha de trás para frente para definir capacidades, investimentos e aquisições. A lógica dream-first evita limitar a estratégia ao estado atual.', ['purpose-direction', 'management-system'], M),
  practice(52, 'abi-culture-transplant-integration', 'M&A Integration via Culture Transplant', A, 'Estratégia / M&A', 'HBS; Bloomberg; FT; Dream Big', 'Integra aquisições movendo líderes formados na cultura e implantando rapidamente princípios, ZBB e meritocracia. Pessoas são o principal vetor de padronização e captura de sinergias.', ['people-culture', 'management-system'], M),
  practice(53, 'abi-portfolio-brand-architecture', 'Portfolio Brand Architecture (Global / International / Local Champions)', A, 'Estratégia / M&A', 'Relatórios anuais AB InBev; apresentações a investidores; análises da indústria', 'Classifica marcas globais, internacionais e campeãs locais para orientar investimento, premiumização e geração de caixa. A arquitetura evita dispersão de recursos em portfólios adquiridos.', ['purpose-direction', 'innovation-growth', 'management-system'], M),
  practice(54, 'abi-global-innovation-process', 'Global Innovation Process / Breakthrough Innovation', A, 'Inovação', 'Relatórios anuais AB InBev; apresentações a investidores; trade press', 'Conduz insights, protótipos, pilotos e gates scale-or-fail com dados antecipados de mercado. Protege orçamento de inovação dentro do ZBB para equilibrar incerteza e disciplina.', ['innovation-growth', 'management-system'], MC),
  practice(55, 'abi-zx-ventures', 'ZX Ventures (Braço de Venture / Incubação)', A, 'Inovação', 'Relatórios anuais AB InBev; tech press; imprensa de investimentos', 'Unidade semi-autônoma investe, incuba e adquire negócios além da cerveja tradicional. Governança e recursos separados protegem experimentação de pressões operacionais de curto prazo.', ['innovation-growth'], M),
]

export interface PracticeFilters {
  system?: PracticeSystem
  area?: string
  pillarId?: PillarId
  engineId?: EngineId
  search?: string
}

export function getPractice(id: string): Practice | undefined {
  return practices.find(item => item.id === id)
}

export function listPractices(filters: PracticeFilters = {}): Practice[] {
  const search = filters.search?.trim().toLocaleLowerCase('pt-BR')
  return practices.filter(item =>
    (!filters.system || item.system === filters.system) &&
    (!filters.area || item.area === filters.area) &&
    (!filters.pillarId || item.pillarIds.includes(filters.pillarId)) &&
    (!filters.engineId || item.engineIds.includes(filters.engineId)) &&
    (!search || `${item.title} ${item.summary} ${item.area}`.toLocaleLowerCase('pt-BR').includes(search))
  )
}

export function practicesByPillar(pillarId: PillarId): Practice[] {
  return listPractices({ pillarId })
}

export function methodologyStats(items: Practice[] = practices): MethodologyStats {
  const bySystem: MethodologyStats['bySystem'] = { danaher: 0, abi: 0 }
  const byPillar = Object.fromEntries(pillars.map(item => [item.id, 0])) as MethodologyStats['byPillar']
  const byEngine = Object.fromEntries(engines.map(item => [item.id, 0])) as MethodologyStats['byEngine']
  const byArea: Record<string, number> = {}

  for (const item of items) {
    bySystem[item.system] += 1
    item.pillarIds.forEach(id => { byPillar[id] += 1 })
    item.engineIds.forEach(id => { byEngine[id] += 1 })
    byArea[item.area] = (byArea[item.area] ?? 0) + 1
  }

  return { totalPractices: items.length, bySystem, byPillar, byEngine, byArea }
}

export function validateMethodology(): void {
  const pillarIds = new Set(pillars.map(item => item.id))
  const engineIds = new Set(engines.map(item => item.id))
  const stageIds = new Set(journeyStages.map(item => item.id))
  const practiceIds = new Set<string>()
  const practiceNumbers = new Set<number>()

  if (pillarIds.size !== pillars.length || engineIds.size !== engines.length || stageIds.size !== journeyStages.length) {
    throw new Error('Alquemia: ids duplicados no backbone metodológico')
  }

  for (const item of practices) {
    if (practiceIds.has(item.id)) throw new Error(`Alquemia: id de prática duplicado: ${item.id}`)
    if (practiceNumbers.has(item.number)) throw new Error(`Alquemia: número de prática duplicado: ${item.number}`)
    if (!item.pillarIds.length || !item.engineIds.length) throw new Error(`Alquemia: prática sem referências: ${item.id}`)
    item.pillarIds.forEach(id => {
      if (!pillarIds.has(id)) throw new Error(`Alquemia: pilar inválido em ${item.id}: ${id}`)
    })
    item.engineIds.forEach(id => {
      if (!engineIds.has(id)) throw new Error(`Alquemia: motor inválido em ${item.id}: ${id}`)
    })
    practiceIds.add(item.id)
    practiceNumbers.add(item.number)
  }
}

validateMethodology()
