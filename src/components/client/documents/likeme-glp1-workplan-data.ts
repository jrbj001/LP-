export const GLP1_META = {
  id: 'likeme-plano-glp1-dr-matheus',
  title: 'Plano de trabalho · Flagship GLP-1 Dr. Matheus',
  client: 'Like:Me',
  date: '15/10/2026',
  path: '/plano-glp1',
  provider: 'Dr. Matheus · Clínica Volpi',
  program: 'Programa GLP-1 · 12 semanas',
  price: 'R$ 7.000',
  sources: [
    'Jornada piloto GLP-1 [Dr. Matheus] · planilha LIKEME.csv e desenho da jornada',
    'likeme-front-end · telas de marketplace, checkout, atividades, perfil, avatar e anamnese',
    'likeme-back-end · Prisma: product, order, subscription, activity, reminder, WhatsApp e anamnese',
    'Workspace Cadence · boards likeme-app e likeme-backend, colunas requirement → story → ready → dev → done',
  ],
}

export type JourneyPhase = 'fora' | 'entrada' | 'pre' | 'programa'

export interface JourneyStage {
  id: string
  title: string
  phase: JourneyPhase
  where: string
  owner: string
  summary: string
  app: string
  tabia: string
}

export const PHASES: { id: JourneyPhase; label: string; range: string }[] = [
  { id: 'fora', label: 'Fora do app', range: 'Etapa 1' },
  { id: 'entrada', label: 'Entrada e pagamento', range: 'Etapas 2–6' },
  { id: 'pre', label: 'Pré-programa', range: 'Etapas 7–10' },
  { id: 'programa', label: '12 semanas', range: 'Etapas 11–15' },
]

export const JOURNEY: JourneyStage[] = [
  {
    id: '1',
    title: 'Consulta inicial',
    phase: 'fora',
    where: 'Clínica · fora da Like:Me',
    owner: 'Clínica Volpi',
    summary:
      'Questionário pré-consulta, avaliação e indicação do programa e dos exames. Consulta pontual de R$ 780. Não entra no app.',
    app: 'Nenhuma tela nesta etapa.',
    tabia: 'Nenhum fluxo nesta etapa.',
  },
  {
    id: '2',
    title: 'Setup do usuário',
    phase: 'entrada',
    where: 'Desk · admin do provider',
    owner: 'Like:Me',
    summary: 'O admin do provider cadastra o paciente na Like:Me, já vinculado ao programa.',
    app: 'Cadastro administrativo com dados do perfil preenchidos.',
    tabia: 'Ainda sem mensagem. O convite sai na etapa seguinte.',
  },
  {
    id: '3',
    title: 'Convite',
    phase: 'entrada',
    where: 'WhatsApp',
    owner: 'Tabia',
    summary: 'O paciente recebe o link do app e um código de acesso.',
    app: 'Gera o código e o link. Não envia a conversa.',
    tabia: 'Envia o convite e registra que a mensagem saiu.',
  },
  {
    id: '4',
    title: 'Primeiro acesso',
    phase: 'entrada',
    where: 'App',
    owner: 'Like:Me',
    summary:
      'O código abre o perfil já preenchido, com o programa no carrinho e alerta na notificação. O pedido de exame aparece na atividade, bloqueado.',
    app: 'Onboarding por código, perfil, carrinho, notificação e exame bloqueado.',
    tabia: 'Follow-up se o acesso ou o pagamento não acontecerem.',
  },
  {
    id: '5',
    title: 'Conversão',
    phase: 'entrada',
    where: 'App',
    owner: 'Like:Me',
    summary:
      'Notificação do produto pendente, PDP do programa, PDP do provider, checkout e aceite do contrato do serviço.',
    app: 'Carrinho, PDP, checkout e check-in contratual.',
    tabia: 'Suporte até o pagamento.',
  },
  {
    id: '6',
    title: 'Pagamento',
    phase: 'entrada',
    where: 'App + WhatsApp',
    owner: 'Like:Me',
    summary:
      'R$ 7.000: à vista com desconto, Pix em até 3x, débito ou crédito. Pago, o PDF do exame é liberado e o link segue por WhatsApp.',
    app: 'Checkout dessas condições e liberação do documento na atividade.',
    tabia: 'Envia o link do pedido de exame e tira dúvida.',
  },
  {
    id: '7',
    title: 'Pré-programa',
    phase: 'pre',
    where: 'App',
    owner: 'Like:Me',
    summary: 'A atividade avança para a etapa de exames, com lembrete para fazê-los.',
    app: 'Pasta de atividades e notificação de exame.',
    tabia: 'Ainda não coleta resultado. Isso é a etapa 9.',
  },
  {
    id: '8',
    title: 'Touch points',
    phase: 'pre',
    where: 'App + operação',
    owner: 'Like:Me + Tabia',
    summary:
      'Agenda a nutricionista enquanto os exames correm, dispara o Kit Welcome e puxa a comunidade.',
    app: 'Agenda da nutricionista, etapa 2 e 3 do programa, comunidade ativa.',
    tabia: 'Gere o agendamento e a entrega do kit.',
  },
  {
    id: '9',
    title: 'Follow-up de exames',
    phase: 'pre',
    where: 'WhatsApp',
    owner: 'Tabia',
    summary: 'Acompanha a execução do exame, recebe os arquivos no WhatsApp e devolve para a ferramenta.',
    app: 'Recebe o arquivo que a Tabia encaminhar e atualiza a atividade.',
    tabia: 'Follow-up, recebimento e suporte.',
  },
  {
    id: '10',
    title: 'Recebe exames',
    phase: 'pre',
    where: 'App',
    owner: 'Like:Me',
    summary:
      'Salva o arquivo, avança a etapa, mostra os dados e convida a conectar devices. Agenda a consulta de avaliação com o Dr. Matheus.',
    app: 'Upload, visualização, devices e agenda da consulta de 45 min.',
    tabia: 'Confirma que a consulta vai acontecer e manda o link.',
  },
  {
    id: '11',
    title: 'Consulta pós-exames',
    phase: 'programa',
    where: 'App · 45 min',
    owner: 'Like:Me',
    summary:
      'A consulta acontece dentro do app, com notificação, link e conexão com o prontuário Amigo.',
    app: 'Sala da consulta e handoff para o prontuário.',
    tabia: 'Follow-up, link da chamada e suporte.',
  },
  {
    id: '12',
    title: 'Início das 12 semanas',
    phase: 'programa',
    where: 'App',
    owner: 'Like:Me',
    summary:
      'A contagem das 12 semanas começa aqui. Entram receita da caneta, suplementação e o pedido semanal de foto da balança e do corpo.',
    app: 'Receitas com link de compra, atividades e alertas dos retornos.',
    tabia: 'Envia os links, avisa a próxima atividade e mantém o engajamento.',
  },
  {
    id: '13',
    title: 'Acompanhamento',
    phase: 'programa',
    where: 'App + WhatsApp',
    owner: 'Like:Me + Tabia',
    summary:
      'Doze consultas de 15 min com o Dr. Matheus e três consultas mensais de 30 min com a nutricionista.',
    app: 'Agenda, notificação e sala das consultas de retorno.',
    tabia: 'Coleta foto corporal e foto da bioimpedância toda semana.',
  },
  {
    id: '14',
    title: 'Consultas periódicas',
    phase: 'programa',
    where: 'App',
    owner: 'Like:Me',
    summary: 'Cada retorno abre na ferramenta, com o mesmo vínculo ao prontuário do médico.',
    app: 'Infra da consulta recorrente dentro do app.',
    tabia: 'Garante presença, manda o link e tira dúvida.',
  },
  {
    id: '15',
    title: 'Evolução',
    phase: 'programa',
    where: 'App',
    owner: 'Like:Me',
    summary:
      'A evolução aparece na atividade e na visualização de dados. O app recomenda novas soluções, programas e comunidades.',
    app: 'Série temporal no perfil/avatar e recomendações.',
    tabia: 'Compartilha a evolução e sustenta a comunidade.',
  },
]

export const OFFERS = [
  {
    name: 'Consulta inicial',
    type: 'Pontual · porta de entrada',
    includes: 'Questionário, avaliação e indicação do programa e dos exames.',
    price: 'R$ 780',
    cadence: 'Único',
    where: 'Fora da Like:Me',
  },
  {
    name: 'Programa GLP-1 · 12 semanas',
    type: 'Fechado',
    includes:
      'Pedido de exames, Kit Welcome, retorno pós-exames, receitas e 12 semanas de acompanhamento médico e nutricional.',
    price: 'R$ 7.000 em até 3x',
    cadence: 'Único no ciclo',
    where: 'App',
  },
  {
    name: 'Medicação e suplementação',
    type: 'Recompra',
    includes: 'Caneta GLP-1 e suplementação de apoio, com envio recorrente.',
    price: 'Variável · take rate a validar',
    cadence: 'Recorrente',
    where: 'Marketplace',
  },
]

export const CODE_NOW = [
  {
    title: 'Programa como produto',
    detail:
      'Product aceita type program e liga uma comunidade (programCommunityId). Assinatura ACTIVE coloca o usuário nessa comunidade e libera o conteúdo do protocolo.',
    where: 'likeme-back-end · product, programCommunityMembershipService, programCourseAccessService',
  },
  {
    title: 'Carrinho, PDP e checkout',
    detail:
      'O app já tem carrinho, detalhe do produto, perfil do provider e checkout com endereço. O tipo de pagamento inclui Pix, mas a tela força cartão de crédito. A assinatura no backend cobra só credit_card em 1 parcela.',
    where: 'CheckoutScreen · subscriptionService',
  },
  {
    title: 'Pedido com entrega',
    detail:
      'Order guarda frete, status de entrega e trackingNumber. Serve de base para o Kit Welcome, sem o fluxo operacional da Tabia.',
    where: 'likeme-back-end · model Order',
  },
  {
    title: 'Atividades e lembretes',
    detail:
      'Activity é tarefa ou evento, com data e lembrete. Reminder dispara para atividade e evento de comunidade. Ainda não há etapas de um programa de 12 semanas nem documento bloqueado.',
    where: 'model Activity, model Reminder, ActivitiesScreen',
  },
  {
    title: 'WhatsApp, push e e-mail',
    detail:
      'Preferência do usuário já separa ofertas, atividades e transações nos canais e-mail, WhatsApp e push. Existe serviço de mensagem WhatsApp. Não existe a régua de cuidado da Tabia.',
    where: 'UserNotificationPreference, WhatsAppMessage',
  },
  {
    title: 'Anamnese, avatar e comunidade',
    detail:
      'A anamnese de hábitos, corpo e mente já abre no onboarding. O avatar mostra progresso. A comunidade entra junto com a assinatura ativa. São a base do perfil, da visualização e do engajamento — não o prontuário nem a foto semanal de bioimpedância.',
    where: 'Anamnesis*, AvatarProgressScreen, Community',
  },
]

export const CODE_GAP = [
  'Código de acesso que abre o perfil preenchido e deixa o programa no carrinho.',
  'Pedido de exame em PDF, visível e bloqueado até o pagamento, depois liberado na atividade.',
  'Checkout do programa fechado: à vista com desconto, Pix em até 3x, débito e crédito. Hoje a cobrança de assinatura é cartão em 1x.',
  'Máquina de etapas do programa (exame → consulta → semana 1…12), em vez de atividade solta.',
  'Teleconsulta de 15, 30 e 45 min dentro do app. O chat atual não é sala clínica.',
  'Memed para pedido de exame e acesso à farmácia. Não há referência no front nem no backend.',
  'Prontuário Amigo. A agenda do Dr. Matheus hoje vive lá, fora da Like:Me.',
  'Admin clínico em que mais de um provider da mesma equipe atende. O admin atual cobre usuário, voucher, integração e observabilidade.',
  'Nota fiscal no nome do Dr. Matheus para reembolso.',
  'Coleta semanal de foto corporal e da balança, com série no avatar.',
  'Tabia embutida no admin e o contrato de ida e volta: convite, kit, exame recebido no WhatsApp, status da atividade.',
]

export type EffortSize = 'P' | 'M' | 'G'

export interface TaskEffort {
  /** Dias de uma pessoa desenvolvendo, sem contar revisão de PM. */
  days: number
  size: EffortSize
  note: string
}

export interface MissionTask {
  id: string
  board: 'likeme-app' | 'likeme-backend'
  title: string
  persona: string
  want: string
  soThat: string
  acceptance: string[]
  effort: TaskEffort
}

export interface Mission {
  id: string
  name: string
  stages: string
  start: string
  outcome: string
  window: { start: string; end: string; label: string }
  tasks: MissionTask[]
}

export const EFFORT_SIZES: Record<EffortSize, string> = {
  P: 'até 2 dias',
  M: '3 a 4 dias',
  G: '5 dias ou mais',
}

export const TEAM_ASSUMPTION = {
  title: 'Base da estimativa',
  items: [
    'Implementação no Cursor, com likeme-front-end e likeme-back-end no contexto. O dia conta revisão do diff e teste, não a digitação.',
    'Uma pessoa no app e uma no backend, em paralelo. O que o Cursor encurta é o código em cima de tela e serviço que já existem.',
    'Pagamento na Pagar.me, sala de vídeo e o contrato com a Tabia não encolhem na mesma proporção: sandbox, SDK e alinhamento de payload continuam no calendário.',
    'Revisão de PM, TestFlight e loja ficam fora dos dias. Memed, Amigo e nota fiscal continuam fora deste plano.',
  ],
}

export const MISSIONS: Mission[] = [
  {
    id: 'M1',
    name: 'Entrar no app e pagar',
    stages: 'Etapas 2 a 6',
    start: 'Abrir agora',
    outcome: 'Um paciente cadastrado pelo admin consegue entrar com código, ver o programa no carrinho e pagar. O exame continua bloqueado até o pagamento.',
    window: { start: '2026-11-02', end: '2026-11-12', label: '02/11 → 12/11' },
    tasks: [
      {
        id: 'm1-cadastro-codigo',
        board: 'likeme-backend',
        title: 'Cadastrar paciente do programa com código de acesso',
        persona: 'admin do provider',
        want: 'cadastrar o paciente já ligado ao Programa GLP-1 e gerar um código de acesso',
        soThat: 'o convite não dependa de um cadastro vazio feito pelo próprio paciente',
        acceptance: [
          'O admin grava nome e contato e associa o produto do programa.',
          'O sistema devolve um código de uso único.',
          'O código ainda não marca o programa como pago.',
        ],
        effort: {
          days: 2,
          size: 'P',
          note: 'Rota admin, código de uso único e vínculo com o produto. Reusa User, Person e Product; o Cursor parte desses modelos.',
        },
      },
      {
        id: 'm1-primeiro-acesso',
        board: 'likeme-app',
        title: 'Primeiro acesso com perfil preenchido e programa no carrinho',
        persona: 'paciente',
        want: 'entrar com o código e cair no perfil já preenchido, com o programa no carrinho e um alerta',
        soThat: 'eu não precise recadastrar dados nem procurar a oferta',
        acceptance: [
          'O código válido abre a sessão no usuário pré-cadastrado.',
          'O carrinho contém o programa de R$ 7.000.',
          'A notificação aponta para esse item pendente.',
          'O pedido de exame aparece na atividade e não abre o arquivo.',
        ],
        effort: {
          days: 3,
          size: 'M',
          note: 'Onboarding por código em telas que já existem: perfil, carrinho, notificação e item bloqueado na ActivitiesScreen.',
        },
      },
      {
        id: 'm1-checkout-3x',
        board: 'likeme-app',
        title: 'Checkout do programa em até 3x',
        persona: 'paciente',
        want: 'pagar à vista com desconto, no Pix em até 3x, no débito ou no crédito',
        soThat: 'a condição fechada com o Dr. Matheus caiba no app',
        acceptance: [
          'A tela oferece as quatro condições, sem forçar só cartão em 1x.',
          'O aceite do contrato do serviço fica registrado antes de cobrar.',
          'Pagamento confirmado muda o pedido para pago.',
        ],
        effort: {
          days: 4,
          size: 'M',
          note: 'O diff no CheckoutScreen e no subscriptionService é curto. Os 4 dias cabem o sandbox da Pagar.me: Pix, parcelas e o aceite do contrato antes da cobrança.',
        },
      },
      {
        id: 'm1-liberar-exame',
        board: 'likeme-backend',
        title: 'Liberar o PDF do exame depois do pagamento',
        persona: 'paciente',
        want: 'receber o pedido de exame só depois que o pagamento confirmar',
        soThat: 'o documento clínico não vaze antes da compra',
        acceptance: [
          'Antes do pago, a atividade devolve o item bloqueado.',
          'Depois do pago, a mesma atividade entrega o PDF.',
          'O backend registra um evento que a Tabia pode usar para mandar o link no WhatsApp.',
        ],
        effort: {
          days: 2,
          size: 'P',
          note: 'Documento na atividade, liberado pelo webhook de pagamento, com evento no canal WhatsApp que já existe.',
        },
      },
    ],
  },
  {
    id: 'M2',
    name: 'Pré-programa até os exames',
    stages: 'Etapas 7 a 10',
    start: 'Depois da M1 em desenvolvimento',
    outcome: 'O paciente vê a etapa de exames, a nutricionista entra na agenda e o arquivo do exame volta para a atividade.',
    window: { start: '2026-11-09', end: '2026-11-19', label: '09/11 → 19/11' },
    tasks: [
      {
        id: 'm2-etapa-exames',
        board: 'likeme-app',
        title: 'Etapa de exames com lembrete',
        persona: 'paciente',
        want: 'ver a próxima etapa obrigatória e ser lembrado de fazer o exame',
        soThat: 'o pré-programa não pare no pagamento',
        acceptance: [
          'A atividade mostra a etapa de exames como a corrente.',
          'Um lembrete é agendado no canal permitido do usuário.',
        ],
        effort: {
          days: 2,
          size: 'P',
          note: 'Primeira etapa da máquina de estados sobre Activity e Reminder, que já disparam lembrete.',
        },
      },
      {
        id: 'm2-contrato-tabia',
        board: 'likeme-backend',
        title: 'Contrato com a Tabia para kit, agenda e arquivo',
        persona: 'operação Tabia',
        want: 'informar agenda da nutricionista, rastreio do Kit Welcome e o arquivo de exame recebido no WhatsApp',
        soThat: 'o app e o admin do provider atualizem sem a Tabia escrever no banco',
        acceptance: [
          'Cada evento atualiza a atividade do programa e fica visível no admin.',
          'O rastreio do kit aparece para o provider e para o paciente.',
          'O arquivo de exame fica na pasta da atividade.',
        ],
        effort: {
          days: 4,
          size: 'M',
          note: 'Endpoint, rastreio no Order e upload cabem em código curto. Os 4 dias assumem o payload da Tabia já combinado; sem isso o calendário escorrega, não o diff.',
        },
      },
    ],
  },
  {
    id: 'M3',
    name: 'Abrir as 12 semanas',
    stages: 'Etapas 11 e 12',
    start: 'Depois que o exame chega na atividade',
    outcome: 'A consulta de 45 min acontece no app e, ao terminar, a contagem das 12 semanas começa com receitas e pedido de foto.',
    window: { start: '2026-11-15', end: '2026-11-26', label: '15/11 → 26/11' },
    tasks: [
      {
        id: 'm3-consulta-45',
        board: 'likeme-app',
        title: 'Consulta de 45 min dentro do app',
        persona: 'paciente',
        want: 'entrar na consulta pós-exames por um link dentro da Like:Me',
        soThat: 'a avaliação dos exames não volte para uma ferramenta solta',
        acceptance: [
          'A notificação e a atividade abrem a sala na data marcada.',
          'A duração prevista é 45 minutos.',
          'O vínculo com o prontuário Amigo fica explícito como integração, não como tela improvisada.',
        ],
        effort: {
          days: 5,
          size: 'G',
          note: 'A tela e o link na atividade são rápidos no Cursor. Os 5 dias são o SDK de vídeo, permissão de câmera e teste em aparelho. O provedor precisa estar escolhido antes; senão soma uma semana de calendário.',
        },
      },
      {
        id: 'm3-inicio-12-semanas',
        board: 'likeme-backend',
        title: 'Início da contagem de 12 semanas',
        persona: 'paciente',
        want: 'receber receitas e a demanda semanal de fotos quando o programa começar',
        soThat: 'a semana 1 tenha uma data real, não só um produto comprado',
        acceptance: [
          'A data de início fica gravada na inscrição do programa.',
          'Caneta e suplementação aparecem como itens com link de compra.',
          'A primeira coleta de foto entra na atividade da semana.',
        ],
        effort: {
          days: 3,
          size: 'M',
          note: 'Data de início na inscrição, receitas como produto com link e geração das atividades da semana 1.',
        },
      },
    ],
  },
  {
    id: 'M4',
    name: 'Acompanhar as 12 semanas',
    stages: 'Etapas 13 a 15',
    start: 'Com a semana 1 já datada',
    outcome: 'Os 12 retornos médicos, as 3 consultas da nutricionista e a série de fotos aparecem na jornada e no avatar.',
    window: { start: '2026-11-22', end: '2026-12-03', label: '22/11 → 03/12' },
    tasks: [
      {
        id: 'm4-grade-consultas',
        board: 'likeme-backend',
        title: 'Grade de 12 consultas médicas e 3 nutricionais',
        persona: 'paciente',
        want: 'ver os retornos já previstos até o fim do programa',
        soThat: 'ninguém remarque a série inteira na mão toda semana',
        acceptance: [
          'Existem 12 slots de 15 min com o Dr. Matheus.',
          'Existem 3 slots de 30 min com a nutricionista.',
          'Cada slot gera lembrete para paciente e médico.',
        ],
        effort: {
          days: 3,
          size: 'M',
          note: 'Geração da grade a partir da data de início, com Reminder já existente. A agenda real do médico continua no Amigo.',
        },
      },
      {
        id: 'm4-serie-avatar',
        board: 'likeme-app',
        title: 'Série de evolução no avatar',
        persona: 'paciente',
        want: 'ver peso, bioimpedância e fotos ao longo das semanas',
        soThat: 'o acompanhamento não fique só no WhatsApp da Tabia',
        acceptance: [
          'A Tabia consegue entregar a foto da semana.',
          'O avatar mostra a série, não um marco único.',
          'O app pode recomendar outro programa ao fim da leitura.',
        ],
        effort: {
          days: 4,
          size: 'M',
          note: 'Série no AvatarProgressScreen em cima da tela que já existe, mais a ingestão da foto semanal pelo contrato da Tabia.',
        },
      },
    ],
  },
]

export function missionEffortDays(mission: Mission): number {
  return mission.tasks.reduce((total, task) => total + task.effort.days, 0)
}

export function planEffortDays(): number {
  return MISSIONS.reduce((total, mission) => total + missionEffortDays(mission), 0)
}

export function findMissionTask(taskId: string): { mission: Mission; task: MissionTask } | null {
  for (const mission of MISSIONS) {
    const task = mission.tasks.find(item => item.id === taskId)
    if (task) return { mission, task }
  }
  return null
}

export interface RoadmapMilestone {
  date: string
  label: string
  kind: 'start' | 'release' | 'pause' | 'pilot'
}

export const ROADMAP = {
  start: '2026-11-01',
  end: '2026-12-24',
  sprintDays: 7,
  milestones: [
    { date: '2026-11-02', label: 'Kick-off · Missão 1 no board', kind: 'start' },
    { date: '2026-11-12', label: 'Release 1 · entrar e pagar', kind: 'release' },
    { date: '2026-11-19', label: 'Release 2 · exames na atividade', kind: 'release' },
    { date: '2026-11-26', label: 'Release 3 · consulta e semana 1', kind: 'release' },
    { date: '2026-12-03', label: 'Release 4 · 12 semanas no avatar', kind: 'release' },
    { date: '2026-12-17', label: 'Piloto · primeiro paciente do Dr. Matheus', kind: 'pilot' },
  ] satisfies RoadmapMilestone[],
  notes: [
    '32 dias de desenvolvimento no total, contra a leitura anterior sem Cursor. No calendário são cinco semanas de código e duas de folga até o piloto, para loja e agenda da clínica.',
    'As janelas se sobrepõem: quem termina o backend de uma missão começa a seguinte enquanto o app fecha a anterior.',
    'O kick-off é 2 de novembro. O código fecha em 3 de dezembro, antes da pausa de fim de ano. Se o provedor de vídeo ou o payload da Tabia atrasarem, o piloto de 17 de dezembro é o que escorrega.',
    'O piloto vale com um paciente real da Clínica Volpi. Os pontos da seção 09 precisam estar fechados antes do Release 1.',
  ],
}

export const TRANSVERSAL = [
  {
    title: 'Memed',
    detail: 'Pedido de exame na área do usuário e caminho de farmácia. Hoje o pedido nasce no Memed, fora do app.',
  },
  {
    title: 'Amigo',
    detail: 'Prontuário e agenda atuais do Dr. Matheus. A Like:Me consulta e devolve status; não substitui o prontuário nesta missão.',
  },
  {
    title: 'Nota fiscal',
    detail: 'Emissão no nome do Dr. Matheus para reembolso de plano. Modelo tributário ainda está marcado para validar.',
  },
  {
    title: 'Admin multi-provider',
    detail: 'Consultas online do admin precisam atender mais de um profissional da mesma equipe, com a Tabia transparente nesse desk.',
  },
  {
    title: 'Avatar contínuo',
    detail: 'O avatar de progresso já existe. Falta alimentá-lo toda semana com bioimpedância, foto e transcrição de consulta.',
  },
]

export const OPEN_VALIDATIONS = [
  'Nome comercial do programa.',
  'Take rate da recompra de medicação.',
  'Fee de ferramenta, royalty e abatimento por provider.',
  'Regulatório, termos e contrato assinado.',
  'Desconto do pagamento à vista — o valor cheio é R$ 7.000; o desconto não veio na planilha.',
  'Quem emite a nota e como a receita se separa entre clínica e Like:Me.',
]

export const START_STEPS = [
  {
    title: 'Publicar este plano como fonte',
    detail:
      'Ele fica em Documentos do cliente Like:Me. A planilha e o desenho de origem continuam como anexo de trabalho; o que o time executa é esta página.',
  },
  {
    title: 'Abrir só a Missão 1',
    detail:
      'Na seção 06, as quatro stories da M1 já vêm marcadas. O botão cria os cards nos boards App Frontend e Backend, já como story: persona, quero, para e aceite. A etapa 1 não vira card — a consulta de R$ 780 acontece na clínica.',
  },
  {
    title: 'Não reextrair o desenho inteiro',
    detail:
      'O envio de um arquivo em Documentos gera no máximo 12 rascunhos e pode misturar requisito com story. O backlog desta jornada já está fechado aqui. Criar card a partir desta página, não pedir para a IA reler o quadro.',
  },
  {
    title: 'Enriquecer antes de desenvolver',
    detail:
      'Com a opção ligada, o envio já dispara o enriquecimento agent-ready: a IA lê likeme-front-end e likeme-back-end e grava arquivos prováveis, riscos e plano de teste, e o card vai para Pronta p/ agent. O PM revisa no card antes de mover para desenvolvimento.',
  },
  {
    title: 'Separar o que é Tabia do que é código',
    detail:
      'Convite, kit, coleta de foto e follow-up de exame são operação Tabia. O card da Pixel é o contrato: evento entra, atividade e admin atualizam. Não abrir esses itens como se houvesse um repositório Tabia neste workspace.',
  },
  {
    title: 'Segurar M2, M3 e M4',
    detail:
      'Elas já estão escritas para não se perderem. Entram no board quando a missão anterior estiver em desenvolvimento, para o paciente não ter exame, consulta e semana 1 sem a porta de entrada paga.',
  },
]
