import type { ClientMeeting } from '@/lib/client/types'

/**
 * Reuniões Like:Me — últimos ~2 meses (jun/12 → ago/12 2026).
 * Fonte: Notion meeting notes (Daily Like:Me, Semanal Tech, estratégia).
 */
export const LIKEME_MEETINGS: ClientMeeting[] = [
  {
    id: 'likeme-semanal-2026-08-12',
    title: 'Semanal Tech LikeMe',
    date: '2026-08-12T11:30:00-03:00',
    status: 'completed',
    attendees: [
      'Time Like:Me',
      'PixelPulseLab',
      'Henrique (Marga)',
      'Fabrício',
      'Marco Lúcio',
      'Ana Paula Amaral',
    ],
    summary:
      'Semanal de produto e tech: journey map (GLP-1, Bettina, Bom Vive), status v1.12, performance de imagens (Redis), comunidades Diogo→Like:Me, Apple/Google Pay, e-mails e pitch DocSend.',
    aiContext: `
Semanal Tech LikeMe — 12/08/2026.

Introdução:
- Henrique (Marga) apresentado formalmente; backend nas últimas sprints (modelagem e WhatsApp).

Roadmap & journey:
- Journey map 6 meses: GLP-1, Bettina, Bom Vive, Vanessa; validar com Vanessa/Paulo.
- Três perfis de paciente; perfil corporativo rascunhado.

Features v1.12:
- Link provider, download landing, cancelamento assinatura, recovery pagamento prontos/em teste.
- Panda e PDP Splash ficam para a próxima versão.
- E-mails transacionais em andamento; notificação de teste de usuário → Eduarda Weber.

Performance:
- Redis para imagens; redesenhar loading screen (tarefas separadas no backlog).

Comunidade:
- Branding Diogo → Like:Me; Bettina design pronto (Ana Paula).

Pagamentos / negócio:
- Apple/Google/Samsung Pay para estimativa; relatório pagamentos no backlog.
- Pitch DocSend + angels; Marco puxar Biogenética.
    `.trim(),
    href: 'https://app.notion.com/p/3ba5615ab27480d39baadbca59f922c2',
  },
  {
    id: 'likeme-daily-2026-08-11',
    title: 'Daily Like:Me',
    date: '2026-08-11T10:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Dudinha', 'Thiago', 'Simone'],
    summary:
      'Check-in breve: José Roberto se ausenta por imersão Colmeia; Dudinha o representa. Menção a limpar e iniciar novo escopo com Thiago e Simone; reuniões agora gravadas por IA.',
    aiContext: `
Daily Like:Me — 11/08/2026.

- Check-in breve/informal.
- José Roberto em imersão Colmeia; Dudinha representa.
- Presentes: Dudinha, Thiago, Simone.
- Iniciativa de limpar e iniciar novo escopo.
- Reuniões passam a ser gravadas por IA.
    `.trim(),
    href: 'https://app.notion.com/p/3b95615ab274814e8a0be414c6e7d446',
  },
  {
    id: 'likeme-daily-2026-08-07',
    title: 'Daily Like:Me — Pagamentos & release',
    date: '2026-08-07T10:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Marco Lúcio', 'Time Like:Me'],
    summary:
      'Daily focado em falhas de cobrança Pagar.me (sem retry automático), abordagem 1:1 com usuários afetados, release notes e prioridade claim → retenção → front.',
    aiContext: `
Daily Like:Me — 07/08/2026.

Pagamentos / Pagar.me:
- Relatório de billing; usuários com meses sem cobrança (ex.: Flavia, Fernando, Camilo).
- Integração usada não faz retry automático (equipe assumia retry do Pagar.me).
- Cobranças interrompidas no lado da plataforma; monitorar endpoint diariamente.
- Decisão: não cobrar retroativamente; falar 1:1 com afetados.
- Enviar PDF/screenshot do relatório de billing.

Release:
- Nova versão do dia anterior; enviar release notes.
- Prioridade: claim → retenção → front.
    `.trim(),
    href: 'https://app.notion.com/p/3b55615ab2748115b0d2cd9b676a9357',
  },
  {
    id: 'likeme-daily-2026-08-06',
    title: 'Daily Like:Me',
    date: '2026-08-06T10:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Marco Lúcio'],
    summary:
      'Call informal José Roberto × Marcão: proposta comercial a enviar, posicionamento de preço, versão de produto em andamento.',
    aiContext: `
Daily Like:Me — 06/08/2026.

- Enviar proposta ao cliente; faixa de preço equilibrada.
- Versão de produto em andamento; features priorizadas vs adiadas.
- Camila fora deste stream; Duda + José cobrem.
    `.trim(),
    href: 'https://app.notion.com/p/3b45615ab274813998b0e42e1e7730c0',
  },
  {
    id: 'likeme-daily-2026-07-31',
    title: 'Daily Like:Me',
    date: '2026-07-31T10:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Duda', 'Time Like:Me'],
    summary:
      'Daily técnico: inbound endpoints para produção, afiliados + front, wallets Apple/Google/Samsung Pay, e-mails transacionais e fix WhatsApp.',
    aiContext: `
Daily Like:Me — 31/07/2026.

- Publicar inbound endpoints em produção.
- Feature afiliados quase pronta; iniciar front.
- Pesquisar Apple Pay / Google Pay / Samsung Pay.
- E-mails transacionais em tickets por tipo.
- Fix WhatsApp (dígito 9 / campo).
    `.trim(),
    href: 'https://app.notion.com/p/3ae5615ab274810bb26ff9ea255820c2',
  },
  {
    id: 'likeme-tabia-strategy-2026-07-30',
    title: 'Product Strategy: Tabia Integration & Roadmap',
    date: '2026-07-30T15:00:00-03:00',
    status: 'completed',
    attendees: ['Time Like:Me', 'PixelPulseLab'],
    summary:
      'Estratégia de produto para integração Tabia Health + roadmap 2º semestre (programa GLP-1): jornada UX, camada de dados e alinhamento com Dr. Diogo.',
    aiContext: `
Like Me Product Strategy: TABIA Integration & Roadmap — 30/07/2026.

Ações principais:
- Refinar jornada UX Like:Me + Tabia (o que vive em cada plataforma).
- Feature map do roadmap 2º semestre baseado no programa GLP-1.
- Dois engenheiros na integração Tabia (backend + abstração de dados).
- Infra mínima de IA no Like:Me para agentes com contexto.
- Compartilhar reverse-engineering da API Tabia; time tech recomenda layer Like:Me vs Tabia.
- Duda aprovar PR de broadcasting; validar gap one-to-one do provider.
- Pedir a Ricardo dados de engajamento; enviar documento de funcionalidades.
- Alinhar informalmente com Dr. Diogo; lives como aquisição.
    `.trim(),
    href: 'https://app.notion.com/p/3ad5615ab27480d497bed54da8e15b01',
  },
  {
    id: 'likeme-semanal-2026-07-30',
    title: 'Semanal Tech LikeMe',
    date: '2026-07-30T12:00:00-03:00',
    status: 'completed',
    attendees: ['Time Like:Me'],
    summary: 'Semanal Tech LikeMe — check-in breve; sem conteúdo substantivo na gravação.',
    aiContext: `
Semanal Tech LikeMe — 30/07/2026.

- Transcrição sem tópicos/decisões.
- Check-in breve.
    `.trim(),
    href: 'https://app.notion.com/p/3ad5615ab27481baad1ecb34c269ba0c',
  },
  {
    id: 'likeme-daily-2026-07-30',
    title: 'Daily Like:Me — WhatsApp & release',
    date: '2026-07-30T10:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Duda', 'Camila', 'Time Like:Me'],
    summary:
      'Daily: migrações WhatsApp staging/prod, canal outbound + RAG depois, iOS aprovado / Android pendente, voucher 1ª compra e fila de versão.',
    aiContext: `
Daily Like:Me — 30/07/2026.

WhatsApp:
- Migrações staging/prod; aguardar número US.
- Lançar one-way primeiro; depois agente RAG.

App Store:
- Apple aprovada; Android pendente (André).
- Voucher: desconto 1ª compra + 30 dias free.
- Feature 360 → próxima versão.
    `.trim(),
    href: 'https://app.notion.com/p/3ad5615ab27481c0bf94c61da37adb0e',
  },
  {
    id: 'likeme-daily-2026-07-24',
    title: 'Daily Like:Me',
    date: '2026-07-24T10:00:00-03:00',
    status: 'completed',
    attendees: ['Dudinha', 'José Roberto', 'Time Like:Me'],
    summary:
      'Pedido de seção de comentários no teste de visibilidade; e-mail pendente e tela de background.',
    aiContext: `
Daily Like:Me — 24/07/2026.

- Comment section no visibility test (só comments).
- José: e-mail pendente + background screen.
    `.trim(),
    href: 'https://app.notion.com/p/3a75615ab27481d5bd9fe2dc0c9103f0',
  },
  {
    id: 'likeme-daily-2026-07-20',
    title: 'Daily Like:Me',
    date: '2026-07-20T10:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Fabrício', 'Marco Lúcio', 'Leo', 'Camila', 'Time Like:Me'],
    summary:
      'Updates: sandbox Wadz, Panda OK para embed, WhatsApp aguardando templates Meta, bug de link no banner de evento.',
    aiContext: `
Daily Like:Me — 20/07/2026.

- Sandbox Wadz concluído; Panda APIs OK → embed.
- WhatsApp: aguardar templates Meta Business.
- Bug banner de evento sem link clicável.
- Não liberar prod sem rodada estruturada de testes.
    `.trim(),
    href: 'https://app.notion.com/p/3a35615ab274811684fbf65dd9b6aab2',
  },
  {
    id: 'likeme-daily-2026-07-13',
    title: 'Daily Like:Me',
    date: '2026-07-13T10:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Duda', 'Camila', 'Marga', 'Marco Lúcio', 'Time Like:Me'],
    summary:
      'Divisão de backlog (Marga backend, WhatsApp inicia hoje), force update, timing de push do live e POC Panda validado.',
    aiContext: `
Daily Like:Me — 13/07/2026.

- Marga backend; José inicia WhatsApp.
- Force update; testar merge WhatsApp antes de publish.
- POC Panda validado; Admin + SDK.
- Live: notif meio-dia não-pagantes; 1h antes pagantes.
    `.trim(),
    href: 'https://app.notion.com/p/39c5615ab2748190a5aecb627701a891',
  },
  {
    id: 'likeme-daily-2026-07-10',
    title: 'Daily Like:Me — Panda & comunidade',
    date: '2026-07-10T10:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Camila', 'Duda', 'Marga', 'Marco Lúcio', 'Time Like:Me'],
    summary:
      'Decisão: embed Panda no front Like:Me; admin para conteúdo; push de posts, feed global e onboarding guiado.',
    aiContext: `
Daily Like:Me — 10/07/2026.

- Embed Panda no front Like:Me (não no Social Plus).
- Admin para programa/vídeos; autoplay + legendas.
- Push por novo post; feed global; onboarding guiado.
- Checar link do evento e recorrência Pagar.me.
    `.trim(),
    href: 'https://app.notion.com/p/3995615ab27481ff83e9c5b1b1f17ae4',
  },
  {
    id: 'likeme-daily-2026-07-07',
    title: 'Daily Like:Me',
    date: '2026-07-07T10:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Duda', 'Marco Lúcio', 'Time Like:Me'],
    summary:
      'Bugs de deep link (menu inferior some), recusas antifraude, recomendações por categoria e integração WhatsApp.',
    aiContext: `
Daily Like:Me — 07/07/2026.

- Deep link sem menu inferior — corrigir redirect/home.
- Recusas antifraude; avaliar desligar temporário.
- Recomendações por categoria; relatório IA (16 compras).
- Integrar WhatsApp no fim do dia.
    `.trim(),
    href: 'https://app.notion.com/p/3965615ab27481d19aa3c32b2718c452',
  },
  {
    id: 'likeme-daily-2026-07-06',
    title: 'Daily Like:Me',
    date: '2026-07-06T10:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Camila', 'Duda', 'Marco Lúcio', 'Oscar', 'Leo', 'Time Like:Me'],
    summary:
      'Pesquisa jornada GLP-1, Conecta marketplace, WhatsApp sandbox→prod, POC Panda com Marga e release antes das férias.',
    aiContext: `
Daily Like:Me — 06/07/2026.

- Jornada GLP-1 (paciente + provider).
- WhatsApp: sandbox + templates → promover prod.
- POC Panda → Marga.
- Release antes das férias (14).
    `.trim(),
    href: 'https://app.notion.com/p/3955615ab2748130983ddf1ee87f2673',
  },
  {
    id: 'likeme-daily-2026-07-03',
    title: 'Daily Like:Me',
    date: '2026-07-03T10:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Dudinha', 'Dinah', 'Camila', 'Marga', 'Ju', 'Time Like:Me'],
    summary:
      'Big deploy do dia, PR Marga, ownership de posts de eventos com Ju e otimização do visibility test.',
    aiContext: `
Daily Like:Me — 03/07/2026.

- Big deploy hoje; PR Marga em review.
- Ju dona dos posts de eventos.
- Visibility test: backend otimizado; tela no app com Dudinha.
    `.trim(),
    href: 'https://app.notion.com/p/3925615ab274817b9762ce70ecb71403',
  },
  {
    id: 'likeme-infra-2026-07-02',
    title: 'Itens de Infra Tech',
    date: '2026-07-02T10:15:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Marco Lúcio', 'Fabrício', 'Leo', 'Karla', 'Time Like:Me'],
    summary:
      'Infra/estratégia: Social Plus até out/dez, ConectaLá seller center, arquitetura marketplace vs Tabia/GLP-1 e web desktop.',
    aiContext: `
Itens de Infra Tech — 02/07/2026.

- Ficar no Social Plus; cancelar até out para desligar em dez.
- Avaliar ConectaLá / seller center com dados de GMV.
- Dois blocos: Marketplace e Protocolos (Tabia/IA).
- Web desktop no roadmap; caso âncora caneta emagrecimento + Tabia.
    `.trim(),
    href: 'https://app.notion.com/p/3915615ab27481eab041fe096f90b8d9',
  },
  {
    id: 'likeme-daily-2026-07-02',
    title: 'Daily Like:Me',
    date: '2026-07-02T10:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Duda', 'Henrique Marga', 'Marco Lúcio', 'Time Like:Me'],
    summary:
      'Sharing/deep link (app.likeme.global), WhatsApp Twilio em branch isolada, pagamento Marga e POC Panda.',
    aiContext: `
Daily Like:Me — 02/07/2026.

- Deep link / subdomain app.likeme.global.
- WhatsApp Twilio em branch isolada.
- Pagamento (Marga) em testes; POC Panda ~2 dias.
- Mapa custo-benefício de ferramentas (Seller Center, Social Plus, CRM).
    `.trim(),
    href: 'https://app.notion.com/p/3915615ab27481a68e4acc4bde38af39',
  },
  {
    id: 'likeme-semanal-2026-07-01',
    title: 'Semanal Tech LikeMe',
    date: '2026-07-01T11:30:00-03:00',
    status: 'completed',
    attendees: ['Time Like:Me'],
    summary: 'Semanal Tech LikeMe — check-in breve; página de notas sem sumário substantivo.',
    aiContext: `
Semanal Tech LikeMe — 01/07/2026.

- Meeting notes vazias / sem summary gerado.
- Check-in breve.
    `.trim(),
    href: 'https://app.notion.com/p/3905615ab2748010bc92c07b36747615',
  },
  {
    id: 'likeme-daily-2026-06-29',
    title: 'Daily Like:Me',
    date: '2026-06-29T10:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Duda', 'Ana', 'Ju', 'Marco Lúcio', 'Time Like:Me'],
    summary:
      'Release notes (perfil/categorias/diversidade), e-mail de release, avaliação Social Plus e avanço WhatsApp/push.',
    aiContext: `
Daily Like:Me — 29/06/2026.

- Release: categorias pós-login, perfil redesenhado, diversidade no feed.
- Social Plus: não migrar agora; investir back-office; treinar Ju.
- WhatsApp importante (cobranças antifraude); testes de push.
    `.trim(),
    href: 'https://app.notion.com/p/38e5615ab2748041b5f9ddf978738b76',
  },
  {
    id: 'likeme-semanal-2026-06-24',
    title: 'Semanal Tech LikeMe',
    date: '2026-06-24T11:30:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Duda', 'Gil', 'Thiago', 'Fabio', 'Simone', 'Time Like:Me'],
    summary: 'Semanal Tech LikeMe — check-in breve/informal; sem decisões de produto registradas.',
    aiContext: `
Semanal Tech LikeMe — 24/06/2026.

- Tom descontraído; pouco conteúdo técnico.
- Check-in breve.
    `.trim(),
    href: 'https://app.notion.com/p/3895615ab2748011beccd82333f9e4ba',
  },
  {
    id: 'likeme-daily-2026-06-23',
    title: 'Daily Like:Me',
    date: '2026-06-23T10:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Duda', 'Camila', 'Marga', 'Leo', 'Time Like:Me'],
    summary:
      'Demo do fluxo Notion AI → user story → Cursor; kickoff WhatsApp Business; testes de pagamento.',
    aiContext: `
Daily Like:Me — 23/06/2026.

- Workflow IA: gravação → Notion → user story → task.
- WhatsApp Business: credenciais para José; backend → front.
- Marga: testes automáticos do fluxo de pagamento.
- Ideia assinatura wellness / benefício corporativo.
    `.trim(),
    href: 'https://app.notion.com/p/3885615ab27480f58a51cd9909582dd9',
  },
  {
    id: 'likeme-daily-2026-06-22',
    title: 'Daily Like:Me — Release v1.71 & MORD',
    date: '2026-06-22T10:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Duda', 'Camila', 'Henrique', 'Marco Lúcio', 'Leo', 'Time Like:Me'],
    summary:
      'Release v1.71 (home/marketplace, e-mails, comunidade, push); MORD ~70% cobertura; estudo build-or-buy; escopo WhatsApp.',
    aiContext: `
Daily Like:Me — 22/06/2026.

- Release v1.71: home/marketplace, SendGrid, comunidade, push, bloqueio compra duplicada.
- MORD ~70% cobertura; bloqueia merge se falhar.
- WhatsApp v1 = espelhar push; v2 = régua completa.
- Duda: cancelamento + perfil; José: WhatsApp + posts.
    `.trim(),
    href: 'https://app.notion.com/p/3875615ab27480e88c11d502f6eb8f5c',
  },
  {
    id: 'likeme-daily-2026-06-18',
    title: 'Daily Like:Me',
    date: '2026-06-18T10:00:00-03:00',
    status: 'completed',
    attendees: ['Time Like:Me'],
    summary: 'Check-in breve — gravação/transcript vazios.',
    aiContext: `
Daily Like:Me — 18/06/2026.

- Transcript e notes vazios.
- Check-in breve.
    `.trim(),
    href: 'https://app.notion.com/p/3835615ab27480c98816e87b4ceb6b22',
  },
  {
    id: 'likeme-planejamento-2026-06-15',
    title: 'Planejamento de ciclo (Kanban) Like:Me',
    date: '2026-06-15T14:00:00-03:00',
    status: 'completed',
    attendees: ['José Roberto', 'Camila', 'Duda', 'Marga', 'Fabrício', 'Marco Lúcio', 'Time Like:Me'],
    summary:
      'Planejamento Kanban: estimar backlog, fechar UI até quinta, WhatsApp como complemento ao push, perfil e decisão Social Plus.',
    aiContext: `
Planejamento ciclo Like:Me — 15/06/2026.

- Estimar itens sem estimate; ajustes layout ~2,5 dias.
- WhatsApp como complemento ao push.
- Perfil / Design System com Ana.
- Social Plus: avaliar Cycle/Mighty vs continuar.
    `.trim(),
    href: 'https://app.notion.com/p/3805615ab2748008acebdc984a76cc5b',
  },
]
