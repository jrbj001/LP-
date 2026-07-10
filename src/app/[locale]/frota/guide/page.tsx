'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  // ── 0 · Capa ──────────────────────────────────────────────────────────────
  {
    id: 'cover',
    tag: '01 · Apresentação',
    title: 'PixelPulseLab',
    subtitle: 'O estúdio por trás do SF Network Intelligence.',
    body: null,
    visual: 'cover',
  },

  // ── 1 · Quem somos ────────────────────────────────────────────────────────
  {
    id: 'who',
    tag: '02 · Quem somos',
    title: 'Construímos produtos digitais\nque resolvem problemas reais.',
    subtitle: null,
    body: [
      {
        label: 'O que fazemos',
        text: 'Desenvolvemos plataformas web e mobile com IA integrada — do desenho da arquitetura até o deploy em produção.',
      },
      {
        label: 'Como entregamos',
        text: 'Não vendemos horas. Vendemos entregas. Cada projeto tem escopo fechado, milestones claros e um workspace dedicado para o cliente acompanhar tudo em tempo real.',
      },
      {
        label: 'Para quem',
        text: 'Founders e líderes que têm um problema específico e querem uma solução sólida, sem a burocracia de uma agência grande.',
      },
    ],
    visual: null,
  },

  // ── 2 · O problema que resolvemos ─────────────────────────────────────────
  {
    id: 'problem',
    tag: '03 · O problema',
    title: 'Você já tem os dados.\nFalta a inteligência.',
    subtitle: null,
    body: [
      {
        label: 'Situação atual',
        text: '2.410 contatos no HubSpot — cada um com histórico, cargo, empresa e potencial. Mas encontrar a pessoa certa exige lembrar, filtrar, perder tempo.',
      },
      {
        label: 'O gap',
        text: 'Nenhuma ferramenta de CRM foi desenhada para responder perguntas como: "Quem da minha rede é CEO de fundo de venture no Brasil e já me conhece?"',
      },
      {
        label: 'Nossa solução',
        text: 'O SF Network Intelligence transforma sua base em uma IA de relacionamento. Você pergunta em linguagem natural e recebe os contatos certos em segundos.',
      },
    ],
    visual: null,
  },

  // ── 3 · A plataforma ──────────────────────────────────────────────────────
  {
    id: 'platform',
    tag: '04 · A plataforma',
    title: 'SF Network Intelligence',
    subtitle: 'Uma plataforma. Quatro camadas. Zero complexidade para o usuário.',
    body: null,
    visual: 'pipeline',
  },

  // ── 4 · Framework de trabalho ─────────────────────────────────────────────
  {
    id: 'framework',
    tag: '05 · Framework',
    title: 'Como trabalhamos',
    subtitle: null,
    body: [
      {
        label: '1 · Kickoff',
        text: 'Definimos escopo, stack, acessos e prioridades juntos. Nada começa sem alinhamento total. Resultado: documento de escopo assinado.',
      },
      {
        label: '2 · Build em milestones',
        text: 'Cada entrega tem um milestone com data, horas estimadas e entregáveis concretos. Você vê o progresso em tempo real aqui neste workspace.',
      },
      {
        label: '3 · Validação conjunta',
        text: 'Antes do aceite final, fazemos uma sessão de uso real com você. Ajustes de UX, acurácia e performance são incorporados nesta fase.',
      },
      {
        label: '4 · Handover',
        text: 'Documentação técnica completa, código-fonte entregue e treinamento da equipe. Você fica 100% independente ao final.',
      },
    ],
    visual: null,
  },

  // ── 5 · Este workspace ────────────────────────────────────────────────────
  {
    id: 'workspace',
    tag: '06 · Este workspace',
    title: 'Seu painel de acompanhamento\nem tempo real.',
    subtitle: null,
    body: [
      {
        label: 'Home',
        text: 'Visão geral do projeto — timeline, status atual e arquitetura em 4 camadas.',
      },
      {
        label: 'Arquitetura & Roadmap',
        text: 'Pipeline técnico detalhado, horas por módulo e milestones com datas e entregáveis.',
      },
      {
        label: 'Módulos & Dashboard',
        text: '22 módulos mapeados com prioridade, status e esforço estimado. Métricas de progresso atualizadas a cada sprint.',
      },
      {
        label: 'Documentos',
        text: 'Proposta técnica, contrato, guia de uso do HubSpot e toda a documentação do projeto em um único lugar.',
      },
    ],
    visual: null,
  },

  // ── 6 · Governança ────────────────────────────────────────────────────────
  {
    id: 'governance',
    tag: '07 · Governança',
    title: 'Comunicação clara,\nentregas previsíveis.',
    subtitle: null,
    body: [
      {
        label: 'Check-in semanal',
        text: 'Reunião rápida de 30 min para alinhar progresso, remover bloqueios e ajustar prioridades se necessário.',
      },
      {
        label: 'Transparência total',
        text: 'Cada commit, cada módulo concluído e cada bloqueio ficam registrados neste workspace. Sem caixa-preta.',
      },
      {
        label: 'Decisões documentadas',
        text: 'Qualquer mudança de escopo é formalizada por escrito antes de ser implementada — sem surpresas de custo ou prazo.',
      },
      {
        label: 'Canal direto',
        text: 'Acesso direto à equipe via WhatsApp ou e-mail para dúvidas pontuais. Resposta em até 24h em dias úteis.',
      },
    ],
    visual: null,
  },

  // ── 7 · Próximos passos ───────────────────────────────────────────────────
  {
    id: 'next',
    tag: '08 · Próximos passos',
    title: 'Kickoff.',
    subtitle: 'Três ações para começar.',
    body: [
      {
        label: '① Contrato assinado',
        text: 'Documento de escopo e proposta financeira formalizados entre as partes.',
      },
      {
        label: '② Acessos liberados',
        text: 'HubSpot, Supabase, Vercel e contas de API (OpenAI, Apify) configurados e compartilhados com a equipe.',
      },
      {
        label: '③ Kickoff agendado',
        text: 'Reunião de 90 min para alinhar prioridades, validar arquitetura e definir datas dos primeiros milestones.',
      },
    ],
    visual: null,
  },
]

const PIPELINE_LAYERS = [
  { step: '1', label: 'Coleta & Enriquecimento', detail: 'HubSpot + LinkedIn, Instagram, site, notícias', color: 'bg-neutral-900' },
  { step: '2', label: 'Banco de Dados',          detail: 'Postgres + pgvector + cache Redis',             color: 'bg-neutral-700' },
  { step: '3', label: 'IA de Busca',             detail: 'Semântica + híbrida em linguagem natural',      color: 'bg-neutral-500' },
  { step: '4', label: 'Plataforma Web',          detail: 'Chat, dashboard, filtros — Vercel',             color: 'bg-neutral-400' },
]

export default function FrotaGuidePage() {
  const [current, setCurrent] = useState(0)
  const slide = SLIDES[current]
  const total = SLIDES.length

  const prev = () => setCurrent(i => Math.max(0, i - 1))
  const next = () => setCurrent(i => Math.min(total - 1, i + 1))

  return (
    <div className="h-full min-h-screen flex flex-col">

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-neutral-100 z-50">
        <div
          className="h-full bg-neutral-900 transition-all duration-500"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* Slide area */}
      <div className="flex-1 flex items-center justify-center px-8 py-16 lg:px-20 lg:py-24">
        <div className="w-full max-w-[860px]">

          {/* Tag */}
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-6">
            {slide.tag}
          </p>

          {/* Title */}
          <h1 className="text-[32px] lg:text-[48px] font-semibold tracking-[-0.03em] leading-[1.1] text-neutral-900 mb-4 whitespace-pre-line">
            {slide.title}
          </h1>

          {/* Subtitle */}
          {slide.subtitle && (
            <p className="text-[16px] lg:text-[18px] text-neutral-500 font-light mb-10 max-w-[600px]">
              {slide.subtitle}
            </p>
          )}

          {/* Body — lista de itens */}
          {slide.body && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {slide.body.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-black/[0.06] bg-white p-6"
                >
                  <p className="text-[12px] font-semibold text-neutral-900 mb-2">{item.label}</p>
                  <p className="text-[13px] text-neutral-500 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Visual — cover */}
          {slide.visual === 'cover' && (
            <div className="mt-10 rounded-2xl border border-black/[0.06] bg-neutral-900 p-10 text-white">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-[16px] font-bold">
                  PP
                </div>
                <div>
                  <p className="text-[16px] font-semibold">PixelPulseLab</p>
                  <p className="text-[13px] text-white/50">Estúdio de produto digital</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { n: '3', label: 'devs alocados' },
                  { n: '22', label: 'módulos mapeados' },
                  { n: '~840h', label: 'estimadas no total' },
                ].map(item => (
                  <div key={item.n}>
                    <p className="text-[28px] font-semibold">{item.n}</p>
                    <p className="text-[12px] text-white/50 mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visual — pipeline */}
          {slide.visual === 'pipeline' && (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PIPELINE_LAYERS.map((layer) => (
                <div key={layer.step} className={`rounded-xl p-6 text-white ${layer.color}`}>
                  <span className="text-[11px] font-medium opacity-40 block mb-3">{layer.step}</span>
                  <p className="text-[14px] font-semibold leading-tight mb-2">{layer.label}</p>
                  <p className="text-[11px] opacity-60 leading-relaxed">{layer.detail}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Navigation bar */}
      <div className="sticky bottom-0 border-t border-black/[0.06] bg-white/95 backdrop-blur-sm px-8 py-4 flex items-center justify-between">
        <button
          onClick={prev}
          disabled={current === 0}
          className="flex items-center gap-2 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? 'w-5 h-1.5 bg-neutral-900'
                  : 'w-1.5 h-1.5 bg-neutral-200 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={current === total - 1}
          className="flex items-center gap-2 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Próximo
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  )
}
