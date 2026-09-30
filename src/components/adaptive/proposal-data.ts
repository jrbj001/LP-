// Proposta de trabalho — Orfeu Cafés
// Resposta ao Briefing de Contratação v6 (setembro de 2026), da Coordenação
// de IA e Transformação Digital.
// Faixas indicativas por entrega, com premissas explícitas. O preço fecha
// quando o escopo da entrega for confirmado em conjunto.

export function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export interface PriceBand {
  min: number
  max: number
}

export const PROPOSAL_META = {
  password: 'orfeu2026',
  title: 'Proposta de Trabalho',
  client: 'Orfeu Cafés',
  audience: 'Coordenação de IA e Transformação Digital',
  briefing: 'Briefing de Contratação v6 · setembro de 2026',
  date: '29/09/2026',
  validity: 'Faixas indicativas válidas por 30 dias. O preço de cada entrega fecha quando o escopo for confirmado em conjunto.',
  guideHref: '/guides/valor-hora',
}

export const ROLE_RATES = {
  partner: { label: 'Partner · condução e habilitação', rate: { min: 400, max: 450 } },
  architect: { label: 'Arquiteto de integrações · sênior', rate: { min: 320, max: 380 } },
  senior: { label: 'Engenheiro de integrações ou dados · sênior', rate: { min: 240, max: 280 } },
  qa: { label: 'QA · pleno', rate: { min: 160, max: 200 } },
} as const

type RoleKey = keyof typeof ROLE_RATES

export const RATE_BASIS = {
  note: 'Cada papel é cobrado pela própria taxa, dentro das faixas do Guia de Valores PixelPulseLab 2026. A hora do QA não custa o mesmo que a do arquiteto. Horas dimensionam a entrega; a cobrança é preço fechado por entrega, não banco de horas. O risco da escrita no ERP e da emissão fiscal aparece na duração da faixa, não numa taxa mais alta.',
  references: Object.values(ROLE_RATES).map(role => ({
    category: role.label,
    range: `R$ ${role.rate.min}–${role.rate.max}/h`,
  })),
}

// ─── Como lemos o pedido ────────────────────────────────────────────────────────

export const READING = {
  eyebrow: 'Como lemos o briefing',
  title: 'Especialista técnico para destravar pontos e habilitar o time',
  narrative:
    'A Orfeu já conduz adoção, automação e habilitação pela Coordenação de IA. O que falta é capacidade especializada para integrações com legado, arquitetura de dados, segurança e formação do time. Esta proposta responde com entregas pequenas, cada uma com prazo, faixa de investimento, premissas e critério de aceite. A Coordenação segue dona do produto e da estratégia.',
  points: [
    {
      title: 'Primeiro o caminho, depois o preço fechado',
      detail: 'A primeira entrega é um diagnóstico de viabilidade. Ele recomenda o caminho técnico e trava o escopo — e o preço — da execução seguinte.',
    },
    {
      title: 'Fundação e capacidade, não um catálogo',
      detail: 'No caminho de dados, a entrega é a base governada e o repasse para a Coordenação criar e operar as próprias soluções.',
    },
    {
      title: 'Uma entrega de cada vez',
      detail: 'Cada bloco é avaliado e aprovado antes do próximo. Contratar o diagnóstico não obriga a contratar a execução.',
    },
    {
      title: 'Transferência faz parte do aceite',
      detail: 'Arquitetura, runbook, testes e sessão de repasse acompanham a solução. Sem esses artefatos, a entrega não está completa.',
    },
  ],
}

// ─── Como trabalhamos ───────────────────────────────────────────────────────────

export const WAY_OF_WORKING = [
  {
    title: 'Escopo escrito antes de começar',
    detail: 'A entrega só inicia com objetivo, critério de aceite, premissas e exclusões num documento curto, confirmado pela Coordenação.',
  },
  {
    title: 'Preço e prazo fechados na largada',
    detail: 'A faixa desta proposta vira preço fechado nesse documento. Mudança de escopo é uma nova cotação, não hora absorvida.',
  },
  {
    title: 'Trabalho no repositório da Orfeu',
    detail: 'Código, dados e credenciais ficam em contas da Orfeu desde o primeiro commit. Credenciais nominais e revogáveis.',
  },
  {
    title: 'Homologação como padrão',
    detail: 'Produção só com aprovação formal e registrada. O ponto focal técnico da Orfeu intermedia a TI durante a entrega.',
  },
  {
    title: 'Aceite antes da próxima',
    detail: 'A Coordenação tem 5 dias úteis para validar as evidências. Aprovar uma entrega não gera compromisso de continuidade.',
  },
  {
    title: 'Garantia declarada por entrega',
    detail: 'Defeito contra o critério de aceite é corrigido sem custo adicional, dentro do prazo de garantia daquela entrega.',
  },
]

// ─── Caminhos técnicos (leitura preliminar) ─────────────────────────────────────

export interface TechnicalPath {
  id: string
  title: string
  summary: string
  pros: string[]
  cons: string[]
  risks: string[]
}

export const TECHNICAL_PATHS: TechnicalPath[] = [
  {
    id: 'api',
    title: 'APIs nativas do Protheus e da TOTVS',
    summary: 'A escrita e a leitura passam pelo contrato que o fabricante expõe, com autenticação da própria plataforma.',
    pros: [
      'Contrato suportado pelo fabricante, com autenticação própria.',
      'Menos lógica presa dentro do ERP do que uma customização ADVPL.',
      'Mais simples de versionar, testar e auditar fora do ambiente do Protheus.',
    ],
    cons: [
      'A cobertura varia por rotina: pedido, estoque e faturamento não têm a mesma maturidade de API.',
      'Versão, módulos e licenças da Orfeu definem o que de fato existe.',
    ],
    risks: [
      'A API de leitura pode existir e a de escrita do pedido, não — ou exigir licença que a Orfeu não tem hoje.',
    ],
  },
  {
    id: 'advpl',
    title: 'ADVPL e customização no ERP',
    summary: 'O ponto que a API não alcança é resolvido com rotina dentro do Protheus, no terreno que a TI já opera.',
    pros: [
      'Alcança rotina que a API nativa não expõe.',
      'A TI da Orfeu já convive com esse modelo e consegue revisar o que entra no ERP.',
    ],
    cons: [
      'A regra fica presa no ERP: mais difícil de testar, versionar e transferir para a Coordenação.',
      'Atualização de release do Protheus reabre o risco da customização.',
    ],
    risks: [
      'Vira um segundo produto dentro do ERP. A Coordenação não evolui o fluxo sem a TI a cada mudança.',
    ],
  },
  {
    id: 'middleware',
    title: 'Camada intermediária de integração',
    summary: 'Um componente pequeno, de propriedade da Orfeu, concentra autenticação, validação, idempotência, log e reprocessamento.',
    pros: [
      'O agente e a ferramenta interna não gravam direto no ERP.',
      'Credencial não fica compartilhada nem embutida em código.',
      'O mesmo contrato serve depois para estoque e, se avançar, para NF-e e boleto.',
    ],
    cons: [
      'Mais um componente para publicar, monitorar e operar.',
      'Só se justifica se o contrato for pequeno e o código for da Orfeu desde o início.',
    ],
    risks: [
      'Crescer para um barramento genérico. A mitigação é uma entrega, um caso — a criação de pedido — e nada além disso.',
    ],
  },
  {
    id: 'datalake',
    title: 'Datalake governado como base de trabalho',
    summary: 'Os dados de leitura do Protheus vão para uma base consultável. A Coordenação cria e opera soluções sobre ela.',
    pros: [
      'Desacopla consulta e automação da leitura direta no ERP.',
      'Aproveita o espelhamento que a TI já opera hoje.',
      'A entrega é a fundação e a capacidade instalada, não um conjunto de soluções fechadas.',
    ],
    cons: [
      'Não resolve escrita transacional. Gravar pedido continua em outro caminho.',
      'Cloud, catálogo e governança ficam na conta da Orfeu.',
    ],
    risks: [
      'Dado atrasado ou mal modelado replica o problema do ERP com outra cara. E usar o datalake como atalho para gravar no Protheus não funciona.',
    ],
  },
]

export const TECHNICAL_READING = {
  title: 'Hipótese de trabalho, a confirmar no diagnóstico',
  body: 'Não escolhemos o caminho antes de ver versão, módulos, APIs licenciadas e o espelhamento que a TI já opera. A hipótese: consulta e soluções internas sobre uma base governada, evoluindo a leitura que já existe; escrita de pedido por uma camada pequena — API nativa quando ela cobrir o caso, ADVPL só no ponto em que a API não alcança. Autenticação nominal, validação antes da gravação, idempotência, log e rastreio entre o registro interno e o registro no Protheus. O agente não grava direto no ERP.',
}

// ─── Entregas ───────────────────────────────────────────────────────────────────

export type DeliveryGroup = 'diagnostico' | 'execucao' | 'oportunidade' | 'habilitacao'

export interface DeliveryTeam {
  role: string
  seniority: string
  rateKey: RoleKey
  hoursPerWeek: number
}

export interface Delivery {
  id: string
  code: string
  group: DeliveryGroup
  title: string
  window: string
  summary: string
  weeks: PriceBand
  /** Carga da célula, constante ao longo das semanas. Horas e preço derivam dela. */
  weeklyHours: number
  hours: PriceBand
  /** Taxa média resultante (investimento ÷ horas), só para leitura. */
  blendedRate: PriceBand
  investment: PriceBand
  recommended?: boolean
  risk: 'contido' | 'moderado' | 'alto'
  warranty: string
  deliverables: string[]
  acceptance: string[]
  assumptions: string[]
  team: DeliveryTeam[]
  dependsOn?: string
}

function weeklyCost(team: DeliveryTeam[]): PriceBand {
  return team.reduce(
    (total, member) => {
      const { rate } = ROLE_RATES[member.rateKey]
      return {
        min: total.min + member.hoursPerWeek * rate.min,
        max: total.max + member.hoursPerWeek * rate.max,
      }
    },
    { min: 0, max: 0 },
  )
}

const DELIVERY_SEED: Array<Omit<Delivery, 'investment' | 'hours' | 'weeklyHours' | 'window' | 'blendedRate'>> = [
  {
    id: 'd0',
    code: 'D0',
    group: 'diagnostico',
    title: 'Diagnóstico de viabilidade da integração',
        summary:
      'Leitura do Protheus da Orfeu — versão, módulos, APIs, ADVPL e o espelhamento já existente — e recomendação do caminho para a primeira execução, com escopo e preço fechados.',
    weeks: { min: 2, max: 3 },
    recommended: true,
    risk: 'contido',
    warranty: '15 dias corridos para corrigir inconsistência do relatório e da recomendação.',
    deliverables: [
      'Mapa do que a versão e as licenças da Orfeu de fato expõem (API, ADVPL, espelhamento).',
      'Comparação dos quatro caminhos, com prós, contras e riscos aplicados ao ambiente real.',
      'Recomendação de caminho para a criação de pedido e, em separado, para a base de consulta.',
      'Escopo fechado, prazo e preço da primeira execução, prontos para aceite.',
      'Registro das decisões e das alternativas descartadas.',
    ],
    acceptance: [
      'A Coordenação consegue comparar os caminhos sobre o ambiente real, não sobre um ERP genérico.',
      'A recomendação declara premissas, riscos e o que fica de fora da primeira execução.',
      'Há uma proposta de preço fechado para a execução seguinte, ou a conclusão explícita de que o caso não se sustenta.',
    ],
    assumptions: [
      'A Orfeu indica um ponto focal técnico e intermedia o acesso à TI e à documentação do Protheus.',
      'A leitura ocorre em homologação. Produção só com aprovação formal.',
      'O diagnóstico recomenda e delimita. Não inclui construir a integração.',
    ],
    team: [
      { role: 'Arquiteto de integrações', seniority: 'Sênior', rateKey: 'architect', hoursPerWeek: 16 },
      { role: 'Engenheiro de integrações', seniority: 'Sênior', rateKey: 'senior', hoursPerWeek: 16 },
      { role: 'Engenheiro de dados', seniority: 'Sênior', rateKey: 'senior', hoursPerWeek: 8 },
    ],
  },
  {
    id: 'b1',
    code: 'B1',
    group: 'execucao',
    title: 'Escrita de pedido no Protheus',
        summary:
      'Um caso transacional: criar pedido no Protheus a partir da ferramenta interna, com autenticação, validação, idempotência, trilha de auditoria e rastreio entre os dois registros.',
    weeks: { min: 6, max: 8 },
    risk: 'moderado',
    warranty: '30 dias corridos após o aceite, para defeito contra os critérios abaixo.',
    dependsOn: 'D0',
    deliverables: [
      'Contrato de criação de pedido no caminho recomendado pelo diagnóstico.',
      'Autenticação e autorização da chamada, sem credencial compartilhada ou embutida.',
      'Validação antes da gravação, com rejeição controlada e mensagem utilizável.',
      'Log de auditoria: o que foi gravado, por quem, quando e com qual resultado.',
      'Reprocessamento idempotente: repetir a chamada não duplica o pedido.',
      'Rastreio entre o registro interno e o registro no Protheus.',
      'Testes automatizados, runbook e sessões de repasse gravadas.',
    ],
    acceptance: [
      'Um pedido criado na ferramenta interna aparece no Protheus em homologação, sem redigitação.',
      'Dado inválido é recusado sem gravar, e a causa fica registrada.',
      'Uma repetição da mesma chamada não gera segundo pedido.',
      'A trilha responde quem gravou, quando e com qual resultado.',
      'O time interno publica, diagnostica falha e reprocessa com o runbook, sem a Pixel na operação.',
    ],
    assumptions: [
      'O diagnóstico (D0) já recomendou o caminho e fechou este escopo.',
      'Um único caso: criação de pedido. Outras rotinas são outra entrega.',
      'Se o caminho viável for só ADVPL extenso, o preço desta faixa não se mantém: o D0 devolve uma nova cotação.',
      'Ambiente de homologação, massa de teste e ponto focal disponíveis no período.',
      'Licenças, cloud e conectividade são da Orfeu.',
    ],
    team: [
      { role: 'Engenheiro de integrações', seniority: 'Sênior', rateKey: 'senior', hoursPerWeek: 40 },
      { role: 'Arquiteto de integrações', seniority: 'Sênior', rateKey: 'architect', hoursPerWeek: 4 },
      { role: 'QA', seniority: 'Pleno', rateKey: 'qa', hoursPerWeek: 8 },
    ],
  },
  {
    id: 'b2',
    code: 'B2',
    group: 'execucao',
    title: 'Fundação de dados para a Coordenação',
        summary:
      'Levar um conjunto acordado de entidades do Protheus para uma base governada, consultável pelo time de IA. A entrega é a fundação e o repasse, não um catálogo de agentes.',
    weeks: { min: 7, max: 9 },
    risk: 'moderado',
    warranty: '30 dias corridos após o aceite, para defeito contra os critérios abaixo.',
    dependsOn: 'D0',
    deliverables: [
      'Ingestão do conjunto de entidades acordado, a partir do espelhamento já existente.',
      'Modelo, catálogo e regras mínimas de qualidade para esse conjunto.',
      'Acesso da Coordenação à base, com trilha de quem consultou o quê.',
      'Padrão para o time publicar uma solução própria sobre a base.',
      'Runbook de monitoramento, falha e reprocessamento, mais sessão de repasse.',
    ],
    acceptance: [
      'A Coordenação consulta o conjunto acordado sem ler o Protheus direto, e aponta a origem de cada dado.',
      'Uma falha de carga é diagnosticável e reprocessável pelo runbook.',
      'O time interno sobe uma consulta própria em sessão de repasse, sem a Pixel escrever a solução.',
    ],
    assumptions: [
      'O conjunto de entidades é fechado no D0. Não é o ERP inteiro.',
      'Parte da leitura que a TI já opera. Não inclui escrita no Protheus.',
      'Não inclui agentes, skills ou automações de negócio prontas.',
      'Cloud, armazenamento e identidade são da Orfeu.',
    ],
    team: [
      { role: 'Engenheiro de dados', seniority: 'Sênior', rateKey: 'senior', hoursPerWeek: 40 },
      { role: 'Arquiteto de integrações', seniority: 'Sênior', rateKey: 'architect', hoursPerWeek: 4 },
      { role: 'QA', seniority: 'Pleno', rateKey: 'qa', hoursPerWeek: 8 },
    ],
  },
  {
    id: 'c1',
    code: 'C1',
    group: 'oportunidade',
    title: 'Consulta de estoque e ruptura no pedido',
        summary:
      'Mostrar disponibilidade e ruptura na entrada do pedido, antes de ele avançar sem condição de ser atendido.',
    weeks: { min: 3, max: 4 },
    risk: 'contido',
    warranty: '30 dias corridos após o aceite, para defeito contra os critérios abaixo.',
    deliverables: [
      'Consulta de disponibilidade no ponto em que o pedido é montado.',
      'Sinal de ruptura visível antes da conclusão.',
      'Origem do dado rastreável até a fonte no Protheus ou na base governada.',
    ],
    acceptance: [
      'O usuário vê a condição de atendimento antes de concluir o pedido.',
      'A tela ou a resposta indica de onde veio o número — não um valor sem origem.',
    ],
    assumptions: [
      'O dado de estoque já é consultável (espelho atual ou a fundação B2).',
      'Existe um fluxo interno de pedido onde a consulta entra. Não redesenhamos a jornada comercial.',
      'Se a leitura de estoque ainda não existir, esta faixa não se aplica: o caminho volta ao D0.',
    ],
    team: [
      { role: 'Engenheiro de integrações', seniority: 'Sênior', rateKey: 'senior', hoursPerWeek: 40 },
      { role: 'QA', seniority: 'Pleno', rateKey: 'qa', hoursPerWeek: 8 },
    ],
  },
  {
    id: 'c2',
    code: 'C2',
    group: 'oportunidade',
    title: 'Faturamento B2B: NF-e e boleto',
        summary:
      'Automatizar etapas da emissão de nota e boleto, com o resultado de volta ao Protheus sem redigitação. É a frente de maior risco: regra fiscal, motor fiscal e banco.',
    weeks: { min: 9, max: 12 },
    risk: 'alto',
    warranty: '45 dias corridos após o aceite. Rejeição fiscal do cenário contratado entra na garantia; cenário novo, não.',
    dependsOn: 'B1',
    deliverables: [
      'Emissão de NF-e e boleto para um cenário fiscal fechado no escopo.',
      'Retorno do documento ao Protheus sem redigitação.',
      'Tratamento explícito de rejeição: o que falhou, por quê, e como reprocessar.',
      'Testes do cenário, runbook e repasse ao time.',
    ],
    acceptance: [
      'O documento do cenário contratado é emitido e baixado no ERP sem redigitação manual.',
      'Uma rejeição não se perde: fica registrada, com causa e caminho de reprocesso.',
    ],
    assumptions: [
      'A escrita no Protheus (B1) já foi aceita, ou está contratada como extensão dela. Não é um programa novo.',
      'Um cenário de emissão, não todos os tipos de nota da Orfeu.',
      'Regras fiscais, certificado, ambiente de homologação da SEFAZ e convênio bancário são fornecidos pela Orfeu.',
      'A faixa é larga de propósito: motor fiscal e banco são o principal fator de incerteza. O D0, se alcançar este caso, estreita o número antes do preço fechado.',
      'Semana parada à espera de SEFAZ, banco ou certificado não é cobrada: a célula é liberada e retoma quando o insumo chega.',
    ],
    team: [
      { role: 'Engenheiro de integrações', seniority: 'Sênior', rateKey: 'senior', hoursPerWeek: 40 },
      { role: 'Arquiteto de integrações', seniority: 'Sênior', rateKey: 'architect', hoursPerWeek: 4 },
      { role: 'QA', seniority: 'Pleno', rateKey: 'qa', hoursPerWeek: 8 },
    ],
  },
  {
    id: 'c3',
    code: 'C3',
    group: 'oportunidade',
    title: 'Raio-X de governança do que já está em produção',
        summary:
      'Diagnóstico das automações que a Orfeu já construiu: LGPD, dado pessoal, acesso, segredos e isolamento. Gera prioridades. Não corrige.',
    weeks: { min: 2, max: 3 },
    risk: 'contido',
    warranty: '15 dias corridos para corrigir achado mal classificado ou evidência incorreta no relatório.',
    deliverables: [
      'Inventário das automações revisadas, com o que foi visto e o que ficou de fora.',
      'Achados com severidade, risco associado e plano de correção priorizado.',
      'Lista do que exigiria contratação posterior, separada deste escopo.',
    ],
    acceptance: [
      'Cada achado tem evidência, severidade e uma ação sugerida.',
      'O relatório separa correção imediata, correção planejada e item que não se sustenta.',
    ],
    assumptions: [
      'A Coordenação entrega o inventário e o acesso de leitura às automações em produção.',
      'Não inclui corrigir os achados. Correção é contratação futura, avaliada à parte.',
    ],
    team: [
      { role: 'Arquiteto de integrações', seniority: 'Sênior', rateKey: 'architect', hoursPerWeek: 24 },
      { role: 'Engenheiro de dados', seniority: 'Sênior', rateKey: 'senior', hoursPerWeek: 16 },
    ],
  },
  {
    id: 'h1',
    code: 'H1',
    group: 'habilitacao',
    title: 'Assessment de maturidade e roadmap',
        summary:
      'Leitura do grau de maturidade da Coordenação — arquitetura, segurança, governança e forma de trabalho — com roadmap proporcional ao que já existe.',
    weeks: { min: 2, max: 3 },
    risk: 'contido',
    warranty: '15 dias corridos para corrigir fato incorreto no relatório.',
    deliverables: [
      'Índice de maturidade aplicado ao momento da Orfeu: onde está, o que priorizar, o que falta para o estágio AI First.',
      'Recomendações de arquitetura, segurança e governança para as soluções que o time já constrói.',
      'Roadmap priorizado, com o que é da Coordenação e o que dependeria de apoio externo.',
    ],
    acceptance: [
      'O relatório descreve o que já está em produção, não um plano genérico de transformação.',
      'Cada recomendação cabe na realidade atual: time em formação, Claude corporativo, automações no ar e leitura do Protheus.',
    ],
    assumptions: [
      'Apoio consultivo. Execução e decisão de produto continuam com a Coordenação.',
      'Entrevistas com o time de IA e com a TI, em agenda combinada.',
      'Não substitui a priorização de negócio da Orfeu.',
    ],
    team: [
      { role: 'José Roberto', seniority: 'Partner', rateKey: 'partner', hoursPerWeek: 16 },
      { role: 'Arquiteto de integrações', seniority: 'Sênior', rateKey: 'architect', hoursPerWeek: 16 },
    ],
  },
  {
    id: 'h2',
    code: 'H2',
    group: 'habilitacao',
    title: 'Materiais e aceleradores',
        summary:
      'Pacote reutilizável para o time: templates de arquitetura, checklists de segurança e qualidade, modelo de documentação e critérios para avaliar uma solução.',
    weeks: { min: 1, max: 2 },
    risk: 'contido',
    warranty: '15 dias corridos para ajustar material que não se aplica ao contexto combinado.',
    deliverables: [
      'Template de arquitetura de uma solução interna.',
      'Checklist de segurança e qualidade, incluindo segredo, acesso e dado pessoal.',
      'Modelo de documentação e critério de avaliação de solução.',
      'Uma sessão de repasse gravada, com o time aplicando o material num caso real da Orfeu.',
    ],
    acceptance: [
      'O time consegue preencher o template num caso próprio durante o repasse.',
      'Os materiais ficam no repositório da Orfeu, editáveis, sem dependência da Pixel.',
    ],
    assumptions: [
      'O pacote é calibrado no assessment (H1) ou num briefing curto da Coordenação, se H1 não for contratado.',
      'Uma sessão de repasse. Sessões adicionais são o bloco H3.',
    ],
    team: [
      { role: 'Arquiteto de integrações', seniority: 'Sênior', rateKey: 'architect', hoursPerWeek: 24 },
      { role: 'José Roberto', seniority: 'Partner', rateKey: 'partner', hoursPerWeek: 8 },
    ],
  },
  {
    id: 'h3',
    code: 'H3',
    group: 'habilitacao',
    title: 'Mentoria técnica — 8 sessões',
    summary:
      'Oito sessões de 2 horas, duas por semana, com tema e participantes definidos antes. O foco é capacitar o time e formar tutores internos.',
    weeks: { min: 4, max: 4 },
    risk: 'contido',
    warranty: 'Sessão que não cumprir o tema combinado é refeita sem custo, dentro do período do bloco.',
    deliverables: [
      'Oito sessões de 2 horas, remotas, gravadas, duas por semana.',
      'Pauta fechada antes de cada sessão: tema, participantes e resultado esperado.',
      'Exercício para o time entre uma sessão e a seguinte, com nota curta do que ficou.',
    ],
    acceptance: [
      'As oito sessões acontecem com pauta prévia e gravação entregue.',
      'Ao final, a Coordenação indica quem no time replica o tema — o tutor interno daquele assunto.',
    ],
    assumptions: [
      'Temas e participantes são definidos pela Coordenação antes do bloco. Sugestões nossas entram como proposta, não como grade pronta.',
      'A carga inclui preparação de pauta e exercício, não só o tempo em sessão.',
      'Sessão extra fora das oito é uma nova cotação.',
      'A Pixel não assume a operação nem a priorização das soluções do time.',
    ],
    team: [
      { role: 'José Roberto', seniority: 'Partner', rateKey: 'partner', hoursPerWeek: 8 },
      { role: 'Arquiteto de integrações', seniority: 'Sênior', rateKey: 'architect', hoursPerWeek: 4 },
    ],
  },
]

function weekLabel(weeks: PriceBand) {
  if (weeks.min === weeks.max) return `${weeks.min} semanas`
  return `${weeks.min}–${weeks.max} semanas`
}

export const DELIVERIES: Delivery[] = DELIVERY_SEED.map(delivery => {
  const weeklyHours = delivery.team.reduce((total, member) => total + member.hoursPerWeek, 0)
  const perWeek = weeklyCost(delivery.team)
  const hours = {
    min: delivery.weeks.min * weeklyHours,
    max: delivery.weeks.max * weeklyHours,
  }
  const investment = {
    min: delivery.weeks.min * perWeek.min,
    max: delivery.weeks.max * perWeek.max,
  }
  return {
    ...delivery,
    weeklyHours,
    hours,
    window: weekLabel(delivery.weeks),
    investment,
    blendedRate: {
      min: Math.round(perWeek.min / weeklyHours),
      max: Math.round(perWeek.max / weeklyHours),
    },
  }
})

export const DELIVERY_GROUPS: { id: DeliveryGroup; title: string; subtitle: string }[] = [
  {
    id: 'diagnostico',
    title: 'Primeira entrega',
    subtitle: 'Recomendamos começar por aqui. O preço da execução fecha ao final deste bloco.',
  },
  {
    id: 'execucao',
    title: 'Execução da integração',
    subtitle: 'Dois caminhos independentes. A Orfeu contrata um, o outro, ou os dois em sequência — depois do diagnóstico.',
  },
  {
    id: 'oportunidade',
    title: 'Oportunidades mapeadas',
    subtitle: 'Frentes com valor próprio. Cada uma tem escopo, preço e critério de aceite separados.',
  },
  {
    id: 'habilitacao',
    title: 'Habilitação do time',
    subtitle: 'Blocos datados e consultivos. A execução e a decisão de produto continuam com a Coordenação.',
  },
]

export function deliveriesIn(group: DeliveryGroup) {
  return DELIVERIES.filter(delivery => delivery.group === group)
}

export function findDelivery(code: string) {
  const delivery = DELIVERIES.find(item => item.code === code)
  if (!delivery) throw new Error(`Entrega ausente: ${code}`)
  return delivery
}

function addBands(codes: string[]): PriceBand {
  return codes.reduce(
    (total, code) => {
      const delivery = findDelivery(code)
      return { min: total.min + delivery.investment.min, max: total.max + delivery.investment.max }
    },
    { min: 0, max: 0 },
  )
}

/** Somas indicativas de faixas independentes. Não são pacote nem desconto. */
export const COMPOSITIONS = [
  {
    id: 'pedido',
    title: 'Para gravar pedido',
    codes: ['D0', 'B1'],
    investment: addBands(['D0', 'B1']),
    note: 'Diagnóstico e, se a recomendação se confirmar, a escrita de um caso. Contratar D0 não obriga B1.',
  },
  {
    id: 'fundacao',
    title: 'Para o time operar sobre os dados',
    codes: ['D0', 'B2'],
    investment: addBands(['D0', 'B2']),
    note: 'Diagnóstico e a fundação de consulta. Não inclui escrita no ERP nem agentes prontos.',
  },
  {
    id: 'faturamento',
    title: 'Para chegar ao faturamento',
    codes: ['D0', 'B1', 'C2'],
    investment: addBands(['D0', 'B1', 'C2']),
    note: 'C2 só entra como extensão da escrita. A faixa larga é a do risco fiscal, estreita depois do D0.',
  },
]

// ─── Transferência ──────────────────────────────────────────────────────────────

export const KNOWLEDGE_TRANSFER = [
  {
    title: 'Decisões de arquitetura',
    detail: 'O que foi escolhido, o que foi descartado e por quê. Entregue junto com a solução, não numa apresentação final.',
  },
  {
    title: 'Runbook operacional',
    detail: 'Como publicar, monitorar, diagnosticar falha e reprocessar. O aceite inclui o time executando o runbook.',
  },
  {
    title: 'Testes automatizados',
    detail: 'A suíte cobre o critério de aceite, com instrução para o time rodar sem a Pixel.',
  },
  {
    title: 'Sessões de repasse gravadas',
    detail: 'Número combinado na largada da entrega. A gravação fica com a Orfeu.',
  },
]

// ─── Habilitação: como avaliamos ────────────────────────────────────────────────

export const MATURITY = {
  title: 'Como avaliamos maturidade e habilitamos o time',
  body: 'O índice olha cinco eixos no que a Orfeu já tem em produção: dado e acesso, segurança e segredo, arquitetura das soluções internas, forma de trabalho da Coordenação e adoção nos times de negócio. A leitura parte do Claude corporativo, das skills da Orfeu e das automações que já rodam — e diz o que priorizar agora, o que pode esperar e o que falta para o estágio AI First. A mentoria forma tutores internos. A Pixel não assume a priorização de negócio nem a operação.',
  axes: [
    { axis: 'Dado e acesso', question: 'O time consulta dado com origem, permissão e qualidade conhecidas?' },
    { axis: 'Segurança', question: 'Segredo, acesso e dado pessoal estão controlados nas automações que já rodam?' },
    { axis: 'Arquitetura', question: 'Uma solução nova nasce com contrato, teste e dono — ou como script solto?' },
    { axis: 'Forma de trabalho', question: 'Papéis, revisão e critério de pronto acompanham o crescimento do time?' },
    { axis: 'Adoção', question: 'Existe tutor interno capaz de multiplicar o uso, além de quem construiu a solução?' },
  ],
}

// ─── Experiência e referências ──────────────────────────────────────────────────

export const EXPERIENCE = [
  {
    title: 'Integração transacional com ERP',
    detail:
      'O desenho que propomos para o Protheus é o que já aplicamos em integração com sistema de registro: chamada autenticada, validação antes de gravar, idempotência, trilha e reprocesso. No caso da Orfeu, o diagnóstico olha API TOTVS, ADVPL e a camada intermediária sobre o ambiente real — a recomendação sai dessa leitura, não de um caminho genérico.',
  },
  {
    title: 'Arquitetura de dados e habilitação',
    detail:
      'Tratamos a base governada como produto do time interno: catálogo, origem do dado, acesso e runbook. O critério de aceite da fundação é a Coordenação consultar e publicar uma solução própria, não receber um agente pronto.',
  },
  {
    title: 'Contexto já percorrido com a Orfeu',
    detail:
      'O trabalho anterior de discovery — ciclo do pedido, crédito, faturamento e o papel do Protheus — informa esta proposta. Ele não é escopo desta contratação. Serve para o diagnóstico não recomeçar do zero.',
  },
]

export const REFERENCES_NOTE =
  'Dois projetos de porte semelhante, com contato verificável, serão apresentados na reunião de 45–60 minutos. Nomes de clientes não entram neste documento.'

// ─── Equipe ─────────────────────────────────────────────────────────────────────

export const TEAM_NOTE =
  'Na execução, um engenheiro sênior fica em tempo integral (40h/semana), com revisão de arquitetura e QA ao redor. Diagnóstico e raio-X correm a 40h/semana; assessment e materiais, a 32h/semana. Cada papel é cobrado pela própria taxa. José Roberto conduz os blocos de habilitação.'

// ─── Condições ──────────────────────────────────────────────────────────────────

export const COMMERCIAL_TERMS = [
  {
    label: 'O que está cotado agora',
    value: 'Faixa de investimento e prazo, com as premissas de cada entrega. Serve para comparar propostas na mesma base.',
  },
  {
    label: 'Quando o preço fecha',
    value: 'No documento de escopo da entrega, confirmado em conjunto, antes do início. A partir daí, preço e prazo são fechados.',
  },
  {
    label: 'Faturamento',
    value: '50% na mobilização da entrega e 50% no aceite. Diagnóstico e blocos de habilitação podem ser faturados inteiros no aceite, se a Coordenação preferir.',
  },
  {
    label: 'Continuidade',
    value: 'Nenhuma entrega compromete a seguinte. A Orfeu avalia e aprova antes de abrir a próxima.',
  },
  {
    label: 'Propriedade',
    value: 'Código, dados, credenciais e materiais ficam sob domínio da Orfeu desde o início, no repositório e na infraestrutura dela.',
  },
  {
    label: 'Ambiente',
    value: 'Homologação por padrão. Acesso a produção somente com aprovação formal e registrada.',
  },
  {
    label: 'Contrapartida',
    value: 'Ponto focal técnico designado para o período da entrega, com a interlocução com a TI intermediada pela Orfeu.',
  },
  {
    label: 'Aceite',
    value: 'Até 5 dias úteis para validar as evidências. Pendência recebe correção dentro da garantia ou um item explícito fora do escopo.',
  },
  {
    label: 'Garantia',
    value: 'Correção de defeito contra o critério de aceite, sem custo, no prazo declarado em cada entrega: 15 dias (diagnóstico e habilitação), 30 dias (software) e 45 dias (faturamento).',
  },
  {
    label: 'Mudança de escopo',
    value: 'O que estiver fora do critério de aceite escrito é nova cotação. Não há banco de horas para absorver mudança.',
  },
]

export const SCOPE = {
  included: [
    'Diagnóstico de viabilidade e recomendação de caminho, se D0 for contratado.',
    'As entregas de execução, oportunidade ou habilitação que a Orfeu confirmar, cada uma pelo seu escopo.',
    'Em toda entrega de software: documentação de arquitetura, runbook, testes automatizados e sessões de repasse.',
    'Garantia de correção de defeito no prazo declarado da entrega.',
  ],
  excluded: [
    'Estratégia de IA, adoção corporativa e aplicações de negócio já conduzidas pela Coordenação.',
    'Casos de uso comerciais, de marketing e de atendimento, salvo priorização expressa em contratação futura.',
    'Substituição de Protheus, WMS ou CRM, e redesenho da jornada comercial.',
    'Squad contínuo, banco de horas aberto e contrato atrelado a métrica ampla de ROI.',
    'Decisão de produto e priorização de negócio da Orfeu.',
    'Correção dos achados do raio-X de governança.',
    'Catálogo de agentes ou automações prontas sobre a base de dados.',
    'Licenças, cloud, certificado digital, consumo de API e serviços de terceiros.',
  ],
}

export const ASSUMPTIONS = [
  'As faixas são indicativas e declaradas para comparação. O preço fechado de cada entrega sai do escopo confirmado em conjunto.',
  'Cada papel é precificado pela própria taxa do Guia de Valores 2026. A unidade comercial é a entrega, não a hora. A hora aparece para mostrar a carga semanal.',
  'A Orfeu disponibiliza ponto focal, acessos de homologação e decisões no período da entrega contratada.',
  'B1 e B2 são caminhos independentes. C2 pressupõe a escrita do B1. C1 pressupõe dado de estoque já consultável.',
  'A carga semanal não muda dentro da faixa. O que varia é a duração: mais semanas, mais horas, mesmo ritmo.',
  'A faixa de C2 é a mais larga porque concentra risco fiscal e bancário. Semana parada à espera de terceiros não é cobrada. O diagnóstico estreita a duração se o caso entrar no D0.',
  'Custos de cloud, licenças, certificado, banco e APIs de terceiros não estão inclusos.',
  'Valores alinhados ao Guia PixelPulseLab 2026, edição de julho de 2026.',
]

export const NEXT_STEP = {
  title: 'Reunião de 45 a 60 minutos',
  body: 'Apresentar o caso do Protheus com quem opera o ERP, confirmar o que a versão e as licenças expõem, e sair com o escopo e o preço fechados do diagnóstico — ou da primeira entrega, se o caminho já estiver claro na sala.',
}

export const RISK_LABEL: Record<Delivery['risk'], string> = {
  contido: 'Risco contido',
  moderado: 'Risco moderado',
  alto: 'Maior risco',
}

export function validateProposalData() {
  const codes = DELIVERIES.map(delivery => delivery.code)
  const uniqueCodes = new Set(codes).size === codes.length
  const effortOk = DELIVERIES.every(delivery => {
    const weekly = delivery.team.reduce((total, member) => total + member.hoursPerWeek, 0)
    const perWeek = weeklyCost(delivery.team)
    return (
      weekly === delivery.weeklyHours &&
      delivery.hours.min === delivery.weeks.min * delivery.weeklyHours &&
      delivery.hours.max === delivery.weeks.max * delivery.weeklyHours &&
      delivery.investment.min === delivery.weeks.min * perWeek.min &&
      delivery.investment.max === delivery.weeks.max * perWeek.max
    )
  })
  const compositionsOk = COMPOSITIONS.every(composition => {
    const summed = addBands(composition.codes)
    return summed.min === composition.investment.min && summed.max === composition.investment.max
  })

  return { valid: uniqueCodes && effortOk && compositionsOk, codes: codes.length }
}

export const PROPOSAL_VALIDATION = validateProposalData()

if (!PROPOSAL_VALIDATION.valid) {
  throw new Error(`Proposta inconsistente: ${JSON.stringify(PROPOSAL_VALIDATION)}`)
}
