'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import { ArrowRight, Users, FolderKanban, Compass, Clock, Activity } from 'lucide-react'
import { Timeline } from '@/components/adaptive/timeline'
import { Reveal } from '@/components/adaptive/ui'
import { EXPECTED_RESULTS, CLIENT } from '@/components/adaptive/data'

const STATUS_CARDS = [
  { icon: Activity,     label: 'Assessment Progress', value: '0%',   meta: 'aguardando kickoff' },
  { icon: Users,        label: 'Stakeholders',        value: '15',   meta: 'solicitantes mapeados' },
  { icon: FolderKanban, label: 'Projetos no Comitê',  value: '31',   meta: 'a avaliar' },
  { icon: Compass,      label: 'Discovery Sessions',  value: '10',   meta: '30 min por área' },
  { icon: Clock,        label: 'Estimated Duration',  value: '3 sem',meta: 'até o Executive Review' },
]

export default function AdaptiveHome() {
  const locale = useLocale()
  const base = `/${locale}/adaptive`

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
          Bem-vindo ao Technology Assessment do {CLIENT.name}.
        </h2>
        <p className="mb-10 text-[14px] text-neutral-500">
          Facilitação de <span className="font-medium text-neutral-700">{CLIENT.facilitator.name}</span> · {CLIENT.facilitator.role}.
          Cada líder acessa sua própria área em <span className="font-medium text-neutral-700">Minha Área</span>.
        </p>
      </Reveal>

      {/* Founder welcome */}
      <Reveal>
        <div className="mb-16 rounded-2xl border border-black/[0.06] bg-white p-8 lg:p-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-5">
            Welcome from the Founder
          </p>
          <p className="text-[19px] lg:text-[21px] leading-[1.55] tracking-[-0.01em] text-neutral-800 font-light">
            &ldquo;Toda empresa acumula tecnologia. Poucas constroem capacidade adaptativa.
            O <span className="font-medium text-neutral-900">Adaptive Enterprise™</span> nasceu para ajudar organizações como
            o <span className="font-medium text-neutral-900">{CLIENT.name}</span> a
            transformar tecnologia em vantagem competitiva — alinhando estratégia, execução e
            inteligência artificial em um único framework.&rdquo;
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[12px] font-semibold">
              JB
            </div>
            <div className="leading-tight">
              <p className="text-[13px] font-semibold text-neutral-900">José Roberto Baptista Jr.</p>
              <p className="text-[12px] text-neutral-400">Founder &amp; Principal Engineer — PixelPulseLab</p>
            </div>
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
          Adaptive Enterprise™
        </p>
        <h1 className="text-[40px] lg:text-[58px] font-semibold tracking-[-0.04em] leading-[1.02] text-neutral-900">
          Business.<br />Technology.<br />Artificial Intelligence.<br />
          <span className="text-neutral-300">Aligned.</span>
        </h1>
        <p className="mt-7 text-[17px] leading-relaxed text-neutral-500 max-w-xl">
          Vamos diagnosticar a maturidade tecnológica do {CLIENT.name} a partir dos
          31 projetos do Comitê de TI e construir um roadmap executivo orientado ao negócio —
          alinhando as 10 áreas em uma única visão.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={`${base}/discovery`}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-[14px] font-medium hover:bg-neutral-800 transition-all"
          >
            Start Assessment
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
          </a>
          <a
            href={`${base}/framework`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-black/[0.1] text-neutral-700 text-[14px] font-medium hover:bg-black/[0.02] transition-all"
          >
            Conhecer o Framework
          </a>
        </div>
      </motion.section>

      {/* Timeline */}
      <Reveal className="mb-16">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-8 lg:p-10">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-[15px] font-semibold text-neutral-900">Jornada do Assessment</h2>
            <span className="text-[12px] text-neutral-400">5 etapas</span>
          </div>
          <Timeline />
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

      {/* Expected results */}
      <Reveal>
        <div className="rounded-2xl border border-black/[0.06] bg-neutral-900 text-white p-8 lg:p-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40 mb-3">
            O que você recebe ao final
          </p>
          <h2 className="text-[24px] lg:text-[28px] font-semibold tracking-[-0.02em] max-w-lg">
            Resultados concretos, não um relatório de consultoria.
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
