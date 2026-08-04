'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import {
  ArrowRight,
  Coffee,
  Layers,
  MessageCircle,
  Shield,
  Zap,
} from 'lucide-react'
import { FadeIn, FadeInItem, FadeInStagger } from '@/components/fade-in'
import { AnimatedMark } from '@/components/animated-mark'
import {
  AGENTS_SECTION,
  HOW_IT_WORKS,
  ORFEU_CASE,
  PIXEL_CTA,
  PIXEL_META,
  PROBLEM,
  ROI,
  SDK_MODEL,
  WHAT_IS,
} from './pixel-data'
import {
  AgentsOrchestra,
  ArchitectureIllustration,
  HeroMesh,
  OrfeuJourney,
  SdkStackIllustration,
} from './pixel-diagrams'

export function PixelLP() {
  const locale = useLocale()

  return (
    <div className="pixel-scope min-h-screen text-neutral-900">
      <PixelNav locale={locale} />
      <main>
        <HeroSection />
        <ProblemSection />
        <WhatIsSection />
        <HowSection />
        <AgentsSection />
        <OrfeuSection locale={locale} />
        <RoiSection />
        <SdkSection />
        <CtaSection locale={locale} />
      </main>
      <PixelFooter locale={locale} />
    </div>
  )
}

/* ─── Nav ───────────────────────────────────────────────────────────────────── */

function PixelNav({ locale }: { locale: string }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1200px] px-6 h-16 flex items-center justify-between">
        <a href={`/${locale}/pixel`} className="flex items-center gap-2.5 group">
          <AnimatedMark className="w-7 h-7 flex-shrink-0" />
          <span className="font-[family-name:var(--font-pixel-display)] text-[17px] font-bold tracking-tight text-white">
            Pixel
          </span>
          <span className="hidden sm:inline text-[11px] font-mono text-white/35 tracking-wider">
            by PixelPulseLab
          </span>
        </a>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`/${locale}`}
            className="hidden sm:inline text-[12px] text-white/45 hover:text-white/80 transition-colors"
          >
            PixelPulseLab
          </a>
          <a
            href="#agentes"
            className="hidden md:inline text-[12px] text-white/45 hover:text-emerald-300 transition-colors"
          >
            Squad de agentes
          </a>
          <a
            href="#cta"
            className="px-4 py-2 text-[13px] font-medium bg-emerald-400 text-neutral-950 rounded-full hover:bg-emerald-300 transition-colors"
          >
            Falar conosco
          </a>
        </div>
      </div>
    </nav>
  )
}

/* ─── Hero ──────────────────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative min-h-[100svh] bg-neutral-950 text-white overflow-hidden flex flex-col">
      {/* Visual dominante full-bleed */}
      <div className="absolute inset-0 opacity-90">
        <HeroMesh />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/55 to-neutral-950/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/20 to-transparent pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col justify-end pb-16 md:pb-24 pt-28">
        <div className="mx-auto max-w-[1200px] px-6 w-full">
          <motion.p
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-emerald-400/90 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {PIXEL_META.trademark} · productizado
          </motion.p>

          <motion.h1
            className="font-[family-name:var(--font-pixel-display)] text-[clamp(4rem,14vw,9rem)] font-bold leading-[0.88] tracking-[-0.045em] text-white mb-6 drop-shadow-[0_8px_40px_rgba(0,0,0,0.55)]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            Pixel
          </motion.h1>

          <motion.p
            className="text-[17px] sm:text-[19px] text-white/60 max-w-lg leading-relaxed mb-10"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
          >
            {PIXEL_META.tagline}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
          >
            <a
              href="#cta"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold bg-emerald-400 text-neutral-950 rounded-full hover:bg-emerald-300 transition-colors"
            >
              Quero Pixel na minha operação
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </a>
            <a
              href="#agentes"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium border border-white/15 text-white/80 rounded-full hover:border-white/30 hover:text-white transition-colors"
            >
              Ver o squad de agentes
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── Problema ──────────────────────────────────────────────────────────────── */

function ProblemSection() {
  return (
    <section className="py-24 lg:py-32 px-6 bg-[#f2f2f0] border-b border-black/[0.05]" id="problema">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">
            {PROBLEM.eyebrow}
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="font-[family-name:var(--font-pixel-display)] text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-[-0.03em] text-neutral-900 mb-5 max-w-3xl leading-[1.08]">
            {PROBLEM.headline}
          </h2>
        </FadeIn>
        <FadeIn delay={0.12}>
          <p className="text-[17px] text-neutral-500 max-w-2xl leading-relaxed mb-14">
            {PROBLEM.body}
          </p>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROBLEM.pains.map((pain) => (
            <FadeInItem key={pain.title}>
              <div className="h-full rounded-2xl border border-black/[0.06] bg-white p-6 hover:border-black/[0.1] transition-colors">
                <p className="text-[15px] font-semibold text-neutral-900 mb-2">{pain.title}</p>
                <p className="text-[14px] text-neutral-500 leading-relaxed">{pain.detail}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}

/* ─── O que é ───────────────────────────────────────────────────────────────── */

function WhatIsSection() {
  return (
    <section className="py-24 lg:py-32 px-6 bg-white border-b border-black/[0.05]" id="produto">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <FadeIn>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">
                {WHAT_IS.eyebrow}
              </p>
            </FadeIn>
            <FadeIn delay={0.08}>
              <h2 className="font-[family-name:var(--font-pixel-display)] text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-neutral-900 mb-5 leading-[1.08]">
                {WHAT_IS.headline}
              </h2>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="text-[17px] text-neutral-500 leading-relaxed">{WHAT_IS.body}</p>
            </FadeIn>
          </div>

          <FadeInStagger className="lg:col-span-7 space-y-3">
            {WHAT_IS.pillars.map((p) => (
              <FadeInItem key={p.code}>
                <div className="rounded-2xl border border-black/[0.06] bg-[#f2f2f0] p-6 flex gap-5">
                  <span className="font-mono text-[12px] text-emerald-700/70 pt-0.5">{p.code}</span>
                  <div>
                    <p className="text-[16px] font-semibold text-neutral-900 mb-1.5">{p.title}</p>
                    <p className="text-[14px] text-neutral-500 leading-relaxed">{p.detail}</p>
                  </div>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </div>
    </section>
  )
}

/* ─── Como funciona ─────────────────────────────────────────────────────────── */

function HowSection() {
  return (
    <section className="py-24 lg:py-32 px-6 bg-[#f2f2f0] border-b border-black/[0.05]" id="como">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">
            {HOW_IT_WORKS.eyebrow}
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="font-[family-name:var(--font-pixel-display)] text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-neutral-900 mb-12 max-w-2xl leading-[1.08]">
            {HOW_IT_WORKS.headline}
          </h2>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {HOW_IT_WORKS.steps.map((step, i) => (
            <FadeInItem key={step.label}>
              <div className="rounded-2xl bg-white border border-black/[0.06] p-6 h-full">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-7 h-7 rounded-full bg-neutral-950 text-white text-[11px] font-mono flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-400">{step.label}</span>
                </div>
                <p className="text-[16px] font-semibold text-neutral-900 mb-2">{step.title}</p>
                <p className="text-[14px] text-neutral-500 leading-relaxed">{step.detail}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>

        <FadeIn delay={0.15}>
          <ArchitectureIllustration />
        </FadeIn>
      </div>
    </section>
  )
}

/* ─── Squad de agentes — ÊNFASE ─────────────────────────────────────────────── */

function AgentsSection() {
  return (
    <section className="py-24 lg:py-36 px-6 bg-neutral-950 text-white relative overflow-hidden" id="agentes">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-400/10 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-[1200px]">
        <div className="max-w-3xl mb-6">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3.5 py-1.5 mb-6">
              <Zap className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-300">
                {AGENTS_SECTION.eyebrow}
              </span>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h2 className="font-[family-name:var(--font-pixel-display)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] text-white mb-5 leading-[1.05]">
              {AGENTS_SECTION.headline}
            </h2>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="text-[17px] sm:text-[18px] text-white/50 leading-relaxed max-w-2xl">
              {AGENTS_SECTION.body}
            </p>
          </FadeIn>
        </div>

        <div className="mt-14">
          <AgentsOrchestra />
        </div>

        <FadeIn delay={0.2}>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: 'Guardrails & audit', detail: 'Cada consulta do agente deixa trilha. LGPD e acesso por domínio.' },
              { icon: MessageCircle, title: 'Linguagem natural', detail: 'Perguntas de negócio sobre dados reais — sem fila de relatório de TI.' },
              { icon: Layers, title: 'Uma verdade só', detail: 'Seis agentes. Zero planilhas paralelas. A camada é a fonte.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <item.icon className="w-4 h-4 text-emerald-400 mb-3" strokeWidth={1.75} />
                <p className="text-[14px] font-semibold text-white mb-1.5">{item.title}</p>
                <p className="text-[13px] text-white/45 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─── Case Orfeu ────────────────────────────────────────────────────────────── */

function OrfeuSection({ locale }: { locale: string }) {
  return (
    <section className="py-24 lg:py-32 px-6 bg-white border-b border-black/[0.05]" id="orfeu">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <FadeIn>
              <div className="flex items-center gap-2 mb-4">
                <Coffee className="w-4 h-4 text-neutral-400" strokeWidth={1.75} />
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {ORFEU_CASE.eyebrow}
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <h2 className="font-[family-name:var(--font-pixel-display)] text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-neutral-900 mb-5 leading-[1.08]">
                {ORFEU_CASE.headline}
              </h2>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="text-[17px] text-neutral-500 leading-relaxed">{ORFEU_CASE.body}</p>
            </FadeIn>
          </div>
          <FadeIn delay={0.15}>
            <a
              href={`/${locale}${ORFEU_CASE.href}`}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-neutral-900 border border-black/[0.1] rounded-full px-5 py-2.5 hover:border-black/[0.2] transition-colors"
            >
              Abrir Executive Review
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </a>
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <OrfeuJourney />
        </FadeIn>
      </div>
    </section>
  )
}

/* ─── ROI ───────────────────────────────────────────────────────────────────── */

function RoiSection() {
  return (
    <section className="py-24 lg:py-32 px-6 bg-[#f2f2f0] border-b border-black/[0.05]" id="roi">
      <div className="mx-auto max-w-[1200px]">
        <FadeIn>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">
            {ROI.eyebrow}
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="font-[family-name:var(--font-pixel-display)] text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-neutral-900 mb-5 max-w-3xl leading-[1.08]">
            {ROI.headline}
          </h2>
        </FadeIn>
        <FadeIn delay={0.12}>
          <p className="text-[17px] text-neutral-500 max-w-2xl leading-relaxed mb-14">
            {ROI.body}
          </p>
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {ROI.reasons.map((r) => (
            <FadeInItem key={r.title}>
              <div className="h-full rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-7 flex flex-col">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-[family-name:var(--font-pixel-display)] text-3xl font-bold tracking-tight text-neutral-900">
                    {r.metric}
                  </span>
                  <span className="text-[12px] text-neutral-400">{r.metricLabel}</span>
                </div>
                <p className="text-[15px] font-semibold text-neutral-900 mb-2">{r.title}</p>
                <p className="text-[14px] text-neutral-500 leading-relaxed mt-auto">{r.detail}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>

        <FadeIn>
          <div className="rounded-3xl bg-neutral-950 text-white p-6 sm:p-10 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(52,211,153,0.12),transparent_50%)]" />
            <p className="relative text-[11px] uppercase tracking-[0.18em] text-emerald-400/70 mb-6">
              Sem Pixel vs com Pixel
            </p>
            <div className="relative space-y-4">
              {ROI.compare.map((row) => (
                <div
                  key={row.without}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 items-center"
                >
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-white/30 mb-1">Sem</p>
                    <p className="text-[14px] text-white/55">{row.without}</p>
                  </div>
                  <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3.5">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-400/70 mb-1">Com Pixel</p>
                    <p className="text-[14px] text-white/90">{row.with}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <p className="mt-6 text-[12px] text-neutral-400">{ROI.footnote}</p>
      </div>
    </section>
  )
}

/* ─── Modelo SDK ────────────────────────────────────────────────────────────── */

function SdkSection() {
  return (
    <section className="py-24 lg:py-32 px-6 bg-white border-b border-black/[0.05]" id="sdk">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <FadeIn>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-4">
                {SDK_MODEL.eyebrow}
              </p>
            </FadeIn>
            <FadeIn delay={0.08}>
              <h2 className="font-[family-name:var(--font-pixel-display)] text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-neutral-900 mb-5 leading-[1.08]">
                {SDK_MODEL.headline}
              </h2>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="text-[17px] text-neutral-500 leading-relaxed mb-8">{SDK_MODEL.body}</p>
            </FadeIn>
            <FadeIn delay={0.16}>
              <ul className="space-y-3">
                {SDK_MODEL.principles.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[14px] text-neutral-600">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
          <div className="lg:col-span-7">
            <SdkStackIllustration layers={SDK_MODEL.layers} />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ───────────────────────────────────────────────────────────────────── */

function CtaSection({ locale }: { locale: string }) {
  return (
    <section className="py-24 lg:py-32 px-6 bg-neutral-950 text-white relative overflow-hidden" id="cta">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(52,211,153,0.15),transparent_55%)]" />
      <div className="relative mx-auto max-w-[800px] text-center">
        <FadeIn>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-400/70 mb-5">
            {PIXEL_CTA.eyebrow}
          </p>
        </FadeIn>
        <FadeIn delay={0.08}>
          <h2 className="font-[family-name:var(--font-pixel-display)] text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] text-white mb-5 leading-[1.05]">
            {PIXEL_CTA.headline}
          </h2>
        </FadeIn>
        <FadeIn delay={0.12}>
          <p className="text-[17px] text-white/50 leading-relaxed mb-10 max-w-xl mx-auto">
            {PIXEL_CTA.body}
          </p>
        </FadeIn>
        <FadeIn delay={0.18}>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={PIXEL_CTA.email}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold bg-emerald-400 text-neutral-950 rounded-full hover:bg-emerald-300 transition-colors"
            >
              {PIXEL_CTA.primary}
            </a>
            <a
              href={`/${locale}${ORFEU_CASE.href}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium border border-white/15 text-white/80 rounded-full hover:border-white/30 hover:text-white transition-colors"
            >
              {PIXEL_CTA.secondary}
            </a>
            <a
              href={PIXEL_CTA.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium text-white/45 hover:text-white transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─── Footer ────────────────────────────────────────────────────────────────── */

function PixelFooter({ locale }: { locale: string }) {
  return (
    <footer className="bg-neutral-950 border-t border-white/5 px-6 py-10">
      <div className="mx-auto max-w-[1200px] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="font-[family-name:var(--font-pixel-display)] text-[15px] font-bold text-white">
            Pixel
          </span>
          <span className="text-[12px] text-white/30">· Adaptive Layer™ by PixelPulseLab</span>
        </div>
        <div className="flex items-center gap-5 text-[12px] text-white/35">
          <a href={`/${locale}`} className="hover:text-white/70 transition-colors">
            Home
          </a>
          <a href={`/${locale}/adaptive/executive-review`} className="hover:text-white/70 transition-colors">
            Case Orfeu
          </a>
          <a href="mailto:ze@pixelpulselab.dev" className="hover:text-white/70 transition-colors">
            Contato
          </a>
        </div>
      </div>
    </footer>
  )
}
