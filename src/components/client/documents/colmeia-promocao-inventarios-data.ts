// Relatório: promoção de inventários ao banco de ativos — 11/08/2026

export const PROMOCAO_META = {
  id: 'colmeia-promocao-inventarios',
  title: 'Promoção de inventários ao Banco de Ativos',
  client: 'Be180 OOH',
  product: 'Colmeia | Be Mediatech OOH',
  date: '11/08/2026',
  branch: 'feat/incluir-inventarios',
  scope: 'Inventários aprovados de exibidores → bancoAtivosJoin_ft',
  path: '/promocao-inventarios',
  lead:
    'A Colmeia passou a integrar de fato os inventários aprovados pelos exibidores no banco operacional de ativos. Nesta entrega: fluxo Promover ao banco, 19 lotes promovidos, 4.881 pontos novos e 0 divergências.',
}

export const PROMOCAO_KPIS = [
  { value: '19', label: 'Lotes promovidos', hint: '1 por exibidor' },
  { value: '4.881', label: 'Pontos inseridos', hint: 'valid_bl = 1' },
  { value: '17.689', label: 'Legado invalidado', hint: 'soft-delete' },
  { value: '0', label: 'Divergências', hint: 'lote × banco' },
  { value: '0', label: 'Erros no batch', hint: 'execução completa' },
  { value: '95.437', label: 'Pontos válidos', hint: 'todos os exibidores' },
]

export const PROMOCAO_BANK_STATS = [
  { label: 'Registros totais em bancoAtivosJoin_ft', value: '131.516' },
  { label: 'Exibidores com inventário no banco', value: '19' },
  { label: 'Integridade de PK (colisões)', value: 'Nenhuma' },
]

export const FLOW_BEFORE = [
  'Upload Excel',
  'Análise BE',
  'Aprovar / Corrigir / Rejeitar',
  'Status APROVADO',
  'Não gravava no banco de ativos',
]

export const FLOW_AFTER = [
  'Upload Excel',
  'Análise BE → Aprovar',
  'Preview “Promover ao banco”',
  'Substituição total do legado',
  'bancoAtivosJoin_ft',
  'Banco de Ativos / Roteiros / Relatórios',
]

export const PROMOCAO_RULES = [
  {
    title: 'Substituição total por exibidor',
    detail:
      'Todos os pontos válidos daquele exibidor_fk passam a valid_bl = 0; em seguida entram os itens aprovados do lote.',
  },
  {
    title: 'Não é automático no Aprovar',
    detail: 'O admin confirma em um passo separado, com preview de inserção × invalidação.',
  },
  {
    title: 'Bloqueadores',
    detail:
      'Lote sem exibidor; status ≠ APROVADO; zero itens elegíveis; itens sem lat/long; itens sem de-para; código vazio.',
  },
  {
    title: 'Transação + auditoria',
    detail:
      'Transação única (tudo ou nada), soft-invalidação (nunca DELETE físico) e comentário de auditoria no chat do lote.',
  },
  {
    title: 'Idempotência',
    detail: 'Lote já promovido retorna 409. Re-promoção só com force explícito.',
  },
]

export interface PromocaoExibidor {
  n: number
  name: string
  lote: number
  inserted: number
  invalidated: number
  promotedAt: string
  by: string
}

export const PROMOCAO_EXIBIDORES: PromocaoExibidor[] = [
  { n: 1, name: 'A LINHARES', lote: 13, inserted: 253, invalidated: 253, promotedAt: '11/08 17:08', by: 'script batch' },
  { n: 2, name: 'CRIATIVA', lote: 87, inserted: 37, invalidated: 102, promotedAt: '11/08 17:08', by: 'script batch' },
  { n: 3, name: 'Diario Paineis', lote: 106, inserted: 18, invalidated: 0, promotedAt: '11/08 17:08', by: 'script batch' },
  { n: 4, name: 'FUTURA MIDIA', lote: 75, inserted: 126, invalidated: 0, promotedAt: '11/08 17:08', by: 'script batch' },
  {
    n: 5,
    name: 'GRUPO SOOH (WAY MIDIA)',
    lote: 149,
    inserted: 31,
    invalidated: 10,
    promotedAt: '11/08 16:14',
    by: 'Jose Roberto Baptista Junior',
  },
  { n: 6, name: 'IMAGEM OOH', lote: 100, inserted: 2, invalidated: 31, promotedAt: '11/08 17:08', by: 'script batch' },
  { n: 7, name: 'INFRONTMIDIA', lote: 71, inserted: 210, invalidated: 2, promotedAt: '11/08 17:08', by: 'script batch' },
  { n: 8, name: 'JCDECAUX', lote: 136, inserted: 1672, invalidated: 14034, promotedAt: '11/08 17:08', by: 'script batch' },
  { n: 9, name: 'JOTA COMUNICAÇÃO', lote: 70, inserted: 706, invalidated: 0, promotedAt: '11/08 17:09', by: 'script batch' },
  { n: 10, name: 'KADOOR', lote: 98, inserted: 42, invalidated: 4, promotedAt: '11/08 17:09', by: 'script batch' },
  { n: 11, name: 'MOVIE MIDIA', lote: 28, inserted: 88, invalidated: 365, promotedAt: '11/08 17:09', by: 'script batch' },
  { n: 12, name: 'MULTICOLOR', lote: 108, inserted: 6, invalidated: 6, promotedAt: '11/08 14:53', by: 'script (piloto)' },
  { n: 13, name: 'PONTO OUTDOOR', lote: 57, inserted: 101, invalidated: 179, promotedAt: '11/08 17:09', by: 'script batch' },
  { n: 14, name: 'PRISMA OOH', lote: 43, inserted: 42, invalidated: 0, promotedAt: '11/08 17:09', by: 'script batch' },
  { n: 15, name: 'PROVIS', lote: 105, inserted: 890, invalidated: 2022, promotedAt: '11/08 17:09', by: 'script batch' },
  { n: 16, name: 'SETDOOR', lote: 37, inserted: 252, invalidated: 86, promotedAt: '11/08 17:09', by: 'script batch' },
  { n: 17, name: 'VISUAL PAINEIS', lote: 92, inserted: 48, invalidated: 0, promotedAt: '11/08 17:09', by: 'script batch' },
  { n: 18, name: 'WEOOH', lote: 8, inserted: 333, invalidated: 312, promotedAt: '11/08 17:09', by: 'script batch' },
  { n: 19, name: 'ZAAVCHAI', lote: 85, inserted: 24, invalidated: 283, promotedAt: '11/08 17:09', by: 'script batch' },
]

export const PROMOCAO_HIGHLIGHTS = [
  {
    title: 'Maior inserção',
    detail: 'JCDECAUX — 1.672 pontos (substituiu 14.034 do legado).',
  },
  {
    title: 'Maior ganho líquido',
    detail: 'JOTA COMUNICAÇÃO — 706 pontos sem legado prévio.',
  },
  {
    title: 'Piloto',
    detail: 'MULTICOLOR — 6/6, validado antes do batch completo.',
  },
  {
    title: 'Primeira promoção pela UI',
    detail: 'GRUPO SOOH / WAY MIDIA — 31 inseridos, 10 invalidados.',
  },
]

export const FIELD_MAPPING = [
  { from: 'codigo_ativo_st', to: 'code' },
  { from: 'praca_st', to: 'cidade_st' },
  { from: 'uf_st', to: 'estado_st' },
  { from: 'ISNULL(mapped_tipo_st, tipo_midia_st)', to: 'tipoMidia_st' },
  { from: 'ISNULL(mapped_ambiente_st, ambiente_st)', to: 'environment_st' },
  { from: 'ISNULL(mapped_formato_st, formato_midia_st)', to: 'media_format_st' },
  { from: 'latitude_vl / longitude_vl', to: 'latitude / longitude' },
  { from: 'nome do exibidor_dm', to: 'exibidor_st' },
  { from: 'exibidor_fk do lote', to: 'exibidor_fk' },
  { from: '—', to: 'valid_bl = 1' },
  {
    from: 'match legado por code',
    to: 'district, grupo_st, pedestrian_flow, total_ipv_impact, social_class_geo (preservados)',
  },
]

export const TECH_FIXES = [
  {
    id: 'depara',
    title: 'De-para (tradução de tipo de mídia)',
    problem:
      'Rótulos do Excel com quebra de linha (ex.: CIRCUITO DE \\r\\nBIG MUB…) nunca casavam com a regra cadastrada. A tela “salvava” e nada mudava.',
    fix: 'Normalização que colapsa espaços/quebras no match (JS e SQL) + script reaplicar-depara.js.',
    result: '389 itens remapeados com regras que a BE já havia cadastrado — incluindo SETDOOR e WEOOH.',
  },
  {
    id: 'remetente',
    title: 'Remetente do upload',
    problem: 'uploadedBy_st estava nulo em 169/169 lotes — a tela de importação não enviava o e-mail.',
    fix: 'ExibidorImportar passa a enviar uploadedBy com o e-mail do usuário logado.',
    result: 'Uploads novos ficam rastreáveis.',
  },
  {
    id: 'atencao',
    title: 'Veredito “ATENÇÃO” na análise',
    problem:
      'Os “2 pontos a tratar” em lotes já aprovados/promovidos eram avisos reais, mas a UI só mostrava o número — a seção de detalhe havia sido removida.',
    fix: 'O número passou a ser expansível, com causa, ação e se bloqueia ou não.',
    result: 'Avisos de atenção não impedem aprovar nem promover.',
  },
]

export const OUT_OF_SCOPE = [
  'Grande volume com ambiente/formato/tipo em branco na planilha (destaque: JCDECAUX e vários lotes com os três campos vazios).',
  'Casos de preenchimento incorreto do template (ex.: endereço na coluna de ambiente — Mira Outdoor).',
  'Códigos auto-gerados LINHA_* em massa (~17 mil itens): não bloqueiam promoção, mas impedem casar enriquecimento (passantes/IPV) com o legado.',
]

export const OPERATE_UI = [
  'Analisar e Aprovar o lote.',
  'Clicar Promover ao banco.',
  'Revisar o preview (a inserir × legado a invalidar + avisos).',
  'Marcar “Confirmo a substituição total…” e confirmar.',
]

export const OPERATE_SCRIPTS = [
  {
    label: 'Simulação',
    command: 'node scripts/promover-inventarios-aprovados.js',
  },
  {
    label: 'Executar todos os APROVADO ainda não promovidos',
    command: 'node scripts/promover-inventarios-aprovados.js --executar',
  },
  {
    label: 'Um lote específico',
    command: 'node scripts/promover-inventarios-aprovados.js --lote=108 --executar',
  },
  {
    label: 'Reaplicar de-para (dry-run)',
    command: 'node scripts/reaplicar-depara.js',
  },
  {
    label: 'Reaplicar de-para (executar)',
    command: 'node scripts/reaplicar-depara.js --executar',
  },
]

export const CODE_DELIVERABLES = [
  { file: 'handlers/inventario-promocao.js', role: 'Motor compartilhado: preview + promoção em transação' },
  {
    file: 'handlers/admin-inventario-analise.js',
    role: 'Endpoints preview-promocao / promover-lote + normalização SQL do de-para',
  },
  { file: 'handlers/exibidor-inventario.js', role: 'Normalização de texto do de-para no upload' },
  { file: 'scripts/promover-inventarios-aprovados.js', role: 'Batch dry-run / --executar' },
  { file: 'scripts/reaplicar-depara.js', role: 'Revalida itens já enviados após correção de match' },
  {
    file: 'PainelAnalise.tsx / AdminInventarios.tsx',
    role: 'Botão, modal, timeline etapa 5, diagnósticos detalhados',
  },
  { file: 'ExibidorImportar.tsx', role: 'Grava remetente no upload' },
]

export const VALIDATION_STEPS = [
  'Piloto MULTICOLOR (lote 108): dry-run → execução → 6 inseridos / 6 invalidados / 6 válidos no banco.',
  'Promoção pela UI (GRUPO SOOH / lote 149): 31 / 10, auditada no chat.',
  'Dry-run completo dos 17 restantes: 17 OK, 0 pulados, 0 erros.',
  'Execução em lote dos 17: 17 sucesso.',
  'Checagem pós-fato: para cada um dos 19 exibidores, inseridos_vl do lote = contagem de valid_bl = 1 no banco.',
  'Integridade de PK: 131.516 registros, 131.516 pks distintos.',
]

export const NEXT_STEPS = [
  'Completar de-para / dados faltantes nos lotes ainda incompletos.',
  'Incentivar códigos de ativo reais (reduzir LINHA_*) para preservar enriquecimento do legado.',
  'Worker Google Places e demais épicos de qualidade, sem misturar com a promoção.',
]
