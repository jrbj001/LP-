export const BANANA_BRASIL_LGPD_NDA = {
  id: 'banana-brasil-lgpd-nda',
  version: '1.0',
  date: '27/08/2026',
  client: 'Banana Brasil',
  consultant: 'PixelPulseLab',
  title: 'NDA e autorização LGPD',
  subtitle:
    'Instrumento para a Banana Brasil dar ok ao compartilhamento confidencial do assessment e ao tratamento de dados na Adaptive Layer™.',
}

export const NDA_SECTIONS = [
  {
    title: '1. Partes e objeto',
    body: [
      'Este termo vale entre a Banana Brasil (“Cliente”) e a PixelPulseLab (“Consultoria”), para o assessment Adaptive Enterprise™ e o desenho da Adaptive Layer™ sobre o stack atual (Consistem, VTEX, Mtrix, Power BI e demais sistemas mapeados).',
      'O aceite registra que o Cliente autoriza a Consultoria a receber, analisar e devolver informação confidencial necessária a esse trabalho — sem ceder titularidade de marca, produto, dados ou sistemas.',
    ],
  },
  {
    title: '2. Informação confidencial',
    body: [
      'São confidenciais: números de venda e margem, mix, ruptura, cadastros, contratos, organograma, acessos, prints, exports, briefings, diagnósticos, propostas e qualquer material identificado como interno.',
      'Também é confidencial o próprio conteúdo deste workspace, inclusive diagnóstico, mapa da Layer, agentes e roadmap, até a Banana Brasil autorizar divulgação pontual.',
    ],
  },
  {
    title: '3. Obrigações',
    body: [
      'A Consultoria usa a informação só para o engagement. Não replica em outro cliente, não publica e não treina modelos públicos com dados da Banana Brasil.',
      'Acesso fica restrito ao time alocado. Qualquer subcontratada (por exemplo, infraestrutura de nuvem) entra sob o mesmo dever de sigilo e minimização.',
      'A Consultoria avisa o Cliente, no prazo legal ou contratual aplicável, se houver incidente que possa expor informação confidencial.',
    ],
  },
  {
    title: '4. Exceções',
    body: [
      'Não é confidencial o que já era público, o que a Consultoria já possuía de forma lícita, o que for desenvolvido de forma independente ou o que tiver de ser revelado por lei ou ordem de autoridade — neste caso, com aviso prévio sempre que permitido.',
    ],
  },
  {
    title: '5. Prazo e devolução',
    body: [
      'O dever de sigilo vale por 3 anos após o fim do engagement, ou por prazo maior se a lei de proteção de dados exigir.',
      'Ao encerrar, a Consultoria devolve ou elimina cópias sob seu controle, salvo retenção mínima exigida por obrigação legal, fiscal ou de auditoria — e mesmo essa fica isolada.',
    ],
  },
]

export const LGPD_SECTIONS = [
  {
    title: '1. Papéis',
    body: [
      'A Banana Brasil é controladora dos dados do seu negócio. A PixelPulseLab atua como operadora no limite deste engagement: recebe, organiza e analisa o que o Cliente disponibilizar para o assessment e para o desenho da Adaptive Layer™.',
    ],
  },
  {
    title: '2. Finalidade e base',
    body: [
      'Finalidade: diagnosticar operação e demanda digital, mapear sistemas e propor quick wins, Layer e agentes — inclusive consultas futuras em linguagem natural sobre venda, margem e ruptura.',
      'Base: execução de procedimentos preliminares e do contrato de consultoria, e legítimo interesse do Cliente em instrumentar a operação, sempre com minimização.',
    ],
  },
  {
    title: '3. Categorias de dados',
    body: [
      'Nesta fase o foco é dado operacional e comercial: indicadores, pedidos, mix, estoque, canal, cadastros mestres e logs de sistema. Dado pessoal de colaborador ou consumidor só entra se o Cliente o incluir no material compartilhado.',
      'Não está autorizado, neste aceite, tratamento de dado sensível (saúde, biometria, origem racial etc.) nem uso para marketing de terceiros.',
    ],
  },
  {
    title: '4. Guardrails',
    body: [
      'Minimização: só o necessário para o diagnóstico e o desenho da Layer.',
      'Isolamento: contexto da Banana Brasil separado de outros clientes.',
      'Acesso: autenticação no workspace e trilha do que for consultado por agente, quando a Layer estiver em operação.',
      'IA: modelos não treinam com a base da Banana Brasil em provedor público sem autorização expressa. Agentes só agem sobre o contexto autorizado.',
    ],
  },
  {
    title: '5. Direitos e encerramento',
    body: [
      'Pedidos de titular (acesso, correção, eliminação, portabilidade) são encaminhados ao Cliente, que decide; a Consultoria coopera no prazo razoável.',
      'O Cliente pode revogar esta autorização por escrito. A Consultoria então interrompe novos tratamentos e elimina o que estiver sob seu controle, observadas retenções legais.',
    ],
  },
]

export const ACCEPTANCE_CHECKS = [
  {
    id: 'nda',
    label: 'Li o NDA e autorizo o compartilhamento confidencial descrito acima.',
  },
  {
    id: 'lgpd',
    label: 'Autorizo o tratamento de dados operacionais para o assessment e o desenho da Adaptive Layer™, nos termos da LGPD acima.',
  },
]
