import type { ClientWorkspace } from '@/lib/client/types'

export const be180Ooh: ClientWorkspace = {
  id: 'be180-ooh',
  slug: 'be180-ooh',
  name: 'Be180 OOH',
  sector: 'Mídia Out-of-Home · OOH',
  tagline:
    'Workspace operacional — projetos, reuniões, documentos e entregas técnicas do engajamento com a PixelPulseLab.',
  status: 'active',
  accent: '#0f766e',
  contacts: [
    { name: 'José Roberto', role: 'Principal Engineer · PixelPulseLab', email: 'hello@pixelpulselab.dev' },
    { name: 'Marco Lúcio', role: 'CEO · PixelPulseLab' },
  ],
  stats: [
    { label: 'Roteiros', value: '3.541' },
    { label: 'Ativos 30d', value: '60' },
    { label: 'Projetos', value: '8' },
  ],
  projects: [
    {
      id: 'colmeia-meus-roteiros',
      name: 'Colmeia · Meus Roteiros',
      pillar: 'Colmeia',
      description:
        'Plataforma de planejamento, simulação e operação de campanhas OOH — produto principal em produção.',
      status: 'active',
      owner: 'PixelPulseLab + Be180',
      priority: 'Alta',
      updatedAt: '05/08/2026',
      tags: ['Produção', 'SaaS', 'Planejamento'],
      href: 'https://app.notion.com/p/37b5615ab27481d48154e1b27f250e01',
    },
    {
      id: 'banco-de-ativos',
      name: 'Banco de Ativos',
      pillar: 'Banco de Ativos',
      description:
        'Camada fundacional de inventário, cadastro e media kit. Prioridade estratégica — ainda incompleta e base para as demais frentes.',
      status: 'active',
      owner: 'PixelPulseLab + Be180',
      priority: 'Alta',
      updatedAt: '04/08/2026',
      tags: ['Fundacional', 'Exibidores', 'Inventário'],
    },
    {
      id: 'image-brand-processing',
      name: 'Image Brand Processing',
      pillar: 'Colmeia',
      description:
        'Pipeline de processamento de imagens e marca conectado ao ecossistema Colmeia.',
      status: 'active',
      owner: 'PixelPulseLab',
      priority: 'Média',
      updatedAt: '05/08/2026',
      tags: ['Repositório', 'Backend'],
    },
    {
      id: 'colmeia-ai-mvp',
      name: 'Colmeia AI · Agente RAG',
      pillar: 'Colmeia',
      description:
        'MVP do Adaptive Layer no vertical Colmeia: assistente contextual com respostas grounded e isolamento por tenant.',
      status: 'discovery',
      owner: 'João + Pedro · PixelPulseLab',
      priority: 'Alta',
      updatedAt: '15/07/2026',
      tags: ['IA', 'MVP', 'Adaptive Layer'],
      href: 'https://app.notion.com/p/39e5615ab27481709661c328ae6e9215',
    },
    {
      id: 'metodologia-cobertura-frequencia',
      name: 'Metodologia · Cobertura e Frequência',
      pillar: 'Colmeia',
      description:
        'Nova iniciativa: documentar e validar cobertura/frequência acumuladas, deflator, sazonalidade e métricas avançadas antes do desenvolvimento.',
      status: 'proposed',
      owner: 'Simone',
      priority: 'Alta',
      updatedAt: '04/08/2026',
      tags: ['Novo', 'Metodologia', 'Mídia'],
    },
    {
      id: 'tendencias-transporte-publico',
      name: 'Tendências · Transporte Público',
      pillar: 'Colmeia',
      description:
        'Nova iniciativa: planejamento de produto para tendências de transporte público na Via Pública.',
      status: 'proposed',
      owner: 'Camila',
      priority: 'Média',
      updatedAt: '04/08/2026',
      tags: ['Novo', 'Produto', 'Via Pública'],
    },
    {
      id: 'ux-redesign-onboarding',
      name: 'UX Redesign + Onboarding de Exibidores',
      pillar: 'Colmeia',
      description:
        'Nova iniciativa: redesign da experiência, personalização por perfil e onboarding hands-on com exibidores para acelerar uploads.',
      status: 'proposed',
      owner: 'Ana · Be180',
      priority: 'Média',
      updatedAt: '04/08/2026',
      tags: ['Novo', 'UX', 'Adoção'],
    },
    {
      id: 'agentes',
      name: 'Agentes',
      pillar: 'Agentes',
      description:
        'Seis agentes incorporados ao roadmap do Colmeia, com arquitetura e avaliações no M0 e entregas progressivas do briefing ao pós-venda.',
      status: 'discovery',
      owner: 'Pixel + Be180',
      priority: 'Alta',
      updatedAt: '10/08/2026',
      tags: ['Roadmap', 'Arquitetura', 'IA'],
    },
  ],
  delivery: {
    repos: [
      {
        owner: 'jrbj001',
        repo: 'colmeia---meusroteirosdefault',
        label: 'Colmeia · Meus Roteiros',
        products: [{ label: 'Banco de Ativos', pattern: 'banco[\\s-]*(de[\\s-]*)?ativos?|\\bativos\\b' }],
      },
      {
        owner: 'jrbj001',
        repo: 'image_brand_processing',
        label: 'Image Brand Processing',
      },
    ],
    manualEffort: [
      {
        label: 'Migração para Novo Backend',
        hours: 80,
        description:
          'Migração completa da camada de backend para a nova arquitetura. Trabalho de infraestrutura sem commits diretos visíveis no histórico de produto — refatoração interna, reestruturação de serviços e estabilização do ambiente.',
        from: '2026-06-07',
        to: '2026-07-07',
      },
    ],
  },
  docs: {
    eyebrow: 'Documentação',
    title: 'Tudo que você precisa',
    titleAccent: 'em um só lugar',
    supportEmail: 'hello@pixelpulselab.dev',
    categories: [
      {
        id: 'getting-started',
        title: 'Getting Started',
        description: 'Acesso ao workspace, rituais e visão geral do engajamento.',
        articles: ['Acesso ao portal', 'Quem participa', 'Rituais de trabalho', 'Próximos passos'],
        badge: 'Essencial',
      },
      {
        id: 'projeto',
        title: 'Projetos',
        description: 'Escopo, entregáveis, timeline e critérios das iniciativas ativas.',
        articles: [
          'Portfólio atual',
          'Arquitetura de agentes',
          'Entregáveis',
          'Timeline',
          'Critérios de sucesso',
        ],
        badge: 'Projetos',
      },
      {
        id: 'integracoes',
        title: 'Integrações',
        description: 'Sistemas e canais conectados ao fluxo de trabalho da Be180 OOH.',
        articles: ['Canais de comunicação', 'Fontes de dados', 'Ferramentas do time', 'Pendências'],
        badge: 'Guias',
      },
      {
        id: 'suporte',
        title: 'Suporte',
        description: 'Como pedir ajuda, SLAs de resposta e escalonamento com a PixelPulseLab.',
        articles: ['Abrir um pedido', 'SLAs de resposta', 'Escalonamento', 'Contato direto'],
        badge: 'Suporte',
      },
    ],
  },
  meetings: [
    {
      id: 'colmeia-inventario-2026-08-06',
      title: 'Integração de Inventário & Bug de Mídia',
      date: '2026-08-06T16:34:00-03:00',
      status: 'completed',
      attendees: ['Time Be180', 'Fabrício', 'Henrique', 'PixelPulseLab'],
      summary:
        'Sincronização da task force de inventário: status de integração pouco visível no Colmeia, divergência de contagens e bug de formato “não informado” na exportação de pontos de mídia — com meta de zerar o escopo atual em 15 dias antes de abrir indoor.',
      aiContext: `
Sessão de sincronização da task force de inventário e bugs de mídia no Colmeia, realizada em 06/08/2026.

Status da integração de inventário:
- Vários itens aparecem como "concluídos" e teoricamente enviados ao banco, mas o status de integração não fica claro no Colmeia.
- Não há indicador verde visível confirmando integração bem-sucedida — dúvida se o display não atualiza ou se a integração realmente não concluiu.
- Alguns itens não aparecem no sistema; valores exibidos divergem do upload (ex.: 191 pontos vs. 200+ esperados).
- Decisão: adicionar label de data nos registros de inventário para confirmar se a versão exibida está atualizada.
- Fabrício acompanha de perto o progresso.

Bug de formato / exportação de mídia:
- Na exportação de pontos de mídia, alguns registros retornam "não informado" em formato (digital/estático), cidade, estado, bairro e endereço — mesmo com lat/long válidos.
- Suspeita de bug: todo ponto deveria ter formato digital ou estático; o campo é muito usado em consultas.

Task force e próximos passos:
- Força-tarefa em andamento para resolver inventário e integração em até 15 dias.
- Promover todos os inventários ainda não promovidos até zerar a fila.
- Henrique acompanhar a tarefa de inventário delegada.
- Investigar o bug de formato "não informado".
- Relatório de fim de dia (9h–9h30) sobre status de integração para o grupo.
- Sessão na terça para fechar itens abertos.
- Após fechar o escopo atual, iniciar upload de exibidores indoor (template diferente, mais complexo).
- Meta: fechar limpo o escopo atual antes de abrir trabalho novo.

Ações acordadas:
- Adicionar label de data aos registros de inventário e validar se o status de integração aparece corretamente no dashboard.
- Revisar status de integração e enviar relatório diário ao grupo.
- Promover inventários restantes até zerar a fila.
- Henrique dar follow-up na tarefa de inventário delegada.
- Investigar bug de formato "não informado" na exportação.
- Agendar reunião de terça para fechar os itens abertos.
      `.trim(),
      href: 'https://app.notion.com/p/3b45615ab2748053b1bad166c8e520dc',
    },
    {
      id: 'colmeia-status-2026-08-05',
      title: 'Status do Produto: Colmeia, Banco de Ativos & Onboarding',
      date: '2026-08-05T09:47:00-03:00',
      status: 'completed',
      attendees: ['Time Be180', 'Marta', 'Isra', 'Gabriel', 'José Roberto'],
      summary:
        'Status operacional do Colmeia e do Banco de Ativos: task force de 15 dias para itens vermelhos de Indoor, novo onboarding hands-on de exibidores com Marta/Isra (2×/semana), demo do workspace de cliente e alinhamento sobre planos além de 12 semanas.',
      aiContext: `
Sessão de status do produto Colmeia, Banco de Ativos e onboarding de exibidores, realizada em 05/08/2026.

Workspace de cliente:
- José Roberto apresentou o portal exclusivo do cliente: reuniões ligadas a kick-offs e entregas, integração GitHub, repositório de documentos e relatórios gerados (ex.: uso do Colmeia).
- Feature de chamada direta: qualquer pessoa na área do cliente inicia uma chamada que roteia para WhatsApp, sem exigir o WhatsApp do cliente.
- Piloto em andamento; e-mail oficial será enviado; enriquecimento completo na semana seguinte.

Colmeia (simulação Indoor) — prioridades:
- Itens vermelhos: impacto, cobertura e frequência de vias públicas indoor — precisam ser resolvidos antes de avançar.
- Task force de 15 dias para resetar e fechar todos os itens abertos de Indoor, com recursos adicionais se necessário.
- Próxima prioridade após limpar o board: feature master plan umbrella; depois automação de AI/media plan (sugestão do Serginho).
- Meta: board limpo antes do planejamento H2 com Camila.
- Reunião de trabalho terça/quinta a partir das 10h para destravar pendências do Colmeia.

Planos além de 12 semanas:
- Colmeia parametrizado hoje para 12 semanas; clientes (ex.: Ambev) pedem até 21 semanas.
- Excel report v2.0 é dinâmico e pode sustentar mais semanas — ainda não testado.
- Validar com plano real da Simone (21 semanas) antes de anunciar.
- Nos últimos 30 planos, só 3 passaram de 12 semanas — volumetria baixa; possível deferir.

Banco de Ativos — onboarding de exibidores:
- 21 veículos contactados; erros de reset de senha (já mitigado) e 2 veículos que logam mas não sobem ativos.
- Causa raiz de acessos: domínio de e-mail cadastrado ≠ e-mail do usuário; 188 e-mails faltantes pré-cadastrados.
- Muitos erros são de formatação de arquivo, não técnicos — triagem antes de escalar para eng.
- JCDCO já aprovada; interface API OH Brasil pronta e entrando no ar nesta semana.
- Abordagem revisada: Marta e Isra conduzem onboarding hands-on (2 sessões/semana); José Roberto só entra em blockers técnicos reais.
- Gabriel implementando mensagens de erro mais detalhadas para exibidores.

Ferramentas:
- Tarefas urgentes no Monday.com não chegam em tempo real a José Roberto — configurar push; urgências via WhatsApp/e-mail no interim.
- Requisitos do dashboard de follow-up do Banco de Ativos a serem enviados a José Roberto.
- Follow-up com Eletromídia após liberação do NDA.

Ações acordadas:
- Task force de 15 dias para fechar itens Indoor (impacto, cobertura, frequência).
- Marta e Isra agendarem 2 onboardings de exibidor por semana.
- Pedir o arquivo do exibidor com problema e pedir análise ao Luís.
- Gabriel melhorar detalhamento de erro no upload.
- José Roberto configurar notificações push do Monday.com.
- Definir e enviar requisitos do dashboard de follow-up do Banco de Ativos.
- Validar plano Simone de 21 semanas contra Excel report v2.0.
- Follow-up Eletromídia pós-NDA.
- Manter reuniões de trabalho terça/quinta às 10h.
      `.trim(),
      href: 'https://app.notion.com/p/3b35615ab27480eca6daf8874e6716a4',
    },
    {
      id: 'colmeia-roadmap-2026-08-04',
      title: 'Planejamento do Roadmap do Colmeia',
      date: '2026-08-04T16:31:00-03:00',
      status: 'completed',
      attendees: ['Time Be180', 'PixelPulseLab'],
      summary:
        'Sessão estratégica para mapear os três pilares da plataforma — Colmeia, Banco de Ativos e Agentes — além de pendências e responsáveis. Foram organizadas frentes de metodologia, UX, dados e infraestrutura, com Agentes fora do escopo desta primeira fase.',
      aiContext: `
Sessão estratégica de planejamento do roadmap do Colmeia realizada em 04/08/2026.
Objetivo: mapear pilares, pendências, responsáveis e dependências antes de priorizar soluções e montar o roadmap.

Três pilares da plataforma mapeados:
1. Colmeia — produto principal de planejamento OOH.
2. Banco de Ativos — alimenta os demais componentes e é fundacional.
3. Agentes — pilar reconhecido na arquitetura do produto, mas explicitamente fora do escopo desta primeira fase ("not to be touched in this first phase"). Não deve receber investimento agora; fica registrado para fases futuras.

Frentes do Colmeia nesta fase: Via Pública, Calculadora, Metodologia, UX, Dados e Infraestrutura. O planner é considerado o futuro da plataforma; é necessário evitar investimento excessivo em funcionalidades que serão substituídas.

Banco de Ativos: é fundacional e está incompleto. Há dados de inventário, mas faltam dados cadastrais, doações e PM. Exibidores são os usuários de maior frequência. Materiais e especificações ainda estão dispersos; foi proposta uma tela de upload de media kit. Também são necessários cadastro administrativo de agências, formatos e IPVs, além de melhorias no funil de inventário.

Metodologia: cobertura e frequência acumuladas são prioridade. Também foram discutidos deflator de inventário, cobertura por target, projeção de performance, sazonalidade, frequência por dia/hora, qualificação indoor e segmentação por bairro. Simone deve documentar e validar as metodologias com líderes de mídia antes do desenvolvimento.

UX e onboarding: a experiência atual precisa de redesign substancial e personalização por perfil. Foram propostos explicações contextuais, arquivo de planejamentos por usuário, pesquisa de usabilidade, certificação de onboarding e transparência da memória de cálculo. Ana está validando os manuais para integração à jornada.

Infraestrutura: incluir copiloto de perguntas e respostas com LLM, camada de segurança e logs por usuário, roadmap de APIs com exibidores, otimização dos cálculos e reset de senha de exibidores pelo admin.

Ações acordadas:
- Simone documentar as melhorias metodológicas pendentes.
- Organizar cerimônia com líderes de mídia para validar metodologias.
- Camila avançar o planejamento da funcionalidade de tendências de transporte público.
- Tchelo e José Roberto realizarem sessão focada na terça-feira para encerrar pendências antigas de Via Pública.
- Organizar atividades por responsável, dependências e prioridade para gerar o roadmap atualizado.
- Realizar reunião de continuidade sobre Banco de Ativos.
- Ana concluir a validação final dos manuais.
- Avaliar onboarding prático com exibidores para acelerar uploads de inventário.
- Marta e Mai Fernandes continuarem consolidando especificações de PM.
- Adicionar copiloto LLM, segurança e logs ao backlog de infraestrutura.
- Projetar reset de senha de exibidores pelo admin.
- Melhorar o dashboard administrativo para veículos em análise.
- Adicionar custo por inserção (CPE) à tela de resultados.
      `.trim(),
      href: 'https://app.notion.com/p/3b25615ab274805fbdd3ecec1c43e9d1',
    },
  ],
  documents: [
    {
      id: 'colmeia-arquitetura-agentes',
      title: 'Arquitetura de Agentes · Colmeia & Banco de Ativos',
      category: 'Arquitetura · Adaptive Layer™ · Agentes',
      description:
        'Roadmap integrado M0–M4: infraestrutura, Adaptive Layer™ e seis agentes da jornada OOH, com arquitetura e user stories.',
      updatedAt: '10/08/2026',
      status: 'available',
      href: '/arquitetura-de-agentes',
      external: false,
    },
    {
      id: 'colmeia-usage-2026-08-05',
      title: 'Relatório de Uso do Produto',
      category: 'Produto · Dados de produção',
      description:
        'Adoção, usuários ativos, roteiros e inventário de exibidores — dados consolidados em 05/08/2026.',
      updatedAt: '05/08/2026',
      status: 'available',
      href: 'https://app.notion.com/p/3b35615ab27481159150e2ea3844ca21',
      external: true,
    },
    {
      id: 'colmeia-product-manual',
      title: 'Colmeia — Manual do Produto',
      category: 'Documentação · Produto',
      description:
        'Visão, glossário, personas, fluxos, módulos, Banco de Ativos, integrações e referência técnica.',
      updatedAt: '10/06/2026',
      status: 'available',
      href: 'https://app.notion.com/p/37b5615ab27481d48154e1b27f250e01',
      external: true,
    },
    {
      id: 'colmeia-development-report-2026',
      title: 'Relatório de Desenvolvimento — Jan a Mai 2026',
      category: 'Engenharia · Entregas',
      description:
        'Consolidado de engenharia com 11 épicos, 47 histórias e evolução das principais camadas do produto.',
      updatedAt: '06/05/2026',
      status: 'available',
      href: 'https://app.notion.com/p/3585615ab27481269268dc73ed460d17',
      external: true,
    },
    {
      id: 'colmeia-ai-mvp',
      title: 'MVP Colmeia AI — Agente RAG + Adaptive Layer',
      category: 'Roadmap · Inteligência Artificial',
      description:
        'Plano do primeiro vertical de IA do Colmeia: agente contextual, isolamento por tenant e respostas com fontes.',
      updatedAt: '15/07/2026',
      status: 'available',
      href: 'https://app.notion.com/p/39e5615ab27481709661c328ae6e9215',
      external: true,
    },
  ],
}
