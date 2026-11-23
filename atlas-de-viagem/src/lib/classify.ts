import { normalizeName } from './geo'
import type { Category } from './types'

const KEYWORDS: Record<Category, string[]> = {
  natureza: [
    'parque nacional', 'parque estadual', 'parque natural', 'parques', 'praia', 'praias', 'montanha', 'montanhas',
    'morro', 'morros', 'serra', 'cachoeira', 'cachoeiras', 'cascata', 'lago', 'lagos', 'lagoa', 'lagoas', 'laguna',
    'vulcao', 'vulcoes', 'deserto', 'ilha', 'ilhas', 'reserva natural', 'reserva nacional', 'area protegida',
    'areas protegidas', 'unidade de conservacao', 'jardim botanico', 'jardins botanicos', 'mirante', 'cerro',
    'salar', 'geiser', 'geiseres', 'gruta', 'caverna', 'canion', 'cordilheira', 'nevado', 'glaciar',
    'national park', 'national parks', 'nature reserve', 'protected area', 'protected areas', 'beach', 'beaches',
    'mountain', 'mountains', 'waterfall', 'waterfalls', 'lake', 'lakes', 'volcano', 'volcanoes', 'desert', 'island',
    'botanical garden', 'botanical gardens', 'viewpoint', 'cave', 'caves', 'glacier', 'canyon', 'geyser', 'salt flat',
  ],
  cultura: [
    'museu', 'museus', 'teatro', 'teatros', 'galeria de arte', 'galerias de arte', 'centro cultural',
    'centros culturais', 'sala de concertos', 'casa de espetaculos', 'arte urbana', 'mercado municipal', 'mercados',
    'museum', 'museums', 'theatre', 'theatres', 'theater', 'theaters', 'art gallery', 'art galleries',
    'art museum', 'cultural center', 'cultural centre', 'concert hall', 'opera house', 'street art',
  ],
  historia: [
    'sitio arqueologico', 'sitios arqueologicos', 'arqueologia', 'ruinas', 'igreja', 'igrejas', 'catedral',
    'catedrais', 'basilica', 'basilicas', 'convento', 'conventos', 'mosteiro', 'mosteiros', 'capela', 'santuario',
    'monumento', 'monumentos', 'patrimonio historico', 'patrimonio cultural', 'bens tombados', 'tombado pelo iphan',
    'fortaleza', 'fortalezas', 'forte', 'fortes', 'palacio', 'palacios', 'castelo', 'arquitetura colonial', 'incas',
    'arquitetura inca', 'pre colombianos', 'archaeological site', 'archaeological sites', 'ruins', 'church',
    'churches', 'cathedral', 'cathedrals', 'basilica', 'monastery', 'monasteries', 'convent', 'chapel', 'monument',
    'monuments', 'fortress', 'fortresses', 'fort', 'forts', 'palace', 'palaces', 'castle', 'castles',
    'heritage site', 'historic site', 'historic sites', 'inca sites', 'colonial architecture',
  ],
}

/** Sinais de interesse turístico que não definem categoria. */
const TOURISM = [
  'pontos turisticos', 'atracoes turisticas', 'atracao turistica', 'turismo em', 'turismo no', 'turismo na',
  'patrimonio mundial', 'patrimonio da humanidade', 'tourist attractions', 'tourism in', 'world heritage',
  'landmarks', 'visitor attractions',
]

/** Prefixos de categoria que indicam que a página não é uma atração. */
const NEGATIVE_PREFIXES = [
  'bairros', 'ruas', 'avenidas', 'logradouros', 'rodovias', 'estacoes', 'distritos', 'municipios', 'cidades',
  'escolas', 'universidades', 'hospitais', 'empresas', 'nascidos', 'mortos', 'pessoas', 'politicos', 'clubes',
  'shopping centers', 'edificios comerciais', 'aeroportos', 'neighbourhoods', 'neighborhoods', 'streets', 'roads',
  'railway stations', 'metro stations', 'schools', 'universities', 'hospitals', 'companies', 'populated places',
  'districts', 'people', 'births', 'deaths', 'airports', 'shopping malls', 'office buildings', 'hoteis',
  'hotels', 'restaurantes', 'restaurants', 'cities', 'towns', 'capitals', 'capitais', 'localidades',
]

/** Descrições curtas (Wikidata) que denunciam cidade, bairro ou hospedagem, mesmo com selo turístico. */
const NEGATIVE_DESCRIPTION =
  /^(a |an |the )?(cidade|city|town|village|municipio|municipality|capital|distrito|district|bairro|neighbou?rhood|provincia|province|regiao|region|hotel|restaurante|restaurant)( |$)/

function containsTerm(text: string, term: string): boolean {
  return new RegExp(`(^| )${term}( |$)`).test(text)
}

export type Classification = { eligible: boolean; category: Category | null; reason: string }

export function classifyPage(input: { title: string; description?: string; categories: string[] }): Classification {
  const categories = input.categories.map(c => normalizeName(c.replace(/^[^:]+:/, '')))
  const text = [normalizeName(input.title), normalizeName(input.description ?? ''), ...categories].join(' | ')
  const tourism = TOURISM.some(term => categories.some(c => containsTerm(c, term)) || containsTerm(text, term))
  const negative = categories.some(c => NEGATIVE_PREFIXES.some(prefix => c.startsWith(prefix)))
  if (NEGATIVE_DESCRIPTION.test(normalizeName(input.description ?? ''))) {
    return { eligible: false, category: null, reason: 'negative-description' }
  }

  const scores = (Object.keys(KEYWORDS) as Category[]).map(category => ({
    category,
    score: KEYWORDS[category].filter(term => containsTerm(text, term)).length,
  }))
  scores.sort((a, b) => b.score - a.score)
  const [best, second] = scores
  const category = best.score > 0 && best.score > second.score ? best.category : null

  if (negative && !tourism) return { eligible: false, category: null, reason: 'negative' }
  if (category) return { eligible: true, category, reason: 'category' }
  if (tourism) return { eligible: true, category: null, reason: 'tourism' }
  return { eligible: false, category: null, reason: best.score > 0 ? 'ambiguous' : 'no-evidence' }
}
