'use client'

import { useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { FadeIn, FadeInItem, FadeInStagger } from '@/components/fade-in'
import { AnimatedMark } from '@/components/animated-mark'
import { HowItWorksAnimation, ProductArchitecture } from './diagrams'
import { ExplainerVideo } from './explainer-video'
import { ARCH, CAPABILITIES, CTA, GOVERNANCE, META, PLATFORM, PRODUCT_ARCH, PROOF, STEPS, VECTORIZATION, VIDEO } from './lp-data'

export function AdaptiveLayerLP() {
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-neutral-900">
      <Nav locale={locale} />
      <main>
        <Hero />
        <Video />
        <Platform />
        <ProductArch />
        <Steps />
        <Capabilities />
        <Architecture />
        <Governance />
        <Proof locale={locale} />
        <Cta locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  )
}

function Nav({ locale }: { locale: string }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#fbfbfa]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
        <a href={`/${locale}/pixel`} className="flex items-center gap-2.5">
          <AnimatedMark className="h-7 w-7 flex-shrink-0" />
          <span className="text-[14px] font-semibold tracking-[-0.03em]">
            Adaptive Layer™
            <span className="ml-1.5 font-normal text-neutral-400">by PixelPulseLab</span>
          </span>
        </a>
        <div className="flex items-center gap-4">
          <a href="#video" className="hidden text-[13px] text-neutral-500 hover:text-neutral-900 sm:inline">
            Vídeo
          </a>
          <a href="#plataforma" className="hidden text-[13px] text-neutral-500 hover:text-neutral-900 md:inline">
            Plataforma
          </a>
          <a href="#arquitetura" className="hidden text-[13px] text-neutral-500 hover:text-neutral-900 md:inline">
            Arquitetura
          </a>
          <a href="#passo-a-passo" className="hidden text-[13px] text-neutral-500 hover:text-neutral-900 lg:inline">
            Passo a passo
          </a>
          <a href="#governanca" className="hidden text-[13px] text-neutral-500 hover:text-neutral-900 lg:inline">
            Governança
          </a>
          <a
            href="#cta"
            className="rounded-full bg-neutral-900 px-4 py-2 text-[13px] font-medium text-white hover:bg-neutral-800"
          >
            Falar conosco
          </a>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="border-b border-black/[0.06] px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn>
          <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            {META.eyebrow}
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <h1 className="max-w-4xl text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] text-neutral-900 sm:text-[52px]">
            {META.headline}
          </h1>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-5 max-w-2xl text-[18px] leading-relaxed text-neutral-500">
            {META.headlinePt}
          </p>
        </FadeIn>
        <FadeIn delay={0.14}>
          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-neutral-500">
            {META.lede}
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#cta"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-[14px] font-medium text-white hover:bg-neutral-800"
            >
              Falar com a PixelPulseLab
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
            <a
              href="#video"
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.1] px-6 py-3 text-[14px] font-medium text-neutral-700 hover:bg-white"
            >
              Assistir o vídeo
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function Video() {
  return (
    <section className="scroll-mt-20 border-b border-black/[0.06] bg-white px-6 py-16 sm:py-24" id="video">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            {VIDEO.eyebrow}
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <h2 className="max-w-3xl text-[28px] font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[36px]">
            {VIDEO.headline}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-neutral-500">{VIDEO.body}</p>
        </FadeIn>
        <FadeIn delay={0.14}>
          <div className="mt-10">
            <ExplainerVideo />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function Platform() {
  return (
    <section className="scroll-mt-20 border-b border-black/[0.06] bg-white px-6 py-20 sm:py-24" id="plataforma">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            {PLATFORM.eyebrow}
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <h2 className="max-w-3xl text-[28px] font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[36px]">
            {PLATFORM.headline}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-neutral-500">
            {PLATFORM.body}
          </p>
        </FadeIn>
        <FadeInStagger className="mt-12 grid gap-3 md:grid-cols-3">
          {PLATFORM.layers.map(layer => (
            <FadeInItem key={layer.n}>
              <article className="h-full rounded-2xl border border-black/[0.06] bg-[#fbfbfa] p-6">
                <p className="mb-4 text-[11px] font-mono text-neutral-400">{layer.n}</p>
                <h3 className="text-[17px] font-semibold text-neutral-900">{layer.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">{layer.detail}</p>
              </article>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}

function ProductArch() {
  return (
    <section className="scroll-mt-20 border-b border-black/[0.06] px-6 py-20 sm:py-24" id="arquitetura">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            {PRODUCT_ARCH.eyebrow}
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <h2 className="max-w-3xl text-[28px] font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[36px]">
            {PRODUCT_ARCH.headline}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-neutral-500">{PRODUCT_ARCH.body}</p>
        </FadeIn>
        <FadeIn delay={0.14}>
          <div className="mt-10">
            <ProductArchitecture />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function Steps() {
  return (
    <section className="scroll-mt-20 border-b border-black/[0.06] bg-white px-6 py-20 sm:py-24" id="passo-a-passo">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            {STEPS.eyebrow}
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <h2 className="max-w-3xl text-[28px] font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[36px]">
            {STEPS.headline}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-neutral-500">{STEPS.body}</p>
        </FadeIn>

        <ol className="mt-12 space-y-0">
          {STEPS.items.map((item, i) => (
            <FadeIn key={item.n} delay={0.04 * i}>
              <li
                className={`grid gap-4 border-black/[0.06] py-7 sm:grid-cols-[72px_1fr] sm:gap-8 ${
                  i === 0 ? 'border-t' : ''
                } border-b`}
              >
                <span className="font-mono text-[13px] text-neutral-400">{item.n}</span>
                <div>
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em] text-neutral-900">{item.title}</h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-neutral-600">{item.say}</p>
                  <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-neutral-400">
                    <span className="font-medium text-neutral-500">{STEPS.example}.</span> {item.example}
                  </p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Capabilities() {
  return (
    <section className="scroll-mt-20 border-b border-black/[0.06] px-6 py-20 sm:py-24" id="capacidades">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            {CAPABILITIES.eyebrow}
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <h2 className="max-w-3xl text-[28px] font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[36px]">
            {CAPABILITIES.headline}
          </h2>
        </FadeIn>
        <FadeInStagger className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.items.map(item => (
            <FadeInItem key={item.title}>
              <article className="h-full rounded-2xl border border-black/[0.06] bg-white p-6">
                <h3 className="text-[15px] font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">{item.detail}</p>
              </article>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}

function Architecture() {
  return (
    <section className="scroll-mt-20 border-b border-black/[0.06] bg-white px-6 py-20 sm:py-24" id="como">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            {ARCH.eyebrow}
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <h2 className="max-w-3xl text-[28px] font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[36px]">
            {ARCH.headline}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-neutral-500">{ARCH.body}</p>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="mb-3 mt-10 flex flex-wrap justify-center gap-2">
            {ARCH.sources.map(src => (
              <span
                key={src}
                className="rounded-lg border border-black/[0.07] bg-[#fbfbfa] px-3 py-2 text-[12px] font-medium text-neutral-700"
              >
                {src}
              </span>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.16}>
          <div className="mt-4">
            <HowItWorksAnimation />
          </div>
        </FadeIn>

        <div className="mt-16" id="vetorizacao">
          <FadeIn>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
              {VECTORIZATION.eyebrow}
            </p>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h3 className="max-w-3xl text-[24px] font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[30px]">
              {VECTORIZATION.headline}
            </h3>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-neutral-500">{VECTORIZATION.body}</p>
          </FadeIn>
          <FadeInStagger className="mt-10 grid gap-3 sm:grid-cols-2">
            {VECTORIZATION.when.map(item => (
              <FadeInItem key={item.title}>
                <article className="h-full rounded-2xl border border-black/[0.06] bg-[#fbfbfa] p-6">
                  <h4 className="text-[15px] font-semibold text-neutral-900">{item.title}</h4>
                  <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">{item.detail}</p>
                </article>
              </FadeInItem>
            ))}
          </FadeInStagger>
          <FadeIn delay={0.12}>
            <p className="mb-3 mt-10 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-400">
              Continua registro — não vira vetor
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {VECTORIZATION.stays.map(item => (
                <div key={item.title} className="rounded-2xl border border-black/[0.06] bg-white px-5 py-4">
                  <p className="text-[13px] font-semibold text-neutral-900">{item.title}</p>
                  <p className="mt-1 text-[12px] text-neutral-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

function Governance() {
  return (
    <section className="scroll-mt-20 border-b border-black/[0.06] px-6 py-20 sm:py-24" id="governanca">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            {GOVERNANCE.eyebrow}
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <h2 className="max-w-3xl text-[28px] font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[36px]">
            {GOVERNANCE.headline}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-neutral-500">
            {GOVERNANCE.body}
          </p>
        </FadeIn>
        <FadeInStagger className="mt-12 grid gap-3 sm:grid-cols-2">
          {GOVERNANCE.items.map(item => (
            <FadeInItem key={item.title}>
              <article className="h-full rounded-2xl border border-black/[0.06] bg-white p-6">
                <h3 className="text-[15px] font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">{item.detail}</p>
              </article>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}

function Proof({ locale }: { locale: string }) {
  return (
    <section className="scroll-mt-20 border-b border-black/[0.06] bg-white px-6 py-20 sm:py-24" id="campo">
      <div className="mx-auto max-w-[1120px]">
        <FadeIn>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            {PROOF.eyebrow}
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <h2 className="max-w-3xl text-[28px] font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[36px]">
            {PROOF.headline}
          </h2>
        </FadeIn>
        <FadeInStagger className="mt-12 grid gap-3 sm:grid-cols-3">
          {PROOF.items.map(item => (
            <FadeInItem key={item.name}>
              <article className="h-full rounded-2xl border border-black/[0.06] bg-[#fbfbfa] p-6">
                <h3 className="text-[15px] font-semibold text-neutral-900">{item.name}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">{item.detail}</p>
              </article>
            </FadeInItem>
          ))}
        </FadeInStagger>
        <FadeIn delay={0.15}>
          <a
            href={`/${locale}${CTA.orfeu}`}
            className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-neutral-900"
          >
            Abrir Executive Review Orfeu
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </a>
        </FadeIn>
      </div>
    </section>
  )
}

function Cta({ locale }: { locale: string }) {
  return (
    <section className="scroll-mt-20 px-6 py-20 sm:py-24" id="cta">
      <div className="mx-auto max-w-[720px] text-center">
        <FadeIn>
          <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
            {CTA.eyebrow}
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[36px]">
            {CTA.headline}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-neutral-500">
            {CTA.body}
          </p>
        </FadeIn>
        <FadeIn delay={0.16}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={CTA.email}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-[14px] font-medium text-white hover:bg-neutral-800"
            >
              {CTA.primary}
            </a>
            <a
              href={`/${locale}${CTA.orfeu}`}
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.1] px-6 py-3 text-[14px] font-medium text-neutral-700 hover:bg-white"
            >
              Case Orfeu
            </a>
            <a
              href={CTA.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-6 py-3 text-[14px] text-neutral-400 hover:text-neutral-900"
            >
              WhatsApp
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function SiteFooter({ locale }: { locale: string }) {
  return (
    <footer className="border-t border-black/[0.06] px-6 py-10">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4">
        <p className="text-[13px] text-neutral-500">
          <span className="font-semibold text-neutral-900">Adaptive Layer™</span>
          <span className="text-neutral-400"> · PixelPulseLab</span>
        </p>
        <div className="flex gap-5 text-[13px] text-neutral-400">
          <a href={`/${locale}`} className="hover:text-neutral-900">
            Home
          </a>
          <a href={`/${locale}/adaptive/executive-review`} className="hover:text-neutral-900">
            Orfeu
          </a>
          <a href="mailto:ze@pixelpulselab.dev" className="hover:text-neutral-900">
            Contato
          </a>
        </div>
      </div>
    </footer>
  )
}
