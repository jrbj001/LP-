export const AVATAR_META = {
  id: 'likeme-avatar-animado',
  title: 'Avatar animado — MENTE & CORPO',
  client: 'Like:Me',
  date: '16/11/2026',
  path: '/avatar-animado',
  sources: [
    'likeme-front-end · AvatarSection, useAnamnesisScores, avatarSizeMapper',
    'likeme-back-end · anamnesisService (scores e markers), schema Prisma',
    'LP-LikeMe · slide “Seu Avatar de bem-estar” da landing',
  ],
}

export type MarkerId =
  | 'purpose-vision'
  | 'self-esteem'
  | 'spirituality'
  | 'connection'
  | 'environment'
  | 'nutrition'
  | 'activity'
  | 'stress'
  | 'sleep'
  | 'smile'

export type Dimension = 'mind' | 'body'
export type Pulse = 'expand' | 'contract' | 'steady'
export type AvatarPhase = 'dormente' | 'despertando' | 'vivo' | 'radiante'

export const MARKERS: { id: MarkerId; label: string; dimension: Dimension | 'link' }[] = [
  { id: 'stress', label: 'Estresse', dimension: 'mind' },
  { id: 'self-esteem', label: 'Autoestima', dimension: 'mind' },
  { id: 'purpose-vision', label: 'Propósito', dimension: 'mind' },
  { id: 'spirituality', label: 'Espiritualidade', dimension: 'mind' },
  { id: 'sleep', label: 'Sono', dimension: 'body' },
  { id: 'nutrition', label: 'Nutrição', dimension: 'body' },
  { id: 'activity', label: 'Atividade', dimension: 'body' },
  { id: 'smile', label: 'Sorriso', dimension: 'body' },
  { id: 'connection', label: 'Conexão', dimension: 'link' },
  { id: 'environment', label: 'Ambiente', dimension: 'link' },
]

/** Percentual alto = marcador saudável (mesma convenção de `getUserMarkers`). */
export type AvatarInput = {
  mind: number
  body: number
  markers: Record<MarkerId, number>
  /** Variação em pontos percentuais no período (semana ou mês). */
  mindDelta: number
  bodyDelta: number
  streakDays: number
  anamnesisCompleted: boolean
}

export type BlobState = {
  level: number
  scale: number
  saturation: number
  wobble: number
  breathSeconds: number
  pulse: Pulse
  colors: { from: string; to: string; glow: string }
}

export type AvatarState = {
  phase: AvatarPhase
  mind: BlobState
  body: BlobState
  /** Intensidade do brilho entre os dois blobs (0–1), vinda de `connection`. */
  link: number
  streakDays: number
  headline: string
}

export const PHASES: Record<AvatarPhase, { label: string; detail: string }> = {
  dormente: { label: 'Dormente', detail: 'Anamnese incompleta. Blobs cinza, sem brilho, respiração mínima.' },
  despertando: { label: 'Despertando', detail: 'Média abaixo de 35%. Cor começa a aparecer, contorno irregular.' },
  vivo: { label: 'Vivo', detail: 'Média entre 35% e 70%. Gradiente pastel, respiração regular.' },
  radiante: { label: 'Radiante', detail: 'Média acima de 70%. Amarelo pleno, glow forte e contorno estável.' },
}

const NEUTRAL = { mind: '#DCDFDA', body: '#E3E4DC' }
const VIVID = { mind: '#DDE6F0', body: '#EDEC80' }
const BASE = { mind: '#D9DDD6', body: '#DADFD7' }

export function clamp(value: number, min = 0, max = 100): number {
  if (Number.isNaN(value)) return min
  return Math.min(max, Math.max(min, value))
}

export function mixHex(from: string, to: string, amount: number): string {
  const t = clamp(amount, 0, 1)
  const parse = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
  const a = parse(from)
  const b = parse(to)
  return `#${a
    .map((channel, i) => Math.round(channel + (b[i] - channel) * t).toString(16).padStart(2, '0'))
    .join('')}`.toUpperCase()
}

function average(values: number[]): number {
  return values.length ? values.reduce((sum, v) => sum + clamp(v), 0) / values.length : 0
}

function pulseFor(delta: number): Pulse {
  if (delta >= 3) return 'expand'
  if (delta <= -3) return 'contract'
  return 'steady'
}

export function phaseFor(input: Pick<AvatarInput, 'mind' | 'body' | 'anamnesisCompleted'>): AvatarPhase {
  if (!input.anamnesisCompleted) return 'dormente'
  const mean = (clamp(input.mind) + clamp(input.body)) / 2
  if (mean < 35) return 'despertando'
  if (mean < 70) return 'vivo'
  return 'radiante'
}

function blobFor(dimension: Dimension, input: AvatarInput, phase: AvatarPhase): BlobState {
  const level = clamp(dimension === 'mind' ? input.mind : input.body)
  const ids = MARKERS.filter(m => m.dimension === dimension).map(m => m.id)
  const calm = average(ids.map(id => input.markers[id])) / 100
  const saturation = phase === 'dormente' ? 0 : level / 100
  const vivid = mixHex(NEUTRAL[dimension], VIVID[dimension], saturation)

  return {
    level,
    scale: Number((0.55 + (level / 100) * 0.6).toFixed(3)),
    saturation,
    wobble: Number((1 - calm).toFixed(3)),
    breathSeconds: phase === 'dormente' ? 8 : Number((3 + calm * 3).toFixed(2)),
    pulse: pulseFor(dimension === 'mind' ? input.mindDelta : input.bodyDelta),
    colors: dimension === 'mind'
      ? { from: BASE.mind, to: vivid, glow: mixHex('#E8E8E0', '#F1F0A8', saturation) }
      : { from: vivid, to: BASE.body, glow: mixHex('#E8E8E0', '#F1F0A8', saturation) },
  }
}

export function headlineFor(input: Pick<AvatarInput, 'mindDelta' | 'bodyDelta' | 'anamnesisCompleted'>): string {
  if (!input.anamnesisCompleted) return 'Seu avatar está esperando para nascer'
  const { mindDelta, bodyDelta } = input
  const best = Math.max(mindDelta, bodyDelta)
  if (best >= 3) {
    const value = Math.round(best)
    return mindDelta >= bodyDelta
      ? `Sua mente acordou ${value}% este mês`
      : `Seu corpo ganhou ${value}% de ritmo este mês`
  }
  if (Math.min(mindDelta, bodyDelta) <= -3) return 'Seu avatar está pedindo uma pausa'
  return 'Seu avatar encontrou equilíbrio'
}

export function deriveAvatarState(input: AvatarInput): AvatarState {
  const phase = phaseFor(input)
  return {
    phase,
    mind: blobFor('mind', input, phase),
    body: blobFor('body', input, phase),
    link: phase === 'dormente' ? 0 : Number((clamp(input.markers.connection) / 100).toFixed(3)),
    streakDays: Math.max(0, Math.round(input.streakDays)),
    headline: headlineFor(input),
  }
}

const markers = (values: number[]): Record<MarkerId, number> =>
  Object.fromEntries(MARKERS.map((m, i) => [m.id, values[i]])) as Record<MarkerId, number>

export const PERSONAS: { id: string; name: string; description: string; input: AvatarInput }[] = [
  {
    id: 'inicio',
    name: 'Início da jornada',
    description: 'Criou a conta, ainda não terminou a anamnese.',
    input: {
      mind: 0,
      body: 0,
      markers: markers([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
      mindDelta: 0,
      bodyDelta: 0,
      streakDays: 0,
      anamnesisCompleted: false,
    },
  },
  {
    id: 'evolucao',
    name: 'Em evolução',
    description: 'Anamnese completa, estresse alto, corpo começando a reagir.',
    input: {
      mind: 32,
      body: 41,
      markers: markers([22, 38, 45, 30, 35, 48, 40, 52, 41, 50]),
      mindDelta: 2,
      bodyDelta: 6,
      streakDays: 5,
      anamnesisCompleted: true,
    },
  },
  {
    id: 'glp1',
    name: 'GLP-1 · semana 8',
    description: 'Programa GLP-1 ativo, nutrição e atividade subindo, mente em ajuste.',
    input: {
      mind: 54,
      body: 67,
      markers: markers([48, 55, 62, 50, 64, 72, 68, 70, 58, 60]),
      mindDelta: 9,
      bodyDelta: 14,
      streakDays: 21,
      anamnesisCompleted: true,
    },
  },
  {
    id: 'radiante',
    name: 'Radiante',
    description: 'Hábitos consistentes há meses e comunidade ativa.',
    input: {
      mind: 84,
      body: 79,
      markers: markers([80, 86, 88, 78, 82, 76, 84, 90, 92, 80]),
      mindDelta: 23,
      bodyDelta: 11,
      streakDays: 63,
      anamnesisCompleted: true,
    },
  },
]

export type DataStatus = 'hoje' | 'derivavel' | 'futuro'

export const DATA_STATUS: Record<DataStatus, { label: string; detail: string }> = {
  hoje: { label: 'Disponível hoje', detail: 'Exposto por API e consumível pelo app.' },
  derivavel: { label: 'Derivável', detail: 'Existe no banco; precisa de cálculo ou endpoint novo.' },
  futuro: { label: 'Futuro', detail: 'Integração ainda inexistente no código.' },
}

export const DATA_INVENTORY: {
  group: string
  source: string
  path: string
  fields: string
  drives: string
  status: DataStatus
  sensitive: boolean
}[] = [
  {
    group: 'Scores MENTE/CORPO',
    source: 'likeme-back-end',
    path: 'src/services/anamnesis/anamnesisService.ts',
    fields: 'mental, physical, mentalPercentage, physicalPercentage',
    drives: 'Tamanho e saturação dos dois blobs',
    status: 'hoje',
    sensitive: true,
  },
  {
    group: '10 marcadores',
    source: 'likeme-back-end',
    path: 'GET /api/anamnesis/markers/user/:userId',
    fields: 'id, percentage, trend',
    drives: 'Deformação, ritmo de respiração e brilho de conexão',
    status: 'hoje',
    sensitive: true,
  },
  {
    group: 'Respostas da anamnese',
    source: 'likeme-back-end',
    path: 'prisma/schema.prisma · anamnesis_user_answer',
    fields: 'questionConceptId, answerOptionId, answerText',
    drives: 'Fase dormente vs ativa; progresso de “nascimento”',
    status: 'hoje',
    sensitive: true,
  },
  {
    group: 'Uso atual no app',
    source: 'likeme-front-end',
    path: 'src/components/sections/avatar/AvatarSection',
    fields: 'mindPercentage, bodyPercentage, hasAnswers',
    drives: 'Ponto de substituição dos PNGs estáticos',
    status: 'hoje',
    sensitive: false,
  },
  {
    group: 'Perfil',
    source: 'likeme-back-end',
    path: 'person',
    fields: 'birthdate, gender, weight, height',
    drives: 'Somente personalização sutil (proporção); nunca exibido no card',
    status: 'derivavel',
    sensitive: true,
  },
  {
    group: 'Objetivos',
    source: 'likeme-back-end',
    path: 'person_category · category',
    fields: 'categoryId, name',
    drives: 'Acessório/aura temática do objetivo principal',
    status: 'derivavel',
    sensitive: false,
  },
  {
    group: 'Agenda e hábitos',
    source: 'likeme-back-end',
    path: 'activity · reminder',
    fields: 'type, startDate, status de lembrete',
    drives: 'Streak de dias e pulso diário',
    status: 'derivavel',
    sensitive: false,
  },
  {
    group: 'Protocolos e assinatura',
    source: 'likeme-back-end',
    path: 'subscription · product (program)',
    fields: 'status, accessValidUntil, programCommunityId',
    drives: 'Selo do programa e marcos de jornada',
    status: 'derivavel',
    sensitive: false,
  },
  {
    group: 'Comunidade',
    source: 'likeme-back-end',
    path: 'community_member · Social Plus (Amity)',
    fields: 'communityId, posts, reações',
    drives: 'Reforço do brilho de conexão',
    status: 'derivavel',
    sensitive: false,
  },
  {
    group: 'Histórico de scores',
    source: 'likeme-back-end',
    path: 'nova tabela anamnesis_score_snapshot',
    fields: 'userId, mental, physical, markers, takenAt',
    drives: 'Delta real do período e frase do card',
    status: 'futuro',
    sensitive: true,
  },
  {
    group: 'GLP-1 / Tabia Health',
    source: 'integração',
    path: 'piloto Tabia (care pathways)',
    fields: 'semana do protocolo, adesão, check-ins',
    drives: 'Marcos de evolução do corpo',
    status: 'futuro',
    sensitive: true,
  },
  {
    group: 'Wearables',
    source: 'integração',
    path: 'HealthKit / Health Connect',
    fields: 'passos, sono, FC de repouso',
    drives: 'Respiração e ritmo em tempo quase real',
    status: 'futuro',
    sensitive: true,
  },
]

export const RULES: { input: string; output: string }[] = [
  { input: 'mentalPercentage / physicalPercentage', output: 'Escala do blob (0,55× a 1,15×) e saturação do gradiente.' },
  { input: 'Média de estresse, autoestima, propósito, espiritualidade', output: 'Quanto menor, mais o contorno da MENTE ondula.' },
  { input: 'Média de sono, nutrição, atividade, sorriso', output: 'Quanto maior, mais lenta e calma é a respiração do CORPO.' },
  { input: 'connection', output: 'Intensidade do brilho que une os dois blobs.' },
  { input: 'Delta do período (≥ +3 / ≤ −3 p.p.)', output: 'Pulso expande, contrai ou fica estável.' },
  { input: 'Anamnese incompleta', output: 'Fase dormente: cinza, sem glow, respiração de 8 s.' },
]

export const VIRAL = {
  thesis:
    'Ninguém compartilha um score de saúde. As pessoas compartilham uma identidade bonita que evolui. O avatar transforma dados íntimos em uma forma abstrata, desejável e impossível de comparar diretamente, como o Spotify Wrapped faz com hábitos de escuta.',
  loop: [
    { title: 'Ritual mensal', detail: 'No dia 1, o app gera o “Like:Me Wrapped” do mês com o avatar animado e uma frase de evolução.' },
    { title: 'Card 9:16', detail: 'Formato nativo para Stories e Reels, com marca discreta e link curto para a landing.' },
    { title: 'Curiosidade', detail: 'Quem vê quer saber “qual é o meu formato?”; o CTA leva à anamnese, que dá vida ao avatar.' },
    { title: 'Retorno', detail: 'A forma só evolui com hábitos registrados, criando motivo para voltar até o próximo card.' },
  ],
  metrics: [
    'Taxa de share por card gerado (meta inicial: 8%)',
    'Instalações atribuídas ao link do card (k-factor)',
    'Conclusão de anamnese de novos usuários vindos do card',
    'Retenção D30 de quem compartilhou vs. quem não compartilhou',
  ],
}

export const PRIVACY = [
  'O card mostra forma, fase e frase. Nunca mostra percentuais, respostas, peso ou dados clínicos.',
  'A frase usa só deltas positivos ou neutros; variações negativas viram “pedindo uma pausa”, sem número.',
  'Geração local no dispositivo; o backend só fornece o AvatarState já derivado.',
  'Compartilhar é sempre opt-in, com prévia antes de enviar.',
  'Dados de GLP-1 e wearables exigem consentimento específico (LGPD art. 11, dado sensível de saúde).',
]

export const GAPS = [
  '`getUserScores` ignora respostas `mind_*` do tipo number (só `answerText`), subestimando a MENTE.',
  '`trend` dos marcadores é calculado por limiar 30/70, sem histórico: falta snapshot periódico para delta real.',
  'O app usa 4 PNGs; migrar para `react-native-svg` + `react-native-reanimated` (não instalado hoje).',
  'O `AvatarSection` está comentado na `SummaryScreen` e o seletor semana/mês não refaz a consulta.',
  'DM Sans é referenciada no app, mas a fonte não é carregada (cai no fallback do sistema).',
]

export const ROADMAP: { phase: string; window: string; items: string[] }[] = [
  {
    phase: 'Fundação',
    window: 'Semanas 1–2',
    items: [
      'Snapshot semanal de scores e marcadores no backend',
      'Endpoint GET /api/avatar/state retornando AvatarState',
      'Corrigir cálculo de `mind_*` numéricos',
    ],
  },
  {
    phase: 'Avatar vivo no app',
    window: 'Semanas 3–5',
    items: [
      'Portar blobs para react-native-svg + reanimated',
      'Reativar AvatarSection na Home com fases e respiração',
      'Período semana/mês ligado ao histórico',
    ],
  },
  {
    phase: 'Wrapped',
    window: 'Semanas 6–8',
    items: [
      'Card 9:16 exportado em PNG e vídeo curto (MP4)',
      'Deep link de atribuição para a landing',
      'Push do ritual mensal',
    ],
  },
  {
    phase: 'Dados ricos',
    window: 'Após piloto Tabia',
    items: ['Marcos GLP-1 no corpo do avatar', 'Wearables alimentando respiração', 'Acessórios por objetivo'],
  },
]
