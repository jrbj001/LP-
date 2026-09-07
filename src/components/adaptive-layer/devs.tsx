'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { AnimatedMark } from '@/components/animated-mark'
import { FadeIn, FadeInItem, FadeInStagger } from '@/components/fade-in'
import { DEVS } from './devs-data'

export function DevsPage() {
  const locale = useLocale()

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-neutral-900">
      <nav className="border-b border-black/[0.06] bg-[#fbfbfa]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
          <a href={`/${locale}/pixel`} className="flex items-center gap-2.5">
            <AnimatedMark className="h-7 w-7 flex-shrink-0" />
            <span className="text-[14px] font-semibold tracking-[-0.03em]">
              Adaptive Layer™
              <span className="ml-1.5 font-normal text-neutral-400">devs</span>
            </span>
          </a>
          <a href={`/${locale}/pixel`} className="text-[13px] text-neutral-400 hover:text-neutral-900">
            Voltar à LP
          </a>
        </div>
      </nav>

      <main>
        {/* hero */}
        <section className="border-b border-black/[0.06] px-6 py-16 sm:py-20">
          <div className="mx-auto grid max-w-[1120px] items-center gap-10 lg:grid-cols-[1fr_460px]">
            <div>
              <FadeIn>
                <Eyebrow>{DEVS.eyebrow}</Eyebrow>
              </FadeIn>
              <FadeIn delay={0.06}>
                <h1 className="max-w-xl text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[46px]">
                  {DEVS.headline}
                </h1>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-neutral-500">{DEVS.lede}</p>
              </FadeIn>
            </div>
            <FadeIn delay={0.14}>
              <Terminal title={DEVS.install.title}>
                {DEVS.install.lines.map((l, i) => (
                  <p key={i} className={l.prompt ? 'text-white/90' : 'text-white/40'}>
                    {l.prompt && <span className="text-emerald-400/90">$ </span>}
                    {l.text}
                  </p>
                ))}
              </Terminal>
            </FadeIn>
          </div>
        </section>

        {/* quickstart */}
        <section className="border-b border-black/[0.06] bg-white px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-[1120px]">
            <FadeIn>
              <Eyebrow>{DEVS.quickstart.eyebrow}</Eyebrow>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h2 className="max-w-2xl text-[26px] font-semibold tracking-[-0.03em] sm:text-[32px]">
                {DEVS.quickstart.headline}
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-neutral-500">
                {DEVS.quickstart.body}
              </p>
            </FadeIn>
            <FadeIn delay={0.14}>
              <Quickstart />
            </FadeIn>
          </div>
        </section>

        {/* reference */}
        <section className="border-b border-black/[0.06] px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-[1120px]">
            <FadeIn>
              <Eyebrow>{DEVS.reference.eyebrow}</Eyebrow>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h2 className="max-w-2xl text-[26px] font-semibold tracking-[-0.03em] sm:text-[32px]">
                {DEVS.reference.headline}
              </h2>
            </FadeIn>
            <FadeInStagger className="mt-10 grid gap-3 sm:grid-cols-2">
              {DEVS.reference.endpoints.map(ep => (
                <FadeInItem key={ep.path}>
                  <article className="flex h-full flex-col rounded-2xl border border-black/[0.06] bg-white p-5">
                    <p className="font-mono text-[12px]">
                      <span
                        className={`mr-2 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                          ep.method === 'GET'
                            ? 'bg-sky-50 text-sky-600'
                            : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="text-neutral-700">{ep.path}</span>
                    </p>
                    <h3 className="mt-3 text-[15px] font-semibold text-neutral-900">{ep.title}</h3>
                    <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-neutral-500">{ep.detail}</p>
                    <p className="mt-3 truncate rounded-lg bg-black/[0.04] px-3 py-2 font-mono text-[11px] text-neutral-500">
                      {ep.example}
                    </p>
                  </article>
                </FadeInItem>
              ))}
            </FadeInStagger>
          </div>
        </section>

        {/* governance */}
        <section className="border-b border-black/[0.06] bg-white px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-[1120px]">
            <FadeIn>
              <Eyebrow>{DEVS.governance.eyebrow}</Eyebrow>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h2 className="max-w-2xl text-[26px] font-semibold tracking-[-0.03em] sm:text-[32px]">
                {DEVS.governance.headline}
              </h2>
            </FadeIn>
            <FadeInStagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {DEVS.governance.items.map(item => (
                <FadeInItem key={item.title}>
                  <article className="h-full rounded-2xl border border-black/[0.06] bg-[#fbfbfa] p-5">
                    <h3 className="text-[14px] font-semibold text-neutral-900">{item.title}</h3>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-neutral-500">{item.detail}</p>
                  </article>
                </FadeInItem>
              ))}
            </FadeInStagger>
          </div>
        </section>

        {/* cta */}
        <section className="bg-neutral-950 px-6 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-[720px] text-center">
            <FadeIn>
              <h2 className="text-[26px] font-semibold tracking-[-0.03em] sm:text-[32px]">
                {DEVS.cta.headline}
              </h2>
            </FadeIn>
            <FadeIn delay={0.06}>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/50">{DEVS.cta.body}</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <a
                href={DEVS.cta.href}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-medium text-neutral-900 hover:bg-neutral-200"
              >
                {DEVS.cta.label}
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </a>
            </FadeIn>
          </div>
        </section>
      </main>
    </div>
  )
}

function Quickstart() {
  const [tab, setTab] = useState(DEVS.quickstart.tabs[0].id)
  const active = DEVS.quickstart.tabs.find(t => t.id === tab) ?? DEVS.quickstart.tabs[0]

  return (
    <div className="mt-8">
      <div className="mb-3 flex flex-wrap gap-1.5">
        {DEVS.quickstart.tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-[13px] ${
              t.id === tab
                ? 'bg-neutral-900 font-medium text-white'
                : 'border border-black/[0.08] text-neutral-500 hover:border-black/[0.2] hover:text-neutral-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <Terminal title={active.file}>
        {active.code.map((line, i) => (
          <p key={i} className={lineClass(line)}>
            {line || '\u00A0'}
          </p>
        ))}
      </Terminal>
    </div>
  )
}

function lineClass(line: string) {
  if (line.startsWith('//')) return 'text-white/30'
  if (line.startsWith('curl') || line.startsWith('import') || line.startsWith('const ')) return 'text-white/90'
  if (line.startsWith('res.')) return 'text-emerald-300/80'
  return 'text-white/60'
}

function Terminal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-[#171717] shadow-[0_24px_64px_-32px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="h-[8px] w-[8px] rounded-full bg-neutral-600" />
        <span className="h-[8px] w-[8px] rounded-full bg-neutral-600" />
        <span className="h-[8px] w-[8px] rounded-full bg-neutral-600" />
        <span className="ml-2 font-mono text-[11px] text-white/30">{title}</span>
      </div>
      <div className="overflow-x-auto p-5 font-mono text-[12px] leading-[1.8]">{children}</div>
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-400">
      <span className="font-mono normal-case tracking-normal text-neutral-300">{'// '}</span>
      {children}
    </p>
  )
}
