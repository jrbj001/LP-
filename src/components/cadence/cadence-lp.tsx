'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import { ArrowRight, Bot, CheckCircle2 } from 'lucide-react'
import { FadeIn, FadeInItem, FadeInStagger } from '@/components/fade-in'
import { AnimatedMark } from '@/components/animated-mark'
import {
  AGENTS_SECTION,
  AUDIENCE,
  CADENCE_CTA,
  CADENCE_META,
  GITHUB,
  HOW_IT_WORKS,
  PROBLEM,
  PRODUCT_UX,
  WHAT_IS,
} from './cadence-data'
import {
  AgentsOnTask,
  GithubContextStrip,
  HeroRhythm,
  PipelineFlow,
  ProductScreens,
} from './cadence-diagrams'

export function CadenceLP() {
  const locale = useLocale()

  return (
    <div className="cadence-scope min-h-screen text-neutral-900">
      <CadenceNav locale={locale} />
      <main>
        <HeroSection />
        <ProblemSection />
        <WhatIsSection />
        <HowSection />
        <GithubSection />
        <AgentsSection />
        <ProductUxSection />
        <AudienceSection />
        <CtaSection locale={locale} />
      </main>
      <CadenceFooter locale={locale} />
    </div>
  )
}

/* ─── Nav ───────────────────────────────────────────────────────────────────── */

function CadenceNav({ locale }: { locale: string }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-neutral-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1200px] px-6 h-16 flex items-center justify-between">
        <a href={`/${locale}/cadence`} className="flex items-center gap-2.5 group">
          <AnimatedMark className="w-7 h-7 flex-shrink-0" />
          <span className="font-[family-name:var(--font-cadence-display)] text-[17px] font-bold tracking-tight text-white">
            Cadence
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
            className="hidden md:inline text-[12px] text-white/45 hover:text-teal-300 transition-colors"
          >
            Agentes
          </a>
          <a
            href="#cta"
            className="px-4 py-2 text-[13px] font-medium bg-teal-400 text-neutral-950 rounded-full hover:bg-teal-300 transition-colors"
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
      <div className="absolute inset-0 opacity-90">
        <HeroRhythm />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/55 to-neutral-950/30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/92 via-neutral-950/25 to-transparent pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col justify-end pb-16 md:pb-24 pt-28">
        <div className="mx-auto max-w-[1200px] px-6 w-full">
          <motion.p
            className="text-[11px] font-medium uppercase tracking-[0.22em] text-teal-400/90 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {CADENCE_META.trademark} · productizado
          </motion.p>

          <motion.h1
            className="font-[family-name:var(--font-cadence-display)] text-[clamp(3.5rem,12vw,8rem)] font-bold leading-[0.9] tracking-[-0.045em] text-white mb-6 drop-shadow-[0_8px_40px_rgba(0,0,0,0.55)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            Cadence
          </motion.h1>

          <motion.p
            className="max-w-xl text-[17px] sm:text-[19px] text-white/70 leading-relaxed mb-8"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
          >
            {CADENCE_META.tagline}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
          >
            <a
              href="#cta"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-teal-400 text-neutral-950 text-[14px] font-semibold hover:bg-teal-300 transition-colors"
            >
              Falar conosco
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </a>
            <a
              href="#como"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 text-white/80 text-[14px] font-medium hover:bg-white/5 transition-colors"
            >
              Como funciona
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
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <FadeIn>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-3">
            {PROBLEM.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-cadence-display)] text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-[-0.03em] text-neutral-900 max-w-3xl leading-[1.15]">
            {PROBLEM.headline}
          </h2>
          <p className="mt-4 text-[16px] text-neutral-500 leading-relaxed max-w-2xl">{PROBLEM.body}</p>
        </FadeIn>

        <FadeInStagger className="mt-12 grid sm:grid-cols-2 gap-4">
          {PROBLEM.pains.map((pain) => (
            <FadeInItem key={pain.title}>
              <div className="h-full rounded-2xl border border-black/[0.06] bg-white p-6">
                <h3 className="text-[15px] font-semibold text-neutral-900 tracking-tight">{pain.title}</h3>
                <p className="mt-2 text-[13px] text-neutral-500 leading-relaxed">{pain.detail}</p>
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
    <section className="py-24 md:py-32 bg-[#ebebe8]">
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
          <FadeIn>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-teal-700/80 mb-3">
              {WHAT_IS.eyebrow}
            </p>
            <h2 className="font-[family-name:var(--font-cadence-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.03em] text-neutral-900 leading-[1.15]">
              {WHAT_IS.headline}
            </h2>
            <p className="mt-4 text-[15px] text-neutral-600 leading-relaxed">{WHAT_IS.body}</p>
          </FadeIn>

          <FadeInStagger className="space-y-4">
            {WHAT_IS.pillars.map((pillar) => (
              <FadeInItem key={pillar.code}>
                <div className="rounded-2xl border border-black/[0.06] bg-white p-5 flex gap-4">
                  <span className="font-mono text-[12px] text-teal-700/70 pt-0.5">{pillar.code}</span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-neutral-900 tracking-tight">{pillar.title}</h3>
                    <p className="mt-1.5 text-[13px] text-neutral-500 leading-relaxed">{pillar.detail}</p>
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
    <section id="como" className="py-24 md:py-32 scroll-mt-20">
      <div className="mx-auto max-w-[1120px] px-6">
        <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-3">
            {HOW_IT_WORKS.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-cadence-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.03em] text-neutral-900 leading-[1.15]">
            {HOW_IT_WORKS.headline}
          </h2>
        </FadeIn>

        <FadeInStagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {HOW_IT_WORKS.steps.map((step, i) => (
            <FadeInItem key={step.label}>
              <div className="h-full rounded-2xl border border-black/[0.06] bg-white p-5">
                <p className="text-[11px] font-mono text-teal-700 mb-2">
                  {String(i + 1).padStart(2, '0')} · {step.label}
                </p>
                <h3 className="text-[15px] font-semibold text-neutral-900 tracking-tight">{step.title}</h3>
                <p className="mt-2 text-[13px] text-neutral-500 leading-relaxed">{step.detail}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>

        <FadeIn>
          <PipelineFlow />
        </FadeIn>
      </div>
    </section>
  )
}

/* ─── GitHub ────────────────────────────────────────────────────────────────── */

function GithubSection() {
  return (
    <section className="py-24 md:py-32 bg-[#ebebe8]">
      <div className="mx-auto max-w-[1120px] px-6">
        <FadeIn className="max-w-2xl mb-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-teal-700/80 mb-3">
            {GITHUB.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-cadence-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.03em] text-neutral-900 leading-[1.15]">
            {GITHUB.headline}
          </h2>
          <p className="mt-4 text-[15px] text-neutral-600 leading-relaxed">{GITHUB.body}</p>
        </FadeIn>

        <FadeIn className="mb-8">
          <GithubContextStrip />
        </FadeIn>

        <FadeInStagger className="grid sm:grid-cols-3 gap-4">
          {GITHUB.points.map((point) => (
            <FadeInItem key={point.title}>
              <div className="h-full rounded-2xl border border-black/[0.06] bg-white p-5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mb-3" strokeWidth={1.75} />
                <h3 className="text-[14px] font-semibold text-neutral-900 tracking-tight">{point.title}</h3>
                <p className="mt-1.5 text-[13px] text-neutral-500 leading-relaxed">{point.detail}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}

/* ─── Agentes ───────────────────────────────────────────────────────────────── */

function AgentsSection() {
  return (
    <section id="agentes" className="py-24 md:py-32 bg-neutral-950 text-white scroll-mt-20">
      <div className="mx-auto max-w-[1120px] px-6">
        <FadeIn className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 mb-5">
            <Bot className="w-3.5 h-3.5 text-teal-300" strokeWidth={1.75} />
            <span className="text-[11px] uppercase tracking-[0.16em] text-teal-300">{AGENTS_SECTION.eyebrow}</span>
          </div>
          <h2 className="font-[family-name:var(--font-cadence-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.03em] leading-[1.15]">
            {AGENTS_SECTION.headline}
          </h2>
          <p className="mt-4 text-[15px] text-white/55 leading-relaxed">{AGENTS_SECTION.body}</p>
        </FadeIn>

        <FadeIn className="mb-12">
          <AgentsOnTask />
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8">
          <FadeIn>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-teal-400/80 mb-4">Agora</p>
            <ul className="space-y-4">
              {AGENTS_SECTION.now.map((item) => (
                <li key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <h3 className="text-[14px] font-semibold text-white tracking-tight">{item.title}</h3>
                  <p className="mt-1.5 text-[13px] text-white/50 leading-relaxed">{item.detail}</p>
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/35 mb-4">Futuro</p>
            <ul className="space-y-4">
              {AGENTS_SECTION.future.map((item) => (
                <li key={item.title} className="rounded-2xl border border-teal-400/20 bg-teal-400/[0.06] p-5">
                  <h3 className="text-[14px] font-semibold text-teal-100 tracking-tight">{item.title}</h3>
                  <p className="mt-1.5 text-[13px] text-teal-100/50 leading-relaxed">{item.detail}</p>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

/* ─── Product UX ────────────────────────────────────────────────────────────── */

function ProductUxSection() {
  return (
    <section className="py-24 md:py-32 bg-[#e8e8e5]">
      <div className="mx-auto max-w-[1120px] px-6">
        <FadeIn className="max-w-2xl mb-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-teal-700/80 mb-3">
            {PRODUCT_UX.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-cadence-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.03em] text-neutral-900 leading-[1.15]">
            {PRODUCT_UX.headline}
          </h2>
          <p className="mt-4 text-[15px] text-neutral-600 leading-relaxed">{PRODUCT_UX.body}</p>
        </FadeIn>

        <FadeInStagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {PRODUCT_UX.screens.map((screen, index) => (
            <FadeInItem key={screen.label}>
              <div className="h-full rounded-2xl border border-black/[0.06] bg-white/70 p-4">
                <p className="text-[9px] font-mono uppercase tracking-[0.14em] text-teal-700/70">
                  {String(index + 1).padStart(2, '0')} · {screen.label}
                </p>
                <h3 className="mt-2 text-[13px] font-semibold tracking-tight text-neutral-900">
                  {screen.title}
                </h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-500">{screen.detail}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>

        <ProductScreens />
      </div>
    </section>
  )
}

/* ─── Para quem ─────────────────────────────────────────────────────────────── */

function AudienceSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1120px] px-6">
        <FadeIn className="max-w-2xl mb-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400 mb-3">
            {AUDIENCE.eyebrow}
          </p>
          <h2 className="font-[family-name:var(--font-cadence-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.03em] text-neutral-900 leading-[1.15]">
            {AUDIENCE.headline}
          </h2>
        </FadeIn>

        <FadeInStagger className="grid sm:grid-cols-2 gap-4">
          {AUDIENCE.roles.map((role) => (
            <FadeInItem key={role.title}>
              <div className="h-full rounded-2xl border border-black/[0.06] bg-white p-6">
                <h3 className="text-[15px] font-semibold text-neutral-900 tracking-tight">{role.title}</h3>
                <p className="mt-2 text-[13px] text-neutral-500 leading-relaxed">{role.detail}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}

/* ─── CTA ───────────────────────────────────────────────────────────────────── */

function CtaSection({ locale }: { locale: string }) {
  return (
    <section id="cta" className="py-24 md:py-32 bg-[#ebebe8] scroll-mt-20">
      <div className="mx-auto max-w-[1120px] px-6">
        <FadeIn>
          <div className="rounded-3xl bg-neutral-950 text-white p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(13,148,136,0.2),transparent_55%)]" />
            <div className="relative max-w-xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-teal-400/90 mb-3">
                {CADENCE_CTA.eyebrow}
              </p>
              <h2 className="font-[family-name:var(--font-cadence-display)] text-[clamp(1.6rem,3vw,2.25rem)] font-semibold tracking-[-0.03em] leading-[1.15]">
                {CADENCE_CTA.headline}
              </h2>
              <p className="mt-4 text-[15px] text-white/55 leading-relaxed">{CADENCE_CTA.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`mailto:${CADENCE_META.contactEmail}?subject=Cadence%20by%20PixelPulseLab`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-teal-400 text-neutral-950 text-[14px] font-semibold hover:bg-teal-300 transition-colors"
                >
                  {CADENCE_CTA.primary}
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </a>
                <a
                  href={`/${locale}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/15 text-white/80 text-[14px] font-medium hover:bg-white/5 transition-colors"
                >
                  {CADENCE_CTA.secondary}
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─── Footer ────────────────────────────────────────────────────────────────── */

function CadenceFooter({ locale }: { locale: string }) {
  return (
    <footer className="border-t border-black/[0.06] bg-[#f2f2f0]">
      <div className="mx-auto max-w-[1120px] px-6 py-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <p className="font-[family-name:var(--font-cadence-display)] text-[15px] font-semibold text-neutral-900">
            Cadence
            <span className="font-mono font-normal text-neutral-400 text-[12px] ml-2">by PixelPulseLab</span>
          </p>
          <p className="text-[12px] text-neutral-400 mt-1">{CADENCE_META.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-[13px] text-neutral-500">
          <a href={`/${locale}`} className="hover:text-neutral-900 transition-colors">
            PixelPulseLab
          </a>
          <a href={`/${locale}/pixel`} className="hover:text-neutral-900 transition-colors">
            Pixel
          </a>
          <a
            href={`mailto:${CADENCE_META.contactEmail}`}
            className="hover:text-neutral-900 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}
