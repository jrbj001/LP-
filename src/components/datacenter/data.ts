import {
  Home, FileBarChart, Cpu, Server, Wallet, Layers, Globe, Target, Users, FileText,
  type LucideIcon,
} from 'lucide-react'

export const SPACE_PASSWORD = 'fundamentos2026'

export const META = {
  product: 'Edge DC BR',
  trademark: 'Adaptive Layer™',
  title: 'Edge DC BR · ilha de AI',
  tagline: 'Colo edge com âncora Eletronet. Inferência soberana em 2–4 racks. Adaptive Layer como SVA.',
  passwordHint: 'JV Fundamentos × PixelPulseLab × Bravo',
}

export const CLIENT = {
  name: 'Edge DC BR',
  sector: 'JV · infraestrutura digital + runtime de IA',
  facilitator: { name: 'José Roberto', role: 'PixelPulseLab', initials: 'JR' },
}

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  section: 'main' | 'workspace'
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '', icon: Home, section: 'main' },
  { label: 'Proposta atual', href: '/proposta', icon: FileBarChart, section: 'main' },
  { label: 'Blueprint AI', href: '/blueprint', icon: Cpu, section: 'main' },
  { label: 'Hardware', href: '/hardware', icon: Server, section: 'main' },
  { label: 'Investimento', href: '/investimento', icon: Wallet, section: 'main' },
  { label: 'Adaptive Layer', href: '/layer', icon: Layers, section: 'main' },
  { label: 'Mercado', href: '/mercado', icon: Globe, section: 'workspace' },
  { label: 'GTM', href: '/gtm', icon: Target, section: 'workspace' },
  { label: 'Governança', href: '/governanca', icon: Users, section: 'workspace' },
  { label: 'Documentos', href: '/documentos', icon: FileText, section: 'workspace' },
]

export const VERDICT = {
  headline: 'É um bom negócio como ilha de inferência sobre o colo — não como pivot total para GPU cloud.',
  body: 'Hospedar os próprios modelos e vender B2B não é o mesmo que ser um data center de AI. O piloto de R$ 17M paga facility, não GPU. Pixel vende runtime (tokens, agentes, LGPD). Fundamentos opera o prédio. Bravo traz o imóvel.',
}

export const CURRENT_PILOT = {
  sites: [
    { name: 'Jundiaí', role: 'Polo industrial, logística e e-commerce', racks: 20, capex: 8_500_000 },
    { name: 'Santos', role: 'Corredor portuário, operação crítica', racks: 20, capex: 8_500_000 },
  ],
  racks: 40,
  latency: '<10 ms até a capital saturada',
  ticketBase: 5_000,
  sva: 0.2,
  ticketEffective: 6_000,
  capexFacility: 17_000_000,
  opexShare: 0.45,
  taxShare: 0.15,
  startYear: 2027,
  anchor: {
    name: 'Eletronet',
    racks: 12,
    split: '6 Jundiaí + 6 Santos',
    annual: 720_000,
  },
  sources: [
    'Apresentação Rio Bravo · DC Edge · 11/06/2026 (Alexandre)',
    'Análise de viabilidade Jundiaí + Santos · 09/06/2026 (base 08/06/2026, Opex 45% · SVA 20%)',
  ],
}

export const OCCUPANCY = [
  { year: 2027, n: 1, racks: 8, occupancy: 0.2, months: 9, revenue: 432_000 },
  { year: 2028, n: 2, racks: 18, occupancy: 0.45, months: 12, revenue: 1_296_000 },
  { year: 2029, n: 3, racks: 28, occupancy: 0.7, months: 12, revenue: 2_016_000 },
  { year: 2030, n: 4, racks: 31, occupancy: 0.78, months: 12, revenue: 2_246_400 },
  { year: 2031, n: 5, racks: 34, occupancy: 0.86, months: 12, revenue: 2_476_800 },
  { year: 2032, n: 6, racks: 37, occupancy: 0.92, months: 12, revenue: 2_649_600 },
  { year: 2033, n: 7, racks: 38, occupancy: 0.95, months: 12, revenue: 2_736_000 },
  { year: 2034, n: 8, racks: 38, occupancy: 0.95, months: 12, revenue: 2_736_000 },
  { year: 2035, n: 9, racks: 39, occupancy: 0.97, months: 12, revenue: 2_793_600 },
  { year: 2036, n: 10, racks: 39, occupancy: 0.97, months: 12, revenue: 2_793_600 },
]

export const TEN_YEAR_TOTALS = {
  revenue: 22_176_000,
  opex: 9_979_200,
  tax: 3_326_400,
  ebitda: 12_196_800,
  net: 8_870_400,
  fcfAfterCapex: -8_129_600,
  costsAllIn: 30_305_600,
}

export const DILIGENCE_FLAGS = [
  {
    id: 'fcf',
    title: 'Payback do deck ≠ FCF',
    detail:
      'O deck vende payback em 5–6 anos e valuation de R$ 61,1M. O memo, em fluxo de caixa livre, mostra CapEx de R$ 17M não recuperado em 10 anos (FCF −R$ 8,1M). O modelo interno acumula EBITDA e infla o retorno intermediário.',
  },
  {
    id: 'multiple',
    title: '10× EBITDA acumulado não é métrica de mercado',
    detail:
      'R$ 61,1M = 10× a soma de EBITDAs até 2032, não 10× o run-rate. Run-rate do ano 6 (EBITDA R$ 1,46M) × 10 ≈ R$ 14,6M — ainda otimista, e distante dos R$ 61M. O space não endossa o múltiplo acumulado.',
  },
  {
    id: 'sva',
    title: 'SVA 20% é um número vazio',
    detail:
      'R$ 1.000 extra por rack sem produto. A ilha de inferência + Adaptive Layer™ é o SVA real — tokens, agentes e residência LGPD, não um markup genérico.',
  },
  {
    id: 'power',
    title: 'CapEx de facility não inclui GPU',
    detail:
      'Os R$ 17M cobrem obra, energia de colo, refrigeração de ar, conectividade e segurança. Quatro racks a 40–80 kW pedem estudo elétrico/HVAC antes de qualquer BOM de GPU.',
  },
]

export const SEGMENTS = [
  { name: 'Telecom (Eletronet, TIM, ISPs)', share: '30%' },
  { name: '5G mobile operators', share: '15%' },
  { name: 'Streaming / CDN', share: '15%' },
  { name: 'Fintechs', share: '10%' },
  { name: 'E-commerce', share: '10%' },
  { name: 'Hyperscale overflow', share: '10%' },
  { name: 'Retail & local commerce', share: '10%' },
]

export const ROADMAP = [
  { phase: 'Piloto', racks: 20, where: 'Jundiaí + Santos', note: 'Âncora Eletronet' },
  { phase: 'Expansão', racks: 60, where: 'SP + RJ', note: 'Novos telcos' },
  { phase: 'Consolidação', racks: 120, where: 'Capitais', note: 'Break-even operacional no deck' },
  { phase: 'Maturação', racks: 400, where: '20 sites nacionais', note: 'Alvo 2032 no deck: ~R$ 611M valuation' },
]

export const OFFERS = [
  {
    id: 'colo',
    name: 'Colo edge',
    who: 'Bravo + Fundamentos',
    verdict: 'Manter',
    detail: 'Aluguel de rack, energia e latência. Commodity, ticket baixo, payback longo. Faz sentido se o imóvel e a energia já existem.',
  },
  {
    id: 'gpu-cloud',
    name: 'GPU cloud',
    who: 'CoreWeave, Lambda, Nebius',
    verdict: 'Não copiar a escala',
    detail: 'Vender hora de GPU exige MW, líquido, estoque NVIDIA e utilização >60%. Quarenta racks e R$ 17M não competem com isso.',
  },
  {
    id: 'inference',
    name: 'Inferência soberana + software',
    who: 'PixelPulseLab',
    verdict: 'O encaixe',
    detail: 'Hospedar modelos e agentes da Adaptive Layer™ para B2B brasileiro. A GPU é custo do produto, não o produto.',
  },
]

export const BOM = [
  {
    id: 'power',
    title: 'Potência',
    spec: 'Confirmar ≥500 kW IT com N+1 nos dois imóveis',
    note: 'Colo clássico 5–8 kW/rack. GPU 40–80 kW/rack. Quatro racks AI podem gastar mais que os 36 de colo.',
  },
  {
    id: 'cooling',
    title: 'Refrigeração',
    spec: 'Ar no colo · rear-door ou DLC na ilha',
    note: 'Item sozinho: faixa R$ 1–3M extra. Sem líquido, densidade de inferência não cabe.',
  },
  {
    id: 'compute',
    title: 'Compute (inferência-first)',
    spec: '2 servidores 8× GPU classe L40S / H100 NVL · 16 GPUs',
    note: 'Treino denso (H100/B200 cluster) fica fora do piloto. Um site primeiro, o segundo depois.',
  },
  {
    id: 'network',
    title: 'Rede',
    spec: '100/400 GbE ou InfiniBand só dentro da ilha',
    note: 'Para o cliente, vale o anel do deck: IX, NIC.BR, ISPs e 5G. Fabric GPU não atravessa o colo telco.',
  },
  {
    id: 'storage',
    title: 'Storage',
    spec: 'NVMe local para pesos + object store para artefatos',
    note: 'Modelos e checkpoints versionados por tenant. Sem isso o gateway não tem chão.',
  },
  {
    id: 'serving',
    title: 'Software de serving',
    spec: 'Kubernetes + vLLM / NIM / KServe',
    note: 'Adaptive Layer™ é o gateway: auth, tenant, auditoria, LGPD. Não compete com HVAC.',
  },
]

export const SCENARIOS = [
  {
    id: 'A',
    name: 'Colo puro',
    recommended: false,
    capex: 'R$ 17M',
    capexNote: 'Facility do PDF. Sem GPU.',
    revenue: 'R$ 6 mil / rack / mês',
    payback: 'FCF negativo em 10 anos sem exit',
    use: 'Tese Rio Bravo original. Âncora Eletronet. Não cria SVA de IA.',
  },
  {
    id: 'B',
    name: 'Híbrido',
    recommended: true,
    capex: 'R$ 23–32M',
    capexNote: 'R$ 17M facility + R$ 5–12M GPU/servidores + R$ 1–3M líquido/elétrica.',
    revenue: 'Colo R$ 6 mil/rack + inferência em R$/1k tokens ou agente/mês',
    payback: 'Depende de utilização da ilha e estudo elétrico',
    use: '36 racks telco + 2–4 racks densos. Recomendado para a JV.',
  },
  {
    id: 'C',
    name: 'AI-first',
    recommended: false,
    capex: 'Dezenas de milhões acima do piloto',
    capexNote: 'MW, líquido em todos os racks, estoque NVIDIA. Fora do R$ 17M.',
    revenue: 'GPU-hora contra AWS São Paulo',
    payback: 'Só com utilização >60% e energia barata — não é este piloto',
    use: 'Descartar no piloto. Copiar SKU de CoreWeave, não o capex.',
  },
]

export const HYBRID_LAYOUT = {
  coloRacks: 36,
  aiRacks: '2–4',
  densityColo: '5–8 kW',
  densityAi: '40–80 kW',
  gpuCount: 16,
  commercial: 'R$/1k tokens ou R$ por agente/mês — não commodity de GPU-hora',
}

export const HARDWARE_CAVEAT =
  'SKU-classe e faixas, não RFQ. Sem estudo elétrico/HVAC dos imóveis o BOM não fecha. Um site primeiro (Jundiaí ou Santos); o segundo só replica.'

export const HARDWARE_TRACKS = [
  {
    id: 'l40s',
    name: 'Pista inferência',
    recommended: true,
    gpu: '16× L40S 48GB PCIe',
    racks: '2 ativos + 2 reservados',
    itKw: '14–18 kW',
    facilityKw: '20–27 kW',
    cooling: 'Rear-door ou DLC leve',
    capex: 'R$ 5–8M compute+rede · R$ 1–2M líquido/elétrica',
    use: 'Piloto. Serving vLLM, agentes Adaptive Layer, residência LGPD.',
  },
  {
    id: 'h100',
    name: 'Pista dense',
    recommended: false,
    gpu: '16× H100 NVL / HGX equivalente',
    racks: '2–3 ativos',
    itKw: '28–40 kW',
    facilityKw: '40–60 kW',
    cooling: 'DLC (CDU + cold plate) obrigatório',
    capex: 'R$ 9–12M compute+rede · R$ 2–3M líquido/elétrica',
    use: 'Só se o imóvel entregar a potência e houver fila de tokens. Não é o dia 1.',
  },
]

export const HARDWARE_BOM = [
  {
    id: 'rack',
    group: 'Espaço',
    name: 'Rack AI 42U',
    qty: '2 + 2 reservados',
    spec: '800 × 1200 mm, 60–80 kW rated, porta perfurada ou manifold DLC',
    note: 'Dois no piloto. Dois U-space vazios no hall para não recortar o colo depois.',
  },
  {
    id: 'gpu',
    group: 'Compute',
    name: 'Servidor 8× GPU',
    qty: '2',
    spec: '8× L40S 48GB (pista A) ou 8× H100 NVL (pista B) · 2× CPU · ≥2 TB RAM · 8× NVMe 3,84 TB',
    note: '16 GPUs no total. Inferência, não treino. BMC/Redfish ligado ao DCIM.',
  },
  {
    id: 'ctrl',
    group: 'Compute',
    name: 'Control plane',
    qty: '2',
    spec: 'Dual socket, 512 GB, 4× NVMe, 10/25 GbE · Kubernetes + Adaptive Layer',
    note: 'Ar, não líquido. Pode morar num rack colo ao lado da ilha.',
  },
  {
    id: 'leaf-gpu',
    group: 'Rede',
    name: 'Leaf GPU (east-west)',
    qty: '1',
    spec: '32× 400 GbE ou InfiniBand NDR · só dentro da ilha',
    note: 'Não atravessa o colo telco. RAFT/all-reduce de serving fica aqui.',
  },
  {
    id: 'leaf-front',
    group: 'Rede',
    name: 'Leaf north-south',
    qty: '1',
    spec: '100 GbE para meet-me Eletronet / IX / NIC.BR',
    note: 'O cliente vê a rede do deck. A fabric GPU é invisível.',
  },
  {
    id: 'nic',
    group: 'Rede',
    name: 'NICs',
    qty: 'por nó',
    spec: '2× 400 GbE (ou IB) no GPU server + 2× 100 GbE frontend',
    note: 'Bond e failover. Sem isso o serving vira ilha isolada.',
  },
  {
    id: 'nvme',
    group: 'Storage',
    name: 'NVMe local',
    qty: 'incluso nos GPU servers',
    spec: '≥30 TB brutos por chassis para pesos quentes',
    note: 'Modelos do tenant no disco, não na API pública.',
  },
  {
    id: 'object',
    group: 'Storage',
    name: 'Object store',
    qty: '1 cluster',
    spec: '100–200 TB usable · MinIO/Ceph ou NAS do colo',
    note: 'Artefatos, checkpoints, auditoria. Replica para o segundo site só depois.',
  },
  {
    id: 'cdu',
    group: 'Cooling',
    name: 'CDU + manifolds (DLC)',
    qty: '1 + loops',
    spec: 'Facility water ou dry-cooler · 40–80 kW de capacidade, mesmo se o dia 1 for 20 kW',
    note: 'Pista L40S pode começar em rear-door. Pista H100 não.',
  },
  {
    id: 'rdhx',
    group: 'Cooling',
    name: 'Rear-door heat exchanger',
    qty: '2',
    spec: 'Porta ativa 30–50 kW · água gelada do CRAH',
    note: 'Plano B da pista inferência. Mais barato, teto térmico menor.',
  },
  {
    id: 'pdu',
    group: 'Energia',
    name: 'PDU 3φ metered',
    qty: '4 (A+B × 2 racks)',
    spec: '60 A por feed, outlets C13/C19, SNMP/Modbus',
    note: 'N+1 de feed. Sem medição por rack a Layer não tem kW de verdade.',
  },
  {
    id: 'ups',
    group: 'Energia',
    name: 'UPS / ATS (quota da ilha)',
    qty: 'share da facility',
    spec: 'Confirmar ≥500 kW IT N+1 no imóvel · reserva de 40–80 kW para a ilha',
    note: 'Os R$ 17M do PDF cobrem colo. Este item é o gap a validar no estudo.',
  },
  {
    id: 'dcim',
    group: 'Ops',
    name: 'DCIM + sensores',
    qty: 'ilha',
    spec: 'PUE, kW, °C, umidade, leak detect, occupancy',
    note: 'Eventos para a Adaptive Layer. Sem isso o DC não é fonte da Layer.',
  },
  {
    id: 'cage',
    group: 'Ops',
    name: 'Gaiola / segurança',
    qty: '1',
    spec: 'Cercado da ilha, crachá, câmera, extinção in-rack',
    note: 'Separar fisicamente GPU do colo telco. LGPD e seguro.',
  },
]

export const POWER_BUDGET = [
  { line: '16 GPUs (TDP)', l40s: '5,6 kW', h100: '6,4–11 kW' },
  { line: '2 chassis GPU (CPU, FAN, NIC, NVMe)', l40s: '+4–6 kW', h100: '+12–16 kW' },
  { line: 'Control plane + storage + switches', l40s: '4–5 kW', h100: '4–5 kW' },
  { line: 'IT total (ordem de grandeza)', l40s: '14–18 kW', h100: '28–40 kW' },
  { line: 'Facility com PUE 1,3–1,5', l40s: '20–27 kW', h100: '40–60 kW' },
  { line: 'Teto do hall (4 racks densos)', l40s: 'até 80 kW se crescer', h100: 'até 80 kW se crescer' },
]

export const RACK_A = [
  { u: '41–42', label: 'PDU A+B', kind: 'power' },
  { u: '39–40', label: 'ToR 400G / IB', kind: 'net' },
  { u: '37–38', label: 'ToR 100G north-south', kind: 'net' },
  { u: '27–34', label: 'GPU-2 · 8× L40S/H100', kind: 'gpu' },
  { u: '17–24', label: 'GPU-1 · 8× L40S/H100', kind: 'gpu' },
  { u: '09–12', label: 'Manifold DLC / patch', kind: 'cool' },
  { u: '01–04', label: 'Cable + leak detect', kind: 'ops' },
]

export const RACK_B = [
  { u: '41–42', label: 'PDU A+B', kind: 'power' },
  { u: '33–40', label: 'CDU (se DLC)', kind: 'cool' },
  { u: '29–32', label: 'Object store / NAS head', kind: 'storage' },
  { u: '21–24', label: 'Control plane 2', kind: 'ctrl' },
  { u: '17–20', label: 'Control plane 1', kind: 'ctrl' },
  { u: '09–12', label: 'OOB / console / DCIM', kind: 'ops' },
  { u: '01–04', label: 'Spare U (expansão)', kind: 'ops' },
]

export const LAYER_EVENTS = [
  { name: 'Facility', detail: 'PUE, kW, temperatura, occupancy — o DC vira fonte da Layer, como o ERP.' },
  { name: 'Inference gateway', detail: 'Isolamento por tenant, o mesmo desenho de LGPD da Banana Brasil.' },
  { name: 'Agentes no edge', detail: 'Orfeu e demais clientes apontam o runtime para Jundiaí/Santos, não só OpenAI.' },
  { name: 'Cadence ops', detail: 'Specs agent-ready para NOC, energia e incidente — ops do DC, não só software de cliente.' },
]

export const ANALOGIES = [
  {
    name: 'Equinix + NVIDIA',
    copy: 'Colo existente + AI-ready (potência/líquido) + Fabric. Não largaram o colo.',
    copyWhat: 'Papel do híbrido',
  },
  {
    name: 'Scala Data Centers',
    copy: 'Campus AI-ready no Brasil. O ativo é imóvel/energia; a GPU muitas vezes é do cliente ou do hyperscaler.',
    copyWhat: 'Quem dona o prédio',
  },
  {
    name: 'CoreWeave / Lambda / Nebius',
    copy: 'GPU cloud puro. Copiar o SKU (instância, SLA, Kubernetes), não o capex.',
    copyWhat: 'Só o SKU',
  },
  {
    name: 'Fireworks / Together / Groq',
    copy: 'Vendem tokens de inferência, não racks. Modelo comercial Pixel.',
    copyWhat: 'Como faturar',
  },
  {
    name: 'OVHcloud / Scaleway',
    copy: 'Cloud regional com GPU e discurso de soberania. Analogia Brasil/LGPD.',
    copyWhat: 'Narrativa soberana',
  },
  {
    name: 'AWS Outposts / Azure Local',
    copy: 'Software de nuvem no hardware do parceiro. Analogia Adaptive Layer no rack da Fundamentos.',
    copyWhat: 'Software no rack alheio',
  },
]

export const MOAT = {
  have: [
    'Latência interior Paulista + porto (<10 ms)',
    'Eletronet já no prédio',
    'LGPD e dado que não pode ir para API pública',
    'Pipeline Pixel (Orfeu, Banana Brasil)',
  ],
  lack: ['Preço de H100 contra AWS São Paulo', 'Escala MW e contrato de supply NVIDIA'],
}

export const GTM = {
  keep: 'Eletronet permanece como âncora de colo. Não pivotar o contrato de 12 racks.',
  sva: 'SVA deixa de ser 20% genérico e vira inferência soberana para clientes Pixel.',
  motion: [
    'Site 1 (Jundiaí ou Santos) recebe a ilha depois do estudo elétrico.',
    'Primeiro workload: agente Adaptive Layer de um cliente já em casa, com dado no Brasil.',
    'Preço em contrato de software (agente/mês ou tokens), com GPU como COGS.',
    'Site 2 replica só se utilização da ilha 1 passar de ~50% em 90 dias.',
  ],
}

export const GOVERNANCE = {
  entities: [
    { name: 'Bravo Imobiliário', role: 'Detentora do ativo e investidora de facility' },
    { name: 'Fundamentos', role: 'Engenharia de infraestrutura · Fabrizio Marini' },
    { name: 'Edge DC BR', role: 'Operação comercial e tecnológica do colo' },
    { name: 'PixelPulseLab', role: 'Plano de controle, serving, Adaptive Layer™, venda B2B de runtime' },
  ],
  sponsors: [
    { name: 'Clayton Carmo', detail: '30+ anos Telco/IT · Vivo, Algar, Angola Cables' },
    { name: 'Kátia Andrade', detail: '27+ anos B2B Tech · CEMIG, Alloha Fibra' },
    { name: 'Fabrizio Marini', detail: 'CEO Fundamentos · 30+ anos em infraestrutura digital' },
  ],
  org: [
    { seat: 'COO', items: ['NOC', 'Segurança física e lógica', 'HVAC', 'Energia'] },
    { seat: 'CTO', items: ['Rede', 'IXPs', 'Sistemas', 'Ilha GPU + Layer (Pixel)'] },
    { seat: 'CCO', items: ['Vendas B2B colo', 'Telcos/ISPs', 'Runtime Pixel'] },
    { seat: 'CFO', items: ['FP&A', 'Reporte ao fundo', 'Compras e contratos'] },
  ],
}

export const NEXT_STEPS = [
  'Estudo elétrico e HVAC dos dois imóveis (≥500 kW IT, N+1) — bloqueia o BOM.',
  'Due diligence técnica e financeira (semanas 1–2 do deck).',
  'Revisão jurídica da JV: Bravo / Fundamentos / Edge DC BR / Pixel.',
  'Não comprar GPU antes do estudo de potência.',
  'TIR/VPL 12–15% a.a. só depois das faixas de CapEx da ilha fecharem.',
]

export const DOCUMENTS = [
  {
    name: 'Apresentação Rio Bravo · DC Edge',
    date: '11/06/2026',
    href: '/datacenter/rio-bravo-dc-edge.pdf',
    detail: 'Tese, GTM, âncora Eletronet, governança, dashboard para o fundo.',
  },
  {
    name: 'Análise de viabilidade Jundiaí + Santos',
    date: '09/06/2026',
    href: '/datacenter/viabilidade-jundiai-santos.pdf',
    detail: 'Premissas 10 anos, FCF, ressalva de payback e exit.',
  },
]

export function brl(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export function pct(value: number): string {
  return `${Math.round(value * 100)}%`
}
