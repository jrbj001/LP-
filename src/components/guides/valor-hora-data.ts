export const GUIDE_META = {
  title: 'Guia de Valores de Desenvolvimento de Software',
  subtitle: 'Quanto custa desenvolver software?',
  description:
    'Um guia transparente para comparar propostas, entender o valor-hora e contratar tecnologia com mais segurança.',
  edition: 'julho de 2026',
  pdfPath: '/guides/Guia_Valores_Desenvolvimento_Software_PixelPulseLab_2026.pdf',
  marketRange: { min: 120, max: 650, blended: { min: 220, max: 300 } },
  baseRate: 250,
}

export const SECTIONS = [
  { id: 'resumo', label: '1. Resumo executivo' },
  { id: 'pesquisa', label: '2. Pesquisa de mercado' },
  { id: 'hora', label: '3. O que existe dentro de uma hora' },
  { id: 'perfis', label: '4. Faixas por perfil' },
  { id: 'modelos', label: '5. Modelos comerciais' },
  { id: 'taxa', label: '6. Taxa sustentável' },
  { id: 'blended', label: '7. Blended rate' },
  { id: 'pixel', label: '8. Referência PixelPulseLab' },
  { id: 'orcamentos', label: '9. Exemplos de orçamento' },
  { id: 'preco', label: '10. O que altera o preço' },
  { id: 'comparar', label: '11. Como comparar propostas' },
  { id: 'alerta', label: '12. Sinais de alerta' },
  { id: 'ia', label: '13. IA e preço' },
  { id: 'contratacao', label: '14. Estrutura de contratação' },
  { id: 'conclusao', label: '15. Conclusão' },
] as const

export const SUMMARY_BANDS = [
  { modality: 'Freelancer júnior', range: 'R$ 50–100/h', use: 'Tarefas simples, manutenção e execução supervisionada' },
  { modality: 'Freelancer pleno/sênior', range: 'R$ 100–280/h', use: 'Features isoladas e especialidades pontuais' },
  { modality: 'Software house', range: 'R$ 150–350/h', use: 'Projetos completos, squads e sustentação' },
  { modality: 'Arquitetura / Tech Lead', range: 'R$ 300–500/h', use: 'Decisões críticas, legado e escala' },
  { modality: 'IA, dados e especialistas', range: 'R$ 350–650/h', use: 'Agentes, visão computacional, dados e automação avançada' },
]

export const MARKET_SOURCES = [
  { source: 'Clutch – Pricing Guide 2026', indicator: 'US$ 25–49/h como faixa média', note: 'Base internacional; fornecedores de diversos países' },
  { source: 'Clutch – empresas no Brasil', indicator: 'US$ 25–49/h e US$ 50–99/h', note: 'Preço comercial de empresas, não salário individual' },
  { source: 'Upwork – Hourly Rates 2026', indicator: 'Média US$ 41/h full-time; iniciantes US$ 10–25/h', note: 'Mercado global de freelancers' },
  { source: 'Lemon.io – Brasil 2026', indicator: 'US$ 20–80/h; plenos/sêniores US$ 30–45/h', note: 'Contratação internacional de devs brasileiros' },
  { source: 'Financial Times – LATAM', indicator: 'US$ 40–70/h; especialistas acima', note: 'Nearshore para empresas internacionais' },
  { source: 'Eucalipse – Country Guide 2025', indicator: 'Brasil US$ 25–60/h, média US$ 43/h', note: 'Referência de mercado, não tabela oficial' },
]

export const HOUR_DISCIPLINES = [
  { discipline: 'Discovery e produto', share: '5%–15%', deliverables: 'Objetivos, fluxos, requisitos, priorização e critérios de sucesso' },
  { discipline: 'UX/UI design', share: '5%–20%', deliverables: 'Jornadas, protótipos, interface e validação de usabilidade' },
  { discipline: 'Arquitetura e engenharia', share: '10%–20%', deliverables: 'Decisões técnicas, padrões, integrações e redução de riscos' },
  { discipline: 'Desenvolvimento', share: '40%–65%', deliverables: 'Front-end, back-end, mobile, integrações e automações' },
  { discipline: 'QA e testes', share: '10%–20%', deliverables: 'Testes funcionais, regressão, automação e validação de aceite' },
  { discipline: 'DevOps e segurança', share: '5%–15%', deliverables: 'Ambientes, CI/CD, observabilidade, permissões e implantação' },
  { discipline: 'Gestão e comunicação', share: '8%–15%', deliverables: 'Planejamento, acompanhamento, reports, riscos e alinhamentos' },
]

export const PROFILE_RATES = [
  { profile: 'Desenvolvedor júnior', freelancer: 'R$ 50–100/h', house: 'R$ 100–160/h', note: 'Requer direção e revisão frequentes' },
  { profile: 'Desenvolvedor pleno', freelancer: 'R$ 90–170/h', house: 'R$ 150–240/h', note: 'Boa autonomia em escopos conhecidos' },
  { profile: 'Desenvolvedor sênior', freelancer: 'R$ 160–300/h', house: 'R$ 220–380/h', note: 'Maior capacidade de decisão e redução de risco' },
  { profile: 'Tech Lead / arquiteto', freelancer: 'R$ 220–420/h', house: 'R$ 300–520/h', note: 'Atuação estratégica e decisões de longo prazo' },
  { profile: 'UX/UI designer', freelancer: 'R$ 100–230/h', house: 'R$ 180–320/h', note: 'Pesquisa e validação podem elevar a faixa' },
  { profile: 'Product Manager', freelancer: 'R$ 150–300/h', house: 'R$ 220–420/h', note: 'Integra negócio, usuário e execução' },
  { profile: 'QA / automação', freelancer: 'R$ 100–220/h', house: 'R$ 160–300/h', note: 'Automação e performance exigem especialização' },
  { profile: 'DevOps / Cloud', freelancer: 'R$ 180–350/h', house: 'R$ 250–450/h', note: 'Infraestrutura crítica e segurança elevam o valor' },
  { profile: 'IA / Machine Learning', freelancer: 'R$ 250–480/h', house: 'R$ 350–650/h', note: 'Dados, avaliação e governança são parte do trabalho' },
]

export const COMMERCIAL_MODELS = [
  {
    title: '5.1 Time & Materials',
    body: 'O cliente contrata capacidade e paga pelas horas efetivamente utilizadas. Adequado quando o escopo evolui, existe inovação ou o produto precisa ser validado continuamente.',
    pros: 'Flexibilidade, transparência e priorização contínua.',
    cautions: 'Exige governança, backlog, relatórios e limites de orçamento.',
  },
  {
    title: '5.2 Escopo fechado',
    body: 'Preço fixo para entregas previamente definidas. Funciona melhor em projetos pequenos, bem conhecidos e com baixa probabilidade de mudança.',
    pros: 'Previsibilidade inicial de investimento.',
    cautions: 'Alterações geram change requests; incerteza vira reserva de risco no preço.',
  },
  {
    title: '5.3 Squad mensal',
    body: 'Equipe multidisciplinar por mês. Indicado para evolução contínua de produtos e plataformas.',
    pros: 'Continuidade, conhecimento acumulado e velocidade de decisão.',
    cautions: 'Acompanhar outcomes, roadmap e indicadores — não apenas ocupação.',
  },
  {
    title: '5.4 Pacotes de horas e sustentação',
    body: 'Banco de horas ou franquia mensal para manutenção, melhorias e incidentes.',
    pros: 'Previsibilidade para operação contínua.',
    cautions: 'Definir validade, SLA, priorização e horas excedentes.',
  },
]

export const SUSTAINABLE_RATE = {
  formula: 'Taxa-hora = (custos diretos + encargos + estrutura + gestão + risco + margem) ÷ horas faturáveis',
  rows: [
    { component: 'Custo total do profissional e encargos', value: 'R$ 24.000' },
    { component: 'Estrutura, ferramentas e benefícios', value: 'R$ 5.000' },
    { component: 'Gestão, vendas e administração rateadas', value: 'R$ 4.000' },
    { component: 'Reserva para risco e capacidade ociosa', value: 'R$ 3.000' },
    { component: 'Base de custo', value: 'R$ 36.000' },
    { component: 'Horas faturáveis consideradas', value: '120 horas' },
    { component: 'Custo operacional por hora', value: 'R$ 300/h' },
  ],
}

export const BLENDED_EXAMPLE = [
  { role: 'Arquiteto / Tech Lead', hours: 20, rate: 'R$ 400', subtotal: 'R$ 8.000' },
  { role: 'Desenvolvedor sênior', hours: 60, rate: 'R$ 300', subtotal: 'R$ 18.000' },
  { role: 'Desenvolvedor pleno', hours: 60, rate: 'R$ 220', subtotal: 'R$ 13.200' },
  { role: 'QA / Design / Produto', hours: 20, rate: 'R$ 240', subtotal: 'R$ 4.800' },
]

export const PIXEL_RATES = [
  { category: 'Desenvolvimento convencional', range: 'R$ 220–280/h', use: 'Web, mobile, back-end, APIs e integrações' },
  { category: 'Engenharia sênior e arquitetura', range: 'R$ 300–450/h', use: 'Sistemas críticos, legado, escala e decisões estruturais' },
  { category: 'IA, agentes e visão computacional', range: 'R$ 350–600/h', use: 'Modelos, RAG, avaliação, automações e computer vision' },
  { category: 'Discovery e estratégia tecnológica', range: 'R$ 400–650/h', use: 'Assessment, desenho de solução, priorização e plano executivo' },
  { category: 'Sustentação com volume contratado', range: 'R$ 180–240/h', use: 'Manutenção planejada e evolução contínua' },
  { category: 'Blended rate recomendado', range: 'R$ 250–300/h', use: 'Planejamento de projetos multidisciplinares' },
]

export const PIXEL_PACKAGES = [
  { format: 'Sprint de diagnóstico', capacity: '20–40 horas', investment: 'R$ 8.000–20.000' },
  { format: 'Pacote de execução 40h', capacity: '40 horas', investment: 'A partir de R$ 10.000' },
  { format: 'Pacote de execução 80h', capacity: '80 horas', investment: 'R$ 19.000–22.000' },
  { format: 'Capacidade mensal', capacity: '160 horas', investment: 'R$ 38.000–48.000' },
  { format: 'Squad enxuto', capacity: 'Produto + engenharia + QA parcial', investment: 'R$ 55.000–80.000/mês' },
  { format: 'Squad completo', capacity: 'Equipe multidisciplinar dedicada', investment: 'R$ 80.000–140.000/mês' },
]

export const BUDGET_EXAMPLES = [
  { initiative: 'Landing page integrada', effort: '80–160 h', investment: 'R$ 20.000–45.000' },
  { initiative: 'MVP web com login, painel e API', effort: '500–1.000 h', investment: 'R$ 125.000–300.000' },
  { initiative: 'Aplicativo mobile + back-end', effort: '800–1.800 h', investment: 'R$ 200.000–540.000' },
  { initiative: 'Integração entre sistemas', effort: '200–700 h', investment: 'R$ 50.000–210.000' },
  { initiative: 'Agente de IA com RAG e governança', effort: '400–1.200 h', investment: 'R$ 140.000–600.000' },
  { initiative: 'Plataforma corporativa complexa', effort: '2.000–8.000+ h', investment: 'R$ 500.000–2.400.000+' },
]

export const PRICE_FACTORS = {
  reduces: [
    'Escopo pequeno e claramente validado',
    'Uso de componentes e plataformas maduras',
    'Poucas integrações e dados organizados',
    'Prazo flexível e planejamento antecipado',
    'Baixo risco regulatório',
    'Decisor disponível e feedback rápido',
    'Volume contratado e relacionamento contínuo',
  ],
  increases: [
    'Requisitos incompletos ou mudanças frequentes',
    'Tecnologia experimental ou pesquisa aplicada',
    'Legado sem documentação e APIs instáveis',
    'Urgência, trabalho fora do horário e data fixa',
    'LGPD, financeiro, saúde, fiscal ou ambientes críticos',
    'Muitos stakeholders e aprovação lenta',
    'Projeto curto com alta mobilização inicial',
  ],
}

export const COMPARISON_CHECKLIST = [
  'Quais entregas e quais exclusões estão descritas?',
  'Discovery, arquitetura, design, QA, gestão e implantação estão incluídos?',
  'Qual é a senioridade real das pessoas que executarão o trabalho?',
  'Quem responde por atrasos, bugs críticos e continuidade da equipe?',
  'Como mudanças de escopo serão estimadas e aprovadas?',
  'Existem ambientes, CI/CD, monitoramento, documentação e transferência de conhecimento?',
  'O código, os dados e a propriedade intelectual pertencem ao cliente?',
  'Há critérios de aceite, garantia, suporte e SLA?',
  'Quais custos de cloud, licenças, APIs e serviços de terceiros não estão incluídos?',
  'Como serão demonstrados progresso, horas consumidas, riscos e decisões?',
]

export const WARNING_SIGNS = [
  'Estimativa definitiva sem discovery ou perguntas suficientes.',
  'Preço muito abaixo do mercado sem explicação sobre equipe, qualidade ou escopo.',
  'Promessa de prazo fixo para um escopo ainda indefinido.',
  'Ausência de critérios de aceite e processo de mudança.',
  'Dependência de uma única pessoa sem plano de continuidade.',
  'Proposta que não menciona testes, segurança, implantação ou documentação.',
  'Uso de IA como justificativa para eliminar validação e responsabilidade humana.',
  'Código ou infraestrutura mantidos exclusivamente em contas do fornecedor.',
]

export const HIRING_STEPS = [
  'Discovery curto para mapear objetivos, riscos, integrações e prioridades.',
  'Roadmap dividido em fases ou sprints com entregas demonstráveis.',
  'Orçamento por capacidade ou faixa, acompanhado de limite aprovado.',
  'Ritos de acompanhamento com relatório de progresso, consumo e riscos.',
  'Critérios claros de aceite e processo formal de mudança de escopo.',
  'Repositórios, cloud e documentação acessíveis ao cliente.',
  'Plano de implantação, suporte, garantia e evolução.',
]

export const SOURCES = [
  { label: 'Clutch. Software Development Company Pricing Guide, abril de 2026.', url: 'https://clutch.co/developers/pricing' },
  { label: 'Clutch. Top Software Developers in Brazil.', url: 'https://clutch.co/br/developers' },
  { label: 'Upwork. Hourly Rates by Skill & Experience, maio de 2026.', url: 'https://www.upwork.com/resources/upwork-hourly-rates' },
  { label: 'Lemon.io. Software Developer Salary & Hourly Rate in Brazil, 2026.', url: 'https://lemon.io/rate-calculator/brazil/' },
  { label: 'Financial Times. Latin American developer outsourcers capitalise on remote work boom, 2024.', url: 'https://www.ft.com/content/9a9bbb9c-8995-4025-a364-c92d0ad3e2b4' },
  { label: 'Eucalipse. Software Development Cost by Country 2025.', url: 'https://eucalipse.com/articles/software-development-costs-by-country-2025' },
  { label: 'Miserendino et al. SWE-Lancer, 2025.', url: 'https://arxiv.org/abs/2502.12115' },
  { label: 'Looi & Szepan. Outsourcing in Global Software Development, 2026.', url: 'https://arxiv.org/abs/2602.08084' },
]

export const EXECUTIVE_BULLETS = [
  'Freelancers independentes normalmente têm menor estrutura e, portanto, menor preço nominal por hora.',
  'Software houses cobram mais porque assumem coordenação, continuidade, qualidade e responsabilidade pela entrega.',
  'A senioridade é apenas uma das variáveis. Escopo incerto, legado, requisitos regulatórios e integrações elevam o custo.',
  'A hora deve ser usada para estimativas e transparência, mas o cliente deve avaliar resultado, risco e custo total.',
  'Propostas muito abaixo do mercado frequentemente omitem discovery, QA, documentação, gestão, suporte ou margem para correções.',
]
