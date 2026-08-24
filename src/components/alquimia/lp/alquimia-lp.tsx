'use client'

import { ArrowDown, ArrowRight, BrainCircuit, Compass, Sparkles, Users } from 'lucide-react'
import { useLocale } from 'next-intl'
import { FadeIn, FadeInItem, FadeInStagger } from '@/components/fade-in'

const capabilities = [
  {
    code: '01',
    title: 'Pessoas',
    text: 'Lideranças mais conscientes e equipes preparadas para sustentar novas formas de pensar e agir.',
    icon: Users,
  },
  {
    code: '02',
    title: 'Estratégia',
    text: 'Escolhas claras, prioridades coerentes e uma direção que conecta ambição à capacidade real de execução.',
    icon: Compass,
  },
  {
    code: '03',
    title: 'Prática',
    text: 'Experiência aplicada ao contexto do negócio para transformar intenção em rotina, decisão e resultado.',
    icon: Sparkles,
  },
  {
    code: '04',
    title: 'IA',
    text: 'Inteligência artificial incorporada ao trabalho como capacidade — não como ferramenta isolada ou promessa.',
    icon: BrainCircuit,
  },
]

const pillars = [
  'Propósito e direção',
  'Pessoas e cultura',
  'Sistema de gestão',
  'Melhoria contínua',
  'Inovação e crescimento',
]

const journey = [
  ['01', 'Diagnóstico', 'Ler o estado atual, suas tensões e o potencial ainda não realizado.'],
  ['02', 'Foco', 'Definir a transformação que importa e as escolhas que ela exige.'],
  ['03', 'Desenho', 'Construir capacidades, rituais e sistemas adequados ao contexto.'],
  ['04', 'Execução', 'Levar o desenho à prática junto de quem faz o negócio acontecer.'],
  ['05', 'Sustentação', 'Criar autonomia para que o novo estado permaneça e continue evoluindo.'],
]

const audiences = [
  ['Fundadores', 'Para transformar visão em uma organização capaz de realizá-la.'],
  ['Boards', 'Para ampliar a qualidade das decisões e orientar mudanças de longo prazo.'],
  ['CEOs', 'Para conduzir a empresa a um novo estado de clareza, maturidade e ação.'],
]

export function AlquimiaLP() {
  const locale = useLocale()

  return (
    <div className="alquimia-scope min-h-screen overflow-hidden bg-[#F7F5ED] font-[family-name:var(--font-alquimia-body)] text-black selection:bg-[#E0CE7A] selection:text-black">
      <AlquimiaNav locale={locale} />
      <main>
        <Hero />
        <PotentialGap />
        <Transmutation />
        <Capabilities />
        <Backbone />
        <Journey />
        <Audience />
        <Contact locale={locale} />
      </main>
      <Footer locale={locale} />
    </div>
  )
}

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span
      className={`font-[family-name:var(--font-alquimia-display)] text-[15px] tracking-[0.05em] ${
        light ? 'text-[#F7F5ED]' : 'text-black'
      }`}
    >
      Alquemia
    </span>
  )
}

function AlquimiaNav({ locale }: { locale: string }) {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#00435D]/90 text-[#F7F5ED] backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <a href={`/${locale}/alquimia`} aria-label="Alquemia — início">
          <Wordmark light />
        </a>
        <div className="flex items-center gap-3 sm:gap-6">
          <a
            href="#abordagem"
            className="hidden text-[12px] tracking-wide text-white/65 transition-colors hover:text-white md:block"
          >
            Abordagem
          </a>
          <a
            href={`/${locale}/alquimia/space`}
            className="hidden text-[12px] tracking-wide text-white/65 transition-colors hover:text-white sm:block"
          >
            Acessar space
          </a>
          <a
            href="#contato"
            className="rounded-full bg-[#E0CE7A] px-4 py-2 text-[12px] font-semibold text-[#00435D] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7F5ED]"
          >
            Iniciar conversa
          </a>
        </div>
      </div>
    </nav>
  )
}

function Grain() {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12] mix-blend-soft-light">
      <filter id="alquimia-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#alquimia-grain)" />
    </svg>
  )
}

function AlchemyField() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute -right-[15%] -top-[20%] h-[72vw] max-h-[850px] w-[72vw] max-w-[850px] rounded-full border border-[#E0CE7A]/35" />
      <div className="absolute right-[7%] top-[19%] h-[35vw] max-h-[430px] w-[35vw] max-w-[430px] rounded-full bg-[#AEADCC]/55 blur-3xl" />
      <div className="absolute -bottom-[24%] right-[16%] h-[52vw] max-h-[660px] w-[52vw] max-w-[660px] rounded-full bg-[#3A5976]/70 blur-3xl" />
      <div className="absolute -right-16 top-[38%] hidden h-64 w-56 rotate-12 border border-[#E0CE7A]/70 [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)] md:block" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" fill="none">
        <path d="M660 0C718 175 804 225 970 277C1136 329 1195 456 1160 620C1123 789 1246 842 1440 828" stroke="#E0CE7A" strokeOpacity=".32" />
        <path d="M843 0C866 144 950 192 1103 238C1280 291 1339 397 1440 502" stroke="#F7F5ED" strokeOpacity=".14" />
      </svg>
      <Grain />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#00435D] text-[#F7F5ED]">
      <AlchemyField />
      <div className="@container relative z-10 mx-auto w-full max-w-[1280px] px-5 pb-14 pt-32 sm:px-8 md:pb-20">
        <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E0CE7A]">
          Estratégia · Pessoas · Prática · Inteligência
        </p>
        <h1 className="font-[family-name:var(--font-alquimia-display)] text-[clamp(1.75rem,9.5cqw,7rem)] leading-[0.94] tracking-[0.01em]">
          Transformando
          <br />
          potenciais em
          <br />
          capacidades.
        </h1>
        <div className="mt-12 flex md:justify-end">
          <div className="max-w-sm border-l border-[#E0CE7A]/45 pl-5">
            <p className="text-[15px] font-light leading-relaxed text-white/72">
              Agimos no núcleo do negócio para construir estados mais maduros, conscientes e capazes de
              permanecer.
            </p>
            <a href="#potencial" className="mt-7 inline-flex items-center gap-2 text-[12px] text-[#E0CE7A] hover:text-white">
              Explorar a transformação
              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`mb-5 text-[10px] font-bold uppercase tracking-[0.26em] ${dark ? 'text-[#E0CE7A]' : 'text-[#3A5976]'}`}>
      {children}
    </p>
  )
}

function PotentialGap() {
  return (
    <section id="potencial" className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <FadeIn>
          <SectionLabel>Potencial ≠ capacidade</SectionLabel>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
            <h2 className="font-[family-name:var(--font-alquimia-display)] text-[clamp(2rem,4.8vw,4.4rem)] leading-[1.08]">
              Toda empresa possui mais potencial do que é capaz de realizar.
            </h2>
            <div className="self-end">
              <p className="text-[17px] font-light leading-[1.7] text-black/65">
                Potencial é energia armazenada. Capacidade é o que torna essa energia disponível em decisões,
                comportamentos e resultados.
              </p>
              <p className="mt-5 text-[17px] font-light leading-[1.7] text-black/65">
                O intervalo entre os dois não se resolve com mais velocidade. Exige uma transformação no modo
                como pessoas e negócio pensam, operam e evoluem.
              </p>
            </div>
          </div>
        </FadeIn>
        <div className="mt-16 flex items-center gap-4" aria-hidden="true">
          <div className="h-3 w-3 rounded-full bg-[#E0CE7A]" />
          <div className="h-px flex-1 bg-gradient-to-r from-[#E0CE7A] via-[#AEADCC] to-[#00435D]" />
          <div className="h-8 w-8 rounded-full border border-[#00435D]" />
        </div>
      </div>
    </section>
  )
}

function Transmutation() {
  return (
    <section id="abordagem" className="relative bg-black py-24 text-[#F7F5ED] sm:py-32 lg:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(174,173,204,0.22),transparent_30%),radial-gradient(circle_at_20%_90%,rgba(58,89,118,0.35),transparent_35%)]" />
      <Grain />
      <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8">
        <FadeIn>
          <SectionLabel dark>Transmutação, não aceleração</SectionLabel>
          <div className="@container max-w-5xl">
            <blockquote className="font-[family-name:var(--font-alquimia-display)] text-[clamp(1.6rem,9.5cqw,5.8rem)] leading-[1.04]">
              Não aceleramos empresas.
              <span className="mt-3 block text-[#E0CE7A]">Transformamos potencial em capacidade.</span>
            </blockquote>
          </div>
        </FadeIn>
        <FadeIn className="mt-16 grid gap-8 border-t border-white/15 pt-8 md:grid-cols-2 md:gap-24">
          <p className="text-[18px] font-light leading-relaxed text-white/75">
            Acelerar é fazer o estado atual andar mais rápido. Transmutar é agir no núcleo para chegar a outro
            estado de maturidade, clareza e ação.
          </p>
          <p className="text-[18px] font-light leading-relaxed text-white/75">
            Toda mudança real começa com pessoas. É por elas que novas capacidades se tornam naturais — e
            permanecem depois que o processo termina.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}

function Capabilities() {
  return (
    <section className="bg-[#E0CE7A] py-24 sm:py-32">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <FadeIn className="mb-14 grid gap-6 md:grid-cols-2">
          <div>
            <SectionLabel>Quatro capacidades</SectionLabel>
            <h2 className="font-[family-name:var(--font-alquimia-display)] text-[clamp(2rem,4vw,3.5rem)] leading-tight">
              Uma transformação inteira.
            </h2>
          </div>
          <p className="max-w-lg self-end text-[16px] leading-relaxed text-black/65 md:justify-self-end">
            Combinamos disciplinas que costumam operar separadas para construir um novo estado do negócio.
          </p>
        </FadeIn>
        <FadeInStagger className="grid border-l border-t border-black/20 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map(({ code, title, text, icon: Icon }) => (
            <FadeInItem key={title}>
              <article className="flex min-h-[310px] flex-col border-b border-r border-black/20 p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-alquimia-display)] text-[11px]">{code}</span>
                  <Icon className="h-5 w-5" strokeWidth={1.3} aria-hidden="true" />
                </div>
                <div className="mt-auto">
                  <h3 className="font-[family-name:var(--font-alquimia-display)] text-xl">{title}</h3>
                  <p className="mt-4 text-[14px] font-light leading-relaxed text-black/65">{text}</p>
                </div>
              </article>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}

function Backbone() {
  return (
    <section className="relative bg-[#AEADCC] py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <FadeIn className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="@container min-w-0">
            <SectionLabel>Backbone · preview</SectionLabel>
            <h2 className="font-[family-name:var(--font-alquimia-display)] text-[clamp(1.75rem,10cqw,3.4rem)] leading-[1.06]">
              A arquitetura da transformação.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-black/60">
              Um modelo em desenvolvimento para tornar visíveis as capacidades que sustentam a evolução.
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">
              Cinco pilares
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {pillars.map((pillar, index) => (
                <div
                  key={pillar}
                  className={`flex items-baseline gap-4 border border-black/20 bg-[#F7F5ED]/30 px-5 py-4 backdrop-blur-sm ${
                    index === pillars.length - 1 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <span className="font-[family-name:var(--font-alquimia-display)] text-[11px] text-black/45">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] font-semibold leading-snug">{pillar}</span>
                </div>
              ))}
            </div>

            <p className="mt-9 text-[10px] font-bold uppercase tracking-[0.24em] text-black/45">
              Dois motores
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <div className="border-t-2 border-[#E0CE7A] bg-[#00435D] px-5 py-5 text-[#F7F5ED]">
                <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[#E0CE7A]">
                  Motor 01
                </span>
                <span className="mt-2.5 block font-[family-name:var(--font-alquimia-display)] text-[15px] leading-snug">
                  Management
                </span>
              </div>
              <div className="border-t-2 border-[#AEADCC] bg-black px-5 py-5 text-[#F7F5ED]">
                <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[#AEADCC]">
                  Motor 02
                </span>
                <span className="mt-2.5 block font-[family-name:var(--font-alquimia-display)] text-[15px] leading-snug">
                  Continuous Improvement
                </span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function Journey() {
  return (
    <section className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <FadeIn className="mb-14 max-w-3xl">
          <SectionLabel>A jornada</SectionLabel>
          <h2 className="font-[family-name:var(--font-alquimia-display)] text-[clamp(2rem,4.5vw,3.8rem)] leading-tight">
            Do potencial ao novo estado.
          </h2>
        </FadeIn>
        <div className="border-t border-black/25">
          {journey.map(([number, title, text]) => (
            <FadeIn key={number}>
              <article className="grid gap-4 border-b border-black/25 py-7 sm:grid-cols-[70px_0.6fr_1fr] sm:items-center">
                <span className="font-[family-name:var(--font-alquimia-display)] text-[11px] text-[#3A5976]">{number}</span>
                <h3 className="font-[family-name:var(--font-alquimia-display)] text-lg">{title}</h3>
                <p className="max-w-xl text-[14px] font-light leading-relaxed text-black/60">{text}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function Audience() {
  return (
    <section className="bg-[#3A5976] py-24 text-[#F7F5ED] sm:py-32">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <FadeIn className="mb-14">
          <SectionLabel dark>Para quem conduz</SectionLabel>
          <div className="@container max-w-3xl">
            <h2 className="font-[family-name:var(--font-alquimia-display)] text-[clamp(1.6rem,9.2cqw,3.8rem)] leading-tight">
              Transformação para quem carrega a responsabilidade do próximo estado.
            </h2>
          </div>
        </FadeIn>
        <FadeInStagger className="grid gap-px bg-white/20 md:grid-cols-3">
          {audiences.map(([title, text]) => (
            <FadeInItem key={title}>
              <article className="min-h-60 bg-[#3A5976] p-7">
                <div className="mb-16 h-4 w-4 rounded-full border border-[#E0CE7A]" aria-hidden="true" />
                <h3 className="font-[family-name:var(--font-alquimia-display)] text-xl">{title}</h3>
                <p className="mt-4 text-[14px] font-light leading-relaxed text-white/65">{text}</p>
              </article>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  )
}

function Contact({ locale }: { locale: string }) {
  return (
    <section id="contato" className="relative overflow-hidden bg-[#00435D] py-24 text-[#F7F5ED] sm:py-36">
      <div className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full border border-[#E0CE7A]/30" />
      <div className="absolute -bottom-48 right-16 h-[420px] w-[420px] rounded-full bg-[#AEADCC]/20 blur-3xl" />
      <Grain />
      <FadeIn className="relative mx-auto max-w-[1180px] px-5 sm:px-8">
        <SectionLabel dark>Próximo estado</SectionLabel>
        <div className="@container max-w-4xl">
          <h2 className="font-[family-name:var(--font-alquimia-display)] text-[clamp(1.6rem,9.5cqw,5.7rem)] leading-[1.05]">
            Qual potencial a sua organização ainda não consegue realizar?
          </h2>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="mailto:ze@pixelpulselab.dev?subject=Alquemia%20%E2%80%94%20conversa%20inicial"
            className="inline-flex items-center gap-2 rounded-full bg-[#E0CE7A] px-6 py-3.5 text-[13px] font-semibold text-[#00435D] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Conversar com a Alquemia
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={`/${locale}/alquimia/space`}
            className="inline-flex items-center rounded-full border border-white/25 px-6 py-3.5 text-[13px] text-white/80 transition-colors hover:border-white/60 hover:text-white"
          >
            Acessar space
          </a>
        </div>
      </FadeIn>
    </section>
  )
}

function Footer({ locale }: { locale: string }) {
  return (
    <footer className="bg-black text-[#F7F5ED]">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-8 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <Wordmark light />
          <p className="mt-2 text-[11px] text-white/40">Transformando potenciais em capacidades.</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-white/45">
          <span>Alquemia × PixelPulseLab</span>
          <a href={`/${locale}`} className="transition-colors hover:text-[#E0CE7A]">
            PixelPulseLab
          </a>
          <a href="mailto:ze@pixelpulselab.dev" className="transition-colors hover:text-[#E0CE7A]">
            Contato
          </a>
        </div>
      </div>
    </footer>
  )
}
