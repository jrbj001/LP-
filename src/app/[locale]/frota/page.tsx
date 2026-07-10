'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import { ArrowRight, Users, FolderKanban, Layers, Clock, Activity, Crown, Star, Building2 } from 'lucide-react'
import { Timeline } from '@/components/adaptive/timeline'
import { Reveal } from '@/components/adaptive/ui'
import {
  EXPECTED_RESULTS, CLIENT, FOUNDERS, AREA_ORDER, AREA_META, projectsByArea, TIMELINE,
} from '@/components/frota/data'

const STATUS_CARDS = [
  { icon: Activity,     label: 'Build Progress',       value: '0%',    meta: 'aguardando kickoff' },
  { icon: Users,        label: 'Equipe',                value: '3',     meta: 'PixelPulseLab + cliente' },
  { icon: FolderKanban, label: 'Módulos Planejados',    value: '22',    meta: '22 entregáveis' },
  { icon: Layers,       label: 'Camadas de Arquitetura',value: '4',     meta: 'Fase 1 — web completa' },
  { icon: Clock,        label: 'Fase 1 — estimativa',   value: '~6 sem',meta: 'kickoff ao deploy' },
]

export default function FrotaHome() {
  const locale = useLocale()
  const base = `/${locale}/frota`

  return (
    <div className="max-w-[920px] mx-auto px-6 lg:px-12 py-14 lg:py-20">

      {/* Personalized greeting */}
      <Reveal>
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] text-[12px] font-medium text-neutral-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {CLIENT.name}
          </span>
          <span className="text-[12px] text-neutral-400">{CLIENT.sector}</span>
        </div>
        <h2 className="mb-3 text-[22px] lg:text-[26px] font-semibold tracking-[-0.02em] text-neutral-900">
          Bem-vindo ao workspace do {CLIENT.name}.
        </h2>
        <p className="mb-10 text-[14px] text-neutral-500">
          Acompanhe o build do <span className="font-medium text-neutral-700">{CLIENT.product}</span> — da arquitetura ao deploy.
          Cada membro acessa sua própria área em <span className="font-medium text-neutral-700">Minha Área</span>.
        </p>
      </Reveal>

      {/* Founder welcome — dois co-founders */}
      <Reveal>
        <div className="mb-16 rounded-2xl border border-black/[0.06] bg-white p-8 lg:p-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-7">
            Welcome from the Co-founders
          </p>
          <div className="flex flex-col gap-10">
            {FOUNDERS.map((f) => (
              <div key={f.initials}>
                <p className="text-[17px] lg:text-[19px] leading-[1.6] tracking-[-0.01em] text-neutral-800 font-light mb-5">
                  &ldquo;{f.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[12px] font-semibold flex-shrink-0">
                    {f.initials}
                  </div>
                  <div className="leading-tight">
                    <p className="text-[13px] font-semibold text-neutral-900">{f.name}</p>
                    <p className="text-[12px] text-neutral-400">{f.role} — PixelPulseLab</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-16"
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-5">
          SF Network Intelligence
        </p>
        <h1 className="text-[40px] lg:text-[58px] font-semibold tracking-[-0.04em] leading-[1.02] text-neutral-900">
          Você pergunta.<br />A rede<br />
          <span className="text-neutral-300">responde.</span>
        </h1>
        <p className="mt-7 text-[17px] leading-relaxed text-neutral-500 max-w-xl">
          Pipeline em 4 camadas: enriquecimento automático → banco vetorial →
          IA de busca híbrida → plataforma web. Os {' '}
          <span className="text-neutral-700 font-medium">2.410 contatos do HubSpot</span> viram
          perfis completos e pesquisáveis em linguagem natural.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={`${base}/projects`}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-[14px] font-medium hover:bg-neutral-800 transition-all"
          >
            Ver Módulos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
          </a>
          <a
            href={`${base}/dashboard`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/[0.1] text-neutral-700 text-[14px] font-medium hover:bg-black/[0.02] transition-all"
          >
            Dashboard
          </a>
        </div>
      </motion.section>

      {/* Timeline */}
      <Reveal className="mb-16">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-8 lg:p-10">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-[15px] font-semibold text-neutral-900">Jornada do Projeto</h2>
            <span className="text-[12px] text-neutral-400">{TIMELINE.length} etapas</span>
          </div>
          <div className="flex flex-col gap-0">
            {TIMELINE.map((step, i) => (
              <div key={step.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                    step.status === 'done'   ? 'bg-neutral-900' :
                    step.status === 'active' ? 'bg-emerald-500 ring-4 ring-emerald-500/20' :
                    'bg-neutral-200'
                  }`} />
                  {i < TIMELINE.length - 1 && (
                    <div className="w-px flex-1 bg-neutral-100 my-1" />
                  )}
                </div>
                <div className="pb-6">
                  <div className="flex items-center gap-2">
                    <p className={`text-[14px] font-medium ${step.status === 'upcoming' ? 'text-neutral-400' : 'text-neutral-900'}`}>
                      {step.title}
                    </p>
                    {step.status === 'active' && (
                      <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Atual
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-neutral-400 mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Status cards */}
      <Reveal className="mb-16">
        <h2 className="text-[15px] font-semibold text-neutral-900 mb-5">Visão geral</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {STATUS_CARDS.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className="rounded-xl border border-black/[0.06] bg-white p-5 hover:border-black/[0.12] transition-colors"
              >
                <Icon className="w-[18px] h-[18px] text-neutral-300 mb-4" strokeWidth={1.75} />
                <p className="text-[26px] font-semibold tracking-tight text-neutral-900 leading-none">{card.value}</p>
                <p className="text-[12px] font-medium text-neutral-700 mt-2">{card.label}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{card.meta}</p>
              </div>
            )
          })}
        </div>
      </Reveal>

      {/* Governance */}
      <Reveal className="mb-16">
        <h2 className="text-[15px] font-semibold text-neutral-900 mb-5">Governança do Projeto</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-neutral-900/15 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-4 h-4 text-neutral-900 fill-neutral-900" strokeWidth={0} />
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">Sponsor</span>
            </div>
            <p className="text-[15px] font-semibold text-neutral-900">{CLIENT.sponsor.name}</p>
            <p className="text-[12px] text-neutral-400 mt-0.5">{CLIENT.sponsor.role}</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" strokeWidth={0} />
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">Tech Lead</span>
            </div>
            <p className="text-[15px] font-semibold text-neutral-900">{CLIENT.facilitator.name}</p>
            <p className="text-[12px] text-neutral-400 mt-0.5">{CLIENT.facilitator.role}</p>
          </div>
          <div className="rounded-xl border border-black/[0.06] bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-neutral-300" strokeWidth={1.75} />
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">Entrega</span>
            </div>
            <p className="text-[15px] font-semibold text-neutral-900">PixelPulseLab</p>
            <p className="text-[12px] text-neutral-400 mt-0.5">PixelPulseLab</p>
          </div>
        </div>
      </Reveal>

      {/* Layers */}
      <Reveal className="mb-16">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-[15px] font-semibold text-neutral-900">Arquitetura — 4 camadas</h2>
          <span className="text-[12px] text-neutral-400">{AREA_ORDER.length} camadas · 22 módulos</span>
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white divide-y divide-black/[0.05] overflow-hidden">
          {AREA_ORDER.map((area) => {
            const meta = AREA_META[area]
            const count = projectsByArea(area).length
            const Icon = meta.icon
            return (
              <div key={area} className="flex items-center gap-4 px-5 py-3.5 hover:bg-black/[0.015] transition-colors">
                <div className="w-8 h-8 rounded-full bg-black/[0.06] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-neutral-500" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-neutral-900">{area}</p>
                  <p className="text-[12px] text-neutral-400">{meta.owner} · {meta.phase}</p>
                </div>
                <span className="text-[12px] text-neutral-400 flex-shrink-0">
                  {count} {count === 1 ? 'módulo' : 'módulos'}
                </span>
              </div>
            )
          })}
        </div>

        <a
          href={`${base}/projects`}
          className="group mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-[14px] font-medium hover:bg-neutral-800 transition-all"
        >
          Ver todos os módulos
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
        </a>
      </Reveal>

      {/* Deliverables */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-8 lg:p-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40 mb-3">
            O que você recebe ao final
          </p>
          <h2 className="text-[24px] lg:text-[28px] font-semibold tracking-[-0.02em] max-w-lg">
            Entregáveis concretos, não slides.
          </h2>

          <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {EXPECTED_RESULTS.map((r) => (
              <div key={r.metric} className="border-t border-white/10 pt-5">
                <p className="text-[15px] font-semibold text-white">{r.metric}</p>
                <p className="text-[12px] text-white/40 mt-0.5">{r.label}</p>
                <p className="text-[13px] text-white/60 mt-3 leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

    </div>
  )
}
