import {
  AGENTS_SECTION,
  CADENCE_META,
  HOW_IT_WORKS,
  PROBLEM,
  WHAT_IS,
} from '@/components/cadence/cadence-data'

/** Como o agente explica o Cadence. Sai do mesmo conteúdo da LP /cadence para não divergir do site. */
export const CADENCE_PRODUCT_PROFILE = [
  `${CADENCE_META.product} (${CADENCE_META.trademark}), produto da ${CADENCE_META.company}: ${CADENCE_META.tagline}`,
  `Problema: ${PROBLEM.headline} ${PROBLEM.body}`,
  `O que é: ${WHAT_IS.headline} ${WHAT_IS.body}`,
  ...WHAT_IS.pillars.map(pillar => `- ${pillar.title}: ${pillar.detail}`),
  `Fluxo: ${HOW_IT_WORKS.headline}.`,
  ...HOW_IT_WORKS.steps.map(step => `- ${step.label} (${step.title}): ${step.detail}`),
  `Agentes: ${AGENTS_SECTION.body}`,
  ...AGENTS_SECTION.now.map(item => `- Hoje: ${item.title}: ${item.detail}`),
  ...AGENTS_SECTION.future.map(item => `- Próximo: ${item.title}: ${item.detail}`),
  `No workspace do cliente, o Cadence tem: Copilot (conversa que lê o GitHub, desenha o fluxo e propõe a user story), Boards (backlog por frente), Reuniões (este agente, que entra na call pelo Recall.ai, transcreve, responde por voz e chat e gera resumo, decisões e próximos passos), Consultar (perguntas em linguagem natural sobre bancos, código, reuniões e documentos), Fontes de dados (PostgreSQL e SQL Server com dicionário de dados gerado por IA), Entregas (PRs e commits do GitHub) e canal WhatsApp.`,
  `Contato: ${CADENCE_META.contactEmail}. Página: https://pixelpulselab.dev/pt/cadence.`,
].join('\n')

/** Mapa do site da PixelPulseLab (repositório jrbj001/LP-). O detalhe de cada página vem do GitHub. */
export const LP_SITE_PROFILE = `O site pixelpulselab.dev é o repositório jrbj001/LP- (Next.js, deploy na Vercel). Ele também hospeda o Cadence e a área do cliente.
Páginas: / (home: Pixel, the AI Operating System for the Enterprise), /pixel (Adaptive Layer™), /cadence (LP do Cadence), /adaptive (Technology Assessment, hoje o espaço do Café Orfeu), /alquimia (Alquemia), /iris (Iris 2027), /datacenter, /frota, /guides e /client (área do cliente com os workspaces Cadence).
Para detalhes de implementação, rotas ou mudanças recentes do site, consulte o GitHub.`
