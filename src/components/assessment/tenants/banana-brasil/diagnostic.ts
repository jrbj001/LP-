import type { AssessmentDiagnostic } from '@/lib/assessment/types'

export const diagnostic: AssessmentDiagnostic = {
  summary: {
    id: 'sumario',
    eyebrow: '00 — Sumário executivo',
    title: 'A marca venceu a gôndola; a próxima década se joga no conteúdo e nos dados.',
    lead:
      'A Banana Brasil não tem um problema de marca nem de produto — tem uma lacuna de motor e de instrumentação. É a lacuna mais barata de fechar e a de maior retorno, porque os ativos caros já estão pagos.',
    paragraphs: [
      'Três forças de mercado convergem sobre a categoria: a demanda por saudabilidade virou comportamento de massa; o comércio social (liderado pelo TikTok Shop) explodiu no Brasil em 2025–2026; e a confiança do consumidor migrou do anúncio de marca para o conteúdo de gente real (UGC).',
      'Dois casos provam que não é teoria. A Bold, na mesma prateleira, saiu de R$80 mi rumo a R$500 mi+ com um exército de criadores — mantendo 75% do faturamento no varejo físico. A MaryRuth (EUA) ultrapassou US$100 mi/ano combinando UGC, comércio social e uma camada robusta de dados e atribuição.',
    ],
  },
  sections: [
    {
      id: 'demanda',
      eyebrow: '01 — O mercado: demanda',
      title: 'A saudabilidade deixou de ser tendência e virou regra.',
      lead:
        'O consumo de proteína e alimentos funcionais migrou do público fitness para o consumidor geral, puxado por conveniência, bem-estar e pela "snackificação" das refeições.',
      stats: [
        { value: '~R$100 bi', label: 'Alimentos saudáveis/proteicos no Brasil (2023)', source: 'ABIA' },
        { value: '+17%', label: 'Alta na cesta de saudabilidade no início de 2025', source: 'Scanntech', tone: 'leaf' },
        { value: '59%', label: 'Topam pagar mais por produtos que melhoram a saúde', source: 'NielsenIQ' },
      ],
      paragraphs: [
        'A nutrição esportiva no Brasil (R$4,3 bi em 2023) deve dobrar até 2028, chegando a R$9,5 bi (Euromonitor). As bebidas proteicas prontas cresceram 272% entre 2019 e 2023, e o mercado ainda é concentrado — poucas empresas detêm ~70% de participação, o que abre espaço para uma marca com história, clean label e boa execução digital.',
      ],
      bullets: [
        'Dupla função: a barra de proteína compete com a sobremesa, não só com o pós-treino.',
        'Snackificação: rotina acelerada leva à substituição de refeições por snacks práticos.',
        'Estética de estilo de vida (não de academia) amplia o público.',
        'A própria expansão da categoria é atribuída ao consumo exibido por criadores.',
      ],
    },
    {
      id: 'canal',
      eyebrow: '02 — O mercado: canal',
      title: 'O comércio social chegou — e favorece o produto de impulso.',
      lead:
        'Lançado no Brasil em maio de 2025, o TikTok Shop virou em um ano a maior novidade do e-commerce nacional: opera na camada anterior à busca, criando a intenção enquanto o usuário consome conteúdo.',
      stats: [
        { value: '102x', label: 'Crescimento do GMV diário médio em 1 ano', source: 'TikTok Shop' },
        { value: '134 mi', label: 'Usuários ativos no Brasil — 3º maior mercado global', source: 'TikTok / BTG', tone: 'leaf' },
        { value: '57,8%', label: 'De quem descobre um produto no app compra ali mesmo', source: 'TikTok' },
      ],
      paragraphs: [
        'As regras do canal favorecem o perfil da Banana Brasil: ticket baixo (até ~R$150) converte melhor por impulso; lives chegam a converter 10x mais que anúncios; e micro-criadores (10 a 100 mil seguidores) geram ~60% mais engajamento. Uma barra de R$8 a R$15, com recompra alta, é o combustível ideal — o Santander projeta que o canal pode capturar até 9% do varejo digital brasileiro até 2028 (~R$39 bi).',
      ],
    },
    {
      id: 'ugc',
      eyebrow: '03 — O comportamento: UGC',
      title: 'O consumidor confia em pessoas, não em anúncios.',
      lead:
        'O conteúdo gerado por usuário resolve o problema central da publicidade: a desconfiança. Deixou de ser complemento e virou a força mais influente do marketing digital.',
      stats: [
        { value: '92%', label: 'Confiam mais em pessoas reais do que em publicidade de marca', source: 'Estudos UGC', tone: 'leaf' },
        { value: '+29%', label: 'De conversão em páginas de produto que exibem UGC', source: 'Yotpo' },
        { value: '16%', label: 'Das marcas têm estratégia de UGC dedicada — o espaço está aberto', source: 'FBI', tone: 'alert' },
      ],
      bullets: [
        'Marcas que usam UGC reportam ~+20% de ROI; ads baseados em UGC têm +73% de engajamento.',
        'Micro e nano criadores entregam qualidade a uma fração do custo de um influenciador.',
        'Um único post orgânico forte pode ser amplificado por mídia paga, multiplicando o alcance.',
        'Apenas 16% das marcas têm estratégia dedicada: a vantagem está em executar antes do concorrente.',
      ],
    },
    {
      id: 'ia',
      eyebrow: '04 — IA aplicada ao consumo',
      title: 'A vantagem deixou de ser só tamanho.',
      lead:
        'Para marcas de consumo, a IA passou de experimento a capacidade essencial — e setores tradicionais tendem a colher ganhos maiores por partirem de uma base menos digitalizada.',
      stats: [
        { value: '71%', label: 'Dos líderes de CPG adotaram IA em 2024 (era 42% antes)', source: 'CoLoop' },
        { value: '+30%', label: 'De vendas da Unilever ao ligar clima à previsão de demanda', source: 'SR Analytics', tone: 'leaf' },
        { value: '60–90', label: 'Dias para os primeiros ganhos operacionais (quick wins)', source: 'Benchmarks CPG' },
      ],
      bullets: [
        'Descoberta e curadoria de criadores em pools muito maiores de micro e nano criadores.',
        'Produção de conteúdo: dezenas de variações criativas testadas em paralelo.',
        'Social listening em tempo real — tendência, sabor e sentimento antes do concorrente.',
        'BI e previsão: +5% a +10% de acurácia de forecast e +15% a +25% de efetividade promocional.',
      ],
    },
  ],
  benchmarks: [
    {
      id: 'bold',
      name: 'Bold Snacks',
      headline: 'O espelho brasileiro — mesma prateleira, modelo provado.',
      stats: [
        { value: 'R$80→180 mi', label: 'Faturamento 2022 → projeção 2023', source: 'Exame' },
        { value: '~700', label: 'Criadores na rede da marca', source: 'Exame / CDL', tone: 'leaf' },
        { value: '75%', label: 'Do faturamento ainda vem do varejo físico', source: 'Exame' },
      ],
      whatTheyDid:
        'Sem verba de marketing, recrutou pessoas de esporte e estilo de vida saudável para inserir o produto no conteúdo delas. O núcleo cresceu a ~700 criadores e a marca cultivou a comunidade "Boldlovers". A mídia paga em escala só veio depois, sobre o orgânico que já funcionava.',
      lesson:
        'O digital não substituiu a gôndola — turbinou. A Banana Brasil parte de um ponto melhor do que a Bold em 2018: tem 40+ anos de marca, distribuição nacional e portfólio mais largo. Falta o motor que a Bold construiu primeiro.',
    },
    {
      id: 'maryruth',
      name: 'MaryRuth Organics',
      headline: 'O estágio avançado — UGC, comércio social e inteligência.',
      stats: [
        { value: '+US$100 mi', label: 'Faturamento anual movido a criadores', source: 'Lumanu', tone: 'leaf' },
        { value: '220%', label: 'Crescimento YoY; 58% das views via TikTok Shop', source: 'NutraIngredients' },
        { value: '+45%', label: 'De conversão ao incorporar Q&A ao vivo', source: 'FordeBaker' },
      ],
      whatTheyDid:
        'Separou influência de performance, operou live 24/7 no TikTok Shop como motor full-funnel e adotou um "credibility playbook" com guardrails de claims. Só persegue trend com "trend fit + brand fit + product readiness".',
      lesson:
        'O que distingue o estágio avançado é a camada de inteligência: dashboards em tempo real, atribuição (T-ROM), smart cart com cross/upsell (~30% de receita adicional) e loyalty ligado a UGC (+136% de LTV). Crescimento difuso vira crescimento medido quando cada real de conteúdo é atribuído a um resultado.',
    },
  ],
  matureAssets: [
    { title: 'Marca e legado', detail: '40+ anos, pioneirismo na categoria e reputação de saudabilidade real (clean label).' },
    { title: 'Distribuição nacional', detail: 'Consolidada em grandes redes, lojas especializadas e pequeno varejo.' },
    { title: 'Portfólio largo', detail: 'Supino, Protein+, Nutsbar, banana-passa, Só Frutas, Levittá e linha Kids.' },
    { title: 'Base social e e-commerce', detail: '~124 mil seguidores no Instagram e loja própria com Clube de Fidelidade.' },
    { title: 'Abertura à IA', detail: 'A liderança já passou por capacitação em IA para gestão — o terreno interno está preparado.' },
  ],
  gaps: [
    { title: 'UGC esporádico', detail: 'Publis pontuais, sem uma máquina de dezenas/centenas de criadores como Bold ou MaryRuth.' },
    { title: 'TikTok sem motor', detail: 'Presença existe, mas sem cadência de conteúdo, afiliados nem comércio social ativo.' },
    { title: 'D2C tímido', detail: 'Frente à força no varejo — ticket médio, assinatura e recompra subexplorados.' },
    { title: 'Voz institucional', detail: 'Conteúdo "de marca para fora", pouco "de gente para gente" — onde mora a confiança.' },
    { title: 'Dados em silos', detail: 'E-commerce, varejo, marketplace e social não conversam — sem BI único, atribuição nem previsão.' },
  ],
  maturity: [
    { dimension: 'Marca & confiança', level: 'madura', comment: 'Maior ativo; base para conteúdo educativo e de credibilidade.' },
    { dimension: 'Distribuição física', level: 'madura', comment: 'Canal principal; deve ser turbinado, não substituído.' },
    { dimension: 'Venda direta (D2C)', level: 'inicial', comment: 'Existe, mas subaproveitada em AOV, assinatura e recompra.' },
    { dimension: 'Motor de UGC', level: 'verde', comment: 'Sem máquina de criadores em escala.' },
    { dimension: 'Comércio social', level: 'verde', comment: 'TikTok incipiente; sem afiliados nem lives.' },
    { dimension: 'Inteligência / BI', level: 'verde', comment: 'Dados fragmentados; sem painel único nem atribuição.' },
  ],
  recommendations: [
    { rank: 1, title: 'Construir um motor de UGC, não campanhas avulsas', detail: 'Operação contínua de micro e nano criadores, com briefing, direitos de uso e um "credibility playbook" que proteja os claims (clean label, sem glúten, vegano).' },
    { rank: 2, title: 'Tratar o conteúdo como gerador de procura para todos os canais', detail: 'Medir o efeito halo no sell-out do varejo, não só a venda direta. O objetivo é pull, não apenas e-commerce.' },
    { rank: 3, title: 'Ativar o comércio social com disciplina de SKU-herói', detail: 'Abrir o TikTok Shop com poucos produtos campeões, ofertas por tempo limitado, afiliados e calendário de lives.' },
    { rank: 4, title: 'Aprofundar o D2C sobre a base que já existe', detail: 'Usar o Clube de Fidelidade como alavanca de assinatura e recompra; kits/box e cross-sell; UGC nas páginas de produto.' },
    { rank: 5, title: 'Instalar a camada de inteligência desde o início', detail: 'Um dashboard único conectando D2C, varejo, marketplace e social, com atribuição, CAC por criador e previsão de demanda.' },
    { rank: 6, title: 'Usar IA para escalar sem inflar headcount', detail: 'IA na descoberta de criadores, na produção/teste de variações e no social listening.' },
  ],
  sources: [
    'Euromonitor — nutrição esportiva e bebidas proteicas no Brasil',
    'ABIA — segmento de alimentos saudáveis/proteicos',
    'Scanntech · NielsenIQ — cesta de saudabilidade e disposição a pagar',
    'TikTok Shop / TikTok for Business — 1º ano no Brasil',
    'Itaú BBA · BTG Pactual · Santander — análise competitiva do TikTok Shop',
    'Bold Snacks — Exame, CDL, FoodBiz',
    'MaryRuth Organics — Lumanu, NutraIngredients, FordeBaker',
    'Estudos de UGC e de IA em CPG — Fortune Business Insights, CoLoop, NIQ/Kearney',
  ],
}
