export const META = {
  product: 'Adaptive Layer™',
  company: 'PixelPulseLab',
  eyebrow: 'Adaptive Layer™',
  headline: 'The data and context layer that makes the enterprise AI-ready.',
  headlinePt: 'A camada de dados e contexto que deixa a empresa pronta para IA.',
  lede:
    'Adaptive Layer™ conecta os sistemas da empresa, organiza a verdade operacional e entrega contexto governado para agentes e times — rodando na sua nuvem.',
}

export const PLATFORM = {
  eyebrow: 'Plataforma',
  headline: 'Uma camada. Dados, contexto e ação.',
  body:
    'A Adaptive Layer™ unifica o que a operação já produz e expõe isso como contrato único: para APIs, automações e qualquer agente.',
  layers: [
    {
      n: '01',
      title: 'Dados',
      detail: 'Ingestão, eventos e conectores. ERP, WMS, CRM, commerce, EDI e sensores entram na mesma malha.',
    },
    {
      n: '02',
      title: 'Contexto',
      detail: 'Verdade canônica e conhecimento do processo. Pedido, lote, cliente e evento atravessam a jornada uma vez.',
    },
    {
      n: '03',
      title: 'Ação',
      detail: 'APIs, regras, quick wins e agentes com dono de área. O modelo consulta a Layer — não uma planilha paralela.',
    },
  ],
}

export const CAPABILITIES = {
  eyebrow: 'Capacidades',
  headline: 'Tudo na mesma infraestrutura.',
  items: [
    {
      title: 'Integração & eventos',
      detail: 'Conectores, filas e webhooks. Cada sistema continua no seu lugar. A Layer é o tecido entre eles.',
    },
    {
      title: 'Verdade operacional',
      detail: 'Pedido, lote, cliente, evento. Grafo do processo — o dado entra uma vez e serve a jornada inteira.',
    },
    {
      title: 'Knowledge',
      detail: 'Documentos, políticas e memória da operação, indexados sobre a mesma verdade canônica.',
    },
    {
      title: 'Agentes & skills',
      detail: 'Squad por área, prompt de domínio e ferramentas executáveis. Cada agente tem dono e trilha auditável.',
    },
    {
      title: 'MCP',
      detail: 'A Layer se expõe a Claude, ChatGPT, Copilot ou o próximo cliente. Troque o modelo. O contexto fica.',
    },
    {
      title: 'Governança',
      detail: 'LGPD, ACLs, residência e audit. Dado na conta do cliente. Runtime na nuvem dele ou no edge brasileiro.',
    },
  ],
}

export const PRODUCT_ARCH = {
  eyebrow: 'Arquitetura',
  headline: 'O produto, em uma vista.',
  body: 'Fontes entram. A Adaptive Layer™ organiza dados, contexto e ação — com governança no mesmo desenho. O contrato sai para agentes, APIs e qualquer modelo.',
  sources: [
    { label: 'ERP', hint: 'pedido · NF · crédito' },
    { label: 'WMS', hint: 'lote · estoque' },
    { label: 'CRM / CX', hint: 'cliente · ticket' },
    { label: 'Commerce', hint: 'carrinho · canal' },
    { label: 'EDI / portal', hint: 'B2B' },
    { label: 'Docs', hint: 'política · contrato' },
    { label: 'Lake', hint: 'se já existir' },
  ],
  layers: [
    {
      n: '01',
      title: 'Dados',
      modules: ['Conectores', 'Eventos', 'Filas', 'CDC'],
    },
    {
      n: '02',
      title: 'Contexto',
      modules: ['Verdade canônica', 'Knowledge', 'Vetor*', 'Memória'],
    },
    {
      n: '03',
      title: 'Ação',
      modules: ['APIs / SDK', 'Skills', 'Agentes', 'MCP'],
    },
  ],
  note: '* Vetor só depois da identidade — e só no texto sem schema.',
  governance: ['LGPD', 'ACL', 'Audit', 'Residência', 'BYOC'],
  outs: [
    { label: 'Squad de agentes', hint: 'dono de área · tools do processo' },
    { label: 'APIs & quick wins', hint: 'automação · regras · portal' },
    { label: 'Qualquer modelo', hint: 'Claude · Copilot · MCP' },
  ],
  runtime: 'Runtime na nuvem do cliente ou no edge brasileiro.',
}

export const STEPS = {
  eyebrow: 'Passo a passo',
  headline: 'Como tudo acontece — do pedido à resposta.',
  body:
    'Um exemplo só: o pedido #4821 nasce no ERP. Acompanhe o que a Adaptive Layer™ faz, sem jargão.',
  example: 'Pedido #4821',
  items: [
    {
      n: '01',
      title: 'A empresa já tem sistemas',
      say: 'ERP, estoque, CRM, portal, e-mails, PDFs de política. Cada um fala a sua língua. Ninguém apaga isso.',
      example: 'O comercial abre o pedido no ERP. O WMS ainda não sabe. A política de prazo está num PDF.',
    },
    {
      n: '02',
      title: 'Algo acontece na operação',
      say: 'Um pedido nasce, um crédito é aprovado, um lote sai, um contrato é anexado. Isso é um evento — um fato do mundo real.',
      example: '#4821: 40 caixas, cliente X, entrega sexta. Alguém anexa a política de SLA.',
    },
    {
      n: '03',
      title: 'A Layer escuta',
      say: 'Conectores pegam o evento no sistema de origem. Ninguém redigita. Nada vai para uma planilha paralela.',
      example: 'O conector do ERP manda: “pedido criado”. O PDF entra como documento do mesmo cliente.',
    },
    {
      n: '04',
      title: 'O fato ganha um nome único',
      say: 'Pedido, lote e cliente viram identidade. A partir daqui, todo mundo aponta para a mesma coisa — não para três códigos diferentes.',
      example: '#4821, lote L-19 e cliente X passam a ser um só registro na Layer.',
    },
    {
      n: '05',
      title: 'Número fica número. Texto vai para busca.',
      say: 'Status, saldo, nota, prazo — isso já tem forma. Fica registro. Política, contrato, e-mail — isso é texto. Só o texto segue em frente.',
      example: '“40 caixas, sexta” fica no registro. A política de SLA é texto: ainda não virou vetor.',
    },
    {
      n: '06',
      title: 'Agora sim: vetorização',
      say: 'Vetor é um jeito de achar texto pelo significado, não pela palavra exata. Só acontece depois da identidade — e o pedaço de texto fica amarrado ao pedido ou ao cliente.',
      example: 'A política é fatiada, vira vetor e aponta para o cliente X. #4821 continua número.',
    },
    {
      n: '07',
      title: 'Alguém pergunta — pessoa ou agente',
      say: 'O time no portal, um agente de área ou o Copilot. Todos batem na mesma porta. A Layer olha permissão antes de responder.',
      example: '“Por que o #4821 pode atrasar?” O agente tem dono no comercial.',
    },
    {
      n: '08',
      title: 'A Layer responde os dois lados',
      say: 'Devolve o fato (prazo, estoque, status) e o trecho da política que vale para aquele cliente. Tudo logado. O modelo não inventa o pedido.',
      example: 'Resposta: sexta no registro + cláusula de SLA do cliente X. Audit gravou quem viu.',
    },
  ],
}

export const ARCH = {
  eyebrow: 'Como trabalha',
  headline: 'Do evento à ação — e quando o vetor entra.',
  body:
    'A Adaptive Layer™ não começa no embedding. Primeiro o fato vira identidade. A vetorização acontece depois, só no que precisa de busca semântica — e sempre amarrada ao pedido, lote ou cliente.',
  sources: ['ERP', 'WMS', 'CRM / CX', 'Commerce', 'EDI / portal', 'Sensores', 'Docs'],
}

export const FLOW = {
  beats: [
    {
      id: 'fontes',
      label: 'Fontes',
      hint: 'sistemas e documentos',
      say: 'ERP, WMS, CRM e documentos emitem o que a operação já produz.',
    },
    {
      id: 'eventos',
      label: 'Eventos',
      hint: 'ingestão',
      say: 'Conectores e filas entram na Layer. Sem redigitar. Sem base paralela.',
    },
    {
      id: 'verdade',
      label: 'Verdade',
      hint: 'identidade canônica',
      say: 'Pedido, lote e cliente viram registro único. O fato ganha identidade antes de qualquer modelo.',
    },
    {
      id: 'fork',
      label: 'Dois caminhos',
      hint: 'fato × conhecimento',
      say: 'O fato transacional fica registro. O texto sem schema segue para vetorização.',
    },
    {
      id: 'vetor',
      label: 'Vetor',
      hint: 'só agora',
      say: 'Chunk, embed, chave na identidade. Política e contrato apontam para o mesmo cliente do ERP.',
    },
    {
      id: 'contrato',
      label: 'Contrato',
      hint: 'API · agente · MCP',
      say: 'O agente consulta a Layer: fato estruturado + trecho semântico, com ACL e audit.',
    },
  ],
  packets: [
    { id: 'fato', label: 'Pedido #4821', kind: 'fato' as const },
    { id: 'doc', label: 'Política de SLA', kind: 'conhecimento' as const },
  ],
}

export const VECTORIZATION = {
  eyebrow: 'Vetorização',
  headline: 'Quando o embedding acontece.',
  body:
    'Vetor não é o primeiro passo. É o passo que o conhecimento pede — depois que a identidade já existe e a governança já cortou o que não pode sair.',
  when: [
    {
      title: 'Depois da identidade',
      detail: 'O embedding aponta para pedido, lote ou cliente. Sem isso, o vetor é um trecho solto.',
    },
    {
      title: 'Em texto sem schema',
      detail: 'Políticas, contratos, manuais, atas, e-mails. O que o ERP não modela — e o agente precisa recuperar.',
    },
    {
      title: 'Quando o documento muda',
      detail: 'Reindex incremental. Não é dump único do lake. O que mudou, re-embeda. O que não mudou, fica.',
    },
    {
      title: 'Depois da governança',
      detail: 'ACL, residência e mascaramento já aplicados. Não se vetoriza o que não se pode devolver.',
    },
  ],
  stays: [
    { title: 'Status do pedido', detail: 'Evento + registro.' },
    { title: 'Saldo, NF, OTD', detail: 'Número tem schema.' },
    { title: 'Crédito aprovado', detail: 'Decisão auditável.' },
  ],
}

export const GOVERNANCE = {
  eyebrow: 'Governança',
  headline: 'Os dados ficam na sua nuvem.',
  body: 'A Adaptive Layer™ roda na infraestrutura do cliente — AWS, Azure, GCP ou edge no Brasil.',
  items: [
    { title: 'BYOC', detail: 'A plataforma entra na conta do cliente. Sem extrair o dado para um SaaS de terceiros.' },
    { title: 'Permissões herdadas', detail: 'Cada consulta respeita as ACLs do sistema-fonte.' },
    { title: 'Audit trail', detail: 'Cada acesso fica logado. Agente, pessoa e sistema na mesma trilha.' },
    { title: 'LGPD-first', detail: 'Residência, anonimização e DPA no desenho — não como anexo.' },
  ],
}

export const PROOF = {
  eyebrow: 'No campo',
  headline: 'Onde a Layer já opera.',
  items: [
    { name: 'Café Orfeu', detail: 'Order-to-delivery, Protheus, WMS, portal. Adaptive Layer no Executive Review.' },
    { name: 'Banana Brasil', detail: 'Assessment, NDA e LGPD. Dado que não pode ir para API pública.' },
    { name: 'Adaptive Enterprise™', detail: 'Assessment, comitê, quick wins e Layer — o método que abre a implantação.' },
  ],
}

export const VIDEO = {
  eyebrow: 'Vídeo',
  headline: 'Como funciona.',
  body: 'A IA não conhece a sua operação. A Adaptive Layer™ junta o que a empresa já sabe e entrega para agentes — com permissão, na sua nuvem.',
  durationLabel: '1 min 30s',
  scenes: [
    {
      id: 'intro',
      ms: 16000,
      kicker: 'Adaptive Layer™',
      title: 'Do pedido à resposta.',
      voice:
        'Não falta modelo. Falta contexto. A Adaptive Layer é a camada entre o que a operação já sabe... e a inteligência que vai usar isso amanhã.',
      caption: 'A camada de dados e contexto que deixa a empresa pronta para IA.',
    },
    {
      id: 'systems',
      ms: 14000,
      kicker: '01',
      title: 'A empresa já tem sistemas',
      voice:
        'No chão, é assim: ERP. Estoque. CRM. Um PDF de política. Cada um no seu canto. A Layer entra no meio. Sem apagar o que já funciona.',
      caption: 'ERP, WMS, CRM e o PDF da política — cada um no seu lugar.',
    },
    {
      id: 'event',
      ms: 15000,
      kicker: '02',
      title: 'Algo acontece',
      voice:
        'Aí o comercial fecha um pedido. Quarenta caixas. Cliente X. Entrega sexta. Anexa a política de prazo. Isso é um fato da operação. Não é um prompt.',
      caption: '#4821 · 40 caixas · cliente X · entrega sexta.',
    },
    {
      id: 'listen',
      ms: 13000,
      kicker: '03',
      title: 'A Layer escuta',
      voice:
        'A Layer escuta na origem. O evento entra uma vez. Ninguém copia pra planilha. O PDF entra junto... do mesmo cliente.',
      caption: 'Conector: pedido criado. O PDF entra com o mesmo cliente.',
    },
    {
      id: 'identity',
      ms: 14000,
      kicker: '04',
      title: 'Um nome único',
      voice:
        'Pedido, lote e cliente viram um nome só. A partir daqui, a empresa inteira aponta para o mesmo registro. Acabou o código diferente em cada sistema.',
      caption: '#4821 + lote L-19 + cliente X = um registro.',
    },
    {
      id: 'split',
      ms: 16000,
      kicker: '05',
      title: 'Número fica número',
      voice:
        'Aqui está a regra. Número tem forma: quantidade, prazo, nota. Fica registro. Texto não tem forma: política, contrato, e-mail. Só o texto segue.',
      caption: 'Fato fica registro. Texto ainda não é vetor.',
    },
    {
      id: 'vector',
      ms: 18000,
      kicker: '06',
      title: 'Agora sim: vetor',
      voice:
        'Vetor não é o primeiro passo. É só um jeito de achar texto pelo sentido. A política é fatiada, vira vetor, e fica amarrada naquele cliente. O pedido... continua número. Não vira vetor.',
      caption: 'Chunk → embed → chave no cliente. #4821 não vira vetor.',
    },
    {
      id: 'ask',
      ms: 14000,
      kicker: '07',
      title: 'Alguém pergunta',
      voice:
        'Quando alguém pergunta — no portal, num agente, no Copilot — todos batem na mesma porta. A Layer olha quem pode ver. Antes de responder.',
      caption: '“Por que o #4821 pode atrasar?” · dono: comercial',
    },
    {
      id: 'answer',
      ms: 16000,
      kicker: '08',
      title: 'Dois lados da resposta',
      voice:
        'A resposta tem dois lados. O fato: entrega sexta. E o trecho da política daquele cliente. Tudo logado. O modelo não inventa o pedido. Ele consulta a Layer.',
      caption: 'Sexta no registro + cláusula de SLA. Audit gravou quem viu.',
    },
    {
      id: 'outro',
      ms: 14000,
      kicker: 'Adaptive Layer™',
      title: 'Pronto para IA. Sem inventar o pedido.',
      voice:
        'Dados. Contexto. Ação. Na nuvem de vocês. Isso é a Adaptive Layer: a empresa pronta para inteligência... sem perder a verdade da operação.',
      caption: 'The data and context layer that makes the enterprise AI-ready.',
    },
  ],
}

export const CTA = {
  eyebrow: 'Próximo passo',
  headline: 'Quer a Adaptive Layer™ na sua operação?',
  body: 'Começamos com um assessment curto e um piloto sobre a Layer — o mesmo caminho que abriu o plano do Café Orfeu.',
  primary: 'Falar com a PixelPulseLab',
  email: 'mailto:ze@pixelpulselab.dev',
  whatsapp: 'https://wa.me/5511981058468',
  orfeu: '/adaptive/executive-review',
}
